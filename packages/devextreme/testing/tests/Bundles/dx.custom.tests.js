import $ from 'jquery';

import 'bundles/dx.custom.js';

QUnit.test('DevExpress namespaces', function(assert) {
    const namespaces = [
        'Color', // from core

        'data',
        'ui',
        'events'
    ];

    $.each(namespaces, function(index, namespace) {
        assert.ok(DevExpress[namespace], namespace + ' namespace');
    });
});

import './bundlesParts/core.tests.js';
import './bundlesParts/events.tests.js';
import './bundlesParts/data.tests.js';
import './bundlesParts/data.odata.tests.js';
import './bundlesParts/animation.tests.js';
import './bundlesParts/widgets-base.tests.js';
import './bundlesParts/widgets-web.tests.js';
