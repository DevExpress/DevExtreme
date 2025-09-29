import { getWindow } from '@js/core/utils/window';
import type { SpeechRecognitionConfig } from '@js/ui/speech_to_text';
import errors from '@js/ui/widget/ui.errors';

type SpeechRecognition = SpeechRecognitionConfig & {
  start: () => void;
  stop: () => void;
} & Record<string, unknown>;

interface SpeechRecognitionEvents {
  onResult: (event: Event) => void;
  onError: (event: Event) => void;
  onEnd: (event: Event) => void;
}

export const NOT_SUPPORTED_ERROR = 'E1065';

const EVENT_NAMES = ['onresult', 'onerror', 'onend'];
export class SpeechRecognitionAdapter {
  private _speechRecognition?: SpeechRecognition | null;

  constructor(config: SpeechRecognitionConfig, events: SpeechRecognitionEvents) {
    const window = getWindow();
    // @ts-expect-error SpeechRecognition API is not supported in TS
    const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      errors.log(NOT_SUPPORTED_ERROR);

      return;
    }

    this._speechRecognition = new SpeechRecognitionConstructor();

    this.applyConfig(config);
    this._attachEvents(events);
  }

  private _attachEvents(events: SpeechRecognitionEvents): void {
    if (!this._speechRecognition) {
      return;
    }

    // eslint-disable-next-line spellcheck/spell-checker
    this._speechRecognition.onend = events.onEnd;
    // eslint-disable-next-line spellcheck/spell-checker
    this._speechRecognition.onresult = events.onResult;
    this._speechRecognition.onerror = events.onError;
  }

  applyConfig(config: SpeechRecognitionConfig = {}): void {
    Object.entries(config).forEach(([key, value]) => {
      if (this._speechRecognition && !EVENT_NAMES.includes(key)) {
        this._speechRecognition[key] = value;
      }
    });
  }

  start(): void {
    this._speechRecognition?.start();
  }

  stop(): void {
    this._speechRecognition?.stop();
  }

  dispose(): void {
    this._speechRecognition = null;
  }
}
