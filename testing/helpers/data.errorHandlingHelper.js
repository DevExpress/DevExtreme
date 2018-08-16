(function(root, factory) {
    root.DevExpress = root.DevExpress || {};
    root.DevExpress.data = root.DevExpress.data || {};
    root.DevExpress.data.testing = root.DevExpress.data.testing || {};

    if(typeof define === 'function' && define.amd) {
        define(function(require, exports, module) {
            root.DevExpress.data.testing.ErrorHandlingHelper = module.exports = factory(require("jquery"), require("core/class"), require("data/errors"));
        });
    } else {
        root.DevExpress.data.testing.ErrorHandlingHelper = factory(window.jQuery, DevExpress.Class, DevExpress.data);
    }
}(window, function($, Class, errorsModule) {
    return Class.inherit({

        ctor: function() {
            this.optionalHandler = $.proxy(
                function(...args) {
                    this.optionalHandlerImpl(...args);
                },
                this
            );
        },

        run: function(action, done, assert) {
            var globalFired = $.Deferred(),
                optionalFired = $.Deferred(),
                failFired = $.Deferred();

            var globalHandlerArgs,
                optionalHandlerArgs,
                failHandlerArgs;

            var log = [],
                that = this;

            var prevGlobalHandler = errorsModule.errorHandler;

            errorsModule.errorHandler = function() {
                debugger;
                log.push("global");
                globalHandlerArgs = arguments;
                globalFired.resolve();
            };

            this.optionalHandlerImpl = function() {
                debugger;
                log.push("optional");
                optionalHandlerArgs = arguments;
                optionalFired.resolve();
            };

            var actionResult = action();
            if(!actionResult || !actionResult.fail) {
                throw Error("Deferred result is expected");
            }

            actionResult.fail(function() {
                log.push("fail");
                failHandlerArgs = arguments;
                failFired.resolve();
            });

            $.when(globalFired, failFired, optionalFired).done(function() {
                for(var i = 0; i <= optionalHandlerArgs.length; i++) {
                    assert.equal(globalHandlerArgs[i], optionalHandlerArgs[i]);
                    assert.equal(optionalHandlerArgs[i], failHandlerArgs[i]);
                }
                assert.ok("message" in globalHandlerArgs[0]);
                assert.deepEqual(log, ["optional", "global", "fail"]);

                if(that.extraChecker) {
                    that.extraChecker.apply(null, globalHandlerArgs);
                }

                errorsModule.errorHandler = prevGlobalHandler;
                that.optionalHandlerImpl = null;

                done();
            });
        }
    });
}));
