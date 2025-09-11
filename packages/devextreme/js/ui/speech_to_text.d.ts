import {
    EventInfo,
    NativeEventInfo,
    InitializedEventInfo,
    ChangedOptionInfo,
} from '../common/core/events';

import Widget from './widget/ui.widget';
import type { Properties as dxButtonOptions } from './button';

/**
 * @docid
 * @namespace DevExpress.ui.dxSpeechToText
 * @public
 */
export type WebSpeechApiConfig = {
  /**
   * @docid
   * @public
   */
  grammars?: string[];

  /**
   * @docid
   * @public
   */
  lang?: string;

  /**
   * @docid
   * @public
   */
  continuous?: boolean;

  /**
   * @docid
   * @public
   */
  interimResults?: boolean;

  /**
   * @docid
   * @public
   */
  maxAlternatives?: number;
};

/**
 * @docid
 * @namespace DevExpress.ui.dxSpeechToText
 * @public
 */
export type CustomSpeechRecognizer = {
  /**
   * @docid
   * @default false
   * @public
   */
  enabled?: boolean;

  /**
   * @docid
   * @default false
   * @public
   */
  isListening?: boolean;
};

/**
 * @docid _ui_speech_to_text_StartClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type StartClickEvent = NativeEventInfo<dxSpeechToText, KeyboardEvent | MouseEvent | PointerEvent>;

/**
 * @docid _ui_speech_to_text_StopClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type StopClickEvent = NativeEventInfo<dxSpeechToText, KeyboardEvent | MouseEvent | PointerEvent>;

/**
 * @docid _ui_speech_to_text_ResultEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ResultEvent = NativeEventInfo<dxSpeechToText, Event>;

/**
 * @docid _ui_speech_to_text_ErrorEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type ErrorEvent = NativeEventInfo<dxSpeechToText, Event>;

/**
 * @docid _ui_speech_to_text_ContentReadyEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ContentReadyEvent = EventInfo<dxSpeechToText>;

/**
 * @docid _ui_speech_to_text_DisposingEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type DisposingEvent = EventInfo<dxSpeechToText>;

/**
 * @docid _ui_speech_to_text_InitializedEvent
 * @public
 * @type object
 * @inherits InitializedEventInfo
 */
export type InitializedEvent = InitializedEventInfo<dxSpeechToText>;

/**
 * @docid _ui_speech_to_text_OptionChangedEvent
 * @public
 * @type object
 * @inherits EventInfo,ChangedOptionInfo
 */
export type OptionChangedEvent = EventInfo<dxSpeechToText> & ChangedOptionInfo;

/**
 * @public
 * @docid dxSpeechToTextOptions
 * @type object
 */
export type Properties = Omit<dxButtonOptions, 'template' | 'useSubmitBehavior' | 'validationGroup' | 'icon' | 'text' | 'onClick'> & {
  /**
   * @docid dxSpeechToTextOptions.startText
   * @default ""
   * @public
   */
  startText?: string;

  /**
   * @docid dxSpeechToTextOptions.stopText
   * @default ""
   * @public
   */
  stopText?: string;

  /**
   * @docid dxSpeechToTextOptions.startIcon
   * @default 'micoutline'
   * @public
   */
  startIcon?: string;

  /**
   * @docid dxSpeechToTextOptions.stopIcon
   * @default 'stopfilled'
   * @public
   */
  stopIcon?: string;

  /**
   * @docid dxSpeechToTextOptions.webSpeechApiConfig
   * @public
   */
  webSpeechApiConfig?: WebSpeechApiConfig | { [key: string]: any };

  /**
   * @docid dxSpeechToTextOptions.customSpeechRecognizer
   * @public
   */
  customSpeechRecognizer?: CustomSpeechRecognizer;

  /**
   * @docid dxSpeechToTextOptions.onStartClick
   * @type_function_param1 e:{ui/speech_to_text:StartClickEvent}
   * @action
   * @public
   */
  onStartClick?: ((e: StartClickEvent) => void);

  /**
   * @docid dxSpeechToTextOptions.onStopClick
   * @type_function_param1 e:{ui/speech_to_text:StopClickEvent}
   * @action
   * @public
   */
  onStopClick?: ((e: StopClickEvent) => void);

  /**
   * @docid dxSpeechToTextOptions.onResult
   * @type_function_param1 e:{ui/speech_to_text:ResultEvent}
   * @action
   * @public
   */
  onResult?: ((e: ResultEvent) => void);

  /**
   * @docid dxSpeechToTextOptions.onError
   * @type_function_param1 e:{ui/speech_to_text:ErrorEvent}
   * @action
   * @public
   */
  onError?: ((e: ErrorEvent) => void);
};

/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @options Properties
 * @public
 */
export default class dxSpeechToText extends Widget<Properties> { }

/** @public */
export type ExplicitTypes = {
  Properties: Properties;
  ContentReadyEvent: ContentReadyEvent;
  DisposingEvent: DisposingEvent;
  InitializedEvent: InitializedEvent;
  OptionChangedEvent: OptionChangedEvent;
  StartClickEvent: StartClickEvent;
  StopClickEvent: StopClickEvent;
  ResultEvent: ResultEvent;
  ErrorEvent: ErrorEvent;
};

/// #DEBUG
// eslint-disable-next-line import/first
import { CheckedEvents } from '../core';

type FilterOutHidden<T> = Omit<T, 'onFocusIn' | 'onFocusOut'>;

type EventsIntegrityCheckingHelper = CheckedEvents<
  FilterOutHidden<Properties>,
  Required<Events>,
  'onStartClick' | 'onStopClick' | 'onResult' | 'onError'
>;

/**
 * @hidden
 */
type Events = {
  /**
   * @docid dxSpeechToTextOptions.onContentReady
   * @type_function_param1 e:{ui/speech_to_text:ContentReadyEvent}
   */
  onContentReady?: ((e: ContentReadyEvent) => void);

  /**
   * @docid dxSpeechToTextOptions.onDisposing
   * @type_function_param1 e:{ui/speech_to_text:DisposingEvent}
   */
  onDisposing?: ((e: DisposingEvent) => void);

  /**
   * @docid dxSpeechToTextOptions.onInitialized
   * @type_function_param1 e:{ui/speech_to_text:InitializedEvent}
   */
  onInitialized?: ((e: InitializedEvent) => void);

  /**
   * @docid dxSpeechToTextOptions.onOptionChanged
   * @type_function_param1 e:{ui/speech_to_text:OptionChangedEvent}
   */
  onOptionChanged?: ((e: OptionChangedEvent) => void);
};
/// #ENDDEBUG
