import $ from '../../core/renderer';
import { noop } from '../../core/utils/common';
import { each } from '../../core/utils/iterator';
import { AreaItem } from './ui.pivot_grid.area_item';
import { capitalizeFirstLetter } from './ui.pivot_grid.utils';
import Popup from '../popup';
import Button from '../button';

const DIV = '<div>';

import './ui.pivot_grid.field_chooser_base';

const AREA_DRAG_CLASS = 'dx-pivotgrid-drag-action';

function renderGroupConnector(field, nextField, prevField, $container) {
    if(prevField && prevField.groupName && prevField.groupName === field.groupName) {
        $(DIV).addClass('dx-group-connector').addClass('dx-group-connector-prev').appendTo($container);
    }

    if(nextField && nextField.groupName && nextField.groupName === field.groupName) {
        $(DIV).addClass('dx-group-connector').addClass('dx-group-connector-next').appendTo($container);
    }
}

exports.FieldsArea = AreaItem.inherit({

    ctor: function(component, area) {
        this.callBase(component);
        this._area = area;
    },

    _getAreaName: function() {
        return 'fields';
    },

    _createGroupElement: function() {
        return $(DIV).addClass('dx-pivotgrid-fields-area').addClass('dx-area-fields').addClass(AREA_DRAG_CLASS).attr('group', this._area);
    },

    isVisible: function() {
        return !!this.option('fieldPanel.visible') && this.option('fieldPanel.show' + capitalizeFirstLetter(this._area) + 'Fields');
    },

    _renderButton: function(element) {
        const that = this;
        const container = $('<td>').appendTo($('<tr>').appendTo(element));
        const button = that.component._createComponent($(DIV).appendTo(container), Button, {
            text: 'Fields',
            icon: 'menu',
            width: 'auto',
            onClick: function() {
                const popup = that.tableElement().find('.dx-fields-area-popup').dxPopup('instance');
                if(!popup.option('visible')) {
                    popup.show();
                }
            }
        });
        button.$element().addClass('dx-pivotgrid-fields-area-hamburger');
    },

    _getPopupOptions: function(row, button) {
        return {
            contentTemplate: function() {
                return $('<table>').addClass('dx-area-field-container')
                    .append($('<thead>').addClass('dx-pivotgrid-fields-area-head')
                        .append(row));
            },
            height: 'auto',
            width: 'auto',
            position: {
                at: 'left',
                my: 'left',
                of: button
            },
            dragEnabled: false,
            animation: {
                show: {
                    type: 'pop',
                    duration: 200
                }
            },
            shading: false,
            showTitle: false,
            closeOnOutsideClick: true,
            container: button.parent()
        };
    },

    _renderPopup: function(tableElement, row) {
        const that = this;
        const button = tableElement.find('.dx-button');
        const popupOptions = that._getPopupOptions(row, button);
        const FieldChooserBase = that.component.$element().dxPivotGridFieldChooserBase('instance');

        if(that._rowPopup) {
            that._rowPopup.$element().remove();
        }

        that._rowPopup = that.component._createComponent($(DIV).appendTo(tableElement), Popup, popupOptions);

        that._rowPopup.$element().addClass('dx-fields-area-popup');
        that._rowPopup.content()
            .addClass('dx-pivotgrid-fields-container');
        that._rowPopup.content().parent()
            .attr('group', 'row');

        FieldChooserBase.subscribeToEvents(that._rowPopup.content());
        FieldChooserBase.renderSortable(that._rowPopup.content());
    },

    _shouldCreateButton: function() {
        return false;
    },

    _renderTableContent: function(tableElement, data) {
        const that = this;
        const groupElement = this.groupElement();
        const isVisible = this.isVisible();
        const fieldChooserBase = that.component.$element().dxPivotGridFieldChooserBase('instance');
        const head = $('<thead>').addClass('dx-pivotgrid-fields-area-head').appendTo(tableElement);
        const area = that._area;
        const row = $('<tr>');

        groupElement.toggleClass('dx-hidden', !isVisible);
        tableElement.addClass('dx-area-field-container');

        if(!isVisible) {
            return;
        }

        each(data, function(index, field) {
            if(field.area === area && field.visible !== false) {
                const td = $('<td>').append(fieldChooserBase.renderField(field, field.area === 'row'));
                const indicators = td.find('.dx-column-indicators');
                if(indicators.length && that._shouldCreateButton()) {
                    indicators.insertAfter(indicators.next());
                }
                td.appendTo(row);
                renderGroupConnector(field, data[index + 1], data[index - 1], td);
            }
        });
        if(!row.children().length) {
            $('<td>').append($(DIV).addClass('dx-empty-area-text').text(this.option('fieldPanel.texts.' + area + 'FieldArea'))).appendTo(row);
        }

        if(that._shouldCreateButton()) {
            that._renderButton(head);
            that._renderPopup(tableElement, row);
        } else {
            head.append(row);
        }
    },

    reset: function() {
        this.callBase();
        this.groupElement().css('marginTop', 0);
    },

    _renderVirtualContent: noop
});
