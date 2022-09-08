const mongoose = require('mongoose');
const Card = require('../models/card');
const { handleCardValidationError, handleCardNotFoundError, handleObjectIDIsNotValidError } = require('../utils/errorHandler');
const { DEFAULT_ERROR_CODE, SUCCESS_CODE, NOT_FOUND_CODE } = require('../utils/httpCodes');

const checkErrors = (err, card, responce, id) => {
  if (err) {
    handleCardValidationError(err, responce);
  } else if (!card) {
    handleCardNotFoundError(id, responce);
  }
};

const checkCardFound = (card, responce, id) => {
  if (!card) {
    handleCardNotFoundError(id, responce);
  } else {
    responce.status(SUCCESS_CODE).send(card);
  }
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(SUCCESS_CODE).send(cards))
    .catch(() => res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((e) => handleCardValidationError(e, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(
    req.params.cardId,
    (err, deletedCard) => {
      if (!deletedCard) {
        res.status(NOT_FOUND_CODE).send({ message: `Карточки с таким id ${req.params.cardId} не найдено` });
      } else {
        res.status(SUCCESS_CODE).send({ });
      }
    },
  );
/*     .then((card) => res.send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' })); */
};

module.exports.setLike = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    handleObjectIDIsNotValidError(`Параметр ${req.user._id} не является валидным ObjectID`);
  } else if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    handleObjectIDIsNotValidError(`Параметр ${req.params.cardId} не является валидным ObjectID`);
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => checkCardFound(card, res, req.params.cardId))
      .catch((err) => checkErrors(err, null, res, req.params.cardId));
  }
};

module.exports.deleteLike = (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
    handleObjectIDIsNotValidError(`Параметр ${req.user._id} не является валидным ObjectID`);
  } else if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    handleObjectIDIsNotValidError(`Параметр ${req.params.cardId} не является валидным ObjectID`);
  } else {
    Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, // убрать _id из массива
      { new: true },
    )
      .populate(['owner', 'likes'])
      .then((card) => checkCardFound(card, res, req.params.cardId))
      .catch((err) => checkErrors(err, null, res, req.params.cardId));
  }
};
