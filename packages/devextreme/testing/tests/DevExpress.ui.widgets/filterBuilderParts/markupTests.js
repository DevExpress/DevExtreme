import $ from 'jquery';
import devices from '__internal/core/m_devices';
import fields from '../../../helpers/filterBuilderTestData.js';

import 'ui/filter_builder';

const FILTER_BUILDER_GROUP_CONTENT_CLASS = 'dx-filterbuilder-group-content';

QUnit.test('markup init', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'This test is not actual for mobile devices, dxclick add onclick=\'void(0)\' to every button in mobile');
        return;
    }
    const element = $('#container').dxFilterBuilder();
    const guid = element.find('.dx-filterbuilder-group-item').attr('aria-owns');

    const $etalon = $(
        '<div id="container" class="dx-filterbuilder dx-widget">'
            + '<div class="dx-filterbuilder-group">'
                + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-label="Group item" aria-level="1" aria-owns="' + guid + '">'
                    + '<div role="combobox" title="Operation" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">And</div>'
                    + '<div role="combobox" aria-label="Add" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
                + '</div>'
                + '<div class="dx-filterbuilder-group-content" id="' + guid + '" role="group"></div>'
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
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'This test is not actual for mobile devices, dxclick add onclick=\'void(0)\' to every button in mobile');
        return;
    }

    const element = $('#container').dxFilterBuilder({
        fields: fields,
        value: [[['CompanyName', '=', 'K&S Music'], 'Or'], 'And']
    });
    const guid = element.find('.dx-filterbuilder-group-item[aria-level="2"]').attr('aria-owns');

    const $etalon = $('<div/>').html(
        '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-label="Group item" aria-level="2" aria-owns="' + guid + '">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove group"></div>'
                + '<div role="combobox" title="Operation" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">Or</div>'
                + '<div role="combobox" aria-label="Add" aria-haspopup="true" aria-expanded="false" class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
            + '</div>'
            + '<div class="dx-filterbuilder-group-content" id="' + guid + '" role="group">'
                + '<div class="dx-filterbuilder-group">'
                    + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-level="2">'
                        + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove condition"></div>'
                        + '<div class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0" role="combobox" title="Item field" aria-haspopup="true" aria-expanded="false">Company Name</div>'
                        + '<div class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0" role="combobox" title="Item operation" aria-haspopup="true" aria-expanded="false">Equals</div>'
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
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'This test is not actual for mobile devices, because dxclick add onclick=\'void(0)\' to every button in mobile');
        return;
    }
    const $etalon = $('<div/>').html(
        '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-level="1">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove condition"></div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0" role="combobox" title="Item field" aria-haspopup="true" aria-expanded="false">Company Name</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0" role="combobox" title="Item operation" aria-haspopup="true" aria-expanded="false">Equals</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                    + '<div class="dx-filterbuilder-item-value-text" tabindex="0" role="button" title="Item value" aria-haspopup="true">K&amp;S Music</div>'
                + '</div>'
            + '</div>'
        + '</div>'
        + '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item" role="treeitem" aria-level="1">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0" role="button" aria-label="Remove condition"></div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0" role="combobox" title="Item field" aria-haspopup="true" aria-expanded="false">Zipcode</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0" role="combobox" title="Item operation" aria-haspopup="true" aria-expanded="false">Equals</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                    + '<div class="dx-filterbuilder-item-value-text" tabindex="0" role="button" title="Item value" aria-haspopup="true">98027</div>'
                + '</div>'
            + '</div>'
        + '</div>'
    );

    const element = $('#container').dxFilterBuilder({
        fields: fields,
        value: [['CompanyName', '=', 'K&S Music'], 'or', ['Zipcode', '=', '98027']]
    });
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
            if(devices.real().deviceType !== 'desktop') {
                assert.ok(true, 'This test is not actual for mobile devices, because dxclick add onclick=\'void(0)\' to every button in mobile');
                return;
            }

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
