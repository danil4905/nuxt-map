'use strict';
const { Model, DataTypes } = require('sequelize');

class RefreshToken extends Model {}

const define = (sequelize) => {
  RefreshToken.init({
    token: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    expiryDate: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'RefreshToken'
  });

  return RefreshToken;
}

module.exports = define;
