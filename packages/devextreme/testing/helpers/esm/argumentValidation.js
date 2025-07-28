/* global */
(async function() {
    try {
        const rendererModule = await import('core/renderer');
        const typeUtilsModule = await import('core/utils/type');

        const renderer = rendererModule.default || rendererModule;
        const { isString, isPlainObject } = typeUtilsModule;

        const originalCSSMethod = renderer.fn.css;

        const validateStyleName = function(name) {
            if(name.indexOf('-') > -1) {
                throw new Error('CSS property \'' + name + '\' should be described in camelCase.');
            }
        };

        renderer.fn.css = function(name) {
            if(isString(name)) {
                validateStyleName(name);
            } else if(isPlainObject(name)) {
                for(const key in name) {
                    validateStyleName(key);
                }
            }
            return originalCSSMethod.apply(this, arguments);
        };

    } catch(error) {
        // eslint-disable-next-line no-console
        console.error('Error in argumentsValidator:', error);
    }
})();
