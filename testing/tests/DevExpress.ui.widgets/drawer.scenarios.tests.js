import $ from "jquery";
import { extend } from "core/utils/extend";
import { drawerTesters } from "../../helpers/drawerHelpers.js";

import "common.css!";

import dxDrawer from "ui/drawer";

QUnit.testStart(() => {
    $("#qunit-fixture").html(drawerTesters.markup);
    // $("#qunit-tests").prepend(drawerTesters.markup);
});

// TODO: templateSize, minSize, maxSize, shading, scrolling, rtlEnabled, animationEnabled, onRendered, _viewPortChangeHandler, template overflow and/or view overflow

["shrink", "push", "overlap"].forEach(openedStateMode => {
    ["left", "top"].forEach(position => {

        QUnit.module(`Scenarios (${openedStateMode}, ${position})`, {
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
                    QUnit.skip(name + " - NOT SUPPORTED", function() {});
                } else {
                    QUnit.test(name, callback);
                }
            }

            function testOverlap(name, callback) {
                if(openedStateMode === "overlap") {
                    QUnit.test(name, callback);
                }
            }

            function getFullDrawerOptions(targetOptions) {
                const defaultOptions = {
                    revealMode: "slide",
                    rtlEnabled: false,
                    shading: false,
                    animationEnabled: false,
                    openedStateMode: openedStateMode,
                    position: position,
                };
                return extend(defaultOptions, targetOptions);
            }

            testOrSkip(`opened: false`, () => (openedStateMode === "push" && position === "top"), function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: false,
                    template: drawerTesters[position].template,
                }));

                this.clock.tick(100);

                drawerTesters[position].checkHidden(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: false -> opened: true`, () => openedStateMode === "push" && position === "top", function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    template: drawerTesters[position].template()
                }));

                this.clock.tick(100);
                drawer.option("opened", true);
                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: false, visible: false -> visible: true`, () => openedStateMode === "shrink" || (openedStateMode === "push" && position === "top"), function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: false,
                    visible: false,
                    template: drawerTesters[position].template
                }));

                this.clock.tick(100);
                drawer.option("visible", true);
                this.clock.tick(100);

                drawerTesters[position].checkHidden(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: false, visible: false -> visible: true -> opened: true`, () => openedStateMode === "overlap" || (openedStateMode === "push" && position === "top"), function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: false,
                    visible: false,
                    template: drawerTesters[position].template
                }));

                this.clock.tick(100);
                drawer.option("visible", true);
                this.clock.tick(100);
                drawer.option("opened", true);
                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: true`, () => openedStateMode === "push" && position === "top", function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    template: drawerTesters[position].template,
                }));

                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            QUnit.test(`opened: true -> visible: false`, function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    template: drawerTesters[position].template
                }));

                this.clock.tick(100);
                drawer.option("visible", false);
                this.clock.tick(100);

                assert.strictEqual(drawer.option("visible"), false, "option(visible)");
                assert.strictEqual(window.getComputedStyle(drawerElement).display, "none", "drawerElement.display");
            });

            testOrSkip(`opened: true -> visible: false -> visible: true`, () => openedStateMode === "push" && position === "top", function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    template: drawerTesters[position].template
                }));

                this.clock.tick(100);
                drawer.option("visible", false);
                this.clock.tick(100);
                drawer.option("visible", true);
                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: true -> repaint`, () => openedStateMode === "push" && position === "top", function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    template: drawerTesters[position].template,
                }));

                this.clock.tick(100);
                drawer.repaint();
                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: true (template + onRendered)`, () => openedStateMode === "push" && position === "top", function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    width: 200,
                    height: 100,
                    opened: true,
                    visible: true,
                    template: "template1",
                    templatesRenderAsynchronously: true,
                    integrationOptions: {
                        templates: {
                            template1: {
                                render(data) {
                                    $(data.container).append(drawerTesters[position].template);
                                    data.onRendered();
                                }
                            }
                        }
                    },
                }));

                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            testOverlap(`opened: true (T813710: template + rendered + _viewPortChangeHandler)`, function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    visible: true,
                    template: "template1",
                    templatesRenderAsynchronously: true,
                    templateSize: drawerTesters[position].templateSize,
                    integrationOptions: {
                        templates: {
                            template1: {
                                render(data) {
                                    drawer.getOverlay()._viewPortChangeHandler();
                                    $(data.container).append($(drawerTesters[position].template()));
                                    data.onRendered();
                                }
                            }
                        }
                    },
                }));

                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: true, visible: false -> visible: true`, () => openedStateMode === "overlap" || openedStateMode === "push", function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    visible: false,
                    template: drawerTesters[position].template
                }));

                this.clock.tick(100);
                drawer.option("visible", true);
                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });

            testOrSkip(`opened: true, visible: false -> repaint`, () => openedStateMode === "shrink" || openedStateMode === "overlap" || openedStateMode === "push", function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    visible: false,
                    template: drawerTesters[position].template
                }));

                this.clock.tick(100);
                drawer.repaint();
                this.clock.tick(100);

                drawerTesters[position].checkOpened(assert, drawer, drawerElement, openedStateMode);
            });
        });
    });
});
