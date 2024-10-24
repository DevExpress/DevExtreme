import eventsEngine from '@js/events/core/events_engine';
import { removeEvent } from '@js/events/remove';

function nodesByEvent(event) {
  return event && [
    event.target,
    event.delegateTarget,
    event.relatedTarget,
    event.currentTarget,
  ].filter((node) => !!node);
}

export const subscribeNodesDisposing = (event, callback) => {
  eventsEngine.one(nodesByEvent(event), removeEvent, callback);
};

export const unsubscribeNodesDisposing = (event, callback) => {
  eventsEngine.off(nodesByEvent(event), removeEvent, callback);
};
