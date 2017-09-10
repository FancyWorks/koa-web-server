'use strict';

const gm = require('gm').subClass({ imageMagick: true });
const path = require('path');

exports.changeImageSize = function (origin, width, outPath) {
  outPath = outPath || origin;
  return new Promise((resolve, reject) => {
    gm(origin)
      .resize(width)
      .write(outPath, (err) => {
        console.log(err || 'done');
        if (err) reject(origin);
        resolve(outPath);
      })
  })
};

exports.composePic = function (origin, openid, text, pic1, pic2, outPath) {
  let ttf = path.join(__dirname,'../public/chinese.ttf');
  const composesImage = new Promise((resolve, reject) => {
    gm()
      .in('-page', '+0+0')
      .in(origin)
      .fontSize(32)
      .fill('#FFFFFF')
      .font(ttf)
      .drawText(60, 380, text)
      .in('-page', '+487+808')
      .in(pic1)
      .in('-page', '+245+466')
      .in(pic2)
      .mosaic()
      .write(outPath, (err) => {
        if (err) reject(err);
        else resolve(outPath);
      });
  })
  return composesImage;
}

exports.circleImage = function (origin,size, outPath) {
  outPath = outPath || origin;
  const circle = new Promise((resolve, reject) => {
    gm(origin)
      .resize(size, size)
      .write(origin, (err) => {
        gm(size, size, 'none')
          .fill(origin)
          .drawCircle(size / 2, size / 2, size / 2, 0)
          .write(outPath, (err) => {
            console.log(err || 'done');
            if (err) reject(origin);
            resolve(outPath);
          });
      })
  })
  return circle;
}