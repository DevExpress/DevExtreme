export const getEventTarget = (event) => {
    const isShadowDOMUsed = event.target?.shadowRoot;

    if(isShadowDOMUsed) {
        const path = event.path ?? event.composedPath?.();
        const target = path[0];

        return target;
    }

    return event.target;
};
