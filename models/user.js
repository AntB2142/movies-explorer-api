/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, 'Обязательно для заполнения'],
  },
  email: {
    type: String,
    required: [true, 'Обязательно для заполнения'],
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Неверный формат e-mail',
    },
  },
  password: {
    type: String,
    required: [true, 'Обязательно для заполнения'],
    minlength: 3,
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
