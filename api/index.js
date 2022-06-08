const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const usersRouter = require('./routes/users-router');
const questionRouter = require('./routes/question-router');
const citiesRouter = require('./routes/city-router');
const placesRouter = require('./routes/places-router');
const QuestionDataService = require('./data-services/question-service');
const CityService = require('./data-services/city-service');
const PlaceDataService = require('./data-services/place-service');
const UserDataService = require('./data-services/user-data-service');
const defineModels = require('../models/index');
const sequelize = require('./libs/sequelize');

(async() => {
  try {
    defineModels(sequelize);
    //await sequelize.authenticate(); TODO исправить баг при сборке
    console.log('Connection successful');
  } catch (e) {
    console.error('Connection error ' + e.message);
    process.exit()
  }

  /**
   * Add body parsers
   */
  const jsonParser = bodyParser.json()
  app.use(jsonParser);

  usersRouter(app, new UserDataService(sequelize));
  questionRouter(app, new QuestionDataService(sequelize));
  citiesRouter(app, new CityService(sequelize));
  placesRouter(app, new PlaceDataService(sequelize));
})()

module.exports = app;
