"use strict";

const db = require('../../../util/db');
const dao = require('./scene.dao');

(async () => {
  let list = await dao.getList();
  console.log('scene list', list);

  let one = await dao.getOne(1);
  console.log('scene one', one);

  db.end();
})();

