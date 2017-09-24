const Router = require('koa-router');
const router = new Router();
const accountService = require('../services/account.service');

router.get('/add', accountService.create);
router.get('/queryAccount/:name', accountService.queryAccount);

module.exports = router;
