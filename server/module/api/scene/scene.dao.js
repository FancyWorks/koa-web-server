"use strict";

const db = require('../../../util/db');
const BaseDao = require('../../../util/base_dao');

class Dao extends BaseDao{

}

const tableName = 'tscene';
const columns = ['u_id', 'name', 'keyword', 'desc', 'duration_day', 'start_time', 'need_invite_limitation',
  'process_notification_id', 'notification_url'];

module.exports = new Dao(tableName, columns);