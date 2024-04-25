export const getEventTarget = (event) => {
    const originalEvent = event.originalEvent;
    const isShadowDOMUsed = Boolean(event.target?.shadowRoot);

    if(!originalEvent || !isShadowDOMUsed) {
        return event.target;
    }

    const path = event.path ?? event.composedPath?.();
    const target = path[0];

    return target;
};
