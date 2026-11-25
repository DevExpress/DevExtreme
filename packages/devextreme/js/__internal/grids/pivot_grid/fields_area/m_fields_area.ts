import '../field_chooser/m_field_chooser_base';

import localizationMessage from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { each } from '@js/core/utils/iterator';
import { setHeight, setWidth } from '@js/core/utils/style';
import Button from '@js/ui/button';
import Popup from '@js/ui/popup/ui.popup';
import { capitalize } from '@ts/core/utils/capitalize';
import type { PopupProperties } from '@ts/ui/popup/popup';

import { AreaItem } from '../area_item/m_area_item';
import type { AreaName } from '../area_item/types';
import type { FieldChooserBase } from '../field_chooser/m_field_chooser_base';
import { DIV } from './const';
import { renderGroupConnector } from './utils';

const AREA_DRAG_CLASS = 'dx-pivotgrid-drag-action';

class FieldsArea extends AreaItem {
  _area: any;

  _rowPopup: any;

  constructor(component, area) {
    super(component);
    this._area = area;
  }

  _getAreaName(): AreaName {
    return 'fields';
  }

  _createGroupElement() {
    return $(DIV)
      .addClass('dx-pivotgrid-fields-area')
      .addClass('dx-area-fields')
      .addClass(AREA_DRAG_CLASS)
      .attr('group', this._area);
  }

  _getAreaLabel() {
    const localizationMessageMap = {
      row: 'dxPivotGrid-rowFields',
      column: 'dxPivotGrid-columnFields',
      data: 'dxPivotGrid-dataFields',
      filter: 'dxPivotGrid-filterFields',
    };

    return localizationMessage.format(localizationMessageMap[this._area]);
  }

  _createTableElement() {
    return $('<table>')
      .attr('role', 'presentation');
  }

  isVisible() {
    return !!this.option('fieldPanel.visible') && this.option(`fieldPanel.show${capitalize(this._area)}Fields`);
  }

  _renderButton(element) {
    const that = this;
    const container = $('<td>').appendTo($('<tr>').appendTo(element));
    const button = that.component._createComponent($(DIV).appendTo(container), Button, {
      text: 'Fields',
      icon: 'menu',
      width: 'auto',
      onClick() {
        // @ts-expect-error dxPopup is not defined in dxElementWrapper
        const popup = that.tableElement().find('.dx-fields-area-popup').dxPopup('instance');
        if (!popup.option('visible')) {
          popup.show();
        }
      },
    });
    button.$element().addClass('dx-pivotgrid-fields-area-hamburger');
  }

  _getPopupOptions(row, button): PopupProperties {
    return {
      contentTemplate() {
        return $('<div>').append(
          $('<table>').addClass('dx-area-field-container')
            .append($('<thead>').addClass('dx-pivotgrid-fields-area-head')
              .append(row)),
        );
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
  }

  _renderPopup(tableElement, row) {
    const button = tableElement.find('.dx-button');
    const popupOptions = this._getPopupOptions(row, button);
    const fieldChooserBase = this.getFieldChooserBase();

    if (this._rowPopup) {
      this._rowPopup.$element().remove();
    }

    this._rowPopup = this.component._createComponent(
      $(DIV).appendTo(tableElement),
      Popup,
      popupOptions,
    );

    this._rowPopup.$element().addClass('dx-fields-area-popup');
    this._rowPopup.content()
      .addClass('dx-pivotgrid-fields-container');
    this._rowPopup.content().parent()
      .attr('group', 'row');

    fieldChooserBase.subscribeToEvents(this._rowPopup.content());
    // @ts-expect-error renderSortable() ignores the element
    fieldChooserBase.renderSortable(this._rowPopup.content());
  }

  private getFieldChooserBase(): FieldChooserBase {
    const $element = this.component.$element();
    // @ts-expect-error dxPivotGridFieldChooserBase is not defined in dxElementWrapper
    const fieldChooserBase: FieldChooserBase = $element.dxPivotGridFieldChooserBase('instance');

    return fieldChooserBase;
  }

  _shouldCreateButton() {
    return false;
  }

  _renderTableContent(tableElement, data) {
    const groupElement = this.groupElement();
    const isVisible = this.isVisible();
    const fieldChooserBase = this.getFieldChooserBase();
    const head = $('<thead>')
      .addClass('dx-pivotgrid-fields-area-head')
      .attr('role', 'presentation')
      .appendTo(tableElement);
    const area = this._area;
    const row = $('<tr>');

    groupElement?.toggleClass('dx-hidden', !isVisible);
    tableElement.addClass('dx-area-field-container');

    if (!isVisible) {
      // The reused table element may carry the menubar role from the previous
      // render, so it is reset even though the hidden area skips rendering.
      tableElement
        .attr('role', 'presentation')
        .removeAttr('aria-label');
      return;
    }

    each(data, (index: number, field) => {
      if (field.area === area && field.visible !== false) {
        const td = $('<td>')
          .attr('role', 'none')
          .append(fieldChooserBase.renderField(field, field.area === 'row'));
        const indicators = td.find('.dx-column-indicators');
        if (indicators.length && this._shouldCreateButton()) {
          indicators.insertAfter((indicators as any).next());
        }
        td.appendTo(row);
        renderGroupConnector(field, data[index + 1], data[index - 1], td);
      }
    });
    if (row.children().length) {
      // Expose the fields as a menubar of menu items, consistent with the
      // field chooser and CardView. The menubar role lives on the table
      // element (it is invalid on a table row); thead/tr/td are kept out of
      // the accessibility tree so the field items become the menubar's items.
      row.attr('role', 'presentation');
      tableElement
        .attr('role', 'menubar')
        .attr('aria-label', this._getAreaLabel());
    } else {
      // A menubar without menu items is invalid ARIA, so an empty area keeps
      // the plain placeholder text and the table stays presentational. The
      // role is reset explicitly because the table element is reused across
      // re-renders.
      tableElement
        .attr('role', 'presentation')
        .removeAttr('aria-label');
      // @ts-expect-error option() returns unknown for a template path
      $('<td>').append($(DIV).addClass('dx-empty-area-text').text(this.option(`fieldPanel.texts.${area}FieldArea`))).appendTo(row);
    }

    if (this._shouldCreateButton()) {
      this._renderButton(head);
      this._renderPopup(tableElement, row);
    } else {
      head.append(row);
    }
  }

  setGroupWidth(value) {
    setWidth(this.groupElement(), value);
  }

  setGroupHeight(value) {
    setHeight(this.groupElement(), value);
  }

  reset() {
    super.reset();
    this.groupElement()?.css('marginTop', 0);
  }

  _renderVirtualContent() {}
}

export default { FieldsArea };
export { FieldsArea };
