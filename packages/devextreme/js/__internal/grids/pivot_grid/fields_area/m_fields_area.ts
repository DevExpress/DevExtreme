import '../field_chooser/m_field_chooser_base';

import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { setHeight, setWidth } from '@js/core/utils/style';
import Button from '@js/ui/button';
import type { PivotGridArea } from '@js/ui/pivot_grid/data_source';
import Popup from '@js/ui/popup/ui.popup';
import { capitalize } from '@ts/core/utils/capitalize';
import type { FieldChooserField } from '@ts/grids/pivot_grid/field_chooser/const';
import type { PopupProperties } from '@ts/ui/popup/popup';

import { AreaItem } from '../area_item/m_area_item';
import type { AreaItemComponent, AreaName } from '../area_item/types';
import type { FieldChooserBase } from '../field_chooser/m_field_chooser_base';
import { DIV } from './const';
import { renderGroupConnector } from './utils';

const AREA_DRAG_CLASS = 'dx-pivotgrid-drag-action';

class FieldsArea extends AreaItem {
  private readonly _area: PivotGridArea;

  private _rowPopup?: Popup;

  constructor(component: AreaItemComponent, area: PivotGridArea) {
    super(component);
    this._area = area;
  }

  protected _getAreaName(): AreaName {
    return 'fields';
  }

  protected _createGroupElement(): dxElementWrapper {
    return $(DIV)
      .addClass('dx-pivotgrid-fields-area')
      .addClass('dx-area-fields')
      .addClass(AREA_DRAG_CLASS)
      .attr('group', this._area);
  }

  private _getAreaLabel(): string {
    const localizationMessageMap = {
      row: 'dxPivotGrid-rowFields',
      column: 'dxPivotGrid-columnFields',
      data: 'dxPivotGrid-dataFields',
      filter: 'dxPivotGrid-filterFields',
    };

    return localizationMessage.format(localizationMessageMap[this._area]);
  }

  protected _createTableElement(): dxElementWrapper {
    return $('<table>')
      .attr('role', 'presentation');
  }

  public isVisible(): boolean {
    return !!this.option('fieldPanel.visible') && !!this.option(`fieldPanel.show${capitalize(this._area)}Fields`);
  }

  private _renderButton(element: dxElementWrapper): void {
    const container = $('<td>').appendTo($('<tr>').appendTo(element));
    const button = this.component._createComponent($(DIV).appendTo(container), Button, {
      text: 'Fields',
      icon: 'menu',
      width: 'auto',
      onClick: (): void => {
        // @ts-expect-error dxPopup is not defined in dxElementWrapper
        const popup = this.tableElement().find('.dx-fields-area-popup').dxPopup('instance');
        if (!popup.option('visible')) {
          popup.show();
        }
      },
    });
    button.$element().addClass('dx-pivotgrid-fields-area-hamburger');
  }

  private _getPopupOptions(row: dxElementWrapper, button: dxElementWrapper): PopupProperties {
    return {
      contentTemplate(): dxElementWrapper {
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

  private _renderPopup(tableElement: dxElementWrapper, row: dxElementWrapper): void {
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
    const $content = $(this._rowPopup.content());
    $content.addClass('dx-pivotgrid-fields-container');
    $content.parent().attr('group', 'row');

    fieldChooserBase.subscribeToEvents($content);
    // @ts-expect-error renderSortable() ignores the element
    fieldChooserBase.renderSortable($content);
  }

  private getFieldChooserBase(): FieldChooserBase {
    const $element = this.component.$element();
    // @ts-expect-error dxPivotGridFieldChooserBase is not defined in dxElementWrapper
    const fieldChooserBase: FieldChooserBase = $element.dxPivotGridFieldChooserBase('instance');

    return fieldChooserBase;
  }

  private _shouldCreateButton(): boolean {
    return false;
  }

  // @ts-expect-error the fields area renders fields, not cells
  protected _renderTableContent(tableElement: dxElementWrapper, data: FieldChooserField[]): void {
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

    data.forEach((field, index) => {
      if (field.area === area && field.visible !== false) {
        const td = $('<td>')
          .attr('role', 'none')
          .append(fieldChooserBase.renderField(field, field.area === 'row'));
        const indicators = td.find('.dx-column-indicators');
        if (indicators.length && this._shouldCreateButton()) {
          indicators.insertAfter(indicators.next());
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

  public setGroupWidth(value: number | string): void {
    setWidth(this.groupElement(), value);
  }

  public setGroupHeight(value: number | string): void {
    setHeight(this.groupElement(), value);
  }

  public reset(): void {
    super.reset();
    this.groupElement()?.css('marginTop', 0);
  }

  protected _renderVirtualContent(): void {}
}

export default { FieldsArea };
export { FieldsArea };
