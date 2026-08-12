import $ from '@js/core/renderer';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import {
  INVALIDATE_CLASS,
  VALIDATION_STATUS,
  validationResultIsValid,
} from '../m_validating';

interface ValidatingControllerReader {
  getCellValidationResult: (options: { rowKey: unknown; columnIndex: number }) => unknown;
  _getValidationData: (key: unknown) => { isValid?: boolean } | undefined;
}

export const data = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class ValidatingDataControllerExtender extends Base {
  protected _validatingController!: ValidatingControllerReader;

  public init(): void {
    this._validatingController = this.getController('validating');
    super.init();
  }

  private _getValidationStatus(validationResult): string {
    const validationStatus = validationResultIsValid(validationResult)
      ? validationResult.status
      : validationResult;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return validationStatus ?? VALIDATION_STATUS.valid;
  }

  protected _isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate): boolean {
    const cell = oldRow.cells?.[columnIndex];
    const oldValidationStatus = this._getValidationStatus({ status: cell?.validationStatus });
    const validationResult = this._validatingController.getCellValidationResult({
      rowKey: oldRow.key,
      columnIndex,
    });
    const validationData = this._validatingController._getValidationData(oldRow.key);
    const newValidationStatus = this._getValidationStatus(validationResult);
    const rowIsModified = JSON.stringify(newRow.modifiedValues)
      !== JSON.stringify(oldRow.modifiedValues);
    const validationStatusChanged = oldValidationStatus !== newValidationStatus && rowIsModified;
    const cellIsMarkedAsInvalid = $(cell?.cellElement)
      .hasClass(this.addWidgetPrefix(INVALIDATE_CLASS));
    const hasValidationRules = cell?.column.validationRules?.length;
    const rowEditStateChanged = oldRow.isEditing !== newRow.isEditing && hasValidationRules;
    const cellValidationStateChanged = validationStatusChanged
      || (validationData?.isValid && cellIsMarkedAsInvalid);

    if (rowEditStateChanged || cellValidationStateChanged) {
      return true;
    }

    return super._isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate);
  }
};
