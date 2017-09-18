"use strict";

const db = require('../../../util/db');
const BaseDao = require('../../../util/base_dao');

class Dao extends BaseDao{

}

const tableName = 'tticket';
const columns = ['u_id', 'scene_id', 'parent_id', 'wx_uid', 'ticket', 'qrcode_url'];

module.exports = new Dao(tableName, columns);
