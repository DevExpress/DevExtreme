import { addNamespace as pureAddNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import type {
  EngineEvent, EngineTarget, EventHandler, EventsEngineTarget,
} from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';
import type { KeyboardKeyDownEvent } from '@ts/events/core/keyboard_processor';
import KeyboardProcessor from '@ts/events/core/keyboard_processor';

export interface ActionLike<TArguments> {
  execute: (args: TArguments) => unknown;
}

export type ShortAction<TArguments> = ((args: TArguments) => unknown) | ActionLike<TArguments>;

export interface FeedbackActionArguments {
  event: EngineEvent;
  element: EngineTarget;
}

export interface ShortEventOptions {
  namespace?: string;
  selector?: string | null;
}

export type ShortEventHandler<TEvent extends EngineEvent = EngineEvent> = (
  event: TEvent,
) => unknown;

export interface FeedbackOptions extends ShortEventOptions {
  showTimeout?: number;
  hideTimeout?: number;
}

function addNamespace(eventName: string, namespace?: string): string {
  return namespace ? pureAddNamespace(eventName, namespace) : eventName;
}

function executeAction<TArguments>(
  action: ShortAction<TArguments>,
  args: TArguments,
): unknown {
  return typeof action === 'function' ? action(args) : action.execute(args);
}

export const active = {
  on: (
    $el: EventsEngineTarget,
    activeAction: ShortAction<FeedbackActionArguments>,
    inactiveAction: ShortAction<FeedbackActionArguments>,
    {
      selector, showTimeout, hideTimeout, namespace,
    }: FeedbackOptions,
  ): void => {
    eventsEngine.on(
      $el,
      addNamespace('dxactive', namespace),
      selector,
      { timeout: showTimeout },
      (event) => executeAction(activeAction, { event, element: event.currentTarget }),
    );
    eventsEngine.on(
      $el,
      addNamespace('dxinactive', namespace),
      selector,
      { timeout: hideTimeout },
      (event) => executeAction(inactiveAction, { event, element: event.currentTarget }),
    );
  },

  off: ($el: EventsEngineTarget, { namespace, selector }: ShortEventOptions): void => {
    eventsEngine.off($el, addNamespace('dxactive', namespace), selector);
    eventsEngine.off($el, addNamespace('dxinactive', namespace), selector);
  },
};

export const resize = {
  on: <TEvent extends EngineEvent = EngineEvent>(
    $el: EventsEngineTarget,
    resizeHandler: EventHandler<TEvent>,
    { namespace }: ShortEventOptions = {},
  ): void => {
    eventsEngine.on($el, addNamespace('dxresize', namespace), resizeHandler);
  },
  off: ($el: EventsEngineTarget, { namespace }: ShortEventOptions = {}): void => {
    eventsEngine.off($el, addNamespace('dxresize', namespace));
  },
};

export const hover = {
  on: <TEvent extends EngineEvent = EngineEvent>(
    $el: EventsEngineTarget,
    start: ShortAction<FeedbackActionArguments>,
    end: ShortEventHandler<TEvent>,
    { selector, namespace }: ShortEventOptions,
  ): void => {
    eventsEngine.on(
      $el,
      addNamespace('dxhoverend', namespace),
      selector,
      (event: TEvent) => end(event),
    );
    eventsEngine.on(
      $el,
      addNamespace('dxhoverstart', namespace),
      selector,
      (event: TEvent) => executeAction(start, { element: event.target, event }),
    );
  },

  off: ($el: EventsEngineTarget, { selector, namespace }: ShortEventOptions): void => {
    eventsEngine.off($el, addNamespace('dxhoverstart', namespace), selector);
    eventsEngine.off($el, addNamespace('dxhoverend', namespace), selector);
  },
};

export const visibility = {
  on: <TEvent extends EngineEvent = EngineEvent>(
    $el: EventsEngineTarget,
    shown: EventHandler<TEvent>,
    hiding: EventHandler<TEvent>,
    { namespace }: ShortEventOptions,
  ): void => {
    eventsEngine.on($el, addNamespace('dxhiding', namespace), hiding);
    eventsEngine.on($el, addNamespace('dxshown', namespace), shown);
  },

  off: ($el: EventsEngineTarget, { namespace }: ShortEventOptions): void => {
    eventsEngine.off($el, addNamespace('dxhiding', namespace));
    eventsEngine.off($el, addNamespace('dxshown', namespace));
  },
};

export const focus = {
  on: <TEvent extends EngineEvent = EngineEvent>(
    $el: EventsEngineTarget,
    focusIn: EventHandler<TEvent>,
    focusOut: EventHandler<TEvent>,
    { namespace }: ShortEventOptions,
  ): void => {
    eventsEngine.on($el, addNamespace('focusin', namespace), focusIn);
    eventsEngine.on($el, addNamespace('focusout', namespace), focusOut);
  },

  off: ($el: EventsEngineTarget, { namespace }: ShortEventOptions): void => {
    eventsEngine.off($el, addNamespace('focusin', namespace));
    eventsEngine.off($el, addNamespace('focusout', namespace));
  },

  trigger: ($el: EventsEngineTarget): void => eventsEngine.trigger($el, 'focus'),
};

export const dxClick = {
  on: <TEvent extends EngineEvent = EngineEvent>(
    $el: EventsEngineTarget,
    click: EventHandler<TEvent>,
    { namespace }: ShortEventOptions = {},
  ): void => {
    eventsEngine.on($el, addNamespace('dxclick', namespace), click);
  },
  off: ($el: EventsEngineTarget, { namespace }: ShortEventOptions = {}): void => {
    eventsEngine.off($el, addNamespace('dxclick', namespace));
  },
};

export const click = {
  on: <TEvent extends EngineEvent = EngineEvent>(
    $el: EventsEngineTarget,
    clickHandler: EventHandler<TEvent>,
    { namespace }: ShortEventOptions = {},
  ): void => {
    eventsEngine.on($el, addNamespace('click', namespace), clickHandler);
  },
  off: ($el: EventsEngineTarget, { namespace }: ShortEventOptions = {}): void => {
    eventsEngine.off($el, addNamespace('click', namespace));
  },
};

let index = 0;
const keyboardProcessors: Record<string, KeyboardProcessor> = {};
const generateListenerId = (): string => {
  const listenerId = `keyboardProcessorId${index}`;

  index += 1;

  return listenerId;
};

const toElements = (value: unknown): Element[] => {
  if (!value) {
    return [];
  }

  if (typeof Element === 'undefined') {
    return [];
  }

  if (value instanceof Element) {
    return [value];
  }

  if (Array.isArray(value)) {
    return value.filter((item): item is Element => item instanceof Element);
  }

  const v = value as { toArray?: () => unknown[]; 0?: unknown };

  if (typeof v.toArray === 'function') {
    const arr = v.toArray();

    if (Array.isArray(arr)) {
      return arr.filter((item): item is Element => item instanceof Element);
    }
  }

  const first = v[0];

  return first instanceof Element ? [first] : [];
};

const processorIdsByNode = new WeakMap<Element, Set<string>>();

const getProcessorNodes = (processor: KeyboardProcessor | undefined): Element[] => [
  ...toElements(processor?._element),
  ...toElements(processor?._focusTarget),
];

const addProcessorToIndex = (id: string, nodes: Element[]): void => {
  nodes.forEach((el) => {
    let ids = processorIdsByNode.get(el);

    if (!ids) {
      ids = new Set();
      processorIdsByNode.set(el, ids);
    }

    ids.add(id);
  });
};

const removeProcessorFromIndex = (id: string, nodes: Element[]): void => {
  nodes.forEach((el) => {
    const ids = processorIdsByNode.get(el);

    if (ids) {
      ids.delete(id);

      if (ids.size === 0) {
        processorIdsByNode.delete(el);
      }
    }
  });
};

export const keyboard = {
  on: (
    element: Element | dxElementWrapper | null | undefined,
    focusTarget: Element | Element[] | dxElementWrapper | null | undefined,
    handler: (event: KeyboardKeyDownEvent) => void,
  ): string => {
    const listenerId = generateListenerId();

    const keyboardProcessor = new KeyboardProcessor({ element, focusTarget, handler });
    keyboardProcessors[listenerId] = keyboardProcessor;

    addProcessorToIndex(listenerId, getProcessorNodes(keyboardProcessor));

    return listenerId;
  },

  off: (listenerId: string | null | undefined): void => {
    const keyboardProcessor = listenerId ? keyboardProcessors[listenerId] : undefined;

    if (listenerId && keyboardProcessor) {
      const nodes = getProcessorNodes(keyboardProcessor);

      keyboardProcessor.dispose();

      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete keyboardProcessors[listenerId];
      removeProcessorFromIndex(listenerId, nodes);
    }
  },

  disposeProcessorsForSubtree(root: Element): void {
    if (!root?.nodeType) {
      return;
    }

    const nodes: Element[] = [root];

    if (typeof root.querySelectorAll === 'function') {
      nodes.push(...Array.from(root.querySelectorAll('*')));
    }

    const idsToDispose = new Set<string>();

    nodes.forEach((node) => {
      processorIdsByNode.get(node)?.forEach((id) => idsToDispose.add(id));
    });

    idsToDispose.forEach((id) => keyboard.off(id));
  },

  // NOTE: For tests
  _getProcessor: (listenerId: string): KeyboardProcessor | undefined => (
    keyboardProcessors[listenerId]
  ),
};
