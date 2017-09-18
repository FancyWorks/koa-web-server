"use strict";

const {Success, Error} = require('../../../util/message_bean');
const dao = require('./scene.dao');

class Controller {
  async get(ctx) {
    let id = ctx.params.id;
    let obj = await dao.getOne(id);
    ctx.body = obj;
  }

  async add(ctx) {
    let body = ctx.request.body;
    ctx.body = {newUser: 32};
  }
}

module.exports = new Controller();