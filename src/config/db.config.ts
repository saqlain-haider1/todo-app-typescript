const dbConfig = {
  dev: {
    dbName: 'todo-dev',
    dialect: 'mysql',
    user: 'root',
    password: '',
  },
  test: {
    dbName: 'todo-test',
    dialect: 'mysql',
    host: 'localhost',
    user: 'root',
    password: 'root',
  },
};

export default dbConfig;
