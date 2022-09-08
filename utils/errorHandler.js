const { INPUT_DATA_UNVALID_CODE, NOT_FOUND_CODE, DEFAULT_ERROR_CODE } = require('./httpCodes');

module.exports.handleUserValidationError = (error, responce) => {
  if (error._message === 'user validation failed' || error._message === 'Validation failed') {
    responce.status(INPUT_DATA_UNVALID_CODE).send({ message: 'Ошибка входных данных', ...error });
  } else {
    responce.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка', ...error });
  }
};

module.exports.handleUserNotFoundError = (id, responce) => {
  responce.status(NOT_FOUND_CODE).send({ message: `Пользователь с таким _id ${id} не найден` });
};

module.exports.handleCardValidationError = (error, responce) => {
  if (error._message === 'card validation failed' || error._message === 'Validation failed') {
    responce.status(INPUT_DATA_UNVALID_CODE).send({ message: 'Ошибка входных данных', ...error });
  } else {
    responce.status(DEFAULT_ERROR_CODE).send({ message: 'Произошла ошибка', ...error });
  }
};

module.exports.handleObjectIDIsNotValidError = (error, responce) => {
  responce.status(INPUT_DATA_UNVALID_CODE).send({ message: 'Произошла ошибка', ...error });
};

module.exports.handleCardNotFoundError = (id, responce) => {
  responce.status(NOT_FOUND_CODE).send({ message: `Карточка с таким _id ${id} не найдена` });
};

module.exports.handleCardNotFoundError = (id, responce) => {
  responce.status(NOT_FOUND_CODE).send({ message: `Карточка с таким _id ${id} не найдена` });
};
