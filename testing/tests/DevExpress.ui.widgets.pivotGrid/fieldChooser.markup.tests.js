"use strict";

require("common.css!");
require("generic_light.css!");
require("ui/pivot_grid/ui.pivot_grid.field_chooser");

var $ = require("jquery"),
    windowUtils = require("core/utils/window"),
    fieldChooser,
    $container,
    clock,
    setupFieldChooser,
    dataSource;

QUnit.testStart(function() {
    var markup = '<div id="container"></div>';
    $("#qunit-fixture").html(markup);
});

var createMockDataSource = function(options) {
    $.each(options.fields || [], function(index, field) {
        field.index = index;
    });

    var stubDataSource = {
        getAreaFields: function(area) {
            return options[area + "Fields"] || [];
        },
        field: sinon.stub(),
        getFieldValues: function(index) {
            return $.Deferred().resolve(options.fieldValues[index]);
        },
        fields: function() {
            return options.fields;
        },
        load: sinon.stub(),
        on: sinon.stub(),
        off: sinon.stub(),
        isLoading: sinon.stub().returns(false)
    };

    return stubDataSource;
};

QUnit.module("dxPivotGridFieldChooser markup tests", {
    beforeEach: function() {
        setupFieldChooser = function(dataSourceOptions, fieldChooserOptions) {
            fieldChooserOptions = fieldChooserOptions || {};
            if(dataSourceOptions) {
                dataSource = createMockDataSource(dataSourceOptions);
                fieldChooserOptions.dataSource = dataSource;
            }
            fieldChooser = $container.dxPivotGridFieldChooser(dataSourceOptions, fieldChooserOptions).dxPivotGridFieldChooser("instance");
        };

        $container = $("#container");
        clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        clock.restore();
    }
});

QUnit.test("Init markup", function(assert) {
    // act
    setupFieldChooser();

    var $cols = $container.find(".dx-col"),
        $areas = $cols.find(".dx-area"),
        $headers = $areas.children(".dx-area-fields-header");

    // assert
    assert.ok(fieldChooser);
    assert.ok($container.hasClass("dx-pivotgridfieldchooser"), "container has dx-pivotgridfieldchooser class");
    assert.ok($container.hasClass("dx-pivotgrid-fields-container"), "container has dx-pivotgrid-fields-container class");
    assert.equal($cols.length, 2, "container has 2 columns");
    assert.equal($cols.find(".dx-area.dx-all-fields").length, 1, "all fields area");
    assert.equal($cols.eq(0).find(".dx-area").length, 2, "1st col areas count");
    assert.equal($cols.eq(1).find(".dx-area").length, 3, "2nd col areas count");
    assert.equal($headers.length, 5, "area headers count");
    assert.equal($headers.children(".dx-area-icon").length, 5, "areas has icons");
    assert.equal($headers.children(".dx-area-caption").length, 5, "areas has captions");
    assert.equal($areas.find(".dx-area-fields").children().length > 0, windowUtils.hasWindow(), "fields content");
});

QUnit.test("Empty DataSource", function(assert) {
    var dataSourceOptions = {};
    // act
    setupFieldChooser(dataSourceOptions);

    var $cols = $container.find(".dx-col"),
        $areas = $cols.find(".dx-area"),
        $headers = $areas.children(".dx-area-fields-header");

    // assert
    assert.ok(fieldChooser);
    assert.ok(dataSource);
    assert.ok($container.hasClass("dx-pivotgridfieldchooser"), "container has dx-pivotgridfieldchooser class");
    assert.ok($container.hasClass("dx-pivotgrid-fields-container"), "container has dx-pivotgrid-fields-container class");
    assert.equal($cols.length, 2, "container has 2 columns");
    assert.equal($cols.find(".dx-area.dx-all-fields").length, 1, "all fields area");
    assert.equal($cols.eq(0).find(".dx-area").length, 2, "1st col areas count");
    assert.equal($cols.eq(1).find(".dx-area").length, 3, "2nd col areas count");
    assert.equal($headers.length, 5, "area headers count");
    assert.equal($headers.children(".dx-area-icon").length, 5, "areas has icons");
    assert.equal($headers.children(".dx-area-caption").length, 5, "areas has captions");
    assert.equal($areas.find(".dx-area-fields").children().length > 0, windowUtils.hasWindow(), "fields content");
    assert.strictEqual(dataSource.load.callCount, 0);
});
