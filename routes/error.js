/* eslint-disable no-unused-vars */
const router = require('express').Router();
const NotFoundError = require('../errors/404-NotFoundError');

router.all('*', (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
});

module.exports = router;
