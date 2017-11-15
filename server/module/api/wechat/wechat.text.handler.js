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
const {api, GenerateInvitationCard, sendInvitationProcess} = require('./wechat.util');
const sceneDao = require('../scene/scene.dao');

// exports.Text_1 = async (message, ctx) => {
//   return [
//     {
//       title: 'test title',
//       description: 'test description',
//       picurl: 'http://b.hiphotos.baidu.com/image/pic/item/fcfaaf51f3deb48f856b141ef91f3a292cf578eb.jpg',
//       url: 'http://www.baidu.com'
//     }
//   ];
// };

(async () => {
  var scenes = await sceneDao.select({del: 0});

  _.forEach(scenes, (scene) => {
    exports['Text_' + scene.keyword] = async (message, ctx) => {
      let media = await GenerateInvitationCard(message, scene.id);

      setTimeout(() => {
        api.sendImage(message.openid, media.media_id);
      }, 100);

      return media.joinSceneMessage;
    };
  });

})();

// exports.Text_家装特惠节 = async (message, ctx) => {
//   let media = await GenerateInvitationCard(message, 133);
//
//   return {type: "image", content: {mediaId: media.media_id}};
// };

// exports.Text_3 = async (message, ctx) => {
//   let templateId = 'dXQy59STi3PXiL6nXdY94xD_P6v8guFSPF1TbbxVrl4';
//   let topColor = '#FF0000';
//   let url = '';
//   let data =
//     {
//       "username": {
//         "value": "Ken",
//         "color": "#173177"
//       },
//       'scenename': {
//         "value": '艺尚活动',
//         "color": "#173177"
//       },
//       'process': {
//         "value": 1 + '/3',
//         "color": "#173177"
//       },
//       'remark': {
//         "value": "继续加油！",
//         "color": "#173177"
//       },
//     };
//
//   await api.sendTemplate(message.FromUserName, templateId, url, topColor, data);
//   return '';
// };

// exports.Text_4 = async (message, ctx) => {
//   await sendInvitationProcess('oyqFdwNzVcGVQF6sEri0f6sKfZPY', "lala", 1);
//   return '';
// };
