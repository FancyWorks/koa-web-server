"use strict";

const jwt = require('../../../util/jwt');
const {Success, Error} = require('../../../util/message_bean');
const db = require('../../../util/db');

class User {
  async get(ctx) {
    let id = ctx.params.id;
    let user = await db.run(`select * from tuser where id=${id}`);
    ctx.body = `you are searching user (id:${id}), value = ${JSON.stringify(user)}`;
  }

  async add(ctx) {
    let body = ctx.request.body;
    ctx.body = {newUser: 32};
  }

  async createToken(ctx) {
    let token = jwt.create({uid: 1});
    ctx.body = new Success(null, {token: token});
  }
}

module.exports = new User();