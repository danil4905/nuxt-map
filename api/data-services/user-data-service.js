'use strict';

const {Op} = require('sequelize');

class UserDataService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
    this._Place = sequelize.models.Place;
  }

  /**
   * @return {Promise}
   */
  getAll() {
    return this._User.findAll();
  }

  /**
   * @param {string} name
   * @return {Promise}
   */
  getByName(name) {
    return this._User.findOne({
      where: {
        username: name
      }
    });
  }

  /**
   * {first_name, last_name, username, email, isLead, isInit}
   * @param {object} data
   * @return {Promise}
   */
  create(data) {
    return this._User.create(data);
  }

  /**
   * {first_name, last_name, username, email, isLead, isInit}
   * @param {string} name
   * @param {object} data
   * @return {Promise}
   */
  update(name, data) {
    return this._User.update(data, {
      where: {
        username: name
      }
    });
  }

  /**
   * @param {string} name
   * @return {Promise}
   */
  drop(name) {
    return this._User.destroy({
      where: {username: name}
    });
  }

  /**
   * @param {string} surname
   * @return {Promise}
   */
  search(surname, name) {
    if (!name) {
      return this._User.findAll({
        where: {
          lastName: {
            [Op.like]: `%${surname}%`
          }
        },
        include: {
          model: this._Place
        }
      });
    } else {
      return this._User.findAll({
        where: {
          lastName: {
            [Op.like]: `%${surname}%`
          },
          firstName: {
            [Op.like]: `%${name}%`
          }
        },
        include: {
          model: this._Place
        }
      })
    }
  }
}

module.exports = UserDataService;
