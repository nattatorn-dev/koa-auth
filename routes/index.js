const Router = require('koa-router');
const router = new Router();
const accountRoute = require('./account.route');

router.use('/account', accountRoute.routes());

module.exports = router;
