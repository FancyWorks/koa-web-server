"use strict";

const _ = require('lodash');
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
const userDao = require('../user/user.dao');
const userUtil = require('../user/user.util');
const ticketDao = require('../ticket/ticket.dao');
const sceneDao = require('../scene/scene.dao');
const {api, GenerateInvitationCard} = require('./wechat.util');


// 加入活动
async function JoinScene(openid, sceneId, parentId) {
  let ticket = ticketDao.select({parent_id: parentId});

}

exports.Event_subscribe = async (message, ctx) => {
  // ========== 直接关注
  //     { ToUserName: 'gh_c1ac1eebcb56',
  // FromUserName: 'o9CIB0lvnOWFwoVYiXhZ3BneIV1w',
  // CreateTime: '1504964483',
  // MsgType: 'event',
  // Event: 'subscribe',
  // EventKey: '' }

  // ========== 扫活动qrcode关注
  //   { ToUserName: 'gh_c1ac1eebcb56',
  // FromUserName: 'o9CIB0sgH5suDIhBUsvG6YZxjmnc',
  // CreateTime: '1504970827',
  // MsgType: 'event',
  // Event: 'subscribe',
  // EventKey: 'qrscene_1',
  // Ticket: 'gQFo8DwAAAAAAAAAAS5odHRwOi8vd2VpeGluLnFxLmNvbS9xLzAyRmNmU2RYUXljMWkxeWxkUXhwMUkAAgSNBrRZAwQIBwAA' }
  let user = await userUtil.ensureUser(message.openid);

  let ret = '';
  // 扫码关注
  if (message.EventKey) {
    ret = user.nickname + ', 感谢您的关注~ ';
    ret += `恭喜您成功参与活动！
快把带有您独有的二维码图片分享给朋友也来参加活动领取家用折叠梯吧！`;
    let sceneId = message.EventKey.split('_')[1];
    let media = await GenerateInvitationCard(message, sceneId, message.Ticket);

    setTimeout(() => {
      api.sendImage(message.openid, media.media_id);
    }, 0);
  }
  else {
    ret = user.nickname + ', 感谢您的关注~';
  }

  // console.log(userId);
  return ret;
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

  let sceneId = message.EventKey;
  let media = await GenerateInvitationCard(message, sceneId, message.Ticket);

  setTimeout(() => {
    api.sendImage(message.openid, media.media_id);
  }, 0);

  return media.joinSceneMessage;
};

//TEMPLATESENDJOBFINISH
