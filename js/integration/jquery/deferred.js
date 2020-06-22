import jQuery from 'jquery';
import deferredUtils from '../../core/utils/deferred';
import useJQuery from './use_jquery';
import { compare as compareVersion } from '../../core/utils/version';

if(useJQuery()) {
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
