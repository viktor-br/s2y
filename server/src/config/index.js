const convict = require('convict');

const config = convict({
  db: {
    host: {
      format: String,
      env: 'S2Y_DB_HOST',
      default: 'localhost',
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
  google: {
    sign_in: {
      client_id: {
        format: String,
        env: 'S2Y_GOOGLE_SIGNIN_CLIENT_ID',
        default: '',
      },
    },
  },
});

config.validate({ allowed: 'strict' });

module.exports = config;
