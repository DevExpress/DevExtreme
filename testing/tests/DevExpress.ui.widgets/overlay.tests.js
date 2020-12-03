import fx from 'animation/fx';
import positionUtils from 'animation/position';
import { locate } from 'animation/translator';
import 'common.css!';
import 'generic_light.css!';
import config from 'core/config';
import devices from 'core/devices';
import { Template } from 'core/templates/template';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { isRenderer } from 'core/utils/type';
import { value as viewPort } from 'core/utils/view_port';
import eventsEngine from 'events/core/events_engine';
import visibilityChange, { triggerHidingEvent, triggerShownEvent } from 'events/visibility_change';
import $ from 'jquery';
import { hideCallback as hideTopOverlayCallback } from 'mobile/hide_callback';
import Overlay from 'ui/overlay';
import * as zIndex from 'ui/overlay/z_index';
import 'ui/scroll_view/ui.scrollable';
import selectors from 'ui/widget/selectors';
import swatch from 'ui/widget/swatch_container';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';

QUnit.testStart(function() {
    const markup =
        '<style>\
            html, body {\
                height: 100%;\
                margin: 0;\
            }\
            \
            #qunit-fixture {\
                width: 100%;\
                height: 100%;\
            }\
        </style>\
        \
        <div id="overlayInTargetContainer"></div>\
        \
        <div id="customTargetContainer">\
            <div id="parentContainer">\
                <input id="overlayInputTarget" type="text" />\
                <div id="overlay"></div>\
                <div id="overlay2">\
                    <div id="test"></div>\
                </div>\
            </div>\
        </div>\
        \
        <div id="container"></div>\
        \
        <div id="overlayWithClass" class="something another"></div>\
        \
        <div id="overlayWithAnonymousTmpl">\
            <div id="content"></div>\
        </div>\
        \
        <div id="B237292">\
            <div id="B237292_container" style="width: 100px; height: 100px"></div>\
        \
            <div id="B237292_overlay">\
                Overlay content\
            </div>\
        </div>\
        \
        <div id="Q518355">\
            <div id="Q518355_overlay_1"></div>\
            <div id="Q518355_overlay_2"></div>\
        </div>\
        \
        <div id="overlayWithContentTemplate">\
            <div data-options="dxTemplate: { name: \'custom\' }">\
                TestContent\
            </div>\
        </div>\
        \
        <div id="overlayWithWrongTemplateName">\
            <div data-options="dxTemplate: { name: \'wrongName\' }">testContent</div>\
        </div>\
        <div id="widget"></div>\
        \
        <script type="text/html" id="focusableTemplate">\
            <a>something</a>\
            <input class="firstTabbable" />\
            <div tabindex=\'0\'></div>\
            <textarea></textarea>\
            <div tabindex=\'-1\'></div>\
            <a href="#" class="lastTabbable">something</a>\
        </script>\
        <input class="outsideTabbable" />\
        \
        <div>\
            <div class="dx-swatch-my-color_scheme1 some-class some-class2">\
                <div>\
                    <div id="swatchOverlay1"></div>\
                </div>\
            </div>\
            <div class="some-class some-class2 dx-swatch-my-color_scheme2 some-class3">\
                <div>\
                    <div id="swatchOverlay2"></div>\
                    <div id="swatchOverlay3"></div>\
                </div>\
            </div>\
        <div>';

    $('#qunit-fixture').html(markup);
});

const OVERLAY_CLASS = 'dx-overlay';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_SHADER_CLASS = 'dx-overlay-shader';
const OVERLAY_MODAL_CLASS = 'dx-overlay-modal';
const INNER_OVERLAY_CLASS = 'dx-inner-overlay';

const HOVER_STATE_CLASS = 'dx-state-hover';
const DISABLED_STATE_CLASS = 'dx-state-disabled';

const RESIZABLE_HANDLE_TOP_CLASS = 'dx-resizable-handle-top';
const RESIZABLE_HANDLE_CORNER_BR_CLASS = 'dx-resizable-handle-corner-bottom-right';

const VIEWPORT_CLASS = 'dx-viewport';

const viewport = function() { return $(toSelector(VIEWPORT_CLASS)); };

const toSelector = (cssClass) => `.${cssClass}`;

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        zIndex.clearStack();
        Overlay.baseZIndex(1500);
        fx.off = false;
    }
};

const { test, module: testModule } = QUnit;

viewPort($('#qunit-fixture').addClass(VIEWPORT_CLASS));

testModule('render', moduleConfig, () => {
    test('overlay class should be added to overlay', function(assert) {
        const $element = $('#overlay').dxOverlay();
        assert.ok($element.hasClass(OVERLAY_CLASS));
    });

    test('inner overlay class should depend on innerOverlay option', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            innerOverlay: true
        }).dxOverlay('instance');
        const $content = $(overlay.content());

        assert.ok($content.hasClass(INNER_OVERLAY_CLASS));

        overlay.option('innerOverlay', false);
        assert.notOk($content.hasClass(INNER_OVERLAY_CLASS));
    });

    test('content should be present when widget instance exists', function(assert) {
        const $element = $('#overlay').dxOverlay();
        const instance = $element.dxOverlay('instance');

        assert.ok($(toSelector(OVERLAY_CONTENT_CLASS)).length);

        instance._dispose();
        assert.ok(!$(toSelector(OVERLAY_CONTENT_CLASS)).length);
    });

    test('overlay should use default template when element with data-options has not dxTemplate params (B253554)', function(assert) {
        assert.expect(0);

        $('#overlay')
            .append('<div data-options="dxTest : { } ">123</div></div>')
            .appendTo('#qunit-fixture')
            .dxOverlay({
                visible: true
            });
    });

    test('overlay should not crash on window resize (B253397)', function(assert) {
        assert.expect(0);

        $('<div />')
            .dxOverlay({
                visible: true,

                width: 500,
                height: 500,

                onContentReady: function() {
                    resizeCallbacks.fire();
                    $(toSelector(OVERLAY_CONTENT_CLASS)).width();
                    resizeCallbacks.fire();
                }
            }).remove();
    });

    test('overlay created with templatesRenderAsynchronously option should be shown with delay', function(assert) {
        const clock = sinon.useFakeTimers();
        try {
            const onShowingSpy = sinon.spy();

            $('#overlay').dxOverlay({
                templatesRenderAsynchronously: true,
                visible: true,
                onShowing: onShowingSpy
            });

            assert.strictEqual(onShowingSpy.called, false);
            clock.tick();
            assert.strictEqual(onShowingSpy.called, true);
        } finally {
            clock.restore();
        }
    });

    test('overlay created with templatesRenderAsynchronously option should not be shown after delay if it was hidden before', function(assert) {
        const clock = sinon.useFakeTimers();
        try {
            const overlay = new Overlay($('#overlay'), {
                templatesRenderAsynchronously: true,
                visible: true
            });
            overlay.hide();
            clock.tick();
            assert.strictEqual(overlay.$content().is(':visible'), false);
        } finally {
            clock.restore();
        }
    });

    test('overlay should have hover class on content', function(assert) {
        const element = $('#overlay').dxOverlay({
            hoverStateEnabled: true,
            visible: true
        });
        const instance = element.dxOverlay('instance');
        const $content = $(instance.$content());

        $($content).trigger('dxhoverstart');
        assert.ok($content.hasClass(HOVER_STATE_CLASS));
    });

    test('overlay should stop animation on window resize', function(assert) {
        const originalFxStop = fx.stop;

        try {
            $('#overlay').dxOverlay({
                visible: true
            });

            let stopExecuted = false;
            fx.stop = () => {
                stopExecuted = true;
            };
            resizeCallbacks.fire();
            assert.ok(stopExecuted, 'animation stopped');

        } finally {
            fx.stop = originalFxStop;
        }
    });

    test('default', function(assert) {
        const instance = $('#overlay').dxOverlay().dxOverlay('instance');
        const $content = $(instance.$content());

        assert.ok(!$content.is(':visible'));
        assert.ok(!viewport().children(toSelector(OVERLAY_SHADER_CLASS)).is(':visible'));
        assert.ok($content.width() < $(window).width());
        assert.ok($content.height() < $(window).height());
    });

    test('RTL markup - rtlEnabled by default', function(assert) {
        const overlay = $('#overlay').dxOverlay({ rtlEnabled: true }).dxOverlay('instance');

        overlay.show();

        const $content = $(overlay.$content());

        assert.ok($content.hasClass('dx-rtl'));
    });

    test('Color swatches - overlay should be rendered on viewport by default', function(assert) {
        const overlay = $('#overlay').dxOverlay().dxOverlay('instance');
        overlay.show();
        const $wrapper = overlay.$content().parent();
        assert.ok($wrapper.parent().hasClass(VIEWPORT_CLASS));
    });

    test('Color swatches - overlay should be rendered on the child of viewport with special class', function(assert) {
        const containers = [];

        for(let i = 1; i <= 3; i++) {
            const overlay = $('#swatchOverlay' + i).dxOverlay().dxOverlay('instance');
            overlay.show();
            containers[i] = overlay.$content().parent().parent();
        }

        assert.ok(containers[1].hasClass('dx-swatch-my-color_scheme1'), 'overlay\'s container has right class');
        assert.ok(containers[1].parent().hasClass(VIEWPORT_CLASS), 'overlay\'s container is the viewport\'s child');

        assert.ok(containers[2].hasClass('dx-swatch-my-color_scheme2'), 'overlay\'s container has right class');
        assert.ok(containers[2].parent().hasClass(VIEWPORT_CLASS), 'overlay\'s container is the viewport\'s child');

        assert.ok(containers[3].hasClass('dx-swatch-my-color_scheme2'), 'overlay\'s container has right class');
        assert.ok(containers[3].parent().hasClass(VIEWPORT_CLASS), 'overlay\'s container is the viewport\'s child');

        assert.strictEqual($(`.${VIEWPORT_CLASS} > .dx-swatch-my-color_scheme2`).length, 1, 'one container for different overlays from the same swatch');
    });

    test('Color swatches - overlay should be rendered on the child of viewport with special class if its element attached after creation', function(assert) {
        const detachedContainer = $('<div>');
        const overlay = detachedContainer.dxOverlay().dxOverlay('instance');
        detachedContainer.appendTo('.dx-swatch-my-color_scheme1 > div');
        overlay.show();

        const overlayContainer = overlay.$content().parent().parent();

        assert.ok(overlayContainer.hasClass('dx-swatch-my-color_scheme1'), 'overlay\'s container has right class');
        assert.ok(overlayContainer.parent().hasClass(VIEWPORT_CLASS), 'overlay\'s container is the viewport\'s child');
    });

    test('Overlay does not fail if swatch is undefined (render before documentReady, T713615)', function(assert) {
        const stub = sinon.stub(swatch, 'getSwatchContainer', () => {
            stub.restore();
            return undefined;
        });

        const container = $('#container');
        container.dxOverlay({ visible: true }).dxOverlay('instance');
        assert.expect(0);
    });
});


testModule('option', moduleConfig, () => {
    test('RTL markup - rtlEnabled by option', function(assert) {
        const overlay = $('#overlay').dxOverlay({ deferRendering: false }).dxOverlay('instance');
        const $content = $(overlay.$content());
        const contentRenderSpy = sinon.spy(overlay, '_renderContentImpl');

        overlay.option('rtlEnabled', true);
        assert.ok($content.hasClass('dx-rtl'));

        overlay.option('rtlEnabled', false);
        assert.ok(!$content.hasClass('dx-rtl'));
        assert.strictEqual(contentRenderSpy.callCount, 2, 'must invalidate content when RTL changed');
    });

    QUnit.test('overlay should not change visibility after rtlEnabled option change', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            visible: true
        }).dxOverlay('instance');

        overlay.option('rtlEnabled', true);
        assert.ok(overlay.option('visible'), 'overlay is visible after rtlEnabled option change');
    });

    test('disabled', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            disabled: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());

        assert.ok($content.hasClass(DISABLED_STATE_CLASS), 'disabled state present in content element');

        overlay.option('disabled', false);
        assert.ok(!$content.hasClass(DISABLED_STATE_CLASS), 'disabled state not present in content element');

        overlay.option('disabled', undefined);
        assert.ok(!$content.hasClass(DISABLED_STATE_CLASS), 'disabled state not present in content element');
    });

    test('there is no errors when overlay has a subscription on \'onHiding\' event where the widget is desposed', function(assert) {
        const instance = $('#overlay').dxOverlay({
            visible: true,
            onHiding: function(e) {
                e.component.dispose();
            }
        }).dxOverlay('instance');

        let errorOccurred = false;

        try {
            instance.hide();
        } catch(e) {
            errorOccurred = true;
        }

        QUnit.assert.strictEqual(errorOccurred, false, 'error must not be occurred');
    });

    test('visibility callbacks', function(assert) {
        assert.expect(16);

        let beforeShowFired = 0;
        let afterShowFired = 0;
        let beforeHideFired = 0;
        let afterHideFired = 0;
        let positionedFired = 0;

        const instance = $('#overlay').dxOverlay({
            onShowing: function() {
                assert.strictEqual(this.$content().css('display'), 'block');
                assert.strictEqual(afterShowFired, 0);

                beforeShowFired++;
            },
            onPositioned: function({ position }) {
                assert.strictEqual(beforeShowFired, 1);
                assert.strictEqual(this.$content().css('display'), 'block');
                assert.ok(position);

                positionedFired++;
            },
            onShown: function() {
                assert.strictEqual(positionedFired, 1);
                assert.strictEqual(this.$content().css('display'), 'block');

                afterShowFired++;
            },
            onHiding: function() {
                assert.strictEqual(this.$content().css('display'), 'block');
                assert.strictEqual(afterHideFired, 0);

                beforeHideFired++;
            },
            onHidden: function() {
                assert.strictEqual(beforeHideFired, 1);
                assert.strictEqual(this.$content().css('display'), 'none');

                afterHideFired++;
            }
        }).dxOverlay('instance');

        instance.show().done(() => {
            assert.strictEqual(beforeShowFired, 1);
            assert.strictEqual(positionedFired, 1);
            assert.strictEqual(afterShowFired, 1);

            instance.hide().done(() => {
                assert.strictEqual(beforeHideFired, 1);
                assert.strictEqual(afterHideFired, 1);
            });
        });
    });

    test('resize callbacks', function(assert) {
        const onResizeStartFired = sinon.stub();
        const onResizeFired = sinon.stub();
        const onResizeEndFired = sinon.stub();

        const instance = $('#overlay').dxOverlay({
            resizeEnabled: true,
            visible: true,
            onResizeStart: onResizeStartFired,
            onResize: onResizeFired,
            onResizeEnd: onResizeEndFired
        }).dxOverlay('instance');

        const $content = $(instance.$content());
        const $handle = $content.find(toSelector(RESIZABLE_HANDLE_TOP_CLASS));
        const pointer = pointerMock($handle);

        pointer.start().dragStart().drag(0, 50).dragEnd();

        assert.strictEqual(onResizeStartFired.callCount, 1, 'onResizeStart fired');
        assert.strictEqual(onResizeFired.callCount, 1, 'onResize fired');
        assert.strictEqual(onResizeEndFired.callCount, 1, 'onResizeEnd fired');
    });
});


testModule('visibility', moduleConfig, () => {
    test('overlay should be shown when option visible set to true', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.$content());
        const $wrapper = $content.parent();

        assert.ok($wrapper.is(':visible'));
        assert.ok($content.is(':visible'));
        assert.ok($overlay.is(':visible'));

        overlay.option('visible', false);
        assert.ok($wrapper.is(':hidden'));
        assert.ok($content.is(':hidden'));
        assert.ok($overlay.is(':hidden'));
    });

    test('new shown overlay should be displayed with greater z-index (Q518355)', function(assert) {
        const $overlay1 = $('#Q518355_overlay_1').dxOverlay();
        const $overlay2 = $('#Q518355_overlay_2').dxOverlay();
        const overlay1 = $overlay1.dxOverlay('instance');
        const overlay2 = $overlay2.dxOverlay('instance');

        overlay1.show();
        const $content1 = $(overlay1.$content());
        const contentZIndex = parseInt($content1.css('zIndex'), 10);
        const wrapperZIndex = parseInt($content1.parent().css('zIndex'), 10);

        overlay2.show();
        const $content2 = $(overlay2.$content());
        assert.strictEqual(parseInt($content2.css('zIndex'), 10), contentZIndex + 1);
        assert.strictEqual(parseInt($content2.parent().css('zIndex'), 10), wrapperZIndex + 1);
    });

    test('Cancel visibility change in hiding', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: true,
            onHiding: (e) => {
                e.cancel = true;
            }
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.option('visible', false);
        assert.ok(overlay.option('visible'), 'overlay still visible after option changed');

        overlay.hide();
        assert.ok(overlay.option('visible'), 'overlay still visible after call \'hide\'');

        overlay.option('onHiding', null);

        overlay.hide();
        assert.ok(!overlay.option('visible'), 'overlay has not visible after clear hiding and call \'hide\'');
    });

    test('overlay should fire dxshown and dxhiding events on show/hide', function(assert) {
        const $overlay = $('#overlay');
        $('<div id=\'target\' class=\'dx-visibility-change-handler\'>').appendTo($overlay);

        const overlay = $overlay.dxOverlay({
            visible: false,
            deferRendering: false
        }).dxOverlay('instance');

        const shownStub = sinon.stub();
        const hidingStub = sinon.stub();

        $(overlay.$content().find('#target')).on({
            'dxshown': shownStub,
            'dxhiding': hidingStub
        });

        overlay.option('visible', true);
        assert.strictEqual(shownStub.callCount, 1, 'dxshown fired once after showing');
        assert.strictEqual(hidingStub.callCount, 0, 'dxhiding was not fired after showing');

        overlay.option('visible', false);
        assert.strictEqual(shownStub.callCount, 1, 'dxshown was not fired on hiding');
        assert.strictEqual(hidingStub.callCount, 1, 'dxhiding fired once on hiding');
    });

    test('overlay should fire dxshown if visible at initialization', function(assert) {
        assert.expect(1);

        $('#overlay').dxOverlay({
            visible: true,
            deferRendering: false,
            onContentReady: (e) => {
                $('<div id=\'target\' class=\'dx-visibility-change-handler\'>').on('dxshown', () => {
                    assert.ok(true, 'dxshown was fired');
                }).appendTo(e.component.content());
            }
        });
    });

    test('overlay is not shown when parent is hidden', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: false,
            deferRendering: false
        });
        const overlay = $overlay.dxOverlay('instance');

        $overlay.parent().hide();

        overlay.option('visible', true);

        assert.ok(overlay.option('visible'), 'option was set');
        assert.ok(overlay.$content().is(':hidden'), 'overlay was not visible');
    });

    test('overlay content is shown on \'dxshown\' after hidden parent becomes visible', function(assert) {
        const $overlay = $('#overlay').append('<div class=\'content-inner\'>');

        $overlay.parent().hide();

        const overlay = $overlay.dxOverlay({
            visible: true,
            deferRendering: true
        }).dxOverlay('instance');

        assert.ok(overlay.$content().is(':hidden'), 'overlay hidden');

        $overlay.parent().show();
        $($overlay).trigger('dxshown');

        assert.ok(overlay.$content().find('.content-inner').is(':visible'), 'overlay shown');
    });

    test('overlay content is shown on \'dxshown\' after hidden parent becomes visible second time', function(assert) {
        const $overlay = $('#overlay').append('<div class=\'content-inner\'>');
        let innerOverlay;

        const overlay = $overlay.dxOverlay({
            visible: false,
            contentTemplate: (container) => {
                const element = $('<div>').appendTo(container);
                innerOverlay = element.dxOverlay({ visible: true }).dxOverlay('instance');
                return element;
            }
        }).dxOverlay('instance');

        overlay.option('visible', true);

        assert.ok(innerOverlay.$content().is(':visible'), 'overlay shown');

        innerOverlay.option('visible', false);
        overlay.option('visible', false);
        innerOverlay.option('visible', true);
        assert.ok(innerOverlay.$content().is(':hidden'), 'overlay hidden');

        overlay.option('visible', true);

        assert.ok(innerOverlay.$content().is(':visible'), 'overlay shown second time');
    });

    test('overlay is hidden when dxhiding event is fired', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: true,
            deferRendering: false
        });
        const overlay = $overlay.dxOverlay('instance');

        $($overlay).trigger('dxhiding').hide();

        assert.ok(overlay.$content().is(':hidden'), 'overlay was disappeared');
        assert.ok(overlay.option('visible'), 'overlay option visible is true');
    });

    test('overlay is shown when dxshown event is fired', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: true,
            deferRendering: false
        });
        const overlay = $overlay.dxOverlay('instance');

        $($overlay).trigger('dxhiding').hide();
        $($overlay.show()).trigger('dxshown');

        assert.ok(overlay.$content().is(':visible'), 'overlay shown');
    });

    test('overlay is not shown when dxshown event was fired and option \'visible\' is false', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: false,
            deferRendering: false
        });
        const overlay = $overlay.dxOverlay('instance');

        $overlay
            .trigger('dxhiding')
            .trigger('dxshown');

        assert.ok(overlay.$content().is(':hidden'), 'overlay does not shown');
    });

    test('overlay should be shown when visibility is true and dxshown event was fired', function(assert) {
        const $overlay = $('#overlay');
        const $overlayWrapper = $overlay.wrap('<div>').parent().hide();
        const overlay = $overlay.dxOverlay({
            visible: true,
            deferRendering: false
        }).dxOverlay('instance');

        const $overlayContent = $(overlay.content());
        assert.ok($overlayContent.is(':hidden'), 'overlayContent is hidden when parent is hidden');

        $overlayWrapper.show();
        $($overlay).trigger('dxshown');

        assert.ok($overlayContent.is(':visible'), 'overlayContent is visible after dxshown event fired');
    });

    test('visibility actions not fired when visibility is not changed', function(assert) {
        const onShownCounter = sinon.stub();
        const onHiddenCounter = sinon.stub();
        const $overlay = $('#overlay').dxOverlay({
            onHidden: onHiddenCounter,
            visible: false
        });
        const overlay = $overlay.dxOverlay('instance');

        triggerHidingEvent($overlay);

        assert.strictEqual(onHiddenCounter.callCount, 0, 'onHidden action not fired');

        $overlay.dxOverlay('show');
        overlay.option('onShown', onShownCounter);
        triggerShownEvent($overlay);

        assert.strictEqual(onShownCounter.callCount, 0, 'onShown action not fired');
    });

    test('onHiding should be fired once after close and visibility change event', function(assert) {
        fx.off = false;
        const onHidingCounter = sinon.stub();
        const $overlay = $('#overlay').dxOverlay({
            onHiding: onHidingCounter,
            visible: true
        });
        $overlay.dxOverlay('hide');
        triggerHidingEvent($overlay);

        assert.strictEqual(onHidingCounter.callCount, 1, 'onHiding action fired once');
    });

    test('dxresize event should be fired only once when container shows first time (T306921)', function(assert) {
        assert.expect(2);

        const triggerFunction = visibilityChange.triggerResizeEvent;

        try {
            visibilityChange.triggerResizeEvent = () => {
                assert.ok(true, 'event triggered');
            };

            const $overlay = $('#overlay').dxOverlay({ visible: true });
            const overlay = $overlay.dxOverlay('instance');

            overlay.hide();
            overlay.show();

        } finally {
            visibilityChange.triggerResizeEvent = triggerFunction;
        }
    });

    test('overlay should not be shown if e.cancel == true in the onShowing event handler (T825865)', function(assert) {
        // e.cancel is a temporary solution and it is not documented.
        // That is why it should not be used in overlays with integrations such as Knockout, Angular etc,
        // until we reconsider onShowing implementation in future versions
        fx.off = false;
        let showingCounter = 0;
        const onHidingCounter = sinon.stub();
        const onHiddenCounter = sinon.stub();
        const onShownCounter = sinon.stub();
        const $overlay = $('#overlay').dxOverlay({
            onShowing: function(e) {
                showingCounter++;
                e.cancel = true;
            },
            onShown: onShownCounter,
            onHiding: onHidingCounter,
            onHidden: onHiddenCounter
        });
        const overlay = $overlay.dxOverlay('instance');
        const done = assert.async();

        overlay.on('shown', onShownCounter)
            .on('hiding', onHidingCounter)
            .on('hidden', onHiddenCounter);

        overlay.show().done(function(result) {
            const $content = $(overlay.$content());
            const $wrapper = $content.parent();

            assert.notOk(result, 'result === false');
            assert.strictEqual($wrapper.closest('#overlay').length, 1, 'overlay wrapper is inside the overlay root element');
            assert.ok($wrapper.is(':hidden'));
            assert.ok($content.is(':hidden'));
            assert.ok($overlay.is(':hidden'));
            assert.notOk(overlay.option('visible'), 'visible === false');
            assert.equal(showingCounter, 1, 'onShowing should be called only once');
            assert.notOk(onShownCounter.called, 'onShown should not be called');
            assert.notOk(onHidingCounter.called, 'onHiding should not be called');
            assert.notOk(onHiddenCounter.called, 'onHidden should not be called');

            done();
        });
    });
});


testModule('position', moduleConfig, () => {
    test('position change should not show the content if the overlay is hidden', function(assert) {
        const instance = $('#overlay').dxOverlay().dxOverlay('instance');

        instance.option('position', { my: 'top left', at: 'top left', of: document });
        assert.ok(instance.$content().is(':hidden'));
    });

    test('position in string format should be parsed correctly', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: true,
            position: 'top'
        });

        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());

        assert.strictEqual($content.position().top, 0, 'overlay positioned correctly');
    });

    test('position should be correct on second showing (B238662, B232822)', function(assert) {
        const $overlay = $('#overlay').html('123').dxOverlay();
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());

        overlay.show();
        const firstPosition = $content.position();
        overlay.hide();
        overlay.show();
        const secondPosition = $content.position();
        assert.deepEqual(secondPosition, firstPosition);
    });

    test('position should be set up on first show', function(assert) {
        const $overlay = $('#overlay');

        $overlay.dxOverlay({
            visible: true,
            position: { my: 'left top', at: 'center', of: viewport() }
        });

        const position = viewport().find(toSelector(OVERLAY_CONTENT_CLASS)).position();

        assert.notEqual(position.left, 0);
        assert.notEqual(position.top, 0);
    });

    test('position of overlay is absolute when position.of is not window', function(assert) {
        $('#overlay').dxOverlay({
            visible: true,
            position: {
                my: 'center',
                at: 'center',
                of: viewport()
            }
        });

        const $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
        assert.strictEqual($overlayWrapper.css('position'), 'absolute');
    });

    test('position of overlay is correct when position.of is window', function(assert) {
        $('#overlay').dxOverlay({
            visible: true,
            position: {
                my: 'center',
                at: 'center',
                of: window
            }
        });

        const $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
        assert.strictEqual($overlayWrapper.css('position'), devices.real().ios ? 'absolute' : 'fixed');
    });

    test('position of overlay is correct when position.of is window and shading is false', function(assert) {
        $('#overlay').dxOverlay({
            visible: true,
            shading: false,
            position: {
                my: 'center',
                at: 'center',
                of: window
            }
        });

        const $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
        assert.strictEqual($overlayWrapper.css('position'), devices.real().ios ? 'absolute' : 'fixed');
    });

    test('wrapper should have 100% width and height when shading is disabled', function(assert) {
        $('#overlay').dxOverlay({
            visible: true,
            shading: false
        });

        const $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
        const wrapperStyle = getComputedStyle($overlayWrapper.get(0));

        assert.strictEqual(parseInt(wrapperStyle.width), $(window).width(), 'width is 100%');
        assert.strictEqual(parseInt(wrapperStyle.height), $(window).height(), 'height is 100%');
    });

    test('overlay should be correctly animated with custom \'animation.show.to\'', function(assert) {
        const $container = $('<div>').css({
            height: '500px',
            position: 'relative'
        }).appendTo('#qunit-fixture');

        const $content = $('<div>').css({
            height: '100px',
            position: 'absolute',
            top: '100px'
        }).appendTo($container);


        const widgetPosition = {
            my: 'bottom',
            at: 'bottom',
            of: $content
        };

        const $overlay = $('#overlay').dxOverlay({
            container: $container,
            position: widgetPosition,
            animation: {
                show: {
                    to: {
                        opacity: 0
                    }
                }
            }
        });

        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());

        overlay.show();
        const expectedPosition = positionUtils.calculate($overlayContent, widgetPosition);
        assert.deepEqual(positionUtils.setup($overlayContent), { top: expectedPosition.v.location, left: expectedPosition.h.location }, 'overlay positioned correctly');
    });

    test('position as function', function(assert) {
        const instance = $('#overlay').dxOverlay({
            visible: true,
            position: function() { return { of: 'body' }; }
        }).dxOverlay('instance');

        assert.strictEqual(instance._position.of, 'body');
    });

    test('overlay wrapper should have correct dimensions even when there is "target" property in window', function(assert) {
        $('<div>')
            .css({ width: 100, height: 100 })
            .attr('id', 'target')
            .appendTo('#qunit-fixture');

        $('#overlay').dxOverlay({
            visible: true
        });

        const $overlayWrapper = $(`.${OVERLAY_WRAPPER_CLASS}`);

        assert.roughEqual($overlayWrapper.width(), $(window).width(), 1.01, 'overlay wrapper width is correct');
        assert.roughEqual($overlayWrapper.height(), $(window).height(), 1.01, 'overlay wrapper height is correct');
    });
});


testModule('shading', moduleConfig, () => {
    [true, false].forEach((value) => {
        test('render shading', function(assert) {
            const overlay = $('#overlay').dxOverlay({
                shading: value,
                visible: true
            }).dxOverlay('instance');
            const $wrapper = $(overlay.$content().parent());

            assert.strictEqual($wrapper.hasClass(OVERLAY_SHADER_CLASS), value, 'shader class is correct');
            assert.strictEqual(getComputedStyle($wrapper.get(0)).pointerEvents, value ? 'auto' : 'none', 'shading wrapper have correct pointer-events');

            overlay.option('shading', !value);
            assert.strictEqual($wrapper.hasClass(OVERLAY_SHADER_CLASS), !value, 'shader class is correct');
            assert.strictEqual(getComputedStyle($wrapper.get(0)).pointerEvents, !value ? 'auto' : 'none', 'shading wrapper have correct pointer-events');
        });
    });

    test('shading height should change after container resize (B237292)', function(assert) {
        const $container = $('#B237292_container');
        const overlay = $('#B237292_overlay').dxOverlay({
            visible: true,
            container: $container,
            position: {
                of: $container
            }
        }).dxOverlay('instance');
        const $wrapper = $(overlay.$content().parent());

        $container
            .width(200)
            .height(300)
            .offset({
                left: 100,
                top: 200
            });
        overlay.repaint();
        assert.strictEqual($wrapper.width(), 200);
        assert.strictEqual($wrapper.height(), 300);
        assert.strictEqual(locate($wrapper).left, 0);
        assert.strictEqual(locate($wrapper).top, 0);
    });

    test('shading height should change after iOS address bar resize (T653828)', function(assert) {
        if(devices.real().platform !== 'ios' || devices.real().deviceType === 'desktop') {
            assert.ok(true);
            return;
        }

        const overlay = $('#overlay').dxOverlay({
            visible: true
        }).dxOverlay('instance');

        const $wrapper = $(overlay.$content().parent());
        assert.strictEqual($wrapper.css('minHeight').replace('px', ''), String(window.innerHeight), 'overlay wrapper has right min-height style');
    });

    test('shading color should be customized by option', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            shading: true,
            shadingColor: 'rgb(255, 0, 0)',
            visible: true
        }).dxOverlay('instance');
        const $wrapper = $(overlay.$content().parent());

        assert.ok(/rgb\(255,\s?0,\s?0\)/.test($wrapper.css('backgroundColor')));

        overlay.option('shading', false);
        assert.ok(!/rgb\(255,\s?0,\s?0\)/.test($wrapper.css('backgroundColor')));
    });

    test('overlay should adjust height on iOS after positioning (T742021)', function(assert) {
        assert.expect(1);
        if(devices.real().platform !== 'ios' || devices.real().deviceType === 'desktop') {
            assert.ok(true);
            return;
        }

        const overlay = $('#overlay').dxOverlay().dxOverlay('instance');
        sinon.stub(
            overlay,
            '_fixHeightAfterSafariAddressBarResizing',
            () => {
                const $wrapper = $(overlay.$content().parent());
                assert.strictEqual($wrapper.css('position'), 'absolute', 'overlay wrapper should have a position');
            }
        );

        overlay.show();
    });
});


testModule('dimensions', moduleConfig, () => {
    test('dimensions should be set correctly as number', function(assert) {
        const $content = $('#overlay').dxOverlay({
            visible: true,
            width: 20,
            height: 15
        }).dxOverlay('instance').$content();

        assert.strictEqual($content.width(), 20);
        assert.strictEqual($content.height(), 15);

        resizeCallbacks.fire();

        assert.strictEqual($content.width(), 20);
        assert.strictEqual($content.height(), 15);
    });

    test('dimensions should be set correctly as function', function(assert) {
        const $content = $('#overlay').dxOverlay({
            visible: true,
            width: () => {
                return $(window).width();
            },
            height: () => {
                return $(window).height();
            }
        }).dxOverlay('instance').$content();

        assert.strictEqual($content.width(), $(window).width());
        assert.strictEqual($content.height(), $(window).height());

        resizeCallbacks.fire();

        assert.strictEqual($content.width(), $(window).width());
        assert.strictEqual($content.height(), $(window).height());
    });

    test('dimensions should be shrunk correctly with max sizes specified', function(assert) {
        const $content = $('#overlay').dxOverlay({
            visible: true,
            width: 'auto',
            height: 'auto',
            maxWidth: 200,
            maxHeight: 200,
            contentTemplate: function() {
                return $('<div>').width(1000).height(1000);
            }
        }).dxOverlay('instance').$content();

        assert.strictEqual($content.width(), 200);
        assert.strictEqual($content.height(), 200);
    });

    test('dimensions should be shrunk correctly with max sizes changes dynamically', function(assert) {
        const instance = $('#overlay').dxOverlay({
            visible: true,
            width: 'auto',
            height: 'auto',
            contentTemplate: function() {
                return $('<div>').width(1000).height(1000);
            }
        }).dxOverlay('instance');
        const $content = $(instance.content());

        instance.option('maxWidth', 200);
        assert.strictEqual($content.width(), 200);

        instance.option('maxHeight', 200);
        assert.strictEqual($content.height(), 200);
    });

    test('dimensions should be expanded correctly with min sizes specified', function(assert) {
        const $content = $('#overlay').dxOverlay({
            visible: true,
            width: 'auto',
            height: 'auto',
            minWidth: 200,
            minHeight: 200
        }).dxOverlay('instance').$content();

        assert.strictEqual($content.width(), 200);
        assert.strictEqual($content.height(), 200);
    });

    test('dimensions should be shrunk correctly with min sizes changes dynamically', function(assert) {
        const instance = $('#overlay').dxOverlay({
            visible: true,
            width: 'auto',
            height: 'auto'
        }).dxOverlay('instance');
        const $content = $(instance.content());

        instance.option('minWidth', 200);
        assert.strictEqual($content.width(), 200);

        instance.option('minHeight', 200);
        assert.strictEqual($content.height(), 200);
    });
});


testModule('animation', moduleConfig, () => {
    test('correct animation should be present', function(assert) {
        const originAnimate = fx.animate;

        try {
            fx.animate = ($element, config) => {
                if(instance.$content().get(0) === $element.get(0)) {
                    lastConfig = config;
                }
            };
            const showConfig = {
                type: 'pop',
                duration: 200
            };
            const hideConfig = {
                type: 'slide',
                duration: 100
            };
            let lastConfig;
            const instance = $('#overlay').dxOverlay({
                animation: {
                    show: showConfig,
                    hide: hideConfig
                }
            }).dxOverlay('instance');

            instance.show();
            assert.strictEqual(lastConfig.duration, showConfig.duration, 'animate on show: correct type');
            assert.strictEqual(lastConfig.type, showConfig.type, 'animate on show: correct duration');

            instance.hide();
            assert.strictEqual(lastConfig.type, hideConfig.type, 'animate on hide: correct type');
            assert.strictEqual(lastConfig.duration, hideConfig.duration, 'animate on hide: correct duration');
        } finally {
            fx.animate = originAnimate;
        }
    });

    test('animation complete callback arguments should be correct', function(assert) {
        const originAnimate = fx.animate;
        fx.animate = ($element, config) => {
            config.complete($element, config);
        };

        try {
            let showArgs;
            let hideArgs;
            const showConfig = {
                type: 'pop',
                complete: function() {
                    showArgs = arguments;
                }
            };
            const hideConfig = {
                type: 'pop',
                complete: function() {
                    hideArgs = arguments;
                }
            };
            const instance = $('#overlay').dxOverlay({
                animation: {
                    show: showConfig,
                    hide: hideConfig
                }
            }).dxOverlay('instance');

            instance.show();
            assert.strictEqual(showArgs.length, 2, 'animate on show: correct type');

            instance.hide();
            assert.strictEqual(hideArgs.length, 2, 'animate on hide: correct type');
        } finally {
            fx.animate = originAnimate;
        }
    });

    test('no merging for animation option should be present', function(assert) {
        const overlay = $('#overlay')
            .dxOverlay({
                animation: {
                    type: 'pop',
                    show: {
                        from: {
                            opacity: 0
                        },
                        to: {
                            opacity: 1
                        }
                    },
                    hide: {
                        from: {
                            opacity: 1
                        },
                        to: {
                            opacity: 0
                        }
                    }
                }
            }).dxOverlay('instance');

        overlay.option('animation', {
            type: 'slide',
            show: {
                from: {
                    left: 0
                },
                to: {
                    left: 100
                }
            },
            hide: {
                from: {
                    left: 100
                },
                to: {
                    left: 0
                }
            }
        });

        const animation = overlay.option('animation');

        assert.strictEqual(animation.show.from.opacity, undefined, 'opacity not merged');
        assert.strictEqual(animation.show.to.opacity, undefined, 'opacity not merged');
        assert.strictEqual(animation.hide.from.opacity, undefined, 'opacity not merged');
        assert.strictEqual(animation.hide.to.opacity, undefined, 'opacity not merged');
    });

    test('dispose should stop animation before complete show', function(assert) {
        const done = assert.async();
        const $overlay = $('#overlay').dxOverlay({
            animation: {
                show: {
                    type: 'pop',
                    duration: 500
                }
            }
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.show();
        overlay.on('disposing', function() {
            assert.ok(!fx.isAnimating($overlay));
            done();
        });
        $overlay.remove();
    });

    test('dispose should stop animation before complete hide', function(assert) {
        const done = assert.async();
        const $overlay = $('#overlay').dxOverlay({
            animation: {
                hide: {
                    type: 'pop',
                    duration: 500
                }
            }
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.show().done(function() {
            overlay.hide();
            overlay.on('disposing', function() {
                assert.ok(!fx.isAnimating($overlay));
                done();
            });
            $overlay.remove();
        });
    });

    test('\'animation.show.to.position\' should be configured according to widget option \'position\'', function(assert) {
        const origFX = fx.animate;

        try {
            const widgetPosition = { my: 'top', at: 'top', of: window };
            const animationShowToPosition = { my: 'bottom', at: 'bottom', of: window };

            const $overlay = $('#overlay').dxOverlay({
                position: widgetPosition,
                animation: { show: { to: { position: animationShowToPosition } } }
            });
            const overlay = $overlay.dxOverlay('instance');

            fx.animate = function(_, config) {
                assert.strictEqual(config.type, 'slide', 'slide animation set');
                assert.deepEqual(config.to.position, widgetPosition, 'to position animation set');
            };
            overlay.show();
        } finally {
            fx.animate = origFX;
        }
    });

    test('\'animation.hide.from.position\' should be configured according to widget option \'position\'', function(assert) {
        const origFX = fx.animate;

        try {
            const widgetPosition = { my: 'top', at: 'top', of: window };
            const animationShowToPosition = { my: 'bottom', at: 'bottom', of: window };

            const $overlay = $('#overlay').dxOverlay({
                position: widgetPosition,
                animation: { hide: { from: { position: animationShowToPosition } } },
                visible: true
            });
            const overlay = $overlay.dxOverlay('instance');

            fx.animate = function(_, config) {
                assert.strictEqual(config.type, 'slide', 'slide animation set');
                assert.deepEqual(config.from.position, widgetPosition, 'from position animation set');
            };
            overlay.hide();
        } finally {
            fx.animate = origFX;
        }
    });

    test('pointer events should be disabled during hide animation', function(assert) {
        assert.expect(2);

        if(!$('body').css('pointerEvents')) {
            assert.expect(0);
            return;
        }

        const animationConfig = {
            duration: 0,
            start: function() {
                assert.strictEqual(instance.$content().css('pointerEvents'), 'none', 'start of the hiding animation has correct pointer-events');
            },
            complete: function() {
                assert.strictEqual(instance.$content().css('pointerEvents'), originalPointerEvents, 'complete of the hiding animation has correct pointer-events');
            }
        };

        const $element = $('#overlay').dxOverlay({
            visible: true,
            animation: {
                hide: animationConfig
            }
        });
        const instance = $element.dxOverlay('instance');
        const originalPointerEvents = instance.$content().css('pointerEvents');

        instance.hide();
    });

    test('overlay should be able to get animation function', function(assert) {
        assert.expect(1);

        const origFX = fx.animate;

        try {
            fx.animate = (_, config) => {
                assert.strictEqual(config.type, 'fade', 'slide animation should be executed');
            };

            const $element = $('#overlay').dxOverlay({
                animation: () => {
                    return { hide: { type: 'fade' } };
                },
                visible: true
            });
            const instance = $element.dxOverlay('instance');

            instance.hide();

        } finally {
            fx.animate = origFX;
        }
    });
});


testModule('content', moduleConfig, () => {
    test('content ready action should be fired if was set at initialization', function(assert) {
        const contentReadyStub = sinon.stub();
        const instance = $('#overlay').dxOverlay({
            onContentReady: contentReadyStub
        }).dxOverlay('instance');

        instance.show();
        instance.hide();
        instance.show();
        assert.strictEqual(contentReadyStub.callCount, 1);
    });

    test('content ready action should be fired if was set thought option', function(assert) {
        const contentReadyStub = sinon.stub();
        const instance = $('#overlay').dxOverlay({
            onContentReady: contentReadyStub
        }).dxOverlay('instance');

        const newContentReadyStub = sinon.stub();
        instance.option('onContentReady', newContentReadyStub);

        instance.show();
        instance.hide();
        instance.show();

        assert.ok(contentReadyStub.notCalled);
        assert.ok(newContentReadyStub.calledOnce);
    });

    test('content ready action should be fired if was set thought method', function(assert) {
        const contentReadyStub = sinon.stub();
        const instance = $('#overlay').dxOverlay({
            onContentReady: contentReadyStub
        }).dxOverlay('instance');

        const newContentReadyStub = sinon.stub();
        instance.on('contentReady', newContentReadyStub);

        instance.show();
        instance.hide();
        instance.show();

        assert.ok(contentReadyStub.calledOnce);
        assert.ok(newContentReadyStub.calledOnce);
    });

    test('content should be rendered only once after repaint', function(assert) {
        const contentReadyStub = sinon.stub();
        const instance = $('#overlay').dxOverlay({
            visible: true,
            onContentReady: contentReadyStub
        }).dxOverlay('instance');

        instance.repaint();
        assert.ok(contentReadyStub.calledOnce);
    });

    test('"repaint" should trigger content rendering in case it was not created', function(assert) {
        const contentReadyStub = sinon.stub();
        const $container = $('<div>').appendTo('#qunit-fixture').hide();
        const $widget = $('<div>').appendTo($container);
        const instance = $widget.dxOverlay({
            visible: true,
            onContentReady: contentReadyStub
        }).dxOverlay('instance');

        $container.show();
        instance.repaint();
        assert.ok(contentReadyStub.calledOnce);
    });

    test('content should be rendered only once after resize', function(assert) {
        const contentReadyStub = sinon.stub();

        $('#overlay').dxOverlay({
            visible: true,
            animation: null,
            onContentReady: contentReadyStub
        });

        resizeCallbacks.fire();
        assert.ok(contentReadyStub.calledOnce);
    });

    test('content should be rendered only once after container change', function(assert) {
        const contentReadyStub = sinon.stub();
        const instance = $('#overlay').dxOverlay({
            visible: true,
            animation: null,
            onContentReady: contentReadyStub,
            container: '#overlayInTargetContainer'
        }).dxOverlay('instance');

        instance.option('container', null);
        assert.ok(contentReadyStub.calledOnce);
    });

    test('contentTemplate should use correct contentElement', function(assert) {
        $('#overlay').dxOverlay({
            visible: true,
            contentTemplate: (contentElement) => {
                assert.strictEqual(isRenderer(contentElement), !!config().useJQuery, 'contentElement is correct');
            }
        });
    });

    test('anonymous content template rendering', function(assert) {
        const $contentElement = $('#overlayWithAnonymousTmpl #content');

        const $overlay = $('#overlayWithAnonymousTmpl').dxOverlay({
            visible: true
        });
        const $content = $overlay.dxOverlay('$content');

        assert.strictEqual($content.children()[0], $contentElement[0], 'content element preserved');
    });

    test('custom content template', function(assert) {
        const $overlay = $('#overlayWithContentTemplate').dxOverlay({ contentTemplate: 'custom', visible: true });
        const $content = $($overlay.dxOverlay('instance').$content());

        assert.strictEqual($content.children().length, 1, 'Overlay content has only one child');
        assert.strictEqual($.trim($content.text()), 'TestContent', 'Overlay content text is correct');
    });

    test('wrong content template name is specified', function(assert) {
        const $overlay = $('#overlayWithWrongTemplateName').dxOverlay({ contentTemplate: 'custom', visible: true });
        const $content = $($overlay.dxOverlay('instance').$content());

        assert.strictEqual($.trim($content.text()), 'custom', 'content has no text');
    });

    test('contentTemplate option accepts template instance', function(assert) {
        const $template = $('<div>').text('test');

        const $overlay = $('#overlay').dxOverlay({
            contentTemplate: new Template($template),
            visible: true
        });

        const $content = $($overlay.dxOverlay('instance').$content());

        assert.strictEqual($.trim($content.text()), 'test', 'template rendered');
    });

    test('contentTemplate option support dynamic change', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            contentTemplate: 'template1',
            visible: true
        });

        $overlay.dxOverlay('option', 'contentTemplate', 'template2');

        assert.strictEqual($.trim($overlay.dxOverlay('$content').text()), 'template2', 'template rerendered');
    });

    test('contentTemplate option support dynamic change in a set of options', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            contentTemplate: 'template1',
            visible: true
        }).dxOverlay('instance');

        overlay.hide();
        overlay.option({
            contentTemplate: 'template2',
            visible: true
        });

        assert.strictEqual(overlay.$content().text(), 'template2', 'template rerendered correctly');
    });
});


testModule('defer rendering', moduleConfig, () => {
    test('behavior if option set to true', function(assert) {
        const onContentReadyStub = sinon.stub();
        const instance = $('#overlay').dxOverlay({
            onContentReady: onContentReadyStub
        }).dxOverlay('instance');

        assert.ok(onContentReadyStub.notCalled, 'after widget render content still not render');
        instance.show();
        assert.ok(onContentReadyStub.calledOnce, 'after overlay show, content is rendered');
    });

    test('behavior if option set to false', function(assert) {
        const onContentReadyStub = sinon.stub();
        const instance = $('#overlay')
            .dxOverlay({
                deferRendering: false,
                onContentReady: onContentReadyStub
            })
            .dxOverlay('instance');

        assert.ok(onContentReadyStub.calledOnce, 'after overlay render, content is render too');

        instance.show();
        assert.ok(onContentReadyStub.calledOnce, 'after show overlay content do not render');
    });

    test('content ready should be fired correctly when async template is used', function(assert) {
        const clock = sinon.useFakeTimers();
        let contentIsRendered = false;

        $('#overlay').dxOverlay({
            templatesRenderAsynchronously: true,
            deferRendering: false,
            onContentReady: function() {
                assert.ok(contentIsRendered, 'Content is rendered before content ready firing');
            },
            integrationOptions: {
                templates: {
                    'content': {
                        render: function(args) {
                            setTimeout(function() {
                                contentIsRendered = true;
                                args.onRendered();
                            }, 100);
                        }
                    }
                }
            }
        });

        clock.tick(100);
        clock.restore();
    });
});


testModule('close on outside click', moduleConfig, () => {
    test('overlay should be hidden after click outside was present', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }).dxOverlay('instance');
        const $content = overlay.$content();

        $($content).trigger('dxpointerdown');
        assert.strictEqual(overlay.option('visible'), true, 'overlay is not hidden');

        $(document).trigger('dxpointerdown');
        assert.strictEqual(overlay.option('visible'), false, 'overlay is hidden');
    });

    test('overlay should not be hidden after click inside was present', function(assert) {
        const $overlay = $('#overlay');
        $('<div id=\'innerContent\'>').appendTo($overlay);
        const overlay = $overlay.dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }).dxOverlay('instance');

        pointerMock($('#innerContent', $overlay))
            .start()
            .wait(600)
            .click();

        assert.strictEqual(overlay.option('visible'), true, 'overlay is not hidden');
    });

    test('click in the inner overlay should not be an outside click', function(assert) {
        const overlay1 = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }).dxOverlay('instance');
        const overlay2 = $('#overlay2').dxOverlay({
            closeOnOutsideClick: true,
            innerOverlay: true,
            visible: true,
            propagateOutsideClick: true
        }).dxOverlay('instance');

        $(overlay2.content()).trigger('dxpointerdown');

        assert.equal(overlay1.option('visible'), true, 'Bottom overlay should not get outside click when inner overlay clicked');
    });

    // T494814
    test('overlay should not be hidden after click in detached element', function(assert) {
        const overlay = $('#overlayWithAnonymousTmpl').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        })
            .dxOverlay('instance');

        $('#content').on('dxpointerdown', function(e) {
            $('#content').replaceWith($('<div>').attr('id', 'content'));
        });

        // act
        $('#content').trigger('dxpointerdown');

        // assert
        assert.strictEqual(overlay.option('visible'), true, 'overlay is not hidden');
    });

    test('overlay should not propagate events after click outside was present', function(assert) {
        $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true,
            shading: true
        });

        const downEvent = $.Event('dxpointerdown', { pointerType: 'mouse' });
        $(document).trigger(downEvent);
        assert.ok(downEvent.isDefaultPrevented(), 'default prevented');

    });

    test('overlay should propagate events when shading is false (T181002)', function(assert) {
        $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true,
            shading: false
        });

        const downEvent = $.Event('dxpointerdown', { pointerType: 'mouse' });
        $(document).trigger(downEvent);
        assert.ok(!downEvent.isDefaultPrevented(), 'default is not prevented');

    });

    test('outside click should close several overlays if propagateOutsideClick option of top overlay is true', function(assert) {
        const overlay1 = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }).dxOverlay('instance');
        const overlay2 = $('#overlay2').dxOverlay({
            closeOnOutsideClick: false,
            visible: true,
            propagateOutsideClick: true
        }).dxOverlay('instance');

        $('body').trigger('dxpointerdown');

        assert.strictEqual(overlay1.option('visible'), false, 'First overlay is hidden');
        assert.strictEqual(overlay2.option('visible'), true, 'Second overlay is visible');
    });

    test('customer should control closing of other overlays when some overlay content clicked', function(assert) {
        // note: T668816, T655391 and click menu item when menu is inside of dxPopup with closeOnOutsideClick true
        const overlay1 = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        }).dxOverlay('instance');
        const overlay2 = $('#overlay2').dxOverlay({
            closeOnOutsideClick: true,
            visible: true,
            propagateOutsideClick: true
        }).dxOverlay('instance');

        $(overlay2.content()).trigger('dxpointerdown');

        assert.strictEqual(overlay1.option('visible'), false, 'Bottom overlay should get outside click when other overlay clicked');
        assert.strictEqual(overlay2.option('visible'), true, 'Second overlay is visible');

        overlay1.show();
        overlay2.option('closeOnOutsideClick', function(e) {
            return !e.target.closest(toSelector(OVERLAY_CONTENT_CLASS));
        });
        $(overlay1.content()).trigger('dxpointerdown');

        assert.strictEqual(overlay1.option('visible'), true, 'First overlay is visible');
        assert.strictEqual(overlay2.option('visible'), true, 'Closing should be prevented by a user-defined function');
    });

    test('overlays\' priority', function(assert) {
        const $overlay1 = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const overlay1 = $overlay1.dxOverlay('instance');
        const $overlay2 = $('#overlay2').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const overlay2 = $overlay2.dxOverlay('instance');

        $(overlay2.content()).trigger('dxpointerdown');

        assert.strictEqual(overlay1.option('visible'), true, 'First overlay is NOT hidden, because it\'s NOT active');
        assert.strictEqual(overlay2.option('visible'), true, 'Second overlay is visible');

        $('body').trigger('dxpointerdown');

        assert.strictEqual(overlay1.option('visible'), true, 'First overlay is NOT hidden, because it\'s NOT active');
        assert.strictEqual(overlay2.option('visible'), false, 'Second overlay is hidden, because it is active');

        $('body').trigger('dxpointerdown');

        assert.strictEqual(overlay1.option('visible'), false, 'First overlay is now hidden, because it has become active');
    });


    test('closeOnOutsideClick works after first overlay hiding', function(assert) {
        const $overlay1 = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const overlay1 = $overlay1.dxOverlay('instance');
        const $overlay2 = $('#overlay2').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const overlay2 = $overlay2.dxOverlay('instance');

        overlay1.hide();

        $('body').trigger('dxpointerdown');

        assert.strictEqual(overlay1.option('visible'), false, 'First overlay is hidden, because of calling hide');
        assert.strictEqual(overlay2.option('visible'), false, 'Second overlay is hidden, because of outsideclick');
    });

    test('document events should be unsubscribed at each overlay hiding', function(assert) {
        const $overlay1 = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const instance1 = $overlay1.dxOverlay('instance');
        const $overlay2 = $('#overlay2').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const instance2 = $overlay2.dxOverlay('instance');

        assert.ok(instance1.option('visible'), 'overlay1 is shown');
        assert.ok(instance2.option('visible'), 'overlay2 is shown');

        $('body').trigger('dxpointerdown');
        assert.ok(instance1.option('visible'), 'overlay1 is shown');
        assert.ok(!instance2.option('visible'), 'overlay2 is hidden');

        $('body').trigger('dxpointerdown');
        assert.ok(!instance1.option('visible'), 'overlay1 is hidden');
        assert.ok(!instance2.option('visible'), 'overlay2 is hidden');
    });

    test('closeOnOutsideClick does not close back widget while front widget is still animated', function(assert) {
        const $overlay1 = $('#overlay').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const instance1 = $overlay1.dxOverlay('instance');
        const $overlay2 = $('#overlay2').dxOverlay({
            closeOnOutsideClick: true,
            visible: true
        });
        const instance2 = $overlay2.dxOverlay('instance');

        try {
            fx.off = false;

            $('body').trigger('dxpointerdown');
            $(instance2.content()).trigger('dxpointerdown');
            assert.ok(!instance2.option('visible'), 'second overlay is hidden');
            assert.ok(instance1.option('visible'), 'first overlay is not hidden');
        } finally {
            fx.off = true;
        }
    });

    test('click on overlay during the start animation should end the animation (T273294)', function(assert) {
        const $overlay = $('#overlay').dxOverlay({ closeOnOutsideClick: true });
        const overlay = $overlay.dxOverlay('instance');

        try {
            fx.off = false;
            overlay.show();

            $(overlay.content()).trigger('dxpointerdown');
            assert.ok(overlay.option('visible'), 'overlay is stay visible');
        } finally {
            fx.off = true;
        }
    });
});

testModule('reset focus', moduleConfig, () => {
    QUnit.testInActiveWindow('inputs inside should loose focus when overlay is hidden with animation disabled', function(assert) {
        const focusOutStub = sinon.stub();
        const $input = $('<input id=\'alter-box\' />')
            .on('focusout', focusOutStub);
        const overlay = $('#overlay')
            .dxOverlay({
                animation: false,
                shading: false,
                visible: true,
                contentTemplate: function(contentElement) {
                    return $(contentElement).append($input);
                }
            })
            .dxOverlay('instance');

        $input.focus();
        overlay.hide();

        assert.strictEqual(focusOutStub.called, true, 'input lost focus');
    });

    QUnit.testInActiveWindow('there is no errors when overlay try reset active element', function(assert) {
        const $input = $('<input>');
        const overlay = $('#overlay')
            .dxOverlay({
                animation: false,
                shading: false,
                visible: true,
                contentTemplate: function(contentElement) {
                    $(contentElement).append($input);
                }
            })
            .dxOverlay('instance');
        let isOK = true;

        $input.focus();
        $input[0].blur = null;

        try {
            overlay.hide();
        } catch(e) {
            isOK = false;
        }

        assert.ok(isOK, 'overlay reset active element without error');
    });
});

testModule('close on target scroll', moduleConfig, () => {
    test('overlay should be hidden if any of target\'s parents were scrolled', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            closeOnTargetScroll: true,
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $('#overlayInputTarget')
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($content.is(':visible'), false, 'overlay should be hidden after scroll event on any parent');
    });

    test('overlay should not be hidden on parents scroll if show animation is not completed', function(assert) {
        fx.off = false;

        const overlay = $('#overlay').dxOverlay({
            closeOnTargetScroll: true,
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $('#overlayInputTarget')
            },
            visible: false,
            animation: { show: { duration: 100 } }
        }).dxOverlay('instance');

        overlay.show();
        $('#parentContainer').triggerHandler('scroll');

        assert.strictEqual(overlay.option('visible'), true, 'overlay should not be hidden if show animation is not completed');
    });

    test('overlay should be hidden if any of jQuery Event target\'s parents were scrolled', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            closeOnTargetScroll: true,
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $.Event('dxpointerdown', { pointerType: 'mouse', pageX: 50, pageY: 50, target: $('#overlayInputTarget').get(0) })
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($content.is(':visible'), false, 'Overlay should be hidden after scroll event on any parent');
    });

    test('overlay should not be hidden on any target\'s parents scroll events if option set to false', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            closeOnTargetScroll: false,
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $('#overlayInputTarget')
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($content.is(':visible'), true, 'Overlay should not be hidden as this ability is disabled');
    });

    test('overlay should be hidden on window scroll event on desktop', function(assert) {
        const originalDevice = {
            platform: devices.real().platform,
            deviceType: devices.real().deviceType
        };

        try {
            devices.real({ platform: 'generic', deviceType: 'desktop' });

            const $overlay = $('#overlay').dxOverlay({
                closeOnTargetScroll: true
            });

            const overlay = $overlay.dxOverlay('instance');
            const $content = $(overlay.content());

            overlay.show();

            $(window).triggerHandler('scroll');
            assert.strictEqual($content.is(':visible'), false, 'Overlay should be hidden after scroll event on window');
        } finally {
            devices.real(originalDevice);
        }
    });

    test('overlay should not be hidden on window scroll event on mobile devices', function(assert) {
        const originalDevice = {
            platform: devices.real().platform,
            deviceType: devices.real().deviceType
        };

        try {
            devices.real({ platform: 'ios', deviceType: 'phone' });

            const $overlay = $('#overlay').dxOverlay({
                closeOnTargetScroll: true
            });

            const overlay = $overlay.dxOverlay('instance');
            const $content = $(overlay.content());

            overlay.show();

            $(window).triggerHandler('scroll');
            assert.strictEqual($content.is(':visible'), true, 'Overlay should not be hidden after scroll event on window');
        } finally {
            devices.real(originalDevice);
        }
    });

    test('hiding & hidden should be fired if closing by scroll event when overlay initially visible', function(assert) {
        assert.expect(2);

        const $overlay = $('#overlay').dxOverlay({
            visible: true,
            closeOnTargetScroll: true,
            position: {
                my: 'left top',
                at: 'left bottom',
                of: '#overlayInputTarget'
            },
            onHiding: function() {
                assert.ok(true, 'hiding action fired');
            },
            onHidden: function() {
                assert.ok(true, 'hidden action fired');
            }
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.show();
        $('#parentContainer').triggerHandler('scroll');
    });

    test('scroll subscriptions should be unsubscribed from subscribed elements', function(assert) {
        const $target = $('#overlayInputTarget');

        const $overlay = $('#overlay').dxOverlay({
            closeOnTargetScroll: true,
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $target
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');

        const targetParent = $target.parent().get(0);
        $target.detach();
        overlay.hide();
        const parentEvents = $._data(targetParent).events || {};
        assert.strictEqual('scroll' in parentEvents, false, 'scroll unsubscribed');
    });

    test('all opened overlays should be closed on scroll', function(assert) {
        const $target = $('#overlayInputTarget');

        const $overlay1 = $('#overlay').dxOverlay({
            closeOnTargetScroll: true,
            position: {
                of: $target
            },
            visible: true
        });

        const $overlay2 = $('#overlay2').dxOverlay({
            closeOnTargetScroll: true,
            position: {
                of: $target
            },
            visible: true
        });

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($overlay1.dxOverlay('option', 'visible'), false, 'overlay1 closed');
        assert.strictEqual($overlay2.dxOverlay('option', 'visible'), false, 'overlay2 closed');
    });

    test('target scroll subscriptions should be unsubscribed for current overlay', function(assert) {
        const $target = $('#overlayInputTarget');

        const $overlay1 = $('#overlay').dxOverlay({
            closeOnTargetScroll: function() {
                return $overlay2.dxOverlay('option', 'visible');
            },
            position: {
                of: $target
            },
            visible: true
        });

        const $overlay2 = $('#overlay2').dxOverlay({
            closeOnTargetScroll: true,
            position: {
                of: $target
            },
            visible: true
        });

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($overlay1.dxOverlay('option', 'visible'), true, 'overlay1 opened');

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($overlay1.dxOverlay('option', 'visible'), false, 'overlay1 closed');
    });
});


testModule('container', moduleConfig, () => {
    test('wrapper should have width and height css attributes equal to container width and height', function(assert) {
        const $container = $('#customTargetContainer');
        $container.css({
            width: 100,
            height: 100
        });

        const overlay = $('#overlay').dxOverlay({
            container: $container,
            visible: true
        }).dxOverlay('instance');

        const wrapperElement = overlay.$content().parent().get(0);

        assert.strictEqual(wrapperElement.style.width, '100px', 'width is correct');
        assert.strictEqual(wrapperElement.style.height, '100px', 'height is correct');
    });

    test('wrapper width and height should be restored after container option value changed to window (T937118)', function(assert) {
        const $container = $('#customTargetContainer');
        $container.css({
            width: 100,
            height: 100
        });

        const overlay = $('#overlay').dxOverlay({
            container: $container,
            visible: true
        }).dxOverlay('instance');

        const wrapperElement = overlay.$content().parent().get(0);
        overlay.option('container', null);
        assert.strictEqual(wrapperElement.style.width, '', 'width is restored after container option value changed to window');
        assert.strictEqual(wrapperElement.style.height, '', 'height is restored after container option value changed to window');
    });

    test('content should not be moved to container', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            container: '#customTargetContainer'
        }).dxOverlay('instance');

        overlay.show();
        assert.strictEqual($('#customTargetContainer').children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
    });

    test('content should not be moved to container before content ready action', function(assert) {
        assert.expect(1);

        const overlay = $('#overlay').dxOverlay({
            container: '#customTargetContainer',
            onContentReady: function() {
                assert.strictEqual($('#customTargetContainer').children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
            }
        }).dxOverlay('instance');

        overlay.show();
    });

    test('content should not be moved to container before content ready action only if content visible', function(assert) {
        assert.expect(1);

        $('#overlay').dxOverlay({
            container: '#customTargetContainer',
            onContentReady: function() {
                assert.strictEqual($('#customTargetContainer').children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0);
            },
            deferRendering: false
        });
    });

    test('content should not be moved if overlay in container', function(assert) {
        const overlay = $('#overlayInTargetContainer').dxOverlay().dxOverlay('instance');

        overlay.show();
        assert.strictEqual(viewport().children(toSelector(OVERLAY_CLASS)).children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
    });

    test('content should be moved to parent overlay element if container equals \'null\'', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            container: false
        }).dxOverlay('instance');

        overlay.show();
        assert.strictEqual($('#overlay').children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
        assert.strictEqual($(toSelector(VIEWPORT_CLASS)).children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0);
    });

    test('css classes from overlay should be duplicated to wrapper', function(assert) {
        const instance = $('#overlayWithClass').dxOverlay({
            visible: true
        }).dxOverlay('instance');
        const $wrapper = $(instance.$content().closest(toSelector(OVERLAY_WRAPPER_CLASS)));

        assert.ok($wrapper.hasClass('something'), 'class added to wrapper');
        assert.ok($wrapper.hasClass('another'), 'another class added to wrapper');
        assert.ok($wrapper.hasClass(OVERLAY_WRAPPER_CLASS), 'classes does not removed from wrapper');
        assert.ok(!$wrapper.hasClass(OVERLAY_CLASS), 'only user-defined classes added to wrapper');
    });

    test('defaultTargetContainer should be .dx-viewport by default', function(assert) {
        const overlay = $('#overlay').dxOverlay().dxOverlay('instance');
        overlay.show();

        assert.strictEqual($(toSelector(VIEWPORT_CLASS)).children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
        assert.strictEqual($('#parentContainer').children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0);
    });

    test('content should be moved back to overlay element on hide (B253278)', function(assert) {
        const $overlay = $('#overlay').dxOverlay();
        const overlay = $overlay.dxOverlay('instance');

        overlay.show();
        overlay.hide();

        assert.ok($overlay.find(overlay.$content()).length, 'content moved back');
    });

    test('content should be moved to container on show (B253278)', function(assert) {
        const $overlay = $('#overlay').dxOverlay();
        const overlay = $overlay.dxOverlay('instance');

        overlay.show();
        overlay.hide();
        overlay.show();

        assert.ok(!$overlay.find(overlay.$content()).length, 'content moved back');
    });

    test('shader should be positioned relatively to container', function(assert) {
        const $container = $('<div>').css({
            height: '500px',
            position: 'relative'
        }).appendTo('#qunit-fixture');

        const $content = $('<div>').css({
            height: '100px',
            position: 'absolute',
            top: '100px'
        }).appendTo($container);

        const $overlay = $('#overlay').dxOverlay({
            container: $container,
            shading: true,
            position: {
                my: 'center center',
                at: 'center center',
                of: $content
            }
        });

        $overlay.dxOverlay('show');

        const $shader = $container.find(toSelector(OVERLAY_SHADER_CLASS));

        assert.ok(Math.abs(Math.round($shader.offset().top) - Math.round($container.offset().top)) <= 1, 'shader top position is correct');
        assert.strictEqual($shader.width(), $container.width(), 'shader width is correct');
        assert.strictEqual($shader.height(), $container.height(), 'shader height is correct');
    });

    [true, false].forEach(shading => {
        test(`wrapper should cover the container when target is container, shading=${shading}(T821559, T835358)`, function(assert) {
            const $targetContainer = $('#container');
            $targetContainer.css({
                height: 300,
                width: 200
            });

            $('#overlay').dxOverlay({
                shading,
                container: $targetContainer,
                visible: true,
                position: {
                    my: 'top right',
                    at: 'top right',
                    of: $targetContainer
                },
            });

            const $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
            const wrapperRect = $overlayWrapper.get(0).getBoundingClientRect();
            const targetRect = $targetContainer.get(0).getBoundingClientRect();

            assert.roughEqual(wrapperRect.left, targetRect.left, 0.5, 'left coordinates are equal');
            assert.roughEqual(wrapperRect.top, targetRect.top, 0.5, 'top coordinates are equal');
            assert.strictEqual(wrapperRect.width, targetRect.width, 'width coordinates are equal');
            assert.strictEqual(wrapperRect.height, targetRect.height, 'height coordinates are equal');
            assert.strictEqual(wrapperRect.height, 300, 'wrapper height is ok');
            assert.strictEqual(wrapperRect.width, 200, 'wrapper width is ok');
        });
    });

    test('overlay should render inside of container when target is container(T821559)', function(assert) {
        const $container = $('#container');
        $container.css({
            height: 300,
            width: 200
        });

        const $overlay = $('#overlay').dxOverlay({
            container: $container,
            shading: false,
            position: {
                of: $container
            },
            width: '50%',
            height: '50%'
        });

        $overlay.dxOverlay('show');

        const $content = $container.find(toSelector(OVERLAY_CONTENT_CLASS));
        assert.strictEqual($content.height(), $container.height() * 0.5, 'overlay height is correct');
        assert.strictEqual($content.width(), $container.width() * 0.5, 'overlay width is correct');
    });

    test('wrong position targeted container (B236074)', function(assert) {
        const $overlappedDiv = $('<div>').css({ width: 200, height: 150 });
        $overlappedDiv.appendTo('#qunit-fixture');

        try {
            const instance = $('<div>')
                .appendTo('#qunit-fixture')
                .dxOverlay({
                    container: $overlappedDiv,
                    shading: true,
                    visible: true
                }).dxOverlay('instance');

            assert.ok(!$(instance._$wrapper).hasClass(OVERLAY_MODAL_CLASS));

            instance.option('container', null);
            assert.ok($(instance._$wrapper).hasClass(OVERLAY_MODAL_CLASS));
        } finally {
            $overlappedDiv.remove();
        }
    });

    test('widget should react on viewport change', function(assert) {
        const origViewport = viewPort();

        try {
            $('#overlay').dxOverlay({
                container: undefined,
                visible: true
            });

            const $viewport = $('<div>');
            viewPort($viewport);
            assert.strictEqual($viewport.children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1, 'overlay moved to new viewport');
        } finally {
            viewPort(origViewport);
        }
    });

    test('widget should correctly react on viewport change if parent container hidden', function(assert) {
        const $origViewport = viewPort();

        try {
            const overlay = $('#overlay').dxOverlay({
                container: undefined,
                visible: true,
                animation: null
            }).dxOverlay('instance');

            overlay.$element().parent().hide();

            viewPort($origViewport); // Need to trigger viewport change callback but not change viewport value
            assert.strictEqual($origViewport.children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0, 'overlay not rendered because parent is hidden');
        } finally {
            viewPort($origViewport);
        }
    });

    test('widget should react on viewport change with correct container', function(assert) {
        const origViewport = viewPort();

        try {
            $('#overlay').dxOverlay({
                container: false,
                visible: true
            });

            const $viewport = $('<div>');
            viewPort($viewport);
            assert.strictEqual($viewport.children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 0, 'overlay not moved to new viewport');
        } finally {
            viewPort(origViewport);
        }
    });

    test('T811495 - content should be inside container if it is provided by defaultOptions', function(assert) {
        class TestOverlay extends Overlay {}

        TestOverlay.defaultOptions({
            options: {
                container: '#customTargetContainer'
            }
        });

        const overlay = new TestOverlay('#overlay');
        overlay.show();
        assert.strictEqual($('#customTargetContainer').children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
    });
});


testModule('target', moduleConfig, () => {
    test('target option should be present in positions', function(assert) {
        const $target = $('#container');

        const OverlayTarget = Overlay.inherit({

            _defaultOptionsRules: function() {
                return [];
            },

            _getDefaultOptions: function() {
                return $.extend(
                    this.callBase(),
                    {
                        position: { of: $(window) },
                        animation: {
                            show: {
                                to: { position: { of: $(window) } },
                                from: { position: { of: $(window) } }
                            },
                            hide: {
                                to: { position: { of: $(window) } },
                                from: { position: { of: $(window) } }
                            }
                        }
                    }
                );
            }

        });

        const $overlay = $('#overlay');
        const overlay = new OverlayTarget($overlay, {
            target: $target
        });

        $.each([
            'position.of',
            'animation.show.from.position.of',
            'animation.show.to.position.of',
            'animation.hide.from.position.of',
            'animation.hide.to.position.of'
        ], function(_, item) {
            assert.strictEqual(overlay.option(item).get(0), $target.get(0), item + ' set');
        });
    });
});


testModule('hide overlay by callback', moduleConfig, () => {
    test('callback should not be added if hideTopOverlayHandler option equals \'null\' (B251263, B251262)', function(assert) {
        const instance = $('#overlay').dxOverlay({
            hideTopOverlayHandler: null
        }).dxOverlay('instance');
        assert.ok(!hideTopOverlayCallback.hasCallback());

        instance.show();
        assert.ok(!hideTopOverlayCallback.hasCallback());
    });

    test('custom callback should be added via hideTopOverlayHandler', function(assert) {
        const customCallback = sinon.stub();
        const instance = $('#overlay').dxOverlay({
            hideTopOverlayHandler: customCallback
        }).dxOverlay('instance');

        assert.ok(customCallback.notCalled);

        instance.show();
        hideTopOverlayCallback.fire();

        assert.ok(customCallback.calledOnce);
    });

    test('custom callback should be correctly changed by another one', function(assert) {
        const initialCallback = sinon.stub();
        const newCallback = sinon.stub();

        const instance = $('#overlay').dxOverlay({
            hideTopOverlayHandler: initialCallback,
            visible: true
        }).dxOverlay('instance');

        instance.option('hideTopOverlayHandler', newCallback);

        assert.ok(initialCallback.notCalled);
        assert.ok(newCallback.notCalled);

        hideTopOverlayCallback.fire();

        assert.ok(initialCallback.notCalled);
        assert.ok(newCallback.calledOnce);
    });

    test('hideTopOverlayCallback callback should be unsubscribing before hide animation start', function(assert) {
        const instance = $('#overlay').dxOverlay({
            visible: true,
            animation: {
                hide: {
                    start: function() {
                        assert.ok(!hideTopOverlayCallback.hasCallback());
                    }
                }
            }
        }).dxOverlay('instance');

        instance.hide();
    });

    test('overlay should be hidden after callback fired', function(assert) {
        const instance = $('#overlay').dxOverlay().dxOverlay('instance');

        instance.show();
        hideTopOverlayCallback.fire();

        assert.strictEqual(instance.option('visible'), false, 'hidden after back button event');
    });

    test('overlay should be hidden after callback fired if overlay showed by setting option \'visible\'', function(assert) {
        const instance = $('#overlay').dxOverlay().dxOverlay('instance');

        instance.option('visible', true);
        hideTopOverlayCallback.fire();

        assert.strictEqual(instance.option('visible'), false, 'hidden after back button event');
    });
});


testModule('API', moduleConfig, () => {
    test('toggle without args', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: false
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.toggle();
        assert.strictEqual(overlay.option('visible'), true);

        overlay.toggle();
        assert.strictEqual(overlay.option('visible'), false);
    });

    test('toggle should be resolved with visibility state', function(assert) {
        const done = assert.async();

        const $overlay = $('#overlay').dxOverlay({
            visible: false
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.toggle().done((isVisible) => {
            assert.strictEqual(isVisible, true, 'visibility is true');

            overlay.toggle().done((isVisible) => {
                assert.strictEqual(isVisible, false, 'visibility is false');
                done();
            });
        });
    });

    test('toggle with args', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: false
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.toggle(true);
        assert.strictEqual(overlay.option('visible'), true);

        overlay.toggle(true);
        assert.strictEqual(overlay.option('visible'), true);

        overlay.toggle(false);
        assert.strictEqual(overlay.option('visible'), false);

        overlay.toggle(false);
        assert.strictEqual(overlay.option('visible'), false);
    });

    test('show/hide', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: false
        });
        const overlay = $overlay.dxOverlay('instance');

        overlay.show();
        assert.strictEqual(overlay.option('visible'), true);

        overlay.show();
        assert.strictEqual(overlay.option('visible'), true);

        overlay.hide();
        assert.strictEqual(overlay.option('visible'), false);

        overlay.hide();
        assert.strictEqual(overlay.option('visible'), false);
    });

    test('show/hide deferreds without animation', function(assert) {
        assert.expect(4);

        const done = assert.async();

        fx.off = true;

        const overlay = $('#overlay').dxOverlay().dxOverlay('instance');

        overlay.show().done(function() {
            assert.ok(true);
            assert.strictEqual(this, overlay);

            overlay.hide().done(function() {
                assert.ok(true);
                assert.strictEqual(this, overlay);

                done();
            });
        });
    });

    test('show/hide deferreds with animation', function(assert) {
        assert.expect(4);

        const done = assert.async();

        fx.off = false;

        const overlay = $('#overlay').dxOverlay({
            animation: {
                show: {
                    duration: 10
                },
                hide: {
                    duration: 10
                }
            }
        }).dxOverlay('instance');

        overlay.show().done(function() {
            assert.ok(true);
            assert.strictEqual(this, overlay);

            overlay.hide().done(function() {
                assert.ok(true);
                assert.strictEqual(this, overlay);

                done();
            });
        });
    });

    test('content()', function(assert) {
        const $element = $('#overlay');
        const instance = $element.dxOverlay().dxOverlay('instance');

        assert.ok(instance.$content().hasClass(OVERLAY_CONTENT_CLASS), 'API method content() returns correct jQuery object');
    });

    test('\'repaint\' method should trigger \'dxresize\' event to notify content that its dimensions could changes', function(assert) {
        const $element = $('#overlay');
        const instance = $element.dxOverlay({
            visible: true
        }).dxOverlay('instance');
        const resizeStub = sinon.stub(visibilityChange, 'triggerResizeEvent');

        instance.repaint();

        assert.strictEqual(resizeStub.callCount, 1, '\'dxresize\' event handler was called');
        resizeStub.restore();
    });
});


testModule('integration tests', moduleConfig, () => {
    test('wrong gallery render on start in overlay widget (B232427)', function(assert) {
        const overlay = $('#overlayWithAnonymousTmpl').dxOverlay().dxOverlay('instance');
        const $content = $(overlay.content());

        assert.strictEqual($content.children().length, 0, 'Overlay has no children');
        overlay.show();
        assert.strictEqual($content.children().length, 1, 'Overlay content has one children');
        overlay.hide();
        assert.strictEqual($content.children().length, 1, 'Overlay content has one children');
    });
});


testModule('widget sizing render', moduleConfig, () => {
    test('outerWidth', function(assert) {
        const $element = $('#widget').dxOverlay();
        const instance = $element.dxOverlay('instance');

        instance.show();

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    test('constructor', function(assert) {
        const $element = $('#widget').dxOverlay({ width: 400 });
        const instance = $element.dxOverlay('instance');

        instance.show();

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual(instance.$content().outerWidth(), 400, 'outer width of the element must be equal to custom width');
    });

    test('change width', function(assert) {
        const $element = $('#widget').dxOverlay();
        const instance = $element.dxOverlay('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        instance.show();

        assert.strictEqual(instance.$content().outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});


testModule('drag', moduleConfig, () => {
    test('overlay should be dragged by content', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const pointer = pointerMock($overlayContent);
        const position = $overlayContent.position();

        pointer.start().dragStart().drag(50, 50).dragEnd();

        assert.deepEqual($overlayContent.position(), {
            top: position.top + 50,
            left: position.left + 50
        }, 'overlay was moved');
    });

    test('overlay should not be dragged if dragEnabled is false', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: false,
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const pointer = pointerMock($overlayContent);
        const position = $overlayContent.position();

        pointer.start().dragStart().drag(50, 50).dragEnd();

        assert.deepEqual($overlayContent.position(), {
            top: position.top,
            left: position.left
        }, 'overlay was not moved');
    });

    test('overlay should not be dragged if dragEnabled is changed dynamically', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const pointer = pointerMock($overlayContent);
        const position = $overlayContent.position();

        overlay.option('dragEnabled', false);
        pointer.start().dragStart().drag(50, 50).dragEnd();

        assert.deepEqual($overlayContent.position(), {
            top: position.top,
            left: position.left
        }, 'overlay was not moved');
    });

    test('dragged overlay should save position after dimensions change', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            visible: true,
            width: 1,
            height: 1
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const pointer = pointerMock($overlayContent);

        pointer.start().dragStart().drag(-10).dragEnd();
        let prevPosition = $overlayContent.position().left;
        resizeCallbacks.fire();
        assert.strictEqual($overlayContent.position().left, prevPosition, 'correct position after first move');

        pointer.start().dragStart().drag(-10).dragEnd();
        prevPosition = $overlayContent.position().left;
        resizeCallbacks.fire();
        assert.strictEqual($overlayContent.position().left, prevPosition, 'correct position after next move');
    });

    test('dragged overlay should not be positioned at default location after toggle visibility', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            visible: true,
            height: 10,
            width: 10
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const pointer = pointerMock($overlayContent);
        const position = $overlayContent.position();

        pointer.start().dragStart().drag(50, 50).dragEnd();

        overlay.hide();
        overlay.show();

        assert.deepEqual($overlayContent.position(), {
            top: position.top + 50,
            left: position.left + 50
        }, 'overlay dragged position was reset');
    });

    test('overlay should not be dragged out of target', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            width: 2,
            height: 2,
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const $container = viewport();
        const pointer = pointerMock($overlayContent);

        $container.css({ padding: '10px' });

        const viewWidth = $container.outerWidth();
        const viewHeight = $container.outerHeight();
        const position = $overlayContent.position();

        const startEvent = pointer.start().dragStart().lastEvent();

        assert.strictEqual(position.left - startEvent.maxLeftOffset, 0, 'overlay should not be dragged left of target');
        assert.strictEqual(position.left + startEvent.maxRightOffset, viewWidth - $overlayContent.outerWidth(), 'overlay should not be dragged right of target');
        assert.strictEqual(position.top - startEvent.maxTopOffset, 0, 'overlay should not be dragged above the target');
        assert.strictEqual(position.top + startEvent.maxBottomOffset, viewHeight - $overlayContent.outerHeight(), 'overlay should not be dragged below than target');
    });

    test('overlay can be dragged out of target if viewport and container is not specified', function(assert) {
        try {
            viewPort(null);

            const $overlay = $('#overlay').dxOverlay({
                dragEnabled: true,
                width: 2,
                height: 2,
                visible: true
            });
            const overlay = $overlay.dxOverlay('instance');
            const $overlayContent = overlay.$content();
            const pointer = pointerMock($overlayContent);

            $(toSelector(VIEWPORT_CLASS)).attr('style', 'width: 100px; height: 100px');

            const $container = $(window);
            const viewWidth = Math.max($(document).outerWidth(), $container.outerWidth());
            const viewHeight = Math.max($(document).outerHeight(), $container.outerHeight());
            const position = $overlayContent.position();

            const startEvent = pointer.start().dragStart().lastEvent();

            assert.strictEqual(position.left + startEvent.maxRightOffset, viewWidth - $overlayContent.outerWidth(), 'overlay should not be dragged right of target');
            assert.strictEqual(position.top + startEvent.maxBottomOffset, viewHeight - $overlayContent.outerHeight(), 'overlay should not be dragged below than target');
        } finally {
            $(toSelector(VIEWPORT_CLASS)).removeAttr('style');
            viewPort(toSelector(VIEWPORT_CLASS));
        }
    });

    test('overlay should have correct resizable area if viewport and container is not specified', function(assert) {
        try {
            viewPort(null);

            const $overlay = $('#overlay').dxOverlay({
                resizeEnabled: true,
                width: 2,
                height: 2,
                visible: true
            });
            const overlay = $overlay.dxOverlay('instance');
            const resizable = $(overlay.content()).dxResizable('instance');

            assert.ok($.isWindow(resizable.option('area').get(0)), 'window is the area of the resizable');
        } finally {
            viewPort(toSelector(VIEWPORT_CLASS));
        }
    });

    test('overlay should not be dragged when container size less than overlay content', function(assert) {
        const $container = $('<div>').appendTo('#qunit-fixture').height(0).width(20);
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            visible: true,
            height: 10,
            width: 10,
            container: $container
        });

        const $overlayContent = $overlay.dxOverlay('$content');
        const pointer = pointerMock($overlayContent);

        const startEvent = pointer.start().dragStart().lastEvent();

        assert.strictEqual(startEvent.maxTopOffset, 0, 'overlay should not be dragged vertically');
        assert.strictEqual(startEvent.maxBottomOffset, 0, 'overlay should not be dragged vertically');
        assert.strictEqual(startEvent.maxLeftOffset, 0, 'overlay should not be dragged horizontally');
        assert.strictEqual(startEvent.maxRightOffset, 0, 'overlay should not be dragged horizontally');
    });

    test('overlay should be dragged correctly when position.of and shading (T534551)', function(assert) {
        const $container = $('<div>').appendTo('#qunit-fixture').height(0).width(200);
        $container.css('margin-left', '200px');
        $container.css('margin-top', '200px');

        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            visible: true,
            shading: true,
            height: 20,
            width: 20,
            position: { of: $container }
        });

        const $overlayContent = $overlay.dxOverlay('$content');
        const overlayPosition = $overlayContent.position();
        const containerPosition = $container.position();
        const viewWidth = viewport().outerWidth();
        const viewHeight = viewport().outerHeight();

        const pointer = pointerMock($overlayContent);
        const startEvent = pointer.start().dragStart().lastEvent();

        assert.strictEqual(startEvent.maxRightOffset, viewWidth - $overlayContent.outerWidth() - overlayPosition.left - 200, 'overlay should be dragged right');
        assert.strictEqual(startEvent.maxLeftOffset, 200 + overlayPosition.left, 'overlay should be dragged left');
        assert.roughEqual(startEvent.maxTopOffset, 200 + overlayPosition.top + containerPosition.top, 1, 'overlay should be dragged top');
        assert.roughEqual(startEvent.maxBottomOffset, viewHeight - $overlayContent.outerHeight() - containerPosition.top - overlayPosition.top - 200, 1, 'overlay should be dragged bottom');
    });

    test('change position after dragging', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: true,
            dragEnabled: true,
            position: { my: 'top', at: 'top', of: viewport(), offset: '0 0' }
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());
        const pointer = pointerMock($content);

        pointer.start().dragStart().drag(50, 50).dragEnd();
        assert.strictEqual($content.position().top, 50, 'overlay positioned correctly after dragging');

        overlay.option('position.offset', '0 20');

        assert.strictEqual($content.position().top, 20, 'overlay positioned correctly after change the \'position\' option');
    });
});


testModule('resize', moduleConfig, () => {
    test('overlay should have resizable component on content', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            resizeEnabled: true,
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());

        assert.strictEqual($overlayContent.dxResizable('option', 'handles'), 'all', 'direction specified correctly');
    });

    test('overlay shouldn\'t have resizable component on content if resizeEnabled is false', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            resizeEnabled: false,
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());

        assert.strictEqual($overlayContent.dxResizable('option', 'handles'), 'none', 'direction specified correctly');
    });

    test('overlay shouldn\'t have resizable component on content if resizeEnabled is changed dynamically', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            resizeEnabled: true,
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());

        overlay.option('resizeEnabled', false);
        assert.strictEqual($overlayContent.dxResizable('option', 'handles'), 'none', 'direction specified correctly');
    });

    test('resized overlay should save dimensions after dimensions change', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: 200
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const $handle = $overlayContent.find(toSelector(RESIZABLE_HANDLE_CORNER_BR_CLASS));
        const pointer = pointerMock($handle);

        pointer.start().dragStart().drag(10, 10).dragEnd();
        resizeCallbacks.fire();
        assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [210, 210], 'correct size');

        pointer.start().dragStart().drag(-20, -20).dragEnd();
        resizeCallbacks.fire();
        assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [190, 190], 'correct size');
    });

    test('resized overlay should not save dimensions after height changed', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: 200
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const $handle = $overlayContent.find(toSelector(RESIZABLE_HANDLE_CORNER_BR_CLASS));
        const pointer = pointerMock($handle);

        pointer.start().dragStart().drag(10, 10).dragEnd();
        resizeCallbacks.fire();

        overlay.option('width', 300);
        assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [300, 210], 'correct size');
    });

    test('resized overlay should save dimension for the side which was not resized', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: '70%'
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const $handle = $overlayContent.find(toSelector(RESIZABLE_HANDLE_CORNER_BR_CLASS));
        const pointer = pointerMock($handle);

        pointer.start().dragStart().drag(10, 0).dragEnd();
        resizeCallbacks.fire();

        assert.deepEqual([overlay.option('width'), overlay.option('height')], [210, '70%'], 'correct size');
    });

    test('resized overlay should not have default dimensions after toggle visibility', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            resizeEnabled: true,
            visible: true,
            width: 200,
            height: 200
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());
        const $handle = $overlayContent.find(toSelector(RESIZABLE_HANDLE_CORNER_BR_CLASS));
        const pointer = pointerMock($handle);

        pointer.start().dragStart().drag(50, 50).dragEnd();

        overlay.hide();
        overlay.show();

        assert.deepEqual([$overlayContent.width(), $overlayContent.height()], [250, 250], 'correct size');
    });
});


testModule('drag & resize', moduleConfig, () => {
    test('dragged overlay should have default dimensions after toggle visibility', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            resizeEnabled: true,
            visible: true,
            width: 'auto',
            height: 'auto'
        });
        const overlay = $overlay.dxOverlay('instance');
        const $overlayContent = $(overlay.content());

        pointerMock($overlayContent).start().dragStart().drag(50, 50).dragEnd();

        overlay.hide();
        overlay.show();

        assert.deepEqual([$overlayContent[0].style.width, $overlayContent[0].style.height], ['auto', 'auto'], 'correct size');
    });
});


testModule('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;

        this.$overlay = $('#overlay').dxOverlay({
            focusStateEnabled: true,
            dragEnabled: true,
            visible: true,
            width: 1,
            height: 1
        });

        this.overlay = this.$overlay.dxOverlay('instance');
        this.$overlayContent = $(this.overlay.content());
        this.position = this.$overlayContent.position();
        this.keyboard = keyboardMock(this.$overlayContent);
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    test('esc handling', function(assert) {
        assert.strictEqual(this.$overlayContent.attr('tabindex'), '0', 'overlay content has tabindex 0');

        this.keyboard.keyDown('esc');

        assert.strictEqual(this.overlay.option('visible'), false, 'overlay is closed after pressing esc ');
    });

    test('arrows handling', function(assert) {
        const offset = 5;
        this.keyboard.keyDown('left');
        assert.strictEqual(this.$overlayContent.position().left, this.position.left - offset, 'overlay position was change after pressing left arrow');
        this.position = this.$overlayContent.position();

        this.keyboard.keyDown('down');
        assert.strictEqual(this.$overlayContent.position().top, this.position.top + offset, 'overlay position was change after pressing down arrow');
        this.position = this.$overlayContent.position();

        this.keyboard.keyDown('right');
        assert.strictEqual(this.$overlayContent.position().left, this.position.left + offset, 'overlay position was change after pressing right arrow');
        this.position = this.$overlayContent.position();

        this.keyboard.keyDown('up');
        assert.strictEqual(this.$overlayContent.position().top, this.position.top - offset, 'overlay position was change after pressing up arrow');
    });

    test('overlay should not be dragged when container size less than overlay content, position: { my: "center center", at: "center center", of: $container }', function(assert) {
        const $container = $('<div>').appendTo('#qunit-fixture').height(14).width(14);
        const $overlay = $('#overlay').dxOverlay({
            dragEnabled: true,
            visible: true,
            height: 10,
            width: 10,
            container: $container,
            position: { my: 'center center', at: 'center center', of: $container }
        });

        const $overlayContent = $overlay.dxOverlay('$content');
        const keyboard = keyboardMock($overlayContent);

        keyboard.keyDown('left');
        assert.strictEqual($overlayContent.position().left, 0, 'overlay should not be dragged left of target');

        keyboard.keyDown('right');
        assert.strictEqual($overlayContent.position().left, $container.width() - $overlayContent.outerWidth(), 'overlay should not be dragged right of target');

        keyboard.keyDown('up');
        assert.strictEqual($overlayContent.position().top, 0, 'overlay should not be dragged above the target');

        keyboard.keyDown('down');
        assert.strictEqual($overlayContent.position().top, $container.height() - $overlayContent.outerHeight(), 'overlay should not be dragged below than target');
    });

    test('arrows handling for rtl', function(assert) {
        const offset = 5;

        this.keyboard.keyDown('left');
        assert.strictEqual(this.$overlayContent.position().left, this.position.left - offset, 'overlay position was change after pressing left arrow');
        this.position = this.$overlayContent.position();

        this.keyboard.keyDown('right');
        assert.strictEqual(this.$overlayContent.position().left, this.position.left + offset, 'overlay position was change after pressing right arrow');
    });

    test('arrows handling with dragEnable = false', function(assert) {
        this.overlay.option('dragEnabled', false);

        this.keyboard.keyDown('left');
        assert.strictEqual(this.$overlayContent.position().left, this.position.left, 'overlay position was change after pressing left arrow');
        this.position = this.$overlayContent.position();

        this.keyboard.keyDown('down');
        assert.strictEqual(this.$overlayContent.position().top, this.position.top, 'overlay position was change after pressing down arrow');
        this.position = this.$overlayContent.position();

        this.keyboard.keyDown('right');
        assert.strictEqual(this.$overlayContent.position().left, this.position.left, 'overlay position was change after pressing right arrow');
        this.position = this.$overlayContent.position();

        this.keyboard.keyDown('up');
        assert.strictEqual(this.$overlayContent.position().top, this.position.top, 'overlay position was change after pressing up arrow');
    });

    test('overlay have focus on show click', function(assert) {
        const $overlayContent = this.$overlayContent;

        this.overlay.option('animation', {
            show: {
                start: function() {
                    assert.ok(!$overlayContent.is(document.activeElement), 'focus is on overlay');
                },
                complete: function() {
                    assert.ok($overlayContent.is(document.activeElement), 'focus isn\'t on overlay');
                }
            }
        });

        this.overlay.option('visible', false);
        this.overlay.option('visible', true);
    });

    test('overlay doesn\'t handle keyboard propagated events', function(assert) {
        const $overlayContent = this.$overlayContent;
        const $input = $('<input>');

        $overlayContent.append($input);
        const keyboard = keyboardMock($input);

        keyboard.keyDown('esc');

        assert.strictEqual(this.overlay.option('visible'), true, 'overlay doesn\'t handle keyboard propagated events');
    });
});


testModule('focus policy', {
    beforeEach: function() {
        this.tabEvent = $.Event('keydown', { key: 'Tab' });
        this.shiftTabEvent = $.Event('keydown', { key: 'Tab', shiftKey: true });

        moduleConfig.beforeEach.apply(this);
    },

    afterEach: function() {
        moduleConfig.afterEach.apply(this);
    }
}, () => {
    test('elements under overlay with shader have not to get focus by tab', function(assert) {
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = $(overlay.content());

        const $firstTabbable = $content.find('.firstTabbable');
        const $lastTabbable = $content.find('.lastTabbable').focus();
        const $outsideTabbable = $content.find('.outsideTabbable');

        $(document).trigger(this.tabEvent);
        assert.strictEqual(document.activeElement, $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');

        $(document).trigger(this.shiftTabEvent);
        assert.strictEqual(document.activeElement, $lastTabbable.get(0), 'last item focused on press tab+shift on first item (does not go under overlay)');

        $outsideTabbable.focus();
        $(document).trigger(this.tabEvent);
        assert.strictEqual(document.activeElement, $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');
    });

    test('elements under overlay with shader have not to get focus by tab when top overlay has no tabbable elements', function(assert) {
        const overlay1 = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const overlay2 = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            shading: false,
            contentTemplate: function() { return 'test'; }
        });
        const $content = $(overlay1.content());

        overlay1.show();
        overlay2.show();

        const $firstTabbable = $content.find('.firstTabbable');

        $content.find('.lastTabbable').focus();
        $(document).trigger(this.tabEvent);
        assert.strictEqual(document.activeElement, $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');
    });

    test('elements under overlay with shader have not to get focus by tab after another overlay is hide', function(assert) {
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = $(overlay.content());

        new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true
        }).hide();

        const $firstTabbable = $content.find('.firstTabbable');

        $(document).trigger(this.tabEvent);
        assert.strictEqual(document.activeElement, $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');
    });

    test('elements on the page have to change focus by tab after overlay dispose', function(assert) {
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true
        });

        overlay.$element().remove();

        $(document).trigger(this.tabEvent);

        assert.strictEqual(this.tabEvent.isDefaultPrevented(), false, 'default tab behavior should not be prevented after dispose overlay');
    });

    test('elements under top overlay with shader have not to get focus by tab', function(assert) {
        new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true
        });

        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = $(overlay.content());

        const $firstTabbable = $content.find('.firstTabbable');

        $firstTabbable.focus();
        $($firstTabbable).trigger(this.tabEvent);
        assert.strictEqual(this.tabEvent.isDefaultPrevented(), false, 'default action is not prevented');
    });

    test('tabbable selectors should check only bounds', function(assert) {
        const tabbableSpy = sinon.spy(selectors, 'tabbable');
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = $(overlay.content());

        $content
            .find('.firstTabbable')
            .focus()
            .trigger(this.tabEvent);

        const $elements = $content.find('*');
        const middleElement = $elements.get(Math.floor($elements.length / 2));

        assert.ok(tabbableSpy.withArgs(0, $elements.get(0)).called, 'first element has been checked');
        assert.ok(tabbableSpy.withArgs(0, $elements.last().get(0)).called, 'last element has been checked');
        assert.notOk(tabbableSpy.withArgs(0, middleElement).called, 'middle element hasn\'t been checked');
    });

    QUnit.testInActiveWindow('tab target inside of wrapper but outside of content should not be outside', function(assert) {
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = $(overlay.content());
        const $wrapper = $content.closest(toSelector(OVERLAY_WRAPPER_CLASS));

        const contentFocusHandler = sinon.spy();
        const $tabbableDiv = $('<div>')
            .attr('tabindex', 0)
            .html('Tabbable div')
            .prependTo($wrapper);

        eventsEngine.on($tabbableDiv, 'focusin', contentFocusHandler);
        keyboardMock($tabbableDiv).press('tab');

        assert.strictEqual(contentFocusHandler.callCount, 1, 'focus has been triggered once from keyboardMock');
    });

    test('focusin event should not be propagated (T342292)', function(assert) {
        assert.expect(0);

        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = $(overlay.content());

        $(document).on('focusin.test', function() {
            assert.ok(false, 'focusin bubbled');
        });

        $($content).trigger('focusin');

        $(document).off('.test');
    });
});


testModule('scrollable interaction', {
    beforeEach: function() {
        this._originalViewport = viewPort();
        viewPort('#customTargetContainer');
        moduleConfig.beforeEach.apply(this, arguments);
    },

    afterEach: function() {
        viewPort(this._originalViewport);
        moduleConfig.afterEach.apply(this, arguments);
    }
}, () => {
    test('scroll event prevented on overlay shader 1', function(assert) {
        assert.expect(0);

        const $overlay = $('#overlay').dxOverlay({
            shading: true
        });

        $overlay.dxOverlay('option', 'visible', true);

        const $content = $overlay.dxOverlay('$content');
        const $shader = $content.closest(toSelector(OVERLAY_SHADER_CLASS));

        $($shader.parent()).on('dxdrag.TEST', {
            getDirection: function() { return 'both'; },
            validate: function() { return true; }
        }, function() {
            assert.ok(false, 'scroll should not be fired');
        });

        pointerMock($shader).start().wheel(10);

        $($shader.parent()).off('.TEST');
    });

    test('scroll event should not be prevented if originalEvent is mousemove', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            shading: true,
            visible: true
        });

        const $content = $overlay.dxOverlay('$content');
        const $shader = $content.closest(toSelector(OVERLAY_SHADER_CLASS));

        $($shader).on('dxdrag', {
            getDirection: function() { return 'both'; },
            validate: function() { return true; }
        }, function(e) {
            if(e.originalEvent.originalEvent.type === 'mousemove') {
                assert.strictEqual(e.isDefaultPrevented(), false, 'mousemove is not prevented');
                return;
            }
            assert.strictEqual(e.isDefaultPrevented(), true, 'touchmove is prevented');
        });

        let event = $.Event('dxdrag', {
            originalEvent: $.Event('dxpointermove', {
                originalEvent: $.Event('mousemove')
            })
        });

        $($shader).trigger(event);

        event = $.Event('dxdrag', {
            originalEvent: $.Event('dxpointermove', {
                originalEvent: $.Event('touchmove')
            })
        });

        $($shader).trigger(event);
    });

    test('scroll event prevented on overlay shader', function(assert) {
        try {
            const $overlay = $($('#overlay').dxOverlay({
                shading: true,
                visible: true
            }));
            const $content = $($overlay.dxOverlay('$content'));

            $(document).on('dxpointermove.TEST', function(e) {
                assert.ok(e.isScrollingEvent, 'scrolling event set');
            });

            $content
                .trigger({
                    type: 'dxpointerdown',
                    pointers: [null]
                })
                .trigger({
                    type: 'dxpointermove',
                    isScrollingEvent: true,
                    pointers: [null]
                });
        } finally {
            $(document).off('.TEST');
        }
    });

    test('scroll event prevented on overlay', function(assert) {
        assert.expect(1);

        const $overlay = $($('#overlay').dxOverlay());
        const $scrollable = $('<div>');

        $overlay.dxOverlay('option', 'visible', true);
        const $content = $($overlay.dxOverlay('$content')).append($scrollable);

        $scrollable.dxScrollable({
            useNative: false,
            bounceEnabled: false,
            direction: 'vertical',
            inertiaEnabled: false
        });

        const $overlayWrapper = $content.closest(toSelector(OVERLAY_WRAPPER_CLASS));

        $($overlayWrapper).on('dxdrag.TEST', {
            getDirection: function() { return 'both'; },
            validate: function() { return true; }
        }, function(e) {
            assert.ok(e.isDefaultPrevented(), 'scroll event prevented');
        });

        $($overlayWrapper.parent()).on('dxdrag.TEST', {
            getDirection: function() { return 'both'; },
            validate: function() { return true; }
        }, function() {
            assert.ok(false, 'scroll should not be fired');
        });

        pointerMock($scrollable.find('.dx-scrollable-container'))
            .start()
            .wheel(10);

        $overlayWrapper
            .off('.TEST')
            .parent()
            .off('.TEST');
    });

    // T886654
    test('Scroll event should not prevented on overlay that avoid the [Intervation] error when event is not cancelable', function(assert) {
        assert.expect(1);

        const $overlay = $($('#overlay').dxOverlay());
        const $scrollable = $('<div>');

        $overlay.dxOverlay('instance').option('visible', true);
        const $content = $($overlay.dxOverlay('$content')).append($scrollable);

        $scrollable.dxScrollable({
            useNative: true,
            bounceEnabled: false,
            direction: 'vertical',
            inertiaEnabled: false
        });

        const $overlayWrapper = $content.closest(toSelector(OVERLAY_WRAPPER_CLASS));

        $($overlayWrapper).on('dxdrag', {
            getDirection: () => 'both',
            validate: () => true
        }, (e) => {
            assert.strictEqual(e.isDefaultPrevented(), false, 'not cancelable event should not be prevented');
        });

        $($overlayWrapper.parent()).on('dxdrag', {
            getDirection: function() { return 'both'; },
            validate: function() { return true; }
        }, function() {
            assert.ok(false, 'event should not be fired');
        });

        const event = $.Event('dxdrag', {
            cancelable: false,
            originalEvent: $.Event('dxpointermove', {
                originalEvent: $.Event('touchmove')
            })
        });

        $($overlayWrapper).trigger(event);
    });

    test('scroll event does not prevent gestures', function(assert) {
        const $gestureCover = $('.dx-gesture-cover');
        const originalPointerEvents = $gestureCover.css('pointerEvents');

        const $overlay = $('#overlay').dxOverlay({
            shading: true,
            visible: true
        });

        const $content = $overlay.dxOverlay('$content');
        const $shader = $content.closest(toSelector(OVERLAY_SHADER_CLASS));

        $($shader).on({
            'dxdragstart': function() {
                assert.strictEqual($gestureCover.css('pointerEvents'), originalPointerEvents, 'selection is enabled');
            },
            'dxdragend': function() {
                assert.strictEqual($gestureCover.css('pointerEvents'), originalPointerEvents, 'selection is enabled');
            }
        });

        pointerMock($shader)
            .start()
            .wheel(10);
    });

    test('scroll event should not prevent text selection in content', function(assert) {
        assert.expect(1);

        const $overlay = $('#overlay').dxOverlay({
            shading: true,
            visible: true
        });

        const $content = $overlay.dxOverlay('$content');
        const $shader = $content.closest(toSelector(OVERLAY_SHADER_CLASS));

        const e = pointerMock($shader)
            .start()
            .dragStart()
            .drag(10, 0)
            .lastEvent();

        assert.ok(e._cancelPreventDefault, 'overlay should set special flag for prevent default cancelling');
    });
});


testModule('specifying base z-index', moduleConfig, () => {
    test('overlay should render with correct z-index by default', function(assert) {
        const $overlay = $('#overlay').dxOverlay({ visible: true });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());
        const $wrapper = $content.parent();

        assert.strictEqual($content.css('zIndex'), '1501', 'z-index for content is correct');
        assert.strictEqual($wrapper.css('zIndex'), '1501', 'z-index for wrapper is correct');
    });

    test('base z-index should be changed using the static method', function(assert) {
        Overlay.baseZIndex(10000);

        const $overlay = $('#overlay').dxOverlay({
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = $(overlay.content());
        const $wrapper = $content.parent();

        assert.strictEqual($content.css('zIndex'), '10001', 'z-index for content is correct');
        assert.strictEqual($wrapper.css('zIndex'), '10001', 'z-index for wrapper is correct');
    });
});


testModule('overlay utils', moduleConfig, () => {
    test('Overlay Base Zindex should return default ZIndex', function(assert) {
        assert.strictEqual(Overlay.baseZIndex(), 1500, 'base zindex is correct');

        Overlay.baseZIndex(2000);
        assert.strictEqual(Overlay.baseZIndex(), 2000, 'base zindex is correct');
    });

    test('base zIndex can be defined as zero', function(assert) {
        Overlay.baseZIndex(0);
        assert.strictEqual(zIndex.create(), 1);
    });

    test('create method should return the redefined base zindex when no opened overlays exists', function(assert) {
        Overlay.baseZIndex(2000);
        assert.strictEqual(zIndex.create(), 2001);
    });

    test('new created zindex should be greater than last one', function(assert) {
        assert.strictEqual(zIndex.create(), 1501);
        assert.strictEqual(zIndex.create(), 1502);
        assert.strictEqual(zIndex.create(), 1503);
    });

    test('it should be possible to remove zindex from the stack', function(assert) {
        zIndex.create();
        zIndex.create();

        zIndex.remove(1502);
        assert.strictEqual(zIndex.create(), 1502, 'zindex has been restored');
    });

    test('it should be possible to remove all created zindices', function(assert) {
        zIndex.create();
        zIndex.create();

        zIndex.clearStack();
        assert.strictEqual(zIndex.create(), 1501);
    });

    test('a new overlay should create a new zindex on first showing', function(assert) {
        new Overlay('#overlay', { visible: true });
        assert.strictEqual(zIndex.create(), 1502, 'new zindex is larger than overlay\'s');
    });

    test('overlay should remove its zindex from the stack on dispose', function(assert) {
        const instance = new Overlay('#overlay', { visible: true });
        instance.dispose();
        assert.strictEqual(zIndex.create(), 1501, 'zindex has been removed');
    });

    test('overlay should create new zindex only at first showing', function(assert) {
        const overlay = new Overlay('#overlay', { visible: true });

        overlay.option('visible', false);
        overlay.option('visible', true);
        overlay.option('visible', false);
        overlay.option('visible', true);

        assert.strictEqual(zIndex.create(), 1502, 'new zindex is larger than overlay\'s');
    });

    test('overlay should get next z-index if the first one has been created before', function(assert) {
        zIndex.create();

        const overlay = new Overlay('#overlay', { visible: true });
        const content = $(overlay.content());

        assert.strictEqual(String(getComputedStyle(content[0]).zIndex), '1502');

        assert.strictEqual(zIndex.create(), 1503, 'new zindex is larger than overlay\'s');
    });

    test('it should not be possible to remove unexisting zIndex', function(assert) {
        const index = zIndex.create();
        zIndex.remove(9999);

        assert.strictEqual(zIndex.create(), index + 1, 'the next index has been created');
    });
});

testModule('renderGeometry', {
    beforeEach: function() {
        fx.off = true;
        this.overlayInstance = $('#overlay').dxOverlay({ deferRendering: false }).dxOverlay('instance');
        this.renderGeometrySpy = sinon.spy(this.overlayInstance, '_renderGeometry');
    },
    afterEach: function() {
        zIndex.clearStack();
        Overlay.baseZIndex(1500);
        fx.off = false;
    }
}, () => {
    test('visibility change', function(assert) {
        assert.ok(this.renderGeometrySpy.notCalled, 'render geometry isn\'t called yet');

        this.overlayInstance.show();
        assert.ok(this.renderGeometrySpy.calledOnce, 'render geometry called once');

        const isDimensionChanged = !!this.renderGeometrySpy.getCall(0).args[0];
        assert.notOk(isDimensionChanged);
    });

    test('dimension change', function(assert) {
        this.overlayInstance.show();
        resizeCallbacks.fire();

        const isDimensionChanged = !!this.renderGeometrySpy.getCall(1).args[0];
        assert.ok(isDimensionChanged);
    });

    test('repaint', function(assert) {
        this.overlayInstance.show();
        this.overlayInstance.repaint();

        const isDimensionChanged = !!this.renderGeometrySpy.getCall(1).args[0];
        assert.notOk(isDimensionChanged);
    });

    test('option change', function(assert) {
        const options = this.overlayInstance.option();
        const newOptions = {
            dragEnabled: !options.dragEnabled,
            resizeEnabled: !options.resizeEnabled,
            width: 500,
            height: 500,
            minWidth: 100,
            maxWidth: 1000,
            minHeight: 100,
            maxHeight: 1000,
            boundaryOffset: { h: 10, v: 10 },
            position: { of: this.overlayInstance.element() }
        };
        this.overlayInstance.show();

        for(const optionName in newOptions) {
            const initialCallCount = this.renderGeometrySpy.callCount;

            this.overlayInstance.option(optionName, newOptions[optionName]);

            const isDimensionChanged = !!this.renderGeometrySpy.lastCall.args[0];
            assert.ok(initialCallCount < this.renderGeometrySpy.callCount, 'renderGeomentry callCount has increased');
            assert.notOk(isDimensionChanged);
        }
    });
});
