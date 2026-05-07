/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { isDefined } from '@js/core/utils/type';
import Popup from '@js/ui/popup/ui.popup';
import type { OptionChanged } from '@ts/core/widget/types';
import type { WidgetProperties } from '@ts/core/widget/widget';
import Widget from '@ts/core/widget/widget';

const FILE_MANAGER_DIALOG_CONTENT = 'dx-filemanager-dialog';
const FILE_MANAGER_DIALOG_POPUP = 'dx-filemanager-dialog-popup';

export interface DialogOptions {
  title?: string;
  buttonText?: string;
  contentCssClass?: string;
  popupCssClass?: string;
  height?: number | string;
  maxHeight?: number | string;
}

interface FileManagerDialogBaseOptions extends WidgetProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClosed?: ((args: any) => void);
}

class FileManagerDialogBase extends Widget<FileManagerDialogBaseOptions> {
  _popup?: Popup;

  _$contentElement!: dxElementWrapper;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _dialogResult?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _onClosedAction?: (e: any) => void;

  _initMarkup(): void {
    super._initMarkup();

    this._createOnClosedAction();

    const options = this._getDialogOptions();

    const $popup = $('<div>').appendTo(this.$element());

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const popupOptions: any = {
      showTitle: true,
      title: options.title,
      visible: false,
      hideOnOutsideClick: true,
      contentTemplate: this._createContentTemplate.bind(this),
      toolbarItems: [
        {
          widget: 'dxButton',
          toolbar: 'bottom',
          location: 'after',
          options: {
            text: options.buttonText,
            onClick: this._applyDialogChanges.bind(this),
          },
        },
        {
          widget: 'dxButton',
          toolbar: 'bottom',
          location: 'after',
          options: {
            text: messageLocalization.format(
              'dxFileManager-dialogButtonCancel',
            ),
            onClick: this._closeDialog.bind(this),
          },
        },
      ],
      onInitialized: ({ component }): void => {
        component.registerKeyHandler(
          'enter',
          this._applyDialogChanges.bind(this),
        );
      },
      onHiding: this._onPopupHiding.bind(this),
      onShown: this._onPopupShown.bind(this),
      _wrapperClassExternal: `${FILE_MANAGER_DIALOG_POPUP} ${
        options.popupCssClass ?? ''
      }`,
    };
    if (isDefined(options.height)) {
      popupOptions.height = options.height;
    }
    if (isDefined(options.maxHeight)) {
      popupOptions.maxHeight = options.maxHeight;
    }

    this._popup = this._createComponent($popup, Popup, popupOptions);
  }

  show(): void {
    this._dialogResult = null;
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup?.show();
  }

  _getDialogOptions(): DialogOptions {
    return {
      title: 'Title',
      buttonText: 'ButtonText',
      contentCssClass: '',
      popupCssClass: '',
    };
  }

  _createContentTemplate(element: dxElementWrapper): void {
    this._$contentElement = $('<div>')
      .appendTo(element)
      .addClass(FILE_MANAGER_DIALOG_CONTENT);

    const cssClass = this._getDialogOptions().contentCssClass;
    if (cssClass) {
      this._$contentElement.addClass(cssClass);
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  _getDialogResult() {
    return null;
  }

  _applyDialogChanges(): void {
    const result = this._getDialogResult();
    if (result) {
      this._dialogResult = result;
      this._closeDialog();
    }
  }

  _closeDialog(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup?.hide();
  }

  _onPopupHiding(): void {
    this._onClosedAction?.({ dialogResult: this._dialogResult });
  }

  _onPopupShown(): void {}

  _createOnClosedAction(): void {
    this._onClosedAction = this._createActionByOption('onClosed');
  }

  _setTitle(newTitle: string): void {
    this._popup?.option('title', newTitle);
  }

  _setApplyButtonOptions(options): void {
    this._popup?.option('toolbarItems[0].options', options);
  }

  _getDefaultOptions(): FileManagerDialogBaseOptions {
    return {
      ...super._getDefaultOptions(),
      onClosed: undefined,
    };
  }

  _optionChanged(args: OptionChanged<FileManagerDialogBaseOptions>): void {
    const { name } = args;

    switch (name) {
      case 'onClosed':
        this._createOnClosedAction();
        break;
      default:
        super._optionChanged(args);
    }
  }
}

export default FileManagerDialogBase;
