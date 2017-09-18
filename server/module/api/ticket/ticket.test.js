"use strict";

const db = require('../../../util/db');
const dao = require('./ticket.dao');

(async () => {
  let list = await dao.getList();
  console.log('ticket list', list);

  let one = await dao.getOne(1);
  console.log('ticket one', one);

  db.end();
})();
