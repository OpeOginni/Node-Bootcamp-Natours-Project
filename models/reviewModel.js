// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');
const Tour = require('./tourModel');
const User = require('./userModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      // required: [true, 'Rating must have a review'],
      // default: 4.5, // Setting the default
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      //   required: [true, 'Date must be Provided'],
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId, // Method is ObjectId
      ref: Tour,
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: User,
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true }, // Shows attributes that are calculated but not stored in the databases
    toObject: { virtuals: true },
  }
);

// QUERY MIDDLEWARE

// Populate both the tour attribute and user attribute
reviewSchema.pre(/^find/, function (next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name',
  //   }).populate({ path: 'user', select: 'name photo' });

  this.populate({ path: 'user', select: 'name photo' });

  next();
});

// Dont forget to export the Model
const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
