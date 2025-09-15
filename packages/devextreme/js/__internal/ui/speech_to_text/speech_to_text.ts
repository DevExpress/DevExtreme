import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { noop } from '@js/core/utils/common';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type {
  SpeechToTextActions,
  SpeechToTextProperties,
} from '@ts/ui/speech_to_text/types/index';
import { SpeechToTextState } from '@ts/ui/speech_to_text/types/index';

export const SPEECH_TO_TEXT_CLASS = 'dx-speech-to-text';
export const SPEECH_TO_TEXT_LISTENING_CLASS = 'dx-speech-to-text-listening';

const DEFAULT_INITIAL_ICON = 'micoutline';
const DEFAULT_LISTENING_ICON = 'stopfilled';

const ACTIONS: (keyof SpeechToTextActions)[] = [
  'onStartClick',
  'onStopClick',
  'onResult',
  'onError',
];

class SpeechToText extends Widget<SpeechToTextProperties> {
  private _button?: Button;

  private _state!: SpeechToTextState;

  private _actions!: SpeechToTextActions;

  _getDefaultOptions(): SpeechToTextProperties {
    return {
      ...super._getDefaultOptions(),
      startIcon: DEFAULT_INITIAL_ICON,
      stopIcon: DEFAULT_LISTENING_ICON,
      startText: '',
      stopText: '',
      customSpeechRecognizer: {
        enabled: false,
        isListening: false,
      },
      onStartClick: undefined,
      onStopClick: undefined,
      onResult: undefined,
      onError: undefined,
    };
  }

  _init(): void {
    this._actions = {};
    super._init();
    this._handleCustomEngineState();
    this._createActions();
  }

  _initMarkup(): void {
    super._initMarkup();
    this.$element().addClass(SPEECH_TO_TEXT_CLASS);
    this._renderButton();
    this._updateButtonState();
  }

  private _createActions(): void {
    ACTIONS.forEach((action) => {
      this._setAction(action);
    });
  }

  private _setAction(action: keyof SpeechToTextActions): void {
    this._actions[action] = this._createActionByOption(action, {
      excludeValidators: ['disabled', 'readOnly'],
    }) || noop;
  }

  private _renderButton(): void {
    const $buttonElement = $('<div>').appendTo(this.$element());
    this._button = this._createComponent<Button, ButtonProperties>(
      $buttonElement,
      Button,
      this._getButtonOptions(),
    );
  }

  private _getButtonOptions(): ButtonProperties {
    const {
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      stylingMode,
      type,
      disabled,
      width,
      height,
    } = this.option();

    return {
      stylingMode,
      type,
      disabled,
      width,
      height,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
      icon: this._getCurrentIcon(),
      text: this._getCurrentText(),
      onClick: (e: ClickEvent): void => {
        this._handleButtonClick(e);
      },
    };
  }

  private _getCurrentIcon(): string | undefined {
    const { startIcon, stopIcon } = this.option();

    return this._isListening() ? stopIcon : startIcon;
  }

  private _getCurrentText(): string {
    const { startText, stopText } = this.option();

    return this._isListening()
      ? stopText ?? ''
      : startText ?? '';
  }

  private _handleButtonClick(e: ClickEvent): void {
    if (this._state === SpeechToTextState.DISABLED) {
      return;
    }

    if (this._isListening()) {
      this._handleStopClick(e);
    } else {
      this._handleStartClick(e);
    }
  }

  private _handleStartClick(e: ClickEvent): void {
    const { customSpeechRecognizer } = this.option();

    if (!customSpeechRecognizer?.enabled) {
      this._setState(SpeechToTextState.LISTENING);
    }

    this._actions.onStartClick?.({
      component: this,
      element: this.element(),
      event: e.event,
    });
  }

  private _handleStopClick(e: ClickEvent): void {
    const { customSpeechRecognizer } = this.option();

    if (!customSpeechRecognizer?.enabled) {
      this._setState(SpeechToTextState.INITIAL);
    }

    this._actions.onStopClick?.({
      component: this,
      element: this.element(),
      event: e.event,
    });
  }

  private _setState(newState: SpeechToTextState): void {
    if (this._state === newState) {
      return;
    }

    this._state = newState;
    this._updateButtonState();
    this._updateCssClasses();
  }

  private _updateButtonState(): void {
    this._button?.option({
      icon: this._getCurrentIcon(),
      text: this._getCurrentText(),
    });
  }

  private _updateCssClasses(): void {
    this.$element().toggleClass(SPEECH_TO_TEXT_LISTENING_CLASS, this._isListening());
  }

  _optionChanged(args: OptionChanged<SpeechToTextProperties>): void {
    const { name, value } = args;

    switch (name) {
      case 'customSpeechRecognizer':
        this._handleCustomEngineState();
        break;

      case 'stylingMode':
      case 'type':
      case 'width':
      case 'height':
        this._button?.option(name, value);
        break;

      case 'disabled':
        this._button?.option(name, value);
        this._setState(value ? SpeechToTextState.DISABLED : SpeechToTextState.INITIAL);
        break;

      case 'startIcon':
      case 'stopIcon':
      case 'startText':
      case 'stopText':
        this._updateButtonState();
        break;

      case 'onStartClick':
      case 'onStopClick':
      case 'onResult':
      case 'onError':
        this._setAction(name);
        break;

      default:
        super._optionChanged(args);
    }
  }

  private _handleCustomEngineState(): void {
    const { customSpeechRecognizer } = this.option();
    const { enabled, isListening: isListeningState } = customSpeechRecognizer ?? {};

    const isListening = enabled && isListeningState !== undefined ? isListeningState : false;
    const targetState = isListening ? SpeechToTextState.LISTENING : SpeechToTextState.INITIAL;

    this._setState(targetState);
  }

  private _isListening(): boolean {
    return this._state === SpeechToTextState.LISTENING;
  }

  _cleanButton(): void {
    this._button?.dispose();
    this._button = undefined;
  }

  _clean(): void {
    this._cleanButton();
    this._setState(SpeechToTextState.INITIAL);
    this.dispose();
    super._clean();
  }

  _dispose(): void {
    this._actions = {};
    super._dispose();
  }
}

registerComponent('dxSpeechToText', SpeechToText);

export default SpeechToText;
