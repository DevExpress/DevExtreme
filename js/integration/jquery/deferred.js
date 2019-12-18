var jQuery = require('jquery');
var deferredUtils = require('../../core/utils/deferred');
var useJQuery = require('./use_jquery')();
var compareVersion = require('../../core/utils/version').compare;

if(useJQuery) {
    var Deferred = jQuery.Deferred;
    var strategy = { Deferred: Deferred };

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
