"use strict";

const _ = require('lodash');
const moment = require('moment');
const path = require('path');
const Promise = require('bluebird');
const CoWechat = require('co-wechat');
const WechatAPI = require('co-wechat-api');
const config = require('../../../util/config');
const logger = require('../../../util/logger');
const FileUtil = require('../../../util/file_util');
const userDao = require('../user/user.dao');
const userUtil = require('../user/user.util');
const ticketDao = require('../ticket/ticket.dao');
const sceneDao = require('../scene/scene.dao');
const gmUtil = require('../../../util/gm_util');

const api = new WechatAPI(config.wechat.appid, config.wechat.appsecret);
exports.api = api;

/**
 * @Author Ken
 * @CreateDate 2017-09-17 22:29
 * @LastUpdateDate 2017-09-17 22:29
 * @desc 给邀请人发送 活动完成进度
 * @params
 * @return
 */
let sendInvitationProcess = exports.sendInvitationProcess = async (parentId, username, sceneId) => {
  let scene = await sceneDao.selectOne({id: sceneId});
  if (!scene) {
    throw `未找到此活动, sceneId = ${sceneId}`;
  }

  let sceneStartDate = moment(scene.start_time).format('YYYY-MM-DD');
  let sceneDayDuration = scene.duration_day;

  let tickets = await ticketDao.select({scene_id: sceneId, parent_id: parentId, del: 0});

  let templateId = scene.process_notification_id;
  let url = scene.notification_url;
  let total = scene.need_invite_limitation;

  let remark = _.size(tickets) >= total ? '恭喜你完成任务!' : '还差一点啦, 继续加油哦~';

  let topColor = '#FF0000';
  let keywordColor = '#173177';

  let data =
    {
      "first": {
        "value": `恭喜你成功邀请了 ${username} !`,
        "color": keywordColor
      },
      'keyword1': {
        "value": `${scene.name}, 进度: ${_.size(tickets)}/${total}`,
        "color": keywordColor
      },
      'keyword2': {
        "value": `${sceneStartDate}, 持续 ${sceneDayDuration} 天`,
        "color": keywordColor
      },
      'remark': {
        "value": remark,
        "color": keywordColor
      },
    };

  await api.sendTemplate(parentId, templateId, url, topColor, data);
};

/**
 * @Author Ken
 * @CreateDate 2017-09-13 22:01
 * @LastUpdateDate 2017-09-13 22:01
 * @desc 生成活动邀请码/二维码
 * @params
 *  parentTicket: 扫的此二维码加入的活动
 * @return
 */
exports.GenerateInvitationCard = async (message, sceneId, parentTicket = null, durationDay = 29) => {
  let openid = message.FromUserName;

  // Ken 2017-10-08 16:24 fix "用户已经关注了, 活动是后发布的, 则用户在生成邀请卡时, 在user表中无此用户"
  let user = await userUtil.ensureUser(openid);
  logger.info('user ' + user.nickname);

  let media = {};
  let isJoinedScene = false;
  let joinSceneMessage = '恭喜您参加活动成功!';
  joinSceneMessage = `恭喜您成功参与活动！
快把带有您独有的二维码图片分享给朋友也来参加活动领取家用折叠梯吧！`;
  try {
    //查看是否已生成邀请卡
    let qrCodeUrl = '';
    let ticketRecord = await ticketDao.selectOne({scene_id: sceneId, wx_uid: openid});

    if (!_.isEmpty(ticketRecord)) {
      logger.info('已存在邀请卡, openid=' + openid);
      qrCodeUrl = ticketRecord.qrcode_url;
      isJoinedScene = true;
      // joinSceneMessage = '您参加过此活动';
    }
    else {
      logger.info('新生成邀请卡, openid=' + openid);

      let qrCode = await api.createTmpQRCode(sceneId, 60 * 60 * 24 * durationDay);
      console.log('qrCode', qrCode);
      qrCodeUrl = await api.showQRCodeURL(qrCode.ticket);

      let ticketRecord = await ticketDao.selectOne({scene_id: sceneId, ticket: parentTicket, del: 0});
      // Ken 2017-10-08 16:20 新用户生成邀请卡, ticketRecord不存在, 下面会报错
      let parentWxUid = ticketRecord ? ticketRecord.wx_uid : null;

      // 记录
      await ticketDao.add({
        parent_id: parentWxUid,
        wx_uid: openid,
        scene_id: sceneId,
        ticket: qrCode.ticket,
        qrcode_url: qrCodeUrl,
      });

      if (parentWxUid)
        sendInvitationProcess(parentWxUid, user.nickname, sceneId);
    }
    logger.info('qrCodeUrl', qrCodeUrl);

    let imageLocalUrl = path.join(__dirname, `../../../../public/qrcode/${openid}.png`);
    await FileUtil.download(qrCodeUrl, imageLocalUrl);
    let cardUrl = await gmUtil.GenerateCardImg(__dirname + '/../../../card/bg.jpeg'
      , imageLocalUrl
      , openid
      , 300
      , {x: 720, y: 1360});
    media = await api.uploadMedia(cardUrl, 'image').then(result => JSON.parse(result));
    // media = await api.uploadMedia(imageLocalUrl, 'image').then(result => JSON.parse(result));
    media.isJoinedScene = isJoinedScene;
    media.joinSceneMessage = joinSceneMessage;
    console.log('media', media);
  } catch (e) {
    logger.error(`生成qrcode出错, openid = ${openid}, error = ` + e.message);
    console.error(e);
  }

  return media;
};

