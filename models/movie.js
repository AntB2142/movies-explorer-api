/* eslint-disable linebreak-style */
const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  director: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  duration: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  year: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  description: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
  },
  image: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
    },
  },
  trailer: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
    },
  },
  thumbnail: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (url) => validator.isURL(url),
    },
  },
  owner: {
    type: mongoose.ObjectId,
    required: [true, 'Поле должно быть заполнено'],
  },
  movieId: {
    type: Number,
    required: [true, 'Поле должно быть заполнено'],
  },
  nameRU: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (nameRU) => /[\dа-я\sё]+$/gi.test(nameRU),
      message: 'Название должно быть написано на русском',
    },
  },
  nameEN: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator: (nameRU) => /\w+$/i.test(nameRU),
      message: 'Название должно быть написано на английском',
    },
  },
});

module.exports = mongoose.model('movie', movieSchema);
