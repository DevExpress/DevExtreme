import messageLocalization from '@js/common/core/localization/message';
import devices from '@js/core/devices';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getOuterHeight } from '@js/core/utils/size';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import type Button from '@js/ui/button';
import type { EnterKeyEvent } from '@js/ui/text_area';
import type { Properties as ToolbarProperties } from '@js/ui/toolbar';
import Toolbar from '@js/ui/toolbar';
import type { OptionChanged } from '@ts/core/widget/types';
import type { SupportedKeys } from '@ts/core/widget/widget';
import { CHAT_MESSAGEBOX_BUTTON_CLASS } from '@ts/ui/chat/message_box/message_box';
import type { TextAreaProperties } from '@ts/ui/m_text_area';
import TextArea from '@ts/ui/m_text_area';

const TEXT_AREA_TOOLBAR = 'dx-textarea-toolbar';
const TEXT_AREA_WITH_TOOLBAR = 'dx-textarea-with-toolbar';

const isMobile = (): boolean => devices.current().deviceType !== 'desktop';

export type Properties = TextAreaProperties & {
  onSend?: (e: ClickEvent | EnterKeyEvent) => void;
};

class TextAreaOnSteroids extends TextArea<Properties> {
  _$toolbar?: dxElementWrapper | null;

  _toolbar?: Toolbar | null;

  _sendButton?: Button;

  /** KeyboardEvent should be replaced with EnterKeyEvent */
  _sendAction?: (e: Partial<ClickEvent | KeyboardEvent>) => void;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      stylingMode: 'outlined',
      placeholder: messageLocalization.format('dxChat-textareaPlaceholder'),
      autoResizeEnabled: true,
      valueChangeEvent: 'input',
      maxHeight: '8em',
    };
  }

  _supportedKeys(): SupportedKeys {
    return {
      ...super._supportedKeys(),
      enter: (e): void => {
        if (!e?.shiftKey && this._isValuableTextEntered() && !isMobile()) {
          e.preventDefault();
          this._processSendPress(e);
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

  _getToolbarItems(): ToolbarProperties['items'] {
    const items = [
      ...this._getDefaultBeforeToolbarItems() ?? [],
      ...this._getDefaultAfterToolbarItems() ?? [],
    ];

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return items;
  }

  _getDefaultBeforeToolbarItems(): ToolbarProperties['items'] {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.option();

    const items = [
      {
        widget: 'dxButton',
        location: 'before',
        options: {
          activeStateEnabled,
          focusStateEnabled,
          hoverStateEnabled,
          icon: 'attach',
          onClick: (): void => {
            // eslint-disable-next-line no-alert
            alert('FileUpploader integration');
          },
        },
      },
    ];

    return items;
  }

  _getDefaultAfterToolbarItems(): ToolbarProperties['items'] {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      /** Filter items if unavailable */
      // speechToTextEnabled,
      // attachmentsEnabled,
    } = this.option();

    const items = [
      {
        widget: 'dxSpeechToText',
        location: 'after',
        options: {
          activeStateEnabled,
          focusStateEnabled,
          hoverStateEnabled,
          stylingMode: 'text',
        },
      },
      {
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
            class: CHAT_MESSAGEBOX_BUTTON_CLASS,
            'aria-label': messageLocalization.format('dxChat-sendButtonAriaLabel'),
          },
          onClick: (e: ClickEvent): void => {
            this._processSendPress(e);
          },
          onInitialized: (e): void => {
            this._sendButton = e.component;
          },
        } as ButtonProperties,
      },
    ];

    return items;
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

  /** Trigger of onInput-action */
  _keyPressHandler(e: InputEvent): void {
    super._keyPressHandler(e);

    const shouldButtonBeDisabled = !this._isValuableTextEntered();
    this._toggleButtonDisableState(shouldButtonBeDisabled);
  }

  _processSendPress(e: ClickEvent | KeyboardEvent): void {
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

export default TextAreaOnSteroids;
