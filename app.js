const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOT_FOUND_CODE } = require('./utils/httpCodes');

// Слушаем 3000 порт
const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6313557db510e703dc2855a5', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: 'Конечная точка не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
