const Router = require('koa-router');
const router = new Router();
const passport = require('./config/passport');
const Geetest = require('gt3-sdk');
const GeetestConfig = require('./config/geetest');
const captcha = new Geetest(GeetestConfig);

/** 
 * Auth login
*/
router.post('/auth/login', (ctx, next) => {
  return passport.authenticate('local', (err, user, info, status) => {
    if (user) {
      ctx.body = {
        code: 2000,
        data: user,
        msg: 'Auth success'
      };
      return ctx.login(user);
    } else {
      ctx.body = {
        code: 4000,
        data: null,
        msg: info
      };
    }
  })(ctx, next);
});

router.get('/auth/logout', (ctx, next) => {
  ctx.logout();
  ctx.cookies.set('SID', ''); // 清空cookie

  ctx.body = {
    code: 2000,
    data: null,
    msg: 'Logout success'
  };
});

// Geetest
router.get('/auth/gt/register', (ctx, next) => {
  return captcha.register({
    client_type: 'unknown',
    ip_address: 'unknown'
  }, (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    
    if (!data.success) {

      // failback
      ctx.session.fallback = true;
      ctx.body = data;
    } else {
      ctx.session.fallback = false;

      ctx.body = {
        code: 2000,
        data,
        msg: 'success'
      };
    }
  });
});

router.post('/auth/gt/validate', (ctx, next) => {
  return captcha.validate(ctx.session.fallback, {

    geetest_challenge: ctx.request.body.geetest_challenge,
    geetest_validate: ctx.request.body.geetest_validate,
    geetest_seccode: ctx.request.body.geetest_seccode

  }, (err, success) => {
    if (err) {
      ctx.body = {
        code: 4000,
        data: null,
        msg: err
      };
    } else if (!success) {
      ctx.response.body = {
        code: 9001,
        data: null,
        msg: 'Validate false'
      };
    } else {
      ctx.response.body = {
        code: 2000,
        data: null,
        msg: 'Validate success'
      };
    }
  });
});

router.post('/xauth/test', (ctx, next) => {
  if (ctx.isAuthenticated()) {
    ctx.body = {
      code: 2000,
      data: null,
      msg: 'Auth success'
    };
  } else {
    ctx.throw(401);
    ctx.body = {
      code: 4001,
      data: null,
      msg: 'no auth'
    };
  }
});

module.exports = router;
