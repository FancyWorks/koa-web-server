"use strict";

const {api} = require('../wechat/wechat.util');
const userDao = require('./user.dao');

exports.ensureUser = async (openid) => {
  let user = await api.getUser(openid);
  console.dir(user);

  //   {
  //  "subscribe": 1,
  //  "openid": "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
  //  "nickname": "Band",
  //  "sex": 1,
  //  "language": "zh_CN",
  //  "city": "广州",
  //  "province": "广东",
  //  "country": "中国",
  //  "headimgurl": "http://wx.qlogo.cn/mmopen/g3MonUZtNHkdmzicIlibx6iaFqAc56vxLSUfpb6n5WKSYVY0ChQKkiaJSgQ1dZuTOgvLLrhJbERQQ4eMsv84eavHiaiceqxibJxCfHe/0",
  //  "subscribe_time": 1382694957
  // }
  let dbUser = await userDao.selectOne({wx_uid: openid});
  console.dir(dbUser);
  let userId = 0;

  let newUser = {
    nickname: user.nickname,
    wx_uid: user.openid,
    wx_head_img_url: user.headimgurl,
  };
  if (_.isNumber(user.sex)) {
    newUser.gender = user.sex;
  }

  if (_.isEmpty(dbUser)) {
    // 未找到此用户
    userId = await userDao.add(newUser);
  }
  else {
    // 已有此用户
    userId = dbUser.id;
    await userDao.update(newUser);
  }
  user.id = userId;

  return user;
};