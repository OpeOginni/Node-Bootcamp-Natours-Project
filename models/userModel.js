const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Create a schema
// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    unique: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your Email'],
    unigue: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'], // Using a validator package
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password must be more than 6 characters'],
    select: false, // This prevents the attribute from showing up in a get Request
  },
  passwordConfirm: {
    // Need to confirm if it is the same as the other one
    type: String,
    required: [true, 'Please canfirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password; // abc === abc {True will be returned}
      },
      message: 'Passwords are not the same',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
});

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next(); // This says that If the password is not being modified..return the next function and move to the next middleware

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined;

  // Always end a middleware with the next() function
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  // This middleware ensures that onl active users are returned in any find methods
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changes
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken; // Here we return the original reset token
};

const User = mongoose.model('User', userSchema);

module.exports = User;
