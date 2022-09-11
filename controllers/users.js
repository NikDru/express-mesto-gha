const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { handleUserValidationError, handleUserNotFoundError, handleObjectIDIsNotValidError } = require('../utils/errorHandler');
const { DEFAULT_ERROR_CODE, SUCCESS_CODE } = require('../utils/httpCodes');

const checkErrors = (err, user, responce, id) => {
  if (err) {
    handleUserValidationError(err, responce);
  } else if (!user) {
    handleUserNotFoundError(id, responce);
  } else {
    responce.status(SUCCESS_CODE).send(user);
  }
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password);
    })
    .then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      // аутентификация успешна
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS_CODE).send(users))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserByID = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    handleObjectIDIsNotValidError(`Параметр ${req.params.userId} не является валидным ObjectID`, res);
  } else {
    User.findById(req.params.userId)
      .then((user) => checkErrors(null, user, res, req.params.userId))
      .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
  }
};

module.exports.createUser = (req, res) => {
  const {
    email,
    password,
    name,
    about,
    avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email,
      hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.send(user))
    .catch((err) => handleUserValidationError(err, res));
};

module.exports.changeUserInfo = (req, res) => {
  const { name: newName, about: newAbout } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: newName, about: newAbout },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
    (err, user) => checkErrors(err, user, res, req.user._id),
  );
};

module.exports.changeUserAvatar = (req, res) => {
  const { avatar: newAvatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: newAvatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
    (err, user) => checkErrors(err, user, res, req.user._id),
  );
};
