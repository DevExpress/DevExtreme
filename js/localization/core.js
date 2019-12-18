var dependencyInjector = require('../core/utils/dependency_injector');

module.exports = dependencyInjector({
    locale: (function() {
        var currentLocale = 'en';

        return function(locale) {
            if(!locale) {
                return currentLocale;
            }

            currentLocale = locale;
        };
    })()
});
