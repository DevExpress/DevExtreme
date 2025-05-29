import $, { type dxElementWrapper } from '@js/core/renderer';
import messageLocalization from '@js/localization/message';

import { OptionsController } from '../options_controller/options_controller';

const ERROR_ROW_CLASS = 'dx-error-row';
const ERROR_MESSAGE_CLASS = 'dx-error-message';

interface RowError { url?: string; message?: string }

export class ErrorHandlingController {
  public static dependencies = [
    OptionsController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
  ) {}

  private _createErrorRow(error: RowError | string): dxElementWrapper {
    const errorAsRow = error as RowError;
    const message = errorAsRow.url ? errorAsRow?.message?.replace(errorAsRow?.url ?? '', '') : errorAsRow.message ?? (error as string);
    const $message = $('<div>')
      .attr('role', 'alert')
      .attr('aria-roledescription', messageLocalization.format('dxDataGrid-ariaError'))
      .addClass(ERROR_MESSAGE_CLASS)
      .text(message ?? '');

    if (errorAsRow.url) {
      $('<a>').attr('href', errorAsRow.url).text(errorAsRow.url).appendTo($message);
    }

    return $message;
  }

  public renderErrorRow(error: string, $popupContent?: dxElementWrapper): void {
    const popupContent = $popupContent ?? $('.dx-popup-content .dx-scrollable-content');

    if (!popupContent) {
      return;
    }

    popupContent.find(`.${ERROR_MESSAGE_CLASS}`).remove();
    const $errorMessageElement = this._createErrorRow(error);
    popupContent.prepend($errorMessageElement);
  }

  public removeErrorRow($row?: dxElementWrapper): void {
    const row = $row ?? $('.dx-error-row');

    if (row?.hasClass?.(ERROR_ROW_CLASS)) {
      row.remove();
    }
  }
}
