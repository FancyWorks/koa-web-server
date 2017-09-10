"use strict";

const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const CoWechat = require('co-wechat');
const WechatAPI = require('co-wechat-api');
const jwt = require('../../../util/jwt');
const config = require('../../../util/config');
const {Success, Error} = require('../../../util/message_bean');
const db = require('../../../util/db');
const logger = require('../../../util/logger');
const FileUtil = require('../../../util/file_util');

const api = new WechatAPI(config.wechat.appid, config.wechat.appsecret);

exports.Event_subscribe = async (message, ctx) => {
  //     { ToUserName: 'gh_c1ac1eebcb56',
  // FromUserName: 'o9CIB0lvnOWFwoVYiXhZ3BneIV1w',
  // CreateTime: '1504964483',
  // MsgType: 'event',
  // Event: 'subscribe',
  // EventKey: '' }

  //   { ToUserName: 'gh_c1ac1eebcb56',
  // FromUserName: 'o9CIB0sgH5suDIhBUsvG6YZxjmnc',
  // CreateTime: '1504970827',
  // MsgType: 'event',
  // Event: 'subscribe',
  // EventKey: 'qrscene_1',
  // Ticket: 'gQFo8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyRmNmU2RYUXljMWkxeWxkUXhwMUkAAgSNBrRZAwQIBwAA' }
  let user = await api.getUser(message.FromUserName);
  console.dir(user);
  return '感谢注册' + user.nickname;
};

exports.Event_unsubscribe = async (message, ctx) => {
  return '希望再次关注';
};

exports.Event_SCAN = async (message, ctx) => {
  // { ToUserName: 'gh_c1ac1eebcb56',
  // FromUserName: 'o9CIB0lvnOWFwoVYiXhZ3BneIV1w',
  // CreateTime: '1504970446',
  // MsgType: 'event',
  // Event: 'SCAN',
  // EventKey: '1',
  // Ticket: 'gQFo8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyRmNmU2RYUXljMWkxeWxkUXhwMUkAAgSNBrRZAwQIBwAA' }
  return JSON.stringify(message);
};
