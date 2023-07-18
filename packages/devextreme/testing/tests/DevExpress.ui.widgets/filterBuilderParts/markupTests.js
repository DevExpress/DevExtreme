import $ from 'jquery';
import devices from 'core/devices';
import fields from '../../../helpers/filterBuilderTestData.js';

import 'ui/filter_builder';

const FILTER_BUILDER_GROUP_CONTENT_CLASS = 'dx-filterbuilder-group-content';

QUnit.test('markup init', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'This test is not actual for mobile devices, dxclick add onclick=\'void(0)\' to every button in mobile');
        return;
    }
    const $etalon = $(
        '<div id="container" class="dx-filterbuilder dx-widget">'
            + '<div class="dx-filterbuilder-group">'
                + '<div class="dx-filterbuilder-group-item">'
                    + '<div class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">And</div>'
                    + '<div class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
                + '</div>'
                + '<div class="dx-filterbuilder-group-content"></div>'
            + '</div>'
        + '</div>'
    );

    const element = $('#container').dxFilterBuilder();
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
    const $etalon = $('<div/>').html(
        '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0"></div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-group-operation" tabindex="0">Or</div>'
                + '<div class="dx-filterbuilder-action-icon dx-icon-plus dx-filterbuilder-action" tabindex="0"></div>'
            + '</div>'
            + '<div class="dx-filterbuilder-group-content">'
                + '<div class="dx-filterbuilder-group">'
                    + '<div class="dx-filterbuilder-group-item">'
                        + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0"></div>'
                        + '<div class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0">Company Name</div>'
                        + '<div class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0">Equals</div>'
                        + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                            + '<div class="dx-filterbuilder-item-value-text" tabindex="0">K&amp;S Music</div>'
                        + '</div>'
                    + '</div>'
                + '</div>'
            + '</div>'
        + '</div>'
    );

    const element = $('#container').dxFilterBuilder({
        fields: fields,
        value: [[['CompanyName', '=', 'K&S Music'], 'Or'], 'And']
    });
    assert.equal(element.find('.' + FILTER_BUILDER_GROUP_CONTENT_CLASS).html(), $etalon.html());
});

QUnit.test('filter Content init by several conditions', function(assert) {
    if(devices.real().deviceType !== 'desktop') {
        assert.ok(true, 'This test is not actual for mobile devices, because dxclick add onclick=\'void(0)\' to every button in mobile');
        return;
    }
    const $etalon = $('<div/>').html(
        '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0"></div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0">Company Name</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0">Equals</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                    + '<div class="dx-filterbuilder-item-value-text" tabindex="0">K&amp;S Music</div>'
                + '</div>'
            + '</div>'
        + '</div>'
        + '<div class="dx-filterbuilder-group">'
            + '<div class="dx-filterbuilder-group-item">'
                + '<div class="dx-filterbuilder-action-icon dx-icon-remove dx-filterbuilder-action" tabindex="0"></div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-field" tabindex="0">Zipcode</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-operation" tabindex="0">Equals</div>'
                + '<div class="dx-filterbuilder-text dx-filterbuilder-item-value">'
                    + '<div class="dx-filterbuilder-item-value-text" tabindex="0">98027</div>'
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
