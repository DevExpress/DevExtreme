import $ from 'jquery';
import { drawerTesters } from '../../helpers/drawerHelpers.js';
import { clearStack } from 'ui/overlay/z_index';

import 'common.css!';

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

        testOrSkip('opened: false', () => (config.openedStateMode === 'push' && config.position === 'top'), function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: false
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);

            drawerTester.checkHidden();
        });

        testOrSkip('opened: false -> opened: true', () => config.openedStateMode === 'push' && config.position === 'top', function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: true
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.option('opened', true);
            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        testOrSkip('opened: false, visible: false -> visible: true', () => config.openedStateMode === 'shrink' || (config.openedStateMode === 'push' && config.position === 'top'), function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: false,
                visible: false
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.option('visible', true);
            this.clock.tick(100);

            drawerTester.checkHidden();
        });

        testOrSkip('opened: false, visible: false -> visible: true -> opened: true', () => config.openedStateMode === 'overlap' || (config.openedStateMode === 'push' && config.position === 'top'), function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: false,
                visible: false
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.option('visible', true);
            this.clock.tick(100);
            drawerTester.drawer.option('opened', true);
            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        testOrSkip('opened: true', () => config.openedStateMode === 'push' && config.position === 'top', function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: true
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        QUnit.test('opened: true -> visible: false', function(assert) {
            const drawerTester = new drawerTesters[config.position]({
                opened: true
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.option('visible', false);
            this.clock.tick(100);

            assert.strictEqual(drawerTester.drawer.option('visible'), false, 'option(visible)');
            assert.strictEqual(window.getComputedStyle(drawerTester.drawerElement()).display, 'none', 'drawerElement.display');
        });

        testOrSkip('opened: true -> visible: false -> visible: true', () => config.openedStateMode === 'push' && config.position === 'top', function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: true
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.option('visible', false);
            this.clock.tick(100);
            drawerTester.drawer.option('visible', true);
            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        testOrSkip('opened: true -> repaint', () => config.openedStateMode === 'push' && config.position === 'top', function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: true
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.repaint();
            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        testOrSkip('opened: true (template + onRendered)', () => config.openedStateMode === 'push' && config.position === 'top' || (config.openedStateMode === 'overlap' && config.position === 'right' && config.revealMode === 'expand'), function() {
            const drawerTester = new drawerTesters[config.position]({
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
                                $(data.container).append(drawerTester.getTemplate());
                                data.onRendered();
                            }
                        }
                    }
                }
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        testOverlap('opened: true (T813710: template + rendered + _viewPortChangeHandler)', () => config.position === 'right', function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: true,
                visible: true,
                template: 'template1',
                templatesRenderAsynchronously: true,
                templateSize: drawerTesters[config.position].templateSize,
                integrationOptions: {
                    templates: {
                        template1: {
                            render(data) {
                                drawerTester.drawer.getOverlay()._viewPortChangeHandler();
                                $(data.container).append($(drawerTester.getTemplate()));
                                data.onRendered();
                            }
                        }
                    }
                }
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        testOrSkip('opened: true, visible: false -> visible: true', () => config.openedStateMode === 'overlap' || config.openedStateMode === 'push', function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: true,
                visible: false
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.option('visible', true);
            this.clock.tick(100);

            drawerTester.checkOpened();
        });

        testOrSkip('opened: true, visible: false -> repaint', () => config.openedStateMode === 'shrink' || config.openedStateMode === 'overlap' || config.openedStateMode === 'push', function() {
            const drawerTester = new drawerTesters[config.position]({
                opened: true,
                visible: false
            });
            drawerTester.initializeDrawer(config);

            this.clock.tick(100);
            drawerTester.drawer.repaint();
            this.clock.tick(100);

            drawerTester.checkOpened();
        });
    });
});
