const Sequelize = require('sequelize');

const config = {
  database: 'honeymorning',
  username: 'root',
  password: '',
  host: 'localhost',
  port: 3306
};

function SequelizeInstance() {
  return new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    }
  });
}

module.exports = SequelizeInstance;
