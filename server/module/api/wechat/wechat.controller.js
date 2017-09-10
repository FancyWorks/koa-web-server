"use strict";

const _ = require('lodash');
const Promise = require('bluebird');
const CoWechat = require('co-wechat');
const WechatAPI = require('co-wechat-api');
const config = require('../../../util/config');
const logger = require('../../../util/logger');
const EventHandler = require('./wechat.event.handler');
const TextHandler = require('./wechat.text.handler');

const api = new WechatAPI(config.wechat.appid, config.wechat.appsecret);

class Wechat {
  constructor() {
    this.handler = CoWechat(config.wechat).middleware(async (message, ctx) => {
      console.dir(message);

      let ret = "";
      switch (message.MsgType) {
        case 'event':
          ret = await this.onEvent(message, ctx);
          break;
        case 'text':
          ret = await this.onText(message, ctx);
          break;
        case 'image':
          ret = await this.onImage(message, ctx);
          break;
        case 'voice':
          ret = await this.onVoice(message, ctx);
          break;
        case 'video':
          ret = await this.onVideo(message, ctx);
          break;
        default:
          logger.warn('unhandled message, type = ' + message.MsgType);
      }
      return ret;
    });
  }

  async onVoice(message, ctx) {
    //     { ToUserName: 'gh_c1ac1eebcb56',
    // FromUserName: 'o9CIB0lvnOWFwoVYiXhZ3BneIV1w',
    // CreateTime: '1504964962',
    // MsgType: 'voice',
    // MediaId: '2n3Gcf0UXTzfsWUBSo55fRuktIvpHmFqotfXGNURUCYnXiSJz8wdSJKZfa91jSOR',
    // Format: 'amr',
    // MsgId: '6463775293831253474',
    // Recognition: '' }
    return "未对voice进行处理";
  }

  async onImage(message, ctx) {
    //     { ToUserName: 'gh_c5b3441de5a9',
    // FromUserName: 'oo-Iu0oEZHXluoYj-acyBo9Jmh4w',
    // CreateTime: '1504964908',
    // MsgType: 'image',
    // PicUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/L4F6oL2AlVltyfSoLtHmCqQU2Q8IjVIULRWia6SVY7Z4awKM2kN2O3fw3TdnFOsariaXibmUXZ5OWDeDI4zHv3WrQ/0',
    // MsgId: '6463775061913350770',
    // MediaId: 'ig_FQ2KD_Uh29A183Q0roGFtSLc3J6C5aqphWVtz9IAZTiG4XpqLjm4DbV_TY6Hd' }
    return "未对image进行处理";
  }

  async onVideo(message, ctx) {
    // { ToUserName: 'gh_c1ac1eebcb56',
    //   FromUserName: 'o9CIB0lvnOWFwoVYiXhZ3BneIV1w',
    //   CreateTime: '1504968746',
    //   MsgType: 'video',
    //   MediaId: 'b75ekYreMTWrpRDn1YPx85hPXxj45mJm5Z0wu-WLBKPAQPKTvtQ-YQImYBkhNQJl',
    //   ThumbMediaId: 'ZcUOtNVsX_kAUGyZ_s9bMwq5iSFahT52dx461wyxmtgNn5sHCree5wVaczDU9sh8',
    //   MsgId: '6463791545987502319' }
    return "未对video";
  }

  async onText(message, ctx) {
    let ret = "";
    let func = TextHandler['Text_' + message.Content];
    if (_.isFunction(func)) {
      ret = await func(message, ctx);
    }
    else {
      ret = message.Content + '=--=';
    }

    return ret;
  }

  async onEvent(message, ctx) {
    let ret = "";
    let func = EventHandler['Event_' + message.Event];
    if (_.isFunction(func)) {
      ret = await func(message, ctx);
    }
    else {
      logger.warn('unhandled event = ' + message.Event);
    }
    return ret;
  }
}

module.exports = new Wechat();