import $ from "jquery";
import "ui/button";
import "ui/button_group";
import eventsEngine from "events/core/events_engine";
import typeUtils from "core/utils/type";
import "common.css!";

const BUTTON_GROUP_CLASS = "dx-buttongroup",
    BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + "-item",
    DX_ITEM_SELECTED_CLASS = "dx-item-selected";

QUnit.testStart(() => {
    const markup = `
        <div id="widget"></div>
    `;
    $("#qunit-fixture").html(markup);
});

QUnit.module("Single/Multiple mode", () => {
    class ButtonGroupSelectionTestHelper {
        constructor(onInitialOption, selectionMode) {
            this.handler = sinon.spy();
            this.onInitialOption = onInitialOption;
            this.selectionMode = selectionMode;
        }

        createButtonGroup(options) {
            this.items = options.items;

            let config = {
                selectionMode: this.selectionMode,
                onSelectionChanged: (e) => {
                    this.selectedItems = {
                        addedItems: e.addedItems,
                        removedItems: e.removedItems
                    };
                    this.handler();
                }
            };

            if(this.onInitialOption) {
                this.buttonGroup = $("#widget").dxButtonGroup($.extend(config, options)).dxButtonGroup("instance");
            } else {
                this.buttonGroup = $("#widget").dxButtonGroup({}).dxButtonGroup("instance");
                this.buttonGroup.option("onSelectionChanged", config.onSelectionChanged);
                this.buttonGroup.option("selectionMode", config.selectionMode);
                this.buttonGroup.option("items", options.items);
                if(options.keyExpr) this.buttonGroup.option("keyExpr", options.keyExpr);
                if(options.selectedItemKeys) this.buttonGroup.option("selectedItemKeys", options.selectedItemKeys);
                if(options.selectedItems) this.buttonGroup.option("selectedItems", options.selectedItems);
            }
        }

        _getButtonGroupItem(index) {
            return this.buttonGroup.$element().find(`.${BUTTON_GROUP_ITEM_CLASS}`).eq(index);
        }

        triggerButtonClick(itemIndex) {
            eventsEngine.trigger(this._getButtonGroupItem(itemIndex), "dxclick");
        }

        checkAsserts(options) {
            if(this.items.length) {
                QUnit.assert.strictEqual(this.handler.callCount, options.selectionChanged.count, "handler.callCount");
                QUnit.assert.deepEqual(this.buttonGroup.option("selectedItems"), options.selectedItems, "selectedItems");
                QUnit.assert.deepEqual(this.buttonGroup.option("selectedItemKeys"), options.selectedItemKeys, "selectedItemKeys");
            } else {
                QUnit.assert.strictEqual(this.handler.callCount, 0, "handler.callCount");
            }

            if(typeUtils.isDefined(this.selectedItems)) {
                QUnit.assert.deepEqual(this.selectedItems.addedItems || [], options.selectionChanged.addedItems, "addedItems");
                QUnit.assert.deepEqual(this.selectedItems.removedItems || [], options.selectionChanged.removedItems, "removedItems");
            }
        }

        checkSelectedItems(indexes) {
            this.buttonGroup.$element().find(`.${BUTTON_GROUP_ITEM_CLASS}`).each((index)=> {
                const isItemSelected = indexes.indexOf(index) !== -1;

                QUnit.assert.equal(this._getButtonGroupItem(index).hasClass(DX_ITEM_SELECTED_CLASS), isItemSelected, `item ${index} is ${isItemSelected ? "" : "not" } selected`);
            });
        }
    }
    [[], [{ text: "btn1" }, { text: "btn2" }]].forEach((items) => {
        ["single", "multiple"].forEach((selectionMode) => {
            let config = ` ,selectionMode=${selectionMode}`;

            [true, false].forEach((onInitialOption) => {
                ["selectedItems", "selectedItemKeys"].forEach((selectedOption) => {
                    config = ` ,onInitial=${onInitialOption}, selectionMode=${selectionMode}`;

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: []` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: 0, addedItems: [], removedItems: [] },
                            selectedItems: [],
                            selectedItemKeys: []
                        });
                        helper.checkSelectedItems([]);
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: ['btn1']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn1" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn1" ] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [{ "text": "btn1" }], removedItems: [] },
                            selectedItems: [{ "text": "btn1" }],
                            selectedItemKeys: ["btn1"] });
                        helper.checkSelectedItems([0]);
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: ['btn2']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn2" ] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [{ "text": "btn2" }], removedItems: [] },
                            selectedItems: [{ "text": "btn2" }],
                            selectedItemKeys: ["btn2"] });
                        helper.checkSelectedItems([1]);
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: ['btn1', 'btn2']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn1" }, { "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn1", "btn2" ] });
                        }

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [{ "text": "btn1" }], removedItems: [] },
                                selectedItems: [{ "text": "btn1" }],
                                selectedItemKeys: ["btn1"] });
                            helper.checkSelectedItems([0]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [{ "text": "btn1" }, { "text": "btn2" }], removedItems: [] },
                                selectedItems: [{ "text": "btn1" }, { "text": "btn2" }],
                                selectedItemKeys: ["btn1", "btn2"] });
                            helper.checkSelectedItems([0, 1]);
                        }
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: [], click(btn1)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                        }

                        helper.triggerButtonClick(0);

                        helper.checkAsserts({
                            selectionChanged: { count: 1, addedItems: [{ "text": "btn1" }], removedItems: [] },
                            selectedItems: [{ "text": "btn1" }],
                            selectedItemKeys: ["btn1"]
                        });
                        helper.checkSelectedItems([0]);
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: [], click(btn2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                        }

                        helper.triggerButtonClick(1);

                        helper.checkAsserts({
                            selectionChanged: { count: onInitialOption ? 1 : 1, addedItems: [{ "text": "btn2" }], removedItems: [] },
                            selectedItems: [{ "text": "btn2" }],
                            selectedItemKeys: ["btn2"]
                        });
                        helper.checkSelectedItems([1]);
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: [], click(btn1, btn2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                        }

                        helper.triggerButtonClick(0);
                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: 2, addedItems: [{ "text": "btn2" }], removedItems: [{ "text": "btn1" }] },
                                selectedItems: [{ "text": "btn2" }],
                                selectedItemKeys: ["btn2"]
                            });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: 2, addedItems: [{ "text": "btn2" }], removedItems: [] },
                                selectedItems: [{ "text": "btn1" }, { "text": "btn2" }],
                                selectedItemKeys: ["btn1", "btn2"]
                            });
                            helper.checkSelectedItems([0, 1]);
                        }
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: [{ "text": "btn2" }], click(btn1)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn2" ] });
                        }

                        helper.triggerButtonClick(0);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [{ "text": "btn1" }], removedItems: [{ "text": "btn2" }] },
                                selectedItems: [{ "text": "btn1" }],
                                selectedItemKeys: ["btn1"]
                            });
                            helper.checkSelectedItems([0]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [{ "text": "btn1" }], removedItems: [] },
                                selectedItems: [{ "text": "btn1" }, { "text": "btn2" }],
                                selectedItemKeys: ["btn1", "btn2"]
                            });
                            helper.checkSelectedItems([0, 1]);
                        }
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: [{ "text": "btn2" }], click(btn2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn2" ] });
                        }

                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [{ "text": "btn2" }], removedItems: [] },
                                selectedItems: [{ "text": "btn2" }],
                                selectedItemKeys: ["btn2"]
                            });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [], removedItems: [{ "text": "btn2" }] },
                                selectedItems: [],
                                selectedItemKeys: []
                            });
                            helper.checkSelectedItems([]);
                        }
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: [{ "text": "btn2" }], click(btn1, btn2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn2" ] });
                        }

                        helper.triggerButtonClick(0);
                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 2 : 3, addedItems: [{ "text": "btn2" }], removedItems: [{ "text": "btn1" }] },
                                selectedItems: [{ "text": "btn2" }],
                                selectedItemKeys: ["btn2"]
                            });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 2 : 3, addedItems: [], removedItems: [{ "text": "btn2" }] },
                                selectedItems: [{ "text": "btn1" }],
                                selectedItemKeys: ["btn1"]
                            });
                            helper.checkSelectedItems([0]);
                        }
                    });


                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: ['btn1', 'btn2'], click(bnt1)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn1" }, { "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn1", "btn2" ] });
                        }

                        helper.triggerButtonClick(0);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [{ "text": "btn1" }], removedItems: [] },
                                selectedItems: [{ "text": "btn1" }],
                                selectedItemKeys: ["btn1"] });
                            helper.checkSelectedItems([0]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [], removedItems: [{ "text": "btn1" }] },
                                selectedItems: [{ "text": "btn2" }],
                                selectedItemKeys: ["btn2"] });
                            helper.checkSelectedItems([1]);
                        }
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: ['btn1', 'btn2'], click(bnt2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn1" }, { "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn1", "btn2" ] });
                        }

                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [{ "text": "btn2" }], removedItems: [{ "text": "btn1" }] },
                                selectedItems: [ { "text": "btn2" }],
                                selectedItemKeys: [ "btn2" ] });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [], removedItems: [{ "text": "btn2" }] },
                                selectedItems: [{ "text": "btn1" }],
                                selectedItemKeys: ["btn1"] });
                            helper.checkSelectedItems([0]);
                        }
                    });

                    QUnit.test(`Set items: ${JSON.stringify(items)}, ${selectedOption}: ['btn1', 'btn2'], click(bnt2, btn1)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [{ "text": "btn1" }, { "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ "btn1", "btn2" ] });
                        }

                        helper.triggerButtonClick(0);
                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [{ "text": "btn2" }], removedItems: [{ "text": "btn1" }] },
                                selectedItems: [ { "text": "btn2" }],
                                selectedItemKeys: [ "btn2" ] });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 2 : 3, addedItems: [], removedItems: [{ "text": "btn2" }] },
                                selectedItems: [],
                                selectedItemKeys: [] });
                            helper.checkSelectedItems([]);
                        }
                    });
                });

                QUnit.test("KeyExpr: Set items: [], selectedItems[], click(btn1) -> click(btn3)" + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);
                    helper.createButtonGroup({
                        items: [
                            { icon: "leftIcon", text: "left" },
                            { icon: "centerIcon", text: "center" },
                            { icon: "rightIcon", text: "right" }
                        ],
                    });

                    helper.triggerButtonClick(0);

                    helper.checkAsserts({
                        selectionChanged: { count: 1, addedItems: [{ icon: "leftIcon", text: "left" }], removedItems: [] },
                        selectedItems: [{ icon: "leftIcon", text: "left" }],
                        selectedItemKeys: ["left"]
                    });

                    helper.checkSelectedItems([0]);

                    helper.triggerButtonClick(2);

                    if(selectionMode === "single") {
                        helper.checkAsserts({
                            selectionChanged: { count: 2, addedItems: [{ icon: "rightIcon", text: "right" }], removedItems: [{ icon: "leftIcon", text: "left" }] },
                            selectedItems: [{ icon: "rightIcon", text: "right" }],
                            selectedItemKeys: ["right"]
                        });
                        helper.checkSelectedItems([2]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { count: 2, addedItems: [{ icon: "rightIcon", text: "right" }], removedItems: [] },
                            selectedItems: [{ icon: "leftIcon", text: "left" }, { icon: "rightIcon", text: "right" }],
                            selectedItemKeys: ["left", "right"]
                        });
                        helper.checkSelectedItems([0, 2]);
                    }
                });

                QUnit.test("KeyExpr: custom, set items: [], selectedItems[], click(btn1) -> click(btn3)" + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);
                    helper.createButtonGroup({
                        items: [
                            { icon: "leftIcon", custom: "left" },
                            { icon: "centerIcon", custom: "center" },
                            { icon: "rightIcon", custom: "right" }
                        ],
                        keyExpr: "custom"
                    });

                    helper.triggerButtonClick(0);

                    helper.checkAsserts({
                        selectionChanged: { count: 1, addedItems: [{ icon: "leftIcon", custom: "left" }], removedItems: [] },
                        selectedItems: [{ icon: "leftIcon", custom: "left" }],
                        selectedItemKeys: ["left"]
                    });

                    helper.checkSelectedItems([0]);

                    helper.triggerButtonClick(2);

                    if(selectionMode === "single") {
                        helper.checkAsserts({
                            selectionChanged: { count: 2, addedItems: [{ icon: "rightIcon", custom: "right" }], removedItems: [{ icon: "leftIcon", custom: "left" }] },
                            selectedItems: [{ icon: "rightIcon", custom: "right" }],
                            selectedItemKeys: ["right"]
                        });
                        helper.checkSelectedItems([2]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { count: 2, addedItems: [{ icon: "rightIcon", custom: "right" }], removedItems: [] },
                            selectedItems: [{ icon: "leftIcon", custom: "left" }, { icon: "rightIcon", custom: "right" }],
                            selectedItemKeys: ["left", "right"]
                        });
                        helper.checkSelectedItems([0, 2]);
                    }
                });
            });
        });
    });
});
