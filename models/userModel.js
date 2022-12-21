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

  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password must be more than 6 characters'],
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

const User = mongoose.model('User', userSchema);

module.exports = User;
