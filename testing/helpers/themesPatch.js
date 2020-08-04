
import themes from 'ui/themes';

themes.setDefaultTimeout(0);

QUnit.moduleStart(function() {
    return new Promise((resolve) => themes.initialized(resolve));
});
