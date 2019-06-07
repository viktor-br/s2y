const convict = require('convict');

const config = convict({
  db: {
    host: {
      format: String,
      env: 'S2Y_DB_HOST',
      default: '',
    },
    port: {
      format: String,
      env: 'S2Y_DB_PORT',
      default: '',
    },
    username: {
      format: String,
      env: 'S2Y_DB_USERNAME',
      default: '',
    },
    password: {
      format: String,
      env: 'S2Y_DB_PASSWORD',
      default: '',
    },
    name: {
      format: String,
      env: 'S2Y_DB_NAME',
      default: '',
    },
  },
  session: {
    storage: {
      host: {
        format: String,
        env: 'S2Y_SESSION_STORAGE_HOST',
        default: '',
      },
      port: {
        format: String,
        env: 'S2Y_SESSION_STORAGE_PORT',
        default: '',
      },
    },
  },
});

config.validate({ allowed: 'strict' });

export default config;
