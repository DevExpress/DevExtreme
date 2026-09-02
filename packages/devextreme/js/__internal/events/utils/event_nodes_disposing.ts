import { removeEvent } from '@js/common/core/events/remove';
import type { EngineTarget, EventHandler } from '@ts/events/core/events_engine';
import eventsEngine from '@ts/events/core/events_engine';

interface NodesDisposingEvent {
  target?: EngineTarget | null;
  delegateTarget?: EngineTarget | null;
  relatedTarget?: EngineTarget | null;
  currentTarget?: EngineTarget | null;
}

export type NodesDisposingCallback = (...args: unknown[]) => unknown;

export interface NodesDisposingSubscription {
  onceCallback: EventHandler;
  nodes: EngineTarget[];
}

function nodesByEvent(event: NodesDisposingEvent | null | undefined): EngineTarget[] {
  if (!event) {
    return [];
  }

  return [
    event.target,
    event.delegateTarget,
    event.relatedTarget,
    event.currentTarget,
  ].reduce<EngineTarget[]>((nodes, node) => {
    if (!!node && !nodes.includes(node)) {
      nodes.push(node);
    }

    return nodes;
  }, []);
}

export const subscribeNodesDisposing = (
  event: NodesDisposingEvent,
  callback: NodesDisposingCallback,
): NodesDisposingSubscription => {
  const nodes = nodesByEvent(event);
  const onceCallback: EventHandler = function onceCallback(...args) {
    eventsEngine.off(nodes, removeEvent, onceCallback);

    return callback(...args);
  };

  eventsEngine.on(nodes, removeEvent, onceCallback);

  return { onceCallback, nodes };
};

export const unsubscribeNodesDisposing = (
  event: NodesDisposingEvent | null | undefined,
  callback: EventHandler | undefined,
  nodes?: EngineTarget[],
): void => {
  eventsEngine.off(nodes ?? nodesByEvent(event), removeEvent, callback);
};
