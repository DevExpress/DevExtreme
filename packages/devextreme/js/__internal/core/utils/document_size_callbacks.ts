import domAdapter from '@js/core/dom_adapter';
import { Callbacks } from '@ts/core/utils/m_callbacks';
import windowUtils from '@ts/core/utils/m_window';

interface Size {
  width: number;
  height: number;
}

type DocumentSizeHandler = () => void;

interface HandlerList {
  add: (handler: DocumentSizeHandler) => void;
  remove: (handler: DocumentSizeHandler) => void;
  has: () => boolean;
  fire: () => void;
}

const callbacks = Callbacks({ unique: true }) as HandlerList;

let removeListener: (() => void) | null = null;
let previousDocumentSize: Size | null = null;
let previousWindowSize: Size | null = null;

function getDocumentSize(): Size {
  const documentElement = domAdapter.getDocumentElement();

  return {
    width: documentElement.clientWidth,
    height: documentElement.clientHeight,
  };
}

function getWindowSize(): Size {
  const window: Window = windowUtils.getWindow();

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

function isSameSize(previous: Size | null, current: Size): boolean {
  return previous?.width === current.width && previous?.height === current.height;
}

function handleVisualViewportResize(): void {
  const documentSize = getDocumentSize();
  const windowSize = getWindowSize();
  const isDocumentSizeChanged = !isSameSize(previousDocumentSize, documentSize);
  const isWindowSizeChanged = !isSameSize(previousWindowSize, windowSize);

  previousDocumentSize = documentSize;
  previousWindowSize = windowSize;

  if (isDocumentSizeChanged && !isWindowSizeChanged) {
    callbacks.fire();
  }
}

function getVisualViewport(): VisualViewport | null {
  if (!windowUtils.hasWindow()) {
    return null;
  }

  const window: Window = windowUtils.getWindow();

  return window.visualViewport;
}

function add(handler: DocumentSizeHandler): void {
  const visualViewport = getVisualViewport();

  if (!visualViewport) {
    return;
  }

  callbacks.add(handler);

  if (!removeListener) {
    previousDocumentSize = getDocumentSize();
    previousWindowSize = getWindowSize();
    removeListener = domAdapter.listen(visualViewport, 'resize', handleVisualViewportResize);
  }
}

function remove(handler: DocumentSizeHandler): void {
  callbacks.remove(handler);

  if (removeListener && !callbacks.has()) {
    removeListener();
    removeListener = null;
    previousDocumentSize = null;
    previousWindowSize = null;
  }
}

export const documentSizeCallbacks = { add, remove };
export default documentSizeCallbacks;
