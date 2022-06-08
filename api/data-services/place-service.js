'use strict';

class PlaceDataService {
  constructor(sequelize) {
    this._Place = sequelize.models.Place;
    this._City = sequelize.models.City;
    this._User = sequelize.models.User;
  }

  /**
   * @return {Promise}
   */
  getAll() {
    return this._Place.findAll({
      include: [this._City, this._User]
      }
    );
  }

  /**
   * @param {int} id
   * @return {Promise}
   */
  getById(id) {
    return this._Place.findOne({
      where: {
        id: id
      },
      include: [this._City, this._User]
    });
  }

  /**
   * @param {string} city
   * @param {int} floor
   * @return {Promise}
   */
  getByCityId(city, floor) {
    console.log(city, floor)
    return this._Place.findAll({
      where: {
        floor: floor
      },
      include: [
        {
          model: this._City,
          where: {
            name: city
          }
        },
        {
          model: this._User
        }
      ]
    });
  }

  /**
   * {floor, cityId, coords, userId}
   * @param {object} data
   * @return {*}
   */
  create(data) {
    return this._Place.create(data);
  }

  /**
   * {floor, cityId, coords, userId}
   * @param {int} id
   * @param {object} data
   * @return {Promise}
   */
  update(id, data) {
    return this._Place.update(data, {
      where: {id}
    });
  }

  /**
   * @param {int} id
   * @return {Promise}
   */
  drop(id) {
    return this._Place.destroy({
      where: {id}
    })
  }
}

module.exports = PlaceDataService;
