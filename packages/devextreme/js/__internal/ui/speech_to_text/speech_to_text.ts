import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import { extend } from '@js/core/utils/extend';
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
  private _button!: Button;

  private _state!: SpeechToTextState;

  private _actions!: SpeechToTextActions;

  _getDefaultOptions(): SpeechToTextProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return extend(super._getDefaultOptions(), {
      stylingMode: 'contained',
      type: 'default',
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
    });
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
    this._button = this._createComponent<Button, ButtonProperties>(
      this.$element(),
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
        this._buttonClickHandler(e);
      },
    };
  }

  private _getCurrentIcon(): string | undefined {
    const { startIcon, stopIcon } = this.option();

    return this._state === SpeechToTextState.LISTENING
      ? stopIcon
      : startIcon;
  }

  private _getCurrentText(): string {
    const { startText, stopText } = this.option();

    return this._state === SpeechToTextState.LISTENING
      ? stopText ?? ''
      : startText ?? '';
  }

  private _buttonClickHandler(e: ClickEvent): void {
    if (this._state === SpeechToTextState.DISABLED) {
      return;
    }

    if (this._state === SpeechToTextState.LISTENING) {
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
      element: this.$element().get(0) as HTMLElement,
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
      element: this.$element().get(0) as HTMLElement,
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
    if (!this._button) {
      return;
    }

    this._button.option({
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
      case 'disabled':
      case 'width':
      case 'height':
        this._button?.option(name, value);
        if (name === 'disabled') {
          this._setState(value ? SpeechToTextState.DISABLED : SpeechToTextState.INITIAL);
        }
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
      case 'onError': {
        this._setAction(name);
        break;
      }
      default:
        super._optionChanged(args);
    }
  }

  private _handleCustomEngineState(): void {
    const { customSpeechRecognizer } = this.option();
    const { enabled, isListening: isListeningState } = customSpeechRecognizer ?? {};

    const isListening = enabled && isListeningState !== undefined ? isListeningState : false;
    const targetState = isListening ? SpeechToTextState.LISTENING : SpeechToTextState.INITIAL;

    debugger;

    this._setState(targetState);
  }

  private _isListening(): boolean {
    return this._state === SpeechToTextState.LISTENING;
  }

  _clean(): void {
    this._setState(SpeechToTextState.INITIAL);
    super._clean();
  }

  _dispose(): void {
    this._actions = {};
    super._dispose();
  }
}

registerComponent('dxSpeechToText', SpeechToText);

export default SpeechToText;
