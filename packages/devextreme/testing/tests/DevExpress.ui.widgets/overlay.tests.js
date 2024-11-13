import { getWidth, getHeight, getOuterWidth } from 'core/utils/size';
import fx from 'common/core/animation/fx';
import positionUtils from 'common/core/animation/position';
import { locate } from 'common/core/animation/translator';
import 'generic_light.css!';
import config from 'core/config';
import devices from '__internal/core/m_devices';
import { Template } from 'core/templates/template';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { isRenderer } from 'core/utils/type';
import { value as viewPort } from 'core/utils/view_port';
import eventsEngine from 'common/core/events/core/events_engine';
import visibilityChange, { triggerHidingEvent, triggerShownEvent } from 'common/core/events/visibility_change';
import $ from 'jquery';
import { hideCallback as hideTopOverlayCallback } from 'common/core/environment/hide_callback';
import errors from 'core/errors';
import uiErrors from 'ui/widget/ui.errors';
import Overlay from 'ui/overlay/ui.overlay';
import * as zIndex from '__internal/ui/overlay/m_z_index';
import 'ui/scroll_view/ui.scrollable';
import selectors from 'ui/widget/selectors';
import swatch from 'ui/widget/swatch_container';
import keyboardMock from '../../helpers/keyboardMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import nativePointerMock from '../../helpers/nativePointerMock.js';
import { getActiveElement } from '../../helpers/shadowDom.js';
import browser from 'core/utils/browser';

QUnit.testStart(function() {
    viewPort($('#qunit-fixture').addClass(VIEWPORT_CLASS));

    const markup =
        `<style nonce="qunit-test">
            html, body {
                height: 100%;
                margin: 0;
            }

            #qunit-fixture {
                width: 100%;
                height: 100%;
            }

            #B237292_container {
               width: 100px;
               height: 100px
            }
        </style>

        <div id="overlayInTargetContainer"></div>

        <div id="customTargetContainer">
            <div id="parentContainer">
                <input id="overlayInputTarget" type="text" />
                <div id="overlay"></div>
                <div id="overlay2">
                    <div id="test"></div>
                </div>
            </div>
        </div>

        <div id="container"></div>

        <div id="overlayWithClass" class="something another"></div>

        <div id="overlayWithAnonymousTmpl">
            <div id="content"></div>
        </div>

        <div id="B237292">
            <div id="B237292_container"></div>

            <div id="B237292_overlay">
                Overlay content
            </div>
        </div>

        <div id="Q518355">
            <div id="Q518355_overlay_1"></div>
            <div id="Q518355_overlay_2"></div>
        </div>

        <div id="overlayWithContentTemplate">
            <div data-options="dxTemplate: { name: 'custom' }">
                TestContent
            </div>
        </div>

        <div id="overlayWithWrongTemplateName">
            <div data-options="dxTemplate: { name: 'wrongName' }">testContent</div>
        </div>
        <div id="widget"></div>

        <script type="text/html" id="focusableTemplate">
            <a>something</a>
            <input class="firstTabbable" />
            <div tabindex='0'></div>
            <textarea></textarea>
            <div tabindex='-1'></div>
            <a href="#" class="lastTabbable">something</a>
        </script>
        <input class="outsideTabbable" />

        <div>
            <div class="dx-swatch-my-color_scheme1 some-class some-class2">
                <div>
                    <div id="swatchOverlay1"></div>
                </div>
            </div>
            <div class="some-class some-class2 dx-swatch-my-color_scheme2 some-class3">
                <div>
                    <div id="swatchOverlay2"></div>
                    <div id="swatchOverlay3"></div>
                </div>
            </div>
        <div>`;

    $('#qunit-fixture').html(markup);
});

const OVERLAY_CLASS = 'dx-overlay';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const OVERLAY_SHADER_CLASS = 'dx-overlay-shader';
const INNER_OVERLAY_CLASS = 'dx-inner-overlay';

const HOVER_STATE_CLASS = 'dx-state-hover';

const IS_SAFARI = !!browser.safari;
const VIEWPORT_CLASS = 'dx-viewport';
const PREVENT_SAFARI_SCROLLING_CLASS = 'dx-prevent-safari-scrolling';

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

testModule('render', moduleConfig, () => {
    test('overlay class should be added to overlay', function(assert) {
        const $element = $('#overlay').dxOverlay();
        assert.ok($element.hasClass(OVERLAY_CLASS));
    });

    test('inner overlay class should depend on innerOverlay option', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            innerOverlay: true
        }).dxOverlay('instance');
        const $content = overlay.$content();

        assert.ok($content.hasClass(INNER_OVERLAY_CLASS));

        overlay.option('innerOverlay', false);
        assert.notOk($content.hasClass(INNER_OVERLAY_CLASS));
    });

    test('content should be present when widget instance exists', function(assert) {
        const $element = $('#overlay').dxOverlay();
        const instance = $element.dxOverlay('instance');

        assert.ok($(toSelector(OVERLAY_CONTENT_CLASS)).length);

        instance.dispose();
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
                    getWidth($(toSelector(OVERLAY_CONTENT_CLASS)));
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
            clock.tick(10);
            assert.strictEqual(onShowingSpy.called, true);
        } finally {
            clock.restore();
        }
    });

    test('overlay should be positioned correctly after async template is rendered (T1114344)', function(assert) {
        // NOTE: React 18 renders templates asynchronously. It cannot be changed in our react wrappers.

        const clock = sinon.useFakeTimers();
        try {
            const overlay = $('#overlay').dxOverlay({
                templatesRenderAsynchronously: true,
                visible: true,
                width: 'auto',
                container: 'body',
                integrationOptions: {
                    templates: {
                        'content': {
                            render: function(args) {
                                setTimeout(() => {
                                    args.container.append($('<div>').width(500));
                                    args.onRendered();
                                }, 100);
                            }
                        }
                    }
                }
            }).dxOverlay('instance');

            clock.tick(100);

            const contentRect = overlay.$content().get(0).getBoundingClientRect();
            const contentCenterX = (contentRect.left + contentRect.right) / 2;
            const windowCenterX = window.innerWidth / 2;
            assert.roughEqual(contentCenterX, windowCenterX, 1, 'content is centered');
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
            clock.tick(10);
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
        const $content = instance.$content();

        $($content).trigger('dxhoverstart');
        assert.ok($content.hasClass(HOVER_STATE_CLASS));
    });

    test('default', function(assert) {
        const instance = $('#overlay').dxOverlay().dxOverlay('instance');
        const $content = instance.$content();

        assert.ok(!$content.is(':visible'));
        assert.ok(!viewport().children(toSelector(OVERLAY_SHADER_CLASS)).is(':visible'));
        assert.ok(getWidth($content) < getWidth($(window)));
        assert.ok(getHeight($content) < getHeight($(window)));
    });

    test('RTL markup - rtlEnabled by default', function(assert) {
        const overlay = $('#overlay').dxOverlay({ rtlEnabled: true }).dxOverlay('instance');

        overlay.show();

        const $content = overlay.$content();

        assert.ok($content.hasClass('dx-rtl'));
    });

    test('Color swatches - overlay should be rendered on viewport by default', function(assert) {
        const overlay = $('#overlay').dxOverlay().dxOverlay('instance');
        overlay.show();
        const $wrapper = overlay.$wrapper();
        assert.ok($wrapper.parent().hasClass(VIEWPORT_CLASS));
    });

    test('Color swatches - overlay should be rendered on the child of viewport with special class', function(assert) {
        const containers = [];

        for(let i = 1; i <= 3; i++) {
            const overlay = $('#swatchOverlay' + i).dxOverlay().dxOverlay('instance');
            overlay.show();
            containers[i] = overlay.$wrapper().parent();
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

        const overlayContainer = overlay.$wrapper().parent();

        assert.ok(overlayContainer.hasClass('dx-swatch-my-color_scheme1'), 'overlay\'s container has right class');
        assert.ok(overlayContainer.parent().hasClass(VIEWPORT_CLASS), 'overlay\'s container is the viewport\'s child');
    });

    test('Overlay does not fail if swatch is undefined (render before documentReady, T713615, T1143527)', function(assert) {
        const stub = sinon.stub(swatch, 'getSwatchContainer').callsFake(() => {
            return undefined;
        });

        try {
            $('#container').dxOverlay({ visible: true });

            assert.expect(0);
        } finally {
            stub.restore();
        }
    });

    test('Overlay content should have overflow clip style', function(assert) {
        const overlay = $('#overlay').dxOverlay().dxOverlay('instance');
        const contentOverflowStyle = $(overlay.content()).css('overflow');

        assert.strictEqual(contentOverflowStyle, 'clip');
    });

    QUnit.module('Breaking change t1123711 - warning W1021', () => {
        test('should be logged if container is invalid', function(assert) {
            sinon.spy(uiErrors, 'log');

            try {
                $('#overlay').dxOverlay({
                    container: 'invalid',
                    visible: true
                });

                assert.ok(uiErrors.log.calledOnce, 'only one warning is logged');
                assert.deepEqual(uiErrors.log.lastCall.args, [
                    'W1021',
                    'dxOverlay',
                ], 'args of the log method');
            } finally {
                uiErrors.log.restore();
            }
        });

        test('should not not be logged if container is valid', function(assert) {
            sinon.spy(uiErrors, 'log');

            try {
                $('#overlay').dxOverlay({
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

    test('there is no errors when overlay has a subscription on \'onHiding\' even when the widget is disposed', function(assert) {
        const instance = $('#overlay').dxOverlay({
            visible: true,
            onHiding: function(e) {
                e.component.dispose();
            }
        }).dxOverlay('instance');

        try {
            instance.hide();
        } catch(e) {
            assert.ok(false, `error: ${e.message}`);
        }

        assert.ok(true, 'no errors');
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
                assert.strictEqual(afterShowFired, 0, 'afterShowFired');

                beforeShowFired++;
            },
            onPositioned: function({ position }) {
                assert.strictEqual(beforeShowFired, 1, 'beforeShowFired');
                assert.strictEqual(this.$content().css('display'), 'block');
                assert.ok(position);

                positionedFired++;
            },
            onShown: function() {
                assert.strictEqual(positionedFired, 1, 'positionedFired');
                assert.strictEqual(this.$content().css('display'), 'block');

                afterShowFired++;
            },
            onHiding: function() {
                assert.strictEqual(this.$content().css('display'), 'block');
                assert.strictEqual(afterHideFired, 0, 'afterHideFired');

                beforeHideFired++;
            },
            onHidden: function() {
                assert.strictEqual(beforeHideFired, 1, 'beforeHideFired');
                assert.strictEqual(this.$content().css('display'), 'none');

                afterHideFired++;
            }
        }).dxOverlay('instance');

        instance.show().done(() => {
            assert.strictEqual(beforeShowFired, 1, 'beforeShowFired');
            assert.strictEqual(positionedFired, 1, 'positionedFired');
            assert.strictEqual(afterShowFired, 1, 'afterShowFired');

            instance.hide().done(() => {
                assert.strictEqual(beforeHideFired, 1), 'beforeHideFired';
                assert.strictEqual(afterHideFired, 1, 'afterHideFired');
            });
        });
    });

    testModule('wrapperAttr option', {
        beforeEach: function() {
            this.overlay = $('#overlay').dxOverlay({
                wrapperAttr: { class: 'someClass' },
                visible: true
            }).dxOverlay('instance');
            this.$content = this.overlay.$content();
            this.$wrapper = this.overlay.$wrapper();
        }
    }, () => {
        test('adds attribute on wrapper on init', function(assert) {
            assert.ok(this.$wrapper.hasClass('someClass'));
        });

        test('adds attribute on wrapper on runtime', function(assert) {
            this.overlay.option('wrapperAttr', { someAttr: 'someValue' });

            assert.strictEqual(this.$wrapper.attr('someAttr'), 'someValue');
        });

        test('does not override default clases', function(assert) {
            this.overlay.option('wrapperAttr', { class: 'newClass' });

            assert.ok(this.$wrapper.hasClass(OVERLAY_WRAPPER_CLASS));
        });

        test('overrides custom clases', function(assert) {
            this.overlay.option('wrapperAttr', { class: 'newClass' });

            assert.ok(this.$wrapper.hasClass('newClass'));
            assert.notOk(this.$wrapper.hasClass('someClass'));
        });

        test('with null/undefined value deletes old classes from wrapperAttr', function(assert) {
            this.overlay.option('wrapperAttr', undefined);

            assert.notOk(this.$wrapper.hasClass('someClass'));

            this.overlay.option('wrapperAttr', { class: 'newClass' });
            this.overlay.option('wrapperAttr', null);

            assert.notOk(this.$wrapper.hasClass('newClass'));
        });
    });
});


testModule('visibility', moduleConfig, () => {
    test('overlay should be shown when option visible set to true', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = overlay.$content();
        const $wrapper = overlay.$wrapper();

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
        const $content1 = overlay1.$content();
        const contentZIndex = parseInt($content1.css('zIndex'), 10);
        const wrapperZIndex = parseInt(overlay1.$wrapper().css('zIndex'), 10);

        overlay2.show();
        const $content2 = overlay2.$content();
        assert.strictEqual(parseInt($content2.css('zIndex'), 10), contentZIndex + 1);
        assert.strictEqual(parseInt(overlay2.$wrapper().css('zIndex'), 10), wrapperZIndex + 1);
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
                }).appendTo(e.component.$content().get(0));
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

        const $overlayContent = overlay.$content();
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

    test('overlay should not close after click on content element in shadow dom (T1146455)', function(assert) {
        const content = $('<div>').get(0);

        const overlay = $('#overlay').dxOverlay({
            hideOnOutsideClick: true,
            contentTemplate: () => content,
            visible: true
        }).dxOverlay('instance');

        overlay.show();

        content.attachShadow({ mode: 'open' });
        content.shadowRoot.innerHTML = '<p>Inner Text</p>';

        const textElement = content.shadowRoot.querySelector('p');

        $(overlay.$content()).trigger($.Event('dxpointerdown', { target: textElement }));

        assert.strictEqual(overlay.option('visible'), true, 'Overlay should stay visible');
    });

    testModule('e.cancel', {
        beforeEach: function(assert) {
            this.onShown = sinon.stub();
            this.onHidden = sinon.stub();
            this.$overlay = $('#overlay').dxOverlay({
                onShown: this.onShown,
                onHidden: this.onHidden,
            });
            this.overlay = this.$overlay.dxOverlay('instance');
            this.checkIsNotShown = () => {
                assert.notOk(this.onShown.called, 'onShown should not be called');
            };
            this.checkIsShown = () => {
                assert.notOk(this.$overlay.is(':hidden')), 'overlay is not hidden';
                assert.ok(this.onShown.called, 'onShown should be called');
            };
            this.checkIsNotHidden = () => {
                assert.notOk(this.$overlay.is(':hidden')), 'overlay is not hidden';
                assert.notOk(this.onHidden.called, 'onHidden should not be called');
            };
            this.checkIsHidden = () => {
                assert.ok(this.$overlay.is(':hidden')), 'overlay is hidden';
                assert.ok(this.onHidden.called, 'onHidden should be called');
            };
        }
    }, () => {
        test('overlay should not be shown if e.cancel == true in the onShowing event handler (T825865)', function(assert) {
            this.overlay.option({ onShowing: e => e.cancel = true });
            this.overlay.show();

            assert.ok(this.$overlay.is(':hidden'), 'overlay is hidden');
            this.checkIsNotShown();
        });

        test('overlay should not be hidden if e.cancel == true in the onHiding event handler', function(assert) {
            this.overlay.option({
                visible: true,
                onHiding: e => e.cancel = true
            });
            this.overlay.hide();

            this.checkIsNotHidden();
        });

        test('overlay should be shown after timeout if e.cancel == promise resolving false after timeout', function(assert) {
            const done = assert.async();
            this.overlay.option({
                onShowing: e => {
                    e.cancel = new Promise((resolve) => {
                        setTimeout(() => resolve(false), 0);
                    });
                }
            });
            this.overlay.show();

            this.checkIsNotShown();

            setTimeout(() => {
                done();

                this.checkIsShown();
            }, 0);
        });

        test('overlay should be hidden after timeout if e.cancel == promise resolving false after timeout', function(assert) {
            const done = assert.async();
            this.overlay.option({
                visible: true,
                onHiding: e => {
                    e.cancel = new Promise((resolve) => {
                        setTimeout(() => resolve(false), 0);
                    });
                }
            });
            this.overlay.hide();

            this.checkIsNotHidden();

            setTimeout(() => {
                done();

                this.checkIsHidden();
            }, 0);
        });

        test('overlay should not be shown after timeout if e.cancel == promise resolving true after timeout', function(assert) {
            const done = assert.async();
            this.overlay.option({
                onShowing: e => {
                    e.cancel = new Promise((resolve) => {
                        setTimeout(() => resolve(true), 0);
                    });
                }
            });
            this.overlay.show();

            setTimeout(() => {
                done();

                this.checkIsNotShown();
            }, 0);
        });

        test('overlay should not be hidden after timeout if e.cancel == promise resolving true after timeout', function(assert) {
            const done = assert.async();
            this.overlay.option({
                visible: true,
                onHiding: e => {
                    e.cancel = new Promise((resolve) => {
                        setTimeout(() => resolve(true), 0);
                    });
                }
            });
            this.overlay.hide();

            setTimeout(() => {
                done();

                this.checkIsNotHidden();
            }, 0);
        });

        test('overlay should be shown after timeout if e.cancel == promise rejecting after timeout', function(assert) {
            const done = assert.async();
            this.overlay.option({
                onShowing: e => {
                    e.cancel = new Promise((_, reject) => {
                        setTimeout(() => reject(), 0);
                    });
                }
            });
            this.overlay.show();

            this.checkIsNotShown();

            setTimeout(() => {
                done();

                this.checkIsShown();
            }, 0);
        });

        test('overlay should be hidden after timeout if e.cancel == promise rejecting after timeout', function(assert) {
            const done = assert.async();
            this.overlay.option({
                visible: true,
                onHiding: e => {
                    e.cancel = new Promise((_, reject) => {
                        setTimeout(() => reject(), 0);
                    });
                }
            });
            this.overlay.hide();

            this.checkIsNotHidden();

            setTimeout(() => {
                done();

                this.checkIsHidden();
            }, 0);
        });

        test('overlays content should be hidden on onShowig event (T1107193)', function(assert) {
            assert.expect(1);

            this.overlay.option({
                onShowing: () => {
                    const isContentHidden = $(this.overlay.content()).css('visibility') === 'hidden';
                    assert.ok(isContentHidden, 'content is hidden');
                }
            });
            this.overlay.show();
        });

        test('overlay closing should not be cancelled if previous showing was cancelled (T1120608)', function(assert) {
            let shouldCancelOpening = true;
            const $overlay = $('#overlay').dxOverlay({
                onShowing: (e) => {
                    e.cancel = shouldCancelOpening;
                }
            });
            const overlay = $overlay.dxOverlay('instance');

            const isVisible = () => !$overlay.is(':hidden');

            overlay.show();
            assert.strictEqual(isVisible(), false, 'showing is cancelled');

            shouldCancelOpening = false;
            overlay.show();
            assert.strictEqual(isVisible(), true, 'showing is not cancelled');

            overlay.hide();
            assert.strictEqual(isVisible(), false, 'hiding is not cancelled');
        });

        test('overlay showing should not be cancelled if previous hiding was cancelled', function(assert) {
            let shouldCancelHiding = true;
            const $overlay = $('#overlay').dxOverlay({
                onHiding: (e) => {
                    e.cancel = shouldCancelHiding;
                },
                visible: true
            });
            const overlay = $overlay.dxOverlay('instance');

            const isVisible = () => !$overlay.is(':hidden');

            overlay.hide();
            assert.strictEqual(isVisible(), true, 'hiding is cancelled');

            shouldCancelHiding = false;
            overlay.hide();
            assert.strictEqual(isVisible(), false, 'hiding is not cancelled');

            overlay.show();
            assert.strictEqual(isVisible(), true, 'showing is not cancelled');
        });

        test('showing promise should be rejected if showing is cancelled', function(assert) {
            const done = assert.async();
            const overlay = $('#overlay').dxOverlay({
                onShowing: (e) => {
                    e.cancel = true;
                },
            }).dxOverlay('instance');

            overlay
                .show()
                .then(() => {
                    assert.notOk(true, 'showing promise is resolved');
                    done();
                })
                .catch(() => {
                    assert.ok(true, 'showing promise is rejected');
                    done();
                });
        });

        test('hiding promise should be rejected if hiding is cancelled', function(assert) {
            const done = assert.async();
            const overlay = $('#overlay').dxOverlay({
                onHiding: (e) => {
                    e.cancel = true;
                },
                visible: true
            }).dxOverlay('instance');

            overlay
                .hide()
                .then(() => {
                    assert.notOk(true, 'hiding promise is resolved');
                    done();
                })
                .catch(() => {
                    assert.ok(true, 'hiding promise is rejected');
                    done();
                });
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
        const $content = overlay.$content();

        assert.strictEqual($content.position().top, 0, 'overlay positioned correctly');
    });

    test('position should be correct on second showing (B238662, B232822)', function(assert) {
        const $overlay = $('#overlay').html('123').dxOverlay();
        const overlay = $overlay.dxOverlay('instance');
        const $content = overlay.$content();

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

    test('position of overlay is absolute when visualContainer is not window', function(assert) {
        $('#overlay').dxOverlay({
            visible: true,
            visualContainer: viewPort()
        });

        const $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
        assert.strictEqual($overlayWrapper.css('position'), 'absolute');
    });

    test('wrapper should have 100% width and height when shading is disabled', function(assert) {
        $('#overlay').dxOverlay({
            visible: true,
            shading: false
        });

        const $overlayWrapper = viewport().find(toSelector(OVERLAY_WRAPPER_CLASS));
        const wrapperStyle = getComputedStyle($overlayWrapper.get(0));

        assert.strictEqual(parseInt(wrapperStyle.width), getWidth($(window)), 'width is 100%');
        assert.strictEqual(parseInt(wrapperStyle.height), getHeight($(window)), 'height is 100%');
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
        const $overlayContent = overlay.$content();

        overlay.show();
        const expectedPosition = positionUtils.calculate($overlayContent, widgetPosition);
        assert.deepEqual(positionUtils.setup($overlayContent), { top: expectedPosition.v.location, left: expectedPosition.h.location }, 'overlay positioned correctly');
    });

    // deprecated in 21.2
    test('position as function', function(assert) {
        sinon.spy(errors, 'log');
        try {
            const overlay = $('#overlay').dxOverlay({
                visible: true,
                position: function() { return { my: 'left', at: 'left', of: 'body', offset: '7 0' }; }
            }).dxOverlay('instance');

            const $content = overlay.$content();

            assert.strictEqual($content.position().left, $('body').position().left + 7, 'overlay positioned correctly');
            assert.strictEqual(errors.log.callCount, 1);
            assert.deepEqual(errors.log.lastCall.args, ['W0018']);
        } finally {
            errors.log.restore();
        }
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

        assert.roughEqual(getWidth($overlayWrapper), getWidth($(window)), 1.01, 'overlay wrapper width is correct');
        assert.roughEqual(getHeight($overlayWrapper), getHeight($(window)), 1.01, 'overlay wrapper height is correct');
    });

    test('position.of as an event', function(assert) {
        const event = $.Event('click', { target: $('#overlayInputTarget') });
        const overlay = $('#overlay').dxOverlay({
            visible: true,
            position: { my: 'top', at: 'top', of: event }
        }).dxOverlay('instance');

        const $content = overlay.$content();

        assert.strictEqual($content.position().top, event.target.position().top, 'overlay is positioned correctly');
    });

    test('overlay content should have correct position when position.boundary changes to window', function(assert) {
        const $boundary = $('<div>')
            .css({ width: 20, height: 30 })
            .appendTo('#qunit-fixture');
        const contentWidth = 25;
        const contentHeight = 35;
        const overlay = $('#overlay').dxOverlay({
            visible: true,
            width: contentWidth,
            height: contentHeight,
            animation: null,
            position: {
                collision: 'fit',
                boundary: $boundary,
            }
        }).dxOverlay('instance');
        const $overlayContent = overlay.$content();
        let contentOffset = $overlayContent.offset();
        const boundaryOffset = $boundary.offset();

        assert.roughEqual(contentOffset.top, boundaryOffset.top, 1.01, 'top border of the content is correct');
        assert.roughEqual(contentOffset.left, boundaryOffset.left, 1.01, 'left border of the content is correct');

        overlay.option('position.boundary', window);

        contentOffset = $overlayContent.offset();
        const contentCenterY = contentOffset.top + contentHeight / 2;
        const windowCenterY = window.innerHeight / 2;
        const contentCenterX = contentOffset.left + contentWidth / 2;
        const windowCenterX = window.innerWidth / 2;

        assert.roughEqual(contentCenterY, windowCenterY, 1.01, 'content is in the center of window vertically');
        assert.roughEqual(contentCenterX, windowCenterX, 1.01, 'content is in the center of window horizontally');
    });
});


testModule('shading', moduleConfig, () => {
    [true, false].forEach((value) => {
        test('render shading', function(assert) {
            const overlay = $('#overlay').dxOverlay({
                shading: value,
                visible: true
            }).dxOverlay('instance');
            const $wrapper = overlay.$wrapper();

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
        const $wrapper = overlay.$wrapper();

        $container
            .width(200)
            .height(300)
            .offset({
                left: 100,
                top: 200
            });
        overlay.repaint();
        assert.strictEqual(getWidth($wrapper), 200);
        assert.strictEqual(getHeight($wrapper), 300);
        assert.strictEqual(locate($wrapper).left, 0);
        assert.strictEqual(locate($wrapper).top, 0);
    });

    test('shading color should be customized by option', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            shading: true,
            shadingColor: 'rgb(255, 0, 0)',
            visible: true
        }).dxOverlay('instance');
        const $wrapper = overlay.$wrapper();

        assert.ok(/rgb\(255,\s?0,\s?0\)/.test($wrapper.css('backgroundColor')));

        overlay.option('shading', false);
        assert.ok(!/rgb\(255,\s?0,\s?0\)/.test($wrapper.css('backgroundColor')));
    });
});


testModule('dimensions', moduleConfig, () => {
    test('dimensions should be set correctly as number', function(assert) {
        const $content = $('#overlay').dxOverlay({
            visible: true,
            width: 20,
            height: 15
        }).dxOverlay('instance').$content();

        assert.strictEqual(getWidth($content), 20);
        assert.strictEqual(getHeight($content), 15);

        resizeCallbacks.fire();

        assert.strictEqual(getWidth($content), 20);
        assert.strictEqual(getHeight($content), 15);
    });

    test('dimensions should be set correctly as function', function(assert) {
        const $content = $('#overlay').dxOverlay({
            visible: true,
            width: () => {
                return getWidth($(window));
            },
            height: () => {
                return getHeight($(window));
            }
        }).dxOverlay('instance').$content();

        assert.strictEqual(getWidth($content), getWidth($(window)));
        assert.strictEqual(getHeight($content), getHeight($(window)));

        resizeCallbacks.fire();

        assert.strictEqual(getWidth($content), getWidth($(window)));
        assert.strictEqual(getHeight($content), getHeight($(window)));
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

        assert.strictEqual(getWidth($content), 200);
        assert.strictEqual(getHeight($content), 200);
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
        const $content = instance.$content();

        instance.option('maxWidth', 200);
        assert.strictEqual(getWidth($content), 200);

        instance.option('maxHeight', 200);
        assert.strictEqual(getHeight($content), 200);
    });

    test('dimensions should be expanded correctly with min sizes specified', function(assert) {
        const $content = $('#overlay').dxOverlay({
            visible: true,
            width: 'auto',
            height: 'auto',
            minWidth: 200,
            minHeight: 200
        }).dxOverlay('instance').$content();

        assert.strictEqual(getWidth($content), 200);
        assert.strictEqual(getHeight($content), 200);
    });

    test('dimensions should be shrunk correctly with min sizes changes dynamically', function(assert) {
        const instance = $('#overlay').dxOverlay({
            visible: true,
            width: 'auto',
            height: 'auto'
        }).dxOverlay('instance');
        const $content = instance.$content();

        instance.option('minWidth', 200);
        assert.strictEqual(getWidth($content), 200);

        instance.option('minHeight', 200);
        assert.strictEqual(getHeight($content), 200);
    });

    test('overlay wrapper dimensions should be equal to document client dimensions when container is window', function(assert) {
        const overlay = $('#overlay').dxOverlay({
            visible: true
        }).dxOverlay('instance');

        const $wrapper = overlay.$wrapper();

        const documentElement = document.documentElement;
        assert.roughEqual(getHeight($wrapper), window.innerHeight, 1.01, 'wrapper height is equal to document client height');
        assert.roughEqual(getWidth($wrapper), documentElement.clientWidth, 1.01, 'wrapper width is equal to document client width');
    });

    test('overlay wrapper should cover all window without scrollbar when container is window', function(assert) {
        $('#qunit-fixture').prepend($('<div>').css({ height: 2000 }));

        const overlay = $('#overlay').dxOverlay({
            visible: true
        }).dxOverlay('instance');

        const $wrapper = overlay.$wrapper();

        const documentElement = document.documentElement;
        assert.roughEqual(getHeight($wrapper), documentElement.clientHeight, 1.01, 'wrapper height is equal to document client height');
        assert.roughEqual(getWidth($wrapper), documentElement.clientWidth, 1.01, 'wrapper width is equal to document client width');
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
            const widgetPosition = {
                my: 'top',
                at: 'top',
                of: window,
                boundaryOffset: {
                    h: 0,
                    v: 0
                }
            };
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
            const widgetPosition = {
                my: 'top',
                at: 'top',
                of: window,
                boundaryOffset: {
                    h: 0,
                    v: 0
                }
            };
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

    test('animation should be stopped on geometry rerendering (T1104748)', function(assert) {
        fx.off = false;
        try {
            const overlay = $('#overlay').dxOverlay({
                animation: {
                    show: {
                        type: 'fade',
                        duration: 1000,
                        from: { opacity: 0 },
                        to: { opacity: 1 }
                    }
                }
            }).dxOverlay('instance');
            const $content = overlay.$content();

            overlay.show();
            overlay.option('position', { of: 'body' });

            assert.notOk(fx.isAnimating($content), 'animation is stopped after position option change');
        } finally {
            fx.off = true;
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

    test('content shouldn`t clean when component is renovated', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            isRenovated: true,
            contentTemplate: 'template',
            visible: true
        });
        const instance = $overlay.dxOverlay('instance');
        const $content = instance.$content();
        const contentRenderSpy = sinon.spy($content, 'empty');

        instance.option({ visible: false, contentTemplate: 'template1' });
        assert.equal(contentRenderSpy.callCount, 0);
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
        const $content = $overlay.dxOverlay('instance').$content();

        assert.strictEqual($.trim($content.text()), 'custom', 'content has no text');
    });

    test('contentTemplate option accepts template instance', function(assert) {
        const $template = $('<div>').text('test');

        const $overlay = $('#overlay').dxOverlay({
            contentTemplate: new Template($template),
            visible: true
        });

        const $content = $overlay.dxOverlay('instance').$content();

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
    ['closeOnOutsideClick', 'hideOnOutsideClick'].forEach(closeOnOutsideClickOptionName => {
        test('overlay should be hidden after click outside was present', function(assert) {
            const overlay = $('#overlay').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true
            }).dxOverlay('instance');
            const $content = overlay.$content();

            $($content).trigger('dxpointerdown');
            assert.strictEqual(overlay.option('visible'), true, 'overlay is not hidden');

            $(document).trigger('dxpointerdown');
            assert.strictEqual(overlay.option('visible'), false, 'overlay is hidden');
        });

        test('overlay should be hidden after click outside was present if a function is passed to the property', function(assert) {
            const overlay = $('#overlay').dxOverlay({
                [closeOnOutsideClickOptionName]: () => true,
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
                [closeOnOutsideClickOptionName]: true,
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
                [closeOnOutsideClickOptionName]: true,
                visible: true
            }).dxOverlay('instance');
            const overlay2 = $('#overlay2').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                innerOverlay: true,
                visible: true,
                propagateOutsideClick: true
            }).dxOverlay('instance');
            $(overlay2.$content()).trigger('dxpointerdown');

            assert.equal(overlay1.option('visible'), true, 'Bottom overlay should not get outside click when inner overlay clicked');
        });

        // T494814
        test('overlay should not be hidden after click in detached element', function(assert) {
            const overlay = $('#overlayWithAnonymousTmpl').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
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
                [closeOnOutsideClickOptionName]: true,
                visible: true,
                shading: true
            });

            const downEvent = $.Event('dxpointerdown', { pointerType: 'mouse' });
            $(document).trigger(downEvent);
            assert.ok(downEvent.isDefaultPrevented(), 'default prevented');

        });

        test('overlay should propagate events when shading is false (T181002)', function(assert) {
            $('#overlay').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true,
                shading: false
            });

            const downEvent = $.Event('dxpointerdown', { pointerType: 'mouse' });
            $(document).trigger(downEvent);
            assert.ok(!downEvent.isDefaultPrevented(), 'default is not prevented');
        });

        test('outside click should close several overlays if propagateOutsideClick option of top overlay is true', function(assert) {
            const overlay1 = $('#overlay').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true
            }).dxOverlay('instance');
            const overlay2 = $('#overlay2').dxOverlay({
                [closeOnOutsideClickOptionName]: false,
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
                [closeOnOutsideClickOptionName]: true,
                visible: true
            }).dxOverlay('instance');
            const overlay2 = $('#overlay2').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true,
                propagateOutsideClick: true
            }).dxOverlay('instance');

            $(overlay2.$content()).trigger('dxpointerdown');

            assert.strictEqual(overlay1.option('visible'), false, 'Bottom overlay should get outside click when other overlay clicked');
            assert.strictEqual(overlay2.option('visible'), true, 'Second overlay is visible');

            overlay1.show();
            overlay2.option(closeOnOutsideClickOptionName, function(e) {
                return !e.target.closest(toSelector(OVERLAY_CONTENT_CLASS));
            });
            $(overlay1.$content()).trigger('dxpointerdown');

            assert.strictEqual(overlay1.option('visible'), true, 'First overlay is visible');
            assert.strictEqual(overlay2.option('visible'), true, 'Closing should be prevented by a user-defined function');
        });

        test('overlays\' priority', function(assert) {
            const $overlay1 = $('#overlay').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true
            });
            const overlay1 = $overlay1.dxOverlay('instance');
            const $overlay2 = $('#overlay2').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true
            });
            const overlay2 = $overlay2.dxOverlay('instance');

            $(overlay2.$content()).trigger('dxpointerdown');

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
                [closeOnOutsideClickOptionName]: true,
                visible: true
            });
            const overlay1 = $overlay1.dxOverlay('instance');
            const $overlay2 = $('#overlay2').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
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
                [closeOnOutsideClickOptionName]: true,
                visible: true
            });
            const instance1 = $overlay1.dxOverlay('instance');
            const $overlay2 = $('#overlay2').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
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

        test(`${closeOnOutsideClickOptionName} does not close back widget while front widget is still animated`, function(assert) {
            const $overlay1 = $('#overlay').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true
            });
            const instance1 = $overlay1.dxOverlay('instance');
            const $overlay2 = $('#overlay2').dxOverlay({
                [closeOnOutsideClickOptionName]: true,
                visible: true
            });
            const instance2 = $overlay2.dxOverlay('instance');

            try {
                fx.off = false;

                $('body').trigger('dxpointerdown');
                $(instance2.$content()).trigger('dxpointerdown');
                assert.ok(!instance2.option('visible'), 'second overlay is hidden');
                assert.ok(instance1.option('visible'), 'first overlay is not hidden');
            } finally {
                fx.off = true;
            }
        });

        test('click on overlay during the start animation should end the animation (T273294)', function(assert) {
            const $overlay = $('#overlay').dxOverlay({ [closeOnOutsideClickOptionName]: true });
            const overlay = $overlay.dxOverlay('instance');

            try {
                fx.off = false;
                overlay.show();

                $(overlay.$content()).trigger('dxpointerdown');
                assert.ok(overlay.option('visible'), 'overlay is stay visible');
            } finally {
                fx.off = true;
            }
        });
    });

    test('closeOnOutsideClick option using should raise a warning about deprecation', function(assert) {
        sinon.spy(errors, 'log');

        try {
            $('#overlay').dxOverlay({ closeOnOutsideClick: true });
            assert.deepEqual(errors.log.lastCall.args, [
                'W0001',
                'dxOverlay',
                'closeOnOutsideClick',
                '22.1',
                'Use the \'hideOnOutsideClick\' option instead'
            ], 'warning is raised with correct parameters');
        } finally {
            errors.log.restore();
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
            hideOnParentScroll: true,
            container: $('#test'),
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $('#overlayInputTarget')
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = overlay.$content();

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($content.is(':visible'), false, 'overlay should be hidden after scroll event on any parent');
    });

    test('overlay should not be hidden on parents scroll if show animation is not completed', function(assert) {
        fx.off = false;

        const overlay = $('#overlay').dxOverlay({
            hideOnParentScroll: true,
            container: $('#test'),
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
            hideOnParentScroll: true,
            container: $('#test'),
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $.Event('dxpointerdown', { pointerType: 'mouse', pageX: 50, pageY: 50, target: $('#overlayInputTarget').get(0) })
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = overlay.$content();

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($content.is(':visible'), false, 'Overlay should be hidden after scroll event on any parent');
    });

    test('overlay should not be hidden on any target\'s parents scroll events if option set to false', function(assert) {
        const $overlay = $('#overlay').dxOverlay({
            hideOnParentScroll: false,
            container: $('#test'),
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $('#overlayInputTarget')
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = overlay.$content();

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
                hideOnParentScroll: true
            });

            const overlay = $overlay.dxOverlay('instance');
            const $content = overlay.$content();

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
                hideOnParentScroll: true
            });

            const overlay = $overlay.dxOverlay('instance');
            const $content = overlay.$content();

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
            hideOnParentScroll: true,
            container: $('#test'),
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
        const $container = $('#test');

        const $overlay = $('#overlay').dxOverlay({
            hideOnParentScroll: true,
            container: $container,
            position: {
                my: 'left top',
                at: 'left bottom',
                of: $target
            },
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');

        const containerParent = $container.parent().get(0);
        $target.detach();
        overlay.hide();
        const parentEvents = $._data(containerParent).events || {};
        assert.strictEqual('scroll' in parentEvents, false, 'scroll unsubscribed');
    });

    test('all opened overlays should be closed on scroll', function(assert) {
        const container = $('#overlayInputTarget');

        const $overlay1 = $('#overlay').dxOverlay({
            hideOnParentScroll: true,
            visible: true,
            container
        });

        const $overlay2 = $('#overlay2').dxOverlay({
            hideOnParentScroll: true,
            visible: true,
            container
        });

        $('#parentContainer').triggerHandler('scroll');
        assert.strictEqual($overlay1.dxOverlay('option', 'visible'), false, 'overlay1 closed');
        assert.strictEqual($overlay2.dxOverlay('option', 'visible'), false, 'overlay2 closed');
    });

    test('target scroll subscriptions should be unsubscribed for current overlay', function(assert) {
        const $target = $('#overlayInputTarget');

        const $overlay1 = $('#overlay').dxOverlay({
            hideOnParentScroll: function() {
                return $overlay2.dxOverlay('option', 'visible');
            },
            container: $('#test'),
            position: {
                of: $target
            },
            visible: true
        });

        const $overlay2 = $('#overlay2').dxOverlay({
            hideOnParentScroll: true,
            container: $('#overlay'),
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

    testModule('_hideOnParentScrollTarget', moduleConfig, () => {
        test('overlay should be hidden on parent scroll, set _hideOnParentScrollTarget on init', function(assert) {
            const overlay = $('#overlay').dxOverlay({
                hideOnParentScroll: true,
                _hideOnParentScrollTarget: $('#overlay2'),
                visible: true
            }).dxOverlay('instance');

            $('#parentContainer').triggerHandler('scroll');
            assert.strictEqual(overlay.option('visible'), false, 'overlay is hidden');
        });

        test('overlay should be hidden on parent scroll, set _hideOnParentScrollTarget on runtime', function(assert) {
            const overlay = $('#overlay').dxOverlay({
                hideOnParentScroll: true,
                visible: true
            }).dxOverlay('instance');

            $('#parentContainer').triggerHandler('scroll');

            assert.strictEqual(overlay.option('visible'), true, 'overlay is visible');

            overlay.option('_hideOnParentScrollTarget', $('#overlay2'));
            $('#parentContainer').triggerHandler('scroll');

            assert.strictEqual(overlay.option('visible'), false, 'overlay is hidden');
        });
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

        const wrapperElement = overlay.$wrapper().get(0);

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

        const $wrapper = overlay.$wrapper();
        overlay.option('container', null);
        assert.strictEqual(getWidth($wrapper), getWidth($(window)), 'width is restored after container option value changed to window');
        assert.strictEqual(getHeight($wrapper), getHeight($(window)), 'height is restored after container option value changed to window');
    });

    QUnit.module('content markup move', {
        beforeEach: function() {
            this.$container = $('#customTargetContainer');
            this.isContentInContainer = () => {
                return this.$container.children(toSelector(OVERLAY_WRAPPER_CLASS)).length === 1;
            };
        }
    }, () => {
        test('content should be moved to container', function(assert) {
            const overlay = $('#overlay').dxOverlay({
                container: this.$container
            }).dxOverlay('instance');

            overlay.show();

            assert.ok(this.isContentInContainer(), 'content is in container');
        });

        test('content should be moved to container before content ready action', function(assert) {
            assert.expect(1);

            const overlay = $('#overlay').dxOverlay({
                container: this.$container,
                onContentReady: () => {
                    assert.ok(this.isContentInContainer(), 'content is in container');
                }
            }).dxOverlay('instance');

            overlay.show();
        });

        test('content should not be moved to container before content ready action if it is not visible', function(assert) {
            assert.expect(1);

            $('#overlay').dxOverlay({
                container: this.$container,
                onContentReady: () => {
                    assert.notOk(this.isContentInContainer(), 'content is not in container');
                },
                deferRendering: false
            });
        });
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
        assert.strictEqual(getWidth($shader), getWidth($container), 'shader width is correct');
        assert.strictEqual(getHeight($shader), getHeight($container), 'shader height is correct');
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

            assert.roughEqual(wrapperRect.left, targetRect.left, 0.51, 'left coordinates are equal');
            assert.roughEqual(wrapperRect.top, targetRect.top, 0.51, 'top coordinates are equal');
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
        assert.strictEqual(getHeight($content), getHeight($container) * 0.5, 'overlay height is correct');
        assert.strictEqual(getWidth($content), getWidth($container) * 0.5, 'overlay width is correct');
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

    test('widget should not react on viewport change with correct container', function(assert) {
        const origViewport = viewPort();

        try {
            $('#overlay').dxOverlay({
                container: $('#container'),
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
                container: $('#customTargetContainer')
            }
        });

        const overlay = new TestOverlay($('#overlay'));
        overlay.show();
        assert.strictEqual($('#customTargetContainer').children(toSelector(OVERLAY_WRAPPER_CLASS)).length, 1);
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

    [false, true].forEach(visible => {
        test(`toggle(${visible}) should be rejected if showing/hiding is canceled`, function(assert) {
            const done = assert.async();
            assert.expect(1);

            const overlay = $('#overlay').dxOverlay({ visible: !visible }).dxOverlay('instance');
            overlay.option({
                onShowing: e => e.cancel = true,
                onHiding: e => e.cancel = true
            });

            overlay.toggle(visible).fail(() => {
                assert.ok(true);

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
        const $content = overlay.$content();

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

        assert.ok(getOuterWidth($element) > 0, 'outer width of the element must be more than zero');
    });

    test('constructor', function(assert) {
        const $element = $('#widget').dxOverlay({ width: 400 });
        const instance = $element.dxOverlay('instance');

        instance.show();

        assert.strictEqual(instance.option('width'), 400);
        assert.strictEqual(getOuterWidth(instance.$content()), 400, 'outer width of the element must be equal to custom width');
    });

    test('change width', function(assert) {
        const $element = $('#widget').dxOverlay();
        const instance = $element.dxOverlay('instance');
        const customWidth = 400;

        instance.option('width', customWidth);

        instance.show();

        assert.strictEqual(getOuterWidth(instance.$content()), customWidth, 'outer width of the element must be equal to custom width');
    });
});

testModule('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;

        viewPort($('#qunit-fixture').addClass(VIEWPORT_CLASS));

        this.$overlay = $('#overlay').dxOverlay({
            focusStateEnabled: true,
            visible: true,
            width: 1,
            height: 1,
            position: { of: viewPort() }
        });

        this.overlay = this.$overlay.dxOverlay('instance');
        this.$overlayContent = this.overlay.$content();
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

    test('overlay have focus on show click', function(assert) {

        const $overlayContent = this.$overlayContent;

        this.overlay.option('animation', {
            show: {
                start: function() {
                    assert.ok(!$overlayContent.is(getActiveElement()), 'focus is on overlay');
                },
                complete: function() {
                    assert.ok($overlayContent.is(getActiveElement()), 'focus isn\'t on overlay');
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
        const $content = $(overlay.$content());

        const $firstTabbable = $content.find('.firstTabbable');
        const $lastTabbable = $content.find('.lastTabbable').focus();
        const $outsideTabbable = $content.find('.outsideTabbable');

        $(document).trigger(this.tabEvent);
        assert.strictEqual(getActiveElement(), $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');

        $(document).trigger(this.shiftTabEvent);
        assert.strictEqual(getActiveElement(), $lastTabbable.get(0), 'last item focused on press tab+shift on first item (does not go under overlay)');

        $outsideTabbable.focus();
        $(document).trigger(this.tabEvent);
        assert.strictEqual(getActiveElement(), $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');
    });

    test('focus in Overlay should be looped if _loopFocus: true and shading: false', function(assert) {
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: false,
            _loopFocus: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = overlay.$content();

        const firstFocusableElement = $content.find('.firstTabbable').get(0);
        const lastFocusableElement = $content.find('.lastTabbable').get(0);

        $(lastFocusableElement).focus();
        $(lastFocusableElement).trigger(this.tabEvent);

        assert.strictEqual(getActiveElement(), firstFocusableElement, 'first item is focused');

        $(firstFocusableElement).trigger(this.shiftTabEvent);

        assert.strictEqual(getActiveElement(), lastFocusableElement, 'last item is focused');
    });

    test('focus in Overlay should be looped if shading: false, _loopFocus gets true in runtime', function(assert) {
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: false,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = overlay.$content();

        const firstFocusableElement = $content.find('.firstTabbable').get(0);
        const lastFocusableElement = $content.find('.lastTabbable').get(0);

        $(lastFocusableElement).focus();
        $(lastFocusableElement).trigger(this.tabEvent);

        assert.strictEqual(getActiveElement() !== firstFocusableElement, true, 'first item is not focused');

        $(firstFocusableElement).focus();
        $(firstFocusableElement).trigger(this.shiftTabEvent);

        assert.strictEqual(getActiveElement() !== lastFocusableElement, true, 'last item is not focused');

        overlay.option('_loopFocus', true);

        $(lastFocusableElement).focus();
        $(lastFocusableElement).trigger(this.tabEvent);

        assert.strictEqual(getActiveElement(), firstFocusableElement, 'first item is focused');

        $(firstFocusableElement).trigger(this.shiftTabEvent);

        assert.strictEqual(getActiveElement(), lastFocusableElement, 'last item is focused');
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
        const $content = $(overlay1.$content());

        overlay1.show();
        overlay2.show();

        const $firstTabbable = $content.find('.firstTabbable');

        $content.find('.lastTabbable').focus();
        $(document).trigger(this.tabEvent);
        assert.strictEqual(getActiveElement(), $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');
    });

    test('elements under overlay with shader have not to get focus by tab after another overlay is hide', function(assert) {
        const overlay = new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true,
            contentTemplate: $('#focusableTemplate')
        });
        const $content = $(overlay.$content());

        new Overlay($('<div>').appendTo('#qunit-fixture'), {
            visible: true,
            shading: true
        }).hide();

        const $firstTabbable = $content.find('.firstTabbable');

        $(document).trigger(this.tabEvent);
        assert.strictEqual(getActiveElement(), $firstTabbable.get(0), 'first item focused on press tab on last item (does not go under overlay)');
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
        const $content = $(overlay.$content());

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
        const $content = $(overlay.$content());

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
        const $content = overlay.$content();
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
});

testModule('preventScrollEvents', () => {
    test('wrapper scroll subscription after change preventScrollEvents option', function(assert) {
        if(QUnit.urlParams['nojquery']) {
            assert.ok(true);
            return;
        }

        const overlay = $('#overlay').dxOverlay({
            visible: true,
        }).dxOverlay('instance');

        const $wrapper = $(overlay.content()).parent();


        const getWrapperEventListeners = () => $._data($wrapper.get(0)).events || {};

        assert.strictEqual('dxdrag' in getWrapperEventListeners(), true, 'scroll subscribed');

        overlay.option('preventScrollEvents', false);

        assert.strictEqual('dxdrag' in getWrapperEventListeners(), false, 'scroll unsubscribed');

        overlay.option('preventScrollEvents', true);

        assert.strictEqual('dxdrag' in getWrapperEventListeners(), true, 'scroll subscribed');
    });

    [true, false].forEach((shading) => {
        test(`dxmousewheel event should not be prevented on overlay shader if shading is ${shading}`, function(assert) {
            assert.expect(1);

            const overlay = $('#overlay').dxOverlay({
                shading,
                visible: true,
                preventScrollEvents: false,
            }).dxOverlay('instance');

            const $wrapper = $(overlay.content()).parent();

            $($wrapper.parent()).on('dxmousewheel', (e) => {
                assert.strictEqual(e.isDefaultPrevented(), false, 'event is not prevented');
            });

            pointerMock($wrapper).start().wheel(10);

            $($wrapper.parent()).off('dxmousewheel');
        });

        test(`dxmousewheel event should not be prevented on overlay content if shading is ${shading}`, function(assert) {
            assert.expect(1);

            const overlay = $('#overlay').dxOverlay({
                shading,
                visible: true,
                preventScrollEvents: false,
            }).dxOverlay('instance');

            const $content = $(overlay.content());
            const $wrapper = $(overlay.content()).parent();

            $($wrapper).on('dxmousewheel', (e) => {
                assert.strictEqual(e.isDefaultPrevented(), false, 'event is not prevented');
            });

            pointerMock($content).start().wheel(10);

            $($wrapper).off('dxmousewheel');
        });
    });

    [true, false].forEach((preventScrollEvents) => {
        QUnit.test('should be logged if preventScrollEvents is used on initialization', function(assert) {
            assert.expect(2);

            const stub = sinon.stub(errors, 'log').callsFake(() => {
                assert.deepEqual(errors.log.lastCall.args, [
                    'W0001',
                    'dxOverlay',
                    'preventScrollEvents',
                    '23.1',
                    'If you enable this option, end-users may experience scrolling issues.'
                ], 'args of the log method');
            });

            $('#overlay').dxOverlay({
                visible: true,
                preventScrollEvents,
            });

            assert.strictEqual(stub.callCount, 1, 'error.log.callCount');
            stub.restore();
        });

        QUnit.test('should not be logged if preventScrollEvents is not used on initialization', function(assert) {
            assert.expect(1);

            const stub = sinon.stub(errors, 'log').callsFake(() => {
                assert.deepEqual(errors.log.lastCall.args, [
                    'W0001',
                    'dxOverlay',
                    'preventScrollEvents',
                    '23.1',
                    'If you enable this option, end-users may experience scrolling issues.'
                ], 'args of the log method');
            });

            $('#overlay').dxOverlay({
                visible: true,
            });

            assert.strictEqual(stub.callCount, 0, 'error.log.callCount');
            stub.restore();
        });

        QUnit.test('should be logged if preventScrollEvents is changed in runtime', function(assert) {
            assert.expect(2);

            const overlay = $('#overlay').dxOverlay({
                visible: true,
                preventScrollEvents,
            }).dxOverlay('instance');

            const stub = sinon.stub(errors, 'log').callsFake(() => {
                assert.deepEqual(errors.log.lastCall.args, [
                    'W0001',
                    'dxOverlay',
                    'preventScrollEvents',
                    '23.1',
                    'If you enable this option, end-users may experience scrolling issues.'
                ], 'args of the log method');
            });

            overlay.option('preventScrollEvents', !preventScrollEvents);

            assert.strictEqual(stub.callCount, 1, 'error.log.callCount');
            stub.restore();
        });

        [true, false].forEach(function(_ignorePreventScrollEventsDeprecation) {
            test(`"preventScrollEvents" deprecation warning should not be logged if "_ignorePreventScrollEventsDeprecation" option value is ${_ignorePreventScrollEventsDeprecation}`, function(assert) {
                assert.expect(_ignorePreventScrollEventsDeprecation ? 0 : 1);

                const stub = sinon.stub(errors, 'log').callsFake(() => {
                    assert.deepEqual(errors.log.lastCall.args, [
                        'W0001',
                        'dxOverlay',
                        'preventScrollEvents',
                        '23.1',
                        'If you enable this option, end-users may experience scrolling issues.'
                    ], 'args of the log method');
                });

                $('#overlay').dxOverlay({
                    preventScrollEvents,
                    _ignorePreventScrollEventsDeprecation,
                });
                stub.restore();
            });
        });
    });
});

testModule('scrollable interaction', {
    beforeEach: function() {
        this._originalViewport = viewPort();
        viewPort($('#customTargetContainer'));
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

    ['ctrlKey', 'metaKey'].forEach((commandKey) => {
        test(`scroll event should not prevent zooming (${commandKey} pressed)`, function(assert) {
            assert.expect(1);

            const $overlay = $('#overlay').dxOverlay({
                shading: true,
                visible: true
            });
            const handler = () => {
                assert.ok(true, 'event popped up');
            };

            $('#qunit-fixture').on('wheel', handler);

            const $content = $overlay.dxOverlay('$content');
            const $shader = $content.closest(toSelector(OVERLAY_SHADER_CLASS));

            nativePointerMock($shader)
                .start()
                .wheel(10, { [commandKey]: true });

            $('#qunit-fixture').off('wheel', handler);
        });
    });
});


testModule('specifying base z-index', moduleConfig, () => {
    test('overlay should render with correct z-index by default', function(assert) {
        const $overlay = $('#overlay').dxOverlay({ visible: true });
        const overlay = $overlay.dxOverlay('instance');
        const $content = overlay.$content();
        const $wrapper = overlay.$wrapper();

        assert.strictEqual($content.css('zIndex'), '1501', 'z-index for content is correct');
        assert.strictEqual($wrapper.css('zIndex'), '1501', 'z-index for wrapper is correct');
    });

    test('base z-index should be changed using the static method', function(assert) {
        Overlay.baseZIndex(10000);

        const $overlay = $('#overlay').dxOverlay({
            visible: true
        });
        const overlay = $overlay.dxOverlay('instance');
        const $content = overlay.$content();
        const $wrapper = overlay.$wrapper();

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
        new Overlay($('#overlay'), { visible: true });
        assert.strictEqual(zIndex.create(), 1502, 'new zindex is larger than overlay\'s');
    });

    test('overlay should remove its zindex from the stack on dispose if overlay is visible', function(assert) {
        const instance = new Overlay($('#overlay'), { visible: true });
        instance.dispose();
        assert.strictEqual(zIndex.create(), 1501, 'zindex has been removed');
    });

    test('overlay should not try to remove its zindex from the stack on dispose if overlay is not visible (T1070941)', function(assert) {
        const instance = new Overlay($('#overlay'));

        instance.show();
        instance.hide();

        const rememberedZIndex = 1501;
        zIndex.create();

        instance.dispose();

        assert.strictEqual(zIndex.create(), rememberedZIndex + 1, 'remembered zIndex was not removed on dispose');
    });

    test('overlay should create new zindex only at first showing', function(assert) {
        const overlay = new Overlay($('#overlay'), { visible: true });

        overlay.option('visible', false);
        overlay.option('visible', true);
        overlay.option('visible', false);
        overlay.option('visible', true);

        assert.strictEqual(zIndex.create(), 1502, 'new zindex is larger than overlay\'s');
    });

    test('overlay should get next z-index if the first one has been created before', function(assert) {
        zIndex.create();

        const overlay = new Overlay($('#overlay'), { visible: true });
        const content = overlay.$content();

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
        this.timeToWaitResize = 50;
        this.overlayInstance = $('#overlay').dxOverlay({
            deferRendering: false,
        }).dxOverlay('instance');
        this.renderGeometrySpy = sinon.spy(this.overlayInstance, '_renderGeometry');
        this.checkNoExcessResizeHandle = (assert) => {
            const done = assert.async();
            const renderGeometryInitialCallCount = this.renderGeometrySpy.callCount;
            setTimeout(() => {
                assert.strictEqual(
                    this.renderGeometrySpy.callCount,
                    renderGeometryInitialCallCount,
                    'no resize observer callback was raised'
                );
                done();
            }, this.timeToWaitResize);
        };
    },
    afterEach: function() {
        zIndex.clearStack();
        Overlay.baseZIndex(1500);
        fx.off = false;
    }
}, () => {
    QUnit.testInActiveWindow('visibility change', function(assert) {
        assert.ok(this.renderGeometrySpy.notCalled, 'render geometry isn\'t called yet');

        const showingResizeHandled = assert.async();
        this.overlayInstance.show();

        setTimeout(() => {
            assert.ok(this.renderGeometrySpy.calledOnce, 'render geometry called once');
            this.checkNoExcessResizeHandle(assert);
            showingResizeHandled();
        }, this.timeToWaitResize);
    });

    QUnit.testInActiveWindow('window resize', function(assert) {
        const showingResizeHandled = assert.async();
        this.overlayInstance.show();

        setTimeout(() => {
            resizeCallbacks.fire();
            assert.strictEqual(this.renderGeometrySpy.callCount, 2);
            showingResizeHandled();
        }, this.timeToWaitResize);
    });

    QUnit.testInActiveWindow('repaint', function(assert) {
        const showingResizeHandled = assert.async();
        this.overlayInstance.show();

        setTimeout(() => {
            this.overlayInstance.repaint();
            assert.strictEqual(this.renderGeometrySpy.callCount, 2);
            showingResizeHandled();
        }, this.timeToWaitResize);
    });

    QUnit.module('option change', {
        // NOTE: option change can invoke '_renderGeometry' or 'invalidate'
        // and also resize callback can be called after that.
        // Not all appropriate options change is tested.

        beforeEach: function() {
            this.overlayInstance.show();
        }
    }, () => {
        const newOptions = {
            width: 500,
            height: 500,
            minWidth: 2000,
            maxWidth: 10,
            minHeight: 2000,
            maxHeight: 10,
            position: { of: 'body' }
        };
        for(const optionName in newOptions) {
            QUnit.testInActiveWindow(optionName, function(assert) {
                // eslint-disable-next-line qunit/no-async-in-loops
                const showingResizeHandled = assert.async();
                setTimeout(() => {
                    this.overlayInstance.option(optionName, newOptions[optionName]);

                    assert.strictEqual(this.renderGeometrySpy.callCount, 2, 'renderGeomentry called 2 times');
                    this.checkNoExcessResizeHandle(assert);
                    showingResizeHandled();
                }, this.timeToWaitResize);
            });
        }
    });
});

QUnit.module('prevent safari scrolling on ios devices', {
    beforeEach: function() {
        fx.off = true;
        this.originalDevice = {
            platform: devices.real().platform,
            deviceType: devices.real().deviceType
        };
        this.instance = $('#overlay').dxOverlay().dxOverlay('instance');
        devices.real({ platform: 'ios', deviceType: 'phone' });
        this.$body = $('body');
        this.$additionalElement = $('<div>').height(2000).appendTo(this.$body);
    },
    afterEach: function() {
        this.instance.dispose();
        devices.real(this.originalDevice);
        window.scrollTo(0, 0);
        this.$additionalElement.remove();
        fx.off = false;
    }
}, () => {
    QUnit.test('body should have PREVENT_SAFARI_SCROLLING_CLASS if container is window and shading is enabled on overlay init', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        this.instance.dispose();
        $('#overlay').dxOverlay({ visible: true });

        assert.ok(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS));
    });

    QUnit.test('window should not be scrolled when PREVENT_SAFARI_SCROLLING_CLASS is added to the body on popup init', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }
        window.scrollTo(0, 200);
        this.instance.dispose();
        $('#overlay').dxOverlay({ visible: true });

        assert.strictEqual(window.pageYOffset, 0, 'window is not scrolled');
    });

    QUnit.test('window should not be scrolled when PREVENT_SAFARI_SCROLLING_CLASS is added to the body', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        window.scrollTo(0, 200);
        this.instance.show();

        assert.strictEqual(window.pageYOffset, 0, 'window is not scrolled');
    });

    QUnit.test('window should be scrolled to initial position when PREVENT_SAFARI_SCROLLING_CLASS is removed from the body', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        const pageYOffset = 200;
        window.scrollTo(0, pageYOffset);
        this.instance.show();
        this.instance.hide();

        assert.strictEqual(window.pageYOffset, pageYOffset, 'window is scrolled to initial position');
    });

    QUnit.test('body should have PREVENT_SAFARI_SCROLLING_CLASS only when overlay is visible', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        assert.notOk(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'no class because overlay is not visible');

        this.instance.show();
        assert.ok(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is added after overlay show');

        this.instance.hide();
        assert.notOk(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is removed after overlay hide');
    });

    QUnit.test('body should have PREVENT_SAFARI_SCROLLING_CLASS if container is window and shading is enabled', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        this.instance.show();

        assert.ok(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS));
    });

    [true, false].forEach(visible => {
        QUnit.test(`PREVENT_SAFARI_SCROLLING_CLASS should be removed on dispose if visible=${visible}`, function(assert) {
            if(!IS_SAFARI) {
                assert.expect(0);
                return;
            }

            this.instance.show();

            this.instance.dispose();
            assert.notOk(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class was removed on dispose');
        });
    });

    QUnit.test('PREVENT_SAFARI_SCROLLING_CLASS should be toggled on "shading" option change', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        this.instance.show();
        this.instance.option('shading', false);

        assert.notOk(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is removed when "shading" is disabled');

        this.instance.option('shading', true);
        assert.ok(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is added when "shading" is enabled');
    });

    QUnit.test('PREVENT_SAFARI_SCROLLING_CLASS should be toggled on "visualContainer" option change', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        this.instance.show();
        this.instance.option('visualContainer', 'body');

        assert.notOk(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is removed when "container" is not window');

        this.instance.option('visualContainer', window);
        assert.ok(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is added when "container" is window');
    });

    QUnit.test('PREVENT_SAFARI_SCROLLING_CLASS should be toggled on "container" option change', function(assert) {
        if(!IS_SAFARI) {
            assert.expect(0);
            return;
        }

        this.instance.show();
        this.instance.option('container', 'body');

        assert.notOk(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is removed when "container" is not window');

        this.instance.option('container', undefined);
        assert.ok(this.$body.hasClass(PREVENT_SAFARI_SCROLLING_CLASS), 'class is added when "container" is window');
    });
});

// visualContainer -> container -> position.of -> window
QUnit.module('wrapper covered element choice', {
}, () => {
    QUnit.test('wrapper covers container element if visualPosition is not specified', function(assert) {
        const $container = $('#container');
        const overlay = $('#overlay').dxOverlay({
            container: $container,
            visible: true
        }).dxOverlay('instance');

        const $wrapper = overlay.$wrapper();

        assert.strictEqual(getWidth($wrapper), getWidth($container), 'wrapper has container width');
        assert.strictEqual(getHeight($wrapper), getHeight($container), 'wrapper has container height');

        const wrapperLocation = $wrapper.position();
        const containerLocation = $container.position();
        assert.roughEqual(wrapperLocation.left, containerLocation.left, 0.51, 'wrapper is left positioned by container');
        assert.roughEqual(wrapperLocation.top, containerLocation.top, 0.51, 'wrapper is top positioned by container');
    });

    QUnit.test('wrapper covers visualContainer element if it is specified', function(assert) {
        const $container = $('#container');
        const overlay = $('#overlay').dxOverlay({
            visualContainer: $container,
            container: viewport(),
            visible: true
        }).dxOverlay('instance');

        const $wrapper = overlay.$wrapper();

        assert.strictEqual(getWidth($wrapper), getWidth($container), 'wrapper has visual container width');
        assert.strictEqual(getHeight($wrapper), getHeight($container), 'wrapper has visual container height');

        const wrapperLocation = $wrapper.position();
        const containerLocation = $container.position();
        assert.roughEqual(wrapperLocation.left, containerLocation.left, 0.51, 'wrapper is left positioned by visual container');
        assert.roughEqual(wrapperLocation.top, containerLocation.top, 0.51, 'wrapper is top positioned by visual container');
    });

    QUnit.test('wrapper position and dimensions should be updated after visualContainer change', function(assert) {
        const $container = $('#container');
        const overlay = $('#overlay').dxOverlay({
            container: viewport(),
            visible: true
        }).dxOverlay('instance');

        overlay.option('visualContainer', $('#container'));

        const $wrapper = overlay.$wrapper();

        assert.strictEqual(getWidth($wrapper), getWidth($container), 'wrapper has visual container width');
        assert.strictEqual(getHeight($wrapper), getHeight($container), 'wrapper has visual container height');

        const wrapperLocation = $wrapper.position();
        const containerLocation = $container.position();
        assert.roughEqual(wrapperLocation.left, containerLocation.left, 0.51, 'wrapper is left positioned by visual container');
        assert.roughEqual(wrapperLocation.top, containerLocation.top, 0.51, 'wrapper is top positioned by visual container');
    });

    QUnit.test('wrapper covers element specified in position.of if container and visualContainer are not specified', function(assert) {
        const $positionOf = $('#container');
        const overlay = $('#overlay').dxOverlay({
            position: { of: $positionOf },
            visible: true
        }).dxOverlay('instance');

        const $wrapper = overlay.$wrapper();

        assert.strictEqual(getWidth($wrapper), getWidth($positionOf), 'wrapper has width equal to position.of width');
        assert.strictEqual(getHeight($wrapper), getHeight($positionOf), 'wrapper has height equal to position.of height');

        const wrapperLocation = $wrapper.position();
        const containerLocation = $positionOf.position();
        assert.roughEqual(wrapperLocation.left, containerLocation.left, 0.51, 'wrapper is left positioned by position.of');
        assert.roughEqual(wrapperLocation.top, containerLocation.top, 0.51, 'wrapper is top positioned by position.of');
    });
});
