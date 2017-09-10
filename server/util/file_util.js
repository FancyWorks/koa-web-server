"use strict";

const request = require('request');
const fs = require('fs');
const Promise = require('bluebird');

/**
 * @Author Ken
 * @CreateDate 2017-09-10 22:15
 * @LastUpdateDate 2017-09-10 22:15
 * @desc download file from url
 * @params
 * @return
 */
exports.download = (url, filename) => {
  return new Promise((resolve, reject) => {
    request({url: url, encoding: 'binary'}, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }
      fs.writeFileSync(filename, body, 'binary');
      resolve(filename);
    });
  });
};
