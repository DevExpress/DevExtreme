import { getOuterWidth, getOuterHeight } from 'core/utils/size';
import $ from 'jquery';
import keyboardMock from '../../helpers/keyboardMock.js';
import messageLocalization from 'localization/message';
import uiErrors from 'ui/widget/ui.errors';
import themes from 'ui/themes';
import fx from 'animation/fx';

import 'generic_light.css!';
import 'ui/load_panel';

QUnit.testStart(function() {
    const markup =
        '<div id="qunit-fixture" class="dx-viewport">\
            <div id="target">\
                <div id="container">\
                    <div id="loadPanel"></div>\
                    <div id="loadPanel2"></div>\
                </div>\
            </div>\
        </div>';

    $('#qunit-fixture').replaceWith(markup);

    $('#target').css({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100px',
        height: '100px'
    });

    $('#loadPanel').css({
        width: '100px',
        height: '100px'
    });
});

const LOADPANEL_CLASS = 'dx-loadpanel';
const LOADPANEL_MESSAGE_CLASS = 'dx-loadpanel-message';
const MESSAGE_SELECTOR = '.' + LOADPANEL_MESSAGE_CLASS;
const LOADPANEL_CONTENT_CLASS = 'dx-loadpanel-content';
const LOADPANEL_PANE_HIDDEN_CLASS = 'dx-loadpanel-pane-hidden';

QUnit.module('init', {
    beforeEach: function() {
        fx.off = true;
    },

    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('rendered markup', function(assert) {
        const $element = $('#loadPanel').dxLoadPanel({ message: 'Test Loading Message', visible: true }); const $content = $element.dxLoadPanel('instance').$content();

        assert.ok($element.hasClass(LOADPANEL_CLASS));
        assert.ok($content.hasClass(LOADPANEL_CONTENT_CLASS), 'Load Indicator created');
        assert.ok($content.find(MESSAGE_SELECTOR).length);
        assert.equal($content.find(MESSAGE_SELECTOR).text(), 'Test Loading Message');
    });

    QUnit.test('correct wrapper aria attributes load when showIndicator = false', function(assert) {
        const label = messageLocalization.format('Loading');
        const instance = $('#loadPanel').dxLoadPanel({ visible: true, showIndicator: false }).dxLoadPanel('instance');
        instance.option({ message: '' });

        assert.strictEqual(instance.$wrapper().attr('role'), 'alert');
        assert.strictEqual(instance.$wrapper().attr('aria-label'), label);
    });

    QUnit.test('wrapper aria attributes must not load when showIndicator = true', function(assert) {
        const instance = $('#loadPanel').dxLoadPanel({ visible: true, showIndicator: false });
        const wrapperAttributes = Array.from(instance[0].attributes).map(attr => attr.name);
        const expectedAttributes = ['role', 'aria-label'];

        assert.strictEqual(!expectedAttributes.every(item => wrapperAttributes.includes(item)), true);
    });

    QUnit.test('correct load indicator aria attributes load when showIndicator = true', function(assert) {
        const instance = $('#loadPanel').dxLoadPanel({ visible: true, showIndicator: true }).dxLoadPanel('instance');
        const label = messageLocalization.format('Loading');
        const indicatorAttributes = Array.from(instance._$indicator.prop('attributes')).map(attr => attr.name);
        const expectedAttributes = ['role', 'aria-label'];
        instance.option({ message: '' });

        assert.strictEqual(instance._$indicator[0].role, 'alert');
        assert.strictEqual(instance._$indicator[0].ariaLabel, label);
        assert.strictEqual(expectedAttributes.every(item => indicatorAttributes.includes(item)), true);
    });

    QUnit.test('role on wrapper', function(assert) {
        const instance = $('#loadPanel').dxLoadPanel({ visible: true }).dxLoadPanel('instance');
        instance.option({ message: '' });

        assert.strictEqual(instance.$wrapper().attr('role'), 'alert');
    });

    QUnit.test('aria-label on wrapper', function(assert) {
        const instance = $('#loadPanel').dxLoadPanel({ visible: true }).dxLoadPanel('instance');

        assert.strictEqual(instance.$wrapper().attr('aria-label'), undefined);

        instance.option({ message: '' });

        assert.strictEqual(instance.$wrapper().attr('aria-label'), 'Loading...');
    });

    QUnit.test('aria-label on wrapper in Material based themes', function(assert) {
        const origIsMaterial = themes.isMaterialBased;
        themes.isMaterialBased = () => true;

        try {
            const instance = $('#loadPanel').dxLoadPanel({ visible: true }).dxLoadPanel('instance');

            instance.option({ message: '' });

            assert.strictEqual(instance.$wrapper().attr('aria-label'), 'Loading...');

            instance.option({ message: 'custom' });

            assert.strictEqual(instance.$wrapper().attr('aria-label'), 'custom');
        } finally {
            themes.isMaterialBased = origIsMaterial;
        }
    });

    QUnit.test('load panel created with templatesRenderAsynchronously option should be shown with delay', function(assert) {
        const clock = sinon.useFakeTimers();
        try {
            const onShowingSpy = sinon.spy();

            const instance = $('#loadPanel').dxLoadPanel({
                templatesRenderAsynchronously: true,
                visible: true,
                onShowing: onShowingSpy
            }).dxLoadPanel('instance');

            assert.strictEqual(instance.option('templatesRenderAsynchronously'), true, 'templatesRenderAsynchronously option can be reassigned (T896267)');
            assert.strictEqual(onShowingSpy.called, false);
            clock.tick(10);
            assert.strictEqual(onShowingSpy.called, true);
        } finally {
            clock.restore();
        }
    });

    QUnit.test('shows on init if loading option is true', function(assert) {
        $('#loadPanel').dxLoadPanel({ message: 'Test Loading Message', visible: true });
        assert.ok($('#loadPanel').is(':visible'));
    });

    QUnit.test('visible changes visibility', function(assert) {
        const $loadPanel = $('#loadPanel').dxLoadPanel({
            message: '',
            visible: false
        });
        const loadPanel = $loadPanel.dxLoadPanel('instance');
        const $content = loadPanel.$content();

        assert.ok(!$content.is(':visible'));

        loadPanel.option('visible', false);
        assert.ok(!$content.is(':visible'));

        loadPanel.option('visible', true);
        assert.ok($content.is(':visible'));

        loadPanel.option('visible', false);
        assert.ok($content.is(':hidden'));
    });

    QUnit.test('visible changes visibility option', function(assert) {
        const element = $('#loadPanel2').dxLoadPanel({
            visible: false,
            message: 'Text'
        });
        const $content = element.dxLoadPanel('instance').$content();

        const loadIndicator = element.dxLoadPanel('instance');

        assert.ok(!$content.is(':visible'));

        loadIndicator.option('visible', false);
        assert.ok(!$content.is(':visible'));

        loadIndicator.option('visible', true);
        assert.ok($content.is(':visible'));

        loadIndicator.option('visible', false);
        assert.ok($content.is(':hidden'));
    });

    QUnit.test('keep user defined position.of', function(assert) {
        const instance = $('#loadPanel').dxLoadPanel({
            targetContainer: '#container',
            position: { of: 'body' }
        }).dxLoadPanel('instance');

        assert.equal(instance.option('position.of'), 'body');
    });

    QUnit.test('widget should be rendered with non-existing target in position', function(assert) {
        assert.expect(0);

        $('#loadPanel').dxLoadPanel({
            visible: true,
            position: { of: '#non-exist' }
        }).dxLoadPanel('instance');
    });

    QUnit.module('Breaking change t1123711 - warning W1021', () => {
        QUnit.test('should be logged if container is invalid', function(assert) {
            sinon.spy(uiErrors, 'log');

            try {
                $('#loadPanel').dxLoadPanel({
                    container: 'invalid',
                    visible: true
                });

                assert.ok(uiErrors.log.calledOnce, 'only one warning is logged');
                assert.deepEqual(uiErrors.log.lastCall.args, [
                    'W1021',
                    'dxLoadPanel',
                ], 'args of the log method');
            } finally {
                uiErrors.log.restore();
            }
        });

        QUnit.test('should not not be logged if container is valid', function(assert) {
            sinon.spy(uiErrors, 'log');

            try {
                $('#loadPanel').dxLoadPanel({
                    container: 'body',
                    visible: true
                });

                assert.ok(uiErrors.log.notCalled, 'no warning is logged');
            } finally {
                uiErrors.log.restore();
            }
        });
    });
});

QUnit.module('options changed callbacks', {
    beforeEach: function() {
        this.element = $('#loadPanel').dxLoadPanel();
        this.instance = this.element.dxLoadPanel('instance');
    }
}, () => {
    QUnit.test('message', function(assert) {
        this.instance.option('message', 'new message');
        this.instance.show();
        assert.equal(this.instance.$content().text(), 'new message');
    });

    QUnit.test('width/height', function(assert) {
        this.instance.option('visible', true);
        this.instance.option('width', 123);
        assert.equal(getOuterWidth(this.instance.$content()), 123);

        this.instance.option('height', 321);
        assert.equal(getOuterHeight(this.instance.$content()), 321);
    });

    QUnit.test('showIndicator option', function(assert) {
        const instance = this.element
            .dxLoadPanel({ showIndicator: false })
            .dxLoadPanel('instance');

        let indicator = instance.$content().find('.dx-loadindicator');
        instance.show();

        assert.equal(indicator.length, 0, 'indicator is hidden');

        instance.option('showIndicator', true);
        indicator = instance.$content().find('.dx-loadindicator');
        assert.equal(indicator.length, 1, 'indicator is shown');

        instance.option('showIndicator', false);
        indicator = instance.$content().find('.dx-loadindicator');
        assert.equal(indicator.length, 0, 'indicator is hidden');
    });

    QUnit.test('showIndicator option change to true after change to false should render loadIndicator (T943765)', function(assert) {
        const instance = this.element
            .dxLoadPanel({
                showIndicator: true,
                visible: true
            })
            .dxLoadPanel('instance');


        instance.option('showIndicator', false);
        instance.option('showIndicator', true);

        const indicator = instance.$content().find('.dx-loadindicator');
        assert.equal(indicator.length, 1, 'indicator is shown');
    });

    QUnit.test('message option change should not hide loadIndicator (T943765)', function(assert) {
        const instance = this.element
            .dxLoadPanel({
                showIndicator: true,
                visible: true
            })
            .dxLoadPanel('instance');

        instance.option('message', 'new message');

        const indicator = instance.$content().find('.dx-loadindicator');
        assert.equal(indicator.length, 1, 'indicator is shown');
    });

    QUnit.test('showPane option', function(assert) {
        const instance = this.element
            .dxLoadPanel({ showPane: true })
            .dxLoadPanel('instance');

        assert.ok(!instance.$content().hasClass(LOADPANEL_PANE_HIDDEN_CLASS));

        instance.option('showPane', false);

        assert.ok(instance.$content().hasClass(LOADPANEL_PANE_HIDDEN_CLASS));

        instance.option('showPane', true);

        assert.ok(!instance.$content().hasClass(LOADPANEL_PANE_HIDDEN_CLASS));
    });

    QUnit.test('LoadPanel with custom indicator', function(assert) {
        const url = '../../testing/content/customLoadIndicator.png';
        const instance = this.element
            .dxLoadPanel({
                showIndicator: true,
                indicatorSrc: url
            })
            .dxLoadPanel('instance');
        instance.show();

        const loadIndicatorInstance = this.instance.$content().find('.dx-loadindicator').dxLoadIndicator().dxLoadIndicator('instance');

        assert.equal(loadIndicatorInstance.option('indicatorSrc'), url, 'custom indicator option installed successfully');
        instance.option('indicatorSrc', '');
        assert.equal(instance.option('indicatorSrc'), loadIndicatorInstance.option('indicatorSrc'), 'custom indicator option changed successfully');
    });

    QUnit.test('indicatorSrc option change', function(assert) {
        const url = '../../testing/content/customLoadIndicator.png';
        const instance = this.element
            .dxLoadPanel({
                showIndicator: true
            })
            .dxLoadPanel('instance');
        instance.show();

        instance.option('indicatorSrc', url);

        const loadIndicatorInstance = this.instance.$content().find('.dx-loadindicator').dxLoadIndicator().dxLoadIndicator('instance');

        assert.strictEqual(loadIndicatorInstance.option('indicatorSrc'), url, 'custom indicator option installed successfully');
        instance.option('indicatorSrc', '');
        assert.equal(instance.option('indicatorSrc'), loadIndicatorInstance.option('indicatorSrc'), 'custom indicator option changed successfully');
    });

    QUnit.test('indicatorSrc option change when showIndicator is false', function(assert) {
        const url = '../../testing/content/customLoadIndicator.png';
        const instance = this.element
            .dxLoadPanel({})
            .dxLoadPanel('instance');

        instance.show();
        instance.option('indicatorSrc', url);
        instance.option('showIndicator', true);

        const loadIndicatorInstance = this.instance.$content().find('.dx-loadindicator').dxLoadIndicator().dxLoadIndicator('instance');

        assert.strictEqual(loadIndicatorInstance.option('indicatorSrc'), url, 'custom indicator option installed successfully');
    });

    QUnit.test('Load panel should not close on esc button when focusStateEnabled is true', function(assert) {
        const instance = this.element
            .dxLoadPanel({
                focusStateEnabled: true,
                width: 1,
                height: 1,
                visible: true
            }).dxLoadPanel('instance');
        const keyboard = keyboardMock(instance.$content());

        keyboard.keyDown('esc');

        assert.ok(instance.option('visible'), 'load panel stay visible after esc press');
    });

    QUnit.testInActiveWindow('Load panel with shading should grabbing focus from inputs under the shading when focusStateEnabled is true', function(assert) {
        const $input = $('<input/>').val('');

        try {
            const instance = this.element
                .dxLoadPanel({
                    focusStateEnabled: true,
                    shading: true,
                    delay: 0,
                    width: 1,
                    height: 1
                }).dxLoadPanel('instance');

            $input.appendTo('body');
            $input.focus().focusin();
            instance.show();

            assert.equal(document.activeElement, instance.$content().get(0), 'load panel is focused');
        } finally {
            $input.remove();
        }
    });
});

QUnit.module('delay', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
}, () => {
    QUnit.test('option \'delay\' delays showing', function(assert) {
        const delayTimeout = 500;

        const $loadPanel = $('#loadPanel').dxLoadPanel({
            delay: delayTimeout
        });

        $loadPanel.dxLoadPanel('show');
        const $content = $loadPanel.dxLoadPanel('$content');

        assert.equal($content.is(':visible'), false, 'load panel showing delayed');

        this.clock.tick(delayTimeout);

        assert.equal($content.is(':visible'), true, 'load panel shown after delay');
    });

    QUnit.test('onShowing and onShown action delayed', function(assert) {
        let showingFired = 0;
        let shownFired = 0;
        const delayTimeout = 500;

        const $loadPanel = $('#loadPanel').dxLoadPanel({
            delay: delayTimeout,
            animation: null,
            onShowing: function() {
                showingFired++;
            },
            onShown: function() {
                shownFired++;
            }
        });

        $loadPanel.dxLoadPanel('show');

        assert.equal(showingFired, 0, 'showing action was not fired');
        assert.equal(shownFired, 0, 'shown action was not fired');

        this.clock.tick(delayTimeout);

        assert.equal(showingFired, 1, 'showing action was fired after delay timeout');
        assert.equal(shownFired, 1, 'shown action was fired after delay timeout');
    });

    QUnit.test('hiding rejects delayed showing', function(assert) {
        const delayTimeout = 500;

        const $loadPanel = $('#loadPanel').dxLoadPanel({
            delay: delayTimeout
        });
        const $content = $loadPanel.dxLoadPanel('$content');

        $loadPanel.dxLoadPanel('show');
        $loadPanel.dxLoadPanel('hide');

        this.clock.tick(delayTimeout);

        assert.equal($content.is(':visible'), false, 'load panel was not shown after hide');
    });
});

QUnit.module('default options', {
    beforeEach: function() {
        this.element = $('#loadPanel').dxLoadPanel({});
        this.instance = this.element.dxLoadPanel('instance');
    }
}, () => {
    QUnit.test('"propagateOutsideClick" option by default should be set to true (T1085638)', function(assert) {
        assert.ok(this.instance.option('propagateOutsideClick'), true);
    });
});

