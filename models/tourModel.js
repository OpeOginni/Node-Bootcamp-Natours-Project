const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

// Making a Schema...describing it and validating the data
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'], // This here is a validator...You know a bit about that working with JOI
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal than 40 characters'],
      minLength: [
        10,
        'A tour name must have more than or equal than 40 characters',
      ],
      //validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      }, // When the user has fine grained choices
    },
    ratingsAverage: {
      type: Number,
      default: 4.5, // Setting the default
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0, // Setting the default
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      // Creating our own custom Validator
      type: Number,
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation
          return val < this.price;
        },
        message: 'Discount Price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a Cover Image'],
    },
    images: [String], // An array of strings
    createdAt: {
      type: Date,
      default: Date.now(), // It gives us in Milliseconds but Mongo Changes it to normal date string
      select: false, // This prevents the createdAt property from showing in the client output
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON for goespacial datatype
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      addresss: String,
      description: String,
    },
    locations: [
      // This is an embedded data
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        addess: String,
        description: String,
        day: Number,
      },
    ], // Establishing references in Mongoose
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }], //ref shows the data it is referencing
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs before the .save() method and the .create() method
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// This middle ware takes in the user IDs specified in the guides attribute and returns the whole User Doument
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
  // /^find/ means that all the strings that start with find
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });

  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  // adding populate to the query populates it with a particular attribute that is referenced
  this.populate({
    // this points to the current query....so we just add the method we want
    path: 'guides',
    select: '-__v -passwordChangedAt', // using select chooses which attributes you want to be returned in the response
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

// AGGREATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this);
  next();
});

// Model that needs the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
