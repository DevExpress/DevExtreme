const $ = require('jquery');

require('bundles/dx.viz.js');

QUnit.test('DevExpress namespaces', function(assert) {
    const namespaces = [
        'Color', // from core

        'data',
        'viz',
        'events'
    ];

    $.each(namespaces, function(index, namespace) {
        assert.ok(DevExpress[namespace], namespace + ' namespace');
    });
});

require('./bundlesParts/core.tests.js');
require('./bundlesParts/events.tests.js');
require('./bundlesParts/data.tests.js');
require('./bundlesParts/data.odata.tests.js');
require('./bundlesParts/animation.tests.js');
