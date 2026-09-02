import eventsEngine from '@js/common/core/events/core/events_engine';
import { removeEvent } from '@js/common/core/events/remove';

function nodesByEvent(event) {
  return event && [
    event.target,
    event.delegateTarget,
    event.relatedTarget,
    event.currentTarget,
  ].reduce((res, node) => {
    if (!!node && !res.includes(node)) {
      res.push(node);
    }

    return res;
  }, []);
}

export const subscribeNodesDisposing = (event, callback) => {
  const nodes = nodesByEvent(event);
  const onceCallback = function (...args) {
    eventsEngine.off(nodes, removeEvent, onceCallback);

    return callback(...args);
  };

  eventsEngine.on(nodes, removeEvent, onceCallback);

  return { onceCallback, nodes };
};

export const unsubscribeNodesDisposing = (event, callback, nodes) => {
  eventsEngine.off(nodes || nodesByEvent(event), removeEvent, callback);
};
