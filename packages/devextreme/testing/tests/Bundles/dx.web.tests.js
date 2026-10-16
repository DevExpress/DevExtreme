import $ from 'jquery';

import 'bundles/dx.web.js';

QUnit.test('DevExpress namespaces', function(assert) {
    const namespaces = [
        'Color', // from core

        'data',
        'ui',
        'events'
    ];
    const uiNamespaces = [
        'dxList', // from widgets-base
    ];

    $.each(namespaces, function(index, namespace) {
        assert.ok(DevExpress[namespace], namespace + ' namespace');
    });

    $.each(uiNamespaces, function(index, namespace) {
        assert.ok(DevExpress.ui[namespace], 'ui.' + namespace + ' namespace');
    });
});

import './bundlesParts/core.tests.js';
import './bundlesParts/events.tests.js';
import './bundlesParts/data.tests.js';
import './bundlesParts/data.odata.tests.js';
import './bundlesParts/animation.tests.js';
import './bundlesParts/widgets-base.tests.js';
import './bundlesParts/widgets-web.tests.js';
