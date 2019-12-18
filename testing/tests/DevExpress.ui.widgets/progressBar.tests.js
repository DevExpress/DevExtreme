var $ = require('jquery'),
    fx = require('animation/fx');

require('ui/progress_bar');
require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="qunit-fixture">\
            <div class="dx-viewport">\
                <div id="container">\
                    <div id="progressbar"></div>\
                </div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

function toSelector(text) {
    return '.' + text;
}

var PROGRESSBAR_CLASS = 'dx-progressbar',
    PROGRESSBAR_CONTAINER_CLASS = 'dx-progressbar-container',
    PROGRESSBAR_STATUS_CLASS = 'dx-progressbar-status',
    PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER = 'dx-progressbar-animating-container',
    PROGRESSBAR_INDETERMINATE_SEGMENT = 'dx-progressbar-animating-segment';

QUnit.module('default', {
    beforeEach: function() {
        this.$element = $('#progressbar');
    }
});

QUnit.test('onContentReady fired after the widget is fully ready', function(assert) {
    assert.expect(1);

    this.$element.dxProgressBar({
        onContentReady: function(e) {
            assert.ok($(e.element).hasClass(PROGRESSBAR_CLASS));
        }
    });
});

QUnit.module('options', {
    beforeEach: function() {
        this.$element = $('#progressbar');
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('correct value display in status after option changed', function(assert) {
    var $progressBar = this.$element.dxProgressBar({
            value: 10
        }),
        progressBar = $progressBar.dxProgressBar('instance'),
        $status = $progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS));

    progressBar.option('value', 30);
    assert.equal($status.text(), 'Progress: ' + progressBar.option('value') + '%', 'status text has been change right');
});

QUnit.test('custom status format', function(assert) {
    assert.expect(6);

    var $progressBar = this.$element.dxProgressBar({
            value: 10,
            statusFormat: function(value) {
                return 'Customised value: ' + value * 100;
            }
        }),
        progressBar = $progressBar.dxProgressBar('instance'),
        $status = $progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS));
    assert.equal($status.text(), 'Customised value: ' + progressBar.option('value'), 'status text is right');

    progressBar.option('value', 50);
    assert.equal($status.text(), 'Customised value: ' + progressBar.option('value'), 'status text has been change right');

    progressBar.option('statusFormat', function(ratio) {
        return 'New customised value: ' + ratio * 100;
    });
    assert.equal($status.text(), 'New customised value: ' + progressBar.option('value'), 'status text has been change right with ratio');

    progressBar.option('statusFormat', function(ratio, value) {
        return 'New customised value: ' + value;
    });
    assert.equal($status.text(), 'New customised value: ' + progressBar.option('value'), 'status text has been change right with value');

    progressBar.option({
        min: 50,
        max: 150
    });
    assert.equal($status.text(), 'New customised value: ' + progressBar.option('value'), 'status text has been change right with value after set new min/max');

    progressBar.option('statusFormat', function(ratio) {
        return 'New customised value: ' + ratio * 100;
    });
    assert.equal($status.text(), 'New customised value: ' + 0, 'status text has been change right with ratio after set new min/max');
});

QUnit.test('complete fired after max setting', function(assert) {
    assert.expect(4);

    var completeActionFired = 0,
        progressBar = this.$element.dxProgressBar({
            onComplete: function() { completeActionFired++; }
        }).dxProgressBar('instance');

    progressBar.option('value', 99);
    assert.equal(completeActionFired, 0, 'complete does not fired');

    progressBar.option('value', 100);
    assert.equal(completeActionFired, 1, 'complete is fired');

    progressBar.option('value', 50);
    assert.equal(completeActionFired, 1, 'complete does not fired');

    progressBar.option('max', 40);
    assert.equal(completeActionFired, 2, 'complete is fired');
});

QUnit.test('complete option changed', function(assert) {
    assert.expect(6);

    var firstCompleteActionFired = 0,
        secondCompleteActionFired = 0,
        progressBar = this.$element.dxProgressBar({
            onComplete: function() { firstCompleteActionFired++; }
        }).dxProgressBar('instance');

    progressBar.option('value', 100);
    assert.equal(firstCompleteActionFired, 1, 'first CompleteActionFired is fired');
    assert.equal(secondCompleteActionFired, 0, 'second CompleteActionFired does not fired');

    progressBar.option('value', 50);
    progressBar.option('onComplete', function() { secondCompleteActionFired++; });
    assert.equal(firstCompleteActionFired, 1, 'first CompleteActionFired is fired');
    assert.equal(secondCompleteActionFired, 0, 'second CompleteActionFired does not fired');

    progressBar.option('value', 100);
    assert.equal(firstCompleteActionFired, 1, 'first CompleteActionFired is fired');
    assert.equal(secondCompleteActionFired, 1, 'second CompleteActionFired is fired');
});

QUnit.module('states', {
    beforeEach: function() {
        this.$element = $('#progressbar');
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('render indeterminate state', function(assert) {
    assert.expect(5);

    var $progressBar = this.$element.dxProgressBar({
            value: 10
        }),
        progressBar = $progressBar.dxProgressBar('instance');

    var renderedIndeterminateSegmentContainersCount = $progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER)).length,
        renderedIndeterminateSegmentsCount = $progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT)).length,
        defaultSegmentCount = progressBar.option('_animatingSegmentCount');

    assert.equal(renderedIndeterminateSegmentContainersCount, 0, 'Segment wrapper has not been created');
    assert.equal(renderedIndeterminateSegmentsCount, 0, 'Segments have not been created');

    progressBar.option('value', null);

    assert.equal($progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER)).length, 1, 'Segment wrapper has been created');

    renderedIndeterminateSegmentsCount = $progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT)).length;
    assert.equal(renderedIndeterminateSegmentsCount, defaultSegmentCount, 'Segments have been created');

    assert.equal($progressBar.find(toSelector(PROGRESSBAR_CONTAINER_CLASS)).is(':visible'), false, 'progressbar container does not attached');
});

QUnit.module('aria accessibility');

QUnit.test('aria properties after options changed', function(assert) {
    var $element = $('#progressbar').dxProgressBar({
            min: 32,
            max: 137,
            value: 58
        }),
        instance = $element.dxProgressBar('instance');

    instance.option({
        min: 33,
        max: 138,
        value: 59
    });

    assert.equal($element.attr('aria-valuemin'), 33, 'min value is changed correctly');
    assert.equal($element.attr('aria-valuemax'), 138, 'max value is changed correctly');
    assert.equal($element.attr('aria-valuenow'), 59, 'current value is changed correctly');
});
