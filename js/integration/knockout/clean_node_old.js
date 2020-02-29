const ko = require('knockout');
const compareVersion = require('../../core/utils/version').compare;
const strategyChanging = require('../../core/element_data').strategyChanging;

const patchCleanData = function(jQuery) {
    const cleanKoData = function(element, andSelf) {
        const cleanNode = function() {
            ko.cleanNode(this);
        };

        if(andSelf) {
            element.each(cleanNode);
        } else {
            element.find('*').each(cleanNode);
        }
    };

    const originalEmpty = jQuery.fn.empty;
    jQuery.fn.empty = function() {
        cleanKoData(this, false);
        return originalEmpty.apply(this, arguments);
    };

    const originalRemove = jQuery.fn.remove;
    jQuery.fn.remove = function(selector, keepData) {
        if(!keepData) {
            let subject = this;
            if(selector) {
                subject = subject.filter(selector);
            }
            cleanKoData(subject, true);
        }
        return originalRemove.call(this, selector, keepData);
    };

    const originalHtml = jQuery.fn.html;
    jQuery.fn.html = function(value) {
        if(typeof value === 'string') {
            cleanKoData(this, false);
        }
        return originalHtml.apply(this, arguments);
    };

    const originalReplaceWith = jQuery.fn.replaceWith;
    jQuery.fn.replaceWith = function() {
        const result = originalReplaceWith.apply(this, arguments);

        if(!this.parent().length) {
            cleanKoData(this, true);
        }

        return result;
    };
};

strategyChanging.add(function(strategy) {
    const isJQuery = !!strategy.fn;

    if(isJQuery && compareVersion(strategy.fn.jquery, [2, 0]) < 0) {
        patchCleanData(strategy);
    }
});
