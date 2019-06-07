import mysql from 'mysql2';

const createPersistentStoragePool = config => mysql.createPool({
  host: config.get('db.host'),
  user: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.name'),
  waitForConnections: true,
  connectionLimit: 10,
}).promise();

export default createPersistentStoragePool;
