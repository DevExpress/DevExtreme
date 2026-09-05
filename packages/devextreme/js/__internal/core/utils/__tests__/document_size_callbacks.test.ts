import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import domAdapter from '@js/core/dom_adapter';
import { resizeObserverSingleton } from '@ts/core/m_resize_observer';
import documentSizeCallbacks from '@ts/core/utils/document_size_callbacks';

type DocumentElement = ReturnType<typeof domAdapter.getDocumentElement>;

function setup(): {
  documentElement: { clientWidth: number; clientHeight: number };
  notifyResize: () => void;
  observeSpy: jest.Mock;
  unobserveSpy: jest.Mock;
} {
  const documentElement = { clientWidth: 1000, clientHeight: 800 };
  const observerCallbacks: (() => void)[] = [];

  jest.spyOn(domAdapter, 'getDocumentElement')
    .mockImplementation(() => documentElement as unknown as DocumentElement);

  const observeSpy = jest.fn((element, callback) => {
    observerCallbacks.push(callback as () => void);
  });
  const unobserveSpy = jest.fn();

  jest.spyOn(resizeObserverSingleton, 'observe').mockImplementation(observeSpy);
  jest.spyOn(resizeObserverSingleton, 'unobserve').mockImplementation(unobserveSpy);

  return {
    documentElement,
    notifyResize: (): void => observerCallbacks.forEach((callback) => callback()),
    observeSpy,
    unobserveSpy,
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
    jest.restoreAllMocks();
  });

  it('should observe the document element once, no matter how many handlers are added', () => {
    const { observeSpy } = setup();

    addHandler();
    addHandler();

    expect(observeSpy).toHaveBeenCalledTimes(1);
  });

  it('should not call handlers when the document size has not changed', () => {
    const { notifyResize } = setup();
    const handler = addHandler();

    notifyResize();

    expect(handler).not.toHaveBeenCalled();
  });

  it('should call handlers when a scrollbar changes the client width', () => {
    const { documentElement, notifyResize } = setup();
    const handler = addHandler();

    documentElement.clientWidth = 985;
    notifyResize();

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should stop observing once the last handler is removed', () => {
    const { unobserveSpy } = setup();
    const first = addHandler();

    addHandler();
    documentSizeCallbacks.remove(first);

    expect(unobserveSpy).not.toHaveBeenCalled();

    documentSizeCallbacks.remove(addedHandlers[1]);

    expect(unobserveSpy).toHaveBeenCalledTimes(1);
  });
});
