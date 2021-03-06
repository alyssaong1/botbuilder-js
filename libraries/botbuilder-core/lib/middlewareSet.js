"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * :package: **botbuilder-core**
 *
 * A set of `Middleware` plugins. The set itself is middleware so you can easily package up a set
 * of middleware that can be composed into a bot with a single `bot.use(mySet)` call or even into
 * another middleware set using `set.use(mySet)`.
 */
class MiddlewareSet {
    /**
     * Creates a new instance of a MiddlewareSet.
     * @param middleware Zero or more middleware handlers(s) to register.
     */
    constructor(...middleware) {
        this.middleware = [];
        MiddlewareSet.prototype.use.apply(this, middleware);
    }
    onProcessRequest(context, next) {
        return this.run(context, next);
    }
    /**
     * Registers middleware handlers(s) with the set.
     * @param middleware One or more middleware handlers(s) to register.
     */
    use(...middleware) {
        middleware.forEach((plugin) => {
            if (typeof plugin === 'function') {
                this.middleware.push(plugin);
            }
            else if (typeof plugin === 'object' && plugin.onProcessRequest) {
                this.middleware.push((context, next) => plugin.onProcessRequest(context, next));
            }
            else {
                throw new Error(`MiddlewareSet.use(): invalid plugin type being added.`);
            }
        });
        return this;
    }
    /**
     * Executes a set of middleware in series.
     * @param context Context for the current turn of conversation with the user.
     * @param next Function to invoke at the end of the middleware chain.
     */
    run(context, next) {
        const handlers = this.middleware.slice();
        function runNext(i) {
            try {
                if (i < handlers.length) {
                    return Promise.resolve(handlers[i](context, () => runNext(i + 1)));
                }
                else {
                    return Promise.resolve(next());
                }
            }
            catch (err) {
                return Promise.reject(err);
            }
        }
        return runNext(0);
    }
}
exports.MiddlewareSet = MiddlewareSet;
//# sourceMappingURL=middlewareSet.js.map