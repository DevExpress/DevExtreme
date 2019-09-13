import dependencyInjector from "../core/utils/dependency_injector";

module.exports = dependencyInjector({
    locale: (() => {
        let currentLocale = "en";

        return locale => {
            if(!locale) {
                return currentLocale;
            }

            currentLocale = locale;
        };
    })()
});
