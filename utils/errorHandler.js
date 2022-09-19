const { INPUT_DATA_UNVALID_CODE, NOT_FOUND_CODE, DEFAULT_ERROR_CODE } = require('./httpCodes');

module.exports.handleUserValidationError = (error, res) => {
  if (error._message === 'user validation failed' || error._message === 'Validation failed') {
    res.status(INPUT_DATA_UNVALID_CODE).send({ message: 'Ошибка входных данных', ...error });
  } else {
    res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
  }
};

module.exports.handleUserNotFoundError = (id, res) => {
  res.status(NOT_FOUND_CODE).send({ message: `Пользователь с таким _id ${id} не найден` });
};

module.exports.handleCardValidationError = (error, res) => {
  if (error._message === 'card validation failed' || error._message === 'Validation failed') {
    res.status(INPUT_DATA_UNVALID_CODE).send({ message: 'Ошибка входных данных', ...error });
  } else {
    res.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка' });
  }
};

module.exports.handleObjectIDIsNotValidError = (error, res) => {
  res.status(INPUT_DATA_UNVALID_CODE).send({ message: error });
};

module.exports.handleCardNotFoundError = (id, res) => {
  res.status(NOT_FOUND_CODE).send({ message: `Карточка с таким _id ${id} не найдена` });
};
