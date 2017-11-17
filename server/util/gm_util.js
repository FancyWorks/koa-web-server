"use strict";

const fs = require('fs');
const gm = require('gm').subClass({imageMagick: true});
const Promise = require('bluebird');
const path = require('path');

// 生成邀请卡图
function GenerateCardImg (bgUrl, qrcodeUrl, openid, qrcodeWidth, qrcodePosition) {
  let cardUrl = path.join(__dirname, `/../../public/card/${openid}.jpg`);
  return new Promise((resolve, reject) => {
    gm(qrcodeUrl)
      .resize(qrcodeWidth, qrcodeWidth)
      .write(qrcodeUrl, (err) => {
        if (err) {
          reject(err);
        }
        else {
          gm()
            .in('-page', '+0+0')
            .in(bgUrl)
            .in('-page', `+${qrcodePosition.x}+${qrcodePosition.y}`)
            .in(qrcodeUrl)
            .resize(1087/3, 1849/3)
            .mosaic() // Merges the images as a matrix
            .write(cardUrl, (err) => {
              if (err) {
                reject(err);
              }
              else {
                resolve(cardUrl);
              }
            });
        }
      });
  });
}

module.exports = {
  GenerateCardImg: GenerateCardImg
};

