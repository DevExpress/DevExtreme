import $ from 'jquery';
import 'ui/button';
import 'ui/button_group';
import eventsEngine from 'events/core/events_engine';
import 'common.css!';

const BUTTON_GROUP_CLASS = 'dx-buttongroup',
    BUTTON_GROUP_ITEM_CLASS = BUTTON_GROUP_CLASS + '-item',
    DX_ITEM_SELECTED_CLASS = 'dx-item-selected';

const items = [{ text: 'btn1', id: 0 }, { text: 'btn2', id: 1 }];

QUnit.testStart(() => {
    const markup = `
        <div id="widget"></div>
    `;
    $('#qunit-fixture').html(markup);
});

QUnit.module(`Selection for items: ${JSON.stringify(items)}, `, () => {
    class ButtonGroupSelectionTestHelper {
        constructor(onInitialOption, selectionMode) {
            this.selectionChangedHandler = sinon.spy();
            this.onInitialOption = onInitialOption;
            this.selectionMode = selectionMode;
        }

        createButtonGroup(options) {
            this.items = options.items;

            let config = {
                selectionMode: this.selectionMode,
                onSelectionChanged: this.selectionChangedHandler
            };

            if(this.onInitialOption) {
                this.buttonGroup = $('#widget').dxButtonGroup($.extend(config, options)).dxButtonGroup('instance');
            } else {
                this.buttonGroup = $('#widget').dxButtonGroup({}).dxButtonGroup('instance');
                this.buttonGroup.option('onSelectionChanged', config.onSelectionChanged);
                this.buttonGroup.option('selectionMode', config.selectionMode);
                this.buttonGroup.option('items', options.items);
                if(options.keyExpr) this.buttonGroup.option('keyExpr', options.keyExpr);
                if(options.selectedItemKeys) this.buttonGroup.option('selectedItemKeys', options.selectedItemKeys);
                if(options.selectedItems) this.buttonGroup.option('selectedItems', options.selectedItems);
            }
        }

        resetSelectedChangedSpy() {
            this.selectionChangedHandler.reset();
        }

        _getButtonGroupItem(index) {
            return this.buttonGroup.$element().find(`.${BUTTON_GROUP_ITEM_CLASS}`).eq(index);
        }

        triggerButtonClick(itemIndex) {
            eventsEngine.trigger(this._getButtonGroupItem(itemIndex), 'dxclick');
        }

        checkAsserts(options) {
            if(options.selectedItems) {
                QUnit.assert.deepEqual(this.buttonGroup.option('selectedItems'), options.selectedItems, 'selectedItems');
            }

            if(options.selectedItemKeys) {
                QUnit.assert.deepEqual(this.buttonGroup.option('selectedItemKeys'), options.selectedItemKeys, 'selectedItemKeys');
            }

            if(!options.selectionChanged) {
                QUnit.assert.strictEqual(this.selectionChangedHandler.callCount, 0, 'handler.callCount');
            } else {
                QUnit.assert.strictEqual(this.selectionChangedHandler.callCount, 1, 'handler.callCount');
                QUnit.assert.deepEqual(this.selectionChangedHandler.firstCall.args[0].addedItems, options.selectionChanged.addedItems, 'addedItems');
                QUnit.assert.deepEqual(this.selectionChangedHandler.firstCall.args[0].removedItems, options.selectionChanged.removedItems, 'removedItems');
            }
        }

        checkSelectedItems(selectedIndexes) {
            let $buttons = this.buttonGroup.$element().find(`.${BUTTON_GROUP_ITEM_CLASS}`);

            selectedIndexes.forEach((index) => {
                QUnit.assert.equal($buttons.eq(index).hasClass(DX_ITEM_SELECTED_CLASS), true, `item ${index} is selected`);
            });

            $buttons.each((index) => {
                if(selectedIndexes.indexOf(index) === -1) {
                    QUnit.assert.equal($buttons.eq(index).hasClass(DX_ITEM_SELECTED_CLASS), false, `item ${index} is not selected`);
                }
            });
        }
    }

    ['single', 'multiple'].forEach((selectionMode) => {
        let config = ` ,selectionMode=${selectionMode}`;
        [true, false].forEach((onInitialOption) => {
            ['selectedItems', 'selectedItemKeys'].forEach((selectedOption) => {
                config = `, onInitial=${onInitialOption}, selectionMode=${selectionMode}`;

                [null, undefined, []].forEach((selectedOptionValue) => {
                    QUnit.test(`${selectedOption}: ${selectedOptionValue}` + config, () => {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                        if(selectedOption === 'selectedItems') {
                            helper.createButtonGroup({ items: items, selectedItems: selectedOptionValue });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: selectedOptionValue });
                        }

                        helper.checkAsserts({
                            selectedItems: [],
                            selectedItemKeys: selectedOptionValue !== null ? [] : selectedOptionValue
                        });
                        helper.checkSelectedItems([]);
                    });
                });

                QUnit.test(`${selectedOption}: ['notExist']` + config, () => {
                    try {
                        let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);
                        if(selectedOption === 'selectedItems') {
                            helper.createButtonGroup({ items: items, selectedItems: ['notExist'] });
                        } else {
                            helper.createButtonGroup({ items: items, selectedItemKeys: ['notExist'] });
                        }
                        QUnit.assert.ok(true, 'exception is not thrown');
                    } catch(e) {
                        QUnit.assert.ok(false, 'exception is thrown');
                    }
                });

                QUnit.test(`${selectedOption}: ['btn1']` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[0]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text] });
                    }

                    helper.checkAsserts({
                        selectionChanged: onInitialOption ? null : { addedItems: [items[0]], removedItems: [] },
                        selectedItems: [items[0]],
                        selectedItemKeys: [items[0].text]
                    });

                    helper.checkSelectedItems([items[0].id]);
                });

                QUnit.test(`${selectedOption}: ['btn2']` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[1].text] });
                    }

                    helper.checkAsserts({
                        selectionChanged: onInitialOption ? null : { addedItems: [items[1]], removedItems: [] },
                        selectedItems: [items[1]],
                        selectedItemKeys: [items[1].text]
                    });

                    helper.checkSelectedItems([items[1].id]);
                });

                QUnit.test(`${selectedOption}: ['btn1', 'btn2']` + config, (assert) => {
                    if(selectionMode === 'single') {
                        assert.ok('skip');
                        return;
                    }

                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[0], items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text, items[1].text] });
                    }

                    helper.checkAsserts({
                        selectionChanged: onInitialOption ? null : { addedItems: [items[0], items[1]], removedItems: [] },
                        selectedItems: [items[0], items[1]],
                        selectedItemKeys: [items[0].text, items[1].text]
                    });

                    helper.checkSelectedItems([items[0].id, items[1].id]);
                });

                QUnit.test(`${selectedOption}: [], click(btn1)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                    }

                    helper.triggerButtonClick(items[0].id);

                    helper.checkAsserts({
                        selectionChanged: { addedItems: [items[0]], removedItems: [] },
                        selectedItems: [items[0]],
                        selectedItemKeys: [items[0].text]
                    });
                    helper.checkSelectedItems([items[0].id]);
                });

                QUnit.test(`${selectedOption}: [], click(btn2)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                    }

                    helper.triggerButtonClick(items[1].id);

                    helper.checkAsserts({
                        selectionChanged: { addedItems: [items[1]], removedItems: [] },
                        selectedItems: [items[1]],
                        selectedItemKeys: [items[1].text]
                    });
                    helper.checkSelectedItems([items[1].id]);
                });

                QUnit.test(`${selectedOption}: [], click(btn1, btn2)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                    }

                    helper.triggerButtonClick(items[0].id);
                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[1].id);

                    if(selectionMode === 'single') {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [items[1]], removedItems: [items[0]] },
                            selectedItems: [items[1]],
                            selectedItemKeys: [items[1].text]
                        });
                        helper.checkSelectedItems([items[1].id]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [items[1]], removedItems: [] },
                            selectedItems: [items[0], items[1]],
                            selectedItemKeys: [items[0].text, items[1].text]
                        });
                        helper.checkSelectedItems([items[0].id, items[1].id]);
                    }
                });

                QUnit.test(`${selectedOption}: [], click(btn1, btn1)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [] });
                    }

                    helper.triggerButtonClick(items[0].id);
                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[0].id);

                    if(selectionMode === 'single') {
                        helper.checkAsserts({
                            selectedItems: [items[0]],
                            selectedItemKeys: [items[0].text]
                        });
                        helper.checkSelectedItems([items[0].id]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [], removedItems: [items[0]] },
                            selectedItems: [],
                            selectedItemKeys: []
                        });
                        helper.checkSelectedItems([]);
                    }
                });

                QUnit.test(`${selectedOption}: [{ "text": "btn2" }], click(btn1)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[1].text] });
                    }
                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[0].id);

                    if(selectionMode === 'single') {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [items[0]], removedItems: [items[1]] },
                            selectedItems: [items[0]],
                            selectedItemKeys: [items[0].text]
                        });
                        helper.checkSelectedItems([items[0].id]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [items[0]], removedItems: [] },
                            selectedItems: [items[0], items[1]],
                            selectedItemKeys: [items[0].text, items[1].text]
                        });
                        helper.checkSelectedItems([items[0].id, items[1].id]);
                    }
                });

                QUnit.test(`${selectedOption}: [{ "text": "btn2" }], click(btn2)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[1].text] });
                    }

                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[1].id);

                    if(selectionMode === 'single') {
                        helper.checkAsserts({
                            selectedItems: [items[1]],
                            selectedItemKeys: [items[1].text]
                        });
                        helper.checkSelectedItems([items[1].id]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [], removedItems: [items[1]] },
                            selectedItems: [],
                            selectedItemKeys: []
                        });
                        helper.checkSelectedItems([]);
                    }
                });

                QUnit.test(`${selectedOption}: [{ "text": "btn2" }], click(btn1, btn2)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[1].text] });
                    }

                    helper.triggerButtonClick(items[0].id);
                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[1].id);

                    if(selectionMode === 'single') {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [items[1]], removedItems: [items[0]] },
                            selectedItems: [items[1]],
                            selectedItemKeys: [items[1].text]
                        });
                        helper.checkSelectedItems([items[1].id]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [], removedItems: [items[1]] },
                            selectedItems: [items[0]],
                            selectedItemKeys: [items[0].text]
                        });
                        helper.checkSelectedItems([items[0].id]);
                    }
                });

                QUnit.test(`${selectedOption}: ['btn1', 'btn2'], click(btn1)` + config, (assert) => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[0], items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text, items[1].text] });
                    }

                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[0].id);

                    if(selectionMode === 'single') {
                        assert.ok('skip');
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [], removedItems: [items[0]] },
                            selectedItems: [items[1]],
                            selectedItemKeys: [items[1].text] });
                        helper.checkSelectedItems([items[1].id]);
                    }
                });

                QUnit.test(`${selectedOption}: ['btn1', 'btn2'], click(bnt2)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[0], items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text, items[1].text] });
                    }
                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[1].id);

                    if(selectionMode === 'single') {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [items[1]], removedItems: [items[0]] },
                            selectedItems: [items[1]],
                            selectedItemKeys: [items[1].text] });
                        helper.checkSelectedItems([items[1].id]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [], removedItems: [items[1]] },
                            selectedItems: [items[0]],
                            selectedItemKeys: [items[0].text] });
                        helper.checkSelectedItems([items[0].id]);
                    }
                });

                QUnit.test(`${selectedOption}: ['btn1', 'btn2'], click(bnt2, btn1)` + config, () => {
                    let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);

                    if(selectedOption === 'selectedItems') {
                        helper.createButtonGroup({ items: items, selectedItems: [items[0], items[1]] });
                    } else {
                        helper.createButtonGroup({ items: items, selectedItemKeys: [items[0].text, items[1].text] });
                    }

                    helper.triggerButtonClick(items[0].id);
                    helper.resetSelectedChangedSpy();
                    helper.triggerButtonClick(items[1].id);

                    if(selectionMode === 'single') {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [items[1]], removedItems: [items[0]] },
                            selectedItems: [items[1]],
                            selectedItemKeys: [items[1].text] });
                        helper.checkSelectedItems([items[1].id]);
                    } else {
                        helper.checkAsserts({
                            selectionChanged: { addedItems: [], removedItems: [items[1]] },
                            selectedItems: [],
                            selectedItemKeys: [] });
                        helper.checkSelectedItems([]);
                    }
                });
            });

            QUnit.test('KeyExpr: custom, set items: [], selectedItems[], click(btn1) -> click(btn3)' + config, () => {
                let helper = new ButtonGroupSelectionTestHelper(onInitialOption, selectionMode);
                helper.createButtonGroup({
                    items: [
                        { icon: 'leftIcon', custom: 'left' },
                        { icon: 'centerIcon', custom: 'center' },
                        { icon: 'rightIcon', custom: 'right' }
                    ],
                    keyExpr: 'custom'
                });

                helper.triggerButtonClick(0);

                helper.checkAsserts({
                    selectionChanged: { addedItems: [{ icon: 'leftIcon', custom: 'left' }], removedItems: [] },
                    selectedItems: [{ icon: 'leftIcon', custom: 'left' }],
                    selectedItemKeys: ['left']
                });
                helper.checkSelectedItems([0]);
                helper.resetSelectedChangedSpy();
                helper.triggerButtonClick(2);

                if(selectionMode === 'single') {
                    helper.checkAsserts({
                        selectionChanged: { addedItems: [{ icon: 'rightIcon', custom: 'right' }], removedItems: [{ icon: 'leftIcon', custom: 'left' }] },
                        selectedItems: [{ icon: 'rightIcon', custom: 'right' }],
                        selectedItemKeys: ['right']
                    });
                    helper.checkSelectedItems([2]);
                } else {
                    helper.checkAsserts({
                        selectionChanged: { addedItems: [{ icon: 'rightIcon', custom: 'right' }], removedItems: [] },
                        selectedItems: [{ icon: 'leftIcon', custom: 'left' }, { icon: 'rightIcon', custom: 'right' }],
                        selectedItemKeys: ['left', 'right']
                    });
                    helper.checkSelectedItems([0, 2]);
                }
            });
        });
    });
});

