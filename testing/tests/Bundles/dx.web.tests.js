var $ = require('jquery'),
    angular = require('angular');

require('bundles/dx.web.js');

QUnit.test('DevExpress namespaces', function(assert) {
    var namespaces = [
            'Color', // from core

            'data',
            'ui',
            'events'
        ],
        uiNamespaces = [
            'dxList', // from widgets-base
        ];

    $.each(namespaces, function(index, namespace) {
        assert.ok(DevExpress[namespace], namespace + ' namespace');
    });

    $.each(uiNamespaces, function(index, namespace) {
        assert.ok(DevExpress.ui[namespace], 'ui.' + namespace + ' namespace');
    });

    assert.ok(angular.module('dx'), 'angular integration');
});

require('./bundlesParts/core.tests.js');
require('./bundlesParts/events.tests.js');
require('./bundlesParts/data.tests.js');
require('./bundlesParts/data.odata.tests.js');
require('./bundlesParts/animation.tests.js');
require('./bundlesParts/widgets-base.tests.js');
require('./bundlesParts/widgets-web.tests.js');
