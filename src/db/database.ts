import { Sequelize } from 'sequelize';
import dbConfig from '../config/db.config';

let db;
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV == 'production') {
  db = dbConfig.dev;
} else {
  db = dbConfig.test;
}
console.log('Using database configuration', db);
const sequelize = new Sequelize(db.dbName, db.user, db.password, {
  dialect: 'mysql',
  host: 'localhost',
});

export default sequelize;
