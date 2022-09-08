const router = require('express').Router();
const {
  getUsers, getUserByID, createUser, changeUserInfo, changeUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserByID);

router.post('/', createUser);

router.patch('/me', changeUserInfo);

router.patch('/me/avatar', changeUserAvatar);

module.exports = router;
