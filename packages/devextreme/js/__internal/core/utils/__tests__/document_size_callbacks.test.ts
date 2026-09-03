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
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should observe the document element once, no matter how many handlers are added', () => {
    const { observeSpy } = setup();
    const first = jest.fn();
    const second = jest.fn();

    documentSizeCallbacks.add(first);
    documentSizeCallbacks.add(second);

    expect(observeSpy).toHaveBeenCalledTimes(1);

    documentSizeCallbacks.remove(first);
    documentSizeCallbacks.remove(second);
  });

  it('should not call handlers when the document size has not changed', () => {
    const { notifyResize } = setup();
    const handler = jest.fn();

    documentSizeCallbacks.add(handler);
    notifyResize();

    expect(handler).not.toHaveBeenCalled();

    documentSizeCallbacks.remove(handler);
  });

  it('should call handlers when a scrollbar changes the client width', () => {
    const { documentElement, notifyResize } = setup();
    const handler = jest.fn();

    documentSizeCallbacks.add(handler);
    documentElement.clientWidth = 985;
    notifyResize();

    expect(handler).toHaveBeenCalledTimes(1);

    documentSizeCallbacks.remove(handler);
  });

  it('should stop observing once the last handler is removed', () => {
    const { unobserveSpy } = setup();
    const first = jest.fn();
    const second = jest.fn();

    documentSizeCallbacks.add(first);
    documentSizeCallbacks.add(second);
    documentSizeCallbacks.remove(first);

    expect(unobserveSpy).not.toHaveBeenCalled();

    documentSizeCallbacks.remove(second);

    expect(unobserveSpy).toHaveBeenCalledTimes(1);
  });
});
