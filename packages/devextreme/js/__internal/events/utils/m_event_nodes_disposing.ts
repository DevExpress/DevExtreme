import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';

function nodesByEvent(event) {
  const insideDxParent = (element) => {
    const el = element?.closest?.('[class^="dx-"]:not(body), [class*=" dx-"]:not(body)');

    return !!el;
  };

  return event && [
    event.target,
    event.delegateTarget,
    event.relatedTarget,
    event.currentTarget,
  ].filter((node) => !!node && insideDxParent(node));
}

export const subscribeNodesDisposing = (event, callback) => {
  eventsEngine.one(nodesByEvent(event), removeEvent, callback);
};

export const unsubscribeNodesDisposing = (event, callback) => {
  eventsEngine.off(nodesByEvent(event), removeEvent, callback);
};
