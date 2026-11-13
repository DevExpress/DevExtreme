import type { ValidationStatus } from '@js/common';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DeferredObj } from '@js/core/utils/deferred';
import type Widget from '@ts/core/widget/widget';
import type { Column } from '@ts/grids/grid_core/columns_controller/types';
import type { RawItemData } from '@ts/grids/grid_core/data_source_adapter/types';
import type { EditingController } from '@ts/grids/grid_core/editing/editing';
import type {
  CellBasedEditingController,
  EditingChange, EditingColumn, EditorCellOptions,
  FormBasedEditingControllerExtension,
} from '@ts/grids/grid_core/editing/types';
import type { EditorFactory } from '@ts/grids/grid_core/editor_factory/editor_factory';
import type { RowKey } from '@ts/grids/grid_core/types';
import type { PositioningEvent } from '@ts/ui/overlay/overlay';
import type { ValidationResultInternal, ValidationRuleInternal } from '@ts/ui/validation_engine';
import type Validator from '@ts/ui/validator';
import type { ValidationAdapter } from '@ts/ui/validator';

import type { VALIDATION_CANCELLED } from './const';

export type BrokenRule = ValidationRuleInternal & {
  column?: Column;
  columnIndex?: number;
};

export interface CellValidationResultData extends ValidationResultInternal {
  brokenRules?: BrokenRule[] | null;
  deferred?: DeferredObj<unknown>;
  disabledPendingId?: string | null;
}

export type ValidatorResult = CellValidationResultData & { validator: Validator };

export type CellValidationResultValue = CellValidationResultData | typeof VALIDATION_CANCELLED;

export interface ValidationData {
  key: RowKey;
  isValid?: boolean;
  validated?: boolean;
  brokenRules?: BrokenRule[];
  errorText?: string;
  validationResults?: Record<number, CellValidationResultValue>;
  pageIndex?: number;
  rowIndex?: number;
}

export interface ValidationMessagePosition {
  collision: string;
  my: string;
  at: string;
  offset?: string;
}

export interface CellValidationParams {
  rowKey: RowKey;
  columnIndex: number;
}

export interface RowValidatingParams {
  brokenRules: BrokenRule[] | undefined;
  isValid: boolean | undefined;
  key: RowKey;
  newData: EditingChange['data'];
  oldData: RawItemData | undefined;
  promise: PromiseLike<void> | null;
  errorText: string;
}

export interface ValidatorDataGetterResult {
  data: RawItemData;
  column: EditingColumn & { index: number };
}

export type CellValidationAdapter = Required<Pick<ValidationAdapter, 'getValue' | 'applyValidationResults'>>;

export type ValidatingCellOptions = EditorCellOptions & {
  validationStatus?: ValidationStatus | typeof VALIDATION_CANCELLED;
};

export interface ValidatingEditingControllerExtension {
  getChangeByKey: (key: RowKey) => EditingChange | undefined;
  _showErrorRow: (change: EditingChange) => dxElementWrapper | undefined;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  shouldMoveInvalidRowsToPage(): boolean;
}

export type ValidatingEditingController = EditingController & ValidatingEditingControllerExtension;

export type ValidatingCellBasedEditingController = CellBasedEditingController
& FormBasedEditingControllerExtension
& ValidatingEditingControllerExtension;

export interface ValidatingEditorFactoryExtension {
  getOverlayBaseZIndex: () => number;
  getEditorInstance: ($container: dxElementWrapper) => Widget | undefined;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  overlayPositionedHandler(e: PositioningEvent, isOverlayVisible: boolean): void;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  getValidationMessageContainer($cell: dxElementWrapper): dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/method-signature-style -- overridden by methods
  getRevertButtonContainer($cell: dxElementWrapper): dxElementWrapper;
}

export type ValidatingEditorFactory = EditorFactory & ValidatingEditorFactoryExtension;
