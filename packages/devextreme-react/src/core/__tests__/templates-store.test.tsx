import { TemplatesStore } from '../templates-store';

describe('templates-store', () => {
  it('adds', () => {
    const templatesStore = new TemplatesStore(jest.fn());

    templatesStore.add('1', jest.fn());
    templatesStore.add('2', jest.fn());

    expect(templatesStore.renderWrappers().length).toBe(2);
  });

  it('replaces items with equal identifiers', () => {
    const templatesStore = new TemplatesStore(jest.fn());

    templatesStore.add('1', jest.fn());
    templatesStore.add('1', jest.fn());

    expect(templatesStore.renderWrappers().length).toBe(1);
  });

  it('executes callback on item added', () => {
    const callback = jest.fn();
    const templatesStore = new TemplatesStore(callback);

    templatesStore.add('1', jest.fn());

    expect(callback.mock.calls.length).toBe(1);

    templatesStore.add('2', jest.fn());

    expect(callback.mock.calls.length).toBe(2);
  });

  it('setDeferredRemove for remove', () => {
    const templatesStore = new TemplatesStore(jest.fn());

    templatesStore.add('1', jest.fn());
    templatesStore.add('2', jest.fn());

    templatesStore.setDeferredRemove('1', true);
    expect(templatesStore.renderWrappers().length).toBe(1);

    templatesStore.setDeferredRemove('2', true);
    expect(templatesStore.renderWrappers().length).toBe(0);
  });

  it('setDeferredRemove not existing template correctly', () => {
    const templatesStore = new TemplatesStore(jest.fn());

    templatesStore.add('1', jest.fn());

    templatesStore.setDeferredRemove('2', true);
    templatesStore.setDeferredRemove('3', true);
    expect(templatesStore.renderWrappers().length).toBe(1);
  });

  it('does not execute callback on item removed', () => {
    const callback = jest.fn();
    const templatesStore = new TemplatesStore(callback);

    templatesStore.add('1', jest.fn());
    templatesStore.add('2', jest.fn());

    expect(callback.mock.calls.length).toBe(2);

    templatesStore.setDeferredRemove('1', true);
    templatesStore.setDeferredRemove('2', true);

    expect(callback.mock.calls.length).toBe(2);
  });

  it('toggle deferred remove shouldnt remove template (Unmount, Mount scenarion)', () => {
    const templatesStore = new TemplatesStore(jest.fn());

    templatesStore.add('1', jest.fn());

    templatesStore.setDeferredRemove('1', true);
    templatesStore.setDeferredRemove('1', false);
    expect(templatesStore.renderWrappers().length).toBe(1);
  });

  it('lists renderers execution results', () => {
    const templatesStore = new TemplatesStore(jest.fn());
    const renderer1 = jest.fn(() => 1);
    const renderer2 = jest.fn(() => 2);

    templatesStore.add('1', renderer1);
    templatesStore.add('2', renderer2);

    const wrappers = templatesStore.renderWrappers();

    expect(renderer1.mock.calls.length).toBe(1);
    expect(renderer2.mock.calls.length).toBe(1);

    expect(wrappers[0]).toBe(1);
    expect(wrappers[1]).toBe(2);
  });
});
