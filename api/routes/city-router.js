'use strict'

const {Router} = require('express');
const {ResponseStatus} = require('../const');
const authMiddleware = require('../middleware/auth');

module.exports = (app, CityDataService) => {
  const router = new Router();
  app.use('/cities', router);

  router.get('/', async (req, res) => {
      try {
        const cities = await CityDataService.getAll();

        res.send(cities)
      } catch (e) {
        console.error(e);
        res
          .status(ResponseStatus.SERVER_ERROR)
          .send(e.message);
      }
    }
  )

  router.get('/:id', async (req, res) => {
    try {
      const item = await CityDataService.getById(req.params.id);

      if (item) {
        res.send(item);
      } else {
        res
          .status(ResponseStatus.NOT_FOUND)
          .send('item not found');
      }
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    try {
      const item = await CityDataService.update(req.params.id, req.body);

      res.send(item);
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  router.post('/', authMiddleware, async (req, res) => {
    try {
      const item = await CityDataService.create(req.body);

      res.send(item);
    } catch (e) {
      console.error(e);
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });
}
