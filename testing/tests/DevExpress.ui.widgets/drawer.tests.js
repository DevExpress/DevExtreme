import $ from 'jquery';
import fx from 'animation/fx';
import translator from 'animation/translator';
import resizeCallbacks from 'core/utils/resize_callbacks';
import config from 'core/config';
import typeUtils from 'core/utils/type';
import { animation } from 'ui/drawer/ui.drawer.rendering.strategy';
import Overlay from 'ui/overlay';
import Button from 'ui/button';
import domUtils from 'core/utils/dom';

import 'common.css!';
import 'ui/drawer';

const DRAWER_PANEL_CONTENT_CLASS = 'dx-drawer-panel-content';
const DRAWER_CONTENT_CLASS = 'dx-drawer-content';
const DRAWER_SHADER_CLASS = 'dx-drawer-shader';

const position = $element => $element.position().left;

const mockFxAnimate = (animations, type, output) => {
    animations[type] = (config) => {
        const position = config.position || 0;
        const $element = config.$element;

        output.push({
            $element,
            type,
            start: translator.locate($element).left,
            duration: config.duration,
            end: position
        });

        translator.move($element, { left: position });

        if(config.endAction) {
            config.endAction();
        }
    };
};

const animationCapturing = {
    start() {
        this._capturedAnimations = [];
        this._animation = $.extend({}, animation);

        mockFxAnimate(animation, 'moveTo', this._capturedAnimations);

        return this._capturedAnimations;
    },
    teardown() {
        $.extend(animation, this._animation);

        delete this._capturedAnimations;
        delete this._animations;
    }
};


QUnit.testStart(() => {
    const markup = '\
    <style>\
         body {\
                margin: 0px;\
        }\
    </style>\
    \
    <div id="drawer">\
        <div id="content">Test Content</div>\
    </div>\
    <div id="drawerWithContent">\
        <div id="content"><div id="button"></div></div>\
    </div>\
    <div id="outerDrawer">\
        <div id="innerDrawer"></div>\
    </div>\
    <div id="drawerContainer" style="width: 100px">\
        <div id="drawer2"></div>\
    </div>\
        <div id="contentTemplate">\
        <div data-options="dxTemplate: { name: \'customMenu\' }">\
            Test Menu Template\
        </div>\
            <div data-options="dxTemplate: { name: \'customContent\' }">\
            Test Content Template\
        </div>\
    </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('Drawer behavior', () => {
    QUnit.test('defaults', function(assert) {
        const $element = $('#drawer').dxDrawer({});
        const instance = $element.dxDrawer('instance');

        assert.equal(instance.option('revealMode'), 'slide', 'revealMode is OK');
        assert.equal(instance.option('openedStateMode'), 'shrink', 'mode is OK');
        assert.equal(instance.option('position'), 'left', 'position is OK');
        assert.equal(instance.option('shading'), false, 'shading is OK');
        assert.strictEqual(instance.option('minSize'), null, 'minSize is OK');
        assert.strictEqual(instance.option('maxSize'), null, 'maxSize is OK');
        assert.equal(instance.option('animationEnabled'), true, 'animationEnabled is OK');
        assert.equal(instance.option('animationDuration'), 400, 'animationDuration is OK');
    });

    QUnit.test('drawer should preserve content', function(assert) {
        const $content = $('#drawer #content');
        const $element = $('#drawer').dxDrawer();

        assert.equal($content[0], $element.find('#content')[0]);
    });

    QUnit.test('drawer shouldn\'t lose its content after repaint (T731771)', function(assert) {
        let $button = $('#button').dxButton();

        const $element = $('#drawerWithContent').dxDrawer();
        const instance = $element.dxDrawer('instance');

        instance.repaint();

        $button = $element.find('.dx-button');

        const buttonInstance = $button.dxButton('instance');

        assert.ok(buttonInstance instanceof Button, 'button into drawer content wasn\'t clean after repaint');
    });

    QUnit.test('drawer tabIndex should be removed after _clean', function(assert) {
        const $element = $('#drawer').dxDrawer();
        const instance = $element.dxDrawer('instance');

        instance._clean();

        assert.equal($element.attr('tabIndex'), undefined, 'tabIndex was removed');
    });

    QUnit.test('subscribe on toggle function should fired at the end of animation', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: false
        });

        const instance = $element.dxDrawer('instance');
        let count = 0;
        const done = assert.async();

        instance.toggle().then(() => {
            count++;
            assert.equal(count, 1, 'callback not fired at animation start');
            done();
        });

        assert.equal(count, 0, 'callback not fired at animation start');
    });

    QUnit.test('dxresize event should be fired for content at the end of animation', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: false
        });

        const instance = $element.dxDrawer('instance');
        const triggerFunction = domUtils.triggerResizeEvent;
        assert.expect(2);

        try {
            fx.off = true;
            domUtils.triggerResizeEvent = ($element) => {
                assert.ok(true, 'event was triggered');
                assert.equal($element, instance.viewContent(), 'Event was triggered for right element');
            };

            instance.toggle();

        } finally {
            fx.off = false;
            domUtils.triggerResizeEvent = triggerFunction;
        }
    });

    QUnit.test('dxresize event should be fired if there is no any animation', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: false,
            position: 'right'
        });

        const instance = $element.dxDrawer('instance');
        const triggerFunction = domUtils.triggerResizeEvent;
        assert.expect(2);

        try {
            domUtils.triggerResizeEvent = function($element) {
                assert.ok(true, 'event was triggered');
                assert.equal($element, instance.viewContent(), 'Event was triggered for right element');
            };

            instance.option('position', 'left');

        } finally {
            domUtils.triggerResizeEvent = triggerFunction;
        }
    });

    QUnit.test('incomplete animation should be stopped after toggling visibility', function(assert) {
        const origFxStop = fx.stop;
        let panelStopCalls = 0;
        let contentStopCalls = 0;
        let overlayContentStopCalls = 0;
        let shaderStopCalls = 0;
        let isJumpedToEnd = false;

        const $element = $('#drawer').dxDrawer({
            opened: false,
            openedStateMode: 'overlap',
            revealMode: 'expand',
            shading: true
        });

        const instance = $element.dxDrawer('instance');
        fx.stop = function($element, jumpToEnd) {
            if(jumpToEnd) {
                isJumpedToEnd = true;
            }
            if($element.hasClass(DRAWER_PANEL_CONTENT_CLASS)) {
                panelStopCalls++;
            }
            if($element.hasClass(DRAWER_CONTENT_CLASS)) {
                contentStopCalls++;
            }
            if($element.hasClass('dx-overlay-content')) {
                overlayContentStopCalls++;
            }
            if($element.hasClass(DRAWER_SHADER_CLASS)) {
                shaderStopCalls++;
            }
        };

        try {
            fx.off = false;

            instance.toggle();
            instance.toggle();

            assert.equal(panelStopCalls, 2, 'animation should stops before toggling visibility');
            assert.equal(contentStopCalls, 2, 'animation should stops before toggling visibility');
            assert.equal(overlayContentStopCalls, 2, 'animation should stops before toggling visibility');
            assert.equal(shaderStopCalls, 2, 'animation should stops before toggling visibility');
            assert.notOk(isJumpedToEnd, 'elements aren\'t returned to the end position after animation stopping');
        } finally {
            fx.off = true;
            fx.stop = origFxStop;
        }
    });

    QUnit.test('incomplete animation should be stopped after closing on outside click', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            openedStateMode: 'overlap',
            closeOnOutsideClick: true,
            revealMode: 'expand',
            shading: true
        });

        const origFxStop = fx.stop;
        let panelStopCalls = 0;
        let contentStopCalls = 0;
        let overlayContentStopCalls = 0;
        let shaderStopCalls = 0;
        let isJumpedToEnd = false;

        const instance = $element.dxDrawer('instance');
        fx.stop = function($element, jumpToEnd) {
            if(jumpToEnd) {
                isJumpedToEnd = true;
            }
            if($element.hasClass(DRAWER_PANEL_CONTENT_CLASS)) {
                panelStopCalls++;
            }
            if($element.hasClass(DRAWER_CONTENT_CLASS)) {
                contentStopCalls++;
            }
            if($element.hasClass('dx-overlay-content')) {
                overlayContentStopCalls++;
            }
            if($element.hasClass(DRAWER_SHADER_CLASS)) {
                shaderStopCalls++;
            }
        };

        try {
            fx.off = false;

            $(instance.viewContent()).trigger('dxclick');

            assert.equal(panelStopCalls, 2, 'animation should stops before closing');
            assert.equal(contentStopCalls, 2, 'animation should stops before closing');
            assert.equal(overlayContentStopCalls, 2, 'animation should stops before closing');
            assert.equal(shaderStopCalls, 2, 'animation should stops before closing');
            assert.notOk(isJumpedToEnd, 'elements aren\'t returned to the end position after animation stopping');
        } finally {
            fx.off = true;
            fx.stop = origFxStop;
        }
    });

    QUnit.test('incomplete animation should be stopped after changing modes', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            openedStateMode: 'push',
            animationDuration: 500,
            closeOnOutsideClick: true,
            revealMode: 'slide',
            shading: true
        });

        const origFxStop = fx.stop;
        let panelStopCalls = 0;
        let contentStopCalls = 0;
        let shaderStopCalls = 0;
        let isJumpedToEnd = false;

        const instance = $element.dxDrawer('instance');
        fx.stop = function($element, jumpToEnd) {
            isJumpedToEnd = jumpToEnd;

            if($element.hasClass(DRAWER_PANEL_CONTENT_CLASS)) {
                panelStopCalls++;
            }
            if($element.hasClass(DRAWER_CONTENT_CLASS)) {
                contentStopCalls++;
            }
            if($element.hasClass(DRAWER_SHADER_CLASS)) {
                shaderStopCalls++;
            }
        };

        try {
            fx.off = false;

            instance.option('openedStateMode', 'shrink');
            instance.option('revealMode', 'expand');

            assert.equal(panelStopCalls, 2, 'animation should stops before closing');
            assert.equal(contentStopCalls, 2, 'animation should stops before closing');
            assert.equal(shaderStopCalls, 2, 'animation should stops before closing');
            assert.ok(isJumpedToEnd, 'elements are returned to the end position after animation stopping');
        } finally {
            fx.off = true;
            fx.stop = origFxStop;
        }
    });

    QUnit.test('drawer shouldn\'t fail after changing openedStateMode', function(assert) {
        const $element = $('#drawer').dxDrawer({
            openedStateMode: 'push'
        });
        const instance = $element.dxDrawer('instance');

        instance.option('openedStateMode', 'shrink');
        instance.option('openedStateMode', 'overlap');

        assert.ok(true, 'Drawer works correctly');
    });

    QUnit.test('target option', function(assert) {
        const $element = $('#drawer').dxDrawer({
            openedStateMode: 'overlap'
        });
        const instance = $element.dxDrawer('instance');

        assert.ok($(instance._overlay.option('position').of).hasClass('dx-drawer-wrapper'), 'default target is ok');

        instance.option('target', $element.find('.dx-drawer-content'));
        assert.ok($(instance._overlay.option('position').of).hasClass('dx-drawer-content'), 'target is ok');
    });

    QUnit.test('content() function', function(assert) {
        const $element = $('#drawer').dxDrawer({});
        const instance = $element.dxDrawer('instance');
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);
        assert.equal(typeUtils.isRenderer(instance.content()), !!config().useJQuery, 'panel element');
        assert.equal($panel.get(0), $(instance.content()).get(0), 'content function return correct DOMNode');
    });

    QUnit.test('viewContent() function', function(assert) {
        const $element = $('#drawer').dxDrawer({});
        const instance = $element.dxDrawer('instance');
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);

        assert.equal($content.get(0), $(instance.viewContent()).get(0), 'content function return correct DOMNode');
    });

    QUnit.test('show() and hide() methods', function(assert) {
        const $element = $('#drawer').dxDrawer({});
        const instance = $element.dxDrawer('instance');

        instance.show();
        assert.equal(instance.option('opened'), true, 'panel was shown');

        instance.hide();
        assert.equal(instance.option('opened'), false, 'panel was hidden');
    });

    QUnit.test('toggle() method', function(assert) {
        const $element = $('#drawer').dxDrawer({});
        const instance = $element.dxDrawer('instance');
        const opened = instance.option('opened');

        instance.toggle();
        assert.equal(instance.option('opened'), !opened, 'panel was shown');

        instance.toggle();
        assert.equal(instance.option('opened'), opened, 'panel was hidden');
    });

    QUnit.test('wrapper content should be reversed if position = \'bottom\' or \'right\'', function(assert) {
        const $element = $('#drawer').dxDrawer({
            openedStateMode: 'shrink'
        });
        const instance = $element.dxDrawer('instance');

        instance.option('position', 'right');
        const $wrapper = $element.find('.dx-drawer-wrapper').eq(0);
        let $content = $wrapper.children();

        assert.ok($content.eq(1).hasClass('dx-drawer-panel-content'));
        assert.ok($content.eq(0).hasClass('dx-drawer-content'));

        instance.option('position', 'left');

        $content = $wrapper.children();

        assert.ok($content.eq(0).hasClass('dx-drawer-panel-content'));
        assert.ok($content.eq(1).hasClass('dx-drawer-content'));
    });

    QUnit.test('wrapper content should be reversed if position = \'right\' and openedStateMode is changed', function(assert) {
        const $element = $('#drawer').dxDrawer({
            openedStateMode: 'push',
            position: 'right'
        });
        const instance = $element.dxDrawer('instance');

        instance.option('openedStateMode', 'shrink');
        const $wrapper = $element.find('.dx-drawer-wrapper').eq(0);
        let $content = $wrapper.children();

        assert.ok($content.eq(1).hasClass('dx-drawer-panel-content'));
        assert.ok($content.eq(0).hasClass('dx-drawer-content'));

        instance.option('position', 'left');

        $content = $wrapper.children();

        assert.ok($content.eq(0).hasClass('dx-drawer-panel-content'));
        assert.ok($content.eq(1).hasClass('dx-drawer-content'));
    });

    QUnit.skip('drawer panel should be repositioned correctly after dimension changed,left position', function(assert) {
        fx.off = true;

        const $element = $('#drawer').dxDrawer({
            opened: false,
            revealMode: 'slide',
            openedStateMode: 'overlap',
            template: function($content) {
                const $div = $('<div/>');
                $div.css('height', 600);
                $div.css('width', 200);

                return $div;
            }
        });
        const $panelOverlayContent = $element.find('.dx-overlay-content');

        resizeCallbacks.fire();

        assert.equal($panelOverlayContent.position().left, 0, 'panel overlay content position is OK');

        fx.off = false;
    });

    QUnit.skip('drawer panel should be repositioned correctly after dimension changed,top position', function(assert) {
        fx.off = true;

        const $element = $('#drawer').dxDrawer({
            opened: false,
            position: 'top',
            revealMode: 'slide',
            openedStateMode: 'overlap',
            template: function($content) {
                const $div = $('<div/>');
                $div.css('height', 600);
                $div.css('width', 200);

                return $div;
            }
        });
        const $panelOverlayContent = $element.find('.dx-overlay-content');

        resizeCallbacks.fire();

        assert.equal($panelOverlayContent.position().top, 0, 'panel overlay content position is OK');

        fx.off = false;
    });

    QUnit.test('drawer panel should have correct size after dimension changed,top position', function(assert) {
        fx.off = true;

        const $element = $('#drawer').dxDrawer({
            opened: false,
            position: 'top',
            revealMode: 'expand',
            openedStateMode: 'overlap',
            template: function($content) {
                const $div = $('<div/>');
                $div.css('height', 600);
                $div.css('width', 200);

                return $div;
            }
        });
        const drawer = $element.dxDrawer('instance');
        const $panelOverlayContent = $element.find('.dx-overlay-content');

        resizeCallbacks.fire();

        drawer.toggle();
        assert.equal($panelOverlayContent.height(), 600, 'panel overlay height is OK');

        fx.off = false;
    });

    QUnit.test('drawer panel should be repositioned correctly after dimension changed, right position', function(assert) {
        fx.off = true;

        const $element = $('#drawer').dxDrawer({
            opened: false,
            position: 'right',
            revealMode: 'slide',
            openedStateMode: 'overlap',
            template: function($content) {
                const $div = $('<div/>');
                $div.css('height', 600);
                $div.css('width', 200);

                return $div;
            }
        });
        const instance = $element.dxDrawer('instance');
        const $panelOverlayContent = $element.find('.dx-overlay-content');

        resizeCallbacks.fire();
        instance.option('revealMode', 'expand');
        assert.equal($panelOverlayContent.css('left'), 'auto', 'panel overlay content position is OK');

        fx.off = false;
    });

    QUnit.skip('drawer panel should be repositioned after dimension changed, right position', function(assert) {
        fx.off = true;

        const $element = $('#drawer').dxDrawer({
            opened: false,
            revealMode: 'slide',
            position: 'right',
            openedStateMode: 'overlap',
            template: function($content) {
                const $div = $('<div/>');
                $div.css('height', 600);
                $div.css('width', 200);

                return $div;
            }
        });
        const $panelOverlayContent = $element.find('.dx-overlay-content');

        resizeCallbacks.fire();

        assert.equal($panelOverlayContent.position().left, -200, 'panel overlay content position is OK');

        fx.off = false;
    });

    QUnit.test('content container should have correct position if panel isn\'t visible', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: false
        });

        const instance = $element.dxDrawer('instance');
        const $content = $(instance.viewContent());

        assert.equal(position($content), 0, 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if panel is visible', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true
        });

        const instance = $element.dxDrawer('instance');
        const $content = $(instance.viewContent());
        const $panel = $(instance.content());

        assert.equal(position($content), $panel.width(), 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position after resize', function(assert) {
        const $element = $('#drawer2').dxDrawer({
            width: '100%',
            opened: true
        });

        const instance = $element.dxDrawer('instance');
        const $content = $(instance.viewContent());
        const elementWidth = $element.width();

        $('#drawerContainer').width(elementWidth * 2);
        resizeCallbacks.fire();

        assert.equal(position($content), $(instance.content()).width(), 'container rendered at correct position');
    });

    QUnit.test('content container should have correct position if it is rendered in invisible container', function(assert) {
        const $container = $('#drawerContainer');
        const $element = $('#drawer2');

        $container.detach();

        const instance = $element.dxDrawer({
            width: '100%',
            opened: true,
            maxSize: 50
        }).dxDrawer('instance');

        const $content = $(instance.viewContent());

        $container.appendTo('#qunit-fixture');
        $element.trigger('dxshown');

        assert.equal(position($content), 50, 'container rendered at correct position');
    });

    QUnit.test('drawer panel should have correct width when panel content is wrapped by div with borders (T702576)', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            template: function($content) {
                const $outerDiv = $('<div/>');
                $('<div/>').css('height', 600).css('width', 200).appendTo($outerDiv);

                return $outerDiv;
            }
        });

        const $panelContent = $element.find('.dx-drawer-panel-content').css('border', '10px solid black');

        resizeCallbacks.fire();

        assert.equal($panelContent.width(), 180, 'panel content has correct width');
        assert.equal($panelContent.outerWidth(), 200, 'panel content has correct outerWidth');
    });

    QUnit.test('drawer panel should have correct width when async template is used', function(assert) {
        const clock = sinon.useFakeTimers();

        $('#drawer').dxDrawer({
            openedStateMode: 'push',
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    'panel': {
                        render: function(args) {
                            const $div = $('<div/>').appendTo(args.container);
                            setTimeout(() => {
                                $div.css('height', 600);
                                $div.css('width', 200);
                                args.onRendered();
                            }, 100);
                        }
                    }
                }
            }
        });

        clock.tick(100);
        const $panel = $('#drawer').find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.width(), 200, 'panel has correct size');
        clock.restore();
    });

    QUnit.test('drawer panel should have correct width when async template is used, overlap mode', function(assert) {
        const clock = sinon.useFakeTimers();

        $('#drawer').dxDrawer({
            openedStateMode: 'overlap',
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    'panel': {
                        render: function(args) {
                            const $div = $('<div/>').appendTo(args.container);
                            setTimeout(() => {
                                $div.css('height', 600);
                                $div.css('width', 200);
                                args.onRendered();
                            }, 100);
                        }
                    }
                }
            }
        });

        clock.tick(100);
        const $panelOverlayContent = $('#drawer').find('.dx-overlay-content');

        assert.equal($panelOverlayContent.width(), 200, 'panel has correct size');
        clock.restore();
    });

    QUnit.test('drawer panel should have correct z-index when async template is used, overlap mode', function(assert) {
        const clock = sinon.useFakeTimers();

        $('#drawer').dxDrawer({
            openedStateMode: 'overlap',
            templatesRenderAsynchronously: true,
            integrationOptions: {
                templates: {
                    'panel': {
                        render: function(args) {
                            const $div = $('<div/>').appendTo(args.container);
                            setTimeout(() => {
                                $div.css('height', 600);
                                $div.css('width', 200);
                                args.onRendered();
                            }, 100);
                        }
                    }
                }
            }
        });

        clock.tick(100);
        const $panel = $('#drawer').find('.dx-drawer-panel-content');

        assert.equal($panel.css('zIndex'), 1501, 'panel has correct zIndex');
        clock.restore();
    });

    QUnit.test('drawer panel should have correct margin when async template is used', function(assert) {
        const clock = sinon.useFakeTimers();

        $('#drawer').dxDrawer({
            openedStateMode: 'shrink',
            templatesRenderAsynchronously: true,
            opened: true,
            integrationOptions: {
                templates: {
                    'panel': {
                        render: function(args) {
                            const $div = $('<div/>').appendTo(args.container);
                            setTimeout(() => {
                                $div.css('height', 600);
                                $div.css('width', 200);
                                args.onRendered();
                            }, 100);
                        }
                    }
                }
            }
        });

        clock.tick(100);
        const $panel = $('#drawer').find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.css('marginLeft'), '0px', 'panel has correct margin');
        clock.restore();
    });

    QUnit.test('getting real panel position in accordance with rtlEnabled and position options', function(assert) {
        const $element = $('#drawer').dxDrawer({
            position: 'after'
        });
        const instance = $element.dxDrawer('instance');

        assert.equal(instance.getDrawerPosition(), 'right');

        instance.option('position', 'before');

        assert.equal(instance.getDrawerPosition(), 'left');

        instance.option('rtlEnabled', true);

        assert.equal(instance.getDrawerPosition(), 'right');

        instance.option('position', 'after');

        assert.equal(instance.getDrawerPosition(), 'left');
    });
});

QUnit.module('Animation', {
    beforeEach() {
        this.capturedAnimations = animationCapturing.start();
    },
    afterEach() {
        animationCapturing.teardown();
    }
}, () => {
    QUnit.test('animationEnabled option test', function(assert) {
        fx.off = false;

        const origFX = fx.animate;
        let animated = false;

        fx.animate = () => {
            animated = true;
            return Promise.resolve();
        };

        try {
            const $drawer = $('#drawer').dxDrawer({
                opened: true,
                animationEnabled: false
            });

            const drawer = $drawer.dxDrawer('instance');

            drawer.option('opened', false);

            assert.equal(animated, false, 'animation was not present');

            drawer.option('animationEnabled', true);
            drawer.option('opened', true);

            assert.equal(animated, true, 'animation present');
        } finally {
            fx.animate = origFX;
        }
    });

    QUnit.test('animationDuration option test', function(assert) {
        const $drawer = $('#drawer').dxDrawer({
            opened: false,
            animationEnabled: true,
            openedStateMode: 'push'
        });

        const drawer = $drawer.dxDrawer('instance');


        drawer.option('animationDuration', 300);

        drawer.toggle();
        assert.equal(this.capturedAnimations[0].duration, 300, 'duration is correct');
        drawer.option('animationDuration', 10000);
        drawer.toggle();
        assert.equal(this.capturedAnimations[1].duration, 10000, 'duration is correct');
    });
});

QUnit.module('Shader', () => {
    QUnit.test('shader should be visible if drawer is opened and shading = true', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            shading: true
        });

        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        assert.ok($shader.is(':visible'), 'shader is visible');
    });

    QUnit.test('shader should not be visible if drawer is closed', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: false,
            shading: true
        });

        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        assert.ok($shader.is(':hidden'), 'shader is hidden');
        assert.equal($shader.css('visibility'), 'hidden', 'shader is hidden');
    });

    QUnit.test('shader should have correct visibility after toggling state', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            shading: true,
            animationEnabled: false
        });
        const instance = $element.dxDrawer('instance');
        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        instance.toggle();

        assert.ok($shader.is(':hidden'), 'shader is hidden');
        assert.equal($shader.css('visibility'), 'hidden', 'shader is hidden');
    });

    QUnit.test('shader should have correct opacity after toggling state', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            shading: true,
            animationEnabled: false
        });
        const instance = $element.dxDrawer('instance');
        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        assert.equal($shader.css('opacity'), 1, 'shader has right opacity');
        instance.toggle();
        assert.equal($shader.css('opacity'), 0, 'shader has right opacity');
    });

    QUnit.test('shading option', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            shading: true
        });
        const instance = $element.dxDrawer('instance');
        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        assert.ok($shader.is(':visible'), 'shader is visible');

        instance.option('shading', false);
        assert.ok($shader.is(':hidden'), 'shader is hidden');
    });

    QUnit.test('click on shader should not close drawer', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            shading: true
        });

        const instance = $element.dxDrawer('instance');
        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        $shader.trigger('dxclick');
        assert.ok(instance.option('opened'), 'drawer is opened');
    });

    QUnit.test('shader should be visible during animation', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: false,
            shading: true
        });

        const instance = $element.dxDrawer('instance');
        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        instance.show();
        assert.ok($shader.is(':visible'), 'shader is visible during animation');
    });

    QUnit.test('shader should have correct position', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            shading: true
        });

        const instance = $element.dxDrawer('instance');
        const $content = $(instance.viewContent());
        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        assert.equal($shader.offset().left, $content.offset().left, 'shader has correct position');
    });

    QUnit.test('shader should have correct position after widget resize', function(assert) {
        const $element = $('#drawer2').dxDrawer({
            width: '100%',
            opened: true,
            shading: true
        });

        const instance = $element.dxDrawer('instance');
        const $content = $(instance.viewContent());
        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);
        const panelWidth = $(instance.content()).width();

        $('#drawerContainer').width(panelWidth * 2);
        resizeCallbacks.fire();

        assert.equal($shader.offset().left, $content.offset().left, 'shader has correct position');
    });

    QUnit.test('shader should have correct zIndex in overlap mode', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            openedStateMode: 'overlap',
            shading: true
        });

        const $shader = $element.find('.' + DRAWER_SHADER_CLASS);

        assert.equal($shader.css('zIndex'), 1500, 'shader has correct zIndex');
    });
});

QUnit.module('Rtl', () => {
    QUnit.test('content should have correct position if panel is visible in rtl mode', function(assert) {
        const $element = $('#drawer').dxDrawer({
            opened: true,
            openedStateMode: 'push',
            rtlEnabled: true
        });

        const instance = $element.dxDrawer('instance');
        const $content = $(instance.viewContent());
        const $panel = $(instance.content());

        assert.equal(position($content), $panel.width(), 'container rendered at correct position');
    });

    QUnit.test('drawer panel overlay should have right position config', function(assert) {
        const drawer = $('#drawer').dxDrawer({
            openedStateMode: 'overlap',
            rtlEnabled: true
        }).dxDrawer('instance');
        let overlay = drawer.getOverlay();

        assert.equal(overlay.option('position').my, 'top left');
        assert.equal(overlay.option('position').at, 'top left');

        drawer.option('position', 'right');
        overlay = drawer.getOverlay();

        assert.equal(overlay.option('position').my, 'top left');
        assert.equal(overlay.option('position').at, 'top right');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode rtl, slide', function(assert) {
        fx.off = true;
        const drawer = $('#drawer').dxDrawer({
            openedStateMode: 'overlap',
            minSize: 50,
            maxSize: 300,
            opened: false,
            width: 500,
            revealMode: 'slide',
            rtlEnabled: true,
            template: function($content) {
                const $div = $('<div/>');
                $div.css('height', 600);
                $div.css('width', 200);

                return $div;
            }
        }).dxDrawer('instance');

        const $panel = $('.dx-drawer-panel-content.dx-overlay').eq(0);

        assert.equal($panel.position().left, -150, 'panel has correct left when minSize and max size are set');

        drawer.toggle();

        assert.equal($panel.position().left, 100, 'panel has correct left when minSize and max size are set');

        fx.off = false;
    });

    QUnit.test('wrapper content should be reversed if position = \'right\' and openedStateMode is changed, rtl', function(assert) {
        const $element = $('#drawer').dxDrawer({
            openedStateMode: 'push',
            rtlEnabled: true,
            position: 'left'
        });
        const instance = $element.dxDrawer('instance');

        instance.option('openedStateMode', 'shrink');

        const $wrapper = $element.find('.dx-drawer-wrapper').eq(0);
        let $content = $wrapper.children();

        assert.ok($content.eq(1).hasClass('dx-drawer-panel-content'));
        assert.ok($content.eq(0).hasClass('dx-drawer-content'));

        instance.option('position', 'right');

        $content = $wrapper.children();

        assert.ok($content.eq(0).hasClass('dx-drawer-panel-content'));
        assert.ok($content.eq(1).hasClass('dx-drawer-content'));
    });
});

QUnit.module('CloseOnOutsideClick', () => {
    QUnit.test('drawer should be hidden after click on content', function(assert) {
        const drawer = $('#drawer').dxDrawer({
            closeOnOutsideClick: false,
            opened: true,
            shading: true
        })
            .dxDrawer('instance');
        const $content = drawer.viewContent();

        $($content).trigger('dxclick');
        assert.equal(drawer.option('opened'), true, 'drawer is not hidden');
        drawer.option('closeOnOutsideClick', true);

        const $shader = drawer.$element().find('.' + DRAWER_SHADER_CLASS);
        $($content).trigger('dxclick');

        assert.equal(drawer.option('opened'), false, 'drawer is hidden');
        assert.ok($shader.is(':hidden'), 'shader is hidden');
    });

    QUnit.test('closeOnOutsideClick as function should be processed correctly', function(assert) {
        const drawer = $('#drawer').dxDrawer({
            closeOnOutsideClick: () => {
                return false;
            },
            opened: true
        })
            .dxDrawer('instance');
        const $content = drawer.viewContent();

        $($content).trigger('dxclick');
        assert.equal(drawer.option('opened'), true, 'drawer is not hidden');
        drawer.option('closeOnOutsideClick', () => {
            return true;
        });

        $($content).trigger('dxclick');
        assert.equal(drawer.option('opened'), false, 'drawer is hidden');
    });
});

QUnit.module('Push mode', {
    beforeEach: () => {
        this.createInstance = function(options) {
            this.instance = $('#drawer').dxDrawer($.extend(options, {
                openedStateMode: 'push',
                template: function($content) {
                    const $div = $('<div/>');
                    $div.css('height', 200);
                    $div.css('width', 300);

                    return $div;
                }
            })).dxDrawer('instance');
        };

        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test('minSize and maxSize should be rendered correctly in push mode', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 400,
            opened: true,
        });

        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);

        assert.equal($content.position().left, 400, 'content has correct left when minSize and maxSize are set');

        this.instance.toggle();

        assert.equal($content.position().left, 50, 'content has correct left when minSize and maxSize are set');
    });

    QUnit.test('drawer should be rendered correctly in push mode, right panel position', assert => {
        this.createInstance({
            position: 'right',
            opened: true
        });

        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);

        assert.equal($content.position().left, -300, 'content has correct left');

        this.instance.toggle();

        assert.equal($content.position().left, 0, 'content has correct left');

        fx.off = false;
    });

    QUnit.test('minSize and maxSize should be rendered correctly in push mode, right panel position', assert => {
        this.createInstance({
            position: 'right',
            minSize: 50,
            maxSize: 400,
            opened: true
        });

        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);

        assert.equal($content.position().left, -400, 'content has correct left when minSize and maxSize are set');

        this.instance.toggle();

        assert.equal($content.position().left, -50, 'content has correct left when minSize and maxSize are set');

        fx.off = false;
    });

    QUnit.test('minSize and maxSize should be rendered correctly in push mode, top panel position', assert => {
        this.createInstance({
            position: 'top',
            minSize: 50,
            maxSize: 400,
            opened: true
        });

        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);

        assert.equal($content.position().top, 400, 'content has correct top when minSize and maxSize are set');

        this.instance.toggle();

        assert.equal($content.position().top, 50, 'content has correct top when minSize and maxSize are set');

        fx.off = false;
    });

    QUnit.test('minSize and maxSize should be rendered correctly in push mode, bottom panel position', assert => {
        this.createInstance({
            position: 'bottom',
            minSize: 50,
            maxSize: 400,
            opened: true
        });

        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);

        assert.equal($content.position().top, -400, 'content has correct top when minSize and maxSize are set');

        this.instance.toggle();

        assert.equal($content.position().top, -50, 'content has correct top when minSize and maxSize are set');

        fx.off = false;
    });
});

QUnit.module('Shrink mode', {
    beforeEach: () => {
        this.createInstance = function(options) {
            this.instance = $('#drawer').dxDrawer($.extend(options, {
                openedStateMode: 'shrink',
                contentTemplate: 'contentTemplate',
                width: 800,
                template: function($content) {
                    const $div = $('<div/>');
                    $div.css('height', 200);
                    $div.css('width', 300);

                    return $div;
                }
            })).dxDrawer('instance');
        };

        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, expand', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'expand'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($content.position().left, 50, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 0, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 50, 'panel has correct width when minSize is set');

        this.instance.toggle();

        assert.equal($content.position().left, 100, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 0, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 100, 'panel has correct width when minSize is set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, slide', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 200,
            opened: false,
            revealMode: 'slide'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.css('marginLeft'), '-250px', 'panel has correct margin when minSize is set');
        assert.equal($content.position().left, 50, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 0, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 300, 'panel has correct width when minSize is set');

        this.instance.toggle();

        assert.equal($panel.css('marginLeft'), '-100px', 'panel has correct margin when minSize is set');
        assert.equal($content.position().left, 200, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 0, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 300, 'panel has correct width when minSize is set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, right panel position expand', assert => {
        this.createInstance({
            position: 'right',
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'expand'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($content.position().left, 0, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 750, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 50, 'panel has correct width when minSize is set');

        this.instance.toggle();

        assert.equal($content.position().left, 0, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 700, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 100, 'panel has correct width when minSize is set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, right panel position slide', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 200,
            opened: false,
            revealMode: 'slide',
            position: 'right'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.css('marginRight'), '-250px', 'panel has correct margin when minSize is set');
        assert.equal($content.position().left, 0, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 750, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 300, 'panel has correct width when minSize is set');

        this.instance.toggle();

        assert.equal($panel.css('marginRight'), '-100px', 'panel has correct margin when minSize is set');
        assert.equal($content.position().left, 0, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 600, 'panel has correct left when minSize is set');
        assert.equal($panel.width(), 300, 'panel has correct width when minSize is set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, top panel position expand', assert => {
        this.createInstance({
            position: 'top',
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'expand'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($content.position().top, 50, 'content has correct top');
        assert.equal($panel.position().top, 0, 'panel has correct top');
        assert.equal($panel.height(), 50, 'panel has correct height');

        this.instance.toggle();

        assert.equal($content.position().top, 100, 'content has correct top');
        assert.equal($panel.position().top, 0, 'panel has correct top');
        assert.equal($panel.height(), 100, 'panel has correct height');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, top panel position slide', assert => {
        this.createInstance({
            position: 'top',
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'slide'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($content.position().top, 50, 'content has correct top');
        assert.equal($panel.position().top, 0, 'panel has correct top');
        assert.equal($panel.height(), 200, 'panel has correct height');
        assert.equal($panel.css('marginTop'), '-150px', 'panel content has correct marginTop');

        this.instance.toggle();

        assert.equal($content.position().top, 100, 'content has correct top');
        assert.equal($panel.position().top, 0, 'panel has correct top when');
        assert.equal($panel.height(), 200, 'panel has correct height when');
        assert.equal($panel.css('marginTop'), '-100px', 'panel content has correct marginTop');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, bottom panel position expand', assert => {
        this.createInstance({
            position: 'bottom',
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'expand'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($content.position().top, 0, 'content has correct top');
        assert.equal($panel.position().top, 950, 'panel has correct top');
        assert.equal($panel.height(), 50, 'panel has correct height');

        this.instance.toggle();

        assert.equal($content.position().top, 0, 'content has correct top');
        assert.equal($panel.position().top, 900, 'panel has correct top');
        assert.equal($panel.height(), 100, 'panel has correct height');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in shrink mode, bottom panel position slide', assert => {
        this.createInstance({
            position: 'bottom',
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'slide'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($content.position().top, 0, 'content has correct top');
        assert.equal($panel.position().top, 950, 'panel has correct top');
        assert.equal($panel.height(), 200, 'panel has correct height');
        assert.equal($panel.css('marginBottom'), '-150px', 'panel content has correct marginBottom');

        this.instance.toggle();

        assert.equal($content.position().top, 0, 'content has correct top');
        assert.equal($panel.position().top, 900, 'panel has correct top when');
        assert.equal($panel.height(), 200, 'panel has correct height when');
        assert.equal($panel.css('marginBottom'), '-100px', 'panel content has correct marginBottom');
    });

    QUnit.test('panel should have correct width in shrink mode after drawer resizing, expand', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'expand'
        });

        const $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.width(), 50, 'panel has correct width when minSize is set');

        resizeCallbacks.fire();
        assert.equal($panel.width(), 50, 'panel has correct width when minSize is set');
    });

    QUnit.test('panel should have correct height in shrink mode after drawer resizing, expand', assert => {
        this.createInstance({
            position: 'top',
            minSize: 50,
            maxSize: 100,
            opened: false,
            revealMode: 'expand',
            width: 800
        });

        const $element = this.instance.$element();
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.height(), 50, 'panel has correct height when minSize is set');

        resizeCallbacks.fire();
        assert.equal($panel.height(), 50, 'panel has correct height when minSize is set');
    });
});

QUnit.module('Overlap mode', {
    beforeEach: () => {
        this.createInstance = function(options) {
            this.instance = $('#drawer').dxDrawer($.extend({
                openedStateMode: 'overlap',
                contentTemplate: 'contentTemplate',
                width: 800,
                template: $content => $('<div/>').css({ height: 200, width: 300 })
            }, options)).dxDrawer('instance');
        };

        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test('drawer panel should be overlay in overlap mode', assert => {
        this.createInstance({});

        assert.ok(this.instance.getOverlay() instanceof Overlay, 'Drawer has overlay');
        assert.ok($(this.instance.content()).hasClass('dx-overlay'), 'Panel content is an overlay');
    });

    [true, false].forEach((shading) => {
        [true, false].forEach((isOpened) => {
            [0, 100, null, undefined].forEach((minSize) => {
                QUnit.test(`overlay configuration: opened- ${isOpened}, shading- ${shading}, minSize-${minSize}`, assert => {
                    this.createInstance({
                        shading: shading,
                        opened: isOpened,
                        minSize: minSize,
                        template: ($content) => {
                            const $div = $('<div/>').css({ height: 200, width: 300 });
                            return $('<div/>').append($div);
                        }
                    });
                    let overlay = this.instance.getOverlay();

                    assert.equal(overlay.option('shading'), false, 'overlay.shading');
                    assert.ok(overlay.option('container').hasClass('dx-drawer-wrapper'));

                    assert.equal(overlay.option('width'), isOpened ? 300 : minSize || 0);

                    assert.equal(overlay.option('position').my, 'top left');
                    assert.equal(overlay.option('position').at, 'top left');

                    this.instance.option('position', 'right');
                    overlay = this.instance.getOverlay();
                    assert.equal(overlay.option('position').my, 'top right');
                    assert.equal(overlay.option('position').at, 'top right');

                    this.instance.option('position', 'top');
                    overlay = this.instance.getOverlay();
                    assert.equal(overlay.option('position').my, 'top');
                    assert.equal(overlay.option('position').at, 'top');

                    this.instance.option('position', 'bottom');
                    overlay = this.instance.getOverlay();
                    assert.equal(overlay.option('position').my, 'bottom');
                    assert.equal(overlay.option('position').at, 'bottom');
                });
            });
        });
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, expand', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'expand'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        const $overlayContent = $('.dx-drawer-panel-content.dx-overlay-wrapper .dx-overlay-content').eq(0);

        assert.equal($content.position().left, 0, 'content has correct left when minSize and max size are set');
        assert.equal($content.css('paddingLeft'), '50px', 'content has correct padding when minSize and max size are set');
        assert.equal($panel.position().left, 0, 'panel has correct left when minSize and max size are set');
        assert.equal($overlayContent.width(), 50, 'panel content has correct width when minSize and max size are set');

        this.instance.toggle();

        assert.equal($content.position().left, 0, 'content has correct left when minSize and max size are set');
        assert.equal($content.css('paddingLeft'), '50px', 'content has correct padding when minSize and max size are set');
        assert.equal($panel.position().left, 0, 'panel has correct left when minSize and max size are set');
        assert.equal($overlayContent.width(), 300, 'panel content has correct width when minSize and max size are set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, slide', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'slide'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $('.dx-drawer-panel-content.dx-overlay').eq(0);
        const $overlayContent = $('.dx-drawer-panel-content.dx-overlay-wrapper .dx-overlay-content').eq(0);

        assert.equal($content.position().left, 0, 'content has correct left when minSize and max size are set');
        assert.equal($panel.position().left, -250, 'panel has correct left when minSize and max size are set');
        assert.equal($overlayContent.width(), 300, 'panel has correct width when minSize and max size are set');

        this.instance.toggle();

        assert.equal($content.position().left, 0, 'content has correct left when minSize and max size are set');
        assert.equal($panel.position().left, 0, 'panel has correct left when minSize and max size are set');
        assert.equal($overlayContent.width(), 300, 'panel has correct width when minSize and max size are set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, right panel position expand', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'expand',
            position: 'right'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $element.find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        const $overlayContent = $('.dx-drawer-panel-content.dx-overlay-wrapper .dx-overlay-content').eq(0);

        assert.equal($content.position().left, 0, 'content has correct left when minSize and max size are set');
        assert.equal($content.css('paddingRight'), '50px', 'content has correct padding when minSize and max size are set');
        assert.equal($panel.position().left, 800, 'panel has correct left when minSize and max size are set');
        assert.equal($overlayContent.width(), 50, 'panel content has correct width when minSize and max size are set');

        this.instance.toggle();

        assert.equal($content.position().left, 0, 'content has correct left when minSize and max size are set');
        assert.equal($content.css('paddingRight'), '50px', 'content has correct padding when minSize and max size are set');
        assert.equal($panel.position().left, 800, 'panel has correct left when minSize and max size are set');
        assert.equal($overlayContent.width(), 300, 'panel content has correct width when minSize and max size are set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, right panel position slide', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'slide',
            position: 'right'
        });

        const $element = this.instance.$element();
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $('.dx-drawer-panel-content.dx-overlay').eq(0);
        const $overlayContent = $('.dx-drawer-panel-content.dx-overlay-wrapper .dx-overlay-content').eq(0);

        assert.equal($content.position().left, 0, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 1050, 'panel has correct left when minSize is set');
        assert.equal($overlayContent.width(), 300, 'panel has correct width when minSize is set');

        this.instance.toggle();

        assert.equal($content.position().left, 0, 'content has correct left when minSize is set');
        assert.equal($panel.position().left, 800, 'panel has correct left when minSize is set');
        assert.equal($overlayContent.width(), 300, 'panel has correct width when minSize is set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, top panel position expand', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'expand',
            position: 'top'
        });

        const $element = this.instance.$element();
        const $panel = $('.dx-drawer-panel-content.dx-overlay').eq(0);
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panelContent = $panel.find('.dx-overlay-content');

        assert.equal($panelContent.height(), 50, 'panel content has correct height when minSize is set');
        assert.equal($content.css('paddingTop'), '50px', 'content has correct padding when minSize and max size are set');

        this.instance.toggle();

        assert.equal($panelContent.height(), 300, 'panel content has correct height when minSize is set');
        assert.equal($content.css('paddingTop'), '50px', 'content has correct padding when minSize and max size are set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, top panel position slide', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'slide',
            position: 'top'
        });

        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $('.dx-drawer-panel-content.dx-overlay').eq(0);

        assert.equal($content.position().top, 0, 'content has correct top when minSize is set');
        assert.equal($panel.position().top, -150, 'panel has correct top when minSize is set');

        this.instance.toggle();

        assert.equal($content.position().top, 0, 'content has correct top when minSize is set');
        assert.equal($panel.position().top, 100, 'panel has correct top when minSize is set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, bottom panel position expand', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'expand',
            position: 'bottom'
        });

        const $element = this.instance.$element();
        const $panel = $('.dx-drawer-panel-content.dx-overlay').eq(0);
        const $content = $element.find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panelContent = $panel.find('.dx-overlay-content');

        assert.equal($panelContent.height(), 50, 'panel content has correct height when minSize is set');
        assert.equal($panelContent.css('marginTop'), '150px', 'panel content has correct margin when minSize is set');
        assert.equal($content.css('paddingBottom'), '50px', 'content has correct padding when minSize and max size are set');

        this.instance.toggle();

        assert.equal($panelContent.height(), 300, 'panel content has correct height when minSize is set');
        assert.equal($panelContent.css('marginTop'), '-100px', 'panel content has correct margin when minSize is set');
        assert.equal($content.css('paddingBottom'), '50px', 'content has correct padding when minSize and max size are set');
    });

    QUnit.test('minSize and maxSize should be rendered correctly in overlap mode, bottom panel position slide', assert => {
        this.createInstance({
            minSize: 50,
            maxSize: 300,
            opened: false,
            revealMode: 'slide',
            position: 'bottom'
        });

        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);
        const $panel = $('.dx-drawer-panel-content.dx-overlay').eq(0);

        assert.equal($content.position().top, 0, 'content has correct top when minSize is set');
        assert.equal($panel.position().top, 150, 'panel has correct top when minSize is set');

        this.instance.toggle();

        assert.equal($content.position().top, 0, 'content has correct top when minSize is set');
        assert.equal($panel.position().top, -100, 'panel has correct top when minSize is set');
    });

    QUnit.test('nested drawers. Inner drawer should have right overflow', assert => {
        $('#outerDrawer').dxDrawer({
            opened: true,
            height: 400,
        });

        $('#innerDrawer').dxDrawer({
            openedStateMode: 'overlap',
            opened: true,
            height: 400,
        });

        assert.equal($('#innerDrawer').find('.dx-overlay').eq(0).css('overflow'), 'visible', 'Panel overlay is visible');
        assert.equal($('#innerDrawer').find('.dx-overlay-wrapper').eq(0).css('overflow'), 'visible', 'Panel overlay wrapper is visible');
    });

});

QUnit.module('Modes changing', {
    beforeEach: () => {
        this.createInstance = function(options) {
            this.instance = $('#drawer').dxDrawer($.extend(options, {
                template: function($content) {
                    const $div = $('<div/>');
                    $div.css('height', 200);
                    $div.css('width', 300);

                    return $div;
                }
            })).dxDrawer('instance');
        };

        fx.off = true;
    },
    afterEach: () => {
        fx.off = false;
    }
}, () => {
    QUnit.test('panel should be rendered correctly after openedStateMode changing', assert => {
        this.createInstance({
            maxSize: 300,
            opened: false,
            revealMode: 'expand',
            openedStateMode: 'shrink'
        });

        this.instance.option('openedStateMode', 'push');
        const $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.width(), 300, 'panel has correct size');

        this.instance.toggle();

        assert.equal($panel.width(), 300, 'panel has correct size');
    });

    QUnit.test('panel should be rendered correctly after openedStateMode changing, right panel position, slide', assert => {
        this.createInstance({
            maxSize: 300,
            opened: true,
            revealMode: 'slide',
            position: 'right',
            openedStateMode: 'shrink'
        });

        this.instance.option('openedStateMode', 'push');
        const $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.css('right'), '0px', 'panel has correct right');
        assert.equal($panel.position().left, 700, 'panel has correct left');
    });

    QUnit.test('panel should be rendered correctly after openedStateMode changing, right panel position, expand', assert => {
        this.createInstance({
            maxSize: 300,
            opened: true,
            revealMode: 'expand',
            position: 'right',
            openedStateMode: 'shrink'
        });

        this.instance.option('openedStateMode', 'push');
        const $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);

        assert.equal($panel.css('marginRight'), '0px', 'panel has correct right');
    });

    QUnit.test('panel should be rendered correctly after openedStateMode changing, vertical direction', assert => {
        this.createInstance({
            maxSize: 300,
            opened: false,
            position: 'bottom',
            revealMode: 'slide',
            openedStateMode: 'shrink'
        });

        this.instance.option('openedStateMode', 'push');
        const $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);
        assert.equal($panel.height(), 300, 'panel has correct size');

        this.instance.toggle();

        assert.equal($panel.height(), 300, 'panel has correct size');
    });

    QUnit.test('panel and content should be rendered correctly after revealMode changing, horizontal direction', assert => {
        this.createInstance({
            minSize: 50,
            opened: true,
            revealMode: 'slide',
            openedStateMode: 'overlap'
        });

        this.instance.option('opened', false);
        this.instance.option('revealMode', 'expand');

        let $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);
        let $panelContent = $panel.find('.dx-overlay-content').eq(0);

        assert.equal($panelContent.width(), 50, 'panel content has correct size');
        assert.equal($panel.position().left, 0, 'panel has correct position');
        assert.equal($panelContent.position().left, 0, 'panel content has correct position');

        this.instance.option('opened', true);
        this.instance.option('revealMode', 'slide');

        $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);
        $panelContent = $panel.find('.dx-overlay-content').eq(0);

        assert.equal($panelContent.width(), 300, 'panel content has correct size');
        assert.equal($panel.position().left, 0, 'panel has correct position');
        assert.equal($panelContent.position().left, 0, 'panel content has correct position');
    });

    QUnit.test('panel and content should be rendered correctly after revealMode changing, vertical direction', assert => {
        this.createInstance({
            minSize: 50,
            opened: true,
            position: 'top',
            revealMode: 'slide',
            openedStateMode: 'overlap'
        });

        this.instance.option('opened', false);
        this.instance.option('revealMode', 'expand');

        let $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);
        let $panelContent = $panel.find('.dx-overlay-content').eq(0);

        assert.equal($panelContent.height(), 50, 'panel content has correct size');
        assert.equal($panel.position().top, 0, 'panel has correct position');
        assert.equal($panelContent.position().top, 0, 'panel content has correct position');

        this.instance.option('opened', true);
        this.instance.option('revealMode', 'slide');

        $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);
        $panelContent = $panel.find('.dx-overlay-content').eq(0);

        assert.equal($panelContent.height(), 200, 'panel content has correct size');
        assert.equal($panel.position().top, 0, 'panel has correct position');
        assert.equal($panelContent.position().top, 0, 'panel content has correct position');
    });

    QUnit.test('drawer panel should be rendered correctly in overlap mode after mode changing, expand', assert => {
        this.createInstance({
            opened: false,
            revealMode: 'expand',
            openedStateMode: 'shrink'
        });

        this.instance.option('openedStateMode', 'overlap');
        this.instance.toggle();

        const $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS).eq(0);
        const $overlayContent = this.instance.$element().find('.dx-overlay-content').eq(0);

        assert.equal($panel.width(), 0, 'panel should have correct width after option changing');
        assert.equal($overlayContent.width(), 300, 'overlay content should have correct width after option changing');
    });

    QUnit.test('drawer panel and content should be rendered correctly in overlap mode after mode changing, slide', assert => {
        this.createInstance({
            opened: true,
            revealMode: 'slide',
            minSize: 50,
            openedStateMode: 'shrink'
        });

        this.instance.option('openedStateMode', 'overlap');

        const $panelContent = this.instance.$element().find('.dx-overlay-content').eq(0);
        const $content = this.instance.$element().find('.' + DRAWER_CONTENT_CLASS).eq(0);

        assert.equal($panelContent.width(), 300, 'panel should have correct width after option changing');
        assert.equal($content.css('transform'), 'none', 'content has right css transform');
    });

    QUnit.test('drawer should have only one panel after mode changing', assert => {
        this.createInstance({
            opened: true,
            revealMode: 'expand',
            openedStateMode: 'overlap',
        });

        this.instance.option('openedStateMode', 'shrink');

        const $panel = this.instance.$element().find('.' + DRAWER_PANEL_CONTENT_CLASS);

        assert.equal($panel.length, 1, 'one panel is rendered');
    });
});
