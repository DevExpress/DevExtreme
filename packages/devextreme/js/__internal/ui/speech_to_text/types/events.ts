import type { EventInfo, NativeEventInfo } from '@js/common/core/events';

import type SpeechToText from '../speech_to_text';

type PointerLikeEvent = MouseEvent | PointerEvent | TouchEvent | KeyboardEvent;

export type StartClickEvent = NativeEventInfo<SpeechToText, PointerLikeEvent> & {
  readonly component: SpeechToText;
};

export type StopClickEvent = NativeEventInfo<SpeechToText, PointerLikeEvent> & {
  readonly component: SpeechToText;
};

export type ResultEvent = EventInfo<SpeechToText> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly result: any;
};

export type ErrorEvent = EventInfo<SpeechToText> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly error: any;
};

export interface SpeechToTextActions {
  onStartClick?: (e: StartClickEvent) => void;
  onStopClick?: (e: StopClickEvent) => void;
  onResult?: (e: ResultEvent) => void;
  onError?: (e: ErrorEvent) => void;
}
