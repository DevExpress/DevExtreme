import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight } from '@js/core/utils/size';
import type { NativeEventInfo } from '@js/events';
import type {
  ClickEvent,
  InitializedEvent,
} from '@js/ui/button';
import type Button from '@js/ui/button';
import type { Properties as FileUploaderProperties } from '@js/ui/file_uploader';
import { current, isMaterial } from '@js/ui/themes';
import type { Item as ToolbarItem } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import type { TextAreaProperties } from '@ts/ui/m_text_area';
import TextArea from '@ts/ui/m_text_area';

const TEXT_AREA_TOOLBAR = 'dx-textarea-toolbar';
const TEXT_AREA_WITH_TOOLBAR = 'dx-textarea-with-toolbar';

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

type EnterKeyEvent = NativeEventInfo<ChatTextArea, KeyboardEvent>;

export type SendEvent = ClickEvent | EnterKeyEvent;

export type Properties = TextAreaProperties & {
  fileUploaderOptions?: FileUploaderProperties;

  onSend?: (e: SendEvent) => void;
};

class ChatTextArea extends TextArea<Properties> {
  _$toolbar?: dxElementWrapper | null;

  _toolbar?: Toolbar | null;

  _sendButton?: Button;

  _sendAction?: (e: SendEvent) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      stylingMode: 'outlined',
      placeholder: messageLocalization.format('dxChat-textareaPlaceholder'),
      autoResizeEnabled: true,
      valueChangeEvent: 'input',
      maxHeight: '8em',
      fileUploaderOptions: undefined,
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
    const rules = [
      ...super._defaultOptionsRules(),
      {
        device: (): boolean => isMaterial(current()),
        options: {
          stylingMode: 'outlined' as const,
        },
      },
    ];

    return rules;
  }

  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      enter: (e): void => {
        if (!e?.shiftKey && this._isValuableTextEntered() && !isMobile()) {
          e.preventDefault();
          this._processSendButtonActivation({
            component: this,
            element: this.element(),
            event: e,
          });
        }
      },
    };
  }

  _init(): void {
    super._init();

    this._createSendAction();
  }

  _createSendAction(): void {
    this._sendAction = this._createActionByOption(
      'onSend',
      { excludeValidators: ['disabled'] },
    );
  }

  _initMarkup(): void {
    this.$element().addClass(TEXT_AREA_WITH_TOOLBAR);
    super._initMarkup();
    this._renderToolbar();
  }

  _renderToolbar(): void {
    const toolbarItems = this._getToolbarItems();

    const toolbarOptions = {
      items: toolbarItems,
    };

    this._$toolbar = $('<div>')
      .addClass(TEXT_AREA_TOOLBAR)
      .appendTo(this.$element());

    this._toolbar = this._createComponent(
      this._$toolbar,
      Toolbar,
      toolbarOptions,
    );
  }

  _getToolbarItems(): ToolbarItem[] {
    const { fileUploaderOptions } = this.option();

    const items = [
      this._getSendButtonConfig(),
    ];

    if (fileUploaderOptions) {
      items.push(this._getFileUploaderButtonConfig());
    }

    return items;
  }

  _getFileUploaderButtonConfig(): ToolbarItem {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const configuration = {
      widget: 'dxButton',
      location: 'before',
      options: {
        activeStateEnabled,
        focusStateEnabled,
        hoverStateEnabled,
        icon: 'attach',
      },
    } as ToolbarItem;

    return configuration;
  }

  _getSendButtonConfig(): ToolbarItem {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const configuration = {
      widget: 'dxButton',
      location: 'after',
      options: {
        activeStateEnabled,
        focusStateEnabled,
        hoverStateEnabled,
        icon: 'arrowright',
        type: 'default',
        stylingMode: 'contained',
        disabled: true,
        elementAttr: {
          'aria-label': messageLocalization.format('dxChat-sendButtonAriaLabel'),
        },
        onClick: (e: ClickEvent): void => {
          this._processSendButtonActivation(e);
        },
        onInitialized: (e: InitializedEvent): void => {
          this._sendButton = e.component;
        },
      },
    } as ToolbarItem;

    return configuration;
  }

  _toggleButtonDisableState(state: boolean): void {
    this._sendButton?.option('disabled', state);
  }

  _renderButtonContainers(): void {}

  _getHeightDifference($input: dxElementWrapper): number {
    const superResult = super._getHeightDifference($input);
    const toolbarHeight = getOuterHeight(this._$toolbar);
    const sum: number = superResult + toolbarHeight;

    return sum;
  }

  _keyPressHandler(e: InputEvent): void {
    super._keyPressHandler(e);

    const shouldButtonBeDisabled = !this._isValuableTextEntered();
    this._toggleButtonDisableState(shouldButtonBeDisabled);
  }

  _processSendButtonActivation(e: SendEvent): void {
    this._sendAction?.(e);
    this.reset();
    this._toggleButtonDisableState(true);
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'hoverStateEnabled':
        this._sendButton?.option(name, value);
        break;

      case 'text': {
        const shouldButtonBeDisabled = !this._isValuableTextEntered();
        this._toggleButtonDisableState(shouldButtonBeDisabled);
        break;
      }

      case 'onSend':
        this._createSendAction();
        break;

      case 'fileUploaderOptions':
      default:
        super._optionChanged(args);
    }
  }

  _isValuableTextEntered(): boolean {
    const { text } = this.option();

    return Boolean(text?.trim());
  }

  isValuableTextEntered(): boolean {
    return this._isValuableTextEntered();
  }

  _dispose(): void {
    this._toolbar?.dispose();
    this._$toolbar?.remove();
    this._toolbar = null;
    this._$toolbar = null;
    super._dispose();
  }
}

export default ChatTextArea;
