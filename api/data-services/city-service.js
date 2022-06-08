'use strict'

class City {
  constructor(sequelize) {
    this._City = sequelize.models.City
  }

  getAll() {
    return this._City.findAll()
  }

  getById(id) {
    return this._City.findOne({
      where: {
        id: id
      }
    })
  }

  /**
   * @param {object} data
   * @return {Promise}
   */
  create(data) {
    return this._City.create(data)
  }

  /**
   * @param {int} id
   * @param {object} data
   * @return {Promise}
   */
  update(id, data) {
    return this._City.update(data, {
      where: {id}
    })
  }
}

module.exports = City;
