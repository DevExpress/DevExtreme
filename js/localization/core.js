const dependencyInjector = require('../core/utils/dependency_injector');

module.exports = dependencyInjector({
    locale: (function() {
        let currentLocale = 'en';

        return function(locale) {
            if(!locale) {
                return currentLocale;
            }

            currentLocale = locale;
        };
    })()
});
