import $ from 'jquery';
import { extend } from 'core/utils/extend';
import { isNumeric } from 'core/utils/type';
import { drawerTesters } from '../../helpers/drawerHelpers.js';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { clearStack } from 'ui/overlay/z_index';
import 'ui/file_manager';
import 'ui/color_box';
import 'ui/menu';
import 'ui/select_box';
import 'ui/tab_panel';
import 'ui/text_box';
import 'ui/tree_view';

import 'common.css!';
import 'generic_light.css!';

import dxDrawer from 'ui/drawer';

QUnit.testStart(() => {
    $('#qunit-fixture').html(drawerTesters.markup);
    // $('#qunit-tests').prepend(drawerTesters.markup);
});

// TODO: templateSize, maxSize, scrolling, rtlEnabled, animationEnabled, onRendered, _viewPortChangeHandler, target, template overflow and/or view overflow
const openedStateModes = ['shrink', 'push', 'overlap'];
const configs = [];
openedStateModes.forEach(openedStateMode => {
    ['left', 'top', 'right', 'bottom'].forEach(position => {
        ['slide', 'expand'].forEach(revealMode => {
            [true, false].forEach(shading => {
                [undefined, 25].forEach(minSize => {
                    configs.push({ openedStateMode, position, revealMode, shading, minSize });
                });
            });
        });
    });
});

QUnit.module('zIndex conflicts', {
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
    openedStateModes.forEach(openedStateMode => {
        function checkShaderZIndex(assert) {
            const $drawer = $('#' + drawerTesters.drawerElementId).dxDrawer({
                shading: true, opened: true, width: 600, height: 600, position: 'left',
                openedStateMode: openedStateMode,
                template: function() {
                    return $('<div>').width(100).css('background-color', 'aqua').css('height', '100%');
                }
            });

            const $shader = $drawer.find('.dx-drawer-shader');
            const shaderZIndex = window.getComputedStyle($shader[0]).zIndex;
            if(!isNumeric(shaderZIndex)) {
                assert.ok(false, `test is designed for shader ZIndex numeric value but '${shaderZIndex}' was found. Redesign this test for another approach.`);
            }

            let recursionLevel = 0;
            const recursiveCheckZIndex = ($element) => {
                const currentElementStyle = getComputedStyle($element[0]);
                const currentElementRect = $element[0].getBoundingClientRect();
                if(recursionLevel > 100 || currentElementStyle.display === 'none' || currentElementRect.width === 0 || currentElementRect.height === 0 || $element.hasClass('dx-drawer-panel-content')) {
                    return;
                }
                if(isNumeric(currentElementStyle.zIndex) && Number(currentElementStyle.zIndex) > Number(shaderZIndex)) {
                    assert.ok(false, `shader has '${shaderZIndex}' z-index but there z-index is greater: ${$element.prop('tagName')}(z-Index: ${currentElementStyle.zIndex}, id:${$element.attr('id')})`);
                }
                recursionLevel++;
                $element.children().each((_, child) => recursiveCheckZIndex($(child)));
                recursionLevel--;
            };
            recursiveCheckZIndex($($drawer.find('#view')));
            assert.ok(true, 'one assert to fit the "at least one assertion" rule');
        }

        QUnit.test(`(${openedStateMode}) ColorBox_inner`, function(assert) {
            $('<div>').appendTo('#view').dxColorBox({
                value: '#f05b41'
            });

            checkShaderZIndex(assert);
        });

        QUnit.test(`(${openedStateMode}) DataGrid_inner`, function(assert) {
            $('<div>').appendTo('#view').dxDataGrid({
                editing: { mode: 'row', allowUpdating: true }, dataSource: [{ date: new Date(2010, 10, 10), str: 'qwe' }]
            });

            checkShaderZIndex(assert);
        });

        QUnit.test(`(${openedStateMode}) FileManager_inner`, function(assert) {
            $('<div>').appendTo('#view').dxFileManager({
                currentPath: 'Documents/Projects',
                fileSystemProvider: [
                    {
                        name: 'Documents', isDirectory: true,
                        items: [
                            {
                                name: 'Projects', isDirectory: true,
                                items: [ { name: 'About.rtf' }, { name: 'Passwords.rtf' } ]
                            }
                        ]
                    }
                ],
                height: 300,
                width: 300,
                permissions: { create: true, copy: true, move: true, delete: true, rename: true, upload: true, download: true }
            });

            this.clock.tick(400);
            checkShaderZIndex(assert);
        });

        QUnit.test(`(${openedStateMode}) Menu_inner`, function(assert) {
            $('<div>').appendTo('#view').dxMenu({
                dataSource: [{ text: 'item1', items: [{ text: 'item1/item1' }, { text: 'item1/item2' }] }]
            });

            checkShaderZIndex(assert);
        });

        QUnit.test(`(${openedStateMode}) SelectBox_inner`, function(assert) {
            $('<div>').appendTo('#view').dxSelectBox({
                dataSource: ['item1', 'item2']
            });

            checkShaderZIndex(assert);
        });

        QUnit.test(`(${openedStateMode}) TabPanel_inner`, function(assert) {
            $('<div>').appendTo('#view').dxTabPanel({
                selectedIndex: 1,
                items: [{ title: 'Tab1', text: 'This is Tab1' }, { title: 'Tab2', text: 'This is Tab2' }, { title: 'Tab3', text: 'This is Tab3' }]
            });

            checkShaderZIndex(assert);
        });

        QUnit.test(`(${openedStateMode}) TextBox_inner`, function(assert) {
            $('<div>').appendTo('#view').dxTextBox({
                value: 'value'
            });

            checkShaderZIndex(assert);
        });

        QUnit.test(`(${openedStateMode}) TreeView_inner`, function(assert) {
            $('<div>').appendTo('#view').dxTreeView({
                showCheckBoxesMode: 'normal',
                items: [{
                    id: '1', text: 'item1', expanded: true,
                    items: [{
                        id: '11', text: 'item1_1', expanded: true,
                        items: [{
                            id: '111', text: 'item1_1_1', expanded: true
                        }]
                    }]
                }]
            });

            checkShaderZIndex(assert);
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
            const isPosition = Array.isArray(position) ? (position.indexOf(config.position) >= 0) : (config.position === position || !position);
            const isRevealMode = Array.isArray(revealMode) ? (revealMode.indexOf(config.revealMode) >= 0) : (config.revealMode === revealMode || !revealMode);
            return config.openedStateMode === openedStateMode && isPosition && isRevealMode;
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

        testOrSkip('opened: false', () => configIs('overlap', 'right', 'expand'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);

            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[config.position].template,
                __debugWhenPanelContentRendered: (e) => {
                    if(!(configIs('overlap', ['right', 'top', 'bottom', ], ['expand', 'slide']) && config.minSize)) {
                        drawerTesters[config.position].checkWhenPanelContentRendered(assert, e.drawer, drawerElement, document.getElementById('template'), config.minSize);
                    }
                }
            }));

            this.clock.tick(100);

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false -> opened: true', () => configIs('overlap', 'right', 'expand'), function(assert) {
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

        testOrSkip('opened: false -> opened: true, forceTemplateWrapper', () => configIs('overlap', 'right', 'expand'), function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[config.position].template(true)
            }));

            this.clock.tick(100);
            drawer.option('opened', true);
            this.clock.tick(100);

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        testOrSkip('opened: false, visible: false -> visible: true', () => configIs('overlap') && config.minSize, function(assert) {
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

        testOrSkip('opened: false, visible: false -> visible: true -> opened: true', () => configIs('overlap'), function(assert) {
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

        QUnit.test('opened: true', function(assert) {
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

        [true, false].forEach((closeOnOutsideClick) => {
            testOrSkip(`opened: true -> click by viewContent, closeOnOutsideClick: ${closeOnOutsideClick}`, () => configIs('overlap', 'right', 'expand') && !config.minSize && closeOnOutsideClick, function(assert) {
                const drawerElement = document.getElementById(drawerTesters.drawerElementId);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    closeOnOutsideClick: closeOnOutsideClick,
                    template: drawerTesters[config.position].template
                }));

                this.clock.tick(100);
                $(drawer.viewContent()).trigger('dxclick');
                this.clock.tick(100);

                if(closeOnOutsideClick) {
                    drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
                } else {
                    drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
                }
            });
        });

        QUnit.test('opened: true -> visible: false -> visible: true', function(assert) {
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

        QUnit.test(`opened: true, shading: ${config.shading} -> shading: ${!config.shading}`, function(assert) {
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

        QUnit.test('opened: true -> repaint', function(assert) {
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

        testOrSkip('opened: false -> resize -> opened: true, update position config after resize', () => configIs('overlap', 'bottom'), function(assert) {
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

        testOrSkip('opened: true (template + onRendered)', () => configIs('overlap', 'right', 'expand') || configIs('overlap', 'bottom'), function(assert) {
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

        testOverlap('opened: true (T813710: template + rendered + _viewPortChangeHandler)', () => configIs(undefined, 'right') || configIs('overlap', 'bottom'), function(assert) {
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

        testOrSkip('opened: true, visible: false -> visible: true', () => configIs('overlap'), function(assert) {
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

        testOrSkip('opened: true, visible: false -> repaint -> visible: true', () => configIs('overlap'), function(assert) {
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

const changeOpenedStateModeConfigs = [];
['slide', 'expand'].forEach(revealMode => {
    [undefined, 25].forEach(minSize => {
        ['left', 'top', 'right', 'bottom'].forEach(position => {
            changeOpenedStateModeConfigs.push({ position, revealMode, minSize });
        });
    });
});

changeOpenedStateModeConfigs.forEach(config => {
    function getFullDrawerOptions(targetOptions) {
        return extend(
            { rtlEnabled: false, animationEnabled: false, shading: false, template: drawerTesters[config.position].template },
            config, targetOptions);
    }

    QUnit.module(`Change openedStateMode (position: ${config.position}, revealMode: ${config.revealMode}, minSize: ${config.minSize})`, {
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
        QUnit.test('opened: false, push -> shrink', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, push -> overlap', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, shrink -> push', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'push');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, shrink -> overlap', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, overlap -> shrink', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'overlap',
                opened: false
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, overlap -> push', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'overlap',
                opened: false
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'push');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        // ================

        QUnit.test('opened: true, push -> shrink', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: true,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, push -> overlap', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, shrink -> push', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'push');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, shrink -> overlap', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, overlap -> shrink', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'overlap',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, overlap -> push', function(assert) {
            const drawerElement = document.getElementById(drawerTesters.drawerElementId);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'overlap',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'push');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });
    });
});
