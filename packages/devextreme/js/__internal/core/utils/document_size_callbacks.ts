import domAdapter from '@js/core/dom_adapter';
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import windowUtils from '@ts/core/utils/m_window';

interface DocumentSize {
  width: number;
  height: number;
}

type DocumentSizeHandler = () => void;

type DocumentElement = ReturnType<typeof domAdapter.getDocumentElement>;

// The window resize event is not raised when a scrollbar appears or disappears,
// even though the visible area changes.
const handlers = new Set<DocumentSizeHandler>();

let observedElement: DocumentElement | null = null;
let previousSize: DocumentSize | null = null;

function getDocumentSize(): DocumentSize {
  const documentElement = domAdapter.getDocumentElement();

  return {
    width: documentElement.clientWidth,
    height: documentElement.clientHeight,
  };
}

function handleDocumentResize(): void {
  const size = getDocumentSize();

  if (previousSize?.width === size.width && previousSize?.height === size.height) {
    return;
  }

  previousSize = size;

  [...handlers].forEach((handler) => handler());
}

function add(handler: DocumentSizeHandler): void {
  if (!windowUtils.hasWindow()) {
    return;
  }

  handlers.add(handler);

  if (!observedElement) {
    previousSize = getDocumentSize();
    observedElement = domAdapter.getDocumentElement();
    resizeObserverSingleton.observe(observedElement, handleDocumentResize);
  }
}

function remove(handler: DocumentSizeHandler): void {
  handlers.delete(handler);

  if (observedElement && !handlers.size) {
    resizeObserverSingleton.unobserve(observedElement);
    observedElement = null;
    previousSize = null;
  }
}

export const documentSizeCallbacks = { add, remove };
export default documentSizeCallbacks;
