import $ from "jquery";
import fx from "animation/fx";
import devices from "core/devices";
import dataUtils from "core/element_data";
import config from "core/config";
import { isRenderer } from "core/utils/type";

import ArrayStore from "data/array_store";
import CustomStore from "data/custom_store";
import Query from "data/query";
import { DataSource } from "data/data_source/data_source";

import themes from "ui/themes";
import Lookup from "ui/lookup";
import Popup from "ui/popup";
import List from "ui/list";
import Popover from "ui/popover";

import executeAsyncMock from "../../helpers/executeAsyncMock.js";
import pointerMock from "../../helpers/pointerMock.js";
import keyboardMock from "../../helpers/keyboardMock.js";

import ariaAccessibilityTestHelper from '../../helpers/ariaAccessibilityTestHelper.js';

import "common.css!";
import "generic_light.css!";

QUnit.testStart(function() {
    var markup =
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

    $("#qunit-fixture").html(markup);
});

var OVERLAY_SHADER_CLASS = "dx-overlay-shader",
    OVERLAY_WRAPPER_CLASS = "dx-overlay-wrapper",
    OVERLAY_CONTENT_CLASS = "dx-overlay-content",
    POPUP_CLASS = "dx-popup",
    POPUP_TITLE_CLASS = "dx-popup-title",
    POPUP_CONTENT_CLASS = "dx-popup-content",

    LIST_CLASS = "dx-list",
    LIST_ITEM_SELECTED_CLASS = "dx-list-item-selected",
    LIST_GROUP_HEADER_CLASS = "dx-list-group-header",

    LOOKUP_SEARCH_WRAPPER_CLASS = "dx-lookup-search-wrapper",
    LOOKUP_FIELD_CLASS = "dx-lookup-field",

    TEXTEDITOR_INPUT_CLASS = "dx-texteditor-input",

    FOCUSED_CLASS = "dx-state-focused";

var toSelector = function(val) {
    return "." + val;
};

var openPopupWithList = function(lookup) {
    $(lookup._$field).trigger("dxclick");
};

QUnit.module("Lookup", {
    beforeEach: function() {
        fx.off = true;
        executeAsyncMock.setup();
        this.clock = sinon.useFakeTimers();

        this.element = $("#lookup");
        this.instance = this.element.dxLookup({ fullScreen: false }).dxLookup("instance");
        this.$field = $(this.instance._$field);

        this.togglePopup = function() {
            $(this.instance._$field).trigger("dxclick");

            this.$popup = $(".dx-lookup-popup");
            this.popup = dataUtils.data(this.$popup[0], "dxPopup") || dataUtils.data(this.$popup[0], "dxPopover");

            this.$list = $(".dx-list");
            this.list = this.$list.dxList("instance");

            this.$search = $(this.instance._$searchBox);
            this.search = this.instance._searchBox;
        };
    },
    afterEach: function() {
        executeAsyncMock.teardown();
        this.clock.restore();
        fx.off = false;
    }
});

QUnit.test("attaching dxLookup", function(assert) {
    assert.ok(this.instance instanceof Lookup);
    assert.ok(this.element.hasClass("dx-lookup"), "widget has class dx-lookup");
    assert.ok($("." + LOOKUP_FIELD_CLASS, this.element).length, "widget contents field");
    assert.ok($(".dx-lookup-arrow", this.element).length, "widget contents arrow");

    this.togglePopup();

    assert.ok(this.popup instanceof Popup, "popup is dxPopup");
    assert.ok(this.popup._wrapper().hasClass("dx-lookup-popup-wrapper"));
    assert.ok(this.list instanceof List, "dxList in popup");
});

QUnit.test("List and search editor get correct 'rtlEnabled' option", function(assert) {
    this.togglePopup();

    assert.ok(!this.instance.option("rtlEnabled"), "rtlEnabled == false");
    assert.equal(this.list.option("rtlEnabled"), this.instance.option("rtlEnabled"), "list get correct option value");
    assert.equal(this.search.option("rtlEnabled"), this.instance.option("rtlEnabled"), "search get correct option value");

    this.instance.option("rtlEnabled", true);
    this.togglePopup();

    assert.ok(this.instance.option("rtlEnabled"), "rtlEnabled == true");
    assert.equal(this.list.option("rtlEnabled"), this.instance.option("rtlEnabled"), "list get correct option value");
    assert.equal(this.search.option("rtlEnabled"), this.instance.option("rtlEnabled"), "search get correct option value");
});

QUnit.test("show popup on click", function(assert) {
    var instance = this.instance;

    instance.option({
        dataSource: [1, 2, 3],
        value: 1,
        showCancelButton: true
    });

    this.togglePopup();

    var popup = this.popup,
        $field = this.$field;

    assert.ok(popup.option("visible"), "popup shows on click");

    $(".dx-list-item", this.$list).eq(1).trigger("dxclick");

    this.clock.tick(201);

    assert.ok(!popup.option("visible"), "popup hides on click");
    assert.equal(instance.option("value"), 2, "selected value sets as clicked item index");
    assert.equal(instance.option("displayValue"), 2, "'displayValue' option is clicked item value");
    assert.equal($field.text(), 2, "field text is clicked item value");

    $($field).trigger("dxclick");
    assert.ok(popup.option("visible"));

    $(popup._wrapper()).find(".dx-button").eq(0).trigger("dxclick");
    assert.equal(popup.option("visible"), false);
});

QUnit.test("hide popup on click on editor", function(assert) {
    var instance = this.instance;

    instance.option({
        dataSource: [1, 2, 3]
    });

    this.togglePopup();

    var popup = this.popup,
        $field = this.$field;

    $field.trigger("dxclick");
    assert.ok(!popup.option("visible"), "popup hides on click");
});

QUnit.test("selecting item on click", function(assert) {
    this.instance.option({
        dataSource: [1, 2, 3]
    });

    assert.equal(this.instance.option("value"), undefined, "no selected value on start");
    assert.equal(this.instance.option("displayValue"), null, "no selected value on start");
    assert.equal(this.$field.text(), this.instance.option("placeholder"), "no field text if no selected value");

    this.togglePopup();

    var $firstItem = $(this.$list.find(".dx-list-item")[0]),
        $secondItem = $(this.$list.find(".dx-list-item")[1]);

    $firstItem = $(this.$list.find(".dx-list-item")[0]);
    $($firstItem).trigger("dxclick");
    assert.equal(this.instance.option("value"), 1, "first value selected");
    assert.equal(this.instance.option("displayValue"), 1, "first value selected as displayValue");
    assert.equal(this.$field.text(), "1", "field text sets correctly");

    $secondItem = $(this.$list.find(".dx-list-item")[1]);
    $($secondItem).trigger("dxclick");
    assert.equal(this.instance.option("value"), 2, "second value selected");
    assert.equal(this.instance.option("displayValue"), 2, "second value selected as displayValue");
    assert.equal(this.$field.text(), "2", "field text sets correctly");
});

QUnit.test("List is empty until popup is open", function(assert) {
    var lookup = this.element
        .dxLookup({
            dataSource: [1, 2, 3]
        })
        .dxLookup("instance");

    assert.strictEqual(lookup._list, undefined, "List dataSource");
});

QUnit.test("onContentReady", function(assert) {
    var count = 0;
    var load = $.Deferred();
    var items = [1, 2, 3];

    var instance = $("#thirdLookup").dxLookup({
        onContentReady: function() { count++; },
        dataSource: {
            load: function() {
                return load.promise();
            }
        },
        deferRendering: false,
        searchTimeout: 0,
        animation: {},
        cleanSearchOnOpening: false
    }).dxLookup("instance");
    count = 0;

    instance.open();
    assert.equal(count, 0, "onContentReady fired after rendering");

    load.resolve(items);
    assert.equal(count, 1, "onContentReady fired after dataSource load");

    instance.close();
    instance.open();

    assert.equal(count, 1, "onContentReady does not fired after second show popup");

    instance._searchBox.option("value", "2");

    assert.equal(count, 2, "onContentReady fired after search something");

    instance.close();
    assert.equal(count, 2, "onContentReady does not fired after hide popup with search results");

    instance.open();
    assert.equal(count, 2, "onContentReady does not fired after show popup with search results");
});

QUnit.test("search value should be cleared after popup close for better UX (T253304)", function(assert) {
    var searchTimeout = 300;

    var instance = $("#thirdLookup").dxLookup({
        dataSource: [1, 2, 3],
        deferRendering: false,
        searchTimeout: searchTimeout,
        animation: null,
        cleanSearchOnOpening: true,
        opened: true
    }).dxLookup("instance");

    instance._searchBox.option("value", "2");
    this.clock.tick(searchTimeout);
    instance.close();
    instance.open();
    assert.equal(instance._list.option("items").length, 3, "filter reset immediately");
});

QUnit.test("search value should be cleared without excess dataSource filtering ", function(assert) {
    var searchTimeout = 300,
        loadCalledCount = 0;

    var instance = $("#thirdLookup").dxLookup({
        dataSource: new DataSource({
            load: function(options) {
                loadCalledCount++;
            }
        }),
        searchTimeout: searchTimeout,
        animation: null,
        cleanSearchOnOpening: true,
        opened: true
    }).dxLookup("instance");

    assert.equal(loadCalledCount, 1, "DataSource was loaded on init");

    instance._searchBox.option("value", "2");
    this.clock.tick(searchTimeout);
    assert.equal(loadCalledCount, 2, "DataSource was loaded after searching");

    instance.close();
    instance.open();
    assert.equal(loadCalledCount, 3, "Loading dataSource count is OK");
});

QUnit.test("onContentReady fire with lookup's option 'minSearchLength' at first show (Q575560)", function(assert) {
    var count = 0;
    this.element
        .dxLookup({
            items: [111, 222, 333],
            searchTimeout: 0,
            animation: {},
            minSearchLength: 2,
            onContentReady: function() { count++; }
        }).dxLookup("instance");

    this.togglePopup();
    assert.equal(count, 1, "onContentReady fired after rendering with option 'minSearchLength'");
});

QUnit.test("onOpened and onClosed actions", function(assert) {
    var openFired = false,
        closeFired = false,
        items = [1, 2, 3],
        instance = $("#thirdLookup").dxLookup({
            onOpened: function() { openFired = true; },
            onClosed: function() { closeFired = true; },
            items: items
        }).dxLookup("instance");

    instance.open();
    instance._popup.hide();

    assert.ok(openFired, "open fired");
    assert.ok(closeFired, "close fired");
});

QUnit.test("class selected", function(assert) {
    var items = [1, 2],
        lookup = this.element
            .dxLookup({
                dataSource: items,
                value: items[1]
            })
            .dxLookup("instance");

    this.togglePopup();

    var $firstItem = $(lookup._list.$element().find(".dx-list-item")[0]),
        $secondItem = $(lookup._list.$element().find(".dx-list-item")[1]);

    assert.ok($secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was added");

    lookup.option("value", items[0]);
    assert.ok(!$secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was deleted");
    assert.ok($firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was added");
});

QUnit.test("complex items", function(assert) {
    var items = [{
            value: 1,
            text: "one"
        }, {
            value: 2,
            text: "two"
        }],
        lookup = this.element
            .dxLookup({
                dataSource: items,
                displayExpr: "text",
                valueExpr: "value"
            })
            .dxLookup("instance");

    assert.equal(this.$field.text(), lookup.option("placeholder"), "no field text if no selected value");

    this.togglePopup();

    var $firstItem = $(lookup._list.$element().find(".dx-list-item")[0]);
    assert.equal($firstItem.text(), "one", "displayExpr work in list items");

    lookup.option("value", 1);
    assert.equal(this.$field.text(), "one", "display field work in text");
    assert.equal(lookup.option("displayValue"), "one", "option 'displayValue' work in text");

    this.togglePopup();

    var $secondItem = $(lookup._list.$element().find(".dx-list-item")[1]);
    $($secondItem).trigger("dxclick");
    assert.equal(lookup.option("value"), 2);
    assert.equal(this.$field.text(), "two", "display field work in text");
    assert.equal(lookup.option("displayValue"), "two", "option 'displayValue' work in text");
});

QUnit.test("selection should works with composite keys", function(assert) {
    var store = new ArrayStore({
        key: ["ID1", "ID2"],
        data: [
            { ID1: 1, ID2: 21 },
            { ID1: 2, ID2: 22 }
        ]
    });

    this.element.dxLookup({
        dataSource: store,
        valueExpr: 'ID1'
    });

    var instance = this.element.dxLookup("instance");

    instance.open();

    assert.strictEqual(instance.option("selectedItem"), null, "selectedItem is null");
});


QUnit.test("selectedItem should be changed correctly with composite keys and valueExpr", function(assert) {
    var data = [
            { ID1: 1, ID2: 21 },
            { ID1: 2, ID2: 22 }
        ],
        store = new ArrayStore({
            key: ["ID1", "ID2"],
            data: data
        });

    this.element.dxLookup({
        dataSource: store,
        valueExpr: 'ID1'
    });

    var instance = this.element.dxLookup("instance");

    instance.open();

    var $popup = $(".dx-popup-wrapper"),
        $listItems = $popup.find(".dx-list-item");

    $($listItems.eq(1)).trigger("dxclick");

    assert.strictEqual(instance.option("selectedItem"), data[1], "selectedItem is changed correctly");
});

QUnit.test("valueExpr calculating", function(assert) {
    var store = new ArrayStore({
            key: "k",
            data: [
                { k: 1, v: "a" },
                { k: 2, v: "b" }
            ]
        }),

        dataSource = new DataSource({
            store: store,
            paginate: false
        }),
        lookup = this.element.dxLookup({
            dataSource: [1, 2],
            value: 1
        }).dxLookup("instance");

    assert.equal(this.$field.text(), 1, "if option valueExpr and store key are not defined, use 'this' as valueExpr");

    lookup.option({
        dataSource: dataSource,
        value: 1,
        displayExpr: "v"
    });

    assert.equal(this.$field.text(), "a", "if option valueExpr is not defined, but store has defined key, use it");

    lookup.option({
        valueExpr: "v",
        value: "b"
    });
    assert.equal(this.$field.text(), "b", "if option valueExpr is defined, use it");
});

QUnit.test("change value expr refresh selected item", function(assert) {
    var $lookup = this.element.dxLookup({
        dataSource: [
            { param1: true, display: "item1" },
            { param2: true, display: "item2" }
        ],
        valueExpr: "param1",
        displayExpr: "display",
        value: true
    });

    this.togglePopup();

    var $selectedItem = $(this.popup.$content().find("." + LIST_ITEM_SELECTED_CLASS));
    assert.equal($selectedItem.text(), "item1");
    assert.equal(this.$field.text(), "item1");

    $lookup.dxLookup("option", "valueExpr", "param2");
    $selectedItem = $(this.popup.$content().find("." + LIST_ITEM_SELECTED_CLASS));
    assert.equal($selectedItem.text(), "item2");
    assert.equal(this.$field.text(), "item2");
});

QUnit.test("external dataSource filter applied during search value", function(assert) {
    var arrayStore = [
        { key: 1, value: "one" },
        { key: 2, value: "two" },
        { key: 3, value: "three" },
        { key: 4, value: "four" }
    ];
    var dataSource = new DataSource({
        store: arrayStore,
        filter: ["key", ">", 2]
    });

    var $lookup = $("#lookup").dxLookup({
        dataSource: dataSource,
        displayExpr: "value",
        valueExpr: "key",
        value: 1,
        placeholder: "test"
    });

    assert.equal($lookup.text(), "test", "display value is not defined");
});

QUnit.test("option value returns object when valueExpr is 'this'", function(assert) {
    var dataArray = [
        { id: '1', value: 'one' },
        { id: '2', value: 'two' },
        { id: '3', value: 'three' },
        { id: '4', value: 'four' },
        { id: '5', value: 'five' }
    ];
    var store = new CustomStore({
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
        displayExpr: "value",
        valueExpr: "this",
        value: dataArray[0]
    });

    assert.equal(this.instance.option("value"), dataArray[0], "option value return object");

    $(this.$field).trigger("dxclick");
    $(".dx-list-item", this.$list).eq(3).trigger("dxclick");
    assert.equal(this.instance.option("value"), dataArray[3], "option value return object");
});

QUnit.test("highlight item when dataSource is mapped", function(assert) {
    var dataArray = [{ id: 1 }, { id: 2 }];
    var store = new ArrayStore({
        data: dataArray,
        key: "id"
    });
    var value = dataArray[0];
    var dataSource = new DataSource({
        store: store,
        map: function(data) {
            return { id: data.id };
        }
    });


    var $lookup = $("#lookup").dxLookup({
        dataSource: dataSource,
        value: value
    });

    $($lookup.find("." + LOOKUP_FIELD_CLASS)).trigger("dxclick");
    var $popup = $(".dx-popup-wrapper");

    var $listItems = $popup.find(".dx-list-item");
    assert.ok($listItems.eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), "selected class was attached byKey");
});

QUnit.test("highlight item when dataSource is mapped and valueExpr was set", function(assert) {
    var dataArray = [{ id: 1 }, { id: 2 }];
    var store = new ArrayStore({
        data: dataArray,
        key: "id"
    });
    var value = dataArray[0];
    var dataSource = new DataSource({
        store: store,
        map: function(data) {
            return { id: data.id };
        }
    });

    var $lookup = $("#lookup").dxLookup({
        dataSource: dataSource,
        value: value,
        valueExpr: "id"
    });

    $($lookup.find("." + LOOKUP_FIELD_CLASS)).trigger("dxclick");
    var $popup = $(".dx-popup-wrapper");

    var $listItems = $popup.find(".dx-list-item");
    assert.ok($listItems.eq(0).hasClass(LIST_ITEM_SELECTED_CLASS), "selected class was attached byKey");
});

QUnit.test("search with dataSource", function(assert) {
    var dataSource = new DataSource({
        store: [
            { value: 1 },
            { value: 2 },
            { value: 3 }
        ],
        searchExpr: "value"
    });

    this.instance.option({
        dataSource: dataSource,
        displayExpr: "value",
        valueExpr: "value",
        value: 3,
        searchTimeout: 0
    });

    this.togglePopup();

    this.search.option("value", "3");

    var listItems = this.$list.find(".dx-list-item");

    assert.equal(listItems.length, 1, "Items count");
    assert.equal(listItems.eq(0).text(), "3", "List item text");
});

QUnit.test("multiple field search with dataSource (Q521604)", function(assert) {
    var items = [
        { id: 1, name: "red_toy", desc: "A giant toy replicating real vehicle" },
        { id: 2, name: "green_bike", desc: "Stuff for a young dabbler" },
        { id: 3, name: "yellow_monster", desc: "A bike of premium quality" }];

    this.instance.option({
        dataSource: items,
        searchExpr: ["name", "desc"],
        displayExpr: "name",
        valueExpr: "id",
        searchTimeout: 0
    });

    this.togglePopup();

    this.search.option("value", "bike");

    var filteredListItems = this.$list.find(".dx-list-item");

    assert.equal(filteredListItems.length, 2, "Items count is right");

    var firstItemIsFound = filteredListItems.text().indexOf(items[1].name) !== -1;
    var secondItemIsFound = filteredListItems.text().indexOf(items[2].name) !== -1;

    assert.ok(firstItemIsFound && secondItemIsFound, "Items' filtering is right");
});

QUnit.test("Empty dataSource searchExpr (B253811)", function(assert) {
    var items = [
        { id: 1, name: "red_toy", desc: "A giant toy replicating real vehicle" },
        { id: 2, name: "green_bike", desc: "Stuff for a young dabbler" },
        { id: 3, name: "yellow_monster", desc: "A bike of premium quality" }];

    var dataSource = new DataSource({
        store: items
    });

    this.instance.option({
        dataSource: dataSource,
        displayExpr: "name",
        valueExpr: "id",
        searchTimeout: 0
    });

    this.togglePopup();

    this.search.option("value", "bike");

    var filteredListItems = this.$list.find(".dx-list-item");
    var rightItemIsFound = filteredListItems.text().indexOf(items[1].name) !== -1;

    assert.ok(filteredListItems.length === 1 && rightItemIsFound, "Lookup's displayExpr is used if dataSource's searchExpr is undefined");
});

QUnit.test("userDataSource: byKey", function(assert) {
    // arrange
    var initialLoadCalled = false,
        searchLoadCalled = false,
        searchString = null,
        lookupKeys = [],
        items = [
            {
                value: 1,
                name: "one"
            },
            {
                value: 2,
                name: "two"
            },
            {
                value: 3,
                name: "three"
            }
        ],
        userDataSource = {
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
        displayExpr: "name",
        valueExpr: "id",
        value: 1,
        searchTimeout: 0
    });

    this.togglePopup();

    var search = this.search;

    // act
    search.option("value", "thr");

    // assert
    assert.ok(initialLoadCalled, "initial load");
    assert.ok(searchLoadCalled, "load should be called with search params");
    assert.equal(searchString, "thr", "Correct search string should be passed");

    assert.equal(lookupKeys[0], 1, "Lookup callback should be called with right key");
});

QUnit.test("userDataSource: lookup with not defined value", function(assert) {
    // arrange
    var lookupKeys = [],
        userDataSource = {
            load: function(loadOptions) {
                return [];
            },

            lookup: function(key) {
                lookupKeys.push(key);
                return null;
            }
        };

    // act
    this.instance.option({
        dataSource: userDataSource,
        displayExpr: "name",
        valueExpr: "id",
        searchTimeout: 0
    });

    this.togglePopup();

    // assert
    assert.equal(lookupKeys.length, 0, "Lookup callback should never be called");
});

QUnit.test("searchTimeout does not work (Q569033)", function(assert) {
    var loadTriggered = 0;

    this.instance.option({
        dataSource: {
            load: function(loadOptions) {
                loadTriggered++;
                return [];
            },
            lookup: function() { }
        },
        displayExpr: "name",
        valueExpr: "id",
        searchTimeout: 500
    });


    this.togglePopup();

    var loadTriggeredAtStart = loadTriggered,
        search = this.search;

    search.option("value", "t");
    this.clock.tick(300);

    search.option("value", "th");
    this.clock.tick(300);

    search.option("value", "thr");
    this.clock.tick(600);

    assert.equal(loadTriggered, loadTriggeredAtStart + 1, "load triggered once when last search timeout expired");
});

QUnit.test("allow dataSource with map function", function(assert) {
    var dataSource = new DataSource({
        store: [1, 2, 3],
        map: function(item) {
            return { text: item };
        }
    });

    this.instance.option({
        dataSource: dataSource
    });

    this.togglePopup();
    assert.ok(true, "dataSource with map works correctly");
});

QUnit.test("UserDateSource with map, minSearchLength > 0", function(assert) {
    var items = [
            {
                id: 1,
                name: "Tom",
                lastName: "Smith"
            },
            {
                id: 2,
                name: "James",
                lastName: "Adams"
            },
            {
                id: 3,
                name: "Joe",
                lastName: "Doe"
            }
        ],
        dataSource = new DataSource({
            store: items,
            map: function(item) {
                return {
                    value: item.id,
                    text: item.name + " " + item.lastName
                };
            }
        });

    dataSource.load();

    var store = new ArrayStore(dataSource.items()),
        lookupDataSource = new DataSource({
            load: function(loadOptions) {
                return store.load(loadOptions.searchValue ? { filter: ['text', 'contains', loadOptions.searchValue] } : null);
            },
            lookup: $.proxy(dataSource.lookup, dataSource)
        });

    this.instance.option({
        dataSource: lookupDataSource,
        valueExpr: "value",
        displayExpr: "text",
        searchTimeout: 0,
        minSearchLength: 3
    });

    this.togglePopup();

    var search = this.search;
    search.option("value", "smi");

    var listItems = this.$list.find(".dx-list-item");
    assert.equal(listItems.length, 1);
    assert.notEqual(listItems.eq(0).css("display"), "none");
});

QUnit.test("value onValueChanged callback", function(assert) {
    var items = [
            {
                id: 1,
                name: "Tom"
            },
            {
                id: 2,
                name: "James"
            }
        ],
        lookup = this.element
            .dxLookup({
                dataSource: items,
                valueExpr: "id",
                displayExpr: "name",
                value: 1
            })
            .dxLookup("instance"),
        value = items[0];

    lookup.option("onValueChanged", function(args) {
        value = args.value;
    });
    lookup.option("value", 2);

    assert.equal(value, items[1].id);
});

QUnit.test("use template, option itemTemplate", function(assert) {
    var dataSource = [
        { id: 1, caption: "red" },
        { id: 2, caption: "green" },
        { id: 3, caption: "blue" }
    ];

    var fourthLookup = $("#fourthLookup").dxLookup({
        dataSource: dataSource,
        itemTemplate: "test",
        valueExpr: 'id',
        displayExpr: 'caption'
    }).dxLookup("instance");

    assert.ok(fourthLookup._getTemplateByOption("itemTemplate"), "test template present in lookup");
    openPopupWithList(fourthLookup);
    assert.strictEqual(fourthLookup._getTemplateByOption("itemTemplate"), fourthLookup._list._getTemplateByOption("itemTemplate"), "test template present in list");
});

QUnit.test("itemTemplate returning string", function(assert) {
    var lookup = this.element.dxLookup({
        items: ["a", "b"],
        itemTemplate: function(item, index) {
            return index + ": " + item;
        }
    }).dxLookup("instance");

    openPopupWithList(lookup);
    var items = $(".dx-list-item", lookup._list.$element());

    assert.equal(items.eq(0).text(), "0: a");
    assert.equal(items.eq(1).text(), "1: b");

    lookup.option("itemTemplate", function(item, index) {
        return item + ": " + index;
    });

    items = $(".dx-list-item", lookup._list.$element());

    assert.equal(items.eq(0).text(), "a: 0");
    assert.equal(items.eq(1).text(), "b: 1");
});

QUnit.test("itemTemplate returning jquery", function(assert) {
    var lookup = this.element.dxLookup({
        items: ["a"],
        itemTemplate: function(item, index) {
            return $("<span class='test' />");
        }
    }).dxLookup("instance");

    openPopupWithList(lookup);
    var item = $(".dx-list-item", lookup._list.$element()).eq(0);
    assert.ok(item.find("span.test").length);
});

QUnit.test("lookup with Done does not closed after item click", function(assert) {
    var lookup = this.element.dxLookup({
            dataSource: [1, 2, 3],
            value: 1,
            showClearButton: false,
            applyValueMode: "useButtons",
            showCancelButton: false,
            opened: true
        }).dxLookup("instance"),
        $list = lookup._$list;

    $($list.find(".dx-list-item").eq(1)).trigger("dxclick");
    assert.ok(lookup.option("opened"), "popup dont hide after click");
    assert.ok($list.find(".dx-list-item").eq(1).hasClass(LIST_ITEM_SELECTED_CLASS), "second item selected");
    assert.equal(lookup.option("value"), 1, "value dont changed without Done click");

    $(lookup._popup._wrapper()).find(".dx-popup-done.dx-button").eq(0).trigger("dxclick");

    assert.ok(!lookup.option("opened"), "popup hide after click by Done");
    assert.equal(lookup.option("value"), 2, "value changed after Done click");
});

QUnit.test("regression: can not select value after loading more items (B233390)", function(assert) {
    var lookup = this.element.dxLookup({
        items: ["1", "2", "3"]
    }).dxLookup("instance");

    openPopupWithList(lookup);

    var $firstListItem = $(lookup._list.$element().find(".dx-list-item").eq(0)),
        mouse = pointerMock($firstListItem).start();

    mouse.down().move(0, 10).up();
    this.clock.tick(500);
    mouse.click();

    assert.equal(lookup.option("value"), "1");
});

QUnit.test("regression: B236007 (check that selection item in one lookup do not effect to another)", function(assert) {
    var $firstLookup = $("#lookup").dxLookup({
            items: ["1", "2", "3"],
            value: "1"
        }),
        firstLookup = $firstLookup.dxLookup("instance"),
        $secondLookup = $("#secondLookup").dxLookup({
            items: ["1", "2", "3"],
            value: "2"
        }),
        secondLookup = $secondLookup.dxLookup("instance");

    openPopupWithList(firstLookup);
    assert.equal($("." + LIST_ITEM_SELECTED_CLASS).length, 1);

    var $firstListItem = $(firstLookup._list.$element().find(".dx-list-item").eq(0)),
        mouse = pointerMock($firstListItem);
    mouse.start().down().move(0, 10).up();

    openPopupWithList(secondLookup);
    assert.equal($("." + LIST_ITEM_SELECTED_CLASS).length, 2);

    // mouse = pointerMock($firstListItem);
    mouse.start().down().move(0, 10).up();

    openPopupWithList(firstLookup);
    assert.equal($("." + LIST_ITEM_SELECTED_CLASS).length, 2);
});

QUnit.test("regression: dxLookup - incorrect search behavior when 'minSearchLength' greater than zero", function(assert) {
    var lookup = this.element.dxLookup({
        items: ["1", "2", "3"],
        minSearchLength: 2
    }).dxLookup("instance");

    openPopupWithList(lookup);
    assert.equal(lookup._searchBox.option('placeholder'), "Minimum character number: 2");

    lookup.option("minSearchLength", 3);
    assert.equal(lookup._searchBox.option('placeholder'), "Minimum character number: 3");
});

QUnit.test("Q517035 - Setting an observable variable to null and then to a value causes a display text problem", function(assert) {
    executeAsyncMock.teardown();

    var lookup = this.element.dxLookup({
        dataSource: [{ id: 0, text: "0" }, { id: 1, text: "1" }],
        displayExpr: "text",
        valueExpr: "id"
    }).dxLookup("instance");

    lookup.option("value", null);
    lookup.option("value", 1);

    assert.ok(lookup._$field.text() === "1");

    lookup.option("value", null);
    lookup.option("value", 1);

    assert.ok(lookup._$field.text() === "1");
});

QUnit.test("B236077: dxLookup shouldn't render popup window with inner widgets until it's going to be shown", function(assert) {
    this.instance.option({
        dataSource: [1, 2, 3],
        value: 1
    });

    assert.ok(!this.instance._popup, "B236077: popup is not added before showing");
    assert.ok(!$(".dx-lookup-popup", this.instance.$element()).length, "B236077: popups markup is not rendered to lookup");

    this.togglePopup();

    assert.ok(this.$popup, "B236077: popup is added after click");
});

QUnit.test("usePopover", function(assert) {
    this.instance.option({ usePopover: true });

    this.togglePopup();

    assert.ok(this.popup instanceof Popover, "popover was created");
    assert.ok(this.element.hasClass("dx-lookup-popover-mode"), "popover has class popover mode");
});

QUnit.test("usePopover option target", function(assert) {
    this.instance.option({ usePopover: true });

    this.togglePopup();

    var $target = this.popup.option("target");
    assert.equal($target.get(0), this.element.get(0), "popover target is lookup element");
});

QUnit.test("popupHeight when usePopover is true", function(assert) {
    var popupHeight = 500;
    this.instance.option({
        usePopover: true,
        popupHeight: popupHeight
    });

    this.togglePopup();

    assert.equal(this.popup.option("height"), popupHeight, "popupHeight applied to popover");
});

QUnit.test("showEvent/hideEvent is null when usePopover is true", function(assert) {
    this.instance.option({
        usePopover: true
    });

    this.togglePopup();

    assert.strictEqual(this.popup.option("showEvent"), null, "showEvent is null");
    assert.strictEqual(this.popup.option("hideEvent"), null, "hideEvent is null");
});

QUnit.test("Popup with Done Button hide after one click on item", function(assert) {
    var lookup = this.element
        .dxLookup({
            dataSource: [1, 2, 3],
            value: 1,
            showClearButton: false,
            applyValueMode: "useButtons",
            showCancelButton: true
        })
        .dxLookup("instance");

    this.togglePopup();

    $($(".dx-list-item", lookup._list.$element()).eq(1)).trigger("dxclick");
    $(".dx-popup-cancel.dx-button", $(lookup._popup._wrapper())).eq(0).trigger("dxclick");
    $(lookup._$field).trigger("dxclick");
    $($(".dx-list-item", lookup._list.$element()).eq(1)).trigger("dxclick");

    this.clock.tick(250);
    assert.ok(lookup._popup.option("visible"), "popup hide after click by no selected item after hide->show events");
});

QUnit.test("clear button should save valueChangeEvent", function(assert) {
    var valueChangedHandler = sinon.spy();

    var lookup = this.element
        .dxLookup({
            dataSource: [1],
            value: 1,
            opened: true,
            onValueChanged: valueChangedHandler,
            showClearButton: true
        })
        .dxLookup("instance");

    var $clearButton = $(lookup.content()).parent().find(".dx-popup-clear");
    $clearButton.trigger("dxclick");

    assert.equal(valueChangedHandler.callCount, 1, "valueChangedHandler has been called");
    assert.equal(valueChangedHandler.getCall(0).args[0].event.type, "dxclick", "event is correct");
});

QUnit.test("B238773 - dxLookup does not work properly if the valueExpr option is set to this", function(assert) {
    executeAsyncMock.teardown();

    var dataSource = [{ id: 0, text: "item 0" }, { id: 1, text: "item 1" }];

    var lookup = this.element.dxLookup({
        placeholder: "Select...",
        valueExpr: "this",
        displayExpr: "text",
        dataSource: dataSource
    }).dxLookup("instance");

    openPopupWithList(lookup);

    assert.ok(lookup._popup.option("visible"));

    this.clock.tick(200);

    $(lookup._popup._wrapper()).find(".dx-list-item").eq(0).trigger("dxclick");

    assert.equal(lookup.option("value").id, dataSource[0].id);
    assert.equal(lookup._$field.text(), "item 0");
});

QUnit.test("dataSource loading calls once after opening when value is specified", function(assert) {
    var loadingFired = 0;

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

    assert.equal(loadingFired, 1, "loading called once");
});

QUnit.test("dataSource loading calls once when change search string (Q558510)", function(assert) {
    var loadingFired = 0;

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

    this.$search.dxTextBox("option", "value", "123");

    assert.equal(loadingFired, 1, "loading called once");
});

QUnit.test("lookup empty class is attached when no item is selected", function(assert) {
    var $lookup = this.element.dxLookup({ dataSource: [1, 2, 3], showClearButton: true, placeholder: "placeholder" }),
        lookup = $lookup.dxLookup("instance"),
        LOOKUP_EMPTY_CLASS = "dx-lookup-empty";

    assert.ok($lookup.hasClass(LOOKUP_EMPTY_CLASS), "Lookup without preselected value has empty class");

    lookup.option("value", 1);

    assert.ok(!$lookup.hasClass(LOOKUP_EMPTY_CLASS), "Lookup with selected item has not empty class");

    openPopupWithList(lookup);
    $(lookup._popup._wrapper()).find(".dx-button.dx-popup-clear").trigger("dxclick");

    var $lookupField = $lookup.find(".dx-lookup-field");

    assert.ok($lookup.hasClass(LOOKUP_EMPTY_CLASS), "Lookup has empty class after clearance");
    assert.equal($.trim($lookupField.text()), "placeholder", "placeholder is shown");
    assert.strictEqual(lookup.option("value"), null, "value reset");
});

QUnit.test("show/hide popup window programmatically", function(assert) {
    var $lookup = this.element.dxLookup({ dataSource: [1, 2, 3] }),
        lookup = $lookup.dxLookup("instance"),
        $popup = $("." + POPUP_CLASS);

    assert.equal($popup.length, 0, "no rendered popup or popover");

    lookup.open();
    $popup = $("." + POPUP_CLASS);
    assert.ok($popup.is(":visible"));

    lookup.close();
    assert.ok($popup.is(":hidden"));
});

QUnit.test("list display items when same as 'minSearchLength' characters are entered (T126606)", function(assert) {
    this.element.dxLookup({
        minSearchLength: 2,
        searchTimeout: 0,
        dataSource: new DataSource({
            load: function(loadOptions) {
                var d = new $.Deferred();
                loadOptions.searchString;
                setTimeout(function() {
                    var query = Query([{ name: "asdfg" }, { name: "qwert" }, { name: "zxcvb" }]);
                    var data = [];
                    if(loadOptions.searchValue) {
                        data = query.filter("name", "contains", loadOptions.searchValue).toArray();
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
    this.$search.dxTextBox("option", "value", "df");
    this.clock.tick(10);
    assert.equal(this.$list.find(".dx-list-item").length, 1);
});

QUnit.test("list display items when 'minSearchLength' is not exceeded and 'showDataBeforeSearch' set to true", function(assert) {
    this.element.dxLookup({
        minSearchLength: 2,
        searchTimeout: 0,
        showDataBeforeSearch: true,
        dataSource: new DataSource({
            load: function(loadOptions) {
                var d = new $.Deferred();
                loadOptions.searchString;
                setTimeout(function() {
                    var query = Query([{ name: "asdfg" }, { name: "qwert" }, { name: "zxcvb" }]);
                    var data = [];
                    if(loadOptions.searchValue) {
                        data = query.filter("name", "contains", loadOptions.searchValue).toArray();
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
    this.$search.dxTextBox("option", "value");
    this.clock.tick(10);
    assert.equal(this.$list.find(".dx-list-item").length, 3);
});

QUnit.test("dxLookup should accept undefined value (T141821)", function(assert) {
    assert.expect(0);

    this.element.dxLookup({
        dataSource: new DataSource({
            store: new ArrayStore({
                data: [{
                    CategoryID: 1,
                    CategoryName: "Beverages"
                }],
                key: 'CategoryID'
            })
        }),

        displayExpr: 'CategoryName',
        valueExpr: 'CategoryID'
    });

    this.togglePopup();
    this.clock.tick(10);
    $(this.$list.find(".dx-list-item").eq(0)).trigger("dxclick");
});

QUnit.test("The search field should be insert before list", function(assert) {
    var $lookup = $("#lookup").dxLookup({
        dataSource: [1, 2, 3],
        value: 2,
        searchEnabled: false,
        opened: true
    });

    var instance = $lookup.dxLookup("instance");
    instance.option("searchEnabled", true);

    var $popupContent = $(".dx-popup-content");

    var searchIndex = $popupContent.find(".dx-lookup-search-wrapper").index();
    var listIndex = $popupContent.find(".dx-list").index();

    assert.ok(listIndex > searchIndex, "list placed after search field");
});

QUnit.test("Check popup position for Material theme when fullScreen option is true ", function(assert) {
    var isMaterialStub = sinon.stub(themes, "isMaterial"),
        $lookup = $("#lookup");

    isMaterialStub.returns(true);

    $lookup.dxLookup("instance").dispose();

    try {
        var lookup = $lookup
            .dxLookup({ dataSource: ["blue", "orange", "lime", "purple"], value: "orange", fullScreen: true })
            .dxLookup("instance");

        $(lookup.field()).trigger("dxclick");
        assert.equal($(lookup._popup.option("position").of)[0], window, "popup position of the window");
        assert.equal($(lookup.content()).parent().position().top, 0, "popup doesn't have offset top");
        assert.equal($(lookup.content()).parent().position().left, 0, "popup doesn't have offset left");
    } finally {
        $lookup.dxLookup("instance").dispose();
        isMaterialStub.restore();
    }
});

QUnit.test("onValueChanged argument should contains an event property after selecting an item by click", function(assert) {
    const valueChangedStub = sinon.stub();
    this.instance.option({
        dataSource: [1, 2, 3],
        onValueChanged: valueChangedStub
    });

    this.togglePopup();

    this.$list
        .find(".dx-list-item")
        .first()
        .trigger("dxclick");

    const { event } = valueChangedStub.lastCall.args[0];

    assert.ok(event);
    assert.strictEqual(event.type, "dxclick");
});

QUnit.test("Lookup should catch delayed data", function(assert) {
    const items = [{
        "ID": 1,
        "Name": "John"
    }, {
        "ID": 2,
        "Name": "Olivia"
    }];

    this.element.dxLookup({
        dataSource: [],
        displayExpr: 'Name',
        valueExpr: "ID",
        value: 1,
        title: "Select employee"
    });

    setTimeout(() => {
        $("#lookup").dxLookup("instance").option("dataSource", items);
    }, 100);
    this.clock.tick(100);

    assert.equal(this.$field.text(), "John", "display field work in text");
});

QUnit.module("hidden input");

QUnit.test("the hidden input should get correct value on widget value change", function(assert) {
    var $element = $("#lookup").dxLookup({
            items: [1, 2, 3],
            value: 2
        }),
        instance = $element.dxLookup("instance"),
        $input = $element.find("input[type='hidden']");

    instance.option("value", 1);
    assert.equal($input.val(), "1", "input value is correct");
});


QUnit.module("the 'name' option");

QUnit.test("hidden input should get correct 'name' attribute after the 'name' option is changed", function(assert) {
    var expectedName = "lookup",
        $element = $("#lookup").dxLookup({
            name: "initialName"
        }),
        instance = $element.dxLookup("instance"),
        $input = $element.find("input[type='hidden']");

    instance.option("name", expectedName);
    assert.equal($input.attr("name"), expectedName, "input has correct 'name' attribute");
});


QUnit.module("options", {
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
});

QUnit.test("popupWidth", function(assert) {
    var instance = $("#lookup").dxLookup({
        popupWidth: 100,
        usePopover: false
    }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    assert.equal(instance._popup.option("width"), 100, "Option initialized correctly");

    instance.option("popupWidth", 200);
    assert.equal(instance._popup.option("width"), 200, "Option set correctly");
});

QUnit.test("popupWidth option test for usePopover mode", function(assert) {
    var instance = $("#lookup").dxLookup({
        popupWidth: 100,
        usePopover: true
    }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    assert.equal(instance._popup.option("width"), 100, "Option initialized correctly");

    instance.option("popupWidth", 200);
    assert.equal(instance._popup.option("width"), 200, "Option set correctly");
});

QUnit.test("popoverWidth", function(assert) {
    var instance = $("#lookup").dxLookup({
        usePopover: true,
        width: 200
    }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    assert.equal(Math.round(instance._$popup.width()), Math.round(instance.$element().width()), "Option initialized correctly");

    instance.option("width", 400);
    assert.equal(Math.round(instance._$popup.width()), Math.round(instance.$element().width()), "Option set correctly");
});

QUnit.test("setting popupWidth to auto returns initial value", function(assert) {
    var $lookup = $("#lookup");
    var instance = $lookup.dxLookup({ usePopover: false }).dxLookup("instance");

    instance.open();
    var popup = $lookup.find("." + POPUP_CLASS).dxPopup("instance");

    var initialValue = popup.option("width");
    if($.isFunction(initialValue)) {
        initialValue = initialValue();
    }

    instance.option("popupWidth", initialValue + 1);

    instance.option("popupWidth", 'auto');
    var autoValue = popup.option("width");
    if($.isFunction(autoValue)) {
        autoValue = autoValue();
    }

    assert.equal(initialValue, autoValue, "initial value equal auto value");
});

QUnit.test("popupHeight", function(assert) {
    var instance = $("#lookup").dxLookup({ popupHeight: 100, usePopover: false }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    assert.equal(instance._popup.option("height"), 100, "Option initialized correctly");

    instance.option("popupHeight", 200);
    assert.equal(instance._popup.option("height"), 200, "Option set correctly");
});

QUnit.test("setting popupHeight to auto returns initial value", function(assert) {
    var $lookup = $("#lookup");
    var instance = $lookup.dxLookup({ usePopover: false }).dxLookup("instance");

    instance.open();
    var popup = $lookup.find("." + POPUP_CLASS).dxPopup("instance");

    var initialValue = popup.option("height");
    if($.isFunction(initialValue)) {
        initialValue = initialValue();
    }

    instance.option("popupHeight", initialValue + 1);

    instance.option("popupHeight", 'auto');
    var autoValue = popup.option("height");
    if($.isFunction(autoValue)) {
        autoValue = autoValue();
    }

    assert.equal(initialValue, autoValue, "initial value equal auto value");
});

QUnit.test("searchPlaceholder", function(assert) {
    var instance = $("#lookup").dxLookup({
            dataSource: [1, 2, 3],
            searchPlaceholder: "searchPlaceHolderTest"
        }).dxLookup("instance"),
        search;

    $(instance._$field).trigger("dxclick");
    search = instance._searchBox;

    assert.equal(search.option("placeholder"), instance.option("searchPlaceholder"));

    instance.option("searchPlaceHolder", "searchPlaceHolderTest2");
    assert.equal(search.option("placeholder"), instance.option("searchPlaceholder"));
});

QUnit.test("searchEnabled", function(assert) {
    var instance = $("#lookup").dxLookup({
            opened: true,
            dataSource: []
        }).dxLookup("instance"),
        popup,
        $search;

    popup = instance._popup;
    $search = instance._$searchBox;

    assert.ok($(popup._wrapper()).hasClass("dx-lookup-popup-search"));
    assert.ok($search.is(":visible"), "default value");

    instance.option("searchEnabled", false);
    assert.ok(!$(popup._wrapper()).hasClass("dx-lookup-popup-search"));
    assert.ok($search.is(":hidden"), "hidden");
});

QUnit.test("cleanSearchOnOpening", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var instance = $("#lookup").dxLookup({
            items: [1, 11, 111],
            deferRendering: false,
            opened: true,
            cleanSearchOnOpening: true
        }).dxLookup("instance"),
        searchBox = instance._searchBox,
        $list = instance._$list,
        $listItems = $list.find(".dx-list-item");

    searchBox.option("value", 1);
    $($listItems.eq(2)).trigger("dxpointerdown");

    instance.option("opened", false);
    instance.option("opened", true);

    assert.equal(searchBox.option("value"), "", "search value has been cleared");

    $($list).trigger("focusin");
    assert.equal($list.find(".dx-state-focused").eq(0).text(), $listItems.eq(0).text(), "list focused item has been refreshed");
});

QUnit.test("click on readOnly lookup doesn't toggle popup visibility", function(assert) {
    var instance = $("#lookup").dxLookup({
        items: [0, 1, 2],
        readOnly: true
    }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");
    assert.ok(!instance.option("opened"), "when we click on field - list is still hidden");

    instance.option("readOnly", false);
    $(instance._$field).trigger("dxclick");
    assert.ok(instance.option("opened"), "when we click on field - list is visible after option changed");
});

QUnit.test("noDataText (B253876)", function(assert) {
    assert.expect(2);

    var instance = $("#lookup").dxLookup({ noDataText: "nope" }).dxLookup("instance"),
        listInstance;

    $(instance._$field).trigger("dxclick");
    listInstance = instance._list;

    assert.equal(listInstance.option("noDataText"), "nope", "correct initialization");

    instance.option("noDataText", "nope, again");
    assert.equal(listInstance.option("noDataText"), "nope, again", "correct option change");
});

QUnit.test("popup buttons text rerender (B253876 - notes)", function(assert) {
    assert.expect(6);

    var instance = $("#lookup").dxLookup({
        cancelButtonText: "nope",
        clearButtonText: "fuu",
        applyButtonText: "yep",
        showCancelButton: true,
        showClearButton: true,
        applyValueMode: 'useButtons'
    }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    var $popupWrapper = $(".dx-popup-wrapper");

    assert.equal($popupWrapper.find(".dx-button.dx-popup-cancel").text(), "nope", "correct initialization");
    assert.equal($popupWrapper.find(".dx-button.dx-popup-clear").text(), "fuu", "correct initialization");
    assert.equal($popupWrapper.find(".dx-button.dx-popup-done").text(), "yep", "correct initialization");

    instance.option("cancelButtonText", "nopenope");
    instance.option("clearButtonText", "fuufuu");
    instance.option("applyButtonText", "yepyep");
    $popupWrapper = $(".dx-popup-wrapper");

    assert.equal($popupWrapper.find(".dx-button.dx-popup-cancel").text(), "nopenope", "correct option change");
    assert.equal($popupWrapper.find(".dx-button.dx-popup-clear").text(), "fuufuu", "correct option change");
    assert.equal($popupWrapper.find(".dx-button.dx-popup-done").text(), "yepyep", "correct option change");
});

QUnit.test("displayExpr, valueExpr", function(assert) {
    var items = [{
            number: 1,
            caption: "one"
        }, {
            number: 2,
            caption: "two"
        }],
        instance = $("#lookup").dxLookup({
            dataSource: items,
            valueExpr: "number",
            displayExpr: "caption"
        }).dxLookup("instance"),
        $firstItem,
        $field = $(instance._$field);

    assert.equal($field.text(), instance.option("placeholder"), "no field text if no selected value");

    $(instance._$field).trigger("dxclick");

    $firstItem = $(instance._list.$element().find(".dx-list-item")[0]);
    assert.equal($firstItem.text(), "one", "displayExpr work in list items");

    instance.option("value", 1);
    assert.equal($field.text(), "one", "display field work in text");
    assert.equal(instance.option("displayValue"), "one", "display field work for 'displayValue' option");

    instance.option("displayExpr", "number");
    $firstItem = $(instance._list.$element().find(".dx-list-item")[0]);
    assert.equal($firstItem.text(), "1", "displayExpr changing rerenders list items");
    assert.equal(instance.option("displayValue"), "1", "displayExpr changing work for 'displayValue' option");
});

QUnit.test("value", function(assert) {
    var items = [1, 2, 3],
        instance = $("#lookup").dxLookup({ dataSource: items }).dxLookup("instance"),
        $field = $(instance._$field);

    assert.equal($field.text(), instance.option("placeholder"), "no field text if no selected value");

    instance.option("value", 1);
    assert.equal($field.text(), 1, "field text is selected item value");
    assert.equal(instance.option("displayValue"), 1, "displayValue is selected item value");

    $(instance._$field).trigger("dxclick");

    var $selectedItem = $("." + LIST_ITEM_SELECTED_CLASS, instance._list.$element());
    assert.equal($selectedItem.text(), "1", "select right item after render list");
});

QUnit.test("value in field should be selected", function(assert) {
    var date = new Date(),
        items = [date],
        instance = $("#lookup").dxLookup({
            dataSource: items,
            value: date
        }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    var $selectedItem = $(instance._list.$element().find("." + LIST_ITEM_SELECTED_CLASS));

    assert.ok($selectedItem.length, "select item after render list");
});

QUnit.test("value with dataSource", function(assert) {
    var dataSource = new DataSource({
            store: [1, 2],
            pageSize: 1,
            paginate: false
        }),
        instance = $("#lookup").dxLookup({
            dataSource: dataSource,
            value: 2
        }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    var $firstItem = $(instance._list._itemElements()[0]),
        $secondItem = $(instance._list._itemElements()[1]),
        $field = $(instance._$field);

    assert.ok($secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was added");
    assert.ok(!$firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was not added to unselected item");
    assert.equal($field.text(), 2, "field text is selected item value");

    instance.option("value", 1);

    assert.ok(!$secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was deleted");
    assert.ok($firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was added");
    assert.equal($field.text(), 1, "field text is selected item value");
});

QUnit.test("value with dataSource and complex items", function(assert) {
    var dataSource = new DataSource({
            store: [
                { value: 1 },
                { value: 2 }
            ],
            pageSize: 1,
            paginate: false
        }),
        instance = $("#lookup").dxLookup({
            dataSource: dataSource,
            displayExpr: "value",
            valueExpr: "value",
            value: 2
        }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    var $firstItem = $(instance._list.$element().find(".dx-list-item")[0]),
        $secondItem = $(instance._list.$element().find(".dx-list-item")[1]),
        $field = $(instance._$field);

    assert.ok(!$firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was not added to unselected item");
    assert.ok($secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was added");
    assert.equal($field.text(), 2, "field text is selected item value");

    instance.option("value", 1);

    assert.ok($firstItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was added");
    assert.ok(!$secondItem.hasClass(LIST_ITEM_SELECTED_CLASS), "class selected was deleted");
    assert.equal($field.text(), 1, "field text is selected item value");
    assert.equal(instance.option("displayValue"), 1, "options 'displayValue' is selected item value");
});

QUnit.test("dataSource", function(assert) {
    var dataSource1 = [1, 2, 3],
        dataSource2 = [4, 5],
        instance = $("#lookup").dxLookup({ dataSource: dataSource1 }).dxLookup("instance"),
        list;

    $(instance._$field).trigger("dxclick");
    list = instance._list;

    assert.strictEqual(instance._dataSource, list._dataSource);
    assert.deepEqual(instance._dataSource._items, dataSource1);

    instance.option("dataSource", dataSource2);
    assert.strictEqual(instance._dataSource, list._dataSource);
    assert.deepEqual(instance._dataSource._items, dataSource2);
});

QUnit.test("items", function(assert) {
    var items1 = [1, 2, 3],
        items2 = [4, 5],
        instance = $("#lookup").dxLookup({ items: items1 }).dxLookup("instance"),
        list;

    $(instance._$field).trigger("dxclick");
    list = instance._list;

    assert.deepEqual(list._dataSource._items, items1);

    instance.option("items", items2);
    assert.deepEqual(list._dataSource._items, items2);
});

QUnit.test("items after null data source", function(assert) {
    var items2 = [4, 5],
        instance = $("#lookup").dxLookup({}).dxLookup("instance");

    instance.option("items", items2);

    $(instance._$field).trigger("dxclick");

    assert.deepEqual(instance._list._dataSource._items, items2);
});

QUnit.test("title", function(assert) {
    var instance = $("#lookup").dxLookup({
        dataSource: [],
        title: "title"
    }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    assert.equal(instance._popup.option("title"), "title", "title sets to popup correctly on init");

    instance.option("title", "title2");
    assert.equal(instance._popup.option("title"), "title2", "title sets to popup correctly on change");
});

QUnit.test("fullScreen", function(assert) {
    var instance = $("#lookup").dxLookup({
            dataSource: [],
            fullScreen: true,
            usePopover: false
        }).dxLookup("instance"),
        popup;

    $(instance._$field).trigger("dxclick");

    popup = instance._popup;
    assert.equal(popup.option("fullScreen"), true, "fullScreen sets to popup correctly on init");

    instance.option("fullScreen", false);
    $(instance._$field).trigger("dxclick");
    popup = instance._popup;
    assert.equal(popup.option("fullScreen"), false, "fullScreen sets to popup correctly on change");
});

QUnit.test("placeholder", function(assert) {
    var instance = $("#lookup").dxLookup({
        dataSource: []
    })
        .dxLookup("instance");

    assert.equal($(instance._$field).text(), "Select...", "default value");

    instance.option("placeholder", "placeholder");
    assert.equal($(instance._$field).text(), "placeholder", "set as option");
});

QUnit.test("minSearchLength", function(assert) {
    var placeholder = "placeholder",
        instance = $("#lookup").dxLookup({
            dataSource: ["abc", "def"],
            minSearchLength: 3,
            searchTimeout: 0,
            placeholder: placeholder
        }).dxLookup("instance");

    $(instance._$field).trigger("dxclick");

    var search = instance._searchBox,
        $field = $(instance._$field),
        $list = $(instance._list.$element());

    assert.equal($list.find(".dx-list-item").filter(":visible").length, 0, 'No items are expected to be shown');
    assert.equal($field.text(), placeholder);

    instance.option("minSearchLength", 0);
    assert.equal($list.find(".dx-list-item").filter(":visible").length, 2);
    assert.equal($field.text(), placeholder);

    instance.option("minSearchLength", 3);
    assert.equal($list.find(".dx-list-item").filter(":visible").length, 0);
    assert.equal($field.text(), placeholder);

    var selectedValueText = "def";
    instance.option("value", selectedValueText);
    assert.equal($(instance._$field).text(), selectedValueText);

    search.option("value", "abc");
    assert.ok($list.find(".dx-list-item").filter(":visible").length === 1);
    assert.equal($(instance._$field).text(), selectedValueText);

    search.option("value", "ab");
    assert.ok($list.find(".dx-list-item").filter(":visible").length === 0);
    assert.equal($(instance._$field).text(), selectedValueText);
});

QUnit.test("applyValueMode affects on Apply button rendering", function(assert) {
    var instance = $("#lookup").dxLookup({
        dataSource: ["abc", "def"],
        applyValueMode: "instantly"
    }).dxLookup("instance");

    instance.open();
    var $popupWrapper = $(".dx-popup-wrapper");
    assert.equal($popupWrapper.find(".dx-popup-done.dx-button").length, 0, "Apply button is not rendered");
    assert.ok(!instance.option("showDoneButton"), "'showDoneButton' option is false");

    instance.close();
    instance.option("applyValueMode", "useButtons");
    instance.open();

    $popupWrapper = $(".dx-popup-wrapper");
    assert.equal($popupWrapper.find(".dx-popup-done.dx-button").length, 1, "Apply button is rendered");
});

QUnit.test("'showCancelButton' option should affect on Cancel button rendering", function(assert) {
    var instance = $("#lookup").dxLookup({
        dataSource: ["abc", "def"],
        showCancelButton: true
    }).dxLookup("instance");

    instance.open();
    var $popupWrapper = $(".dx-popup-wrapper");
    assert.equal($popupWrapper.find(".dx-popup-cancel.dx-button").length, 1, "Apply button is not rendered");

    instance.close();
    instance.option("showCancelButton", false);
    instance.open();

    $popupWrapper = $(".dx-popup-wrapper");
    assert.equal($popupWrapper.find(".dx-popup-cancel.dx-button").length, 0, "Apply button is not rendered");
});

QUnit.test("search wrapper should not be rendered if the 'searchEnabled' option is false", function(assert) {
    var instance = $("#lookup").dxLookup({
        searchEnabled: false,
        opened: true
    }).dxLookup("instance");

    assert.equal($(instance.content()).find("." + LOOKUP_SEARCH_WRAPPER_CLASS).length, 0, "search wrapper is not rendered");
});

QUnit.test("search wrapper should be rendered if the 'searchEnabled' option is true", function(assert) {
    var instance = $("#lookup").dxLookup({
        searchEnabled: true,
        opened: true
    }).dxLookup("instance");

    assert.equal($(instance.content()).find("." + LOOKUP_SEARCH_WRAPPER_CLASS).length, 1, "search wrapper is rendered");
});


QUnit.module("popup options", {
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
});

QUnit.test("skip gesture event class attach only when popup is opened", function(assert) {
    var SKIP_GESTURE_EVENT_CLASS = "dx-skip-gesture-event";
    var $lookup = $("#lookup").dxLookup({
        items: [1, 2, 3]
    });

    assert.equal($lookup.hasClass(SKIP_GESTURE_EVENT_CLASS), false, "skip gesture event class was not added when popup is closed");

    $lookup.dxLookup("option", "opened", true);
    assert.equal($lookup.hasClass(SKIP_GESTURE_EVENT_CLASS), true, "skip gesture event class was added after popup was opened");

    $lookup.dxLookup("option", "opened", false);
    assert.equal($lookup.hasClass(SKIP_GESTURE_EVENT_CLASS), false, "skip gesture event class was removed after popup was closed");
});

QUnit.test("shading should present", function(assert) {
    var $lookup = $("#lookupOptions");

    var instance = $lookup.dxLookup({
        shading: true,
        visible: true,
        usePopover: false
    }).dxLookup("instance");

    openPopupWithList(instance);
    var $wrapper = $(toSelector(OVERLAY_WRAPPER_CLASS));

    assert.ok($wrapper.hasClass(OVERLAY_SHADER_CLASS));

    instance.option("shading", false);
    assert.ok(!$wrapper.hasClass(OVERLAY_SHADER_CLASS));
});

QUnit.test("popup should not be hidden after outsideClick", function(assert) {
    var $lookup = $("#lookupOptions"),

        instance = $lookup.dxLookup({
            dataSource: [1, 2, 3]
        }).dxLookup("instance");

    openPopupWithList(instance);

    var $overlay = $(toSelector(OVERLAY_CONTENT_CLASS)).eq(0);

    $(document).trigger("dxpointerdown");
    assert.equal($overlay.is(":visible"), true, "overlay is not hidden");
});

QUnit.test("lookup popup should be hidden after click outside was present", function(assert) {
    var $lookup = $("#lookupOptions"),

        instance = $lookup.dxLookup({
            closeOnOutsideClick: true,
            visible: true,
            usePopover: false
        }).dxLookup("instance");

    openPopupWithList(instance);

    var $overlay = $(toSelector(OVERLAY_CONTENT_CLASS)).eq(0);

    $($overlay).trigger("dxpointerdown");
    assert.equal($overlay.is(":visible"), true, "overlay is not hidden");

    $(document).trigger("dxpointerdown");
    assert.equal($overlay.is(":visible"), false, "overlay is hidden");
});

QUnit.test("custom titleTemplate option", function(assert) {
    var $lookup = $("#lookupOptions").dxLookup({
        titleTemplate: 'customTitle',
        visible: true,
        showCancelButton: false
    });

    openPopupWithList($lookup.dxLookup("instance"));

    var $title = $(toSelector(POPUP_TITLE_CLASS));

    assert.equal($.trim($title.text()), "testTitle", "title text is correct");
});

QUnit.test("custom titleTemplate option is set correctly on init", function(assert) {
    var $lookup = $("#lookupOptions").dxLookup({
            titleTemplate: function(titleElement) {
                assert.equal(isRenderer(titleElement), !!config().useJQuery, "titleElement is correct");
                var result = "<div class='test-title-renderer'>";
                result += "<h1>Title</h1>";
                result += "</div>";
                return result;
            }
        }),
        instance = $lookup.dxLookup("instance");

    openPopupWithList(instance);

    var $title = $(toSelector(POPUP_TITLE_CLASS));

    assert.ok($title.find(toSelector("test-title-renderer")).length, "option 'titleTemplate' was set successfully");
});

QUnit.test("custom titleTemplate and onTitleRendered option is set correctly by options", function(assert) {
    assert.expect(2);

    var $lookup = $("#lookupOptions").dxLookup(),
        instance = $lookup.dxLookup("instance");

    instance.option("onTitleRendered", function(e) {
        assert.ok(true, "option 'onTitleRendered' successfully passed to the popup widget raised on titleTemplate");
    });

    instance.option("titleTemplate", function(titleElement) {
        var result = "<div class='changed-test-title-renderer'>";
        result += "<h1>Title</h1>";
        result += "</div>";

        return result;
    });

    openPopupWithList(instance);
    var $title = $(toSelector(POPUP_TITLE_CLASS));

    assert.ok($title.find(toSelector("changed-test-title-renderer")).length, "option 'titleTemplate' successfully passed to the popup widget");
});

QUnit.test("popup does not close when filtering datasource has item equal selected item", function(assert) {
    var $lookup = $("#lookup").dxLookup({
        dataSource: ["red", "yellow"],
        value: "yellow",
        searchTimeout: 0
    });

    $lookup.dxLookup("option", "opened", true);

    var $popupContent = $(toSelector(POPUP_CONTENT_CLASS));
    keyboardMock($popupContent.find("." + TEXTEDITOR_INPUT_CLASS)).type("y");

    assert.ok($lookup.dxLookup("option", "opened"), "lookup stays opened");
});

QUnit.test("popup should have correct width when lookup rendered in invisible area", function(assert) {
    var originalCurrentDevice = devices.current();
    devices.current({ platform: "generic" });

    try {
        var $lookup = $("#lookup");
        var $lookupWrapper = $lookup.wrap("<div>").parent().hide();
        var lookup = $lookup.dxLookup({
            items: [1, 2, 3],
            deferRendering: false,
            usePopover: true,
            width: 200
        }).dxLookup("instance");

        $lookupWrapper.show();

        $lookup.css("border", "1px solid black");
        lookup.option("opened", true);

        var $overlayContent = $(".dx-overlay-content");
        assert.equal($overlayContent.outerWidth(), $lookup.outerWidth(), "width equal to lookup width");
    } finally {
        devices.current(originalCurrentDevice);
    }
});

QUnit.test("popup height should be saved after configuration", function(assert) {
    $("#lookup").dxLookup({
        dataSource: [1, 2, 3, 4, 5],
        popupHeight: $(window).height() * 0.8,
        opened: true,
        fullScreen: false,
        usePopover: false
    });

    assert.roughEqual($(".dx-overlay-content").outerHeight(), Math.round($(window).height() * 0.8), 1, "height equal to lookup height");
});

QUnit.test("popup height should be stretch when data items are loaded asynchronously", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    $("#lookup").dxLookup({
        dataSource: new CustomStore({
            load: function(loadOptions) {
                var deferred = $.Deferred();
                var employeesList = ['John Heart', 'Samantha Bright', 'Arthur Miller', 'Robert Reagan', 'Greta Sims', 'Brett Wade',
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
        showPopupTitle: false,
        usePopover: false,
        opened: true
    });

    var defaultHeight = $(".dx-overlay-content").outerHeight();

    this.clock.tick();

    assert.ok($(".dx-overlay-content").outerHeight() > defaultHeight, "popup height is changed when data is loaded");
});


QUnit.module("list options", {
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
});

QUnit.test("list option bouncing", function(assert) {
    var dataSource = new DataSource({
        store: [1, 2, 3],
        paginate: false
    });

    var $lookup = $("#lookupOptions").dxLookup({
        dataSource: dataSource,
        pageLoadMode: "scrollBottom",
        nextButtonText: "test",
        pullRefreshEnabled: true,
        pullingDownText: "testPulling",
        pulledDownText: "testPulled",
        refreshingText: "testRefresh",
        pageLoadingText: "testLoading"
    });

    var instance = $lookup.dxLookup("instance");

    openPopupWithList(instance);

    var $list = $(toSelector(LIST_CLASS)),
        list = $list.dxList("instance");

    assert.equal(list.option("pageLoadMode"), "scrollBottom", "pageLoadMode was bounced");
    instance.option("pageLoadMode", "nextButton");
    assert.equal(list.option("pageLoadMode"), "nextButton", "pageLoadMode was changed");

    assert.equal(list.option("nextButtonText"), "test", "nextButtonText was bounced");
    instance.option("nextButtonText", "testchange");
    assert.equal(list.option("nextButtonText"), "testchange", "nextButtonText was changed");

    assert.equal(list.option("pullRefreshEnabled"), true, "pullRefreshEnabled was bounced");
    instance.option("pullRefreshEnabled", false);
    assert.equal(list.option("pullRefreshEnabled"), false, "pullRefreshEnabled was changed");

    assert.equal(list.option("pullingDownText"), "testPulling", "pullingDownText was bounced");
    instance.option("pullingDownText", "testPullingChange");
    assert.equal(list.option("pullingDownText"), "testPullingChange", "pullingDownText was changed");

    assert.equal(list.option("pulledDownText"), "testPulled", "pulledDownText was bounced");
    instance.option("pulledDownText", "testPulledChange");
    assert.equal(list.option("pulledDownText"), "testPulledChange", "pulledDownText was changed");

    assert.equal(list.option("refreshingText"), "testRefresh", "refreshingText was bounced");
    instance.option("refreshingText", "testRefreshChange");
    assert.equal(list.option("refreshingText"), "testRefreshChange", "refreshingText was changed");

    assert.equal(list.option("pageLoadingText"), "testLoading", "pageLoadingText was bounced");
    instance.option("pageLoadingText", "testLoadingChange");
    assert.equal(list.option("pageLoadingText"), "testLoadingChange", "pageLoadingText was changed");
});

QUnit.test("group options bouncing", function(assert) {
    var dataSource = [{ key: "header1", items: ["1", "2"] },
            { key: "header2", items: ["1", "2"] }],
        $lookup = $("#lookupOptions").dxLookup({
            dataSource: dataSource,
            grouped: true,
            groupTemplate: "testGroupTemplate"
        }),
        instance = $lookup.dxLookup("instance");

    openPopupWithList(instance);

    var $list = $(toSelector(LIST_CLASS)),
        list = $list.dxList("instance");

    assert.equal(list.option("grouped"), true, "grouped was bounced");

    var $title = $(toSelector(LIST_GROUP_HEADER_CLASS));
    assert.equal($title.length, 2, "there are 2 group titles");
    $title = $title.eq(0);
    assert.equal($.trim($title.text()), "testGroupTemplate", "title text is correct");

    instance.option("groupTemplate", function(itemData, itemIndex, itemElement) {
        assert.equal(isRenderer(itemElement), !!config().useJQuery, "itemElement is correct");
        return "test";
    });

    $title = $(toSelector(LIST_GROUP_HEADER_CLASS)).eq(0);
    assert.equal($.trim($title.text()), "test", "title text is correct");
});

QUnit.module("Native scrolling");

QUnit.test("After load new page scrollTop should not be changed", function(assert) {
    var data = [],
        done = assert.async();

    for(var i = 100; i >= 0; i--) {
        data.push(i);
    }

    $("#qunit-fixture").css("position", "static");

    var $lookup = $("#lookupOptions").dxLookup({
        searchEnabled: true,
        dataSource: {
            store: new ArrayStore(data),
            paginate: true,
            pageSize: 40
        },
        fullScreen: false,
        searchTimeout: 0,
        width: 200,
        usePopover: false,
        popupHeight: "50%"
    });

    $lookup.dxLookup("instance").open();

    var listInstance = $(".dx-list").dxList("instance");

    listInstance.option("pageLoadMode", "scrollBottom");
    listInstance.option("useNativeScrolling", "true");
    listInstance.option("useNative", "true");

    listInstance.scrollTo(1000);
    var scrollTop = listInstance.scrollTop();

    setTimeout(function() {
        assert.roughEqual(listInstance.scrollTop(), scrollTop, 2, "scrollTop is correctly after new page load");
        done();
    });
});

QUnit.test("Popup height should be decrease after a loading of new page and searching", function(assert) {
    var data = [];

    for(var i = 100; i >= 0; i--) {
        data.push(i);
    }
    data.push("a");

    $("#qunit-fixture").css("position", "static");

    var $lookup = $("#lookupOptions").dxLookup({
        searchEnabled: true,
        dataSource: {
            store: new ArrayStore(data),
            paginate: true,
            pageSize: 20
        },
        searchTimeout: 0,
        width: 200,
        usePopover: false,
        popupHeight: "auto",
        fullScreen: false
    });

    $lookup.dxLookup("instance").open();

    var $list = $(".dx-list");
    var listInstance = $(".dx-list").dxList("instance");

    listInstance.option("pageLoadMode", "scrollBottom");
    listInstance.option("useNativeScrolling", "true");
    listInstance.option("useNative", "true");
    listInstance._loadNextPage();

    var listHeight = $list.outerHeight();

    var $input = $(".dx-lookup-search").find("." + TEXTEDITOR_INPUT_CLASS);
    var keyboard = keyboardMock($input);

    keyboard.type("a");

    var currentListHeight = $list.outerHeight();

    assert.notEqual(listHeight, currentListHeight, "popup should be collapsed after search");
});


QUnit.module("widget sizing render");

QUnit.test("default", function(assert) {
    var $element = $("#widget").dxLookup();

    assert.ok($element.outerWidth() > 0, "outer width of the element must be more than zero");
});

QUnit.test("change width", function(assert) {
    var $element = $("#widget").dxLookup(),
        instance = $element.dxLookup("instance"),
        customWidth = 400;

    instance.option("width", customWidth);

    assert.strictEqual($element.outerWidth(), customWidth, "outer width of the element must be equal to custom width");
});


QUnit.module("focus policy", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.testInActiveWindow("T338144 - focused element should not be reset after popup is reopened if the 'searchEnabled' is false", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var instance = $("#widget").dxLookup({
            items: [1, 2, 3],
            opened: true,
            searchEnabled: false
        }).dxLookup("instance"),
        $list = $($(instance.content()).find(".dx-list")),
        $listItems = $list.find(".dx-item"),
        list = $list.dxList("instance");

    $($listItems.eq(1)).trigger("dxclick");
    instance.open();

    assert.equal($(list.option("focusedElement")).text(), $listItems.eq(1).text(), "clicked item is focused after popup is reopened");
});

QUnit.test("field method returning overlay content", function(assert) {
    var $element = $("#widget").dxLookup({
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance"),
        $field = instance.field();

    assert.ok($field.hasClass(LOOKUP_FIELD_CLASS), "field has class dx-texteditor-input");
});

QUnit.testInActiveWindow("lookup search get focus on opening", function(assert) {
    var $element = $("#widget").dxLookup({
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance");

    instance.focus();
    assert.ok($element.hasClass(FOCUSED_CLASS), "'focus' method focus field with closed overlay");

    instance.option("opened", true);

    var $searchBox = instance._$searchBox;
    assert.ok($searchBox.hasClass(FOCUSED_CLASS), "'focus' method focus searchBox with opened overlay");
});

QUnit.testInActiveWindow("lookup field should get focus when popup was closed", function(assert) {
    var $element = $("#widget").dxLookup({
            focusStateEnabled: true,
            opened: true
        }),
        instance = $element.dxLookup("instance");

    instance.close();

    assert.ok($element.hasClass(FOCUSED_CLASS), "lookup field gets focus after popup closing");
});

QUnit.test("lookup should not lose focus when clicking inside popup", function(assert) {
    assert.expect(1);

    var $element = $("#widget").dxLookup({
            focusStateEnabled: true,
            opened: true
        }),
        instance = $element.dxLookup("instance"),
        $content = $(instance._popup.$content());

    $($content).on("dxpointerdown", function(e) {
        assert.ok(!e.isDefaultPrevented(), "elements inside popup get focus");
    });

    $($content).trigger("dxpointerdown");
});


QUnit.module("keyboard navigation", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("lookup popup open by enter key press", function(assert) {
    assert.expect(2);

    var $element = $("#widget").dxLookup({
            focusStateEnabled: true
        }),
        instance = $element.dxLookup("instance"),
        $field = $(instance._$field).focusin(),
        keyboard = keyboardMock($field);

    assert.ok(!instance.option("opened"));
    keyboard.keyDown("enter");

    assert.ok(instance.option("opened"), "enter key on field open popup");
}),

QUnit.test("lookup popup open by space key press", function(assert) {
    assert.expect(2);

    var $element = $("#widget").dxLookup({
            focusStateEnabled: true
        }),
        instance = $element.dxLookup("instance"),
        $field = $(instance._$field).focusin(),
        keyboard = keyboardMock($field);

    assert.ok(!instance.option("opened"));
    keyboard.keyDown("space");

    assert.ok(instance.option("opened"), "space key on field open popup");
}),

QUnit.testInActiveWindow("lookup search field focused after open popup", function(assert) {
    var $element = $("#widget").dxLookup({
            opened: true,
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance");

    assert.ok(instance.option("opened"));
    assert.ok(instance._$searchBox.hasClass(FOCUSED_CLASS), "searchBox has focus after open popup");
}),

QUnit.testInActiveWindow("lookup-list should be focused after 'down' key pressing", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $element = $("#widget").dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance");

    var keyboard = keyboardMock(instance._$searchBox.find(".dx-texteditor-input"));
    keyboard.keyDown("down");

    assert.ok(instance._$list.find(".dx-list-item").first().hasClass(FOCUSED_CLASS), "list-item is focused after down key pressing");
}),

QUnit.testInActiveWindow("lookup-list keyboard navigation should work after focusing on list", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $element = $("#widget").dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance");

    $(instance._$list).focus();
    assert.ok(instance._$list.find(".dx-list-item").eq(0).hasClass(FOCUSED_CLASS), "list-item is focused after focusing on list");

    var keyboard = keyboardMock(instance._$list);
    keyboard.keyDown("down");

    assert.ok(instance._$list.find(".dx-list-item").eq(1).hasClass(FOCUSED_CLASS), "second list-item is focused after down key pressing");
}),

QUnit.testInActiveWindow("lookup item should be selected after 'enter' key pressing", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $element = $("#widget").dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance");

    var keyboard = keyboardMock(instance._$searchBox.find(".dx-texteditor-input"));
    keyboard.keyDown("down");
    keyboard.keyDown("down");
    keyboard.keyDown("enter");

    assert.equal(instance.option("value"), 2, "value is correct");
}),

QUnit.testInActiveWindow("lookup item should be selected after 'space' key pressing", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $element = $("#widget").dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance");

    var keyboard = keyboardMock(instance._$searchBox.find(".dx-texteditor-input"));
    keyboard.keyDown("down");
    keyboard.keyDown("down");
    keyboard.keyDown("space");

    assert.equal(instance.option("value"), 2, "value is correct");
}),

QUnit.testInActiveWindow("keyboard for lookup-list should work correctly after 'searchEnabled' option changed", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var $element = $("#widget").dxLookup({
            opened: true,
            items: [1, 2, 3],
            focusStateEnabled: true,
            searchEnabled: true
        }),
        instance = $element.dxLookup("instance");

    instance.option('searchEnabled', false);

    var keyboard = keyboardMock(instance._$list);
    keyboard.keyDown("down");

    assert.ok(instance._$list.find(".dx-list-item").first().hasClass(FOCUSED_CLASS), "list-item is focused after down key pressing");
}),

QUnit.test("space key press on readOnly lookup doesn't toggle popup visibility", function(assert) {
    var instance = $("#lookup").dxLookup({
            items: [0, 1, 2],
            readOnly: true,
            focusStateEnabled: true
        }).dxLookup("instance"),
        $field = $(instance._$field).focusin(),
        keyboard = keyboardMock($field);

    keyboard.keyDown("space");
    assert.ok(!instance.option("opened"), "when we press space key - popup is still hidden");

    instance.option("readOnly", false);
    keyboard.keyDown("space");
    assert.ok(instance.option("opened"), "when we press space key - popup is visible after option changed");
});

QUnit.test("enter key press on readOnly lookup doesn't toggle popup visibility", function(assert) {
    var instance = $("#lookup").dxLookup({
            items: [0, 1, 2],
            readOnly: true,
            focusStateEnabled: true
        }).dxLookup("instance"),
        $field = $(instance._$field).focusin(),
        keyboard = keyboardMock($field);

    keyboard.keyDown("enter");
    assert.ok(!instance.option("opened"), "when we press enter key - popup is still hidden");

    instance.option("readOnly", false);
    keyboard.keyDown("enter");
    assert.ok(instance.option("opened"), "when we press enter key - popup is visible after option changed");
});

QUnit.test("escape key press close overlay with search enabled", function(assert) {
    var instance = $("#lookup").dxLookup({
            items: [0, 1, 2],
            opened: true,
            focusStateEnabled: true,
            searchEnabled: true
        }).dxLookup("instance"),
        keyboard = keyboardMock(instance._$searchBox.find(".dx-texteditor-input"));

    assert.ok(instance.option("opened"), "overlay opened");

    keyboard.keyDown("esc");
    assert.ok(!instance.option("opened"), "overlay close on escape");
});

QUnit.test("escape key press close overlay without search enabled", function(assert) {
    if(devices.real().deviceType !== "desktop") {
        assert.ok(true, "test does not actual for mobile devices");
        return;
    }

    var instance = $("#lookup").dxLookup({
            items: [0, 1, 2],
            opened: true,
            focusStateEnabled: true,
            searchEnabled: false
        }).dxLookup("instance"),
        keyboard = keyboardMock(instance._$list);

    assert.ok(instance.option("opened"), "overlay opened");

    keyboard.keyDown("esc");
    assert.ok(!instance.option("opened"), "overlay close on escape");
});

QUnit.test("T320459 - the 'space' key press should prevent default behavior while navigating list", function(assert) {
    var lookup = $("#lookup").dxLookup({
            items: [1, 2, 3],
            opened: true,
            focusStateEnabled: true
        }).dxLookup("instance"),
        $popupInput = $($(lookup.content()).find("." + TEXTEDITOR_INPUT_CLASS)),
        keyboard = keyboardMock($popupInput),
        event;

    lookup._list.option("focusStateEnabled", true);

    $($popupInput).on("keydown", function(e) {
        if(e.key === " ") {
            event = e;
        }
    });

    $popupInput.focus();

    keyboard
        .press("down")
        .press("space");

    assert.ok(event.isDefaultPrevented(), "default is prevented");
});

QUnit.test("T320459 - the 'space' key press on editor should prevent default behavior", function(assert) {
    var lookup = $("#lookup").dxLookup({
            items: [1, 2, 3],
            focusStateEnabled: true
        }).dxLookup("instance"),
        $input = $(lookup.field()),
        keyboard = keyboardMock($input),
        event;

    $($input).on("keydown", function(e) {
        if(e.key === " ") {
            event = e;
        }
    });

    $input.focus();

    keyboard
        .press("space");

    assert.ok(event.isDefaultPrevented(), "default is prevented");
});

QUnit.test("'Home', 'End' keys does not changed default behaviour in searchField", function(assert) {
    var lookup = $("#lookup").dxLookup({
        items: [1, 2, 3],
        focusStateEnabled: true,
        opened: true
    }).dxLookup("instance");

    var $input = $(".dx-lookup-search input");
    var keyboard = keyboardMock($input);

    keyboard.keyDown("home");
    keyboard.keyDown("enter");

    assert.equal(lookup.option("value"), undefined, "home key works correctly");
});


QUnit.module("dataSource integration");

QUnit.test("search should be execute after paste", function(assert) {
    var originalFX = fx.off;
    fx.off = true;
    var clock = sinon.useFakeTimers();
    try {
        $("#lookup").dxLookup({
            dataSource: ["one", "two", "three"],
            opened: true,
            searchEnabled: true,
            searchTimeout: 0,
            searchMode: "contains"
        });

        var $input = $(toSelector(POPUP_CONTENT_CLASS) + " " + toSelector(TEXTEDITOR_INPUT_CLASS));
        $($input.val("o")).trigger("input");
        clock.tick();
        assert.equal($(".dx-list-item").length, 2, "filters execute on input event");

    } finally {
        clock.restore();
        fx.off = originalFX;
    }
});


QUnit.module("Validation", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Validation message", function(assert) {
    var $element = $("#widget").dxLookup(),
        instance = $element.dxLookup("instance");

    instance.option({
        isValid: false,
        validationError: { message: "Some error happened" }
    });

    assert.ok(instance);

});

QUnit.test("Validation message", function(assert) {
    var $element = $("#widget").dxLookup(),
        instance = $element.dxLookup("instance");

    instance.option({
        isValid: true,
        validationError: null
    });

    assert.ok(instance);
});

QUnit.test("Pending indicator is rendered", function(assert) {
    const $element = $("#widget").dxLookup(),
        instance = $element.dxLookup("instance");

    instance.option("validationStatus", "pending");
    assert.ok($element.find(".dx-pending-indicator").dxLoadIndicator("instance").option("visible"));
});

QUnit.test("Lookup should select an item in the grouped list", function(assert) {
    var data = [{
        "ID": 1,
        "Assigned": "Mr. John Heart",
        "Subject": "Choose between PPO and HMO Health Plan"
    }, {
        "ID": 2,
        "Assigned": "Mr. John Heart",
        "Subject": "Google AdWords Strategy"
    }, {
        "ID": 3,
        "Assigned": "Mr. YBob",
        "Subject": "New Brochures"
    }];

    var $element = $("#widget").dxLookup({
            dataSource: new DataSource({
                store: data,
                key: "ID",
                group: "Assigned"
            }),
            grouped: true,
            displayExpr: "Subject",
            opened: true
        }),
        instance = $element.dxLookup("instance");

    $(".dx-list-item .dx-list-item-content").eq(2).trigger("dxclick");

    assert.deepEqual(instance.option("value"), {
        "ID": 3,
        "Assigned": "Mr. YBob",
        "Subject": "New Brochures"
    }, "option 'value' is correct");

    assert.deepEqual(instance.option("text"), "New Brochures", "option 'text' is correct");
    assert.equal($element.find(".dx-lookup-field").text(), "New Brochures", "text field is correct");
});


QUnit.module("device and theme specific tests", {
    beforeEach: function() {
        this._originalDevice = devices.current();
    },

    afterEach: function() {
        devices.current(this._originalDevice);
    }
});

QUnit.test("search button on iOS", function(assert) {
    devices.current("iPad");

    var lookup = $("#secondLookup").dxLookup({
        displayExpr: "value",
        valueExpr: "value",
        value: 3,
        searchTimeout: 0
    }).dxLookup("instance");

    openPopupWithList(lookup);

    var $popupWrapper = $(".dx-popup-wrapper");

    assert.equal($popupWrapper.find(".dx-popup-title").find(".dx-button").length, 1, "button is present in popup title");
    assert.equal($popupWrapper.find(".dx-list").length, 1, "list is present in popup");
});

QUnit.test("popup title collapse if empty title option (B232073)", function(assert) {
    var instance = $("#lookup").dxLookup({}).dxLookup("instance"),
        popup;

    $(instance._$field).trigger("dxclick");
    popup = instance._popup;

    var $popupTitle = $(popup._wrapper()).find(".dx-popup-title");
    assert.ok($popupTitle.height() > 0);
});

var helper;
if(devices.real().deviceType === "desktop") {
    [true, false].forEach((searchEnabled) => {
        QUnit.module(`Aria accessibility, searchEnabled: ${searchEnabled}`, {
            beforeEach: () => {
                helper = new ariaAccessibilityTestHelper({
                    createWidget: ($element, options) => new Lookup($element,
                        $.extend({
                            searchEnabled: searchEnabled
                        }, options))
                });
            },
            afterEach: () => {
                helper.$widget.remove();
            }
        }, () => {
            QUnit.test(`opened: true, searchEnabled: ${searchEnabled}`, () => {
                helper.createWidget({ opened: true });

                const $field = helper.$widget.find(`.${LOOKUP_FIELD_CLASS}`);
                const $list = $(`.${LIST_CLASS}`);
                const $input = helper.widget._popup.$content().find(`.${TEXTEDITOR_INPUT_CLASS}`);

                helper.checkAttributes($list, { id: helper.widget._listId, label: "No data to display", role: "listbox", tabindex: "0" }, "list");
                helper.checkAttributes($field, { role: "combobox", expanded: "true", activedescendant: helper.widget._list.getFocusedItemId(), tabindex: '0', controls: helper.widget._listId }, "field");
                helper.checkAttributes(helper.$widget, { owns: helper.widget._popupContentId }, "widget");
                helper.checkAttributes(helper.widget._popup.$content(), { id: helper.widget._popupContentId }, "popupContent");
                if($input.length) {
                    helper.checkAttributes($input, { autocomplete: "off", type: "text", spellcheck: "false", tabindex: "0", role: "textbox" }, "input");
                }

                helper.widget.option("searchEnabled", !searchEnabled);
                helper.checkAttributes($list, { id: helper.widget._listId, label: "No data to display", role: "listbox", tabindex: "0" }, "list");
                helper.checkAttributes($field, { role: "combobox", expanded: "true", activedescendant: helper.widget._list.getFocusedItemId(), tabindex: '0', controls: helper.widget._listId }, "field");
                helper.checkAttributes(helper.$widget, { owns: helper.widget._popupContentId }, "widget");
                helper.checkAttributes(helper.widget._popup.$content(), { id: helper.widget._popupContentId }, "popupContent");
                if($input.length) {
                    helper.checkAttributes($input, { autocomplete: "off", type: "text", spellcheck: "false", tabindex: "0", role: "textbox" }, "input");
                }
            });

            QUnit.test(`Opened: false, searchEnabled: ${searchEnabled}`, () => {
                helper.createWidget({ opened: false });

                const $field = helper.$widget.find(`.${LOOKUP_FIELD_CLASS}`);

                helper.checkAttributes(helper.$widget, {}, "widget");
                helper.checkAttributes($field, { role: "combobox", expanded: "false", tabindex: '0' }, "field");

                helper.widget.option("searchEnabled", !searchEnabled);
                helper.checkAttributes(helper.$widget, {}, "widget");
                helper.checkAttributes($field, { role: "combobox", expanded: "false", tabindex: '0' }, "field");
            });

            QUnit.test("aria-target for lookup's list should point to the list's focusTarget", function(assert) {
                helper.createWidget({ opened: true });

                let list = $(`.${LIST_CLASS}`).dxList("instance");
                assert.deepEqual(list._getAriaTarget(), list.$element(), "aria target for nested list is correct");
            });
        });
    });
}

QUnit.module("default options", {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test("Check default popupWidth, popupHeight, position.of for Material theme", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    var $lookup = $("<div>").prependTo("body");

    try {

        var lookup = $lookup.dxLookup({ dataSource: ["blue", "orange", "lime", "purple"] }).dxLookup("instance");

        assert.equal(lookup.option("popupWidth")(), $lookup.outerWidth(), "popup width match with lookup field width");
        assert.equal(lookup.option("position").of, lookup.element(), "popup position of lookup field");

        $(lookup.field()).trigger("dxclick");

        assert.equal(lookup.option("popupHeight")(), $(".dx-list-item").height() * 4 + 16, "popup height contains 4 list items and 2 paddings (8px)");

        lookup.close();
        lookup.option("popupWidth", 200);
        lookup.option("popupHeight", 300);

        $(lookup.field()).trigger("dxclick");

        assert.equal(lookup.option("popupHeight"), 300, "popup height changed if change popupHeight option value");
        assert.equal(lookup.option("popupWidth"), 200, "popup width changed if change popupWidth option value");

        lookup.close();

    } finally {
        $lookup.remove();
        themes.isMaterial = origIsMaterial;
    }
});

QUnit.test("Check popup position offset for Material theme", function(assert) {
    var origIsMaterial = themes.isMaterial;
    themes.isMaterial = function() { return true; };

    var $lookup = $("<div>").prependTo("body");

    try {

        var lookup = $lookup.dxLookup({ dataSource: ["blue", "orange", "lime", "purple", "red", "green", "yellow"], value: "blue" }).dxLookup("instance");

        $(lookup.field()).trigger("dxclick");

        var $popup = $(".dx-popup-wrapper");

        assert.roughEqual($popup.find(".dx-overlay-content").position().top, -3.5, 1, "offset of the lookup if first item is selected");

        lookup._list.scrollTo(100);

        lookup.close();

        $(lookup.field()).trigger("dxclick");

        assert.roughEqual($popup.find(".dx-overlay-content").position().top, -3.5, 1, "offset of the lookup after scrolling and without item selecting");

        lookup.close();

        lookup.option("value", "purple");

        $(lookup.field()).trigger("dxclick");

        assert.roughEqual($popup.find(".dx-overlay-content").position().top, -2.5, 1, "offset of the lookup if last item is selected");

        lookup.close();

        lookup.option("dataSource", []);

        $(lookup.field()).trigger("dxclick");

        assert.roughEqual($popup.find(".dx-overlay-content").position().top, 0, 1, "offset of the lookup if not selected item");
    } finally {
        $lookup.remove();
        themes.isMaterial = origIsMaterial;
    }
});

QUnit.test("changing popupWidth in default options should change popover width", function(assert) {
    var defaultWidth = 100;

    Lookup.defaultOptions({
        options: {
            usePopover: true,
            fullScreen: false,
            popupWidth: defaultWidth
        }
    });
    var $lookup = $("<div>").prependTo("body");

    try {
        $lookup.dxLookup({ opened: true });
        var $popoverContent = $(".dx-overlay-content:visible");

        assert.ok(Math.abs(defaultWidth - $popoverContent.width()) <= 2);
    } finally {
        $lookup.remove();
        Lookup.defaultOptions([]);
    }
});
