const Movie = require('../models/movie');
const NotFoundError = require('../errors/404-NotFoundError');
const AuthError = require('../errors/401-AuthError');
const ValidationError = require('../errors/400-ValidationError');

module.exports.getMovies = (req, res, next) => {
  const userId = req.user._id;
  Movie.find({ owner: userId })
    .then((movie) => res.send(movie))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError(err.mesage));
      }
      next(err);
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  Movie.findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм не найден');
    })
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        throw new AuthError(
          'Это не ваш фильм. Вы не можете удалять чужие',
        );
      }

      Movie.findByIdAndRemove(movieId)
        .then((movieToRemove) => res.send(movieToRemove))
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    })
    .catch(next);
};
