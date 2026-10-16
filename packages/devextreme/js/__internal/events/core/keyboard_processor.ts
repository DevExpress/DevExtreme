import eventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace, normalizeKeyName } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';

const COMPOSITION_START_EVENT = 'compositionstart';
const COMPOSITION_END_EVENT = 'compositionend';
const KEYDOWN_EVENT = 'keydown';
const NAMESPACE = 'KeyboardProcessor';

const KEYDOWN_NAMESPACED_EVENT = addNamespace(KEYDOWN_EVENT, NAMESPACE);
const COMPOSITION_START_NAMESPACED_EVENT = addNamespace(COMPOSITION_START_EVENT, NAMESPACE);
const COMPOSITION_END_NAMESPACED_EVENT = addNamespace(COMPOSITION_END_EVENT, NAMESPACE);

export interface KeyboardKeyDownEvent {
  keyName: string;
  key: string;
  code: string;
  ctrl: boolean;
  location: number;
  metaKey: boolean;
  shift: boolean;
  alt: boolean;
  which: number;
  originalEvent: DxEvent<KeyboardEvent>;
}

export interface KeyboardProcessorOptions {
  element?: Element | dxElementWrapper | null;
  focusTarget?: Element | Element[] | dxElementWrapper | null;
  handler?: (event: KeyboardKeyDownEvent) => void;
}

const createKeyDownOptions = (e: DxEvent<KeyboardEvent>): KeyboardKeyDownEvent => ({
  keyName: normalizeKeyName(e),
  key: e.key,
  code: e.code,
  ctrl: e.ctrlKey,
  location: e.location,
  metaKey: e.metaKey,
  shift: e.shiftKey,
  alt: e.altKey,
  which: e.which,
  originalEvent: e,
});

class KeyboardProcessor {
  _element?: dxElementWrapper;

  _focusTarget?: Element | Element[] | dxElementWrapper | null;

  _handler?: (event: KeyboardKeyDownEvent) => void;

  _processFunction?: (e: DxEvent<KeyboardEvent>) => void;

  _toggleProcessingWithContext?: (e: { type: string }) => void;

  _isComposing?: boolean;

  _isComposingJustFinished?: boolean;

  static createKeyDownOptions = createKeyDownOptions;

  constructor(options?: KeyboardProcessorOptions | null) {
    const config = options ?? {};

    if (config.element) {
      this._element = $(config.element);
    }
    if (config.focusTarget) {
      this._focusTarget = config.focusTarget;
    }
    this._handler = config.handler;

    if (this._element) {
      this._processFunction = (e: DxEvent<KeyboardEvent>): void => {
        const focusTargets = $(this._focusTarget).toArray();
        const isNotFocusTarget = this._focusTarget
          && this._focusTarget !== e.target
          && !focusTargets.includes(e.target);
        const shouldSkipProcessing = (this._isComposingJustFinished && e.which === 229)
          || this._isComposing
          || isNotFocusTarget;

        this._isComposingJustFinished = false;
        if (!shouldSkipProcessing) {
          this.process(e);
        }
      };
      this._toggleProcessingWithContext = this.toggleProcessing.bind(this);

      eventsEngine.on(this._element, KEYDOWN_NAMESPACED_EVENT, this._processFunction);
      eventsEngine.on(
        this._element,
        COMPOSITION_START_NAMESPACED_EVENT,
        this._toggleProcessingWithContext,
      );
      eventsEngine.on(
        this._element,
        COMPOSITION_END_NAMESPACED_EVENT,
        this._toggleProcessingWithContext,
      );
    }
  }

  dispose(): void {
    if (this._element) {
      eventsEngine.off(this._element, KEYDOWN_NAMESPACED_EVENT, this._processFunction);
      eventsEngine.off(
        this._element,
        COMPOSITION_START_NAMESPACED_EVENT,
        this._toggleProcessingWithContext,
      );
      eventsEngine.off(
        this._element,
        COMPOSITION_END_NAMESPACED_EVENT,
        this._toggleProcessingWithContext,
      );
    }
    this._element = undefined;
    this._handler = undefined;
  }

  process(e: DxEvent<KeyboardEvent>): void {
    this._handler?.(createKeyDownOptions(e));
  }

  toggleProcessing({ type }: { type: string }): void {
    this._isComposing = type === COMPOSITION_START_EVENT;
    this._isComposingJustFinished = !this._isComposing;
  }
}

export default KeyboardProcessor;
