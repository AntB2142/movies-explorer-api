const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/user');

const AuthError = require('../errors/401-AuthError');
const ConflictError = require('../errors/409-ConflictError');
const NotFoundError = require('../errors/404-NotFoundError');
const ValidationError = require('../errors/400-ValidationError');

dotenv.config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      email,
      password: hash,
    }))
    .then((user) => res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'MongoError' || err.code === 11000) {
        throw new ConflictError(err.message);
      }

      throw new ValidationError(err.message);
    })
    .catch(next);
};

function errorHandling(err) {
  if (err.message === 'ValidationError' || err.name === 'CastError') {
    throw new NotFoundError(err.message);
  } else {
    throw new ValidationError(err.message);
  }
}

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new Error('ValidationError'))
    .then((user) => res.send(user))
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(new Error('ValidationError'))
    .then((user) => res.send(user))
    .catch((err) => errorHandling(err))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Передан неверный логин или пароль'));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Передан неверный логин или пароль'));
        }

        return user;
      });
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key'}`, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      throw new AuthError(err.message);
    })
    .catch(next);
};
