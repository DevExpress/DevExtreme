import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import devices from '@js/core/devices';
import type { DefaultOptionsRule } from '@js/core/options/utils';
import { noop } from '@js/core/utils/common';
import type { DxEvent } from '@js/events';
import type { ClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type {
  Properties as SpeechToTextProperties,
} from '@js/ui/speech_to_text';
import { current, isMaterial } from '@js/ui/themes';
import { SpeechRecognitionAdapter } from '@ts/core/speech_recognition_adapter';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import type { ButtonProps as ButtonProperties } from '@ts/ui/button/button';

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

type Properties = SpeechToTextProperties & {
  useInkRipple: boolean;
};

class SpeechToText extends Widget<Properties> {
  private _button?: Button;

  private _speechRecognitionAdapter?: SpeechRecognitionAdapter | null;

  private _state!: SpeechToTextState;

  private _actions!: SpeechToTextActions;

  _getDefaultOptions(): Properties {
    return {
      ...super._getDefaultOptions(),
      activeStateEnabled: true,
      customSpeechRecognizer: {
        enabled: false,
        isListening: false,
      },
      hoverStateEnabled: true,
      startIcon: DEFAULT_INITIAL_ICON,
      stopIcon: DEFAULT_LISTENING_ICON,
      startText: '',
      stopText: '',
      useInkRipple: false,
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

  _attachFeedbackEvents(): void {}

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
      disabled,
      focusStateEnabled,
      height,
      hint,
      hoverStateEnabled,
      stylingMode,
      type,
      useInkRipple,
      width,
    } = this.option();

    return {
      activeStateEnabled,
      disabled,
      focusStateEnabled,
      height,
      hint,
      hoverStateEnabled,
      stylingMode,
      type,
      useInkRipple,
      width,
      icon: this._getCurrentIcon(),
      text: this._getCurrentText(),
      onClick: (e: ClickEvent): void => {
        this._handleButtonClick(e);
      },
    };
  }

  _defaultOptionsRules(): DefaultOptionsRule<Properties>[] {
    const rules = [
      ...super._defaultOptionsRules(),
      {
        device: (): boolean => devices.real().deviceType === 'desktop' && !devices.isSimulator(),
        options: {
          focusStateEnabled: true,
        },
      }, {
        device: (): boolean => isMaterial(current()),
        options: {
          useInkRipple: true,
        },
      },
    ];

    return rules;
  }

  private _getCurrentIcon(): string | undefined {
    const { startIcon, stopIcon } = this.option();

    return this._isListening() ? stopIcon : startIcon;
  }

  private _getCurrentAriaLabel(): string {
    return this._isListening()
      ? messageLocalization.format('dxSpeechToText-ariaLabelStop')
      : messageLocalization.format('dxSpeechToText-ariaLabelStart');
  }

  private _getCurrentAriaPressed(): boolean {
    return this._isListening();
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
      elementAttr: {
        'aria-label': this._getCurrentAriaLabel(),
        'aria-pressed': this._getCurrentAriaPressed(),
      },
    });
  }

  private _updateCssClasses(): void {
    this.$element().toggleClass(SPEECH_TO_TEXT_LISTENING_CLASS, this._isListening());
  }

  _optionChanged(args: OptionChanged<Properties>): void {
    const { name, value } = args;

    switch (name) {
      case 'customSpeechRecognizer':
        this._handleCustomEngineState();
        break;

      case 'speechRecognitionConfig':
        this._speechRecognitionAdapter?.applyConfig(value);
        break;

      case 'activeStateEnabled':
      case 'focusStateEnabled':
      case 'height':
      case 'hint':
      case 'hoverStateEnabled':
      case 'stylingMode':
      case 'type':
      case 'width':
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
