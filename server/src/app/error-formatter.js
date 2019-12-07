const createErrorFormatter = (logger) => (err) => {
  logger.error(JSON.stringify(err));

  return err;
};

module.exports = { createErrorFormatter };
