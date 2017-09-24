const Account = require('../models/account.model');
const now = Date.now().valueOf();

module.exports = {
  async create(ctx, next) {
    const account = await Account.create({
      uid: `hm${now}`,
      name: 'test',
      gender: true,
      birth: '2017-10-01',
      createdAt: now,
      updatedAt: now,
      version: 0
    });

    ctx.response.body = {
      code: 2000,
      data: null,
      msg: 'Add success'
    };
  },
  async queryAccount(ctx, next) {
    const params = ctx.params;
    console.warn('query', params.name);
    const accounts = await Account.findAll({
      where: {
        name: params.name
      }
    });
    console.warn(`find ${accounts.length} Account`);

    ctx.response.body = {
      code: 2000,
      data: accounts,
      msg: 'Get success'
    }
  }
}
