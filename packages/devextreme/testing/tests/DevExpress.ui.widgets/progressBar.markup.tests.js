import $ from 'jquery';

import 'ui/progress_bar';

import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="progressbar"></div>';

    $('#qunit-fixture').html(markup);
});

function toSelector(text) {
    return '.' + text;
}

const PROGRESSBAR_CLASS = 'dx-progressbar';
const PROGRESSBAR_CONTAINER_CLASS = 'dx-progressbar-container';
const PROGRESSBAR_RANGE_CLASS = 'dx-progressbar-range';
const PROGRESSBAR_WRAPPER_CLASS = 'dx-progressbar-wrapper';
const PROGRESSBAR_STATUS_CLASS = 'dx-progressbar-status';
const PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER = 'dx-progressbar-animating-container';
const PROGRESSBAR_INDETERMINATE_SEGMENT = 'dx-progressbar-animating-segment';

QUnit.module('ProgressBar markup', {
    beforeEach: function() {
        this.$element = $('#progressbar');
    }
}, () => {
    QUnit.test('rendered markup', function(assert) {
        assert.expect(5);

        const $progressBar = this.$element.dxProgressBar();

        assert.ok($progressBar.hasClass(PROGRESSBAR_CLASS), 'ProgressBar initialized');
        assert.equal($progressBar.find(toSelector(PROGRESSBAR_CONTAINER_CLASS)).length, 1, 'Container has been created');
        assert.equal($progressBar.find(toSelector(PROGRESSBAR_RANGE_CLASS)).length, 1, 'Range has been created');
        assert.equal($progressBar.find(toSelector(PROGRESSBAR_WRAPPER_CLASS)).length, 1, 'Wrapper div has been created');
        assert.equal($progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS)).length, 1, 'Status div has been created');
    });

    QUnit.test('showStatus test', function(assert) {
        assert.expect(2);

        const $progressBar = this.$element.dxProgressBar({
            showStatus: false
        });
        const progressBar = $progressBar.dxProgressBar('instance');

        assert.equal($progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS)).length, 0, 'Status div hasn\'t been created');

        progressBar.option('showStatus', true);
        assert.equal($progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS)).length, 1, 'Status div has been added');
    });

    QUnit.test('value display in status', function(assert) {
        const $progressBar = this.$element.dxProgressBar({
            value: 10
        });
        const progressBar = $progressBar.dxProgressBar('instance');
        const $status = $progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS));

        assert.equal($status.text(), 'Progress: ' + progressBar.option('value') + '%', 'status text is right');
    });

    QUnit.test('custom status format', function(assert) {
        const $progressBar = this.$element.dxProgressBar({
            value: 10,
            statusFormat: function(value) {
                return 'Customised value: ' + value * 100;
            }
        });
        const progressBar = $progressBar.dxProgressBar('instance');
        const $status = $progressBar.find(toSelector(PROGRESSBAR_STATUS_CLASS));
        assert.equal($status.text(), 'Customised value: ' + progressBar.option('value'), 'status text is right');
    });

    QUnit.test('appropriate class should be added depending on the \'statusPosition\' option', function(assert) {
        const possiblePositions = [
            'left', 'right', 'bottom left', 'bottom right', 'bottom center', 'top left', 'top right', 'top center'
        ];

        const $progressBar = this.$element.dxProgressBar({}); const progressBar = $progressBar.dxProgressBar('instance'); const $wrapper = $progressBar.find('.' + PROGRESSBAR_WRAPPER_CLASS);

        $.each(possiblePositions, function(_, position) {
            progressBar.option('statusPosition', position);

            const splitPosition = position.split(' ');
            let className = 'dx-position-' + splitPosition[0];

            if(splitPosition[1]) {
                className += '-' + splitPosition[1];
            }

            assert.ok($wrapper.hasClass(className), 'wrapper correct class for the \'' + position + '\' position');
        });
    });

    QUnit.test('render indeterminate state on init', function(assert) {
        assert.expect(2);

        const $progressBar = this.$element.dxProgressBar({
            value: null
        });
        const progressBar = $progressBar.dxProgressBar('instance');

        const renderedIndeterminateSegmentsCount = $progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT)).length;
        const defaultSegmentCount = progressBar.option('_animatingSegmentCount');

        assert.equal($progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT_CONTAINER)).length, 1, 'Segment wrapper has been created');
        assert.equal(renderedIndeterminateSegmentsCount, defaultSegmentCount, 'Segments have been created');
    });

    QUnit.test('render indeterminate state with default option segments count', function(assert) {
        const $progressBar = this.$element.dxProgressBar({
            value: undefined,
            showStatus: false
        });
        const progressBar = $progressBar.dxProgressBar('instance');

        const renderedIndeterminateSegmentsCount = $progressBar.find(toSelector(PROGRESSBAR_INDETERMINATE_SEGMENT)).length;
        const defaultSegmentCount = progressBar.option('_animatingSegmentCount');

        assert.equal(renderedIndeterminateSegmentsCount, defaultSegmentCount, 'dxProgressBar have been created with correct segment count');
    });

    QUnit.test('render progressbar with max value on init', function(assert) {
        this.$element.dxProgressBar({
            value: 100,
            max: 100
        });

        assert.ok(true, 'progress bar has been rendered');
    });
});

QUnit.module('aria accessibility', () => {
    QUnit.test('aria attributes should be correct on init', function(assert) {
        const $element = $('#progressbar').dxProgressBar({
            min: 0,
            max: 50,
            value: 0
        });

        assert.strictEqual($element.attr('aria-valuemin'), 0, 'min value');
        assert.strictEqual($element.attr('aria-valuemax'), 50, 'max value');
        assert.strictEqual($element.attr('aria-valuenow'), 0, 'current value');
        assert.strictEqual($element.attr('aria-live'), 'polite', 'aria-live attribute');
        assert.strictEqual($element.attr('aria-label'), 0, 'aria-label attribute');
        assert.strictEqual($element.attr('role'), 'progressbar', 'aria role');
    });

    QUnit.test('aria properties should be correct after options changed', function(assert) {
        const $element = $('#progressbar').dxProgressBar({
            min: 32,
            max: 137,
            value: 58
        });
        const instance = $element.dxProgressBar('instance');

        instance.option({
            min: 33,
            max: 138,
            value: 59
        });

        assert.strictEqual($element.attr('aria-valuemin'), 33, 'min value is changed correctly');
        assert.strictEqual($element.attr('aria-valuemax'), 138, 'max value is changed correctly');
        assert.strictEqual($element.attr('aria-valuenow'), 59, 'current value is changed correctly');
        assert.strictEqual($element.attr('aria-live'), 'polite', 'aria-live attribute');
        assert.strictEqual($element.attr('aria-label'), 59, 'aria-label attribute is changed correctly');
        assert.strictEqual($element.attr('role'), 'progressbar', 'aria role');
    });
});

