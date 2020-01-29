const jQuery = require('jquery');
const deferredUtils = require('../../core/utils/deferred');
const useJQuery = require('./use_jquery')();
const compareVersion = require('../../core/utils/version').compare;

if(useJQuery) {
    const Deferred = jQuery.Deferred;
    const strategy = { Deferred: Deferred };

    strategy.when = compareVersion(jQuery.fn.jquery, [3]) < 0
        ? jQuery.when
        : function(singleArg) {
            if(arguments.length === 0) {
                return new Deferred().resolve();
            } else if(arguments.length === 1) {
                return singleArg && singleArg.then ? singleArg : new Deferred().resolve(singleArg);
            } else {
                return jQuery.when.apply(jQuery, arguments);
            }
        };

    deferredUtils.setStrategy(strategy);
}
