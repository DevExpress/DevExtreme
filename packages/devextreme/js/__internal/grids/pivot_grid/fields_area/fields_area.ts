import '../field_chooser/field_chooser_base';

import localizationMessage from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { setHeight, setWidth } from '@js/core/utils/style';
import Button from '@js/ui/button';
import type { PivotGridArea } from '@js/ui/pivot_grid/data_source';
import Popup from '@js/ui/popup/ui.popup';
import { capitalize } from '@ts/core/utils/capitalize';
import { CLASSES as COLUMN_STATE_MIXIN_CLASSES } from '@ts/grids/grid_core/column_state_mixin/const';
import type { FieldChooserField } from '@ts/grids/pivot_grid/field_chooser/const';
import { CLASSES as FIELD_CHOOSER_CLASSES } from '@ts/grids/pivot_grid/field_chooser/const';
import { BUTTON_CLASS } from '@ts/ui/button/button';
import type { PopupProperties } from '@ts/ui/popup/popup';

import { AreaItem } from '../area_item/area_item';
import type { AreaItemComponent, AreaName } from '../area_item/types';
import type { FieldChooserBase } from '../field_chooser/field_chooser_base';
import { CLASSES, DIV } from './const';
import { renderGroupConnector } from './utils';

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
      .addClass(CLASSES.pivotGridFieldsArea)
      .addClass(FIELD_CHOOSER_CLASSES.area.fieldList)
      .addClass(FIELD_CHOOSER_CLASSES.pivotGrid.dragAction)
      .attr('group', this._area);
  }

  protected _createTableElement(): dxElementWrapper {
    const localizationMessageMap = {
      row: 'dxPivotGrid-rowFields',
      column: 'dxPivotGrid-columnFields',
      data: 'dxPivotGrid-dataFields',
      filter: 'dxPivotGrid-filterFields',
    };

    return $('<table>')
      .attr('role', 'group')
      .attr('aria-label', localizationMessage.format(localizationMessageMap[this._area]));
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
        const popup = this._rowPopup;
        if (!popup || popup.option('visible')) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        popup.show();
      },
    });
    button.$element().addClass(CLASSES.pivotGridFieldsAreaHamburger);
  }

  private _getPopupOptions(row: dxElementWrapper, button: dxElementWrapper): PopupProperties {
    return {
      contentTemplate(): dxElementWrapper {
        return $(DIV).append(
          $('<table>').addClass(FIELD_CHOOSER_CLASSES.area.fieldContainer)
            .append($('<thead>').addClass(CLASSES.pivotGridFieldsAreaHead)
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
    const button = tableElement.find(`.${BUTTON_CLASS}`);
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

    this._rowPopup.$element().addClass(CLASSES.fieldsAreaPopup);
    const $content = $(this._rowPopup.content());
    $content.addClass(FIELD_CHOOSER_CLASSES.pivotGrid.fieldsContainer);
    $content.parent().attr('group', 'row');

    fieldChooserBase.subscribeToEvents($content);
    fieldChooserBase.renderSortable();
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
    const head = $('<thead>').addClass(CLASSES.pivotGridFieldsAreaHead).appendTo(tableElement);
    const area = this._area;
    const row = $('<tr>');

    groupElement?.toggleClass(CLASSES.hidden, !isVisible);
    tableElement.addClass(FIELD_CHOOSER_CLASSES.area.fieldContainer);

    if (!isVisible) {
      return;
    }

    data.forEach((field, index) => {
      if (field.area !== area || field.visible === false) {
        return;
      }

      const td = $('<td>').append(fieldChooserBase.renderField(field, field.area === 'row'));
      const indicators = td.find(`.${COLUMN_STATE_MIXIN_CLASSES.columnIndicators}`);
      if (indicators.length && this._shouldCreateButton()) {
        indicators.insertAfter(indicators.next());
      }
      td.appendTo(row);
      renderGroupConnector(field, data[index + 1], data[index - 1], td);
    });
    if (!row.children().length) {
      // @ts-expect-error option() returns unknown for a template path
      $('<td>').append($(DIV).addClass(CLASSES.emptyAreaText).text(this.option(`fieldPanel.texts.${area}FieldArea`))).appendTo(row);
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
