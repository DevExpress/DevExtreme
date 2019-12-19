import $ from 'jquery';

QUnit.testStart(function() {
    var markup = '<div id="container"></div>';

    $('#qunit-fixture').html(markup);
});


import 'common.css!';

import { FieldsArea } from 'ui/pivot_grid/ui.pivot_grid.fields_area';
import { AreaItem } from 'ui/pivot_grid/ui.pivot_grid.area_item';

QUnit.module('Creation');

QUnit.test('Create Fields area', function(assert) {
    var fieldsArea = new FieldsArea();

    assert.ok(fieldsArea);
    assert.ok(fieldsArea instanceof AreaItem);
});

QUnit.module('Rendering', {
    beforeEach: function() {
        this.component = {
            option: sinon.stub(),
            $element: function() {
                return $('<div>').dxPivotGridFieldChooserBase();
            }
        };

        this.component.option.withArgs('fieldPanel.texts.myAreaFieldArea').returns('Drop Fields Here');
        this.component.option.withArgs('fieldPanel.showMyAreaFields').returns(true);
        this.component.option.withArgs('fieldPanel.visible').returns(true);

        this.area = new FieldsArea(this.component, 'myArea');
        this.$container = $('#container').addClass('dx-pivotgrid');
    }
});

QUnit.test('Render without data', function(assert) {
    this.area.render(this.$container, []);

    assert.strictEqual(this.area.tableElement()[0].rows.length, 1);
    assert.strictEqual(this.area.tableElement()[0].rows[0].cells.length, 1, 'area column count');
    assert.strictEqual($(this.area.tableElement()[0].rows[0].cells[0]).find('.dx-empty-area-text').text(), 'Drop Fields Here', 'Empty area text');
    assert.ok(this.area.tableElement().hasClass('dx-area-field-container'));

    var groupElement = this.area.groupElement();

    assert.ok(groupElement.hasClass('dx-area-fields'));
    assert.ok(groupElement.hasClass('dx-pivotgrid-drag-action'), 'items in area are draggable');
    assert.strictEqual(groupElement.attr('group'), 'myArea');
});

QUnit.test('Render fields', function(assert) {
    this.area.render(this.$container, [{ dataField: 'Field Area 1', allowFiltering: true, allowSorting: true, area: 'myArea' }, { dataField: 'Field2', allowFiltering: true, allowSorting: true, area: 'myArea' }]);

    var rows = this.area.tableElement()[0].rows;

    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].cells.length, 2);
    assert.ok(this.$container.find('.dx-area-field').eq(0).children().eq(0).hasClass('dx-area-field-content'));// showColumnLines set to false
});

QUnit.test('Render fields for row area', function(assert) {
    this.component.option.withArgs('fieldPanel.showRowFields').returns(true);

    var area = new FieldsArea(this.component, 'row');

    area.render(this.$container, [{ dataField: 'Field Area 1', allowFiltering: true, allowSorting: true, area: 'row' }]);


    assert.ok(this.$container.find('.dx-area-field').eq(0).children().eq(0).hasClass('dx-column-indicators')); // showColumnLines set to true for row area fields
});

QUnit.test('Render if area is hidden', function(assert) {
    this.component.option.withArgs('fieldPanel.showMyAreaFields').returns(false);
    this.area.render(this.$container, []);

    assert.strictEqual(this.area.groupElement().is(':visible'), false);
    assert.strictEqual(this.area.tableElement()[0].rows.length, 0);
});

QUnit.test('Render if fieldPanel is hidden', function(assert) {
    this.component.option.withArgs('fieldPanel.visible').returns(false);
    this.area.render(this.$container, []);

    assert.strictEqual(this.area.groupElement().is(':visible'), false);
    assert.strictEqual(this.area.tableElement()[0].rows.length, 0);
});

QUnit.test('Render after show the area', function(assert) {
    this.component.option.withArgs('showMyAreaHeader').returns(false);
    this.area.render(this.$container, []);

    // act
    this.component.option.withArgs('showMyAreaHeader').returns(true);
    this.area.render(this.$container, []);

    assert.strictEqual(this.area.groupElement().is(':visible'), true);
    assert.strictEqual(this.area.tableElement()[0].rows.length, 1);
});

QUnit.test('Render group fields', function(assert) {
    this.area.render(this.$container, [
        { dataField: 'Field1', groupName: 'Group1', area: 'myArea' },
        { dataField: 'Field2', groupName: 'Group1', area: 'myArea' },
        { dataField: 'Field3', groupName: 'Group1', area: 'myArea' },
        { dataField: 'Field4', area: 'myArea' }
    ]);

    var cells = this.area.tableElement().find('td');

    assert.strictEqual(cells.length, 4);

    assert.strictEqual(cells.eq(0).find('.dx-group-connector').length, 1);
    assert.ok(cells.eq(0).find('.dx-group-connector').hasClass('dx-group-connector-next'));
    assert.strictEqual(cells.eq(0).find('.dx-area-field').attr('item-group'), 'Group1');

    assert.strictEqual(cells.eq(1).find('.dx-group-connector').length, 2);
    assert.ok(cells.eq(1).find('.dx-group-connector').eq(0).hasClass('dx-group-connector-prev'));
    assert.ok(cells.eq(1).find('.dx-group-connector').eq(1).hasClass('dx-group-connector-next'));
    assert.strictEqual(cells.eq(1).find('.dx-area-field').attr('item-group'), 'Group1');

    assert.strictEqual(cells.eq(2).find('.dx-group-connector').length, 1);
    assert.ok(cells.eq(2).find('.dx-group-connector').eq(0).hasClass('dx-group-connector-prev'));
    assert.strictEqual(cells.eq(2).find('.dx-area-field').attr('item-group'), 'Group1');

    assert.strictEqual(cells.eq(3).find('.dx-group-connector').length, 0);
    assert.strictEqual(cells.eq(3).find('.dx-area-field').attr('item-group'), undefined);
});

QUnit.test('Not render field for incorrect area', function(assert) {
    this.area.render(this.$container, [
        { dataField: 'Field1', area: 'myArea' },
        { dataField: 'Field2', area: 'filter' }
    ]);

    var fields = this.area.tableElement().find('.dx-area-field');

    assert.strictEqual(fields.length, 1);
    assert.strictEqual(fields.eq(0).data('field').area, 'myArea');

});

QUnit.test('Render empty area when all fields with incorrect area', function(assert) {
    this.area.render(this.$container, [
        { dataField: 'Field1', area: 'filter' },
        { dataField: 'Field2', area: 'filter' }
    ]);

    var fields = this.area.tableElement().find('.dx-area-field');

    assert.strictEqual(fields.length, 0);
    assert.strictEqual($(this.area.tableElement()[0].rows[0].cells[0]).find('.dx-empty-area-text').text(), 'Drop Fields Here', 'Empty area text');
});

QUnit.test('Not render hidden field', function(assert) {
    this.area.render(this.$container, [
        { dataField: 'Field1', area: 'myArea', visible: false },
        { dataField: 'Field2', area: 'myArea' }
    ]);

    var fields = this.area.tableElement().find('.dx-area-field');

    assert.strictEqual(fields.length, 1, 'rendered fields count');
    assert.strictEqual(fields.eq(0).data('field').dataField, 'Field2', 'rendered field');
});

/*
QUnit.module("Hamburger", {
    beforeEach: function () {
        this.component = {
            option: sinon.stub(),
            element: function () {
                return $("<div>").dxPivotGridFieldChooserBase();
            },

            _createComponent: function (container, Component, options) {
                return new Component(container, options);
            }
        };

        this.component.option.withArgs("fieldPanel.texts.myAreaFieldArea").returns("Drop Fields Here");
        this.component.option.withArgs("fieldPanel.showRowFields").returns(true);
        this.component.option.withArgs("fieldPanel.visible").returns(true);
        this.component.option.withArgs("rowLayout").returns("tree");

        this.fields = [
            { dataField: "Field Area 1", allowFiltering: true, allowSorting: true, area: "row" },
            { dataField: "Field2", allowFiltering: true, allowSorting: true, area: "row" }
        ];

        this.area = new FieldsArea(this.component, "row");
        this.$container = $("#container").addClass("dx-pivotgrid");

        var that = this;

        this.renderArea = function () {
            that.area.render(that.$container, that.fields);
        }
    }
});

QUnit.test("Render hamburger button", function (assert) {
    this.renderArea();

    var rows = this.area.tableElement()[0].rows;

    assert.strictEqual(rows.length, 1);
    assert.strictEqual(rows[0].cells.length, 1);
    assert.ok($(rows[0].cells[0]).children(0).dxButton("instance"));
    var popup = this.area.tableElement().find(".dx-fields-area-popup").dxPopup("instance");

    assert.ok(popup);
    assert.ok(!popup.option("visible"));
    assert.ok(!popup.option("dragEnabled"));
});

QUnit.test("Show popup with fields", function (assert) {
    this.renderArea();
    var button = $(this.area.tableElement()[0].rows[0].cells[0]).children(0).dxButton("instance");

    button.element().trigger("dxclick");
    var popup = this.area.tableElement().find(".dx-fields-area-popup").dxPopup("instance");

    assert.ok(popup);
    assert.ok(popup.option("visible"));
    assert.strictEqual(popup.content().find(".dx-pivotgrid-fields-area-head").length, 1);
    assert.strictEqual(popup.content().find(".dx-pivotgrid-fields-area-head").find(".dx-area-field").length, 2);
});
*/
