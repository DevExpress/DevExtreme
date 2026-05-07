import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { ToolbarItem } from '@js/ui/popup';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type { PopupProperties } from '@ts/ui/popup/m_popup';
import Popup from '@ts/ui/popup/m_popup';

interface Properties extends PopupProperties {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  command?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onGetContent?: (e: any) => dxElementWrapper;
}

class DiagramDialog extends Widget<Properties> {
  private _popup?: Popup;

  private _$popupElement!: dxElementWrapper;

  private _isShown!: boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onGetContentAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onHiddenAction?: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _command: any;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _commandParameter: any;

  _init(): void {
    super._init();
    this._command = undefined;
    this._isShown = false;
    this._createOnGetContentOption();
    this._createOnHiddenOption();
  }

  _initMarkup(): void {
    super._initMarkup();

    const {
      command,
      title,
      maxWidth,
      height,
      toolbarItems,
    } = this.option();

    this._command = command;

    this._$popupElement = $('<div>').appendTo(this.$element());
    this._popup = this._createComponent(this._$popupElement, Popup, {
      title,
      maxWidth,
      height,
      toolbarItems,
      onHidden: this._onHiddenAction,
    });
  }

  _clean(): void {
    delete this._popup;
    this._$popupElement?.remove();
  }

  _getDefaultOptions(): Properties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      title: '',
      maxWidth: 500,
      height: 'auto',
      toolbarItems: this._getToolbarItems(),
    });
  }

  _getToolbarItems(): ToolbarItem[] {
    return [this._getOkToolbarItem(), this._getCancelToolbarItem()];
  }

  _getOkToolbarItem(): ToolbarItem {
    return {
      widget: 'dxButton',
      location: 'after',
      toolbar: 'bottom',
      options: {
        text: messageLocalization.format('dxDiagram-dialogButtonOK'),
        onClick: (): void => {
          this._command.execute(this._commandParameter);
          this._hide();
        },
      },
    };
  }

  _getCancelToolbarItem(): ToolbarItem {
    return {
      widget: 'dxButton',
      location: 'after',
      toolbar: 'bottom',
      options: {
        text: messageLocalization.format('dxDiagram-dialogButtonCancel'),
        onClick: this._hide.bind(this),
      },
    };
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    switch (args.name) {
      case 'title':
      case 'maxWidth':
      case 'height':
      case 'toolbarItems':
        this._popup?.option(args.name, args.value);
        break;
      case 'command':
        this._command = args.value;
        break;
      case 'onGetContent':
        this._createOnGetContentOption();
        break;
      case 'onHidden':
        this._createOnHiddenOption();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _createOnGetContentOption(): void {
    this._onGetContentAction = this._createActionByOption('onGetContent');
  }

  _createOnHiddenOption(): void {
    this._onHiddenAction = this._createActionByOption('onHidden');
  }

  _hide(): void {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup?.hide();
    this._isShown = false;
  }

  _show(): void {
    this._popup?.$content()?.empty().append(this._onGetContentAction());
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this._popup?.show();
    this._isShown = true;
  }

  isVisible(): boolean {
    return this._isShown;
  }
}

export default DiagramDialog;
