import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import domAdapter from '@js/core/dom_adapter';
import documentSizeCallbacks from '@ts/core/utils/document_size_callbacks';

type DocumentElement = ReturnType<typeof domAdapter.getDocumentElement>;

interface Environment {
  documentElement: { clientWidth: number; clientHeight: number };
  resizeVisualViewport: () => void;
  addEventListenerSpy: jest.SpiedFunction<EventTarget['addEventListener']>;
  removeEventListenerSpy: jest.SpiedFunction<EventTarget['removeEventListener']>;
}

function setup(): Environment {
  const documentElement = { clientWidth: 1000, clientHeight: 800 };
  const visualViewport = new EventTarget();

  jest.spyOn(domAdapter, 'getDocumentElement')
    .mockImplementation(() => documentElement as unknown as DocumentElement);
  Object.defineProperty(window, 'visualViewport', { value: visualViewport, configurable: true });
  window.innerWidth = 1024;
  window.innerHeight = 768;

  return {
    documentElement,
    resizeVisualViewport: (): void => { visualViewport.dispatchEvent(new Event('resize')); },
    addEventListenerSpy: jest.spyOn(visualViewport, 'addEventListener'),
    removeEventListenerSpy: jest.spyOn(visualViewport, 'removeEventListener'),
  };
}

describe('documentSizeCallbacks', () => {
  const addedHandlers: (() => void)[] = [];

  function addHandler(): jest.Mock {
    const handler = jest.fn();

    addedHandlers.push(handler);
    documentSizeCallbacks.add(handler);

    return handler;
  }

  afterEach(() => {
    addedHandlers.splice(0).forEach((handler) => documentSizeCallbacks.remove(handler));
    delete (window as { visualViewport?: VisualViewport }).visualViewport;
    jest.restoreAllMocks();
  });

  it('should listen to the visual viewport resize once, no matter how many handlers are added', () => {
    const { addEventListenerSpy } = setup();

    addHandler();
    addHandler();

    expect(addEventListenerSpy).toHaveBeenCalledTimes(1);
    expect(addEventListenerSpy.mock.calls[0][0]).toBe('resize');
  });

  it('should not call handlers when the document size has not changed', () => {
    const { resizeVisualViewport } = setup();
    const handler = addHandler();

    resizeVisualViewport();

    expect(handler).not.toHaveBeenCalled();
  });

  it('should call handlers when a scrollbar changes the client width', () => {
    const { documentElement, resizeVisualViewport } = setup();
    const handler = addHandler();

    documentElement.clientWidth = 985;
    resizeVisualViewport();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should call handlers when a scrollbar changes the client height', () => {
    const { documentElement, resizeVisualViewport } = setup();
    const handler = addHandler();

    documentElement.clientHeight = 785;
    resizeVisualViewport();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should leave a window resize to the window resize callbacks', () => {
    const { documentElement, resizeVisualViewport } = setup();
    const handler = addHandler();

    window.innerWidth = 1224;
    documentElement.clientWidth = 1200;
    resizeVisualViewport();

    expect(handler).not.toHaveBeenCalled();

    documentElement.clientWidth = 1185;
    resizeVisualViewport();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should hold a handler once even when it is added twice', () => {
    const { documentElement, resizeVisualViewport, removeEventListenerSpy } = setup();
    const handler = addHandler();

    documentSizeCallbacks.add(handler);

    documentElement.clientWidth = 985;
    resizeVisualViewport();

    expect(handler).toHaveBeenCalledTimes(1);

    documentSizeCallbacks.remove(handler);

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('should stop listening once the last handler is removed', () => {
    const { removeEventListenerSpy } = setup();
    const first = addHandler();

    addHandler();
    documentSizeCallbacks.remove(first);

    expect(removeEventListenerSpy).not.toHaveBeenCalled();

    documentSizeCallbacks.remove(addedHandlers[1]);

    expect(removeEventListenerSpy).toHaveBeenCalledTimes(1);
  });

  it('should measure the document anew when the first handler is added again', () => {
    const { documentElement, resizeVisualViewport } = setup();
    const first = addHandler();

    documentSizeCallbacks.remove(first);
    documentElement.clientWidth = 985;

    const second = addHandler();

    resizeVisualViewport();

    expect(second).not.toHaveBeenCalled();
  });

  it('should do nothing when the browser has no visual viewport', () => {
    setup();
    delete (window as { visualViewport?: VisualViewport }).visualViewport;

    const listenSpy = jest.spyOn(domAdapter, 'listen');
    const handler = addHandler();

    expect(listenSpy).not.toHaveBeenCalled();
    expect(() => documentSizeCallbacks.remove(handler)).not.toThrow();
  });
});
