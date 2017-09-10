"use strict";

const request = require('request');
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

exports.Text_1 = async (message, ctx) => {
  return [
    {
      title: 'test title',
      description: 'test description',
      picurl: 'http://b.hiphotos.baidu.com/image/pic/item/fcfaaf51f3deb48f856b141ef91f3a292cf578eb.jpg',
      url: 'http://www.baidu.com'
    }
  ];
};

exports.Text_2 = async (message, ctx) => {
  let openid = message.FromUserName;

  let media = {};
  try {
    let sceneId = 1;
    let qrCode = await api.createTmpQRCode(sceneId, 1800);
    console.log(qrCode);
    let qrCodeUrl = await api.showQRCodeURL(qrCode.ticket);
    console.log(qrCodeUrl);
    let user = await api.getUser(openid);
    console.log(user);

    let imageLocalUrl = path.join(__dirname, `../../../../public/qrcode/${openid}.png`);
    console.log('imageLocalUrl', imageLocalUrl);
    let qrCodeImage = await FileUtil.download(qrCodeUrl, imageLocalUrl);
    console.log('qrCodeImage', qrCodeImage);
    media = await api.uploadMedia(imageLocalUrl, 'image').then(result => JSON.parse(result));
    console.log('media1', media);
  } catch (e) {
    console.error(e);
  }

  return {
    type: "image",
    content: {
      mediaId: media.media_id
    }
  };
};
