import $ from 'jquery';

import 'bundles/dx.all.js';

QUnit.test('DevExpress namespaces', function(assert) {
    const namespaces = [
        'Color', // from core

        'data',
        'ui',
        'viz',
        'events'
    ];

    $.each(namespaces, function(index, namespace) {
        assert.ok(DevExpress[namespace], namespace + ' namespace');
    });

    assert.ok(DevExpress.utils.readyCallbacks, 'readyCallbacks namespace');
});

import './bundlesParts/core.tests.js';
import './bundlesParts/events.tests.js';
import './bundlesParts/data.tests.js';
import './bundlesParts/data.odata.tests.js';
import './bundlesParts/animation.tests.js';
import './bundlesParts/widgets-base.tests.js';
import './bundlesParts/widgets-web.tests.js';
