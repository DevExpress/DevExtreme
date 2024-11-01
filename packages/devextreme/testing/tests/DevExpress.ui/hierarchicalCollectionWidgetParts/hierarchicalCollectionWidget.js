import $ from 'jquery';
import HierarchicalCollectionWidget from 'ui/hierarchical_collection/ui.hierarchical_collection_widget';
import { DataSource } from 'common/data/data_source/data_source';

const DISABLED_STATE_CLASS = 'dx-state-disabled';

const { module, test } = QUnit;

class TestComponent extends HierarchicalCollectionWidget {
    constructor(element, options) {
        super(element, options);
        this.NAME = 'TestComponent';
        this._activeStateUnit = '.item';
    }
    _itemContainer() { return this.$element(); }

    _createActionByOption(optionName, config) {
        this.__actionConfigs = !this.__actionConfigs ? {} : this.__actionConfigs;
        this.__actionConfigs[optionName] = config;

        return super._createActionByOption(...arguments);
    }
}

const createHierarchicalCollectionWidget = options => new TestComponent($('#hcw'), options);

module('render', {
    beforeEach: function() {
        this.element = $('#hcw');
    },
    afterEach: function() {
        delete this.element;
    }
}, () => {
    test('Create item by custom model using expressions', function(assert) {
        createHierarchicalCollectionWidget({
            displayExpr: 'name',
            disabledExpr: 'isDisabled',
            items: [
                { name: 'item 1', isDisabled: true },
                { name: 'item 2' }
            ]
        });

        assert.equal(this.element.children().length, 2);
        assert.equal($.trim(this.element.children().eq(0).text()), 'item 1');
        assert.ok($.trim(this.element.children().eq(0).hasClass(DISABLED_STATE_CLASS)));
        assert.equal($.trim(this.element.children().eq(1).text()), 'item 2');
    });

    test('Default displayExpr: ', function(assert) {
        createHierarchicalCollectionWidget({
            items: [{ text: 'item 1' }]
        });

        assert.equal($.trim(this.element.children().eq(0).text()), 'item 1');
    });

    test('create item by custom model using expressions set as functions', function(assert) {
        let condition = false;
        const newItems = [{ name: 'item 1' }];
        const widget = createHierarchicalCollectionWidget({
            displayExpr: () => condition ? 'name' : 'text',
            items: [{ text: 'first item' }]
        });

        assert.equal($.trim(this.element.children().eq(0).text()), 'text');

        condition = true;
        widget.option('items', newItems);

        assert.equal($.trim(this.element.children().eq(0).text()), 'name');
    });

    test('DisplayExpr as function with parameter', function(assert) {
        createHierarchicalCollectionWidget({
            displayExpr: (itemData) => itemData && itemData.name + '!',
            items: [{ name: 'Item 1' }]
        });

        assert.equal($.trim(this.element.children().eq(0).text()), 'Item 1!');
    });

    test('DisplayExpr as non existing property', function(assert) {
        createHierarchicalCollectionWidget({
            displayExpr: 'not exist',
            items: [{ name: 'Item 1' }]
        });

        assert.equal($.trim(this.element.children().eq(0).text()), '');
    });

    [null, undefined, '', {}].forEach((dataExprValue) => {
        test(`DisplayExpr: ${dataExprValue}, items without 'text' property`, function(assert) {
            try {
                createHierarchicalCollectionWidget({
                    displayExpr: dataExprValue,
                    items: [{ name: 'item 1' }]
                });

                const $item = $('#hcw').find('.dx-item').eq(0);
                assert.equal($item.text(), '');
            } catch(e) {
                assert.ok(false, 'Error has been raised');
            }
        });

        test(`DisplayExpr: ${dataExprValue}, items with 'text' property`, function(assert) {
            try {
                createHierarchicalCollectionWidget({
                    displayExpr: dataExprValue,
                    items: [{ text: 'item 1' }]
                });

                const $item = $('#hcw').find('.dx-item').eq(0);
                assert.equal($item.text(), 'item 1');
            } catch(e) {
                assert.ok(false, 'Error has been raised');
            }
        });
    });

    test('Expressions should be reinitialized if *expr option was changed', function(assert) {
        const widget = createHierarchicalCollectionWidget({
            displayExpr: 'FirstName',
            selectedExpr: 'isSelected',
            itemsExpr: 'subItems',
            disabledExpr: 'isDisabled',
            items: [
                {
                    FirstName: 'John',
                    LastName: 'Smith',

                    isSelected: true,
                    wasSelected: false,

                    subItems: [{ FirstName: 'Mike', LastName: 'Smith' }],
                    subLevel: [{ FirstName: 'Jack', LastName: 'John', }],

                    isDisabled: true,
                    wasDisabled: false,
                }
            ]
        });
        const item = widget.option('items')[0];

        widget.option('displayExpr', 'LastName');
        assert.equal(widget._displayGetter(item), 'Smith');

        widget.option('selectedExpr', 'wasSelected');
        assert.equal(widget._selectedGetter(item), false);

        widget.option('itemsExpr', 'subLevel');
        assert.equal(widget._itemsGetter(item)[0].FirstName, 'Jack');

        widget.option('disabledExpr', 'wasDisabled');
        assert.equal(widget._disabledGetter(item), false);
    });

    test('Dynamic templates should be rerendered when displayExpr was changed', function(assert) {
        const widget = createHierarchicalCollectionWidget({
            displayExpr: 'FirstName',
            items: [
                {
                    FirstName: 'John',
                    LastName: 'Smith'
                }
            ]
        });
        let $item = $('#hcw').find('.dx-item').eq(0);

        assert.equal($item.text(), 'John', 'item text is correct on init');

        widget.option('displayExpr', 'LastName');

        $item = $('#hcw').find('.dx-item').eq(0);
        assert.equal($item.text(), 'Smith', 'item text was changed');
    });

    test('Ignore dataSource paging', function(assert) {
        createHierarchicalCollectionWidget({
            dataSource: new DataSource({
                store: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
                paginate: true,
                pageSize: 2
            })
        });

        assert.equal(this.element.children().length, 3);
    });

    test('Datasource should load once on hcw init', function(assert) {
        const dataSourceLoaded = sinon.spy();

        createHierarchicalCollectionWidget({
            dataSource: new DataSource({
                store: [{ text: 'item 1' }, { text: 'item 2' }, { text: 'item 3' }],
                paginate: true,
                pageSize: 2,
                load: dataSourceLoaded
            })
        });

        assert.equal(dataSourceLoaded.callCount, 1, 'dataSource was loaded once');
    });
});
