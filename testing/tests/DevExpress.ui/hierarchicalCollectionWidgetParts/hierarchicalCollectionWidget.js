import $ from "jquery";
import HierarchicalCollectionWidget from "ui/hierarchical_collection/ui.hierarchical_collection_widget";
import { DataSource } from "data/data_source/data_source";

const DISABLED_STATE_CLASS = "dx-state-disabled";

let { module, test } = QUnit;

var TestComponent = HierarchicalCollectionWidget.inherit({

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

const createHierarchicalCollectionWidget = options => new TestComponent($("#hcw"), options);

module("render", {
    beforeEach: () => {
        this.element = $("#hcw");
    },
    afterEach: () => {
        delete this.element;
    }
}, () => {
    test("Create item by custom model using expressions", (assert) => {
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

    test("create item by custom model using expressions set as functions", (assert) => {
        var condition = false,
            newItems = [{ name: "item 1" }],
            widget = createHierarchicalCollectionWidget({
                displayExpr: () => condition ? "name" : "text",
                items: [{ text: "first item" }]
            });

        assert.equal($.trim(this.element.children().eq(0).text()), "first item");

        condition = true;
        widget.option("items", newItems);

        assert.equal($.trim(this.element.children().eq(0).text()), "item 1");
    });

    test("Expressions should be reinitialized if *expr option was changed", (assert) => {
        const widget = createHierarchicalCollectionWidget({
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

    test("Dynamic templates should be rerendered when displayExpr was changed", (assert) => {
        const widget = createHierarchicalCollectionWidget({
            displayExpr: "FirstName",
            items: [
                {
                    FirstName: "John",
                    LastName: "Smith"
                }
            ]
        });
        let $item = $("#hcw").find(".dx-item").eq(0);

        assert.equal($item.text(), "John", "item text is correct on init");

        widget.option("displayExpr", "LastName");

        $item = $("#hcw").find(".dx-item").eq(0);
        assert.equal($item.text(), "Smith", "item text was changed");
    });

    test("Ignore dataSource paging", (assert) => {
        createHierarchicalCollectionWidget({
            dataSource: new DataSource({
                store: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
                paginate: true,
                pageSize: 2
            })
        });

        assert.equal(this.element.children().length, 3);
    });

    test("Datasource should load once on hcw init", (assert) => {
        let dataSourceLoaded = sinon.spy();

        createHierarchicalCollectionWidget({
            dataSource: new DataSource({
                store: [{ text: "item 1" }, { text: "item 2" }, { text: "item 3" }],
                paginate: true,
                pageSize: 2,
                load: dataSourceLoaded
            })
        });

        assert.equal(dataSourceLoaded.callCount, 1, "dataSource was loaded once");
    });
});
