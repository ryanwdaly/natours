const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// name, email, photo, password, passwordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A name must be provided'],
  },
  email: {
    type: String,
    required: [true, 'An email must be provided'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Provide a valid email'],
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },  
  password: {
    type: String,
    required: [true, 'A password must be provided'],
    minlength: 8,
    select: false,
    validate: {
      validator: function (el) {
        return (el = this.password);
      },
    },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
  },
  passwordChangedAt: Date,
});

// MIDDLEWARE

userSchema.pre('save', async function (next) {
  // only run if password was actually modified
  if (!this.isModified('password')) return next();

  // hash the pastword with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
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

    console.log(changedTimestamp, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }

  // False means not changed
  return false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
