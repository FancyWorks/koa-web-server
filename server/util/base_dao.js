"use strict";

const _ = require('lodash');
const db = require('./db');

class BaseDao {
  constructor(tableName, columns) {
    this.tableName = tableName;
    this.columns = columns || [];
  }

  async getList() {
    let sql = `select * from ${this.tableName} where del = 0`;
    let params = [], i = 0;
    return db.run(sql, params);
  }

  async getOne(id) {
    let sql = `select * from ${this.tableName} where del = 0 and id = ?`;
    let params = [], i = 0;
    params[i++] = id;
    let rows = await db.run(sql, params);
    return rows[0] || 0;
  }

  async select(whereParams, params) {
    let rows = await db.select(this.tableName, whereParams, params);
    return rows;
  }

  async selectOne(whereParams, params) {
    let rows = await db.select(this.tableName, whereParams, params);
    return rows[0];
  }

  /**
   * @Author Ken
   * @CreateDate 2017-09-12 00:14
   * @LastUpdateDate 2017-09-12 00:14
   * @desc 插入数据
   * @params
   * @return id
   */
  async add(obj) {
    let params = {};
    _.assign(params, _.pick(obj, this.columns));
    let ret = await db.insert(this.tableName, params);
    return ret.insertId;
  }

  async update(obj, whereParams) {
    let params = {};
    _.assign(params, _.pick(obj, this.columns));
    return db.update(this.tableName, params, whereParams);
  }

  async delete(whereParams) {
    return db.update(this.tableName, {del: 1}, whereParams);
  }
}

module.exports = BaseDao;

