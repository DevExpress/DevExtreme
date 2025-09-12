import type { ButtonStyle, ButtonType } from '@js/common';
import type { WidgetOptions } from '@js/ui/widget/ui.widget';

import type SpeechToText from '../speech_to_text';
import type { CustomEngineConfig } from './config';
import type {
  ErrorEvent,
  ResultEvent,
  StartClickEvent,
  StopClickEvent,
} from './events';

export interface SpeechToTextProperties extends WidgetOptions<SpeechToText> {
  /**
   * @default 'contained'
   */
  stylingMode?: ButtonStyle;

  /**
   * @default 'default'
   */
  type?: ButtonType;

  /**
   * @default ''
   */
  startText?: string;

  /**
   * @default ''
   */
  stopText?: string;

  /**
   * @default 'mic'
   */
  startIcon?: string;

  /**
   * @default 'square'
   */
  stopIcon?: string;

  /**
   * @default { enabled: false, isListening: false }
   */
  customSpeechRecognizer?: CustomEngineConfig;

  onStartClick?: (e: StartClickEvent) => void;

  onStopClick?: (e: StopClickEvent) => void;

  onResult?: (e: ResultEvent) => void;

  onError?: (e: ErrorEvent) => void;
}
