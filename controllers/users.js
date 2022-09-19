const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SUCCESS_CODE } = require('../utils/httpCodes');
const NotFoundError = require('../errors/NotFoundError');
const InvalidDataError = require('../errors/InvalidDataError');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'myUnicPassword',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((error) => {
      next(error);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(SUCCESS_CODE).send(users))
    .catch(() => next(new Error('Ошибка на сервере')));
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((users) => res.status(SUCCESS_CODE).send(users))
    .catch(() => next(new Error('Ошибка на сервере')));
};

module.exports.getUserByID = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else {
        res.status(SUCCESS_CODE).send(user);
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
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
      password: hash,
      name,
      about,
      avatar,
    }))
    .then((user) => res.status(SUCCESS_CODE).send(user))
    .catch(() => next(new Error('Ошибка на сервере')));
};

module.exports.changeUserInfo = (req, res, next) => {
  const { name: newName, about: newAbout } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name: newName, about: newAbout },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
    (err, user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.status(SUCCESS_CODE).send(user);
      }
    },
  );
};

module.exports.changeUserAvatar = (req, res, next) => {
  const { avatar: newAvatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar: newAvatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
    (err, user) => {
      if (err && err._message === 'Validation failed') {
        next(new InvalidDataError(err));
      } else if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      } else {
        res.status(SUCCESS_CODE).send(user);
      }
    },
  );
};
