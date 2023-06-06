import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import { each } from '@js/core/utils/iterator';
import { setHeight, setWidth } from '@js/core/utils/style';
import Popup from '@js/ui/popup/ui.popup';
import Button from '@js/ui/button';

import { AreaItem } from '../area_item/module';
import { capitalizeFirstLetter } from '../module_widget_utils';
import '../field_chooser/module_base';

const DIV = '<div>';

const AREA_DRAG_CLASS = 'dx-pivotgrid-drag-action';

function renderGroupConnector(field, nextField, prevField, $container) {
  if (prevField && prevField.groupName && prevField.groupName === field.groupName) {
    $(DIV).addClass('dx-group-connector').addClass('dx-group-connector-prev').appendTo($container);
  }

  if (nextField && nextField.groupName && nextField.groupName === field.groupName) {
    $(DIV).addClass('dx-group-connector').addClass('dx-group-connector-next').appendTo($container);
  }
}

const FieldsArea = AreaItem.inherit({

  ctor(component, area) {
    this.callBase(component);
    this._area = area;
  },

  _getAreaName() {
    return 'fields';
  },

  _createGroupElement() {
    return $(DIV)
      .addClass('dx-pivotgrid-fields-area')
      .addClass('dx-area-fields')
      .addClass(AREA_DRAG_CLASS)
      .attr('group', this._area);
  },

  isVisible() {
    return !!this.option('fieldPanel.visible') && this.option(`fieldPanel.show${capitalizeFirstLetter(this._area)}Fields`);
  },

  _renderButton(element) {
    const that = this;
    const container = $('<td>').appendTo($('<tr>').appendTo(element));
    const button = that.component._createComponent($(DIV).appendTo(container), Button, {
      text: 'Fields',
      icon: 'menu',
      width: 'auto',
      onClick() {
        const popup = that.tableElement().find('.dx-fields-area-popup').dxPopup('instance');
        if (!popup.option('visible')) {
          popup.show();
        }
      },
    });
    button.$element().addClass('dx-pivotgrid-fields-area-hamburger');
  },

  _getPopupOptions(row, button) {
    return {
      contentTemplate() {
        return $('<table>').addClass('dx-area-field-container')
          .append($('<thead>').addClass('dx-pivotgrid-fields-area-head')
            .append(row));
      },
      height: 'auto',
      width: 'auto',
      position: {
        at: 'left',
        my: 'left',
        of: button,
      },
      dragEnabled: false,
      animation: {
        show: {
          type: 'pop',
          duration: 200,
        },
      },
      shading: false,
      showTitle: false,
      hideOnOutsideClick: true,
      container: button.parent(),
    };
  },

  _renderPopup(tableElement, row) {
    const that = this;
    const button = tableElement.find('.dx-button');
    const popupOptions = that._getPopupOptions(row, button);
    const FieldChooserBase = that.component.$element().dxPivotGridFieldChooserBase('instance');

    if (that._rowPopup) {
      that._rowPopup.$element().remove();
    }

    that._rowPopup = that.component._createComponent(
      $(DIV).appendTo(tableElement),
      Popup,
      popupOptions,
    );

    that._rowPopup.$element().addClass('dx-fields-area-popup');
    that._rowPopup.content()
      .addClass('dx-pivotgrid-fields-container');
    that._rowPopup.content().parent()
      .attr('group', 'row');

    FieldChooserBase.subscribeToEvents(that._rowPopup.content());
    FieldChooserBase.renderSortable(that._rowPopup.content());
  },

  _shouldCreateButton() {
    return false;
  },

  _renderTableContent(tableElement, data) {
    const that = this;
    const groupElement = this.groupElement();
    const isVisible = this.isVisible();
    const fieldChooserBase = that.component.$element().dxPivotGridFieldChooserBase('instance');
    const head = $('<thead>').addClass('dx-pivotgrid-fields-area-head').appendTo(tableElement);
    const area = that._area;
    const row = $('<tr>');

    groupElement.toggleClass('dx-hidden', !isVisible);
    tableElement.addClass('dx-area-field-container');

    if (!isVisible) {
      return;
    }

    each(data, (index: number, field) => {
      if (field.area === area && field.visible !== false) {
        const td = $('<td>').append(fieldChooserBase.renderField(field, field.area === 'row'));
        const indicators = td.find('.dx-column-indicators');
        if (indicators.length && that._shouldCreateButton()) {
          indicators.insertAfter((indicators as any).next());
        }
        td.appendTo(row);
        renderGroupConnector(field, data[index + 1], data[index - 1], td);
      }
    });
    if (!row.children().length) {
      $('<td>').append($(DIV).addClass('dx-empty-area-text').text(this.option(`fieldPanel.texts.${area}FieldArea`))).appendTo(row);
    }

    if (that._shouldCreateButton()) {
      that._renderButton(head);
      that._renderPopup(tableElement, row);
    } else {
      head.append(row);
    }
  },

  setGroupWidth(value) {
    setWidth(this.groupElement(), value);
  },

  setGroupHeight(value) {
    setHeight(this.groupElement(), value);
  },

  reset() {
    this.callBase();
    this.groupElement().css('marginTop', 0);
  },

  _renderVirtualContent: noop,
});

export default { FieldsArea };
export { FieldsArea };
