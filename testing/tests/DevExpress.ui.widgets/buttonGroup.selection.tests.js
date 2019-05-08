import $ from "jquery";
import "ui/button";
import "ui/button_group";
import eventsEngine from "events/core/events_engine";
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

QUnit.module("Selection", () => {
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
                onSelectionChanged: this.handler
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
            if(this.handler.firstCall && this.handler.lastCall.args[0]) {
                QUnit.assert.deepEqual(this.handler.lastCall.args[0].addedItems, options.selectionChanged.addedItems, "addedItems");
                QUnit.assert.deepEqual(this.handler.lastCall.args[0].removedItems, options.selectionChanged.removedItems, "removedItems");
            }
        }

        checkSelectedItems(indexes) {
            this.buttonGroup.$element().find(`.${BUTTON_GROUP_ITEM_CLASS}`).each((index)=> {
                const isItemSelected = indexes.indexOf(index) !== -1;
                QUnit.assert.equal(this._getButtonGroupItem(index).hasClass(DX_ITEM_SELECTED_CLASS), isItemSelected, `item ${index} is ${isItemSelected ? "" : "not" } selected`);
            });
        }
    }

    ["single", "multiple"].forEach((selectionMode) => {
        let config = ` ,selectionMode=${selectionMode}`;
        [true, false].forEach((onInitialOption) => {
            ["selectedItems", "selectedItemKeys"].forEach((selectedOption) => {
                config = ` ,onInitial=${onInitialOption}, selectionMode=${selectionMode}`;

                QUnit.module("Set items: null/undefined/[]", () => {
                    [null, undefined, []].forEach((selectedOptionValue) => {
                        QUnit.test(`${selectedOption}: ${selectedOptionValue}` + config, () => {
                            let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                            if(selectedOption === "selectedItems") {
                                helper.createButtonGroup({ items: [], selectedItems: selectedOptionValue });
                            } else {
                                helper.createButtonGroup({ items: [], selectedItemKeys: selectedOptionValue });
                            }

                            helper.checkAsserts({
                                selectionChanged: { count: 0, addedItems: [], removedItems: [] },
                                selectedItems: [],
                                selectedItemKeys: []
                            });
                            helper.checkSelectedItems([]);
                        });
                    });

                    QUnit.test(`${selectedOption}: ['btn1']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: [], selectedItems: [{ "text": "btn1" }] });
                        } else {
                            helper.createButtonGroup({ items: [], selectedItemKeys: [ "btn1" ] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: 0, addedItems: [], removedItems: [] },
                            selectedItems: [{ "text": "btn1" }],
                            selectedItemKeys: ["btn1"]
                        });
                    });

                    QUnit.test(`${selectedOption}: ['btn2']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: [], selectedItems: [{ "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: [], selectedItemKeys: [ "btn2" ] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: 0, addedItems: [], removedItems: [] },
                            selectedItems: [{ "id": "btn2", "text": "btn2" }],
                            selectedItemKeys: ["btn2"]
                        });
                    });

                    QUnit.test(`${selectedOption}: ['btn1', 'btn2']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: [], selectedItems: [{ "text": "btn1" }, { "text": "btn2" }] });
                        } else {
                            helper.createButtonGroup({ items: [], selectedItemKeys: [ "btn1", "btn2" ] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: 0, addedItems: [], removedItems: [] },
                            selectedItems: [{ text: "btn1" }],
                            selectedItemKeys: ["btn1"]
                        });
                    });
                });

                QUnit.module("Set items: [{ text: 'btn1', id: 0 }, { text: 'btn2', id: 1 }], ", () => {
                    const items = [{ text: 'btn1', id: 0 }, { text: 'btn2', id: 1 }];

                    QUnit.test(`${selectedOption}: []` + config, () => {
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

                    QUnit.test(`${selectedOption}: ['btn1']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[0]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [items[0]], removedItems: [] },
                            selectedItems: [items[0]],
                            selectedItemKeys: [items[0].text] });
                        helper.checkSelectedItems([items[0].id]);
                    });

                    QUnit.test(`${selectedOption}: ['btn2']` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ items[1].text ] });
                        }

                        helper.checkAsserts({
                            selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [items[1]], removedItems: [] },
                            selectedItems: [items[1]],
                            selectedItemKeys: [ items[1].text] });
                        helper.checkSelectedItems([1]);
                    });

                    QUnit.test(`${selectedOption}: ['btn1', 'btn2']` + config, (assert) => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[0], items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text, items[1].text ] });
                        }

                        if(selectionMode === "single") {
                            assert.ok("skip");
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [ items[0], items[1]], removedItems: [] },
                                selectedItems: [ items[0], items[1]],
                                selectedItemKeys: [ items[0].text, items[1].text] });
                            helper.checkSelectedItems([0, 1]);
                        }
                    });

                    QUnit.test(`${selectedOption}: [], click(btn1)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                        }

                        helper.triggerButtonClick(0);

                        helper.checkAsserts({
                            selectionChanged: { count: 1, addedItems: [ items[0]], removedItems: [] },
                            selectedItems: [ items[0]],
                            selectedItemKeys: [ items[0].text]
                        });
                        helper.checkSelectedItems([0]);
                    });

                    QUnit.test(`${selectedOption}: [], click(btn2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                        }

                        helper.triggerButtonClick(1);

                        helper.checkAsserts({
                            selectionChanged: { count: onInitialOption ? 1 : 1, addedItems: [items[1]], removedItems: [] },
                            selectedItems: [items[1]],
                            selectedItemKeys: [ items[1].text]
                        });
                        helper.checkSelectedItems([1]);
                    });

                    QUnit.test(`${selectedOption}: [], click(btn1, btn2)` + config, () => {
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
                                selectionChanged: { count: 2, addedItems: [items[1]], removedItems: [ items[0]] },
                                selectedItems: [items[1]],
                                selectedItemKeys: [ items[1].text]
                            });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: 2, addedItems: [items[1]], removedItems: [] },
                                selectedItems: [ items[0], items[1]],
                                selectedItemKeys: [ items[0].text, items[1].text]
                            });
                            helper.checkSelectedItems([0, 1]);
                        }
                    });

                    QUnit.test(`${selectedOption}: [{ "text": "btn2" }], click(btn1)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [items[1].text ] });
                        }

                        helper.triggerButtonClick(0);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [items[0]], removedItems: [items[1]] },
                                selectedItems: [items[0]],
                                selectedItemKeys: [items[0].text]
                            });
                            helper.checkSelectedItems([items[0].id]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [items[0]], removedItems: [] },
                                selectedItems: [items[0], items[1]],
                                selectedItemKeys: [items[0].text, items[1].text]
                            });
                            helper.checkSelectedItems([items[0].id, items[1].id]);
                        }
                    });

                    QUnit.test(`${selectedOption}: [{ "text": "btn2" }], click(btn2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [items[1].text ] });
                        }

                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 0 : 1, addedItems: [items[1]], removedItems: [] },
                                selectedItems: [items[1]],
                                selectedItemKeys: [ items[1].text]
                            });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [], removedItems: [items[1]] },
                                selectedItems: [],
                                selectedItemKeys: []
                            });
                            helper.checkSelectedItems([]);
                        }
                    });

                    QUnit.test(`${selectedOption}: [{ "text": "btn2" }], click(btn1, btn2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ items[1].text ] });
                        }

                        helper.triggerButtonClick(0);
                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 2 : 3, addedItems: [items[1]], removedItems: [ items[0]] },
                                selectedItems: [items[1]],
                                selectedItemKeys: [items[1].text]
                            });
                            helper.checkSelectedItems([items[1].id]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 2 : 3, addedItems: [], removedItems: [items[1]] },
                                selectedItems: [items[0]],
                                selectedItemKeys: [items[0].text]
                            });
                            helper.checkSelectedItems([items[0].id]);
                        }
                    });

                    QUnit.test(`${selectedOption}: ['btn1', 'btn2'], click(btn1)` + config, (assert) => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [ items[0], items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [ items[0].text, items[1].text ] });
                        }

                        helper.triggerButtonClick(0);

                        if(selectionMode === "single") {
                            assert.ok("skip");
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [], removedItems: [ items[0]] },
                                selectedItems: [items[1]],
                                selectedItemKeys: [items[1].text] });
                            helper.checkSelectedItems([items[1].id]);
                        }
                    });

                    QUnit.test(`${selectedOption}: ['btn1', 'btn2'], click(bnt2)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[0], items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text, items[1].text] });
                        }

                        helper.triggerButtonClick(items[1].id);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : selectedOption === "selectedItemKeys" ? 3 : 2, addedItems: [items[1]], removedItems: [items[0]] },
                                selectedItems: [items[1]],
                                selectedItemKeys: [items[1].text] });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : 2, addedItems: [], removedItems: [items[1]] },
                                selectedItems: [items[0]],
                                selectedItemKeys: [items[0].text] });
                            helper.checkSelectedItems([items[0].id]);
                        }
                    });

                    QUnit.test(`${selectedOption}: ['btn1', 'btn2'], click(bnt2, btn1)` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === "selectedItems") {
                            helper.createButtonGroup({ items: items, selectedItems: [items[0], items[1]] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text, items[1].text] });
                        }

                        helper.triggerButtonClick(0);
                        helper.triggerButtonClick(1);

                        if(selectionMode === "single") {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 1 : selectedOption === "selectedItemKeys" ? 3 : 2, addedItems: [items[1]], removedItems: [items[0]] },
                                selectedItems: [items[1]],
                                selectedItemKeys: [items[1].text] });
                            helper.checkSelectedItems([1]);
                        } else {
                            helper.checkAsserts({
                                selectionChanged: { count: onInitialOption ? 2 : 3, addedItems: [], removedItems: [items[1]] },
                                selectedItems: [],
                                selectedItemKeys: [] });
                            helper.checkSelectedItems([]);
                        }
                    });
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
