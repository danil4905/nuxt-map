'use strict';
const { Model, DataTypes } = require('sequelize');

class City extends Model {}

module.exports = (sequelize) => {
  City.init({
    name: {
      type: DataTypes.STRING(255)
    }
  }, {
    sequelize
  });

  return City
}

