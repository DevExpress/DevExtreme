import {
  describe, expect, it, jest,
} from '@jest/globals';

import {
  getFirstFocusableElement,
  getNextFocusableElement,
  getPreviousFocusableElement,
} from './focus';

jest.mock('@ts/core/utils/m_selectors', () => ({
  ...jest.requireActual<typeof import('@ts/core/utils/m_selectors')>('@ts/core/utils/m_selectors'),
  isElementVisible: jest.fn(() => true),
}));

const add = <T extends HTMLElement>(element: T, parent: Node = document.body): T => {
  parent.appendChild(element);
  return element;
};

const button = (id: string): HTMLButtonElement => {
  const el = document.createElement('button');
  el.id = id;
  return el;
};

const setup = (): {
  before: HTMLButtonElement;
  container: HTMLDivElement;
  after: HTMLButtonElement;
} => {
  document.body.innerHTML = '';
  const before = add(button('before'));
  const container = add(document.createElement('div'));
  const after = add(button('after'));
  return { before, container, after };
};

describe('getNextFocusableElement', () => {
  it('returns the next focusable after the container', () => {
    const { container, after } = setup();

    expect(getNextFocusableElement(container)).toBe(after);
  });

  it('returns the closest neighbor when several elements are present', () => {
    const { container, after } = setup();
    const farAfter = add(button('far-after'));

    expect(getNextFocusableElement(container)).toBe(after);
    expect(getNextFocusableElement(container)).not.toBe(farAfter);
  });

  it('skips focusable elements located inside the container', () => {
    const { container, after } = setup();
    add(button('inside'), container);

    expect(getNextFocusableElement(container)).toBe(after);
  });

  it('returns null when there is no focusable element after the container', () => {
    const { container, after } = setup();
    after.remove();

    expect(getNextFocusableElement(container)).toBeNull();
  });
});

describe('getPreviousFocusableElement', () => {
  it('returns the previous focusable before the container', () => {
    const { before, container } = setup();

    expect(getPreviousFocusableElement(container)).toBe(before);
  });

  it('returns the closest neighbor when several elements are present', () => {
    const { before, container } = setup();
    const farBefore = add(button('far-before'), document.body);
    document.body.insertBefore(farBefore, before);

    expect(getPreviousFocusableElement(container)).toBe(before);
    expect(getPreviousFocusableElement(container)).not.toBe(farBefore);
  });

  it('skips focusable elements located inside the container', () => {
    const { before, container } = setup();
    add(button('inside'), container);

    expect(getPreviousFocusableElement(container)).toBe(before);
  });

  it('returns null when there is no focusable element before the container', () => {
    const { before, container } = setup();
    before.remove();

    expect(getPreviousFocusableElement(container)).toBeNull();
  });
});

describe('getFirstFocusableElement', () => {
  it('returns the first focusable element inside the root', () => {
    document.body.innerHTML = '';
    const root = add(document.createElement('div'));
    add(document.createElement('span'), root);
    const first = add(button('first'), root);
    add(button('second'), root);

    expect(getFirstFocusableElement(root)).toBe(first);
  });

  it('returns null when the root has no focusable elements', () => {
    document.body.innerHTML = '';
    const root = add(document.createElement('div'));
    add(document.createElement('span'), root);

    expect(getFirstFocusableElement(root)).toBeNull();
  });

  it('returns null when the root is null or undefined', () => {
    expect(getFirstFocusableElement(null)).toBeNull();
    expect(getFirstFocusableElement(undefined)).toBeNull();
  });
});
