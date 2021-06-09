const router = require('express').Router();
const { updateUserValidation } = require('../middlewares/validation');

const {
  getUserMe,
  updateUser,
} = require('../controllers/users');

router.get('/me', getUserMe);

router.patch('/me', updateUserValidation, updateUser);

module.exports = router;
