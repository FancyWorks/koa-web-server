'use strict';

const fs = require('fs');
const path = require('path');
const request = require('request');
// const api = require('../config').api;
const gmPic = require('./gmPicture');


exports.generateInvitationCard = async function (openid, qrcode, headimage, text ) {
  // download image
  let qrcodeImage = await fetchImage(qrcode, path.join(__dirname, `../public/qrcode/${openid}.png`));
  let headImage = await fetchImage(headimage, path.join(__dirname, `../public/headImage/${openid}.png`));
  // fix size
  await gmPic.changeImageSize(qrcodeImage, 200);
  // headImage = await gmPic.changeImageSize(headImage, 225);
  await gmPic.circleImage(headImage, 225);

  // // 下载图片前剪裁
  // // const headimgurl = `${userinfo.headimgurl.slice(0, -1)}0`;
  //
  const result = await gmPic.composePic(
                  path.join(__dirname, '../public/bg.jpg'),
                  openid,
                  text,
                  qrcodeImage,
                  headImage,
                  path.join(__dirname, `../public/cards/${openid}.jpg`)
                );
  return result;
};

function fetchImage(origin, outPath) {
  // TODO: 处理错误信息
  return new Promise((resolve, reject) => {
    request({
      url: origin,
      encoding: 'binary'
    }, (err, res, body) => {
      if (err) reject(err);
      fs.writeFileSync(outPath, body, 'binary');
      resolve(outPath);
    });
  });
}
