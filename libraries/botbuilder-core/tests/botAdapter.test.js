const assert = require('assert');
const { BotAdapter, BotContext } = require('../');

const testMessage = { text: 'test', type: 'message' };

class SimpleAdapter extends BotAdapter {
    processRequest(activity, handler) {
        const context = new BotContext(this, activity);
        return this.runMiddleware(context, handler);
    }
}

describe(`BotAdapter`, function () {
    this.timeout(5000);

    let calls = 0;
    function middleware(context, next) {
        assert(context, `middleware[${calls}]: context object missing.`);
        assert(next, `middleware[${calls}]: next() function missing.`);
        calls++;
        return next();
    }

    const adapter = new SimpleAdapter();
    it(`should use() middleware individually.`, function (done) {
        adapter.use(middleware).use(middleware);
        done();
    });

    it(`should use() a list of middleware.`, function (done) {
        adapter.use(middleware, middleware, middleware);
        done();
    });

    it(`should run all middleware.`, function (done) {
        adapter.processRequest(testMessage, (context) => {
            assert(context, `callback not passed context object.`);
            assert(calls === 5, `only "${calls} of 5" middleware called.`);
        }).then(() => done());
    });
});