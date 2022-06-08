'use strict';
const {Model, DataTypes} = require('sequelize');

class Place extends Model {
}

module.exports = (sequelize) => {
  Place.init({
    floor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    cityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coords: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize
  });

  return Place
}

