const mongoose = require('mongoose');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
});

cardSchema.statics.findByIdAndCheckCardOwner = function findByIdAndCheckCardOwner(cardId, userId) {
  return this.findOne({ cardId })
    .then((card) => {
      if (!card) {
        return Promise.reject(new NotFoundError());
      }
      if (card.owner !== userId) {
        return Promise.reject(new ForbiddenError('Вы не имеет прав на редактирование этой карточки'));
      }
      return card;
    });
};

module.exports = mongoose.model('card', cardSchema);
