import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import GridCore, { CLASS as CLASS_BASE } from '../gridCore';
import DataRow from './data/row';
import DataCell from './data/cell';
import FilterCell from './filter/cell';
import EditForm from './editForm';
import Headers from './headers';
import HeaderPanel from './headers/panel';
import AdaptiveDetailRow from './adaptiveDetailRow';

export const CLASS = {
  ...CLASS_BASE,
  headers: 'headers',
  headerPanel: 'header-panel',
  dataRow: 'dx-data-row',
  fixedGridView: 'content-fixed',
  editFormRow: 'edit-form',
  button: 'dx-button',
  formButtonsContainer: 'form-buttons-container',
  popupEdit: 'edit-popup',
  adaptiveDetailRow: 'dx-adaptive-detail-row',
  errorRow: 'dx-error-row',
  overlayContent: 'dx-overlay-content',
  revertTooltip: 'revert-tooltip',
  invalidMessage: 'invalid-message',
  toolbar: 'dx-toolbar',
  dialogWrapper: 'dx-dialog-wrapper',
};

const E2E_ATTRIBUTES = {
  a11yStatusContainer: 'e2e-a11y-general-status-container',
};

export default class DataGrid extends GridCore {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxDataGrid'; }

  public getHeaders(): Headers {
    return new Headers(this.element.locator(`.${this.addWidgetPrefix(CLASS.headers)}`), this.getName());
  }

  public getDataRow(index: number): DataRow {
    return new DataRow(
      this.element.locator(`.${CLASS.dataRow}[aria-rowindex='${index + 1}']`),
      this.getName(),
    );
  }

  public getFixedDataRow(index: number): DataRow {
    return new DataRow(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.fixedGridView)} .${CLASS.dataRow}[aria-rowindex='${index + 1}']`),
      this.getName(),
    );
  }

  public getDataCell(rowIndex: number, columnIndex: number): DataCell {
    return this.getDataRow(rowIndex).getDataCell(columnIndex);
  }

  public getFixedDataCell(rowIndex: number, columnIndex: number): DataCell {
    return this.getFixedDataRow(rowIndex).getDataCell(columnIndex);
  }

  public getAdaptiveRow(index: number): AdaptiveDetailRow {
    return new AdaptiveDetailRow(this.element.locator(`.${CLASS.adaptiveDetailRow}`).nth(index));
  }

  public getErrorRow(): Locator {
    return this.element.locator(`.${CLASS.errorRow}`);
  }

  public getFilterCell(columnIndex: number): FilterCell {
    return this.getHeaders().getFilterRow().getFilterCell(columnIndex);
  }

  public getFilterEditor<T>(
    columnIndex: number,
    EditorType: new (page: Page, element: Locator) => T,
  ): T {
    return this.getFilterCell(columnIndex).getEditor<T>(EditorType);
  }

  public getDialog(): Locator {
    return this.body.locator(`.${CLASS.dialogWrapper}`);
  }

  public getRevertTooltip(): Locator {
    return this.body.locator(`.${this.addWidgetPrefix(CLASS.revertTooltip)}`);
  }

  public getInvalidMessageTooltip(): Locator {
    return this.body.locator(`.dx-${CLASS.invalidMessage}.dx-${CLASS.invalidMessage}-always.${this.addWidgetPrefix(CLASS.invalidMessage)}`);
  }

  public getEditForm(): EditForm {
    const element = this.element.locator(`.${this.addWidgetPrefix(CLASS.editFormRow)}`);
    const buttons = element.locator(`.${this.addWidgetPrefix(CLASS.formButtonsContainer)} .${CLASS.button}`);

    return new EditForm(element, buttons);
  }

  public getPopupEditForm(): EditForm {
    const element = this.page.locator(`.${this.addWidgetPrefix(CLASS.popupEdit)} .${CLASS.overlayContent}`);
    const buttons = element.locator(`.${CLASS.toolbar} .${CLASS.button}`);

    return new EditForm(element, buttons);
  }

  public getHeaderPanel(): HeaderPanel {
    return new HeaderPanel(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.headerPanel)}`),
      this.getName(),
    );
  }

  public getGeneralStatusContainer(): Locator {
    return this.element.locator(`[${E2E_ATTRIBUTES.a11yStatusContainer}="true"]`);
  }

  public async apiEditRow(rowIndex: number): Promise<void> {
    await this.invoke('editRow', rowIndex);
  }

  public async apiDeleteRow(rowIndex: number): Promise<void> {
    await this.invoke('deleteRow', rowIndex);
  }

  public async apiExpandAdaptiveDetailRow(key: unknown): Promise<void> {
    await this.invoke('expandAdaptiveDetailRow', key);
  }

  public async apiSaveEditData(): Promise<void> {
    await this.invoke('saveEditData');
  }

  public async apiEditCell(rowIndex: number, columnIndex: number): Promise<void> {
    await this.invoke('editCell', rowIndex, columnIndex);
  }

  public async apiCellValue<T>(rowIndex: number, columnIndex: number, value: T): Promise<void> {
    await this.invoke('cellValue', rowIndex, columnIndex, value);
  }
}
