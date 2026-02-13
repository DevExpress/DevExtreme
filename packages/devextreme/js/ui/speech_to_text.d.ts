import {
  EventInfo,
  NativeEventInfo,
  InitializedEventInfo,
  ChangedOptionInfo,
  InteractionEvent,
} from '../events';

import Widget, { WidgetOptions } from './widget/ui.widget';
import type { ButtonStyle, ButtonType } from './button';

/**
 * @docid
 * @namespace DevExpress.ui.dxSpeechToText
 * @public
 */
export type SpeechRecognitionConfig = {
  /**
   * @docid
   * @public
   */
  continuous?: boolean;

  /**
   * @docid
   * @public
   */
  grammars?: string[];

  /**
   * @docid
   * @public
   */
  interimResults?: boolean;

  /**
   * @docid
   * @public
   */
  lang?: string;

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
export type StartClickEvent = NativeEventInfo<dxSpeechToText, InteractionEvent>;

/**
 * @docid _ui_speech_to_text_StopClickEvent
 * @public
 * @type object
 * @inherits NativeEventInfo
 */
export type StopClickEvent = NativeEventInfo<dxSpeechToText, InteractionEvent>;

/**
 * @docid _ui_speech_to_text_ResultEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ResultEvent = EventInfo<dxSpeechToText> & { event: Event };

/**
 * @docid _ui_speech_to_text_ErrorEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type ErrorEvent = EventInfo<dxSpeechToText> & { event: Event };

/**
 * @docid _ui_speech_to_text_EndEvent
 * @public
 * @type object
 * @inherits EventInfo
 */
export type EndEvent = EventInfo<dxSpeechToText> & { event: Event };

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
 * @deprecated use Properties instead
 * @namespace DevExpress.ui
 * @public
 * @docid
 */
export interface dxSpeechToTextOptions extends WidgetOptions<dxSpeechToText> {
  /**
   * @docid
   * @public
   */
  customSpeechRecognizer?: CustomSpeechRecognizer;

  /**
   * @docid
   * @default ""
   * @public
   */
  startText?: string;

  /**
   * @docid
   * @default ""
   * @public
   */
  stopText?: string;

  /**
   * @docid
   * @default 'contained'
   * @public
   */
  stylingMode?: ButtonStyle;

  /**
   * @docid
   * @default 'micfilled'
   * @public
   */
  startIcon?: string;

  /**
   * @docid
   * @default 'stopfilled'
   * @public
   */
  stopIcon?: string;

  /**
   * @docid
   * @default 'normal'
   * @public
   */
  type?: ButtonType | string;

  /**
   * @docid
   * @public
   */
  speechRecognitionConfig?: SpeechRecognitionConfig | { [key: string]: any };

  /**
   * @docid
   * @default undefined
   * @type_function_param1 e:{ui/speech_to_text:StartClickEvent}
   * @action
   * @public
   */
  onStartClick?: ((e: StartClickEvent) => void) | undefined;

  /**
   * @docid
   * @default undefined
   * @type_function_param1 e:{ui/speech_to_text:StopClickEvent}
   * @action
   * @public
   */
  onStopClick?: ((e: StopClickEvent) => void) | undefined;

  /**
   * @docid
   * @default undefined
   * @type_function_param1 e:{ui/speech_to_text:ResultEvent}
   * @action
   * @public
   */
  onResult?: ((e: ResultEvent) => void) | undefined;

  /**
   * @docid
   * @default undefined
   * @type_function_param1 e:{ui/speech_to_text:ErrorEvent}
   * @action
   * @public
   */
  onError?: ((e: ErrorEvent) => void) | undefined;

  /**
   * @docid
   * @default undefined
   * @type_function_param1 e:{ui/speech_to_text:EndEvent}
   * @action
   * @public
   */
  onEnd?: ((e: EndEvent) => void) | undefined;
}

/**
 * @docid
 * @inherits Widget
 * @namespace DevExpress.ui
 * @public
 */
export default class dxSpeechToText extends Widget<Properties> { }

/** @public */
export type Properties = dxSpeechToTextOptions;

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
  'onStartClick' | 'onStopClick' | 'onResult' | 'onError' | 'onEnd'
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
