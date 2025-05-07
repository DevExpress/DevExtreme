import $ from 'jquery';
import TreeView from 'ui/tree_view';

import 'generic_light.css!';

const { testStart } = QUnit;

testStart(function() {
    const markup = '<div id="treeView"></div>';

    $('#qunit-fixture').html(markup);
});

const asyncTemplateRenderTimeout = 50;

const CHECKBOX_CLASS = 'dx-checkbox';
const CHECKBOX_CHECKED_CLASS = 'dx-checkbox-checked';
const CHECKBOX_INDETERMINATE_CLASS = 'dx-checkbox-indeterminate';
const TREEVIEW_ROOT_NODE_CLASS = 'dx-treeview-root-node';

QUnit.module('Async render', () => {
    ['normal', 'selectAll'].forEach((showCheckBoxesMode) => {
        QUnit.test(`TreeView checkboxed should be correctly rendered in async mode. checkboxMode: ${showCheckBoxesMode} (T1269855)`, function(assert) {
            const done = assert.async();

            const data = [
                {
                    id: 1,
                    text: 'Item 1',
                    expanded: true,
                    selected: true,
                    items: [
                        {
                            id: 12, text: 'Nested Item 2', expanded: true, items: [
                                { id: 121, text: 'Third level item 1' },
                                { id: 122, text: 'Third level item 2' }
                            ]
                        }
                    ]
                },
                {
                    id: 2,
                    text: 'Item 2',
                    expanded: true,
                    items: [
                        {
                            id: 22, text: 'Nested Item 2', expanded: true, items: [
                                { id: 221, text: 'Third level item 1' },
                                { id: 222, text: 'Third level item 2', selected: true }
                            ]
                        }
                    ]
                },
                {
                    id: 3,
                    text: 'Item 3',
                    expanded: true,
                    items: [
                        {
                            id: 33, text: 'Nested Item 3', expanded: true, items: [
                                { id: 331, text: 'Third level item 1' },
                                { id: 332, text: 'Third level item 2' }
                            ]
                        }
                    ]
                }
            ];

            const instance = new TreeView($('#treeView'), {
                items: data,
                showCheckBoxesMode,
                templatesRenderAsynchronously: true,
                itemTemplate: 'myTemplate',
                integrationOptions: {
                    templates: {
                        myTemplate: {
                            render({ model, container, onRendered }) {
                                setTimeout(() => {
                                    const $item = $(`<div>${model.text}</div>`);
                                    $item.appendTo(container);

                                    onRendered();
                                });
                            }
                        }
                    }
                },
            });

            setTimeout(() => {
                const element = instance.itemsContainer();
                const $treeRootNodes = $(element).find(`.${TREEVIEW_ROOT_NODE_CLASS}`);

                const $firstRootNode = $treeRootNodes.eq(0);
                const $firstGroupCheckboxes = $firstRootNode.find(`.${CHECKBOX_CLASS}`);

                assert.ok($firstGroupCheckboxes.eq(0).hasClass(CHECKBOX_CHECKED_CLASS), 'First group root checkbox has selected class');
                assert.ok($firstGroupCheckboxes.eq(1).hasClass(CHECKBOX_CHECKED_CLASS), 'First group nested node checkbox has selected class');
                assert.ok($firstGroupCheckboxes.eq(2).hasClass(CHECKBOX_CHECKED_CLASS), 'First group leaf node 1 checkbox has selected class');
                assert.ok($firstGroupCheckboxes.eq(3).hasClass(CHECKBOX_CHECKED_CLASS), 'First group leaf node 2 checkbox has selected class');

                const $secondRootNode = $treeRootNodes.eq(1);
                const $secondGroupCheckboxes = $secondRootNode.find(`.${CHECKBOX_CLASS}`);

                assert.ok($secondGroupCheckboxes.eq(0).hasClass(CHECKBOX_INDETERMINATE_CLASS), 'Second group root checkbox has indeterminate class');
                assert.ok($secondGroupCheckboxes.eq(1).hasClass(CHECKBOX_INDETERMINATE_CLASS), 'Second group nested node checkbox has indeterminate class');
                assert.notOk($secondGroupCheckboxes.eq(2).hasClass(CHECKBOX_CHECKED_CLASS), 'Second group leaf node 1 checkbox has not selected class');
                assert.ok($secondGroupCheckboxes.eq(3).hasClass(CHECKBOX_CHECKED_CLASS), 'Second group leaf node 2 checkbox has selected class');

                const $thirdRootNode = $treeRootNodes.eq(2);
                const $thirdGroupCheckboxes = $thirdRootNode.find(`.${CHECKBOX_CLASS}`);

                assert.notOk($thirdGroupCheckboxes.eq(0).hasClass(CHECKBOX_CHECKED_CLASS), 'Third group root checkbox has not selected class');
                assert.notOk($thirdGroupCheckboxes.eq(1).hasClass(CHECKBOX_CHECKED_CLASS), 'Third group nested node checkbox has not selected class');
                assert.notOk($thirdGroupCheckboxes.eq(2).hasClass(CHECKBOX_CHECKED_CLASS), 'Third group leaf node 1 checkbox has not selected class');
                assert.notOk($thirdGroupCheckboxes.eq(3).hasClass(CHECKBOX_CHECKED_CLASS), 'Third group leaf node 2 checkbox has not selected class');

                done();
            }, asyncTemplateRenderTimeout);
        });
    });
});
