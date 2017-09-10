"use strict";

const logger = require('../util/logger');

module.exports = async (ctx, next) => {
  logger.debug('%s %s - %s', ctx.method, ctx.url);
  let start = Date.now();
  await next();
  let ms = Date.now() - start;
  // TODO: Ken add api logger here
};
