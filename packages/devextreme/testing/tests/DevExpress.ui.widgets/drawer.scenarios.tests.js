import $ from 'jquery';
import { extend } from 'core/utils/extend';
import { isNumeric } from 'core/utils/type';
import { drawerTesters } from '../../helpers/drawerHelpers.js';
import resizeCallbacks from 'core/utils/resize_callbacks';
import { clearStack } from '__internal/ui/overlay/z_index';
import 'ui/file_manager';
import 'ui/color_box';
import 'ui/menu';
import 'ui/select_box';
import 'ui/tab_panel';
import 'ui/text_box';
import 'ui/tree_view';

import 'fluent_blue_light.css!';

import dxDrawer from 'ui/drawer';
import fx from 'common/core/animation/fx';

const moduleConfig = {
    beforeEach: function() {
        this.$fixture = $('#qunit-fixture');
        this.$element = $(`<div id="${drawerTesters.drawerElementId}"></div>`).css({
            width: '200px',
            height: '100px',
            'background-color': 'blue',
        }).append(
            $('<div id="view">view</div>').css({
                width: '100%',
                height: '100%',
                'background-color': 'yellow',
            })
        );
        this.$fixture.html(this.$element);
        this.clock = sinon.useFakeTimers();
        clearStack();
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
        this.$element.dxDrawer('instance').dispose();
        this.$element.remove();
        delete this.$element;
        this.clock.restore();
        this.clock = undefined;
        clearStack();
    }
};

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

const baseConfigs = [];
openedStateModes.forEach(openedStateMode => {
    ['left', 'top', 'right', 'bottom'].forEach(position => {
        baseConfigs.push({ openedStateMode, position });
    });
});


QUnit.module('zIndex conflicts', moduleConfig, () => {
    openedStateModes.forEach(openedStateMode => {
        function checkShaderZIndex($drawer) {
            $drawer.dxDrawer({
                shading: true, opened: true, width: 600, height: 600, position: 'left',
                openedStateMode: openedStateMode,
                template: function() {
                    return $('<div>').width(100).css('background-color', 'aqua').css('height', '100%');
                }
            });

            const $shader = $drawer.find('.dx-drawer-shader');
            const shaderZIndex = window.getComputedStyle($shader[0]).zIndex;
            if(!isNumeric(shaderZIndex)) {
                QUnit.assert.ok(false, `test is designed for shader ZIndex numeric value but '${shaderZIndex}' was found. Redesign this test for another approach.`);
            }

            let recursionLevel = 0;
            const recursiveCheckZIndex = ($element) => {
                const currentElementStyle = getComputedStyle($element[0]);
                const currentElementRect = $element[0].getBoundingClientRect();
                if(recursionLevel > 100 || currentElementStyle.display === 'none' || currentElementRect.width === 0 || currentElementRect.height === 0 || $element.hasClass('dx-drawer-panel-content')) {
                    return;
                }
                if(isNumeric(currentElementStyle.zIndex) && Number(currentElementStyle.zIndex) > Number(shaderZIndex)) {
                    QUnit.assert.ok(false, `shader has '${shaderZIndex}' z-index but there z-index is greater: ${$element.prop('tagName')}(z-Index: ${currentElementStyle.zIndex}, id:${$element.attr('id')})`);
                }
                recursionLevel++;
                $element.children().each((_, child) => recursiveCheckZIndex($(child)));
                recursionLevel--;
            };
            recursiveCheckZIndex($drawer.find('#view'));
            QUnit.assert.ok(true, 'one assert to fit the "at least one assertion" rule');
        }

        QUnit.test(`(${openedStateMode}) ColorBox_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxColorBox({
                value: '#f05b41'
            });

            checkShaderZIndex(this.$element);
        });

        QUnit.test(`(${openedStateMode}) DataGrid_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxDataGrid({
                editing: { mode: 'row', allowUpdating: true }, dataSource: [{ date: new Date(2010, 10, 10), str: 'qwe' }]
            });

            checkShaderZIndex(this.$element);
        });

        QUnit.test(`(${openedStateMode}) FileManager_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxFileManager({
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
            checkShaderZIndex(this.$element);
        });

        QUnit.test(`(${openedStateMode}) Menu_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxMenu({
                dataSource: [{ text: 'item1', items: [{ text: 'item1/item1' }, { text: 'item1/item2' }] }]
            });

            checkShaderZIndex(this.$element);
        });

        QUnit.test(`(${openedStateMode}) SelectBox_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxSelectBox({
                dataSource: ['item1', 'item2']
            });

            checkShaderZIndex(this.$element);
        });

        QUnit.test(`(${openedStateMode}) TabPanel_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxTabPanel({
                selectedIndex: 1,
                items: [{ title: 'Tab1', text: 'This is Tab1' }, { title: 'Tab2', text: 'This is Tab2' }, { title: 'Tab3', text: 'This is Tab3' }]
            });

            checkShaderZIndex(this.$element);
        });

        QUnit.test(`(${openedStateMode}) TextBox_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxTextBox({
                value: 'value'
            });

            checkShaderZIndex(this.$element);
        });

        QUnit.test(`(${openedStateMode}) TreeView_inner`, function(assert) {
            const $view = this.$element.find('#view');
            $('<div>').appendTo($view).dxTreeView({
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

            checkShaderZIndex(this.$element);
        });
    });
});

baseConfigs.forEach(baseConfig => {
    QUnit.module(`Scenarios (${baseConfig.openedStateMode}, ${baseConfig.position})`, moduleConfig, () => {
        function getFullDrawerOptions(targetOptions) {
            return extend({ rtlEnabled: false, animationEnabled: false }, baseConfig, targetOptions);
        }

        function configIs(openedStateMode, position) {
            const isOpenedStateMode = Array.isArray(openedStateMode) ? (openedStateMode.indexOf(baseConfig.openedStateMode) >= 0) : (!openedStateMode || baseConfig.openedStateMode === openedStateMode);
            const isPosition = Array.isArray(position) ? (position.indexOf(baseConfig.position) >= 0) : (!position || baseConfig.position === position);
            return isOpenedStateMode && isPosition;
        }

        [undefined, 25].forEach(minSize => {
            QUnit.test('opened: false', function(assert) {
                const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);

                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: false,
                    minSize,
                    template: drawerTesters[baseConfig.position].template,
                    __debugWhenPanelContentRendered: (e) => {
                        if(!(configIs('overlap', ['right', 'top', 'bottom', ]) && minSize)) {
                            drawerTesters[baseConfig.position].checkWhenPanelContentRendered(assert, e.drawer, drawerElement, $('#template').get(0), minSize);
                        }
                    }
                }));

                this.clock.tick(100);

                drawerTesters[baseConfig.position].checkHidden(assert, drawer, drawerElement);
            });
        });

        QUnit.test('opened: false -> minSize: 0', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);

            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[baseConfig.position].template,
            }));

            this.clock.tick(100);
            drawer.option('minSize', 0);
            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false -> minSize: null', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);

            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[baseConfig.position].template,
            }));

            this.clock.tick(100);
            drawer.option('minSize', null);
            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false -> minSize: 30', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);

            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                template: drawerTesters[baseConfig.position].template,
            }));

            this.clock.tick(100);
            drawer.option('minSize', 30);
            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkHidden(assert, drawer, drawerElement);
        });

        ['slide', 'expand'].forEach(revealMode => {
            [undefined, 25].forEach(minSize => {
                QUnit.test(`(revealMode: ${revealMode}, minSize: ${minSize}) opened: false -> opened: true`, function(assert) {
                    const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
                    const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                        opened: false,
                        revealMode,
                        minSize,
                        template: drawerTesters[baseConfig.position].template()
                    }));

                    this.clock.tick(100);
                    drawer.option('opened', true);
                    this.clock.tick(100);

                    drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
                });
            });

            QUnit.test(`(revealMode: ${revealMode}) opened: false, visible: false -> visible: true -> opened: true`, function(assert) {
                const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: false,
                    revealMode,
                    visible: false,
                    template: drawerTesters[baseConfig.position].template
                }));

                this.clock.tick(100);
                drawer.option('visible', true);
                this.clock.tick(100);
                drawer.option('opened', true);
                this.clock.tick(100);

                if(!configIs('overlap')) {
                    drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
                } else {
                    assert.strictEqual(drawer._overlay.option('visible'), true, 'panel is opened');
                }
            });


            QUnit.test(`(revealMode: ${revealMode}) opened: true -> repaint`, function(assert) {
                const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    template: drawerTesters[baseConfig.position].template,
                }));

                this.clock.tick(100);
                drawer.repaint();
                this.clock.tick(100);

                drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
            });

            QUnit.test(`(revealMode: ${revealMode}) opened: false -> resize -> opened: true, update position config after resize`, function(assert) {
                const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: false,
                    template: drawerTesters[baseConfig.position].template
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

                drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
            });
        });

        QUnit.test('opened: false, visible: false -> visible: true', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: false,
                visible: false,
                template: drawerTesters[baseConfig.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', true);
            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[baseConfig.position].template,
            }));

            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true -> visible: false', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[baseConfig.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', false);
            this.clock.tick(100);

            assert.strictEqual(drawer.option('visible'), false, 'option(visible)');
            assert.strictEqual(window.getComputedStyle(drawerElement).display, 'none', 'drawerElement.display');
        });

        [true, false].forEach((closeOnOutsideClick) => {
            QUnit.test(`opened: true -> click by viewContent, closeOnOutsideClick: ${closeOnOutsideClick}`, function(assert) {
                const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    closeOnOutsideClick: closeOnOutsideClick,
                    template: drawerTesters[baseConfig.position].template
                }));

                this.clock.tick(100);
                $(drawer.viewContent()).trigger('dxclick');
                this.clock.tick(100);

                if(closeOnOutsideClick) {
                    drawerTesters[baseConfig.position].checkHidden(assert, drawer, drawerElement);
                } else {
                    drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
                }
            });
        });

        QUnit.test('opened: true -> visible: false -> visible: true', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                template: drawerTesters[baseConfig.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', false);
            this.clock.tick(100);
            drawer.option('visible', true);
            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
        });

        [true, false].forEach(shading => {
            QUnit.test(`opened: true, shading: ${shading} -> shading: ${!shading}`, function(assert) {
                const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
                const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                    opened: true,
                    shading,
                    template: drawerTesters[baseConfig.position].template
                }));

                this.clock.tick(100);
                drawer.option('shading', !shading);
                this.clock.tick(100);

                drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
            });
        });

        QUnit.test('opened: true (template + onRendered)', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
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
                                $(data.container).append(drawerTesters[baseConfig.position].template);
                                data.onRendered();
                            }
                        }
                    }
                },
            }));

            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true (T813710: template + rendered + _viewPortChangeHandler)', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                visible: true,
                template: 'template1',
                templatesRenderAsynchronously: true,
                templateSize: drawerTesters[baseConfig.position].templateSize,
                integrationOptions: {
                    templates: {
                        template1: {
                            render(data) {
                                Promise.resolve().then(() => {
                                    drawer.getOverlay()._viewPortChangeHandler();
                                });
                                $(data.container).append($(drawerTesters[baseConfig.position].template()));
                                data.onRendered();
                            }
                        }
                    }
                },
            }));

            this.clock.tick(100);

            drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, visible: false -> visible: true', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                visible: false,
                template: drawerTesters[baseConfig.position].template
            }));

            this.clock.tick(100);
            drawer.option('visible', true);
            this.clock.tick(100);

            if(!configIs('overlap')) {
                drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
            } else {
                assert.strictEqual(drawer._overlay.option('visible'), true, 'panel is opened');
            }
        });

        QUnit.test('opened: true, visible: false -> repaint -> visible: true', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                opened: true,
                visible: false,
                template: drawerTesters[baseConfig.position].template
            }));

            this.clock.tick(100);
            drawer.repaint();
            this.clock.tick(100);

            drawer.option('visible', true);
            this.clock.tick(100);

            if(!configIs('overlap')) {
                drawerTesters[baseConfig.position].checkOpened(assert, drawer, drawerElement);
            } else {
                assert.strictEqual(drawer._overlay.option('visible'), true, 'panel is opened');
            }
        });
    });
});

const changeOpenedStateModeConfigs = [];
['slide', 'expand'].forEach(revealMode => {
    [undefined, 25].forEach(minSize => {
        ['left', 'top', 'right', 'bottom'].forEach(position => {
            // TODO: templateSize, maxSize, scrolling, rtlEnabled, animationEnabled, onRendered, _viewPortChangeHandler, template overflow and/or view overflow
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

    QUnit.module(`Change openedStateMode (position: ${config.position}, revealMode: ${config.revealMode}, minSize: ${config.minSize})`, moduleConfig, () => {
        QUnit.test('opened: false, push -> shrink', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, push -> overlap', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, shrink -> push', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'push');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, shrink -> overlap', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: false,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, overlap -> shrink', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'overlap',
                opened: false
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkHidden(assert, drawer, drawerElement);
        });

        QUnit.test('opened: false, overlap -> push', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
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
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: true,
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, push -> overlap', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'push',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, shrink -> push', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'push');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, shrink -> overlap', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'shrink',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'overlap');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, overlap -> shrink', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
            const drawer = new dxDrawer(drawerElement, getFullDrawerOptions({
                openedStateMode: 'overlap',
                opened: true
            }));

            this.clock.tick(100);
            drawer.option('openedStateMode', 'shrink');

            drawerTesters[config.position].checkOpened(assert, drawer, drawerElement);
        });

        QUnit.test('opened: true, overlap -> push', function(assert) {
            const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);
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

QUnit.module('Scenarios', moduleConfig, () => {
    QUnit.test('push, left, opened: false, hidden child, AngularJS, T956751', function(assert) {
        const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);

        const drawer = new dxDrawer(drawerElement, {
            openedStateMode: 'shrink',
            position: 'left',
            template: () =>
                $('<div id="template" data-options="dxTemplate: {name: \'chartDrawerTemplate\'}" class="dx-template-wrapper ng-scope">').append([
                    $('<div></div>').css({
                        width: '150px',
                        display: 'none !important',
                    }),
                    $('<div></div>').css({
                        width: '150px',
                        height: '100px',
                    })
                ]),
            opened: false,
        });

        this.clock.tick(100);
        drawerTesters['left'].checkHidden(assert, drawer, drawerElement);
    });

    QUnit.test('overlay, left, opened: false, Angular, T948509', function(assert) {
        const drawerElement = $('#' + drawerTesters.drawerElementId).get(0);

        const drawer = new dxDrawer(drawerElement, {
            openedStateMode: 'overlap',
            position: 'left',
            template: () => $('<div _ngcontent-qhr-c357="" class="dx-template-wrapper">').append(
                $('<div></div>').css({
                    width: '150px',
                    height: '100px',
                })
            ),
            opened: false,
        });

        this.clock.tick(100);
        drawerTesters['left'].checkHidden(assert, drawer, drawerElement);
    });
});
