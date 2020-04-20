import $ from 'jquery';
import { extend } from 'core/utils/extend';
import { drawerTesters } from '../../helpers/drawerHelpers.js';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { clearStack } from 'ui/overlay/z_index';

import 'common.css!';

import dxDrawer from 'ui/drawer';
import dxLoadPanel from 'ui/load_panel';
import dxOverlay from 'ui/overlay.js';

QUnit.testStart(() => {
    $('#qunit-fixture').html(drawerTesters.markup);
    // $("#qunit-tests").prepend(drawerTesters.markup);
});

// TODO: templateSize, maxSize, scrolling, rtlEnabled, animationEnabled, onRendered, _viewPortChangeHandler, target, template overflow and/or view overflow
const configs = [];

['shrink', 'push', 'overlap'].forEach(openedStateMode => {
    ['left', 'top', 'right'].forEach(position => {
        ['slide', 'expand'].forEach(revealMode => {
            [true, false].forEach(shading => {
                [undefined, 25].forEach(minSize => {
                    configs.push({ openedStateMode, position, revealMode, shading, minSize });
                });
            });
        });
    });
});

configs.forEach(config => {
    QUnit.module(`Scenarios (${config.openedStateMode}, ${config.position}, ${config.revealMode}, shading: ${config.shading}, minSize: ${config.minSize})`, {
        beforeEach() {
            this.clock = sinon.useFakeTimers();
            clearStack();
        },
        afterEach() {
            this.clock.restore();
            this.clock = undefined;
            clearStack();
        }
    }, () => {

        function configIs(openedStateMode, position, revealMode) {
            return config.openedStateMode === openedStateMode && (config.position === position || !position) && (config.revealMode === revealMode || !revealMode);
        }

        function testOrSkip(name, skip, callback) {
            if(skip()) {
                QUnit.skip(name + ' - NOT SUPPORTED', function() {});
            } else {
                QUnit.test(name, callback);
            }
        }

        function testOverlap(name, skip, callback) {
            if(config.openedStateMode === 'overlap') {
                if(skip()) {
                    QUnit.skip(name + ' - NOT SUPPORTED', function() {});
                } else {
                    QUnit.test(name, callback);
                }
            }
        }

        function getFullDrawerOptions(targetOptions) {
            return extend({ rtlEnabled: false, animationEnabled: false }, config, targetOptions);
        }

        testOrSkip('opened: false', () => configIs('push', 'top') || configIs('overlap', 'right', 'expand') && config.minSize, function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[config.position].template,
            }));

            this.clock.tick(100);

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false -> opened: true', () => configIs('push', 'top') || configIs('overlap', 'right'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[config.position].template()
            }));

            this.clock.tick(100);
            drawer.option('opened', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false, visible: false -> visible: true', () => configIs('shrink') || configIs('push') || configIs('overlap') && config.minSize, function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                visible: false,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false, visible: false -> visible: true -> opened: true', () => configIs('overlap') || configIs('push', 'top'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                visible: false,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', true);
            this.clock.tick(100);
            drawer.option('opened', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: true', () => configIs('push', 'top'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[config.position].template,
            }));

            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true -> visible: false', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', false);
            this.clock.tick(100);

            assert.strictEqual(drawer.option('visible'), false, 'option(visible)');
            assert.strictEqual(window.getComputedStyle(drawerElement).display, 'none', 'drawerElement.display');
        });

        testOrSkip('opened: true -> visible: false -> visible: true', () => configIs('push', 'top'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', false);
            this.clock.tick(100);
            drawer.option('visible', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip(`opened: true, shading: ${config.shading} -> shading: ${!config.shading}`, () => configIs('push', 'top'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                shading: config.shading,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.option('shading', !config.shading);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: true -> repaint', () => configIs('push', 'top'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[config.position].template,
            }));

            this.clock.tick(100);
            drawer.repaint();
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false -> resize -> opened: true, update position config after resize', () => configIs('push', 'top'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[config.position].template
            }));

            const originalRenderPositionFunc = drawer._renderPosition;

            try {
                sinon.spy(drawer, '_renderPosition');
                resizeCallbacks.fire();
            } finally {
                drawer._renderPosition = originalRenderPositionFunc;
            }

            resizeCallbacks.fire();
            this.clock.tick(100);
            drawer.option('opened', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: true (template + onRendered)', () => configIs('push', 'top') || configIs('overlap', 'right', 'expand'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                width: 200,
                height: 100,
                opened: true,
                visible: true,
                template: 'template1',
                templatesRenderAsynchronously: true,
                integrationOptions: {
                    templates: {
                        template1: {
                            render(data) {
                                $(data.container).append(drawerTesters[config.position].template);
                                data.onRendered();
                            }
                        }
                    }
                },
            }));

            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOverlap('opened: true (T813710: template + rendered + _viewPortChangeHandler)', () => configIs(undefined, 'right'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                visible: true,
                template: 'template1',
                templatesRenderAsynchronously: true,
                templateSize: drawerTesters[config.position].templateSize,
                integrationOptions: {
                    templates: {
                        template1: {
                            render(data) {
                                drawer.getOverlay()._viewPortChangeHandler();
                                $(data.container).append($(drawerTesters[config.position].template()));
                                data.onRendered();
                            }
                        }
                    }
                },
            }));

            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: true, visible: false -> visible: true', () => configIs('overlap') || configIs('push'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                visible: false,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: true, visible: false -> repaint -> visible: true', () => configIs('shrink') || configIs('overlap') || configIs('push'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                visible: false,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.repaint();
            this.clock.tick(100);

            drawer.option('visible', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

    });
});

QUnit.module('Specific scenarios', {
    beforeEach() {
        this.clock = sinon.useFakeTimers();
        clearStack();
    },
    afterEach() {
        this.clock.restore();
        this.clock = undefined;
        clearStack();
    }
}, () => {
    ['shrink', 'push', 'overlap'].forEach(openedStateMode => {
        QUnit.test('opened: false -> opened: true, shader has more priority z-index than overlay inside view content', function(assert) {
            const prevBaseZIndex = dxOverlay.baseZIndex();

            try {
                dxOverlay.baseZIndex(3000);

                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, {
                    rtlEnabled: false,
                    animationEnabled: false,
                    opened: false,
                    position: 'left',
                    revealMode: 'slide',
                    shading: true,
                    template: drawerTesters.left.template,
                    openedStateMode
                });

                const env = {
                    drawer,
                    drawerElement,
                    templateElement: drawerElement.querySelector('#template'),
                    viewElement: drawerElement.querySelector('#view'),
                    shading: drawer.option('shading'),
                    minSize: drawer.option('minSize') || 0
                };

                new dxLoadPanel(document.getElementById('loadPanel'), {
                    visible: true,
                    container: env.viewElement,
                    position: { my: 'center', at: 'center', of: env.viewElement }
                });

                this.clock.tick(100);
                drawer.option('opened', true);
                this.clock.tick(100);

                if(openedStateMode === 'overlap') {
                    assert.strictEqual($('.dx-loadpanel-wrapper').css('zIndex'), '3002', 'loadPanelWrapper.zIndex');
                    assert.strictEqual($('.dx-loadpanel-content').css('zIndex'), '3002', 'loadPanelContent.zIndex');
                    drawerTesters.checkShader(assert, env, { shader: env.shading ? '3500' : 'auto', panel: '3501' });
                } else {
                    assert.strictEqual($('.dx-loadpanel-wrapper').css('zIndex'), '3001', 'loadPanelWrapper.zIndex');
                    assert.strictEqual($('.dx-loadpanel-content').css('zIndex'), '3001', 'loadPanelContent.zIndex');
                    drawerTesters.checkShader(assert, env, { shader: env.shading ? '3500' : 'auto', panel: 'auto' });
                }
            } finally {
                dxOverlay.baseZIndex(prevBaseZIndex);
            }
        });
    });
});
