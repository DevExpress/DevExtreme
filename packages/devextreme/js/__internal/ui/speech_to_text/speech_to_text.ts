import registerComponent from '@js/core/component_registrator';
import { noop } from '@js/core/utils/common';
import type { DxEvent } from '@js/events';
import type { ClickEvent, Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type {
  Properties as SpeechToTextProperties,
} from '@js/ui/speech_to_text';
import { SpeechRecognitionAdapter } from '@ts/core/speech_recognition_adapter';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';

export const SPEECH_TO_TEXT_CLASS = 'dx-speech-to-text';
export const SPEECH_TO_TEXT_LISTENING_CLASS = 'dx-speech-to-text-listening';

const DEFAULT_INITIAL_ICON = 'micoutline';
const DEFAULT_LISTENING_ICON = 'stopfilled';

enum SpeechToTextState {
  INITIAL = 'initial',
  LISTENING = 'listening',
  DISABLED = 'disabled',
}

type SpeechToTextActions = Pick<SpeechToTextProperties, 'onStartClick' | 'onStopClick' | 'onResult' | 'onError'>;
type PointerLikeEvent = KeyboardEvent | MouseEvent | PointerEvent | TouchEvent;

const ACTIONS: (keyof SpeechToTextActions)[] = [
  'onStartClick',
  'onStopClick',
  'onResult',
  'onError',
];

class SpeechToText extends Widget<SpeechToTextProperties> {
  private _button?: Button;

  private _speechRecognitionAdapter?: SpeechRecognitionAdapter | null;

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

  _initSpeechRecognitionAdapter(): void {
    const { speechRecognitionConfig = {} } = this.option();

    if (this._isCustomSpeechRecognitionEnabled()) {
      return;
    }

    this._speechRecognitionAdapter = new SpeechRecognitionAdapter(speechRecognitionConfig, {
      onEnd: this._handleSpeechRecognitionEnd.bind(this),
      onResult: this._handleSpeechRecognitionResult.bind(this),
      onError: this._handleSpeechRecognitionError.bind(this),
    });
  }

  _isCustomSpeechRecognitionEnabled(): boolean {
    const { customSpeechRecognizer } = this.option();

    return Boolean(customSpeechRecognizer?.enabled);
  }

  _init(): void {
    this._actions = {};
    super._init();
    this._handleCustomEngineState();
    this._createActions();
    this._initSpeechRecognitionAdapter();
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
      hint,
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
      hint,
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

  private _emitNativeEvent<K extends keyof Pick<SpeechToTextActions, 'onResult' | 'onError'>>(name: K, event: Event): void {
    this._actions[name]?.({ component: this, element: this.element(), event });
  }

  private _emitDxEvent<K extends keyof Pick<SpeechToTextActions, 'onStartClick' | 'onStopClick'>>(name: K, event?: DxEvent<PointerLikeEvent>): void {
    this._actions[name]?.({ component: this, element: this.element(), event });
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
    if (!this._isCustomSpeechRecognitionEnabled()) {
      this._setState(SpeechToTextState.LISTENING);

      this._speechRecognitionAdapter?.start();
    }

    this._emitDxEvent('onStartClick', e.event);
  }

  private _handleStopClick(e: ClickEvent): void {
    if (!this._isCustomSpeechRecognitionEnabled()) {
      this._setState(SpeechToTextState.INITIAL);

      this._speechRecognitionAdapter?.stop();
    }

    this._emitDxEvent('onStopClick', e.event);
  }

  private _handleSpeechRecognitionEnd(): void {
    if (this._state !== SpeechToTextState.DISABLED && !this._isCustomSpeechRecognitionEnabled()) {
      this._setState(SpeechToTextState.INITIAL);
    }
  }

  private _handleSpeechRecognitionResult(event: Event): void {
    this._emitNativeEvent('onResult', event);
  }

  private _handleSpeechRecognitionError(event: Event): void {
    this._emitNativeEvent('onError', event);
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

      case 'speechRecognitionConfig':
        this._speechRecognitionAdapter?.applyConfig(value);
        break;

      case 'stylingMode':
      case 'type':
      case 'width':
      case 'height':
      case 'hint':
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
    super._clean();
  }

  _dispose(): void {
    this._actions = {};
    this._speechRecognitionAdapter?.dispose();
    this._speechRecognitionAdapter = null;
    super._dispose();
  }
}

registerComponent('dxSpeechToText', SpeechToText);

export default SpeechToText;
