"use strict";

const db = require('../../../util/db');
const dao = require('./user.dao');

(async () => {
  let list = await dao.getList();
  console.log('user list', list);

  let one = await dao.getOne(1);
  console.log('user one', one);

  db.end();
})();
