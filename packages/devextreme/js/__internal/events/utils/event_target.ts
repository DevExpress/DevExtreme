interface ShadowHost extends EventTarget {
  shadowRoot?: ShadowRoot | null;
}

interface NativeTargetedEvent {
  target?: ShadowHost | null;
  path?: EventTarget[];
  composedPath?: () => EventTarget[];
}

export interface TargetedEvent {
  target?: ShadowHost | null;
  originalEvent?: NativeTargetedEvent | null;
}

export const getEventTarget = (event: TargetedEvent): EventTarget | null | undefined => {
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
