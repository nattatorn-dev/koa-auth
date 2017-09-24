const Koa = require('koa');
const app = new Koa();
const router = require('./routes');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session');
const passport = require('./config/passport');
const auth = require('./auth');

const redis = require('redis');
const redisStore = require('koa-redis');

// trust proxy
app.proxy = true;

// sessions
app.keys = ['secretkeys'];
app.use(session({
  key: 'SID',
  store: redisStore({
    client: redis.createClient(6379, '127.0.0.1', {
      auth_pass: '521morning'
    })
  }),
  maxAge: 1*24*60*60*1000 // one day
}, app));

// body parser
app.use(bodyParser());

// authentication
app.use(passport.initialize());
app.use(passport.session());

// 跨域
app.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', 'http://localhost:9000');
  ctx.set('Access-Control-Allow-Credentials', true);
  ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type,Content-Length,Authorization,Accept,Origin,X-Requested-With');
  if (ctx.request.method === 'OPTIONS') {
    ctx.response.status = 200;
  } else {
    await next();
  }

});

app.use(auth.routes());
app.use(router.routes());

// 404
app.use(async (ctx, next) => {
  if (ctx.status === 404) {
    ctx.body = {
      code: 4004,
      data: null,
      msg: 'not found'
    };

    await next();
  }
})

// 500
app.on('error', (err, ctx) => {
  ctx.body = {
    code: 5000,
    data: err,
    msg: '系统错误'  
  }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server start successful, listening on: ', port);
});