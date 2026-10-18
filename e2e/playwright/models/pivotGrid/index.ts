import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Popup from '../popup';
import ColumnHeaderArea from './columnHeaderArea';
import ColumnsArea from './columnsArea';
import DataHeaderArea from './dataHeaderArea';
import FieldChooser from './fieldChooser';
import FilterHeaderArea from './filterHeaderArea';
import Overlay from './overlay';
import RowHeaderArea from './rowHeaderArea';
import RowsArea from './rowsArea';

const CLASS = {
  fieldChooser: 'dx-pivotgridfieldchooser',
  fieldChooserButton: 'dx-pivotgrid-field-chooser-button',
  fieldChooserPopup: 'dx-fieldchooser-popup',
  exportBtn: 'dx-pivotgrid-export-button',
  loadPanel: 'dx-loadpanel',
};

export default class PivotGrid extends Widget {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxPivotGrid'; }

  public addWidgetPrefix(className: string): string {
    return Widget.addClassPrefix(this.getName(), className);
  }

  public async scrollTo(options: { top?: number; left?: number }): Promise<void> {
    await this.element.evaluate(
      // eslint-disable-next-line no-underscore-dangle
      (element, offset) => $(element).data('dxPivotGrid')._dataArea._getScrollable().scrollTo(offset),
      options,
    );
  }

  public async scrollBy(options: { top?: number; left?: number }): Promise<void> {
    await this.element.evaluate(
      // eslint-disable-next-line no-underscore-dangle
      (element, offset) => $(element).data('dxPivotGrid')._dataArea._getScrollable().scrollBy(offset),
      options,
    );
  }

  public getColumnsAreaScrollLeft(): Promise<number> {
    return this.element.evaluate(
      // eslint-disable-next-line no-underscore-dangle
      (element) => $(element).data('dxPivotGrid')._columnsArea._getScrollable().scrollLeft(),
    );
  }

  public getRowsAreaScrollTop(): Promise<number> {
    return this.element.evaluate(
      // eslint-disable-next-line no-underscore-dangle
      (element) => $(element).data('dxPivotGrid')._rowsArea._getScrollable().scrollTop(),
    );
  }

  public getFieldChooserButton(): Locator {
    return this.element.locator(`.${CLASS.fieldChooserButton}`);
  }

  public getFieldChooserPopup(): Popup {
    return new Popup(this.page, this.element.locator(`.${CLASS.fieldChooserPopup}`));
  }

  public getFieldChooser(): FieldChooser {
    return new FieldChooser(
      this.page,
      this.getFieldChooserPopup().getWrapper().locator(`.${CLASS.fieldChooser}`),
    );
  }

  public getExportButton(): Locator {
    return this.element.locator(`.${CLASS.exportBtn}`);
  }

  public getColumnHeaderArea(): ColumnHeaderArea {
    return new ColumnHeaderArea(this.page, this.element);
  }

  public getFilterHeaderArea(): FilterHeaderArea {
    return new FilterHeaderArea(this.element);
  }

  public getRowHeaderArea(): RowHeaderArea {
    return new RowHeaderArea(this.element);
  }

  public getRowsArea(idx?: number): RowsArea {
    return new RowsArea(this.element, idx);
  }

  public getColumnsArea(idx?: number): ColumnsArea {
    return new ColumnsArea(this.element, idx);
  }

  public getDataHeaderArea(): DataHeaderArea {
    return new DataHeaderArea(this.element);
  }

  public getLoadPanel(): Overlay {
    return new Overlay(this.page.locator(`.${CLASS.loadPanel}`).first());
  }
}
