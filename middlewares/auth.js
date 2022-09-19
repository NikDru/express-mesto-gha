const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError('Заголовок с токеном не найден или некорректен');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'myUnicPassword');
  } catch (err) {
    throw new NotAuthorizedError('Токен не валиден');
  }

  req.user = payload;

  next();
};
