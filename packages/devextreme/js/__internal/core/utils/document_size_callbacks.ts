import domAdapter from '@js/core/dom_adapter';
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import { Callbacks } from '@ts/core/utils/m_callbacks';
import windowUtils from '@ts/core/utils/m_window';

interface DocumentSize {
  width: number;
  height: number;
}

type DocumentSizeHandler = () => void;

type DocumentElement = ReturnType<typeof domAdapter.getDocumentElement>;

// Callbacks.has() takes no arguments and answers whether the list is empty,
// which the shared declaration does not describe yet
interface HandlerList {
  add: (handler: DocumentSizeHandler) => void;
  remove: (handler: DocumentSizeHandler) => void;
  has: () => boolean;
  fire: () => void;
}

// The window resize event is not raised when a scrollbar appears or disappears,
// even though the visible area changes.
const callbacks = Callbacks({ unique: true }) as HandlerList;

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

  callbacks.fire();
}

function add(handler: DocumentSizeHandler): void {
  if (!windowUtils.hasWindow()) {
    return;
  }

  callbacks.add(handler);

  if (!observedElement) {
    previousSize = getDocumentSize();
    observedElement = domAdapter.getDocumentElement();
    resizeObserverSingleton.observe(observedElement, handleDocumentResize);
  }
}

function remove(handler: DocumentSizeHandler): void {
  callbacks.remove(handler);

  if (observedElement && !callbacks.has()) {
    resizeObserverSingleton.unobserve(observedElement);
    observedElement = null;
    previousSize = null;
  }
}

export const documentSizeCallbacks = { add, remove };
export default documentSizeCallbacks;
