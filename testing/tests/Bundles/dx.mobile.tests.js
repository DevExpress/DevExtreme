var $ = require("jquery"),
    angular = require("angular");

require("bundles/dx.mobile.js");

QUnit.test("DevExpress namespaces", function(assert) {
    var namespaces = [
        "Color", // from core

        "data",
        "ui",
        "events"
    ];

    $.each(namespaces, function(index, namespace) {
        assert.ok(DevExpress[namespace], namespace + " namespace");
    });

    assert.ok(angular.module("dx"), "angular integration");
});

require("./bundlesParts/core.tests.js");
require("./bundlesParts/events.tests.js");
require("./bundlesParts/data.tests.js");
require("./bundlesParts/data.odata.tests.js");
require("./bundlesParts/animation.tests.js");
require("./bundlesParts/widgets-base.tests.js");
require("./bundlesParts/widgets-mobile.tests.js");
