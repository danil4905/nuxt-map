'use strict';

const {ResponseStatus} = require('../const');
const { Router } = require('express');
import { isAuth } from "../middleware/auth";
const authClientMiddleware = require('../middleware/auth-users');

module.exports = (app, UserDataService) => {
  const router = new Router();
  app.use('/users', router);

  router.get('/', isAuth, async (req, res) => {
    try {
      const items = await UserDataService.getAll();

      res.send(items);
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message)
    }
  });

  router.post('/', authClientMiddleware, async (req, res) => {
    try {
      const {first_name, last_name, username, email} = req.body.user;
      const item = await UserDataService.create({
        firstName: first_name,
        lastName: last_name,
        username,
        email
      });

      res
        .status(ResponseStatus.CREATE)
        .send(item);
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  router.get('/search', async (req, res) => {
    try {
      const {lastName, firstName} = req.query;
      if(lastName) {
        const items = await UserDataService.search(lastName, firstName);
        res.send(items);
      } else {
        res
          .status(ResponseStatus.BAD_REQUEST)
          .send();
      }
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });
  router.get('/searchByName', async (req, res) => {
    try {
      const {lastName, firstName} = req.query;
      if(lastName) {
        const items = await UserDataService.searchByName(lastName, firstName);
        res.send(items);
      } else {
        res
          .status(ResponseStatus.BAD_REQUEST)
          .send();
      }
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  router.get('/:name', authClientMiddleware, async (req, res) => {
    try {
      const item = await UserDataService.getByName(req.params.name);

      if(item) {
        res.send(item);
      } else {
        res
          .status(ResponseStatus.NOT_FOUND)
          .send('not found')
      }
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message)
    }
  });

  router.put('/:name', authClientMiddleware, async (req, res) => {
    try {
      const {first_name, last_name, username, email,isInit} = req.body;
      await UserDataService.update(req.params.name, {
        firsName: first_name,
        lastName: last_name,
        username,
        email,
        isInit
      });

      res.send('success');
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });

  router.delete(`/:name`,authClientMiddleware, async (req, res) => {
    try {
      await UserDataService.drop(req.params.name);

      res.send('success');
    } catch (e) {
      res
        .status(ResponseStatus.SERVER_ERROR)
        .send(e.message);
    }
  });
}

