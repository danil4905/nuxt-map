'use strict';

const {Router} = require('express');
const {ResponseStatus} = require('../const');
const pageParamMiddleware = require('../middleware/check-page-params');
const checkCityParams = require('../middleware/check-city-param');
const authClientMiddleware = require('../middleware/auth-users');


module.exports = (app, QuestionDataService) => {
  const router = new Router();
  app.use('/questions', router);

  router.get('/by-city', checkCityParams,
    async (req, res) => {

      const {city} = req.query;

    try {
      const questions = await QuestionDataService.getAllByCityId(city);
      res.send(questions);
    } catch (e) {
      console.error(e);
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  router.get('/', pageParamMiddleware,
    async (req, res) => {

      const {page} = req.query;

      try {
        const questions = await QuestionDataService.getAll(page);
        res.send(questions);
      } catch (e) {
        console.error(e);
        res
          .status(ResponseStatus.SERVER_ERROR)
          .send(e.message);
      }
    });

  router.get('/:id', async (req, res) => {
    try {
      const item = await QuestionDataService.getById(req.params.id);

      if (item) {
        res.send(item);
      } else {
        res
          .status(ResponseStatus.NOT_FOUND)
          .send('item not found');
      }
    } catch (e) {
      console.error(e);
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });
  router.put('/:id', authClientMiddleware, async (req, res) => {
    try {
      const { title,icon, body } = req.body;
      const questionId = req.params.id;
      console.log(req.body)
      await QuestionDataService.update(questionId, { title, icon, body });

      res.send(req.body);
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });
}
