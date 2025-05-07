(function(root, factory) {
    root.DevExpress = root.DevExpress || {};
    root.DevExpress.data = root.DevExpress.data || {};
    root.DevExpress.data.testing = root.DevExpress.data.testing || {};

    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.DevExpress.data.testing.ErrorHandlingHelper = module.exports = factory(require('jquery'), require('core/class'), require('common/data/errors'));
        });
    } else {
        root.DevExpress.data.testing.ErrorHandlingHelper = factory(window.jQuery, DevExpress.Class, DevExpress.data);
    }
}(window, function($, Class, errorsModule) {
    return Class.inherit({

        ctor: function() {
            this.optionalHandler = $.proxy(
                function(arg) {
                    this.optionalHandlerImpl(arg);
                },
                this
            );
        },

        run: function(action, done, assert) {
            const globalFired = $.Deferred();
            const optionalFired = $.Deferred();
            const failFired = $.Deferred();

            let globalHandlerArg;
            let optionalHandlerArg;
            let failHandlerArg;

            const log = [];
            const that = this;

            const prevGlobalHandler = errorsModule.errorHandler;

            errorsModule.setErrorHandler((arg) => {
                log.push('global');
                globalHandlerArg = arg;
                globalFired.resolve();
            });

            this.optionalHandlerImpl = function(arg) {
                log.push('optional');
                optionalHandlerArg = arg;
                optionalFired.resolve();
            };

            const actionResult = action();
            if(!actionResult || !actionResult.fail) {
                throw Error('Deferred result is expected');
            }

            actionResult.fail(function(arg) {
                log.push('fail');
                failHandlerArg = arg;
                failFired.resolve();
            });

            $.when(globalFired, failFired, optionalFired).done(function() {
                assert.strictEqual(globalHandlerArg, optionalHandlerArg);
                assert.strictEqual(optionalHandlerArg, failHandlerArg);
                assert.ok('message' in globalHandlerArg);
                assert.deepEqual(log, ['optional', 'global', 'fail']);

                if(that.extraChecker) {
                    that.extraChecker(globalHandlerArg);
                }

                errorsModule.setErrorHandler(prevGlobalHandler);
                that.optionalHandlerImpl = null;

                done();
            });
        }
    });
}));
