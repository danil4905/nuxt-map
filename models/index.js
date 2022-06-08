'use strict';

const defineQuestion = require('./question');
const defineCity = require('./city');
const definePlace = require('./palce');
const defineUser = require('./user');
const defineCityQuestions = require('./city-questions');

const define = (sequelize) => {
  const Question = defineQuestion(sequelize);
  const City = defineCity(sequelize);
  const Place = definePlace(sequelize);
  const User = defineUser(sequelize);
  const CityQuestions = defineCityQuestions(sequelize);

  /**
   * Add relationships
   */

  Question.belongsToMany(City, {through: CityQuestions});
  City.belongsToMany(Question, {through: CityQuestions});

  City.hasMany(Place, {
    foreignKey: 'cityId',
    onDelete: 'cascade'
  });

  Place.belongsTo(City,{
    foreignKey: 'cityId'
  });

  User.hasMany(Place, {
    foreignKey: 'userId',
    onDelete: 'cascade'
  });

  Place.belongsTo(User, {
    foreignKey: 'userId'
  });

  return {Question, City, Place, User};
}

module.exports = define;
