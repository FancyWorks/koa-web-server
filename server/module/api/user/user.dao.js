"use strict";

const db = require('../../../util/db');
const BaseDao = require('../../../util/base_dao');

class Dao extends BaseDao{

}

const tableName = 'tuser';
const columns = [
  'wx_uid', 'password', 'nickname', 'mobile', 'email', 'birthday', 'gender', 'head_img', 'wx_head_img_url',
  'login_time', 'last_login_time', 'last_login_ip', 'login_count', 'score', 'type'
];

module.exports = new Dao(tableName, columns);
