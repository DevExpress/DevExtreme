import $ from 'jquery';
import fields from '../../../helpers/filterBuilderTestData.js';

import 'ui/filter_builder';
import * as CLASSES from './constants.js';

const FILTER_BUILDER_GROUP_CONTENT_CLASS = 'dx-filterbuilder-group-content';

QUnit.test('markup init', function(assert) {
    const element = $('#container').dxFilterBuilder();
    const groupId = element.find(`.${CLASSES.FILTER_BUILDER_GROUP_ITEM_CLASS}`).attr('aria-owns');
    const operationId = element.find(`.${CLASSES.FILTER_BUILDER_GROUP_OPERATION_CLASS}`).attr('aria-controls');
    const actionId = element.find(`.${CLASSES.FILTER_BUILDER_IMAGE_ADD_CLASS}`).attr('aria-controls');

    const $etalon = $(
        '<div id="container" class="dx-filterbuilder dx-widget">'
            + '<div class="dx-filterbuilder-group" role="tree">'
                + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-label="Group item" aria-level="1" aria-owns="' + groupId + '">'
                    + '<div aria-controls="' + operationId + '" role="combobox" title="Operation" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">And</div>'
                    + '<div aria-controls="' + actionId + '" role="combobox" aria-label="Add" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
                + '</div>'
                + '<div class="dx-filterbuilder-group-content" id="' + groupId + '"></div>'
            + '</div>'
        + '</div>'
    );

    assert.equal(element.html(), $etalon.html());
});

QUnit.test('filterbuilder is created by different values', function(assert) {
    const instance = $('#container').dxFilterBuilder({
        fields: fields
    }).dxFilterBuilder('instance');

    try {
        instance.option('value', null);
        instance.option('value', []);
        instance.option('value', ['Or']);
        instance.option('value', ['!', [['CompanyName', '=', 'DevExpress'], ['CompanyName', '=', 'DevExpress']]]);
        instance.option('value', ['!', ['CompanyName', '=', 'DevExpress']]);
        instance.option('value', ['CompanyName', '=', 'K&S Music']);
        instance.option('value', ['CompanyName', 'K&S Music']);
        instance.option('value', [['CompanyName', '=', 'K&S Music'], ['CompanyName', '=', 'K&S Music']]);
        instance.option('value', [[['CompanyName', '=', 'K&S Music'], 'Or'], 'And']);
        assert.ok(true, 'all values were approved');
    } catch(e) {
        assert.ok(false, e);
    }
});

QUnit.test('filter Content init by one condition', function(assert) {
    const element = $('#container').dxFilterBuilder({
        fields: fields,
        value: [[['CompanyName', '=', 'K&S Music'], 'Or'], 'And']
    });

    const groupElement = element.find('.dx-filterbuilder-group-item[aria-level="1"]').eq(1);
    const groupContent = element.find('.dx-filterbuilder-group-content').eq(1);
    const groupId = groupElement.attr('aria-owns');
    const operationId = groupElement.find(`.${CLASSES.FILTER_BUILDER_GROUP_OPERATION_CLASS}`).attr('aria-controls');
    const actionId = groupElement.find(`.${CLASSES.FILTER_BUILDER_IMAGE_ADD_CLASS}`).attr('aria-controls');
    const fieldId = groupContent.find(`.${CLASSES.FILTER_BUILDER_ITEM_FIELD_CLASS}`).attr('aria-controls');
    const itemOperationId = groupContent.find(`.${CLASSES.FILTER_BUILDER_ITEM_OPERATION_CLASS}`).attr('aria-controls');

    const $etalon = $('<div/>').html(
        '<div class="dx-filterbuilder-group">'
        + `<div class="dx-filterbuilder-group-item" role="treeitem" aria-label="Group item" aria-level="1" aria-owns="${groupId}">`
            + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove group"></div>'
            + `<div aria-controls="${operationId}" role="combobox" title="Operation" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">Or</div>`
            + `<div aria-controls="${actionId}" role="combobox" aria-label="Add" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>`
        + '</div>'
        + `<div class="dx-filterbuilder-group-content" id="${groupId}">`
            + '<div class="dx-filterbuilder-group" role="group">'
                + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-level="2">'
                    + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove condition"></div>'
                    + `<div aria-controls="${fieldId}" class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0" role="combobox" title="Item field" aria-haspopup="true" aria-expanded="false">Company Name</div>`
                    + `<div aria-controls="${itemOperationId}" class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0" role="combobox" title="Item operation" aria-haspopup="true" aria-expanded="false">Equals</div>`
                    + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                        + '<div class="dx-filterbuilder-item-value-text" tabindex="0" role="button" title="Item value" aria-haspopup="true">K&amp;S Music</div>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>'
    + '</div>'
    );

    assert.equal(element.find('.' + FILTER_BUILDER_GROUP_CONTENT_CLASS).html(), $etalon.html());
});

QUnit.test('filter Content init by several conditions', function(assert) {
    const element = $('#container').dxFilterBuilder({
        fields: fields,
        value: [['CompanyName', '=', 'K&S Music'], 'or', ['Zipcode', '=', '98027']]
    });

    const classLevel = 'dx-filterbuilder-group-item[aria-level="1"]';
    const groupItems = element.find(`.${FILTER_BUILDER_GROUP_CONTENT_CLASS} .${classLevel}`);
    const fieldId1 = groupItems.eq(0).find(`.${CLASSES.FILTER_BUILDER_ITEM_FIELD_CLASS}`).attr('aria-controls');
    const itemOperationId1 = groupItems.eq(0).find(`.${CLASSES.FILTER_BUILDER_ITEM_OPERATION_CLASS}`).attr('aria-controls');
    const fieldId2 = groupItems.eq(1).find(`.${CLASSES.FILTER_BUILDER_ITEM_FIELD_CLASS}`).attr('aria-controls');
    const itemOperationId2 = groupItems.eq(1).find(`.${CLASSES.FILTER_BUILDER_ITEM_OPERATION_CLASS}`).attr('aria-controls');

    const $etalon = $('<div/>').html(
        '<div class="dx-filterbuilder-group" role="group">'
            + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-level="1">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove condition"></div>'
                + `<div aria-controls="${fieldId1}" class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0" role="combobox" title="Item field" aria-haspopup="true" aria-expanded="false">Company Name</div>`
                + `<div aria-controls="${itemOperationId1}" class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0" role="combobox" title="Item operation" aria-haspopup="true" aria-expanded="false">Equals</div>`
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                    + '<div class="dx-filterbuilder-item-value-text" tabindex="0" role="button" title="Item value" aria-haspopup="true">K&amp;S Music</div>'
                + '</div>'
            + '</div>'
        + '</div>'
        + '<div class="dx-filterbuilder-group" role="group">'
            + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-level="1">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove condition"></div>'
                + `<div aria-controls="${fieldId2}" class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0" role="combobox" title="Item field" aria-haspopup="true" aria-expanded="false">Zipcode</div>`
                + `<div aria-controls="${itemOperationId2}" class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0" role="combobox" title="Item operation" aria-haspopup="true" aria-expanded="false">Equals</div>`
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                    + '<div class="dx-filterbuilder-item-value-text" tabindex="0" role="button" title="Item value" aria-haspopup="true">98027</div>'
                + '</div>'
            + '</div>'
        + '</div>'
    );

    assert.equal(element.find('.' + FILTER_BUILDER_GROUP_CONTENT_CLASS).html(), $etalon.html());
});

[
    ['and'],
    ['or'],
    ['notOr'],
    ['notAnd'],
].forEach(groupOperations => {
    const getOperationText = function(operation) {
        const isNot = operation.indexOf('not') !== -1;
        return isNot ? `Not ${operation.substring(3, 4).toUpperCase()}${operation.substring(4)}` : `${operation.substring(0, 1).toUpperCase()}${operation.substring(1)}`;
    };
    [null, []].forEach(value => {
        QUnit.test(`filter content with custom group operations (${groupOperations}) and ${!value ? value : 'empty'} value`, function(assert) {
            const element = $('#container').dxFilterBuilder({
                fields: fields,
                value,
                groupOperations
            });

            // assert
            assert.strictEqual(element.find('.dx-filterbuilder-group-operation').text(), getOperationText(groupOperations[0]));
        });
    });
});
