const Sequelize = require('sequelize');
const SequelizeInstance = require('../config/db');

const sequelize = SequelizeInstance();
sequelize.authenticate().then(() => {
  console.warn('Connect database has been established successfully');
}).catch((err) => {
  console.error('Unable to connect to the database: ', err);
});

const Account = sequelize.define('user', {
  uid: {
    type: Sequelize.STRING(50),
    // primaryKey: true
  },
  name: Sequelize.STRING(100),
  password: Sequelize.STRING(45),
  email: Sequelize.STRING(45),
  gender: Sequelize.BOOLEAN,
  birth: Sequelize.STRING(10),
  createdAt: Sequelize.BIGINT,
  updatedAt: Sequelize.BIGINT,
  version: Sequelize.BIGINT
}, {
  timestamps: false
});

module.exports = Account;
