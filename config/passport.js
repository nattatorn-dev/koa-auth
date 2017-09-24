const passport = require('koa-passport');
const LocalStrategy = require('passport-local');
const accountService = require('../services/account.service');
const AccountModel = require('../models/account.model');

passport.use(new LocalStrategy(async (username, password, done) => {
  AccountModel.findOne({
    where: {
      email: username
    }
  }).then((res) => {
    const result = res.dataValues;

    if (result !== null) {
      if (result.password === password) {
        return done(null, result);
      } else {
        return done(null, false, '密码错误');
      }
    } else {
      return done(null, false, '未知用户');
    }
  }).catch((err) => {
    console.error(err);
    return done(null, false, {
      message: err
    });
  })
}))

// 用户登录成功以后，把用户uid存储到session中
passport.serializeUser((user, done) => {
  done(null, user.uid);
})

// 在每次请求的时候将从session中读取用户对象
passport.deserializeUser(async(uid, done) => {
  try {
    let user;
    await AccountModel.findOne({
      where: {
        uid: uid
      }
    }).then((res) => {
      user = res.dataValues;
    })

    done(null, user);
  } catch (err) {
    done(err);
  }
})

module.exports = passport;