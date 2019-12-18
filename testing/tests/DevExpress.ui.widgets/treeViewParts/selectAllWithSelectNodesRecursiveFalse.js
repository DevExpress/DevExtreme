/* global DATA, initTree */

import $ from 'jquery';

QUnit.module('SelectAll mode with \'selectNodesRecursive\' = \'false\'', {
    beforeEach: function() {
        var data = $.extend(true, [], DATA[5]);
        data[0].items[1].items[0].expanded = true;
        data[0].items[1].items[1].expanded = true;
        var $treeView = initTree({
            items: $.extend(true, [], data),
            showCheckBoxesMode: 'selectAll',
            selectNodesRecursive: false
        });
        this.treeView = $treeView.dxTreeView('instance');
        this.checkAllItemsSelection = function(selection) {
            var items = this.treeView.option('items'),
                count = 0;

            count = items[0].selected === selection ? (count + 1) : count;
            count = items[0].items[0].selected === selection ? (count + 1) : count;
            count = items[0].items[1].selected === selection ? (count + 1) : count;
            count = items[0].items[1].items[0].selected === selection ? (count + 1) : count;
            count = items[0].items[1].items[1].selected === selection ? (count + 1) : count;
            count = items[1].selected === selection ? (count + 1) : count;

            return count;
        };
    }
});

QUnit.test('Select all items', function(assert) {
    var checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');
    checkBox.option('value', true);
    assert.equal(this.checkAllItemsSelection(true), 6, 'all items were selected');
});

QUnit.test('Unselect all items', function(assert) {
    var checkBox = this.treeView._$selectAllItem.dxCheckBox('instance');
    checkBox.option('value', true);
    checkBox.option('value', false);
    assert.equal(this.checkAllItemsSelection(false), 6, 'all items were unselected');
});
