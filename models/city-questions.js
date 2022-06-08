'use strict';
const {
  Model,
  DataTypes
} = require('sequelize');

class CityQuestions extends Model {

}

module.exports = (sequelize) => CityQuestions.init({
  QuestionId: {
    type: DataTypes.INTEGER,
    allowNUll: false,
    references: {
      model: sequelize.models.Question,
      key: 'id'
    }
  },
  CityId: {
    type: DataTypes.INTEGER,
    allowNUll: false,
    references: {
      model: sequelize.models.City,
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'CityQuestions',
});
