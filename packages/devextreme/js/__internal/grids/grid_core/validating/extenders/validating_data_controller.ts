import $ from '@js/core/renderer';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { Cell, ProcessedItem } from '@ts/grids/grid_core/data_controller/types';
import type { ModuleType } from '@ts/grids/grid_core/m_types';

import type { CellValidationResult, ValidationStatus } from '../const';
import {
  INVALIDATE_CLASS,
  VALIDATION_STATUS,
  validationResultIsValid,
} from '../const';

type ValidationResult = CellValidationResult | string | undefined;

interface ValidationData {
  isValid?: boolean;
}

type ValidatedCell = Cell & {
  validationStatus?: ValidationStatus;
  cellElement?: Element;
};

interface ValidatingControllerReader {
  getCellValidationResult: (options: { rowKey: unknown; columnIndex: number }) => ValidationResult;
  getValidationData: (key: unknown) => ValidationData | undefined;
}

export const validatingDataControllerExtender = (
  Base: ModuleType<DataController>,
): ModuleType<DataController> => class ValidatingDataControllerExtender extends Base {
  protected _validatingController!: ValidatingControllerReader;

  public init(): void {
    this._validatingController = this.getController('validating');
    super.init();
  }

  private _getValidationStatus(validationResult: ValidationResult): string {
    if (!validationResultIsValid(validationResult)) {
      return validationResult ?? VALIDATION_STATUS.valid;
    }

    return validationResult.status ?? VALIDATION_STATUS.valid;
  }

  private _isRowEditStateChanged(
    oldRow: ProcessedItem,
    newRow: ProcessedItem,
    columnIndex: number,
  ): boolean {
    const cell = oldRow.cells?.[columnIndex];
    const hasValidationRules = !!cell?.column?.validationRules?.length;

    return oldRow.isEditing !== newRow.isEditing && hasValidationRules;
  }

  private _isCellValidationStateChanged(
    oldRow: ProcessedItem,
    newRow: ProcessedItem,
    columnIndex: number,
  ): boolean {
    const cell = oldRow.cells?.[columnIndex] as ValidatedCell | undefined;

    const oldValidationStatus = this._getValidationStatus({ status: cell?.validationStatus });
    const newValidationStatus = this._getValidationStatus(
      this._validatingController.getCellValidationResult({ rowKey: oldRow.key, columnIndex }),
    );
    const rowIsModified = JSON.stringify(newRow.modifiedValues)
      !== JSON.stringify(oldRow.modifiedValues);
    const validationStatusChanged = oldValidationStatus !== newValidationStatus && rowIsModified;

    if (validationStatusChanged) {
      return true;
    }

    const validationData = this._validatingController.getValidationData(oldRow.key);
    const cellIsMarkedAsInvalid = $(cell?.cellElement)
      .hasClass(this.addWidgetPrefix(INVALIDATE_CLASS));

    return !!validationData?.isValid && cellIsMarkedAsInvalid;
  }

  protected _isCellChanged(
    oldRow: ProcessedItem,
    newRow: ProcessedItem,
    visibleRowIndex: number,
    columnIndex: number,
    isLiveUpdate?: boolean,
  ): boolean {
    const rowEditStateChanged = this._isRowEditStateChanged(oldRow, newRow, columnIndex);
    const cellValidationStateChanged = this._isCellValidationStateChanged(
      oldRow,
      newRow,
      columnIndex,
    );

    if (rowEditStateChanged || cellValidationStateChanged) {
      return true;
    }

    return super._isCellChanged(oldRow, newRow, visibleRowIndex, columnIndex, isLiveUpdate);
  }
};
