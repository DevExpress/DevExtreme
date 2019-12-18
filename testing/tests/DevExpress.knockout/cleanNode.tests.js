require('integration/knockout');

var $ = require('jquery'),
    ko = require('knockout'),
    dataUtils = require('core/element_data');

var FIXTURE_ELEMENT = $('#qunit-fixture');

var setTestData = function($element) {
    dataUtils.data($element.get(0), '__test_key__', { key: 'value' });
    ko.utils.domData.set($element.get(0), '__test_key__', { key: 'value ' });
};

var hasKOTestData = function($element) {
    return ko.utils.domData.get($element.get(0), '__test_key__');
};

var hasJQueryTestData = function($element) {
    return dataUtils.data($element.get(0), '__test_key__');
};

var checkHasNoTestData = function($element, assert) {
    assert.ok(!hasKOTestData($element), 'element has no KO data');
    assert.ok(!hasJQueryTestData($element), 'element has no $ data');
};

QUnit.module('clean data on node removing', {
    beforeEach: function() {
        this.$element = $('<div>').appendTo(FIXTURE_ELEMENT);
    },
    afterEach: function() {
        this.$element.remove();
    }
});

QUnit.test('by $.remove', function(assert) {
    setTestData(this.$element);
    this.$element.remove();
    checkHasNoTestData(this.$element, assert);
});

QUnit.test('by $.empty', function(assert) {
    var $childElement = $('<div>').appendTo(this.$element);

    setTestData($childElement);
    this.$element.empty();
    checkHasNoTestData($childElement, assert);
});

QUnit.test('by $.html', function(assert) {
    var $childElement = $('<div>').appendTo(this.$element);

    setTestData($childElement);
    this.$element.html('123');
    checkHasNoTestData($childElement, assert);
});

// T266920
QUnit.test('by $.replaceWith', function(assert) {
    var $childElement = $('<div>').appendTo(this.$element);

    setTestData($childElement);
    this.$element.replaceWith($('<div>'));
    checkHasNoTestData($childElement, assert);
});

QUnit.test('by ko.cleanNode', function(assert) {
    var $childElement = $('<div>').appendTo(this.$element);

    setTestData($childElement);
    ko.cleanNode(this.$element.get(0));
    checkHasNoTestData($childElement, assert);
});

QUnit.test('by ko.removeNode', function(assert) {
    var $childElement = $('<div>').appendTo(this.$element);

    setTestData($childElement);
    ko.removeNode(this.$element.get(0));
    checkHasNoTestData(this.$element, assert);
});

if($.fn.jquery[0] !== '1') {
    QUnit.test('by ko.removeNode - cleanNode & cleanData should be called once per node', function(assert) {
        var markup = $(
            '<div id=\'i0\'>0' +
                '<div id=\'i00\'>00</div>' +
                '<div id=\'i01\'>01' +
                    '<div id=\'010\'>010</div>' +
                '</div>' +
            '</div>'
        ).appendTo(this.$element);

        markup.find('*').addBack().each(function() {
            dataUtils.data(this, 'dxTestData', true);
            ko.utils.domData.set(this, 'dxTestData', true);
        });

        var cleanDataLog = [],
            dataUtilsStrategy = dataUtils.getDataStrategy(),
            originalCleanData = dataUtilsStrategy.cleanData;

        dataUtilsStrategy.cleanData = function(nodes) {
            cleanDataLog.push.apply(cleanDataLog, nodes);
            return originalCleanData.apply(this, arguments);
        };

        var domDataClearLog = [],
            originalDomDataClear = ko.utils.domData.clear;
        ko.utils.domData.clear = function(node) {
            domDataClearLog.push(node);
            return originalDomDataClear.apply(this, arguments);
        };

        ko.removeNode(markup.get(0));
        assert.equal(cleanDataLog.length, 4, '$.cleanData should be called 4 times for each node');
        assert.equal(domDataClearLog.length, 4, 'ko.utils.domData.clear should be called 4 times once for each node');

        markup.find('*').addBack().each(function() {
            assert.ok(!$(this).data('dxTestData'));
            assert.ok(!ko.utils.domData.get(this, 'dxTestData'));
            assert.ok(!('cleanedByKo' in $(this).get(0)));
            assert.ok(!('cleanedByJquery' in $(this).get(0)));
        });

        dataUtilsStrategy.cleanData = originalCleanData;
        ko.utils.domData.clear = originalDomDataClear;
    });

    QUnit.test('by $.remove - cleanNode & cleanData should be called once per node', function(assert) {
        var markup = $(
            '<div id=\'i0\'>0' +
                '<div id=\'i00\'>00</div>' +
                '<div id=\'i01\'>01' +
                    '<div id=\'010\'>010</div>' +
                '</div>' +
            '</div>'
        ).appendTo(this.$element);

        markup.find('*').addBack().each(function() {
            dataUtils.data($(this)[0], 'dxTestData', true);
            ko.utils.domData.set(this, 'dxTestData', true);
        });

        var cleanDataLog = [],
            dataUtilsStrategy = dataUtils.getDataStrategy(),
            originalCleanData = dataUtilsStrategy.cleanData;

        dataUtilsStrategy.cleanData = function(nodes) {
            cleanDataLog.push.apply(cleanDataLog, nodes);
            return originalCleanData.apply(this, arguments);
        };

        var domDataClearLog = [],
            originalDomDataClear = ko.utils.domData.clear;
        ko.utils.domData.clear = function(node) {
            domDataClearLog.push(node);
            return originalDomDataClear.apply(this, arguments);
        };

        markup.remove();

        assert.equal(cleanDataLog.length, 4, '$.cleanData should be called 4 times for each node');
        assert.equal(domDataClearLog.length, 4, 'ko.utils.domData.clear should be called 4 times once for each node');

        markup.find('*').addBack().each(function() {
            assert.ok(!dataUtils.data($(this)[0], 'dxTestData'));
            assert.ok(!ko.utils.domData.get(this, 'dxTestData'));
            assert.ok(!('cleanedByKo' in $(this).get(0)));
            assert.ok(!('cleanedByJquery' in $(this).get(0)));
        });

        dataUtilsStrategy.cleanData = originalCleanData;
        ko.utils.domData.clear = originalDomDataClear;
    });
}

QUnit.test('by $.remove - second dom element removing should lead to data disposing', function(assert) {
    var $element = this.$element
        .data('test1', true)
        .remove()
        .appendTo(FIXTURE_ELEMENT);

    $element.data('test2', true);
    ko.utils.domData.set($element.get(0), 'test2', true);

    $element.remove();

    assert.ok(!$.hasData($element));
    assert.ok(!ko.utils.domData.get($element.get(0), 'test2'));
});

QUnit.test('by ko.removeNode - second dom element removing should lead to data disposing', function(assert) {
    var $element = this.$element.data('test1', true);

    ko.utils.domData.set($element.get(0), 'test1', true);
    ko.removeNode($element.get(0));

    $element.appendTo(FIXTURE_ELEMENT);

    $element.data('test2', true);
    ko.utils.domData.set($element.get(0), 'test2', true);

    ko.removeNode($element.get(0));

    assert.ok(!$.hasData($element));
    assert.ok(!ko.utils.domData.get($element.get(0), 'test2'));
});
