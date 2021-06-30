const router = require('express').Router();
const { createMovieValidation, movieValidation } = require('../middlewares/validation');

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', createMovieValidation, createMovie);

router.delete('/:movieId', movieValidation, deleteMovie);

module.exports = router;
