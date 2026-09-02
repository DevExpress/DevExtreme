export const getEventTarget = (event) => {
  const { originalEvent } = event;

  if (!originalEvent) {
    return event.target;
  }

  const isShadowDOMUsed = Boolean(originalEvent.target?.shadowRoot);

  if (!isShadowDOMUsed) {
    return originalEvent.target;
  }

  const path = originalEvent.path ?? originalEvent.composedPath?.();
  const target = path?.[0] ?? event.target;

  return target;
};
