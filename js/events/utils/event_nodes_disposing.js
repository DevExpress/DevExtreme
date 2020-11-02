import eventsEngine from '../core/events_engine';

const REMOVE_EVENT_NAME = 'dxremove';

function nodesByEvent(event) {
    return event && [
        event.target,
        event.delegateTarget,
        event.relatedTarget,
        event.currentTarget
    ].filter(node => !!node);
}

export const subscribeNodesDisposing = (event, callback) => {
    eventsEngine.one(nodesByEvent(event), REMOVE_EVENT_NAME, callback);
};

export const unsubscribeNodesDisposing = (event, callback) => {
    eventsEngine.off(nodesByEvent(event), REMOVE_EVENT_NAME, callback);
};
