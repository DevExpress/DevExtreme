import type {
  SpeechToTextProperties as Properties,
  StartClickEvent,
  StopClickEvent,
  ResultEvent,
  ErrorEvent,
  CustomEngineConfig,
} from '../__internal/ui/speech_to_text/types';

import { SpeechToTextState } from '../__internal/ui/speech_to_text/types';
import SpeechToText from '../__internal/ui/speech_to_text/speech_to_text';

export default SpeechToText;

export type {
  Properties as SpeechToTextProperties,
  StartClickEvent,
  StopClickEvent,
  ResultEvent,
  ErrorEvent,
  CustomEngineConfig,
};

export { SpeechToTextState };

export type SpeechToTextInstance = SpeechToText;
