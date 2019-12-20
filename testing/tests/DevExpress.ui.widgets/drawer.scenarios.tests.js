import $ from 'jquery';
import { extend } from 'core/utils/extend';
import { drawerTesters } from '../../helpers/drawerHelpers.js';

import 'common.css!';

import dxDrawer from 'ui/drawer';

QUnit.testStart(() => {
    $('#qunit-fixture').html(drawerTesters.markup);
    // $("#qunit-tests").prepend(drawerTesters.markup);
});

// TODO: templateSize, minSize, maxSize, shading, scrolling, rtlEnabled, animationEnabled, onRendered, _viewPortChangeHandler, template overflow and/or view overflow
const configs = [];

['shrink', 'push', 'overlap'].forEach(openedStateMode => {
    ['left', 'top', 'right'].forEach(position => {
        ['slide', 'expand'].forEach(revealMode => {
            configs.push({ openedStateMode, position, revealMode });
        });
    });
});

configs.forEach(config => {
    QUnit.module(`Scenarios (${config.openedStateMode}, ${config.position}, ${config.revealMode})`, {
        beforeEach() {
            this.clock = sinon.useFakeTimers();
        },
        afterEach() {
            this.clock.restore();
            this.clock = undefined;
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
                shading: false,
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
    });
});
