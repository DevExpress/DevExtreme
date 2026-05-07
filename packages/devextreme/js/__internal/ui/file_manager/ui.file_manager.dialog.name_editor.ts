/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import $, { type dxElementWrapper } from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import TextBox from '@js/ui/text_box';
import FileManagerDialogBase from '@ts/ui/file_manager/ui.file_manager.dialog';

const FILE_MANAGER_DIALOG_NAME_EDITOR = 'dx-filemanager-dialog-name-editor';
const FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP = 'dx-filemanager-dialog-name-editor-popup';

class FileManagerNameEditorDialog extends FileManagerDialogBase {
  _nameTextBox?: TextBox;

  _initialNameValue?: string;

  _hasCompositionJustEnded?: boolean;

  // @ts-expect-error ts-error
  show(name: string): void {
    // eslint-disable-next-line no-param-reassign
    name = name || '';

    if (this._nameTextBox) {
      this._nameTextBox.option('value', name);
    } else {
      this._initialNameValue = name;
    }

    super.show();
  }

  _onPopupShown(): void {
    if (!this._nameTextBox) {
      return;
    }
    // @ts-expect-error ts-error
    const $textBoxInput = this._nameTextBox._input();
    if ($textBoxInput.length) {
      $textBoxInput[0].select();
    }
    this._nameTextBox.focus();
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDialogOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDialogOptions(), {
      title: this.option('title'),
      buttonText: this.option('buttonText'),
      contentCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR,
      popupCssClass: FILE_MANAGER_DIALOG_NAME_EDITOR_POPUP,
    });
  }

  _createContentTemplate(element: dxElementWrapper): void {
    super._createContentTemplate(element);

    // @ts-expect-error ts-error
    this._nameTextBox = this._createComponent($('<div>'), TextBox, {
      value: this._initialNameValue,
      onEnterKey: () => this._hasCompositionJustEnded && this._applyDialogChanges(),
      onKeyDown: (e) => this._checkCompositionEnded(e),
    });

    this._$contentElement?.append($(this._nameTextBox?.$element()));
  }

  _checkCompositionEnded({ event }): void {
    this._hasCompositionJustEnded = event.which !== 229;
  }

  // @ts-expect-error ts-error
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDialogResult() {
    const { value } = this._nameTextBox?.option() ?? {};
    return value ? { name: value } : null;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDefaultOptions() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      title: '',
      buttonText: '',
    });
  }
}

export default FileManagerNameEditorDialog;
