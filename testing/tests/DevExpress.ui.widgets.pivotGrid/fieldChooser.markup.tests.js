import 'common.css!';
import 'generic_light.css!';
import 'ui/pivot_grid/ui.pivot_grid.field_chooser';

import $ from 'jquery';

QUnit.testStart(function() {
    const markup = '<div id="container"></div>';
    $('#qunit-fixture').html(markup);
});

const createMockDataSource = function(options) {
    $.each(options.fields || [], function(index, field) {
        field.index = index;
    });

    const stubDataSource = {
        getAreaFields: function(area) {
            return options[area + 'Fields'] || [];
        },
        field: sinon.stub(),
        getFieldValues: function(index) {
            return $.Deferred().resolve(options.fieldValues[index]);
        },
        fields: function() {
            return options.fields;
        },
        state: function() {
            return {
                fields: options.fields
            };
        },
        load: sinon.stub(),
        on: sinon.stub(),
        off: sinon.stub(),
        isLoading: sinon.stub().returns(false)
    };

    return stubDataSource;
};

QUnit.module('dxPivotGridFieldChooser markup tests', {
    beforeEach: function() {
        this.setupFieldChooser = function(dataSourceOptions, fieldChooserOptions) {
            fieldChooserOptions = fieldChooserOptions || {};
            if(dataSourceOptions) {
                this.dataSource = createMockDataSource(dataSourceOptions);
                fieldChooserOptions.dataSource = this.dataSource;
            }
            this.$element = $('#container');
            this.fieldChooser = this.$element.dxPivotGridFieldChooser(fieldChooserOptions).dxPivotGridFieldChooser('instance');
        };

        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    }
});

QUnit.test('Init markup without DataSource', function(assert) {
    // act
    this.setupFieldChooser();

    const $cols = this.$element.find('.dx-col');
    const $areas = $cols.find('.dx-area');
    const $headers = $areas.children('.dx-area-fields-header');

    // assert
    assert.ok(this.fieldChooser);
    assert.ok(this.$element.hasClass('dx-pivotgridfieldchooser'), 'container has dx-pivotgridfieldchooser class');
    assert.ok(this.$element.hasClass('dx-pivotgrid-fields-container'), 'container has dx-pivotgrid-fields-container class');
    assert.equal($cols.length, 4, 'container has 2 columns');
    assert.equal($cols.find('.dx-area.dx-all-fields').length, 1, 'all fields area');
    assert.equal($cols.eq(0).find('.dx-area').length, 1, '1st col areas contains 1 area');
    assert.equal($cols.eq(1).find('.dx-area').length, 2, '2nd col contains 2 areas');
    assert.equal($headers.length, 5, 'area headers count');
    assert.equal($headers.children('.dx-area-icon').length, 5, 'areas has icons');
    assert.equal($headers.children('.dx-area-caption').length, 5, 'areas has captions');
    assert.ok($areas.find('.dx-area-fields').length > 0, 'fields content');
});

QUnit.test('Empty DataSource', function(assert) {
    const dataSourceOptions = {};
    // act
    this.setupFieldChooser(dataSourceOptions);

    const $cols = this.$element.find('.dx-col');
    const $areas = $cols.find('.dx-area');
    const $headers = $areas.children('.dx-area-fields-header');

    // assert
    assert.ok(this.fieldChooser);
    assert.ok(this.dataSource);
    assert.ok(this.$element.hasClass('dx-pivotgridfieldchooser'), 'container has dx-pivotgridfieldchooser class');
    assert.ok(this.$element.hasClass('dx-pivotgrid-fields-container'), 'container has dx-pivotgrid-fields-container class');
    assert.equal($cols.length, 4, 'container has 4 columns');
    assert.equal($cols.find('.dx-area.dx-all-fields').length, 1, 'all fields area');
    assert.equal($cols.eq(0).find('.dx-area').length, 1, '1st col areas count');
    assert.equal($cols.eq(1).find('.dx-area').length, 2, '2nd col areas count');
    assert.equal($cols.eq(2).find('.dx-area').length, 1, '3rd col areas count');
    assert.equal($cols.eq(3).find('.dx-area').length, 1, '4rd col areas count');
    assert.equal($headers.length, 5, 'area headers count');
    assert.equal($headers.children('.dx-area-icon').length, 5, 'areas has icons');
    assert.equal($headers.children('.dx-area-caption').length, 5, 'areas has captions');
    assert.ok($areas.find('.dx-area-fields').length > 0, 'fields content');
    assert.strictEqual(this.dataSource.load.callCount, 0);
});

QUnit.test('Init markup with sizes', function(assert) {
    // act
    this.setupFieldChooser({}, { height: 450, width: 550 });

    // assert
    assert.ok(this.fieldChooser);
    assert.equal(this.$element.get(0).style.width, '550px', 'width');
    assert.equal(this.$element.get(0).style.height, '450px', 'height');
});
