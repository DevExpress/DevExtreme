import type { GridBase } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type CardView from '@js/ui/card_view';
import { FilterBuilderModel } from '@ts/filter_builder/__tests__/__mock__/model/filter_builder';
import { PagerModel } from '@ts/pagination/__tests__/__mock__/model/pager';
import { LoadPanelModel } from '@ts/ui/__tests__/__mock__/model/load_panel';

import { DataCellModel } from './cell/data_cell';
import { HeaderCellModel } from './cell/header_cell';
import { ColumnChooserModel } from './column_chooser';
import { ConfirmationDialogModel } from './confirmation_dialog';
import { EditFormModel } from './edit_form';
import { FilterPanelModel } from './filter_panel';
import { DataRowModel } from './row/data_row';
import { GroupRowModel } from './row/group_row';

const SELECTORS = {
  headerRowClass: 'dx-header-row',
  dataRowClass: 'dx-data-row',
  groupRowClass: 'dx-group-row',
  scrollableContainer: 'dx-scrollable-container',
  loadPanel: 'dx-loadpanel',
  editForm: 'edit-form',
  headerCellIndicators: 'dx-column-indicators',
  headerCellFilter: 'dx-header-filter',
  revertButton: 'dx-revert-button',
};

export abstract class GridCoreModel<TInstance = GridBase | CardView> {
  protected abstract NAME: string;

  constructor(protected readonly root: HTMLElement) {}

  private getWidgetName(): string {
    return this.NAME.slice(2).toLowerCase();
  }

  protected getFilterPanelPrefix(): string {
    return this.getWidgetName();
  }

  public getHeaderCells(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.headerRowClass} > td`);
  }

  public getHeaderCell(columnIndex: number): HeaderCellModel {
    return new HeaderCellModel(this.getHeaderCells()[columnIndex], this.addWidgetPrefix.bind(this));
  }

  public getCellElement(rowIndex: number, columnIndex: number): HTMLElement {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}`)[rowIndex]?.querySelectorAll('td')[columnIndex] as HTMLElement;
  }

  public getGroupRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.groupRowClass}`);
  }

  public getGroupRow(rowIndex: number): GroupRowModel {
    return new GroupRowModel(this.getGroupRows()[rowIndex]);
  }

  public getHeaderByText(text: string): dxElementWrapper {
    return $(Array.from(this.getHeaderCells()).find((el) => $(el).text().includes(text)));
  }

  public getDataRows(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}`);
  }

  public getDataRow(rowIndex: number): DataRowModel {
    return new DataRowModel(this.getDataRows()[rowIndex]);
  }

  public getDataCells(rowIndex: number): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${SELECTORS.dataRowClass}:nth-child(${rowIndex + 1}) > td`);
  }

  public getDataCell(rowIndex: number, columnIndex: number): DataCellModel {
    return new DataCellModel(
      this.getDataCells(rowIndex)[columnIndex],
      this.addWidgetPrefix.bind(this),
    );
  }

  public getScrollableContainer(): HTMLElement {
    return this.root.querySelector(`.${SELECTORS.scrollableContainer}`) as HTMLElement;
  }

  public getRevertButton(): HTMLElement {
    return document.body.querySelector(`.${SELECTORS.revertButton}`) as HTMLElement;
  }

  public addWidgetPrefix(classNames: string): string {
    const widgetName = this.getWidgetName();
    return `dx-${widgetName}${classNames ? `-${classNames}` : ''}`;
  }

  public getLoadPanel(): LoadPanelModel {
    return new LoadPanelModel(document.body.querySelector(`.${SELECTORS.loadPanel}`));
  }

  public getEditForm(): EditFormModel {
    return new EditFormModel(this.root.querySelector(`.${this.addWidgetPrefix(SELECTORS.editForm)}`));
  }

  public getColumnChooser(): ColumnChooserModel {
    return new ColumnChooserModel(this.getWidgetName());
  }

  public getFilterPanel(): FilterPanelModel {
    return new FilterPanelModel(this.root, this.getFilterPanelPrefix());
  }

  public getFilterBuilder(): FilterBuilderModel {
    return new FilterBuilderModel();
  }

  public getPager(): PagerModel {
    return new PagerModel(this.root);
  }

  public getConfirmationDialog(): ConfirmationDialogModel {
    return new ConfirmationDialogModel();
  }

  public apiOption(name: string): unknown;
  public apiOption(name: string, value: unknown): void;
  public apiOption(name: string, value?: unknown): unknown {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const instance = this.getInstance() as any;

    if (arguments.length === 1) {
      return instance.option(name);
    }

    instance.option(name, value);
    return undefined;
  }

  public getHeaderCellFilter(columnIndex: number): dxElementWrapper {
    const $headerCell = $(this.getHeaderCells()[columnIndex]);
    const headerFilterSelector = `.${SELECTORS.headerCellIndicators} > .${SELECTORS.headerCellFilter}`;

    return $headerCell.find(headerFilterSelector);
  }

  public abstract getInstance(): TInstance;
}
