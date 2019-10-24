const { STRING } = require('sequelize');
const db = require('../db.js');

// TODO: Fill out this model.
const User = db.define('user', {
  username: {
    type: STRING,
  },
  password: {
    type: STRING,
    allowNull: false
  }
});

module.exports = User;
