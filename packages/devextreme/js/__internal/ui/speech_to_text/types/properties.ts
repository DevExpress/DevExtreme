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
  stylingMode?: ButtonStyle;

  type?: ButtonType;

  startText?: string;

  stopText?: string;

  startIcon?: string;

  stopIcon?: string;

  customSpeechRecognizer?: CustomEngineConfig;

  onStartClick?: (e: StartClickEvent) => void;

  onStopClick?: (e: StopClickEvent) => void;

  onResult?: (e: ResultEvent) => void;

  onError?: (e: ErrorEvent) => void;
}
