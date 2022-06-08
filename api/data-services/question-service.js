'use strict'

class QuestionDataService {
  constructor(sequelize) {
    this._Question = sequelize.models.Question;
    this._City = sequelize.models.City;
  }

  /**
   * @param {int} page
   * @param {string} city
   * @return {Promise}
   */
  getAllByCityId(city = 'Izhevsk') {

    return this._Question.findAll({
      include: {
        model: this._City,
        where: {
          name: city
        }
      }
    });
  }

  /**
   * @param {int} page
   * @return {Promise}
   */
  getAll(page) {
    const {limit, offset} = this.paginate(page);

    return this._Question.findAll({
      offset: offset,
      limit: limit
    });
  }

  /**
   *
   * @param {int} id
   * @return {Promise}
   */
  getById(id) {
    return this._Question.findOne({
      where: {
        id: id
      },
      include: {
        model: this._City
      }
    });
  }

  /**
   *
   * @param {string} city
   * @return {Promise}
   */
  getByCityName(city = 'Izhevsk') {
    return this._Question.findAll({
      include: {
        model: this._City,
        where: {
          name: city
        }
      },
    });
  }

  /**
   * {title, body, icon}
   * @param {object} data
   * @return {Promise}
   */
  create(data) {
    return this._Question.create(data);
  }

  /**
   * {title, body, icon}
   * @param {int} id
   * @param {object} data
   * @return {Promise}
   */
  update(id, data) {
    return this._Question.update(data, {
      where: {id}
    });
  }

  /**
   * @param {int} id
   * @return {Promise}
   */
  drop(id) {
    return this._Question.destroy({
      where: {id}
    });
  }

  /**
   * @param {int} page
   * @return {{offset: number, limit: number}}
   */
  paginate(page) {
    const limit = 7;
    const pageNumber = page - 1;
    const offset = limit * pageNumber;

    return {limit, offset}
  }
}

module.exports = QuestionDataService;
