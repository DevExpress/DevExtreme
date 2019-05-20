import $ from "jquery";
import HierarchicalCollectionWidget from "ui/hierarchical_collection/ui.hierarchical_collection_widget";
import { DataSource } from "data/data_source/data_source";

const DISABLED_STATE_CLASS = "dx-state-disabled";
let { module, test } = QUnit;

const TestComponent = HierarchicalCollectionWidget.inherit({

    NAME: "TestComponent",

    _activeStateUnit: ".item",

    _itemContainer: function() {
        return this.$element();
    },

    _createActionByOption: function(optionName, config) {
        this.__actionConfigs[optionName] = config;
        return this.callBase.apply(this, arguments);
    },

    __actionConfigs: {}
});

const createHierarchicalCollectionWidget = function(options) {
    return new TestComponent($("#hcw"), options);
};

module("render", {
    beforeEach: function() {
        this.element = $("#hcw");
    },
    afterEach: function() {
        delete this.element;
    }
}, () => {
    test("Create item by custom model using expressions", function(assert) {
        createHierarchicalCollectionWidget({
            displayExpr: "name",
            disabledExpr: "isDisabled",
            items: [
                { name: "item 1", isDisabled: true },
                { name: "item 2" }
            ]
        });

        assert.equal(this.element.children().length, 2);
        assert.equal($.trim(this.element.children().eq(0).text()), "item 1");
        assert.ok($.trim(this.element.children().eq(0).hasClass(DISABLED_STATE_CLASS)));
        assert.equal($.trim(this.element.children().eq(1).text()), "item 2");
    });

    test("Default displayExpr: ", function(assert) {
        createHierarchicalCollectionWidget({
            items: [{ text: "item 1" }]
        });

        assert.equal($.trim(this.element.children().eq(0).text()), "item 1");
    });

    test("DisplayExpr as function", function(assert) {
        createHierarchicalCollectionWidget({
            displayExpr: function() {
                return "name";
            },
            items: [{ name: "Item 1" }]
        });

        assert.equal($.trim(this.element.children().eq(0).text()), "name");
    });

    test("DisplayExpr as function with parameter", function(assert) {
        createHierarchicalCollectionWidget({
            displayExpr: function(itemData) {
                return itemData && itemData.name + "!";
            },
            items: [{ name: "Item 1" }]
        });

        assert.equal($.trim(this.element.children().eq(0).text()), "Item 1!");
    });

    [null, undefined, ""].forEach((dataExprValue) => {
        test(`DisplayExpr: ${dataExprValue}`, (assert) => {
            try {
                createHierarchicalCollectionWidget({
                    displayExpr: dataExprValue,
                    items: [{ name: "item 1" }]
                });

                let $item = $("#hcw").find(".dx-item").eq(0);
                assert.equal($item.text(), "");
            } catch(e) {
                assert.ok(false, "Error has been raised");
            }
        });
    });

    test("Expressions should be reinitialized if *expr option was changed", function(assert) {
        var widget = createHierarchicalCollectionWidget({
                displayExpr: "FirstName",
                selectedExpr: "isSelected",
                itemsExpr: "subItems",
                disabledExpr: "isDisabled",
                items: [
                    {
                        FirstName: "John",
                        LastName: "Smith",

                        isSelected: true,
                        wasSelected: false,

                        subItems: [{ FirstName: "Mike", LastName: "Smith" }],
                        subLevel: [{ FirstName: "Jack", LastName: "John", }],

                        isDisabled: true,
                        wasDisabled: false,
                    }
                ]
            }),
            item = widget.option("items")[0];

        widget.option("displayExpr", "LastName");
        assert.equal(widget._displayGetter(item), "Smith");

        widget.option("selectedExpr", "wasSelected");
        assert.equal(widget._selectedGetter(item), false);

        widget.option("itemsExpr", "subLevel");
        assert.equal(widget._itemsGetter(item)[0].FirstName, "Jack");

        widget.option("disabledExpr", "wasDisabled");
        assert.equal(widget._disabledGetter(item), false);
    });

    test("Dynamic templates should be rerendered when displayExpr was changed", function(assert) {
        var widget = createHierarchicalCollectionWidget({
                displayExpr: "FirstName",
                items: [
                    {
                        FirstName: "John",
                        LastName: "Smith"
                    }
                ]
            }),
            $item = $("#hcw").find(".dx-item").eq(0);

        assert.equal($item.text(), "John", "item text is correct on init");

        widget.option("displayExpr", "LastName");

        $item = $("#hcw").find(".dx-item").eq(0);
        assert.equal($item.text(), "Smith", "item text was changed");
    });

    test("Ignore dataSource paging", function(assert) {
        createHierarchicalCollectionWidget({
            dataSource: new DataSource({
                store: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
                paginate: true,
                pageSize: 2
            })
        });

        assert.equal(this.element.children().length, 3);
    });

    test("Datasource should load once on hcw init", function(assert) {
        var dataSourceLoaded = 0;

        createHierarchicalCollectionWidget({
            dataSource: new DataSource({
                store: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
                paginate: true,
                pageSize: 2,
                load: function() {
                    dataSourceLoaded++;
                }
            })
        });

        assert.equal(dataSourceLoaded, 1, "dataSource was loaded once");
    });
});
