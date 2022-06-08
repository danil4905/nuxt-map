'use strict';

const {Router} = require('express');
const {ResponseStatus} = require('../const');
const authMiddleware = require('../middleware/auth');
const authClientMiddleware = require('../middleware/auth-users');

module.exports = (app, PlaceDataService) => {
  const router = new Router();
  app.use('/places', router);

  /**
   * Get items by city and floor
   */
  router.get('/by-city', async (req, res) => {
    const {floor, city} = req.query;

    try {
      const items = await PlaceDataService.getByCityId(city, floor);

      res.send(items)
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  /**
   * Get all items
   */
  router.get('/', async (req, res) => {
    try {
      const items = await PlaceDataService.getAll();
      res.send(items);
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e);
    }
  });

  /**
   * create place
   */
  router.post('/', async (req, res) => {
    try {
      const {floor, cityId, coords, userId} = req.body;
      const item = await PlaceDataService.create({floor, cityId, coords, userId});

      res.send(item);
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e);
    }
  });


  /**
   * Get by id
   */
  router.get('/:id', authClientMiddleware, async (req, res) => {
    try {
      const item = await PlaceDataService.getById(req.params.id);

      if(item) {
        res.send(item);
      } else {
        res
          .status(ResponseStatus.NOT_FOUND)
          .send('Item not found');
      }
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  router.put('/:id', authClientMiddleware, async (req, res) => {
    try {
      const {floor, cityId, coords, userId} = req.body;
      const placeId = req.params.id;
      await PlaceDataService.update(placeId,{floor, cityId, coords, userId});

      res.send('success');
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e);
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      await PlaceDataService.drop(req.params.id);

      res.send('success');
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e);
    }
  });
};
