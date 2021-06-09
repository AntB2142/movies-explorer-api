const router = require('express').Router();
const userRouter = require('./users');
const movieRouter = require('./movies');
const errorRouter = require('./error');
const { requestLogger, errorLogger } = require('../middlewares/logger');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { signupValidation, signinValidation } = require('../middlewares/validation');

router.use(requestLogger);

router.post('/signup', signupValidation, createUser);

router.post('/signin', signinValidation, login);

router.use(auth);
router.use(errorLogger);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.use('/', errorRouter);
module.exports = router;
