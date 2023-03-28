import $ from 'jquery';
import Class from 'core/class';
import * as errorsModule from 'data/errors';

export default Class.inherit({
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
