'use strict';
const { Model, DataTypes } = require('sequelize');

class Question extends Model {}

const define = (sequelize) => {
  Question.init({
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Question'
  });

  return Question;
}

module.exports = define;
