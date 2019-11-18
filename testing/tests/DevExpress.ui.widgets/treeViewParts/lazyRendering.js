/* global internals, initTree */
import keyboardMock from "../../../helpers/keyboardMock.js";

QUnit.module("Lazy rendering");

QUnit.test("Render treeView with special symbols in id", function(assert) {
    const sampleId = "!/#$%&'()*+,./:;<=>?@[\\]^`{|}~__";
    var $treeView = initTree({
            items: [{ id: sampleId, text: "Item 1" }]
        }),
        $item = $treeView.find("." + internals.NODE_CLASS),
        item = $treeView.dxTreeView("option", "items")[0];

    assert.ok($item.attr("data-item-id").length);
    assert.equal(sampleId, $treeView.dxTreeView('instance')._getNodeByElement($item).id);
    assert.equal(sampleId, item.id);
});

QUnit.test("Only root nodes should be rendered by default", function(assert) {
    var $treeView = initTree({
        items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }]
    });
    var items = $treeView.find("." + internals.ITEM_CLASS);

    assert.equal(items.length, 2);
});

['!/#$%&\'()"+./:;<=>?@[]^`{|}~\\,', '____2______.jpg', 'E:\\test\\[gsdfgfd]  |  \'[some__file]', '!@#$%^&*()_+'].forEach((testId) => {
    QUnit.test(`Nodes expanding should work with special charactes in id - ${testId}`, function(assert) {
        let $treeView = initTree({
                dataSource: [
                    { id: testId, text: "item1", selected: false, expanded: false },
                    { id: 'aaaa', parentId: testId, text: "item2", selected: false, expanded: false }
                ],
                dataStructure: "plain",
                height: 500
            }),
            treeView = $treeView.dxTreeView('instance');

        assert.equal($treeView.find('[aria-level="2"]').is(':visible'), false);

        const elem = $treeView.find('[aria-level="1"]');
        treeView.expandItem(elem);

        assert.equal($treeView.find('[aria-level="2"]').is(':visible'), true);
    });

    QUnit.test(`Nodes selection should work with special charactes in id - ${testId}`, function(assert) {
        let $treeView = initTree({
                dataSource: [
                    { id: testId, text: "item1", selected: false, expanded: true },
                    { id: 'aaaa', parentId: testId, text: "item2", selected: false, expanded: true }
                ],
                dataStructure: "plain",
                showCheckBoxesMode: "normal",
                height: 500
            }),
            treeView = $treeView.dxTreeView('instance');

        assert.equal($treeView.find('[aria-level="1"]').find('.dx-checkbox').hasClass('dx-checkbox-checked'), false);
        assert.equal($treeView.find('[aria-level="2"]').find('.dx-checkbox').hasClass('dx-checkbox-checked'), false);

        let elem = $treeView.find('[aria-level="1"]');
        treeView.selectItem(elem);

        assert.equal($treeView.find('[aria-level="1"]').find('.dx-checkbox').hasClass('dx-checkbox-checked'), true);
        assert.equal($treeView.find('[aria-level="2"]').find('.dx-checkbox').hasClass('dx-checkbox-checked'), true);
    });

    QUnit.test(`Search should work with special charactes in the nodes ids - ${testId}`, function(assert) {
        let $treeView = initTree({
            dataSource: [
                { id: testId, text: "item1", selected: false, expanded: false },
                { id: testId + '_child', parentId: testId, text: "item2", selected: false, expanded: false },
                { id: 'bbb', text: "item3", selected: false, expanded: false }
            ],
            dataStructure: "plain",
            searchEnabled: true,
            height: 500
        });
        assert.equal($treeView.find('[aria-label="item2"]').is(':visible'), false);

        const $input = $treeView.find('.dx-texteditor-input');
        const keyboard = keyboardMock($input);
        keyboard.type("2");

        assert.equal($treeView.find('[aria-label="item1"]').is(':visible'), true);
        assert.equal($treeView.find('[aria-label="item2"]').is(':visible'), true);
        assert.equal($treeView.find('[aria-label="item3"]').is(':visible'), false);
    });
});

QUnit.test("Nested item should be rendered after click on toggle visibility icon", function(assert) {
    var $treeView = initTree({
        items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }]
    });

    $treeView.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger("dxclick");

    var items = $treeView.find("." + internals.ITEM_CLASS);

    assert.equal(items.length, 3);
});

QUnit.test("Nested item should be rendered when expandItem method was called", function(assert) {
    var $treeView = initTree({
        items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }]
    });

    $treeView.dxTreeView("instance").expandItem($treeView.find("." + internals.ITEM_CLASS).eq(0).get(0));

    var items = $treeView.find("." + internals.ITEM_CLASS);

    assert.equal(items.length, 3);
});

QUnit.test("Selection should work correctly for nested items", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal"
        }),
        treeView = $treeView.dxTreeView("instance"),
        firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0).get(0);

    treeView.selectItem(firstItem);
    treeView.expandItem(firstItem);

    var items = $treeView.find(".dx-checkbox-checked");

    assert.equal(items.length, 2);
});

QUnit.test("Unselection should work correctly for nested items", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "Item 1", selected: true, items: [{ id: 3, text: "Item 3", selected: true }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal"
        }),
        treeView = $treeView.dxTreeView("instance"),
        firstItem = $treeView.find("." + internals.ITEM_CLASS).eq(0).get(0);

    treeView.unselectItem(firstItem);
    treeView.expandItem(firstItem);

    var items = $treeView.find(".dx-checkbox-checked");

    assert.equal(items.length, 0);
});

QUnit.test("'selectAll' should have correct state on initialization", function(assert) {
    var $treeView = initTree({
        items: [
            { id: 1, text: "Item 1", selected: true, items: [{ id: 3, text: "Item 3", selected: true }] }, { id: 2, text: "Item 2", selected: true }],
        showCheckBoxesMode: "selectAll"
    });

    assert.strictEqual($treeView.find(".dx-treeview-select-all-item").dxCheckBox("instance").option("value"), true);
});

QUnit.test("'selectAll' should work correctly when nested items are not rendered", function(assert) {
    var $treeView = initTree({
            items: [
                { id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "selectAll"
        }),
        $selectAllItem = $treeView.find(".dx-treeview-select-all-item");

    $selectAllItem.trigger("dxclick");

    var items = $treeView.find(".dx-treeview-node-container .dx-checkbox-checked");

    assert.strictEqual($selectAllItem.dxCheckBox("instance").option("value"), true);
    assert.equal(items.length, 2);
});

QUnit.test("'selectAll' should work correctly when nested items are rendered", function(assert) {
    var $treeView = initTree({
            items: [
                { id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "selectAll"
        }),
        $selectAllItem = $treeView.find(".dx-treeview-select-all-item");

    $treeView.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger("dxclick");
    $selectAllItem.trigger("dxclick");

    var items = $treeView.find(".dx-treeview-node-container .dx-checkbox-checked");

    assert.strictEqual($selectAllItem.dxCheckBox("instance").option("value"), true);
    assert.equal(items.length, 3);
});

QUnit.test("'selectAll' should work correctly when nested items are rendered after click on 'selectAll' item", function(assert) {
    var $treeView = initTree({
            items: [
                { id: 1, text: "Item 1", items: [{ id: 3, text: "Item 3" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "selectAll"
        }),
        $selectAllItem = $treeView.find(".dx-treeview-select-all-item");

    $selectAllItem.trigger("dxclick");
    $treeView.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).trigger("dxclick");

    var items = $treeView.find(".dx-treeview-node-container .dx-checkbox-checked");

    assert.strictEqual($selectAllItem.dxCheckBox("instance").option("value"), true);
    assert.equal(items.length, 3);
});
