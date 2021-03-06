const assert = require('assert');
const { BotContext } = require('botbuilder-core');
const { UserState, MemoryStorage, TestAdapter } = require('../');

const receivedMessage = { text: 'received', type: 'message', channelId: 'test', from: { id: 'user' } };
const missingChannelId = { text: 'received', type: 'message', from: { id: 'user' } };
const missingFrom = { text: 'received', type: 'message', channelId: 'test' };

describe(`UserState`, function () {
    this.timeout(5000);

    const storage = new MemoryStorage();
    const adapter = new TestAdapter();
    const context = new BotContext(adapter, receivedMessage);
    const middleware = new UserState(storage);
    it(`should load and save state from storage.`, function (done) {
        let key;
        middleware.onProcessRequest(context, () => {
            key = middleware.getStorageKey(context);
            const state = middleware.get(context);
            assert(state, `State not loaded`);
            assert(key, `Key not found`);
            state.test = 'foo';
        })
        .then(() => storage.read([key]))
        .then((items) => {
            assert(items.hasOwnProperty(key), `Saved state not found in storage.`);
            assert(items[key].test === 'foo', `Missing test value in stored state.`);
            done();
        });
    });

    it(`should reject with error if channelId missing.`, function (done) {
        const ctx = new BotContext(adapter, missingChannelId);
        middleware.onProcessRequest(ctx, () => {
            assert(false, `shouldn't have called next.`);
        })
        .then(() => {
            assert(false, `shouldn't have completed.`);
        })
        .catch((err) => {
            assert(err, `error object missing.`);
            done();
        });
    });

    it(`should reject with error if from missing.`, function (done) {
        const ctx = new BotContext(adapter, missingFrom);
        middleware.onProcessRequest(ctx, () => {
            assert(false, `shouldn't have called next.`);
        })
        .then(() => {
            assert(false, `shouldn't have completed.`);
        })
        .catch((err) => {
            assert(err, `error object missing.`);
            done();
        });
    });

    it(`should throw install exception if get() called without a cached entry.`, function (done) {
        context.set('userState', undefined);
        try {
            UserState.get(context);
            assert(false, `exception not thrown.`);
        } catch (err) {
            done();
        }
    });
});
