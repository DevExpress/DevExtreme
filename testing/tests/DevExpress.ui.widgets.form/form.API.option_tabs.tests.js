import $ from 'jquery';
import 'ui/form/ui.form';

import 'common.css!';
import 'generic_light.css!';

const { testStart, test, module, assert } = QUnit;

testStart(function() {
    const markup = '<div id="form"></div>';
    $('#qunit-fixture').html(markup);
});

class FormTestWrapper {
    constructor(options) {
        this._form = $('#form').dxForm(options || {
            items: [{
                itemType: 'tabbed',
                name: 'tabbedItem',
                tabs: [{
                    title: 'title0',
                    items: ['name']
                }, {
                    title: 'title1',
                    items: ['lastName']
                }]
            }]
        }).dxForm('instance');
        this._contentReadyStub = sinon.stub();
        this._form.on('contentReady', this._contentReadyStub);
    }

    _getTabsTextsElements() {
        return this._form.$element().find('.dx-tab-content .dx-tab-text');
    }

    _getMultiViewItemsElements() {
        return this._form.$element().find('.dx-item .dx-multiview-item');
    }

    setOption(optionName, value) {
        this._form.option(optionName, value);
    }

    setItemOption() {
        this._form.itemOption.apply(this._form, arguments);
    }

    selectTab(tabIndex) {
        $('.dx-tabpanel').dxTabPanel('instance').option('selectedIndex', tabIndex);
    }

    checkFormsReRender() {
        assert.equal(this._contentReadyStub.callCount, 0, 'form is rendered once');
        this._contentReadyStub.reset();
    }

    checkTabBadge(tabIndex, expectedText) {
        assert.equal($('.dx-tabs-item-badge').eq(tabIndex).text(), expectedText, `${tabIndex} tab badge`);
    }

    checkTabDisabled(tabIndex, expectedValue) {
        const $tabItems = $('.dx-tab');
        assert.equal($tabItems.eq(tabIndex).hasClass('dx-state-disabled'), expectedValue, `${tabIndex} tab disabled`);
    }

    checkTabIcon(tabIndex, expectedIcon) {
        const $icon = $('.dx-tab .dx-icon').eq(tabIndex);
        assert.ok($icon.hasClass(`dx-icon-${expectedIcon}`), `${tabIndex} tab icon`);
    }

    checkTabContentTemplate(tabIndex, $expectedTemplate) {
        const $multiViewItemContent = $('.dx-multiview-item-content').eq(tabIndex);
        assert.equal($multiViewItemContent.html(), $('<div>').append($expectedTemplate).html(), `${tabIndex} tab template`);
    }

    checkTabTemplate(tabIndex, $expectedTemplate) {
        const $multiViewItemContent = $('.dx-tab-content').eq(tabIndex);
        assert.equal($multiViewItemContent.html(), $('<div>').append($expectedTemplate).html(), `${tabIndex} tab template`);
    }

    checkTabTitle(tabIndex, expectedText) {
        const $title = this._getTabsTextsElements().eq(tabIndex);
        assert.strictEqual($title.text(), expectedText, `${tabIndex} tab title`);
    }

    checkTabsElements(expectedTabsCount) {
        const $tabs = this._getTabsTextsElements();
        assert.equal($tabs.length, expectedTabsCount, 'count of tabs elements');

        const $multiViewItems = this._getMultiViewItemsElements();
        assert.equal($multiViewItems.length, expectedTabsCount, 'count of multiview items elements');
    }

    checkTabOption(tabIndex, optionName, expected) {
        const value = this._form.option(`items[0].tabs[${tabIndex}].${optionName}`);
        assert.strictEqual(value, expected, `${optionName} of ${tabIndex} tab`);
    }

    checkEditorRendered(id, isEditorRendered) {
        const editor = this._form.getEditor(id);
        assert.equal(!!editor, isEditorRendered, `instance editor of ${id}`);
        if(editor && isEditorRendered) {
            assert.notOk(editor._disposed, `editor is not disposed of ${id}`);
        }
    }

    checkTabSelection(expectedSelectedIndex) {
        const $form = this._form.$element();
        const $tabs = $form.find('.dx-item.dx-tab');
        const $multiViewItem = $form.find('.dx-item.dx-multiview-item');
        assert.ok($tabs.eq(expectedSelectedIndex).hasClass('dx-tab-selected'), 'tab is selected');
        assert.ok($multiViewItem.eq(expectedSelectedIndex).hasClass('dx-item-selected'), 'multiview item is selected');
    }
}

module('Public API: option method', function() {
    test('Change the badge option', function() {
        const testWrapper = new FormTestWrapper();
        testWrapper.setOption('items[0].tabs[0].badge', 'TestBadge1');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabBadge(0, 'TestBadge1');

        testWrapper.setOption('items[0].tabs[1].badge', 'TestBadge2');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabBadge(1, 'TestBadge2');
    });

    test('Change the disabled option', function() {
        const testWrapper = new FormTestWrapper();
        testWrapper.setOption('items[0].tabs[0].disabled', true);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(0, true);

        testWrapper.setOption('items[0].tabs[1].disabled', true);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(1, true);

        testWrapper.setOption('items[0].tabs[0].disabled', false);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(0, false);

        testWrapper.setOption('items[0].tabs[1].disabled', false);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(1, false);
    });

    test('Change the icon option', function() {
        const testWrapper = new FormTestWrapper();

        testWrapper.setOption('items[0].tabs[0].icon', 'plus');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabIcon(0, 'plus');

        testWrapper.setOption('items[0].tabs[1].icon', 'trash');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabIcon(1, 'trash');
    });

    test('Change the template option', function() {
        const testWrapper = new FormTestWrapper();

        const template1 = '<div class=\'custom-template-1\'></div>';
        testWrapper.setOption('items[0].tabs[0].template', template1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabContentTemplate(0, $(template1));

        const template2 = '<div class=\'custom-template-2\'></div>';
        testWrapper.setOption('items[0].tabs[1].template', template2);
        testWrapper.selectTab(1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabContentTemplate(1, $(template2));
    });

    test('Change the tab template option', function() {
        const testWrapper = new FormTestWrapper();

        const template1 = '<div class=\'custom-tab-template-1\'></div>';
        testWrapper.setOption('items[0].tabs[0].tabTemplate', template1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTemplate(0, $(template1));

        const template2 = '<div class=\'custom-tab-template-2\'></div>';
        testWrapper.setOption('items[0].tabs[1].tabTemplate', template2);
        testWrapper.selectTab(1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTemplate(1, $(template2));
    });

    test('Change the title option', function() {
        const testWrapper = new FormTestWrapper();
        testWrapper.setOption('items[0].tabs[0].title', 'TestTitle1');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTitle(0, 'TestTitle1');

        testWrapper.setOption('items[0].tabs[1].title', 'TestTitle2');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTitle(1, 'TestTitle2');
    });

    test('Title is set correctly when it is changed on the onInitialized event', function() {
        const testWrapper = new FormTestWrapper({
            onInitialized: e => {
                e.component.option('items[0].tabs[0].title', 'New Title');
            },
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    items: ['name']
                }]
            }]
        });

        testWrapper.checkFormsReRender();
        testWrapper.checkTabTitle(0, 'New Title');
    });

    ['badge', 'icon', 'template', 'tabTemplate', 'title'].forEach(optionName => {
        test(`Change the ${optionName} of a tab when tabbed item is hidden via api`, function() {
            const testWrapper = new FormTestWrapper();

            testWrapper.setOption('items[0].visible', false);
            testWrapper.setOption(`items[0].tabs[0].${optionName}`, 'test');
            testWrapper.checkTabOption(0, optionName, 'test');
        });
    });

    [false, true].forEach(deferRendering => {
        [false, true].forEach(repaintChangesOnly => {
            test(`Add new tab to end, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['lastName']
                });

                testWrapper.setOption('items[0].tabs', tabs);

                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);
                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'title1');
                testWrapper.checkTabTitle(1, 'title2');

                testWrapper.selectTab(1);

                testWrapper.checkEditorRendered('name', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('lastName', true);
            });

            test(`Add new tab to start, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.unshift({
                    title: 'title0',
                    items: ['lastName']
                });

                testWrapper.setOption('items[0].tabs', tabs);
                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'title0');
                testWrapper.checkTabTitle(1, 'title1');

                testWrapper.checkEditorRendered('lastName', !repaintChangesOnly || !deferRendering);

                testWrapper.selectTab(1);

                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkTabSelection(1);
            });

            test(`Select last tab,remove last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            selectedIndex: 1,
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(1);

                tabs.splice(1, 1);
                testWrapper.setOption('items[0].tabs', tabs);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'title1');
                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkEditorRendered('lastName', false);

                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, remove last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.splice(1, 1);
                testWrapper.setOption('items[0].tabs', tabs);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'title1');
                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkEditorRendered('lastName', false);
                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, remove first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.splice(0, 1);
                testWrapper.setOption('items[0].tabs', tabs);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'title2');
                testWrapper.checkEditorRendered('name', false);

                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkTabSelection(0);
            });

            test(`Add new tabs with new items, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                testWrapper.setOption('items[0].tabs', [{
                    title: 'new title 1',
                    items: ['address']
                }, {
                    title: 'new title 2',
                    items: ['city']
                }]);

                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'new title 1');
                testWrapper.checkTabTitle(1, 'new title 2');
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkEditorRendered('lastName', false);

                testWrapper.checkEditorRendered('address', !deferRendering || !repaintChangesOnly);
                testWrapper.checkEditorRendered('city', repaintChangesOnly || !deferRendering);

                testWrapper.selectTab(1);

                testWrapper.checkEditorRendered('city', true);
                testWrapper.checkTabSelection(1);
            });

            test(`Select first tab, add new tab, remove first tab and change title for first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['lastName']
                });

                testWrapper.setOption('items[0].tabs', tabs);

                tabs.splice(0, 1);

                testWrapper.setOption('items[0].tabs', tabs);
                testWrapper.setOption('items[0].tabs[0].title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'updated title');
                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, add new tab, remove first tab and change title for last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setOption('items[0].tabs', tabs);

                tabs.splice(0, 1);

                testWrapper.setOption('items[0].tabs', tabs);
                testWrapper.setOption('items[0].tabs[1].title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(1, 'updated title');
                testWrapper.checkEditorRendered('lastName', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('address', repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);
            });

            test(`Select first tab, add new tab, remove last tab and change title for first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['lastName']
                });

                testWrapper.setOption('items[0].tabs', tabs);

                tabs.splice(1, 1);

                testWrapper.setOption('items[0].tabs', tabs);
                testWrapper.setOption('items[0].tabs[0].title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'updated title');
                testWrapper.checkEditorRendered('lastName', false);
                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, add new tab, remove last tab and change title for last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setOption('items[0].tabs', tabs);

                tabs.splice(2, 1);

                testWrapper.setOption('items[0].tabs', tabs);
                testWrapper.setOption('items[0].tabs[1].title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(1, 'updated title');
                testWrapper.checkEditorRendered('name', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('lastName', repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('address', false);
                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);
            });

            test(`Select last tab, add new tab, remove last tab and change title for first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            selectedIndex: 1,
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(1);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setOption('items[0].tabs', tabs);

                tabs.splice(2, 1);

                testWrapper.setOption('items[0].tabs', tabs);
                testWrapper.setOption('items[0].tabs[0].title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'updated title');
                testWrapper.checkEditorRendered('address', false);
                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkEditorRendered('name', !deferRendering);

                testWrapper.checkTabSelection(1);
            });

            test(`Select last tab, add new tab, remove last tab and change title for last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        tabPanelOptions: {
                            selectedIndex: 1,
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(1);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setOption('items[0].tabs', tabs);

                tabs.splice(2, 1);

                testWrapper.setOption('items[0].tabs', tabs);
                testWrapper.setOption('items[0].tabs[1].title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(1, 'updated title');
                testWrapper.checkEditorRendered('address', false);
                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkEditorRendered('name', !deferRendering);
                testWrapper.checkTabSelection(1);
            });

            test(`Select first tab, add new tab, select last tab, change title of last tab and change items for parent group, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'group',
                        items: [{
                            itemType: 'tabbed',
                            tabPanelOptions: {
                                repaintChangesOnly,
                                deferRendering
                            },
                            tabs
                        }]
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['address']
                });
                testWrapper.setOption('items[0].items[0].tabs', tabs);
                testWrapper.selectTab(1);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabSelection(1);
                testWrapper.checkEditorRendered('name', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('address', true);

                testWrapper.setOption('items[0].items[0].tabs[1].title', 'title1');
                testWrapper.setOption('items[0].items', ['city']);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(0);
                testWrapper.checkEditorRendered('city', true);
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkEditorRendered('address', false);
            });
        });
    });
});

module('Public API: itemOption method', function() {
    test('Change the badge option', function() {
        const testWrapper = new FormTestWrapper();
        testWrapper.setItemOption('tabbedItem.title0', 'badge', 'TestBadge1');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabBadge(0, 'TestBadge1');

        testWrapper.setItemOption('tabbedItem.title1', 'badge', 'TestBadge2');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabBadge(1, 'TestBadge2');
    });

    test('Change the disabled option', function() {
        const testWrapper = new FormTestWrapper();
        testWrapper.setItemOption('tabbedItem.title0', 'disabled', true);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(0, true);

        testWrapper.setItemOption('tabbedItem.title1', 'disabled', true);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(1, true);

        testWrapper.setItemOption('tabbedItem.title0', 'disabled', false);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(0, false);

        testWrapper.setItemOption('tabbedItem.title1', 'disabled', false);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabDisabled(1, false);
    });

    test('Change the icon option', function() {
        const testWrapper = new FormTestWrapper();

        testWrapper.setItemOption('tabbedItem.title0', 'icon', 'plus');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabIcon(0, 'plus');

        testWrapper.setItemOption('tabbedItem.title1', 'icon', 'trash');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabIcon(1, 'trash');
    });

    test('Change the template option', function() {
        const testWrapper = new FormTestWrapper();

        const template1 = '<div class=\'custom-template-1\'></div>';
        testWrapper.setItemOption('tabbedItem.title0', 'template', template1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabContentTemplate(0, $(template1));

        const template2 = '<div class=\'custom-template-2\'></div>';
        testWrapper.setItemOption('tabbedItem.title1', 'template', template2);
        testWrapper.selectTab(1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabContentTemplate(1, $(template2));
    });

    test('Change the tab template option', function() {
        const testWrapper = new FormTestWrapper();

        const template1 = '<div class=\'custom-tab-template-1\'></div>';
        testWrapper.setItemOption('tabbedItem.title0', 'tabTemplate', template1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTemplate(0, $(template1));

        const template2 = '<div class=\'custom-tab-template-2\'></div>';
        testWrapper.setItemOption('tabbedItem.title1', 'tabTemplate', template2);
        testWrapper.selectTab(1);
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTemplate(1, $(template2));
    });

    test('Change the title option', function() {
        const testWrapper = new FormTestWrapper();
        testWrapper.setItemOption('tabbedItem.title0', 'title', 'TestTitle1');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTitle(0, 'TestTitle1');

        testWrapper.setItemOption('tabbedItem.title1', 'title', 'TestTitle2');
        testWrapper.checkFormsReRender();
        testWrapper.checkTabTitle(1, 'TestTitle2');
    });

    test('Title is set correctly when it is changed on the onInitialized event', function() {
        const testWrapper = new FormTestWrapper({
            onInitialized: e => {
                e.component.itemOption('title1', 'title', 'New Title');
            },
            items: [{
                itemType: 'tabbed',
                tabs: [{
                    title: 'title1',
                    items: ['name']
                }]
            }]
        });

        testWrapper.checkFormsReRender();
        testWrapper.checkTabTitle(0, 'New Title');
    });

    ['badge', 'icon', 'template', 'tabTemplate', 'title'].forEach(optionName => {
        test(`Change the ${optionName} of a tab when tabbed item is hidden via api`, function() {
            const testWrapper = new FormTestWrapper();

            testWrapper.setItemOption('tabbedItem', 'visible', false);
            testWrapper.setItemOption('tabbedItem.title0', optionName, 'test');
            testWrapper.checkTabOption(0, optionName, 'test');
        });
    });

    [false, true].forEach(deferRendering => {
        [false, true].forEach(repaintChangesOnly => {
            test(`Add new tab to end, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['lastName']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);
                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'title1');
                testWrapper.checkTabTitle(1, 'title2');

                testWrapper.selectTab(1);

                testWrapper.checkEditorRendered('name', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('lastName', true);
            });

            test(`Add new tab to start, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.unshift({
                    title: 'title0',
                    items: ['lastName']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'title0');
                testWrapper.checkTabTitle(1, 'title1');

                testWrapper.checkEditorRendered('lastName', !repaintChangesOnly || !deferRendering);

                testWrapper.selectTab(1);

                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkTabSelection(1);
            });

            test(`Select last tab, Remove last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            selectedIndex: 1,
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(1);

                tabs.splice(1, 1);
                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'title1');
                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkEditorRendered('lastName', false);

                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, Remove last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.splice(1, 1);
                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'title1');
                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkEditorRendered('lastName', false);
                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, Remove first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.splice(0, 1);
                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'title2');
                testWrapper.checkEditorRendered('name', false);

                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkTabSelection(0);
            });

            test(`Add new tabs with new items, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                testWrapper.setItemOption('tabbedItem', 'tabs', [{
                    title: 'new title 1',
                    items: ['address']
                }, {
                    title: 'new title 2',
                    items: ['city']
                }]);

                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'new title 1');
                testWrapper.checkTabTitle(1, 'new title 2');
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkEditorRendered('lastName', false);

                testWrapper.checkEditorRendered('address', !deferRendering || !repaintChangesOnly);
                testWrapper.checkEditorRendered('city', repaintChangesOnly || !deferRendering);

                testWrapper.selectTab(1);

                testWrapper.checkEditorRendered('city', true);
                testWrapper.checkTabSelection(1);
            });

            test(`Select first tab, add new tab, remove first tab and change title for first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['lastName']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                tabs.splice(0, 1);

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.setItemOption('tabbedItem.title2', 'title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'updated title');
                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, add new tab, remove first tab and change title for last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                tabs.splice(0, 1);

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.setItemOption('tabbedItem.title3', 'title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(1, 'updated title');
                testWrapper.checkEditorRendered('lastName', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('address', repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);
            });

            test(`Select first tab, add new tab, remove last tab and change title for first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['lastName']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                tabs.splice(1, 1);

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.setItemOption('tabbedItem.title1', 'title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'updated title');
                testWrapper.checkEditorRendered('lastName', false);
                testWrapper.checkEditorRendered('name', true);
                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, add new tab, remove last tab and change title for last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                tabs.splice(2, 1);

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.setItemOption('tabbedItem.title2', 'title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(1, 'updated title');
                testWrapper.checkEditorRendered('name', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('lastName', repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('address', false);
                testWrapper.checkTabSelection(repaintChangesOnly ? 1 : 0);
            });

            test(`Select last tab, add new tab, remove last tab and change title for first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            selectedIndex: 1,
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(1);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                tabs.splice(2, 1);

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.setItemOption('tabbedItem.title1', 'title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(0, 'updated title');
                testWrapper.checkEditorRendered('address', false);
                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkEditorRendered('name', !deferRendering);

                testWrapper.checkTabSelection(1);
            });

            test(`Select last tab, add new tab, remove last tab and change title for last tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }, {
                    title: 'title2',
                    items: ['lastName']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            selectedIndex: 1,
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(1);

                tabs.push({
                    title: 'title3',
                    items: ['address']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                tabs.splice(2, 1);

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.setItemOption('tabbedItem.title2', 'title', 'updated title');

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabTitle(1, 'updated title');
                testWrapper.checkEditorRendered('address', false);
                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkEditorRendered('name', !deferRendering);
                testWrapper.checkTabSelection(1);
            });

            test(`Select first tab, add new tab, remove first tab and change title and icon for first tab, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'tabbed',
                        name: 'tabbedItem',
                        tabPanelOptions: {
                            repaintChangesOnly,
                            deferRendering
                        },
                        tabs
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['lastName']
                });

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);

                tabs.splice(0, 1);

                testWrapper.setItemOption('tabbedItem', 'tabs', tabs);
                testWrapper.setItemOption('tabbedItem.title2', {
                    title: 'updated title',
                    icon: 'plus'
                });

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(1);
                testWrapper.checkTabTitle(0, 'updated title');
                testWrapper.checkTabIcon(0, 'plus');
                testWrapper.checkEditorRendered('lastName', true);
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkTabSelection(0);
            });

            test(`Select first tab, add new tab, select last tab, change title of last tab and change items for parent group, repaintChangesOnly: ${repaintChangesOnly}, deferRendering: ${deferRendering}`, function() {
                const tabs = [{
                    title: 'title1',
                    items: ['name']
                }];

                const testWrapper = new FormTestWrapper({
                    items: [{
                        itemType: 'group',
                        name: 'group1',
                        items: [{
                            itemType: 'tabbed',
                            name: 'tabbedItem',
                            tabPanelOptions: {
                                repaintChangesOnly,
                                deferRendering
                            },
                            tabs
                        }]
                    }]
                });

                testWrapper.checkTabSelection(0);

                tabs.push({
                    title: 'title2',
                    items: ['address']
                });
                testWrapper.setItemOption('group1.tabbedItem', 'tabs', tabs);
                testWrapper.selectTab(1);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(2);
                testWrapper.checkTabSelection(1);
                testWrapper.checkEditorRendered('name', !repaintChangesOnly || !deferRendering);
                testWrapper.checkEditorRendered('address', true);

                testWrapper.setItemOption('group1.tabbedItem.title2', 'title', 'title1');
                testWrapper.setItemOption('group1', 'items', ['city']);

                testWrapper.checkFormsReRender();
                testWrapper.checkTabsElements(0);
                testWrapper.checkEditorRendered('city', true);
                testWrapper.checkEditorRendered('name', false);
                testWrapper.checkEditorRendered('address', false);
            });
        });
    });
});
