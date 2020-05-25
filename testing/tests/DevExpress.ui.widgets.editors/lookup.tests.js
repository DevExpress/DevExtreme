import $ from 'jquery';
import fx from 'animation/fx';
import devices from 'core/devices';
import dataUtils from 'core/element_data';
import config from 'core/config';
import browser from 'core/utils/browser';
import { isRenderer } from 'core/utils/type';

import ArrayStore from 'data/array_store';
import CustomStore from 'data/custom_store';
import Query from 'data/query';
import { DataSource } from 'data/data_source/data_source';

import themes from 'ui/themes';
import Lookup from 'ui/lookup';
import Popup from 'ui/popup';
import List from 'ui/list';
import Popover from 'ui/popover';

import executeAsyncMock from '../../helpers/executeAsyncMock.js';
import pointerMock from '../../helpers/pointerMock.js';
import keyboardMock from '../../helpers/keyboardMock.js';

import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

import 'common.css!';
import 'generic_light.css!';

QUnit.testStart(function() {
    const markup =
        '<div id="lookup"></div>\
        <div id="secondLookup"></div>\
        <div id="thirdLookup"></div>\
        <div id="fourthLookup">\
            <div data-options="dxTemplate: { name: \'test\' }">\
                <span data-bind="text: $data.id"></span>- <span data-bind="text: $data.caption"></span>\
            </div>\
        </div>\
        <div id="widget"></div>\
        <div id="widthRootStyle" style="width: 300px;"></div>\
        <div id="lookupOptions">\
            <div data-options="dxTemplate: { name: \'customTitle\' }">testTitle</div>\
            <div data-options="dxTemplate: { name: \'testGroupTemplate\' }">testGroupTemplate</div>\
        </div>\
        \
        <div id="lookupFieldTemplate">\
            <div data-options="dxTemplate: { name: \'field\' }">\
                <span>test</span>\
            </div>\
        </div>\
        \
        <div id="lookupWithFieldTemplate">\
            <div data-options="dxTemplate: {name: \'field\'}">\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const OVERLAY_SHADER_CLASS = 'dx-overlay-shader';
const OVERLAY_WRAPPER_CLASS = 'dx-overlay-wrapper';
const OVERLAY_CONTENT_CLASS = 'dx-overlay-content';
const POPUP_CLASS = 'dx-popup';
const POPUP_TITLE_CLASS = 'dx-popup-title';
const POPUP_CONTENT_CLASS = 'dx-popup-content';

const LIST_CLASS = 'dx-list';
const LIST_ITEM_SELECTED_CLASS = 'dx-list-item-selected';
const LIST_GROUP_HEADER_CLASS = 'dx-list-group-header';

const LOOKUP_SEARCH_CLASS = 'dx-lookup-search';
const LOOKUP_SEARCH_WRAPPER_CLASS = 'dx-lookup-search-wrapper';
const LOOKUP_FIELD_CLASS = 'dx-lookup-field';
const CLEAR_BUTTON_CLASS = 'dx-popup-clear';

const TEXTEDITOR_INPUT_CLASS = 'dx-texteditor-input';

const FOCUSED_CLASS = 'dx-state-focused';

const toSelector = function(val) {
    return '.' + val;
};

const openPopupWithList = function(lookup) {
    $(lookup._$field).trigger('dxclick');
};

const getList = function() {
    return $('.dx-list').dxList('instance');
};

QUnit.module('Lookup', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();

        this.element = $('#lookup');
        this.instance = this.element.dxLookup({ 'dropDownOptions.fullScreen': false }).dxLookup('instance');
        this.$field = $(this.instance._$field);

        this.togglePopup = function() {
            $(this.instance._$field).trigger('dxclick');

            this.$popup = $('.dx-lookup-popup');
            this.popup = dataUtils.data(this.$popup[0], 'dxPopup') || dataUtils.data(this.$popup[0], 'dxPopover');

            this.$list = $('.dx-list');
            this.list = this.$list.dxList('instance');

            this.$search = $(this.instance._$searchBox);
            this.search = this.instance._searchBox;
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('attaching dxLookup', function(assert) {
        assert.ok(this.instance instanceof Lookup);
        assert.ok(this.element.hasClass('dx-lookup'), 'widget has class dx-lookup');
        assert.ok($('.' + LOOKUP_FIELD_CLASS, this.element).length, 'widget contents field');
        assert.ok($('.dx-lookup-arrow', this.element).length, 'widget contents arrow');

        this.togglePopup();

        assert.ok(this.popup instanceof Popup, 'popup is dxPopup');
        assert.ok(this.popup._wrapper().hasClass('dx-lookup-popup-wrapper'));
        assert.ok(this.list instanceof List, 'dxList in popup');
    });

    QUnit.test('List and search editor get correct \'rtlEnabled\' option', function(assert) {
        this.togglePopup();

        assert.ok(!this.instance.option('rtlEnabled'), 'rtlEnabled == false');
        assert.equal(this.list.option('rtlEnabled'), this.instance.option('rtlEnabled'), 'list get correct option value');
        assert.equal(this.search.option('rtlEnabled'), this.instance.option('rtlEnabled'), 'search get correct option value');

        this.instance.option('rtlEnabled', true);
        this.togglePopup();

        assert.ok(this.instance.option('rtlEnabled'), 'rtlEnabled == true');
        assert.equal(this.list.option('rtlEnabled'), this.instance.option('rtlEnabled'), 'list get correct option value');
        assert.equal(this.search.option('rtlEnabled'), this.instance.option('rtlEnabled'), 'search get correct option value');
    });

    QUnit.test('show popup on click', function(assert) {
        const instance = this.instance;

        instance.option({
            dataSource: [1, 2, 3],
            value: 1,
            showCancelButton: true
        });

        this.togglePopup();

        const popup = this.popup;
        const $field = this.$field;

        assert.ok(popup.option('visible'), 'popup shows on click');

        $('.dx-list-item', this.$list).eq(1).trigger('dxclick');

        this.clock.tick(201);

        assert.ok(!popup.option('visible'), 'popup hides on click');
        assert.equal(instance.option('value'), 2, 'selected value sets as clicked item index');
        assert.equal(instance.option('displayValue'), 2, '\'displayValue\' option is clicked item value');
        assert.equal($field.text(), 2, 'field text is clicked item value');

        $($field).trigger('dxclick');
        assert.ok(popup.option('visible'));

        $(popup._wrapper()).find('.dx-button').eq(0).trigger('dxclick');
        assert.equal(popup.option('visible'), false);
    });

    QUnit.test('hide popup on click on editor', function(assert) {
        const instance = this.instance;

        instance.option({
            dataSource: [1, 2, 3]
        });

        this.togglePopup();

        const popup = this.popup;
        const $field = this.$field;

        $field.trigger('dxclick');
        assert.ok(!popup.option('visible'), 'popup hides on click');
    });

    QUnit.test('selecting item on click', function(assert) {
        this.instance.option({
            dataSource: [1, 2, 3]
        });

        assert.equal(this.instance.option('value'), undefined, 'no selected value on start');
        assert.equal(this.instance.option('displayValue'), null, 'no selected value on start');
        assert.equal(this.$field.text(), this.instance.option('placeholder'), 'no field text if no selected value');

        this.togglePopup();

        let $firstItem = $(this.$list.find('.dx-list-item')[0]); let $secondItem = $(this.$list.find('.dx-list-item')[1]);

        $firstItem = $(this.$list.find('.dx-list-item')[0]);
        $($firstItem).trigger('dxclick');
        assert.equal(this.instance.option('value'), 1, 'first value selected');
        assert.equal(this.instance.option('displayValue'), 1, 'first value selected as displayValue');
        assert.equal(this.$field.text(), '1', 'field text sets correctly');

        $secondItem = $(this.$list.find('.dx-list-item')[1]);
        $($secondItem).trigger('dxclick');
        assert.equal(this.instance.option('value'), 2, 'second value selected');
        assert.equal(this.instance.option('displayValue'), 2, 'second value selected as displayValue');
        assert.equal(this.$field.text(), '2', 'field text sets correctly');
    });

    QUnit.test('List is empty until popup is open', function(assert) {
        this.element
            .dxLookup({
                dataSource: [1, 2, 3]
            })
            .dxLookup('instance');

        assert.strictEqual(getList(), undefined, 'List dataSource');
    });

    QUnit.test('search value should be cleared after popup close for better UX (T253304)', function(assert) {
        const searchTimeout = 300;

        const instance = $('#thirdLookup').dxLookup({
            dataSource: [1, 2, 3],
            deferRendering: false,
            searchTimeout: searchTimeout,
            'dropDownOptions.animation': null,
            cleanSearchOnOpening: true,
            opened: true
        }).dxLookup('instance');

        instance._searchBox.option('value', '2');
        this.clock.tick(searchTimeout);
        instance.close();
        instance.open();
        assert.equal(getList().option('items').length, 3, 'filter reset immediately');
    });

    QUnit.test('search value should be cleared without excess dataSource filtering ', function(assert) {
        const searchTimeout = 300;
        let loadCalledCount = 0;

        const instance = $('#thirdLookup').dxLookup({
            dataSource: new DataSource({
                load: function(options) {
                    loadCalledCount++;
                }
            }),
            searchTimeout: searchTimeout,
            'dropDownOptions.animation': null,
            cleanSearchOnOpening: true,
            opened: true
        }).dxLookup('instance');

        assert.equal(loadCalledCount, 1, 'DataSource was loaded on init');

        instance._searchBox.option('value', '2');
        this.clock.tick(searchTimeout);
        assert.equal(loadCalledCount, 2, 'DataSource was loaded after searching');

        instance.close();
        instance.open();
        assert.equal(loadCalledCount, 3, 'Loading dataSource count is OK');
    });

    QUnit.test('onContentReady fire with lookup\'s option \'minSearchLength\' at first show (Q575560)', function(assert) {
        let count = 0;
        this.element
            .dxLookup({
                items: [111, 222, 333],
                searchTimeout: 0,
                'dropDownOptions.animation': {},
                minSearchLength: 2,
                onContentReady: function() { count++; }
            }).dxLookup('instance');

        this.togglePopup();
        assert.equal(count, 1, 'onContentReady fired after rendering with option \'minSearchLength\'');
    });

    QUnit.test('onOpened and onClosed actions', function(assert) {
        let openFired = false;
        let closeFired = false;
        const items = [1, 2, 3];

        const instance = $('#thirdLookup').dxLookup({
            onOpened: function() { openFired = true; },
            onClosed: function() { closeFired = true; },
            items: items
        }).dxLookup('instance');

        instance.open();
        instance._popup.hide();

        assert.ok(openFired, 'open fired');
        assert.ok(closeFired, 'close fired');
    });

    QUnit.test('class selected', function(assert) {
        const items = [1, 2];
        const lookup = this.element
            .dxLookup({
                dataSource: items,
                value: items[1]
            })
            .dxLookup('instance');

        this.togglePopup();

        const $firstItem = $(getList().$element().find('.dx-list-item')[0]);
        const $secondItem = $(getList().$element().find('.dx-list-item')[1]);

        assert.ok($secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was added');

        lookup.option('value', items[0]);
        assert.ok(!$secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was deleted');
        assert.ok($firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was added');
    });

    QUnit.test('complex items', function(assert) {
        const items = [{
            value: 1,
            text: 'one'
        }, {
            value: 2,
            text: 'two'
        }];
        const lookup = this.element
            .dxLookup({
                dataSource: items,
                displayExpr: 'text',
                valueExpr: 'value'
            })
            .dxLookup('instance');

        assert.equal(this.$field.text(), lookup.option('placeholder'), 'no field text if no selected value');

        this.togglePopup();

        const $firstItem = $(getList().$element().find('.dx-list-item')[0]);
        assert.equal($firstItem.text(), 'one', 'displayExpr work in list items');

        lookup.option('value', 1);
        assert.equal(this.$field.text(), 'one', 'display field work in text');
        assert.equal(lookup.option('displayValue'), 'one', 'option \'displayValue\' work in text');

        this.togglePopup();

        const $secondItem = $(getList().$element().find('.dx-list-item')[1]);
        $($secondItem).trigger('dxclick');
        assert.equal(lookup.option('value'), 2);
        assert.equal(this.$field.text(), 'two', 'display field work in text');
        assert.equal(lookup.option('displayValue'), 'two', 'option \'displayValue\' work in text');
    });

    QUnit.test('selection should works with composite keys', function(assert) {
        const store = new ArrayStore({
            key: ['ID1', 'ID2'],
            data: [
                { ID1: 1, ID2: 21 },
                { ID1: 2, ID2: 22 }
            ]
        });

        this.element.dxLookup({
            dataSource: store,
            valueExpr: 'ID1'
        });

        const instance = this.element.dxLookup('instance');

        instance.open();

        assert.strictEqual(instance.option('selectedItem'), null, 'selectedItem is null');
    });


    QUnit.test('selectedItem should be changed correctly with composite keys and valueExpr', function(assert) {
        const data = [
            { ID1: 1, ID2: 21 },
            { ID1: 2, ID2: 22 }
        ];
        const store = new ArrayStore({
            key: ['ID1', 'ID2'],
            data: data
        });

        this.element.dxLookup({
            dataSource: store,
            valueExpr: 'ID1'
        });

        const instance = this.element.dxLookup('instance');

        instance.open();

        const $popup = $('.dx-popup-wrapper'); const $listItems = $popup.find('.dx-list-item');

        $($listItems.eq(1)).trigger('dxclick');

        assert.strictEqual(instance.option('selectedItem'), data[1], 'selectedItem is changed correctly');
    });

    QUnit.test('valueExpr calculating', function(assert) {
        const store = new ArrayStore({
            key: 'k',
            data: [
                { k: 1, v: 'a' },
                { k: 2, v: 'b' }
            ]
        });
        const dataSource = new DataSource({
            store: store,
            paginate: false
        });
        const lookup = this.element.dxLookup({
            dataSource: [1, 2],
            value: 1
        }).dxLookup('instance');

        assert.equal(this.$field.text(), 1, 'if option valueExpr and store key are not defined, use \'this\' as valueExpr');

        lookup.option({
            dataSource: dataSource,
            value: 1,
            displayExpr: 'v'
        });

        assert.equal(this.$field.text(), 'a', 'if option valueExpr is not defined, but store has defined key, use it');

        lookup.option({
            valueExpr: 'v',
            value: 'b'
        });
        assert.equal(this.$field.text(), 'b', 'if option valueExpr is defined, use it');
    });

    QUnit.test('change value expr refresh selected item', function(assert) {
        const $lookup = this.element.dxLookup({
            dataSource: [
                { param1: true, display: 'item1' },
                { param2: true, display: 'item2' }
            ],
            valueExpr: 'param1',
            displayExpr: 'display',
            value: true
        });

        this.togglePopup();

        let $selectedItem = $(this.popup.$content().find('.' + LIST_ITEM_SELECTED_CLASS));
        assert.equal($selectedItem.text(), 'item1');
        assert.equal(this.$field.text(), 'item1');

        $lookup.dxLookup('option', 'valueExpr', 'param2');
        $selectedItem = $(this.popup.$content().find('.' + LIST_ITEM_SELECTED_CLASS));
        assert.equal($selectedItem.text(), 'item2');
        assert.equal(this.$field.text(), 'item2');
    });

    QUnit.test('external dataSource filter applied during search value', function(assert) {
        const arrayStore = [
            { key: 1, value: 'one' },
            { key: 2, value: 'two' },
            { key: 3, value: 'three' },
            { key: 4, value: 'four' }
        ];
        const dataSource = new DataSource({
            store: arrayStore,
            filter: ['key', '>', 2]
        });

        const $lookup = $('#lookup').dxLookup({
            dataSource: dataSource,
            displayExpr: 'value',
            valueExpr: 'key',
            value: 1,
            placeholder: 'test'
        });

        assert.equal($lookup.text(), 'test', 'display value is not defined');
    });

    QUnit.test('option value returns object when valueExpr is \'this\'', function(assert) {
        const dataArray = [
            { id: '1', value: 'one' },
            { id: '2', value: 'two' },
            { id: '3', value: 'three' },
            { id: '4', value: 'four' },
            { id: '5', value: 'five' }
        ];
        const store = new CustomStore({
            key: 'id',
            load: function(option) {
                return dataArray;
            },
            byKey: function(key) {
                $.each(dataArray, function() {
                    if(this.id === key) {
                        return false;
                    }
                });
            }
        });

        this.instance.option({
            dataSource: store,
            displayExpr: 'value',
            valueExpr: 'this',
            value: dataArray[0]
        });

        assert.equal(this.instance.option('value'), dataArray[0], 'option value return object');

        $(this.$field).trigger('dxclick');
        $('.dx-list-item', this.$list).eq(3).trigger('dxclick');
        assert.equal(this.instance.option('value'), dataArray[3], 'option value return object');
    });

    QUnit.test('highlight item when dataSource is mapped', function(assert) {
        const dataArray = [{ id: 1 }, { id: 2 }];
        const store = new ArrayStore({
            data: dataArray,
            key: 'id'
        });
        const value = dataArray[0];
        const dataSource = new DataSource({
            store: store,
            map: function(data) {
                return { id: data.id };
            }
        });


        const $lookup = $('#lookup').dxLookup({
            dataSource: dataSource,
            value: value
        });

        $($lookup.find('.' + LOOKUP_FIELD_CLASS)).trigger('dxclick');
        const $popup = $('.dx-popup-wrapper');

        const $listItems = $popup.find('.dx-list-item');
        assert.ok($listItems.eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), 'selected class was attached byKey');
    });

    QUnit.test('highlight item when dataSource is mapped and valueExpr was set', function(assert) {
        const dataArray = [{ id: 1 }, { id: 2 }];
        const store = new ArrayStore({
            data: dataArray,
            key: 'id'
        });
        const value = dataArray[0];
        const dataSource = new DataSource({
            store: store,
            map: function(data) {
                return { id: data.id };
            }
        });

        const $lookup = $('#lookup').dxLookup({
            dataSource: dataSource,
            value: value,
            valueExpr: 'id'
        });

        $($lookup.find('.' + LOOKUP_FIELD_CLASS)).trigger('dxclick');
        const $popup = $('.dx-popup-wrapper');

        const $listItems = $popup.find('.dx-list-item');
        assert.ok($listItems.eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), 'selected class was attached byKey');
    });

    QUnit.test('search with dataSource', function(assert) {
        const dataSource = new DataSource({
            store: [
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ],
            searchExpr: 'value'
        });

        this.instance.option({
            dataSource: dataSource,
            displayExpr: 'value',
            valueExpr: 'value',
            value: 3,
            searchTimeout: 0
        });

        this.togglePopup();

        this.search.option('value', '3');

        const listItems = this.$list.find('.dx-list-item');

        assert.equal(listItems.length, 1, 'Items count');
        assert.equal(listItems.eq(0).text(), '3', 'List item text');
    });

    QUnit.test('multiple field search with dataSource (Q521604)', function(assert) {
        const items = [
            { id: 1, name: 'red_toy', desc: 'A giant toy replicating real vehicle' },
            { id: 2, name: 'green_bike', desc: 'Stuff for a young dabbler' },
            { id: 3, name: 'yellow_monster', desc: 'A bike of premium quality' }];

        this.instance.option({
            dataSource: items,
            searchExpr: ['name', 'desc'],
            displayExpr: 'name',
            valueExpr: 'id',
            searchTimeout: 0
        });

        this.togglePopup();

        this.search.option('value', 'bike');

        const filteredListItems = this.$list.find('.dx-list-item');

        assert.equal(filteredListItems.length, 2, 'Items count is right');

        const firstItemIsFound = filteredListItems.text().indexOf(items[1].name) !== -1;
        const secondItemIsFound = filteredListItems.text().indexOf(items[2].name) !== -1;

        assert.ok(firstItemIsFound && secondItemIsFound, 'Items\' filtering is right');
    });

    QUnit.test('Empty dataSource searchExpr (B253811)', function(assert) {
        const items = [
            { id: 1, name: 'red_toy', desc: 'A giant toy replicating real vehicle' },
            { id: 2, name: 'green_bike', desc: 'Stuff for a young dabbler' },
            { id: 3, name: 'yellow_monster', desc: 'A bike of premium quality' }];

        const dataSource = new DataSource({
            store: items
        });

        this.instance.option({
            dataSource: dataSource,
            displayExpr: 'name',
            valueExpr: 'id',
            searchTimeout: 0
        });

        this.togglePopup();

        this.search.option('value', 'bike');

        const filteredListItems = this.$list.find('.dx-list-item');
        const rightItemIsFound = filteredListItems.text().indexOf(items[1].name) !== -1;

        assert.ok(filteredListItems.length === 1 && rightItemIsFound, 'Lookup\'s displayExpr is used if dataSource\'s searchExpr is undefined');
    });

    QUnit.test('userDataSource: byKey', function(assert) {
        let initialLoadCalled = false;
        let searchLoadCalled = false;
        let searchString = null;
        const lookupKeys = [];

        const items = [
            {
                value: 1,
                name: 'one'
            },
            {
                value: 2,
                name: 'two'
            },
            {
                value: 3,
                name: 'three'
            }
        ];

        const userDataSource = {
            load: function(loadOptions) {
                initialLoadCalled = true;
                if(loadOptions.searchValue) {
                    searchLoadCalled = true;
                    searchString = loadOptions.searchValue;
                }
                return items;
            },

            byKey: function(key) {
                lookupKeys.push(key);
                return items[0];
            }
        };

        this.instance.option({
            dataSource: userDataSource,
            displayExpr: 'name',
            valueExpr: 'id',
            value: 1,
            searchTimeout: 0
        });

        this.togglePopup();

        const search = this.search;

        search.option('value', 'thr');

        assert.ok(initialLoadCalled, 'initial load');
        assert.ok(searchLoadCalled, 'load should be called with search params');
        assert.equal(searchString, 'thr', 'Correct search string should be passed');

        assert.equal(lookupKeys[0], 1, 'Lookup callback should be called with right key');
    });

    QUnit.test('userDataSource: lookup with not defined value', function(assert) {
        const lookupKeys = [];
        const userDataSource = {
            load: function(loadOptions) {
                return [];
            },

            lookup: function(key) {
                lookupKeys.push(key);
                return null;
            }
        };

        this.instance.option({
            dataSource: userDataSource,
            displayExpr: 'name',
            valueExpr: 'id',
            searchTimeout: 0
        });

        this.togglePopup();

        assert.equal(lookupKeys.length, 0, 'Lookup callback should never be called');
    });

    QUnit.test('searchTimeout does not work (Q569033)', function(assert) {
        let loadTriggered = 0;

        this.instance.option({
            dataSource: {
                load: function(loadOptions) {
                    loadTriggered++;
                    return [];
                },
                lookup: function() { }
            },
            displayExpr: 'name',
            valueExpr: 'id',
            searchTimeout: 500
        });


        this.togglePopup();

        const loadTriggeredAtStart = loadTriggered;
        const search = this.search;

        search.option('value', 't');
        this.clock.tick(300);

        search.option('value', 'th');
        this.clock.tick(300);

        search.option('value', 'thr');
        this.clock.tick(600);

        assert.equal(loadTriggered, loadTriggeredAtStart + 1, 'load triggered once when last search timeout expired');
    });

    QUnit.test('allow dataSource with map function', function(assert) {
        const dataSource = new DataSource({
            store: [1, 2, 3],
            map: function(item) {
                return { text: item };
            }
        });

        this.instance.option({
            dataSource: dataSource
        });

        this.togglePopup();
        assert.ok(true, 'dataSource with map works correctly');
    });

    QUnit.test('UserDateSource with map, minSearchLength > 0', function(assert) {
        const items = [
            {
                id: 1,
                name: 'Tom',
                lastName: 'Smith'
            },
            {
                id: 2,
                name: 'James',
                lastName: 'Adams'
            },
            {
                id: 3,
                name: 'Joe',
                lastName: 'Doe'
            }
        ];
        const dataSource = new DataSource({
            store: items,
            map: function(item) {
                return {
                    value: item.id,
                    text: item.name + ' ' + item.lastName
                };
            }
        });

        dataSource.load();

        const store = new ArrayStore(dataSource.items());
        const lookupDataSource = new DataSource({
            load: function(loadOptions) {
                return store.load(loadOptions.searchValue ? { filter: ['text', 'contains', loadOptions.searchValue] } : null);
            },
            lookup: $.proxy(dataSource.lookup, dataSource)
        });

        this.instance.option({
            dataSource: lookupDataSource,
            valueExpr: 'value',
            displayExpr: 'text',
            searchTimeout: 0,
            minSearchLength: 3
        });

        this.togglePopup();

        const search = this.search;
        search.option('value', 'smi');

        const listItems = this.$list.find('.dx-list-item');
        assert.equal(listItems.length, 1);
        assert.notEqual(listItems.eq(0).css('display'), 'none');
    });

    QUnit.test('value onValueChanged callback', function(assert) {
        const items = [
            {
                id: 1,
                name: 'Tom'
            },
            {
                id: 2,
                name: 'James'
            }
        ];

        const lookup = this.element
            .dxLookup({
                dataSource: items,
                valueExpr: 'id',
                displayExpr: 'name',
                value: 1
            })
            .dxLookup('instance');

        let value = items[0];

        lookup.option('onValueChanged', function(args) {
            value = args.value;
        });
        lookup.option('value', 2);

        assert.equal(value, items[1].id);
    });

    QUnit.test('use template, option itemTemplate', function(assert) {
        const dataSource = [
            { id: 1, caption: 'red' },
            { id: 2, caption: 'green' },
            { id: 3, caption: 'blue' }
        ];

        const fourthLookup = $('#fourthLookup').dxLookup({
            dataSource: dataSource,
            itemTemplate: 'test',
            valueExpr: 'id',
            displayExpr: 'caption'
        }).dxLookup('instance');

        assert.ok(fourthLookup._getTemplateByOption('itemTemplate'), 'test template present in lookup');
        openPopupWithList(fourthLookup);
        assert.strictEqual(fourthLookup._getTemplateByOption('itemTemplate'), getList()._getTemplateByOption('itemTemplate'), 'test template present in list');
    });

    QUnit.test('itemTemplate returning string', function(assert) {
        const lookup = this.element.dxLookup({
            items: ['a', 'b'],
            itemTemplate: function(item, index) {
                return index + ': ' + item;
            }
        }).dxLookup('instance');

        openPopupWithList(lookup);
        let items = $('.dx-list-item', getList().$element());

        assert.equal(items.eq(0).text(), '0: a');
        assert.equal(items.eq(1).text(), '1: b');

        lookup.option('itemTemplate', function(item, index) {
            return item + ': ' + index;
        });

        items = $('.dx-list-item', getList().$element());

        assert.equal(items.eq(0).text(), 'a: 0');
        assert.equal(items.eq(1).text(), 'b: 1');
    });

    QUnit.test('itemTemplate returning jquery', function(assert) {
        const lookup = this.element.dxLookup({
            items: ['a'],
            itemTemplate: function(item, index) {
                return $('<span class=\'test\' />');
            }
        }).dxLookup('instance');

        openPopupWithList(lookup);
        const item = $('.dx-list-item', getList().$element()).eq(0);
        assert.ok(item.find('span.test').length);
    });

    QUnit.test('lookup with Done does not closed after item click', function(assert) {
        const lookup = this.element.dxLookup({
            dataSource: [1, 2, 3],
            value: 1,
            showClearButton: false,
            applyValueMode: 'useButtons',
            showCancelButton: false,
            opened: true
        }).dxLookup('instance');
        const $list = lookup._$list;

        $($list.find('.dx-list-item').eq(1)).trigger('dxclick');
        assert.ok(lookup.option('opened'), 'popup dont hide after click');
        assert.ok($list.find('.dx-list-item').eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), 'second item selected');
        assert.equal(lookup.option('value'), 1, 'value dont changed without Done click');

        $(lookup._popup._wrapper()).find('.dx-popup-done.dx-button').eq(0).trigger('dxclick');

        assert.ok(!lookup.option('opened'), 'popup hide after click by Done');
        assert.equal(lookup.option('value'), 2, 'value changed after Done click');
    });

    QUnit.test('regression: can not select value after loading more items (B233390)', function(assert) {
        const lookup = this.element.dxLookup({
            items: ['1', '2', '3']
        }).dxLookup('instance');

        openPopupWithList(lookup);

        const $firstListItem = $(getList().$element().find('.dx-list-item').eq(0));
        const mouse = pointerMock($firstListItem).start();

        mouse.down().move(0, 10).up();
        this.clock.tick(500);
        mouse.click();

        assert.equal(lookup.option('value'), '1');
    });

    QUnit.test('regression: B236007 (check that selection item in one lookup do not effect to another)', function(assert) {
        const $firstLookup = $('#lookup').dxLookup({
            items: ['1', '2', '3'],
            value: '1'
        });
        const firstLookup = $firstLookup.dxLookup('instance');
        const $secondLookup = $('#secondLookup').dxLookup({
            items: ['1', '2', '3'],
            value: '2'
        });
        const secondLookup = $secondLookup.dxLookup('instance');

        openPopupWithList(firstLookup);
        assert.equal($('.' + LIST_ITEM_SELECTED_CLASS).length, 1);

        const $firstListItem = $(getList().$element().find('.dx-list-item').eq(0));
        const mouse = pointerMock($firstListItem);
        mouse.start().down().move(0, 10).up();

        openPopupWithList(secondLookup);
        assert.equal($('.' + LIST_ITEM_SELECTED_CLASS).length, 2);

        mouse.start().down().move(0, 10).up();

        openPopupWithList(firstLookup);
        assert.equal($('.' + LIST_ITEM_SELECTED_CLASS).length, 2);
    });

    QUnit.test('regression: dxLookup - incorrect search behavior when \'minSearchLength\' greater than zero', function(assert) {
        const lookup = this.element.dxLookup({
            items: ['1', '2', '3'],
            minSearchLength: 2
        }).dxLookup('instance');

        openPopupWithList(lookup);
        assert.equal(lookup._searchBox.option('placeholder'), 'Minimum character number: 2');

        lookup.option('minSearchLength', 3);
        assert.equal(lookup._searchBox.option('placeholder'), 'Minimum character number: 3');
    });

    QUnit.test('Q517035 - Setting an observable variable to null and then to a value causes a display text problem', function(assert) {
        executeAsyncMock.teardown();

        const lookup = this.element.dxLookup({
            dataSource: [{ id: 0, text: '0' }, { id: 1, text: '1' }],
            displayExpr: 'text',
            valueExpr: 'id'
        }).dxLookup('instance');

        lookup.option('value', null);
        lookup.option('value', 1);

        assert.strictEqual(lookup._$field.text(), '1');

        lookup.option('value', null);
        lookup.option('value', 1);

        assert.strictEqual(lookup._$field.text(), '1');
    });

    QUnit.test('B236077: dxLookup shouldn\'t render popup window with inner widgets until it\'s going to be shown', function(assert) {
        this.instance.option({
            dataSource: [1, 2, 3],
            value: 1
        });

        assert.ok(!this.instance._popup, 'B236077: popup is not added before showing');
        assert.ok(!$('.dx-lookup-popup', this.instance.$element()).length, 'B236077: popups markup is not rendered to lookup');

        this.togglePopup();

        assert.ok(this.$popup, 'B236077: popup is added after click');
    });

    QUnit.test('usePopover', function(assert) {
        this.instance.option({ usePopover: true });

        this.togglePopup();

        assert.ok(this.popup instanceof Popover, 'popover was created');
        assert.ok(this.element.hasClass('dx-lookup-popover-mode'), 'popover has class popover mode');
    });

    QUnit.test('usePopover option target', function(assert) {
        this.instance.option({ usePopover: true });

        this.togglePopup();

        const $target = this.popup.option('target');
        assert.equal($target.get(0), this.element.get(0), 'popover target is lookup element');
    });

    QUnit.test('popupHeight when usePopover is true', function(assert) {
        const popupHeight = 500;
        this.instance.option({
            usePopover: true,
            'dropDownOptions.height': popupHeight
        });

        this.togglePopup();

        assert.equal(this.popup.option('height'), popupHeight, 'popupHeight applied to popover');
    });

    QUnit.test('showEvent/hideEvent is null when usePopover is true', function(assert) {
        this.instance.option({
            usePopover: true
        });

        this.togglePopup();

        assert.strictEqual(this.popup.option('showEvent'), null, 'showEvent is null');
        assert.strictEqual(this.popup.option('hideEvent'), null, 'hideEvent is null');
    });

    QUnit.test('Popup with Done Button hide after one click on item', function(assert) {
        const lookup = this.element
            .dxLookup({
                dataSource: [1, 2, 3],
                value: 1,
                showClearButton: false,
                applyValueMode: 'useButtons',
                showCancelButton: true
            })
            .dxLookup('instance');

        this.togglePopup();

        $($('.dx-list-item', getList().$element()).eq(1)).trigger('dxclick');
        $('.dx-popup-cancel.dx-button', $(lookup._popup._wrapper())).eq(0).trigger('dxclick');
        $(lookup._$field).trigger('dxclick');
        $($('.dx-list-item', getList().$element()).eq(1)).trigger('dxclick');

        this.clock.tick(250);
        assert.ok(lookup._popup.option('visible'), 'popup hide after click by no selected item after hide->show events');
    });

    QUnit.test('clear button should save valueChangeEvent', function(assert) {
        const valueChangedHandler = sinon.spy();

        const lookup = this.element
            .dxLookup({
                dataSource: [1],
                value: 1,
                opened: true,
                onValueChanged: valueChangedHandler,
                showClearButton: true
            })
            .dxLookup('instance');

        const $clearButton = $(lookup.content()).parent().find(toSelector(CLEAR_BUTTON_CLASS));
        $clearButton.trigger('dxclick');

        assert.equal(valueChangedHandler.callCount, 1, 'valueChangedHandler has been called');
        assert.equal(valueChangedHandler.getCall(0).args[0].event.type, 'dxclick', 'event is correct');
    });

    QUnit.test('B238773 - dxLookup does not work properly if the valueExpr option is set to this', function(assert) {
        executeAsyncMock.teardown();

        const dataSource = [{ id: 0, text: 'item 0' }, { id: 1, text: 'item 1' }];

        const lookup = this.element.dxLookup({
            placeholder: 'Select...',
            valueExpr: 'this',
            displayExpr: 'text',
            dataSource: dataSource
        }).dxLookup('instance');

        openPopupWithList(lookup);

        assert.ok(lookup._popup.option('visible'));

        this.clock.tick(200);

        $(lookup._popup._wrapper()).find('.dx-list-item').eq(0).trigger('dxclick');

        assert.equal(lookup.option('value').id, dataSource[0].id);
        assert.equal(lookup._$field.text(), 'item 0');
    });

    QUnit.test('dataSource loading calls once after opening when value is specified', function(assert) {
        let loadingFired = 0;

        this.element.dxLookup({
            value: 1,
            dataSource: {
                load: function() {
                    loadingFired++;
                },
                byKey: function(key) {
                    return key;
                }
            }
        });
        this.togglePopup();

        assert.equal(loadingFired, 1, 'loading called once');
    });

    QUnit.test('dataSource loading calls once when change search string (Q558510)', function(assert) {
        let loadingFired = 0;

        this.element.dxLookup({
            minSearchLength: 2,
            searchTimeout: 0,
            dataSource: {
                load: function(searchOptions) {
                    loadingFired++;
                }
            }
        });

        this.togglePopup();

        this.$search.dxTextBox('option', 'value', '123');

        assert.equal(loadingFired, 1, 'loading called once');
    });

    QUnit.test('lookup empty class is attached when no item is selected', function(assert) {
        const $lookup = this.element.dxLookup({ dataSource: [1, 2, 3], showClearButton: true, placeholder: 'placeholder' }); const lookup = $lookup.dxLookup('instance'); const LOOKUP_EMPTY_CLASS = 'dx-lookup-empty';

        assert.ok($lookup.hasClass(LOOKUP_EMPTY_CLASS), 'Lookup without preselected value has empty class');

        lookup.option('value', 1);

        assert.ok(!$lookup.hasClass(LOOKUP_EMPTY_CLASS), 'Lookup with selected item has not empty class');

        openPopupWithList(lookup);
        $(lookup._popup._wrapper()).find('.dx-button.dx-popup-clear').trigger('dxclick');

        const $lookupField = $lookup.find('.dx-lookup-field');

        assert.ok($lookup.hasClass(LOOKUP_EMPTY_CLASS), 'Lookup has empty class after clearance');
        assert.equal($.trim($lookupField.text()), 'placeholder', 'placeholder is shown');
        assert.strictEqual(lookup.option('value'), null, 'value reset');
    });

    QUnit.test('show/hide popup window programmatically', function(assert) {
        const $lookup = this.element.dxLookup({ dataSource: [1, 2, 3] });
        const lookup = $lookup.dxLookup('instance');
        let $popup = $('.' + POPUP_CLASS);

        assert.equal($popup.length, 0, 'no rendered popup or popover');

        lookup.open();
        $popup = $('.' + POPUP_CLASS);
        assert.ok($popup.is(':visible'));

        lookup.close();
        assert.ok($popup.is(':hidden'));
    });

    QUnit.test('list display items when same as \'minSearchLength\' characters are entered (T126606)', function(assert) {
        this.element.dxLookup({
            minSearchLength: 2,
            searchTimeout: 0,
            dataSource: new DataSource({
                load: function(loadOptions) {
                    const d = new $.Deferred();
                    loadOptions.searchString;
                    setTimeout(function() {
                        const query = Query([{ name: 'asdfg' }, { name: 'qwert' }, { name: 'zxcvb' }]);
                        let data = [];
                        if(loadOptions.searchValue) {
                            data = query.filter('name', 'contains', loadOptions.searchValue).toArray();
                        } else {
                            data = query.toArray();
                        }
                        d.resolve(data);
                    }, 0);
                    return d.promise();
                }
            })
        });

        this.togglePopup();
        this.$search.dxTextBox('option', 'value', 'df');
        this.clock.tick(10);
        assert.equal(this.$list.find('.dx-list-item').length, 1);
    });

    QUnit.test('list display items when \'minSearchLength\' is not exceeded and \'showDataBeforeSearch\' set to true', function(assert) {
        this.element.dxLookup({
            minSearchLength: 2,
            searchTimeout: 0,
            showDataBeforeSearch: true,
            dataSource: new DataSource({
                load: function(loadOptions) {
                    const d = new $.Deferred();
                    loadOptions.searchString;
                    setTimeout(function() {
                        const query = Query([{ name: 'asdfg' }, { name: 'qwert' }, { name: 'zxcvb' }]);
                        let data = [];
                        if(loadOptions.searchValue) {
                            data = query.filter('name', 'contains', loadOptions.searchValue).toArray();
                        } else {
                            data = query.toArray();
                        }
                        d.resolve(data);
                    }, 0);
                    return d.promise();
                }
            })
        });

        this.togglePopup();
        this.$search.dxTextBox('option', 'value');
        this.clock.tick(10);
        assert.equal(this.$list.find('.dx-list-item').length, 3);
    });

    QUnit.test('dxLookup should accept undefined value (T141821)', function(assert) {
        assert.expect(0);

        this.element.dxLookup({
            dataSource: new DataSource({
                store: new ArrayStore({
                    data: [{
                        CategoryID: 1,
                        CategoryName: 'Beverages'
                    }],
                    key: 'CategoryID'
                })
            }),

            displayExpr: 'CategoryName',
            valueExpr: 'CategoryID'
        });

        this.togglePopup();
        this.clock.tick(10);
        $(this.$list.find('.dx-list-item').eq(0)).trigger('dxclick');
    });

    QUnit.test('The search field should be insert before list', function(assert) {
        const $lookup = $('#lookup').dxLookup({
            dataSource: [1, 2, 3],
            value: 2,
            searchEnabled: false,
            opened: true
        });

        const instance = $lookup.dxLookup('instance');
        instance.option('searchEnabled', true);

        const $popupContent = $('.dx-popup-content');

        const searchIndex = $popupContent.find('.dx-lookup-search-wrapper').index();
        const listIndex = $popupContent.find('.dx-list').index();

        assert.ok(listIndex > searchIndex, 'list placed after search field');
    });

    QUnit.test('Check popup position for Material theme when fullScreen option is true ', function(assert) {
        const isMaterialStub = sinon.stub(themes, 'isMaterial');
        const $lookup = $('#lookup');

        isMaterialStub.returns(true);

        $lookup.dxLookup('instance').dispose();

        try {
            const lookup = $lookup
                .dxLookup({
                    dataSource: ['blue', 'orange', 'lime', 'purple'],
                    value: 'orange',
                    'dropDownOptions.fullScreen': true
                })
                .dxLookup('instance');

            $(lookup.field()).trigger('dxclick');
            assert.equal($(lookup._popup.option('position').of)[0], window, 'popup position of the window');
            assert.equal($(lookup.content()).parent().position().top, 0, 'popup doesn\'t have offset top');
            assert.equal($(lookup.content()).parent().position().left, 0, 'popup doesn\'t have offset left');
        } finally {
            $lookup.dxLookup('instance').dispose();
            isMaterialStub.restore();
        }
    });

    QUnit.test('onValueChanged argument should contains an event property after selecting an item by click', function(assert) {
        const valueChangedStub = sinon.stub();
        this.instance.option({
            dataSource: [1, 2, 3],
            onValueChanged: valueChangedStub
        });

        this.togglePopup();

        this.$list
            .find('.dx-list-item')
            .first()
            .trigger('dxclick');

        const { event } = valueChangedStub.lastCall.args[0];

        assert.ok(event);
        assert.strictEqual(event.type, 'dxclick');
    });

    QUnit.test('Lookup should catch delayed data', function(assert) {
        const items = [{
            'ID': 1,
            'Name': 'John'
        }, {
            'ID': 2,
            'Name': 'Olivia'
        }];

        this.element.dxLookup({
            dataSource: [],
            displayExpr: 'Name',
            valueExpr: 'ID',
            value: 1,
            'dropDownOptions.title': 'Select employee'
        });

        setTimeout(() => {
            $('#lookup').dxLookup('instance').option('dataSource', items);
        }, 100);
        this.clock.tick(100);

        assert.equal(this.$field.text(), 'John', 'display field work in text');
    });
});

QUnit.module('hidden input', () => {
    QUnit.test('the hidden input should get correct value on widget value change', function(assert) {
        const $element = $('#lookup').dxLookup({
            items: [1, 2, 3],
            value: 2
        });
        const instance = $element.dxLookup('instance');
        const $input = $element.find('input[type=\'hidden\']');

        instance.option('value', 1);
        assert.equal($input.val(), '1', 'input value is correct');
    });
});

QUnit.module('the \'name\' option', () => {
    QUnit.test('hidden input should get correct \'name\' attribute after the \'name\' option is changed', function(assert) {
        const expectedName = 'lookup';
        const $element = $('#lookup').dxLookup({
            name: 'initialName'
        });
        const instance = $element.dxLookup('instance');
        const $input = $element.find('input[type=\'hidden\']');

        instance.option('name', expectedName);
        assert.equal($input.attr('name'), expectedName, 'input has correct \'name\' attribute');
    });
});

QUnit.module('options', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('popupWidth', function(assert) {
        const instance = $('#lookup').dxLookup({
            'dropDownOptions.width': 100,
            usePopover: false
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        assert.equal(instance._popup.option('width'), 100, 'Option initialized correctly');

        instance.option('dropDownOptions.width', 200);
        assert.equal(instance._popup.option('width'), 200, 'Option set correctly');
    });

    QUnit.test('popupWidth option test for usePopover mode', function(assert) {
        const instance = $('#lookup').dxLookup({
            'dropDownOptions.width': 100,
            usePopover: true
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        assert.equal(instance._popup.option('width'), 100, 'Option initialized correctly');

        instance.option('dropDownOptions.width', 200);
        assert.equal(instance._popup.option('width'), 200, 'Option set correctly');
    });

    QUnit.test('popoverWidth', function(assert) {
        const instance = $('#lookup').dxLookup({
            usePopover: true,
            width: 200
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        assert.equal(Math.round(instance._$popup.width()), Math.round(instance.$element().width()), 'Option initialized correctly');

        instance.option('width', 400);
        assert.equal(Math.round(instance._$popup.width()), Math.round(instance.$element().width()), 'Option set correctly');
    });

    QUnit.test('setting popupWidth to auto returns initial value', function(assert) {
        const $lookup = $('#lookup');
        const instance = $lookup.dxLookup({ usePopover: false }).dxLookup('instance');

        instance.open();
        const popup = $lookup.find('.' + POPUP_CLASS).dxPopup('instance');

        let initialValue = popup.option('width');
        if($.isFunction(initialValue)) {
            initialValue = initialValue();
        }

        instance.option('dropDownOptions.width', initialValue + 1);

        instance.option('dropDownOptions.width', 'auto');
        let autoValue = popup.option('width');
        if($.isFunction(autoValue)) {
            autoValue = autoValue();
        }

        assert.equal(autoValue, initialValue, 'initial value equal auto value');
    });

    QUnit.test('popupHeight', function(assert) {
        const instance = $('#lookup').dxLookup({ 'dropDownOptions.height': 100, usePopover: false }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        assert.equal(instance._popup.option('height'), 100, 'Option initialized correctly');

        instance.option('dropDownOptions.height', 200);
        assert.equal(instance._popup.option('height'), 200, 'Option set correctly');
    });

    QUnit.test('setting popupHeight to auto returns initial value', function(assert) {
        const $lookup = $('#lookup');
        const instance = $lookup.dxLookup({ usePopover: false }).dxLookup('instance');

        instance.open();
        const popup = $lookup.find('.' + POPUP_CLASS).dxPopup('instance');

        let initialValue = popup.option('height');
        if($.isFunction(initialValue)) {
            initialValue = initialValue();
        }

        instance.option('dropDownOptions.height', initialValue + 1);

        instance.option('dropDownOptions.height', 'auto');
        let autoValue = popup.option('height');
        if($.isFunction(autoValue)) {
            autoValue = autoValue();
        }

        assert.equal(autoValue, initialValue, 'initial value equal auto value');
    });

    QUnit.test('searchPlaceholder', function(assert) {
        const instance = $('#lookup').dxLookup({
            dataSource: [1, 2, 3],
            searchPlaceholder: 'searchPlaceHolderTest'
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');
        const search = instance._searchBox;

        assert.equal(search.option('placeholder'), instance.option('searchPlaceholder'));

        instance.option('searchPlaceHolder', 'searchPlaceHolderTest2');
        assert.equal(search.option('placeholder'), instance.option('searchPlaceholder'));
    });

    QUnit.test('searchEnabled', function(assert) {
        const instance = $('#lookup').dxLookup({
            opened: true,
            dataSource: []
        }).dxLookup('instance');

        const popup = instance._popup;
        const $search = instance._$searchBox;

        assert.ok($(popup._wrapper()).hasClass('dx-lookup-popup-search'));
        assert.ok($search.is(':visible'), 'default value');

        instance.option('searchEnabled', false);
        assert.ok(!$(popup._wrapper()).hasClass('dx-lookup-popup-search'));
        assert.ok($search.is(':hidden'), 'hidden');
    });

    QUnit.test('cleanSearchOnOpening', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const instance = $('#lookup').dxLookup({
            items: [1, 11, 111],
            deferRendering: false,
            opened: true,
            cleanSearchOnOpening: true
        }).dxLookup('instance');
        const searchBox = instance._searchBox;
        const $list = instance._$list;
        const $listItems = $list.find('.dx-list-item');

        searchBox.option('value', 1);
        $($listItems.eq(2)).trigger('dxpointerdown');

        instance.option('opened', false);
        instance.option('opened', true);

        assert.equal(searchBox.option('value'), '', 'search value has been cleared');

        $($list).trigger('focusin');
        assert.equal($list.find('.dx-state-focused').eq(0).text(), $listItems.eq(0).text(), 'list focused item has been refreshed');
    });

    QUnit.test('click on readOnly lookup doesn\'t toggle popup visibility', function(assert) {
        const instance = $('#lookup').dxLookup({
            items: [0, 1, 2],
            readOnly: true
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');
        assert.ok(!instance.option('opened'), 'when we click on field - list is still hidden');

        instance.option('readOnly', false);
        $(instance._$field).trigger('dxclick');
        assert.ok(instance.option('opened'), 'when we click on field - list is visible after option changed');
    });

    QUnit.test('noDataText (B253876)', function(assert) {
        assert.expect(2);

        const instance = $('#lookup').dxLookup({ noDataText: 'nope' }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');
        const listInstance = getList();

        assert.equal(listInstance.option('noDataText'), 'nope', 'correct initialization');

        instance.option('noDataText', 'nope, again');
        assert.equal(listInstance.option('noDataText'), 'nope, again', 'correct option change');
    });

    QUnit.test('popup buttons text rerender (B253876 - notes)', function(assert) {
        assert.expect(6);

        const instance = $('#lookup').dxLookup({
            cancelButtonText: 'nope',
            clearButtonText: 'fuu',
            applyButtonText: 'yep',
            showCancelButton: true,
            showClearButton: true,
            applyValueMode: 'useButtons'
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        let $popupWrapper = $('.dx-popup-wrapper');

        assert.equal($popupWrapper.find('.dx-button.dx-popup-cancel').text(), 'nope', 'correct initialization');
        assert.equal($popupWrapper.find('.dx-button.dx-popup-clear').text(), 'fuu', 'correct initialization');
        assert.equal($popupWrapper.find('.dx-button.dx-popup-done').text(), 'yep', 'correct initialization');

        instance.option('cancelButtonText', 'nopenope');
        instance.option('clearButtonText', 'fuufuu');
        instance.option('applyButtonText', 'yepyep');
        $popupWrapper = $('.dx-popup-wrapper');

        assert.equal($popupWrapper.find('.dx-button.dx-popup-cancel').text(), 'nopenope', 'correct option change');
        assert.equal($popupWrapper.find('.dx-button.dx-popup-clear').text(), 'fuufuu', 'correct option change');
        assert.equal($popupWrapper.find('.dx-button.dx-popup-done').text(), 'yepyep', 'correct option change');
    });

    QUnit.test('displayExpr, valueExpr', function(assert) {
        const items = [{
            number: 1,
            caption: 'one'
        }, {
            number: 2,
            caption: 'two'
        }];

        const instance = $('#lookup').dxLookup({
            dataSource: items,
            valueExpr: 'number',
            displayExpr: 'caption'
        }).dxLookup('instance');

        let $firstItem;
        const $field = $(instance._$field);

        assert.equal($field.text(), instance.option('placeholder'), 'no field text if no selected value');

        $(instance._$field).trigger('dxclick');

        $firstItem = $(getList().$element().find('.dx-list-item')[0]);
        assert.equal($firstItem.text(), 'one', 'displayExpr work in list items');

        instance.option('value', 1);
        assert.equal($field.text(), 'one', 'display field work in text');
        assert.equal(instance.option('displayValue'), 'one', 'display field work for \'displayValue\' option');

        instance.option('displayExpr', 'number');
        $firstItem = $(getList().$element().find('.dx-list-item')[0]);
        assert.equal($firstItem.text(), '1', 'displayExpr changing rerenders list items');
        assert.equal(instance.option('displayValue'), '1', 'displayExpr changing work for \'displayValue\' option');
    });

    QUnit.test('value', function(assert) {
        const items = [1, 2, 3];
        const instance = $('#lookup').dxLookup({ dataSource: items }).dxLookup('instance');
        const $field = $(instance._$field);

        assert.equal($field.text(), instance.option('placeholder'), 'no field text if no selected value');

        instance.option('value', 1);
        assert.equal($field.text(), 1, 'field text is selected item value');
        assert.equal(instance.option('displayValue'), 1, 'displayValue is selected item value');

        $(instance._$field).trigger('dxclick');

        const $selectedItem = $('.' + LIST_ITEM_SELECTED_CLASS, getList().$element());
        assert.equal($selectedItem.text(), '1', 'select right item after render list');
    });

    QUnit.test('value in field should be selected', function(assert) {
        const date = new Date();
        const items = [date];
        const instance = $('#lookup').dxLookup({
            dataSource: items,
            value: date
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        const $selectedItem = $(getList().$element().find('.' + LIST_ITEM_SELECTED_CLASS));

        assert.ok($selectedItem.length, 'select item after render list');
    });

    QUnit.test('value with dataSource', function(assert) {
        const dataSource = new DataSource({
            store: [1, 2],
            pageSize: 1,
            paginate: false
        });
        const instance = $('#lookup').dxLookup({
            dataSource: dataSource,
            value: 2
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        const $firstItem = $(getList()._itemElements()[0]);
        const $secondItem = $(getList()._itemElements()[1]);
        const $field = $(instance._$field);

        assert.ok($secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was added');
        assert.ok(!$firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was not added to unselected item');
        assert.equal($field.text(), 2, 'field text is selected item value');

        instance.option('value', 1);

        assert.ok(!$secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was deleted');
        assert.ok($firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was added');
        assert.equal($field.text(), 1, 'field text is selected item value');
    });

    QUnit.test('value with dataSource and complex items', function(assert) {
        const dataSource = new DataSource({
            store: [
                { value: 1 },
                { value: 2 }
            ],
            pageSize: 1,
            paginate: false
        });
        const instance = $('#lookup').dxLookup({
            dataSource: dataSource,
            displayExpr: 'value',
            valueExpr: 'value',
            value: 2
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        const $firstItem = $(getList().$element().find('.dx-list-item')[0]);
        const $secondItem = $(getList().$element().find('.dx-list-item')[1]);
        const $field = $(instance._$field);

        assert.ok(!$firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was not added to unselected item');
        assert.ok($secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was added');
        assert.equal($field.text(), 2, 'field text is selected item value');

        instance.option('value', 1);

        assert.ok($firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was added');
        assert.ok(!$secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), 'class selected was deleted');
        assert.equal($field.text(), 1, 'field text is selected item value');
        assert.equal(instance.option('displayValue'), 1, 'options \'displayValue\' is selected item value');
    });

    QUnit.test('dataSource', function(assert) {
        const dataSource1 = [1, 2, 3];
        const dataSource2 = [4, 5];
        const instance = $('#lookup').dxLookup({ dataSource: dataSource1 }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');
        const list = getList();

        assert.strictEqual(instance._dataSource, list._dataSource);
        assert.deepEqual(instance._dataSource._items, dataSource1);

        instance.option('dataSource', dataSource2);
        assert.strictEqual(instance._dataSource, list._dataSource);
        assert.deepEqual(instance._dataSource._items, dataSource2);
    });

    QUnit.test('items', function(assert) {
        const items1 = [1, 2, 3];
        const items2 = [4, 5];
        const instance = $('#lookup').dxLookup({ items: items1 }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');
        const list = getList();

        assert.deepEqual(list._dataSource._items, items1);

        instance.option('items', items2);
        assert.deepEqual(list._dataSource._items, items2);
    });

    QUnit.test('items after null data source', function(assert) {
        const items2 = [4, 5];
        const instance = $('#lookup').dxLookup({}).dxLookup('instance');

        instance.option('items', items2);

        $(instance._$field).trigger('dxclick');

        assert.deepEqual(getList()._dataSource._items, items2);
    });

    QUnit.test('title', function(assert) {
        const instance = $('#lookup').dxLookup({
            dataSource: [],
            'dropDownOptions.title': 'title'
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        assert.equal(instance._popup.option('title'), 'title', 'title sets to popup correctly on init');

        instance.option('dropDownOptions.title', 'title2');
        assert.equal(instance._popup.option('title'), 'title2', 'title sets to popup correctly on change');
    });

    QUnit.test('fullScreen', function(assert) {
        const instance = $('#lookup').dxLookup({
            dataSource: [],
            'dropDownOptions.fullScreen': true,
            usePopover: false
        }).dxLookup('instance');

        let popup;

        $(instance._$field).trigger('dxclick');

        popup = instance._popup;
        assert.equal(popup.option('fullScreen'), true, 'fullScreen sets to popup correctly on init');

        instance.option('dropDownOptions.fullScreen', false);
        $(instance._$field).trigger('dxclick');
        popup = instance._popup;
        assert.equal(popup.option('fullScreen'), false, 'fullScreen sets to popup correctly on change');
    });

    QUnit.test('placeholder', function(assert) {
        const instance = $('#lookup').dxLookup({
            dataSource: []
        })
            .dxLookup('instance');

        assert.equal($(instance._$field).text(), 'Select...', 'default value');

        instance.option('placeholder', 'placeholder');
        assert.equal($(instance._$field).text(), 'placeholder', 'set as option');
    });

    QUnit.test('minSearchLength', function(assert) {
        const placeholder = 'placeholder';
        const instance = $('#lookup').dxLookup({
            dataSource: ['abc', 'def'],
            minSearchLength: 3,
            searchTimeout: 0,
            placeholder: placeholder
        }).dxLookup('instance');

        $(instance._$field).trigger('dxclick');

        const search = instance._searchBox;
        const $field = $(instance._$field);
        const $list = $(getList().$element());

        assert.equal($list.find('.dx-list-item').filter(':visible').length, 0, 'No items are expected to be shown');
        assert.equal($field.text(), placeholder);

        instance.option('minSearchLength', 0);
        assert.equal($list.find('.dx-list-item').filter(':visible').length, 2);
        assert.equal($field.text(), placeholder);

        instance.option('minSearchLength', 3);
        assert.equal($list.find('.dx-list-item').filter(':visible').length, 0);
        assert.equal($field.text(), placeholder);

        const selectedValueText = 'def';
        instance.option('value', selectedValueText);
        assert.equal($(instance._$field).text(), selectedValueText);

        search.option('value', 'abc');
        assert.strictEqual($list.find('.dx-list-item').filter(':visible').length, 1);
        assert.equal($(instance._$field).text(), selectedValueText);

        search.option('value', 'ab');
        assert.strictEqual($list.find('.dx-list-item').filter(':visible').length, 0);
        assert.equal($(instance._$field).text(), selectedValueText);
    });

    QUnit.test('applyValueMode affects on Apply button rendering', function(assert) {
        const instance = $('#lookup').dxLookup({
            dataSource: ['abc', 'def'],
            applyValueMode: 'instantly'
        }).dxLookup('instance');

        instance.open();
        let $popupWrapper = $('.dx-popup-wrapper');
        assert.equal($popupWrapper.find('.dx-popup-done.dx-button').length, 0, 'Apply button is not rendered');
        assert.ok(!instance.option('showDoneButton'), '\'showDoneButton\' option is false');

        instance.close();
        instance.option('applyValueMode', 'useButtons');
        instance.open();

        $popupWrapper = $('.dx-popup-wrapper');
        assert.equal($popupWrapper.find('.dx-popup-done.dx-button').length, 1, 'Apply button is rendered');
    });

    QUnit.test('\'showCancelButton\' option should affect on Cancel button rendering', function(assert) {
        const instance = $('#lookup').dxLookup({
            dataSource: ['abc', 'def'],
            showCancelButton: true
        }).dxLookup('instance');

        instance.open();
        let $popupWrapper = $('.dx-popup-wrapper');
        assert.equal($popupWrapper.find('.dx-popup-cancel.dx-button').length, 1, 'Apply button is not rendered');

        instance.close();
        instance.option('showCancelButton', false);
        instance.open();

        $popupWrapper = $('.dx-popup-wrapper');
        assert.equal($popupWrapper.find('.dx-popup-cancel.dx-button').length, 0, 'Apply button is not rendered');
    });

    QUnit.test('search wrapper should not be rendered if the \'searchEnabled\' option is false', function(assert) {
        const instance = $('#lookup').dxLookup({
            searchEnabled: false,
            opened: true
        }).dxLookup('instance');

        assert.equal($(instance.content()).find('.' + LOOKUP_SEARCH_WRAPPER_CLASS).length, 0, 'search wrapper is not rendered');
    });

    QUnit.test('search wrapper should be rendered if the \'searchEnabled\' option is true', function(assert) {
        const instance = $('#lookup').dxLookup({
            searchEnabled: true,
            opened: true
        }).dxLookup('instance');

        assert.equal($(instance.content()).find('.' + LOOKUP_SEARCH_WRAPPER_CLASS).length, 1, 'search wrapper is rendered');
    });

    QUnit.test('clear button option runtime change', function(assert) {
        const getClearButton = (instance) => $(instance.content()).parent().find(toSelector(CLEAR_BUTTON_CLASS)).get(0);

        const lookup = $('#lookup')
            .dxLookup({
                deferRendering: false,
                showClearButton: true
            })
            .dxLookup('instance');

        let $clearButton = getClearButton(lookup);
        assert.ok($clearButton, 'clearButton is rendered');

        lookup.option('showClearButton', false);
        $clearButton = getClearButton(lookup);
        assert.notOk($clearButton, 'clearButton is not rendered after option runtime change');
    });
});

QUnit.module('popup options', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('skip gesture event class attach only when popup is opened', function(assert) {
        const SKIP_GESTURE_EVENT_CLASS = 'dx-skip-gesture-event';
        const $lookup = $('#lookup').dxLookup({
            items: [1, 2, 3]
        });

        assert.equal($lookup.hasClass(SKIP_GESTURE_EVENT_CLASS), false, 'skip gesture event class was not added when popup is closed');

        $lookup.dxLookup('option', 'opened', true);
        assert.equal($lookup.hasClass(SKIP_GESTURE_EVENT_CLASS), true, 'skip gesture event class was added after popup was opened');

        $lookup.dxLookup('option', 'opened', false);
        assert.equal($lookup.hasClass(SKIP_GESTURE_EVENT_CLASS), false, 'skip gesture event class was removed after popup was closed');
    });

    QUnit.test('shading should present', function(assert) {
        const $lookup = $('#lookupOptions');

        const instance = $lookup.dxLookup({
            'dropDownOptions.shading': true,
            visible: true,
            usePopover: false
        }).dxLookup('instance');

        openPopupWithList(instance);
        const $wrapper = $(toSelector(OVERLAY_WRAPPER_CLASS));

        assert.ok($wrapper.hasClass(OVERLAY_SHADER_CLASS));

        instance.option('dropDownOptions.shading', false);
        assert.ok(!$wrapper.hasClass(OVERLAY_SHADER_CLASS));
    });

    QUnit.test('popup should not be hidden after outsideClick', function(assert) {
        const $lookup = $('#lookupOptions');
        const instance = $lookup.dxLookup({
            dataSource: [1, 2, 3]
        }).dxLookup('instance');

        openPopupWithList(instance);

        const $overlay = $(toSelector(OVERLAY_CONTENT_CLASS)).eq(0);

        $(document).trigger('dxpointerdown');
        assert.equal($overlay.is(':visible'), true, 'overlay is not hidden');
    });

    QUnit.test('lookup popup should be hidden after click outside was present', function(assert) {
        const $lookup = $('#lookupOptions');
        const instance = $lookup.dxLookup({
            'dropDownOptions.closeOnOutsideClick': true,
            visible: true,
            usePopover: false
        }).dxLookup('instance');

        openPopupWithList(instance);

        const $overlay = $(toSelector(OVERLAY_CONTENT_CLASS)).eq(0);

        $($overlay).trigger('dxpointerdown');
        assert.equal($overlay.is(':visible'), true, 'overlay is not hidden');

        $(document).trigger('dxpointerdown');
        assert.equal($overlay.is(':visible'), false, 'overlay is hidden');
    });

    QUnit.test('custom titleTemplate option', function(assert) {
        const $lookup = $('#lookupOptions').dxLookup({
            'dropDownOptions.titleTemplate': 'customTitle',
            visible: true,
            showCancelButton: false
        });

        openPopupWithList($lookup.dxLookup('instance'));

        const $title = $(toSelector(POPUP_TITLE_CLASS));

        assert.equal($.trim($title.text()), 'testTitle', 'title text is correct');
    });

    QUnit.test('custom titleTemplate option is set correctly on init', function(assert) {
        const $lookup = $('#lookupOptions').dxLookup({
            'dropDownOptions.titleTemplate': function(titleElement) {
                assert.equal(isRenderer(titleElement), !!config().useJQuery, 'titleElement is correct');
                let result = '<div class=\'test-title-renderer\'>';
                result += '<h1>Title</h1>';
                result += '</div>';
                return result;
            }
        });
        const instance = $lookup.dxLookup('instance');

        openPopupWithList(instance);

        const $title = $(toSelector(POPUP_TITLE_CLASS));

        assert.ok($title.find(toSelector('test-title-renderer')).length, 'option \'titleTemplate\' was set successfully');
    });

    QUnit.test('custom titleTemplate and onTitleRendered option is set correctly by options', function(assert) {
        assert.expect(2);

        const $lookup = $('#lookupOptions').dxLookup(); const instance = $lookup.dxLookup('instance');

        instance.option('dropDownOptions.onTitleRendered', function(e) {
            assert.ok(true, 'option \'onTitleRendered\' successfully passed to the popup widget raised on titleTemplate');
        });

        instance.option('dropDownOptions.titleTemplate', function(titleElement) {
            let result = '<div class=\'changed-test-title-renderer\'>';
            result += '<h1>Title</h1>';
            result += '</div>';

            return result;
        });

        openPopupWithList(instance);
        const $title = $(toSelector(POPUP_TITLE_CLASS));

        assert.ok($title.find(toSelector('changed-test-title-renderer')).length, 'option \'titleTemplate\' successfully passed to the popup widget');
    });

    QUnit.test('popup does not close when filtering datasource has item equal selected item', function(assert) {
        const $lookup = $('#lookup').dxLookup({
            dataSource: ['red', 'yellow'],
            value: 'yellow',
            searchTimeout: 0
        });

        $lookup.dxLookup('option', 'opened', true);

        const $popupContent = $(toSelector(POPUP_CONTENT_CLASS));
        keyboardMock($popupContent.find('.' + TEXTEDITOR_INPUT_CLASS)).type('y');

        assert.ok($lookup.dxLookup('option', 'opened'), 'lookup stays opened');
    });

    QUnit.test('popup should have correct width when lookup rendered in invisible area', function(assert) {
        const originalCurrentDevice = devices.current();
        devices.current({ platform: 'generic' });

        try {
            const $lookup = $('#lookup');
            const $lookupWrapper = $lookup.wrap('<div>').parent().hide();
            const lookup = $lookup.dxLookup({
                items: [1, 2, 3],
                deferRendering: false,
                usePopover: true,
                width: 200
            }).dxLookup('instance');

            $lookupWrapper.show();

            $lookup.css('border', '1px solid black');
            lookup.option('opened', true);

            const $overlayContent = $('.dx-overlay-content');
            assert.equal($overlayContent.outerWidth(), $lookup.outerWidth(), 'width equal to lookup width');
        } finally {
            devices.current(originalCurrentDevice);
        }
    });

    QUnit.test('popup height should be saved after configuration', function(assert) {
        $('#lookup').dxLookup({
            dataSource: [1, 2, 3, 4, 5],
            opened: true,
            dropDownOptions: {
                fullScreen: false,
                height: $(window).height() * 0.8
            },
            usePopover: false
        });

        assert.roughEqual($('.dx-overlay-content').outerHeight(), Math.round($(window).height() * 0.8), 1, 'height equal to lookup height');
    });

    QUnit.test('popup height should be stretch when data items are loaded asynchronously', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        $('#lookup').dxLookup({
            dataSource: new CustomStore({
                load: function(loadOptions) {
                    const deferred = $.Deferred();
                    const employeesList = ['John Heart', 'Samantha Bright', 'Arthur Miller', 'Robert Reagan', 'Greta Sims', 'Brett Wade',
                        'Sandra Johnson', 'Ed Holmes', 'James Anderson', 'Antony Remmen', 'Olivia Peyton', 'Taylor Riley',
                        'Amelia Harper', 'Wally Hobbs', 'Brad Jameson'];

                    window.setTimeout(function() {
                        deferred.resolve(employeesList);
                    }, 0);

                    return deferred.promise();

                },
                byKey: function(key) {
                    return key;
                },
                update: function(values) { }
            }),
            dropDownOptions: { showTitle: false },
            usePopover: false,
            opened: true
        });

        const defaultHeight = $('.dx-overlay-content').outerHeight();

        this.clock.tick();

        assert.ok($('.dx-overlay-content').outerHeight() > defaultHeight, 'popup height is changed when data is loaded');
    });

    QUnit.test('popover height should be recalculated after async datasource load(T655040)', function(assert) {
        if(browser.mozilla && parseFloat(browser.version) < 71 || devices.real().deviceType !== 'desktop') {
            assert.expect(0);
            return;
        }

        const $rootLookup = $('<div>').appendTo('body');

        try {
            const items = ['item 1', 'item 2', 'item 3', 'item 4'];
            const instance = $rootLookup.dxLookup({
                dataSource: new CustomStore({
                    load: function() {
                        const deferred = $.Deferred();

                        setTimeout(function() {
                            deferred.resolve(items);
                        }, 500);

                        return deferred.promise();
                    },
                    byKey: function(key) {
                        const deferred = new $.Deferred();
                        setTimeout(function() {
                            deferred.resolve(items[0]);
                        }, 500);
                        return deferred.promise();
                    }
                }),
                width: 300,
                searchEnabled: false,
                dropDownOptions: {
                    position: 'center',
                    container: $('body')
                },
                target: $('body'),
                usePopover: true,
                opened: true
            }).dxLookup('instance');

            this.clock.tick(1000);
            assert.ok($(instance.content()).height() >= $(instance.content()).find('.dx-scrollable-content').height(), $(instance.content()).height() + ' >= ' + $(instance.content()).find('.dx-scrollable-content').height());
        } finally {
            $rootLookup.remove();
        }
    });

    ['onTitleRendered', 'closeOnOutsideClick'].forEach(option => {
        QUnit.test(`${option} should be passed to the popup`, function(assert) {
            const stub = sinon.stub();
            const fullOptionName = `dropDownOptions.${option}`;

            const instance = $('#lookup').dxLookup({
                [fullOptionName]: stub,
                deferRendering: false
            }).dxLookup('instance');
            const popup = instance._popup;

            assert.strictEqual(popup.option(option), stub, `${option} is passed to the popup on init`);

            instance.option(fullOptionName, null);
            assert.strictEqual(popup.option(option), null, `${option} is passed to the popup after runtime change`);
        });
    });

    QUnit.test('animation option should be passed to the popup', function(assert) {
        const animationStub = {
            show: { type: 'slide', duration: 400 }
        };

        const instance = $('#lookup').dxLookup({
            'dropDownOptions.animation': animationStub,
            deferRendering: false
        }).dxLookup('instance');
        const popup = instance._popup;

        assert.deepEqual(popup.option('animation'), animationStub, 'animation option is passed to the popup on init');

        instance.option('dropDownOptions.animation', null);
        assert.strictEqual(popup.option('animation'), null, 'animation option is passed to the popup after runtime change');
    });
});

QUnit.module('list options', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('list option bouncing', function(assert) {
        const dataSource = new DataSource({
            store: [1, 2, 3],
            paginate: false
        });

        const $lookup = $('#lookupOptions').dxLookup({
            dataSource: dataSource,
            pageLoadMode: 'scrollBottom',
            nextButtonText: 'test',
            pullRefreshEnabled: true,
            pullingDownText: 'testPulling',
            pulledDownText: 'testPulled',
            refreshingText: 'testRefresh',
            pageLoadingText: 'testLoading'
        });

        const instance = $lookup.dxLookup('instance');

        openPopupWithList(instance);

        const $list = $(toSelector(LIST_CLASS)); const list = $list.dxList('instance');

        assert.equal(list.option('pageLoadMode'), 'scrollBottom', 'pageLoadMode was bounced');
        instance.option('pageLoadMode', 'nextButton');
        assert.equal(list.option('pageLoadMode'), 'nextButton', 'pageLoadMode was changed');

        assert.equal(list.option('nextButtonText'), 'test', 'nextButtonText was bounced');
        instance.option('nextButtonText', 'testchange');
        assert.equal(list.option('nextButtonText'), 'testchange', 'nextButtonText was changed');

        assert.equal(list.option('pullRefreshEnabled'), true, 'pullRefreshEnabled was bounced');
        instance.option('pullRefreshEnabled', false);
        assert.equal(list.option('pullRefreshEnabled'), false, 'pullRefreshEnabled was changed');

        assert.equal(list.option('pullingDownText'), 'testPulling', 'pullingDownText was bounced');
        instance.option('pullingDownText', 'testPullingChange');
        assert.equal(list.option('pullingDownText'), 'testPullingChange', 'pullingDownText was changed');

        assert.equal(list.option('pulledDownText'), 'testPulled', 'pulledDownText was bounced');
        instance.option('pulledDownText', 'testPulledChange');
        assert.equal(list.option('pulledDownText'), 'testPulledChange', 'pulledDownText was changed');

        assert.equal(list.option('refreshingText'), 'testRefresh', 'refreshingText was bounced');
        instance.option('refreshingText', 'testRefreshChange');
        assert.equal(list.option('refreshingText'), 'testRefreshChange', 'refreshingText was changed');

        assert.equal(list.option('pageLoadingText'), 'testLoading', 'pageLoadingText was bounced');
        instance.option('pageLoadingText', 'testLoadingChange');
        assert.equal(list.option('pageLoadingText'), 'testLoadingChange', 'pageLoadingText was changed');
    });

    QUnit.test('group options bouncing', function(assert) {
        const dataSource = [{ key: 'header1', items: ['1', '2'] },
            { key: 'header2', items: ['1', '2'] }];
        const $lookup = $('#lookupOptions').dxLookup({
            dataSource: dataSource,
            grouped: true,
            groupTemplate: 'testGroupTemplate'
        });
        const instance = $lookup.dxLookup('instance');

        openPopupWithList(instance);

        const $list = $(toSelector(LIST_CLASS)); const list = $list.dxList('instance');

        assert.equal(list.option('grouped'), true, 'grouped was bounced');

        let $title = $(toSelector(LIST_GROUP_HEADER_CLASS));
        assert.equal($title.length, 2, 'there are 2 group titles');
        $title = $title.eq(0);
        assert.equal($.trim($title.text()), 'testGroupTemplate', 'title text is correct');

        instance.option('groupTemplate', function(itemData, itemIndex, itemElement) {
            assert.equal(isRenderer(itemElement), !!config().useJQuery, 'itemElement is correct');
            return 'test';
        });

        $title = $(toSelector(LIST_GROUP_HEADER_CLASS)).eq(0);
        assert.equal($.trim($title.text()), 'test', 'title text is correct');
    });
});

QUnit.module('Native scrolling', () => {
    QUnit.test('After load new page scrollTop should not be changed', function(assert) {
        const data = [];
        const done = assert.async();

        for(let i = 100; i >= 0; i--) {
            data.push(i);
        }

        const $lookup = $('#lookup')
            .wrap($('<div>').css('position', 'static'))
            .dxLookup({
                searchEnabled: true,
                dataSource: {
                    store: new ArrayStore(data),
                    paginate: true,
                    pageSize: 40
                },
                dropDownOptions: {
                    fullScreen: false,
                    height: '50%'
                },
                searchTimeout: 0,
                width: 200,
                usePopover: false
            });

        $lookup.dxLookup('instance').open();

        const listInstance = $('.dx-list').dxList('instance');

        listInstance.option('pageLoadMode', 'scrollBottom');
        listInstance.option('useNativeScrolling', 'true');
        listInstance.option('useNative', 'true');

        listInstance.scrollTo(1000);
        const scrollTop = listInstance.scrollTop();

        setTimeout(function() {
            assert.roughEqual(listInstance.scrollTop(), scrollTop, 2, 'scrollTop is correctly after new page load');
            done();
        });
    });

    QUnit.test('Popup height should be decrease after a loading of new page and searching', function(assert) {
        const data = [];

        for(let i = 100; i >= 0; i--) {
            data.push(i);
        }
        data.push('a');

        const $lookup = $('#lookup')
            .wrap($('<div>').css('position', 'static'))
            .dxLookup({
                searchEnabled: true,
                dataSource: {
                    store: new ArrayStore(data),
                    paginate: true,
                    pageSize: 20
                },
                searchTimeout: 0,
                width: 200,
                usePopover: false,
                dropDownOptions: {
                    fullScreen: false,
                    height: 'auto'
                }
            });

        $lookup.dxLookup('instance').open();

        const $list = $('.dx-list');
        const listInstance = $('.dx-list').dxList('instance');

        listInstance.option('pageLoadMode', 'scrollBottom');
        listInstance.option('useNativeScrolling', 'true');
        listInstance.option('useNative', 'true');
        listInstance._loadNextPage();

        const listHeight = $list.outerHeight();

        const $input = $('.' + LOOKUP_SEARCH_CLASS).find('.' + TEXTEDITOR_INPUT_CLASS);
        const keyboard = keyboardMock($input);

        keyboard.type('a');

        const currentListHeight = $list.outerHeight();

        assert.notEqual(listHeight, currentListHeight, 'popup should be collapsed after search');
    });
});

QUnit.module('widget sizing render', () => {
    QUnit.test('default', function(assert) {
        const $element = $('#widget').dxLookup();

        assert.ok($element.outerWidth() > 0, 'outer width of the element must be more than zero');
    });

    QUnit.test('change width', function(assert) {
        const $element = $('#widget').dxLookup(); const instance = $element.dxLookup('instance'); const customWidth = 400;

        instance.option('width', customWidth);

        assert.strictEqual($element.outerWidth(), customWidth, 'outer width of the element must be equal to custom width');
    });
});

QUnit.module('focus policy', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.testInActiveWindow('T338144 - focused element should not be reset after popup is reopened if the \'searchEnabled\' is false', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const instance = $('#widget').dxLookup({
            items: [1, 2, 3],
            opened: true,
            searchEnabled: false
        }).dxLookup('instance');
        const $list = $($(instance.content()).find('.dx-list'));
        const $listItems = $list.find('.dx-item');
        const list = $list.dxList('instance');

        $($listItems.eq(1)).trigger('dxclick');
        instance.open();

        assert.equal($(list.option('focusedElement')).text(), $listItems.eq(1).text(), 'clicked item is focused after popup is reopened');
    });

    QUnit.test('field method returning overlay content', function(assert) {
        const $element = $('#widget').dxLookup({
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');
        const $field = instance.field();

        assert.ok($field.hasClass(LOOKUP_FIELD_CLASS), 'field has class dx-texteditor-input');
    });

    QUnit.testInActiveWindow('lookup search get focus on opening', function(assert) {
        const $element = $('#widget').dxLookup({
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        instance.focus();
        assert.ok($element.hasClass(FOCUSED_CLASS), '\'focus\' method focus field with closed overlay');

        instance.option('opened', true);

        const $searchBox = instance._$searchBox;
        assert.ok($searchBox.hasClass(FOCUSED_CLASS), '\'focus\' method focus searchBox with opened overlay');
    });

    QUnit.testInActiveWindow('lookup field should get focus when popup was closed', function(assert) {
        const $element = $('#widget').dxLookup({
            focusStateEnabled: true,
            opened: true
        });
        const instance = $element.dxLookup('instance');

        instance.close();

        assert.ok($element.hasClass(FOCUSED_CLASS), 'lookup field gets focus after popup closing');
    });

    QUnit.test('lookup should not lose focus when clicking inside popup', function(assert) {
        assert.expect(1);

        const $element = $('#widget').dxLookup({
            focusStateEnabled: true,
            opened: true
        });
        const instance = $element.dxLookup('instance');
        const $content = $(instance._popup.$content());

        $($content).on('dxpointerdown', function(e) {
            assert.ok(!e.isDefaultPrevented(), 'elements inside popup get focus');
        });

        $($content).trigger('dxpointerdown');
    });
});

QUnit.module('keyboard navigation', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('lookup popup open by enter key press', function(assert) {
        assert.expect(2);

        const $element = $('#widget').dxLookup({
            focusStateEnabled: true
        });
        const instance = $element.dxLookup('instance');
        const $field = $(instance._$field).focusin();
        const keyboard = keyboardMock($field);

        assert.ok(!instance.option('opened'));
        keyboard.keyDown('enter');

        assert.ok(instance.option('opened'), 'enter key on field open popup');
    });

    QUnit.test('lookup popup open by space key press', function(assert) {
        assert.expect(2);

        const $element = $('#widget').dxLookup({
            focusStateEnabled: true
        });
        const instance = $element.dxLookup('instance');
        const $field = $(instance._$field).focusin();
        const keyboard = keyboardMock($field);

        assert.ok(!instance.option('opened'));
        keyboard.keyDown('space');

        assert.ok(instance.option('opened'), 'space key on field open popup');
    });

    QUnit.testInActiveWindow('lookup search field focused after open popup', function(assert) {
        const $element = $('#widget').dxLookup({
            opened: true,
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        assert.ok(instance.option('opened'));
        assert.ok(instance._$searchBox.hasClass(FOCUSED_CLASS), 'searchBox has focus after open popup');
    });

    QUnit.testInActiveWindow('lookup-list should be focused after \'down\' key pressing', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const $element = $('#widget').dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        const keyboard = keyboardMock(instance._$searchBox.find('.dx-texteditor-input'));
        keyboard.keyDown('down');

        assert.ok(instance._$list.find('.dx-list-item').first().hasClass(FOCUSED_CLASS), 'list-item is focused after down key pressing');
    });

    QUnit.testInActiveWindow('lookup-list keyboard navigation should work after focusing on list', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const $element = $('#widget').dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        $(instance._$list).focus();
        assert.ok(instance._$list.find('.dx-list-item').eq(0).hasClass(FOCUSED_CLASS), 'list-item is focused after focusing on list');

        const keyboard = keyboardMock(instance._$list);
        keyboard.keyDown('down');

        assert.ok(instance._$list.find('.dx-list-item').eq(1).hasClass(FOCUSED_CLASS), 'second list-item is focused after down key pressing');
    });

    QUnit.testInActiveWindow('lookup item should be selected after \'enter\' key pressing', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const $element = $('#widget').dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        const keyboard = keyboardMock(instance._$searchBox.find('.dx-texteditor-input'));
        keyboard.keyDown('down');
        keyboard.keyDown('down');
        keyboard.keyDown('enter');

        assert.equal(instance.option('value'), 2, 'value is correct');
    });

    QUnit.testInActiveWindow('lookup item should be selected after \'space\' key pressing', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const $element = $('#widget').dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        const keyboard = keyboardMock(instance._$searchBox.find('.dx-texteditor-input'));
        keyboard.keyDown('down');
        keyboard.keyDown('down');
        keyboard.keyDown('space');

        assert.equal(instance.option('value'), 2, 'value is correct');
    });

    QUnit.testInActiveWindow('keyboard for lookup-list should work correctly after \'searchEnabled\' option changed', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const $element = $('#widget').dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        instance.option('searchEnabled', false);

        const keyboard = keyboardMock(instance._$list);
        keyboard.keyDown('down');

        assert.ok(instance._$list.find('.dx-list-item').first().hasClass(FOCUSED_CLASS), 'list-item is focused after down key pressing');
    });

    QUnit.test('space key press on readOnly lookup doesn\'t toggle popup visibility', function(assert) {
        const instance = $('#lookup').dxLookup({
            items: [0, 1, 2],
            readOnly: true,
            focusStateEnabled: true
        }).dxLookup('instance');
        const $field = $(instance._$field).focusin();
        const keyboard = keyboardMock($field);

        keyboard.keyDown('space');
        assert.ok(!instance.option('opened'), 'when we press space key - popup is still hidden');

        instance.option('readOnly', false);
        keyboard.keyDown('space');
        assert.ok(instance.option('opened'), 'when we press space key - popup is visible after option changed');
    });

    QUnit.test('enter key press on readOnly lookup doesn\'t toggle popup visibility', function(assert) {
        const instance = $('#lookup').dxLookup({
            items: [0, 1, 2],
            readOnly: true,
            focusStateEnabled: true
        }).dxLookup('instance');
        const $field = $(instance._$field).focusin();
        const keyboard = keyboardMock($field);

        keyboard.keyDown('enter');
        assert.ok(!instance.option('opened'), 'when we press enter key - popup is still hidden');

        instance.option('readOnly', false);
        keyboard.keyDown('enter');
        assert.ok(instance.option('opened'), 'when we press enter key - popup is visible after option changed');
    });

    QUnit.test('escape key press close overlay with search enabled', function(assert) {
        const instance = $('#lookup').dxLookup({
            items: [0, 1, 2],
            opened: true,
            focusStateEnabled: true,
            searchEnabled: true
        }).dxLookup('instance');
        const keyboard = keyboardMock(instance._$searchBox.find('.dx-texteditor-input'));

        assert.ok(instance.option('opened'), 'overlay opened');

        keyboard.keyDown('esc');
        assert.ok(!instance.option('opened'), 'overlay close on escape');
    });

    QUnit.test('escape key press close overlay without search enabled', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const instance = $('#lookup').dxLookup({
            items: [0, 1, 2],
            opened: true,
            focusStateEnabled: true,
            searchEnabled: false
        }).dxLookup('instance');
        const keyboard = keyboardMock(instance._$list);

        assert.ok(instance.option('opened'), 'overlay opened');

        keyboard.keyDown('esc');
        assert.ok(!instance.option('opened'), 'overlay close on escape');
    });

    QUnit.test('T320459 - the \'space\' key press should prevent default behavior while navigating list', function(assert) {
        const lookup = $('#lookup').dxLookup({
            items: [1, 2, 3],
            opened: true,
            focusStateEnabled: true
        }).dxLookup('instance');

        const $popupInput = $($(lookup.content()).find('.' + TEXTEDITOR_INPUT_CLASS));
        const keyboard = keyboardMock($popupInput);
        let event;

        getList().option('focusStateEnabled', true);

        $($popupInput).on('keydown', function(e) {
            if(e.key === ' ') {
                event = e;
            }
        });

        $popupInput.focus();

        keyboard
            .press('down')
            .press('space');

        assert.ok(event.isDefaultPrevented(), 'default is prevented');
    });

    QUnit.test('T320459 - the \'space\' key press on editor should prevent default behavior', function(assert) {
        const lookup = $('#lookup').dxLookup({
            items: [1, 2, 3],
            focusStateEnabled: true
        }).dxLookup('instance');

        const $input = $(lookup.field());
        const keyboard = keyboardMock($input);
        let event;

        $($input).on('keydown', function(e) {
            if(e.key === ' ') {
                event = e;
            }
        });

        $input.focus();

        keyboard
            .press('space');

        assert.ok(event.isDefaultPrevented(), 'default is prevented');
    });

    QUnit.test('\'Home\', \'End\' keys does not changed default behaviour in searchField', function(assert) {
        const lookup = $('#lookup').dxLookup({
            items: [1, 2, 3],
            focusStateEnabled: true,
            opened: true
        }).dxLookup('instance');

        const $input = $('.' + LOOKUP_SEARCH_CLASS + ' input');
        const keyboard = keyboardMock($input);

        keyboard.keyDown('home');
        keyboard.keyDown('enter');

        assert.equal(lookup.option('value'), undefined, 'home key works correctly');
    });

    QUnit.test('Pressing escape when focus \'cancel\' button must hide the popup', function(assert) {
        if(devices.real().deviceType !== 'desktop') {
            assert.ok(true, 'test does not actual for mobile devices');
            return;
        }

        const escapeKeyDown = $.Event('keydown', { key: 'Escape' });
        const $element = $('#widget').dxLookup({
            opened: true,
            focusStateEnabled: true,
            showCancelButton: true,
            searchEnabled: true
        });
        const instance = $element.dxLookup('instance');

        $(instance.content())
            .parent()
            .find('.dx-button.dx-popup-cancel')
            .trigger(escapeKeyDown);

        assert.ok(!instance.option('opened'));
    });
});

QUnit.module('dataSource integration', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
        fx.off = true;
        this.$element = $('#lookup');
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, function() {
    QUnit.test('search should be execute after paste', function(assert) {
        this.$element.dxLookup({
            dataSource: ['one', 'two', 'three'],
            opened: true,
            searchEnabled: true,
            searchTimeout: 0,
            searchMode: 'contains'
        });

        const $input = $(toSelector(POPUP_CONTENT_CLASS) + ' ' + toSelector(TEXTEDITOR_INPUT_CLASS));
        $($input.val('o')).trigger('input');
        this.clock.tick();
        assert.equal($('.dx-list-item').length, 2, 'filters execute on input event');
    });

    [
        { loadDelay: 200, indicateLoading: false },
        { loadDelay: 1000, indicateLoading: true }
    ].forEach(({ loadDelay, indicateLoading }) => {
        QUnit.test(`search with loading delay = ${loadDelay} should ${indicateLoading ? '' : 'not'} lead to the load panel being displayed`, function(assert) {
            const instance = this.$element.dxLookup({
                dataSource: {
                    load: () => {
                        const d = new $.Deferred();

                        setTimeout(() => {
                            d.resolve([1, 2, 3]);
                        }, loadDelay);

                        return d;
                    }
                },
                opened: true,
                searchEnabled: true,
                searchTimeout: 0,
                searchMode: 'contains',
                useNativeScrolling: false
            }).dxLookup('instance');

            this.clock.tick(loadDelay);
            const $content = $(instance.content());
            const $input = $content.find(`.${LOOKUP_SEARCH_CLASS} .${TEXTEDITOR_INPUT_CLASS}`);
            const $loadPanel = $content.find('.dx-scrollview-loadpanel');
            const keyboard = keyboardMock($input);

            keyboard.type('2');
            this.clock.tick(loadDelay / 2);
            assert.strictEqual($loadPanel.is(':visible'), indicateLoading, `load panel is ${indicateLoading ? '' : 'not'} visible (${loadDelay / 2}ms after the loading started)`);

            this.clock.tick(loadDelay / 2);
            assert.ok($loadPanel.is(':hidden'), 'load panel is not visible when loading has been finished');
        });
    });

    QUnit.test('dataSouce loading with delay = 1000 should not lead to the load panel being displayed when search is disabled', function(assert) {
        const loadDelay = 1000;
        const instance = this.$element.dxLookup({
            dataSource: {
                load: () => {
                    const d = new $.Deferred();

                    setTimeout(() => {
                        d.resolve([1, 2, 3]);
                    }, loadDelay);

                    return d;
                }
            },
            searchEnabled: false,
            useNativeScrolling: false,
            opened: true
        }).dxLookup('instance');

        this.clock.tick(loadDelay);
        const $content = $(instance.content());
        const $loadPanel = $content.find('.dx-scrollview-loadpanel');

        instance.getDataSource().load();
        this.clock.tick(loadDelay / 2);
        assert.ok($loadPanel.is(':hidden'), `load panel is not visible (${loadDelay / 2}ms after the loading started)`);

        this.clock.tick(loadDelay / 2);
        assert.ok($loadPanel.is(':hidden'), 'load panel is not visible when loading has been finished');
    });
});


QUnit.module('Validation', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('Validation message', function(assert) {
        const $element = $('#widget').dxLookup(); const instance = $element.dxLookup('instance');

        instance.option({
            isValid: false,
            validationError: { message: 'Some error happened' }
        });

        assert.ok(instance);

    });

    QUnit.test('widget should render with \'validationError === null\'', function(assert) {
        const $element = $('#widget').dxLookup(); const instance = $element.dxLookup('instance');

        instance.option({
            isValid: true,
            validationError: null
        });

        assert.ok(instance);
    });

    QUnit.test('Pending indicator is rendered', function(assert) {
        const $element = $('#widget').dxLookup();
        const instance = $element.dxLookup('instance');

        instance.option('validationStatus', 'pending');
        assert.ok($element.find('.dx-pending-indicator').dxLoadIndicator('instance').option('visible'));
    });

    QUnit.test('Lookup should select an item in the grouped list', function(assert) {
        const data = [{
            'ID': 1,
            'Assigned': 'Mr. John Heart',
            'Subject': 'Choose between PPO and HMO Health Plan'
        }, {
            'ID': 2,
            'Assigned': 'Mr. John Heart',
            'Subject': 'Google AdWords Strategy'
        }, {
            'ID': 3,
            'Assigned': 'Mr. YBob',
            'Subject': 'New Brochures'
        }];

        const $element = $('#widget').dxLookup({
            dataSource: new DataSource({
                store: data,
                key: 'ID',
                group: 'Assigned'
            }),
            grouped: true,
            displayExpr: 'Subject',
            opened: true
        });
        const instance = $element.dxLookup('instance');

        $('.dx-list-item .dx-list-item-content').eq(2).trigger('dxclick');

        assert.deepEqual(instance.option('value'), {
            'ID': 3,
            'Assigned': 'Mr. YBob',
            'Subject': 'New Brochures'
        }, 'option \'value\' is correct');

        assert.deepEqual(instance.option('text'), 'New Brochures', 'option \'text\' is correct');
        assert.equal($element.find('.dx-lookup-field').text(), 'New Brochures', 'text field is correct');
    });
});

QUnit.module('device and theme specific tests', {
    beforeEach: function() {
        this._originalDevice = devices.current();
    },

    afterEach: function() {
        devices.current(this._originalDevice);
    }
}, () => {
    QUnit.test('search button on iOS', function(assert) {
        devices.current('iPad');

        const lookup = $('#secondLookup').dxLookup({
            displayExpr: 'value',
            valueExpr: 'value',
            value: 3,
            searchTimeout: 0
        }).dxLookup('instance');

        openPopupWithList(lookup);

        const $popupWrapper = $('.dx-popup-wrapper');

        assert.equal($popupWrapper.find('.dx-popup-title').find('.dx-button').length, 1, 'button is present in popup title');
        assert.equal($popupWrapper.find('.dx-list').length, 1, 'list is present in popup');
    });

    QUnit.test('popup title collapse if empty title option (B232073)', function(assert) {
        const instance = $('#lookup').dxLookup({}).dxLookup('instance');

        $(instance._$field).trigger('dxclick');
        const popup = instance._popup;

        const $popupTitle = $(popup._wrapper()).find('.dx-popup-title');
        assert.ok($popupTitle.height() > 0);
    });
});

let helper;
if(devices.real().deviceType === 'desktop') {
    [true, false].forEach((searchEnabled) => {
        QUnit.module(`Aria accessibility, searchEnabled: ${searchEnabled}`, {
            beforeEach: function() {
                helper = new ariaAccessibilityTestHelper({
                    createWidget: ($element, options) => new Lookup($element,
                        $.extend({
                            searchEnabled: searchEnabled
                        }, options))
                });
            },
            afterEach: function() {
                helper.$widget.remove();
            }
        }, () => {
            QUnit.test(`opened: true, searchEnabled: ${searchEnabled}`, function() {
                helper.createWidget({ opened: true });

                const $field = helper.$widget.find(`.${LOOKUP_FIELD_CLASS}`);
                const $list = $(`.${LIST_CLASS}`);
                const $input = helper.widget._popup.$content().find(`.${TEXTEDITOR_INPUT_CLASS}`);

                helper.checkAttributes($list, { id: helper.widget._listId, 'aria-label': 'No data to display', role: 'listbox', tabindex: '0' }, 'list');
                helper.checkAttributes($field, { role: 'combobox', 'aria-expanded': 'true', 'aria-activedescendant': getList().getFocusedItemId(), tabindex: '0', 'aria-controls': helper.widget._listId }, 'field');
                helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._popupContentId }, 'widget');
                helper.checkAttributes(helper.widget._popup.$content(), { id: helper.widget._popupContentId }, 'popupContent');
                if($input.length) {
                    helper.checkAttributes($input, { autocomplete: 'off', type: 'text', spellcheck: 'false', tabindex: '0', role: 'textbox' }, 'input');
                }

                helper.widget.option('searchEnabled', !searchEnabled);
                helper.checkAttributes($list, { id: helper.widget._listId, 'aria-label': 'No data to display', role: 'listbox', tabindex: '0' }, 'list');
                helper.checkAttributes($field, { role: 'combobox', 'aria-expanded': 'true', 'aria-activedescendant': getList().getFocusedItemId(), tabindex: '0', 'aria-controls': helper.widget._listId }, 'field');
                helper.checkAttributes(helper.$widget, { 'aria-owns': helper.widget._popupContentId }, 'widget');
                helper.checkAttributes(helper.widget._popup.$content(), { id: helper.widget._popupContentId }, 'popupContent');
                if($input.length) {
                    helper.checkAttributes($input, { autocomplete: 'off', type: 'text', spellcheck: 'false', role: 'textbox' }, 'input');
                }
            });

            QUnit.test(`Opened: false, searchEnabled: ${searchEnabled}`, function() {
                helper.createWidget({ opened: false });

                const $field = helper.$widget.find(`.${LOOKUP_FIELD_CLASS}`);

                helper.checkAttributes(helper.$widget, {}, 'widget');
                helper.checkAttributes($field, { role: 'combobox', 'aria-expanded': 'false', tabindex: '0' }, 'field');

                helper.widget.option('searchEnabled', !searchEnabled);
                helper.checkAttributes(helper.$widget, {}, 'widget');
                helper.checkAttributes($field, { role: 'combobox', 'aria-expanded': 'false', tabindex: '0' }, 'field');
            });

            QUnit.test('aria-target for lookup\'s list should point to the list\'s focusTarget', function(assert) {
                helper.createWidget({ opened: true });

                const list = $(`.${LIST_CLASS}`).dxList('instance');
                assert.deepEqual(list._getAriaTarget(), list.$element(), 'aria target for nested list is correct');
            });
        });
    });
}

QUnit.module('default options', {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
}, () => {
    QUnit.test('Check default popupWidth, popupHeight, position.of for Material theme', function(assert) {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        const $lookup = $('<div>').prependTo('body');

        try {

            const lookup = $lookup.dxLookup({ dataSource: ['blue', 'orange', 'lime', 'purple'] }).dxLookup('instance');

            assert.equal(lookup.option('dropDownOptions.width')(), $lookup.outerWidth(), 'popup width match with lookup field width');

            $(lookup.field()).trigger('dxclick');

            assert.equal(lookup.option('dropDownOptions.height')(), $('.dx-list-item').height() * 4 + 16, 'popup height contains 4 list items and 2 paddings (8px)');

            lookup.close();

            lookup.option('searchEnabled', true);
            lookup.option('showCancelButton', true);

            $(lookup.field()).trigger('dxclick');

            assert.equal(lookup.option('dropDownOptions.height')(), $('.dx-lookup-search-wrapper').outerHeight() + $('.dx-list-item').height() * 4 + $('.dx-toolbar').outerHeight() + 16, 'popup height contains 4 list items when there are search and cancel button');

            lookup.close();
            lookup.option('dropDownOptions.width', 200);
            lookup.option('dropDownOptions.height', 300);

            $(lookup.field()).trigger('dxclick');

            assert.equal(lookup.option('dropDownOptions.height'), 300, 'popup height changed if change popupHeight option value');
            assert.equal(lookup.option('dropDownOptions.width'), 200, 'popup width changed if change popupWidth option value');

            lookup.close();

        } finally {
            $lookup.remove();
            themes.isMaterial = origIsMaterial;
        }
    });

    QUnit.test('Check popup position offset for Material theme', function(assert) {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        const $lookup = $('<div>').prependTo('body');

        try {

            const lookup = $lookup.dxLookup({ dataSource: ['blue', 'orange', 'lime', 'purple', 'red', 'green', 'yellow'], value: 'blue' }).dxLookup('instance');

            $(lookup.field()).trigger('dxclick');

            const $popup = $('.dx-popup-wrapper');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, -3.5, 1, 'offset of the lookup if first item is selected');

            getList().scrollTo(100);

            lookup.close();

            $(lookup.field()).trigger('dxclick');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, -3.5, 1, 'offset of the lookup after scrolling and without item selecting');

            lookup.close();

            $(lookup.field()).trigger('dxclick');

            getList().scrollTo(58);

            $('.dx-list-item').eq(1).trigger('dxclick');

            $(lookup.field()).trigger('dxclick');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, -3.5, 1, 'offset of the lookup after scrolling and cut-off item selecting');
            assert.roughEqual($('.dx-list-item').eq(1).position().top, getList().scrollTop(), 2, 'position of the selected item after scrolling and cut-off item selecting');

            lookup.close();

            lookup.option('value', 'purple');

            $(lookup.field()).trigger('dxclick');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, -2.5, 1, 'offset of the lookup if last item is selected');

            lookup.close();

            lookup.option('dataSource', []);

            $(lookup.field()).trigger('dxclick');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, 0, 1, 'offset of the lookup if not selected item');
        } finally {
            $lookup.remove();
            themes.isMaterial = origIsMaterial;
        }
    });

    QUnit.test('Check itemCenteringEnabled option for Material theme', function(assert) {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };

        const $lookup = $('<div>').prependTo('body');

        try {

            const lookup = $lookup.dxLookup({ dataSource: ['blue', 'orange', 'lime', 'purple', 'green'], value: 'blue' }).dxLookup('instance');

            lookup.option('usePopover', false);
            lookup.option('itemCenteringEnabled', false);

            $(lookup.field()).trigger('dxclick');

            let $popup = $('.dx-popup-wrapper');

            assert.roughEqual($popup.find('.dx-overlay-content').outerWidth(), $(window).width() * 0.8, 3, 'default popup width like generic');
            assert.roughEqual($popup.find('.dx-overlay-content').outerHeight(), $('.dx-list-item').height() * 5 + 2, 3, 'default popup height like generic');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, ($(window).height() - $popup.find('.dx-overlay-content').outerHeight()) / 2, 1, 'default popup position of window');

            lookup.option('dropDownOptions.position', 'top');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, 0, 1, 'popup position of window after change position');

            $(lookup.field()).trigger('dxclick');

            lookup.close();

            lookup.option('usePopover', true);

            $(lookup.field()).trigger('dxclick');

            const $popover = $('.dx-popup-wrapper');

            assert.equal($popover.find('.dx-overlay-content').outerWidth(), $(lookup.field()).outerWidth() + 2, 'popup width match with lookup field width');

            // android6 test fail
            // assert.roughEqual($popover.find('.dx-overlay-content').outerHeight(), $('.dx-list-item').height() * 5 + 2, 3, 'popup height auto if usePopover true');

            assert.roughEqual($popover.find('.dx-overlay-content').eq(0).position().top, $(lookup.field()).outerHeight() + 8, 2, 'popover position of lookup field with body padding 8px');

            lookup.close();

            lookup.option('itemCenteringEnabled', true);

            $(lookup.field()).trigger('dxclick');

            $popup = $('.dx-popup-wrapper');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, -3.5, 1, 'popup position if option is false');

            lookup.close();
        } finally {
            $lookup.remove();
            themes.isMaterial = origIsMaterial;
        }
    });


    QUnit.test('Check itemCenteringEnabled option for Generic theme', function(assert) {
        const $lookup = $('<div>').prependTo('body');

        try {

            const lookup = $lookup.dxLookup({ dataSource: ['blue', 'orange', 'lime', 'purple', 'green'], value: 'blue' }).dxLookup('instance');

            lookup.option('usePopover', true);
            lookup.option('itemCenteringEnabled', true);

            $(lookup.field()).trigger('dxclick');

            const $popover = $('.dx-popover-wrapper');

            assert.roughEqual($popover.find('.dx-overlay-content').eq(0).position().top, $(lookup.field()).outerHeight() + 8 + 10, 2, 'popover position of lookup field with body padding 8px');

            lookup.close();

            lookup.option('usePopover', false);

            $(lookup.field()).trigger('dxclick');

            const $popup = $('.dx-popup-wrapper');

            assert.roughEqual($popup.find('.dx-overlay-content').position().top, ($(window).height() - $popup.find('.dx-overlay-content').outerHeight()) / 2, 1, 'default popup position of window');

            lookup.close();
        } finally {
            $lookup.remove();
        }
    });


    QUnit.test('changing popupWidth in default options should change popover width', function(assert) {
        const defaultWidth = 100;

        Lookup.defaultOptions({
            options: {
                usePopover: true,
                dropDownOptions: {
                    fullScreen: false,
                    width: defaultWidth
                }
            }
        });
        const $lookup = $('<div>').prependTo('body');

        try {
            $lookup.dxLookup({ opened: true });
            const $popoverContent = $('.dx-overlay-content:visible');

            assert.ok(Math.abs(defaultWidth - $popoverContent.width()) <= 2);
        } finally {
            $lookup.remove();
            Lookup.defaultOptions([]);
        }
    });
});

QUnit.module('Events', {
    before: function() {
        this.items = [...new Array(50)].map((item, index) => index + 1);
    },
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        this.element = $('#lookup');
        this.options = {
            items: this.items
        };

        this.createLookup = function() {
            this.instance = this.element.dxLookup(this.options).dxLookup('instance');
        };
        this.togglePopup = function() {
            this.instance.open();

            this.$list = $('.dx-list');
            this.list = this.$list.dxList('instance');
        };
        this.triggerScrollEvent = function() {
            this.$list.find('.dx-scrollable-container').trigger('scroll');
        };
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
}, function() {
    QUnit.test('onScroll, handler attached via option', function(assert) {
        const scrollStub = sinon.stub();
        this.options.onScroll = scrollStub;
        this.createLookup();
        this.togglePopup();

        this.triggerScrollEvent();

        assert.ok(scrollStub.calledOnce, 'onScroll event handled');
    });

    QUnit.test('onScroll, handler attached via "on" method', function(assert) {
        const scrollStub = sinon.stub();
        this.createLookup();
        this.instance.on('scroll', scrollStub);
        this.togglePopup();

        this.triggerScrollEvent();

        assert.ok(scrollStub.calledOnce, 'onScroll event handled');
    });

    QUnit.test('detach "onScroll" event handler', function(assert) {
        const scrollStub = sinon.stub();
        this.createLookup();
        this.instance.on('scroll', scrollStub);
        this.togglePopup();

        this.instance.off('scroll', scrollStub);
        this.triggerScrollEvent();

        assert.ok(scrollStub.notCalled, 'onScroll event handler detached');
    });

    QUnit.test('onPageLoading handler should be passed to the list', function(assert) {
        assert.expect(1);

        const data = [1, 2, 3];

        $('#lookup').dxLookup({
            deferRendering: false,
            dataSource: {
                store: data,
                paginate: true,
                pageSize: 40
            },
            onPageLoading: (e) => {
                assert.ok(true, 'onPageLoading is fired');
            }
        });

        getList().option('onPageLoading')();
    });

    QUnit.test('onPageLoading handler should be passed to the list - subscription by "on" method', function(assert) {
        assert.expect(1);

        const data = [1, 2, 3];

        const instance = $('#lookup').dxLookup({
            deferRendering: false,
            dataSource: {
                store: data,
                paginate: true,
                pageSize: 40
            }
        }).dxLookup('instance');

        instance.on('pageLoading', (e) => {
            assert.ok(true, 'onPageLoading is fired');
        });

        getList().option('onPageLoading')();
    });

    QUnit.test('onPullRefresh handler should be passed to the list', function(assert) {
        assert.expect(1);

        const data = [1, 2, 3];

        $('#lookup').dxLookup({
            deferRendering: false,
            dataSource: {
                store: data,
                paginate: true,
                pageSize: 1
            },
            onPullRefresh: (e) => {
                assert.ok(true, 'onPullRefresh is fired');
            }
        });

        getList().option('onPullRefresh')();
    });

    QUnit.test('onPullRefresh handler should be passed to the list - subscription by "on" method', function(assert) {
        assert.expect(1);

        const data = [1, 2, 3];

        const instance = $('#lookup').dxLookup({
            deferRendering: false,
            dataSource: {
                store: data,
                paginate: true,
                pageSize: 1
            },
            pullRefreshEnabled: true
        }).dxLookup('instance');

        instance.on('pullRefresh', (e) => {
            assert.ok(true, 'onPullRefresh is fired');
        });

        getList().option('onPullRefresh')();
    });

    QUnit.test('change "onScroll" handler runtime', function(assert) {
        const initialScrollStub = sinon.stub();
        const newScrollStub = sinon.stub();
        this.options.onScroll = initialScrollStub;
        this.createLookup();
        this.togglePopup();

        this.instance.option('onScroll', newScrollStub);
        this.triggerScrollEvent();

        assert.ok(initialScrollStub.notCalled, 'initial handled does not invoked');
        assert.ok(newScrollStub.calledOnce, 'onScroll event handled');
    });
});

QUnit.module('onContentReady', {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
    }
}, () => {
    QUnit.test('Basic contentReady usage - subscription by "on" method', function(assert) {
        const contentReadyHandler = sinon.spy();
        const load = $.Deferred();
        const items = [1, 2, 3];

        const instance = $('#lookup').dxLookup({
            dataSource: {
                load: function() {
                    return load.promise();
                }
            },
            deferRendering: true,
            searchTimeout: 0,
            'dropDownOptions.animation': {},
            cleanSearchOnOpening: false
        }).dxLookup('instance');
        instance.on('contentReady', contentReadyHandler);

        instance.open();
        assert.ok(contentReadyHandler.calledOnce, 'onContentReady is fired after list rendering');

        load.resolve(items);
        assert.strictEqual(contentReadyHandler.callCount, 2, 'onContentReady is fired after dataSource load');

        instance.close();
        instance.open();

        assert.strictEqual(contentReadyHandler.callCount, 2, 'onContentReady is not fired after second popup showing');

        instance._searchBox.option('value', '2');

        assert.strictEqual(contentReadyHandler.callCount, 3, 'onContentReady is fired after search');

        instance.close();
        assert.strictEqual(contentReadyHandler.callCount, 3, 'onContentReady is not fired after popup with search results hiding');

        instance.open();
        assert.strictEqual(contentReadyHandler.callCount, 3, 'onContentReady is not fired after popup with search results showing');
    });

    QUnit.skip('onContentReady should be fired after input rendering when deferRendering=true', function(assert) {
        assert.expect(2);

        $('#lookup').dxLookup({
            onContentReady: (e) => {
                assert.ok(true, 'contentReady is fired after input rendering');
                assert.strictEqual(e.component._$field.get(0), $('.dx-lookup-field').get(0), 'input is rendered');
            },
            deferRendering: true
        });
    });

    QUnit.test('onContentReady should be fired after list rendering when deferRendering=true', function(assert) {
        assert.expect(2);

        const instance = $('#lookup').dxLookup({
            deferRendering: true
        }).dxLookup('instance');

        instance.option('onContentReady', () => {
            assert.ok(true, 'contentReady is fired after list rendering');
            assert.strictEqual(instance._list.NAME, 'dxList', 'list is rendered');
        });

        instance.open();
    });

    QUnit.test('onContentReady should be fired after input and list rendering when deferRendering=false', function(assert) {
        assert.expect(3);

        $('#lookup').dxLookup({
            onContentReady: (e) => {
                assert.ok(true, 'contentReady is fired');
                assert.strictEqual(e.component._$field.get(0), $('.dx-lookup-field').get(0), 'input is rendered');
                assert.ok(e.component._$list, 'list is rendered');
            },
            deferRendering: false
        });
    });

    QUnit.test('onContentReady should be fired after new items loading', function(assert) {
        assert.expect(2);

        const load = $.Deferred();
        const items = [1, 2, 3];

        const instance = $('#lookup').dxLookup({
            dataSource: {
                load: function() {
                    return load.promise();
                }
            },
            deferRendering: false
        }).dxLookup('instance');

        instance.option('onContentReady', (e) => {
            assert.ok(true, 'contentReady is fired');
            assert.strictEqual(instance._list.option('items').length, 3, 'items is loaded');
        });

        load.resolve(items);
    });

    QUnit.test('onContentReady should be fired after items filtering', function(assert) {
        assert.expect(2);

        const items = [1, 2, 3];

        const instance = $('#lookup').dxLookup({
            dataSource: items,
            deferRendering: false,
            searchTimeout: 0,
            'dropDownOptions.animation': {},
            cleanSearchOnOpening: false
        }).dxLookup('instance');

        instance.option('onContentReady', (e) => {
            assert.ok(true, 'contentReady is fired');
            const items = instance._list.$element().find('.dx-list-item');
            assert.strictEqual(items.length, 1, 'items are filtered');
        });

        instance._searchBox.option('value', '2');
    });
});

