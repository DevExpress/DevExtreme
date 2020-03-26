import $ from 'jquery';
import { extend } from 'core/utils/extend';
import { drawerTesters } from '../../helpers/drawerHelpers.js';
import { clearStack } from 'ui/overlay/z_index';

import 'common.css!';

import dxDrawer from 'ui/drawer';
import dxLoadPanel from 'ui/load_panel';
import dxOverlay from 'ui/overlay.js';

QUnit.testStart(() => {
    $('#qunit-fixture').html(drawerTesters.markup);
    // $("#qunit-tests").prepend(drawerTesters.markup);
});

// TODO: templateSize, minSize, maxSize, shading, scrolling, rtlEnabled, animationEnabled, onRendered, _viewPortChangeHandler, target, template overflow and/or view overflow
const configs = [];

['shrink', 'push', 'overlap'].forEach(openedStateMode => {
    ['left', 'top', 'right'].forEach(position => {
        ['slide', 'expand'].forEach(revealMode => {
            [true, false].forEach(shading => {
                configs.push({ openedStateMode, position, revealMode, shading });
            });
        });
    });
});

configs.forEach(config => {
    QUnit.module(`Scenarios (${config.openedStateMode}, ${config.position}, ${config.revealMode}, shading: ${config.shading})`, {
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
            const defaultOptions = {
                revealMode: config.revealMode,
                openedStateMode: config.openedStateMode,
                position: config.position,
                rtlEnabled: false,
                shading: config.shading,
                animationEnabled: false
            };
            return extend(defaultOptions, targetOptions);
        }

        testOrSkip('opened: false', () => (config.openedStateMode === 'push' && config.position === 'top'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[config.position].template,
            }));

            this.clock.tick(100);

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false -> opened: true', () => config.openedStateMode === 'push' && config.position === 'top', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[config.position].template()
            }));

            this.clock.tick(100);
            drawer.option('opened', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false, visible: false -> visible: true', () => config.openedStateMode === 'shrink' || (config.openedStateMode === 'push' && config.position === 'top'), function(assert) {
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

        testOrSkip('opened: false, visible: false -> visible: true -> opened: true', () => config.openedStateMode === 'overlap' || (config.openedStateMode === 'push' && config.position === 'top'), function(assert) {
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

        testOrSkip('opened: true', () => config.openedStateMode === 'push' && config.position === 'top', function(assert) {
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

        testOrSkip('opened: true -> visible: false -> visible: true', () => config.openedStateMode === 'push' && config.position === 'top', function(assert) {
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

        testOrSkip(`opened: true, shading: ${config.shading} -> shading: ${!config.shading}`, () => config.openedStateMode === 'push' && config.position === 'top', function(assert) {
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

        testOrSkip('opened: true -> repaint', () => config.openedStateMode === 'push' && config.position === 'top', function(assert) {
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

        testOrSkip('opened: true (template + onRendered)', () => config.openedStateMode === 'push' && config.position === 'top' || (config.openedStateMode === 'overlap' && config.position === 'right' && config.revealMode === 'expand'), function(assert) {
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

        testOverlap('opened: true (T813710: template + rendered + _viewPortChangeHandler)', () => config.position === 'right', function(assert) {
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

        testOrSkip('opened: true, visible: false -> visible: true', () => config.openedStateMode === 'overlap' || config.openedStateMode === 'push', function(assert) {
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

        testOrSkip('opened: true, visible: false -> repaint', () => config.openedStateMode === 'shrink' || config.openedStateMode === 'overlap' || config.openedStateMode === 'push', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                visible: false,
                template: drawerTesters[config.position].template
            }));

            this.clock.tick(100);
            drawer.repaint();
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false -> opened: true, shader has more priority z-index than overlay inside view content', function(assert) {
            const prevBaseZIndex = dxOverlay.baseZIndex();

            try {
                dxOverlay.baseZIndex(3000);

                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: false,
                    template: drawerTesters[config.position].template
                }));

                const env = {
                    drawer,
                    drawerElement,
                    templateElement: drawerElement.querySelector('#template'),
                    viewElement: drawerElement.querySelector('#view')
                };

                new dxLoadPanel(document.getElementById('loadPanel'), {
                    visible: true,
                    container: env.viewElement,
                    position: { my: 'center', at: 'center', of: env.viewElement }
                });

                this.clock.tick(100);
                drawer.option('opened', true);
                this.clock.tick(100);

                if(config.openedStateMode === 'overlap') {
                    assert.strictEqual($('.dx-loadpanel-wrapper').css('zIndex'), '3002', 'loadPanelWrapper.zIndex');
                    assert.strictEqual($('.dx-loadpanel-content').css('zIndex'), '3002', 'loadPanelContent.zIndex');
                } else {
                    assert.strictEqual($('.dx-loadpanel-wrapper').css('zIndex'), '3001', 'loadPanelWrapper.zIndex');
                    assert.strictEqual($('.dx-loadpanel-content').css('zIndex'), '3001', 'loadPanelContent.zIndex');
                }

                drawerTesters.checkShader(assert, env, { shader: '3500', panel: '3501' });
            } finally {
                dxOverlay.baseZIndex(prevBaseZIndex);
            }
        });
    });
});
