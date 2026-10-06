import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';

import { isLayoutApplied, ResizableContainer } from '../resizable_container';

function createElement(style: Partial<CSSStyleDeclaration>): HTMLDivElement {
  const element = document.createElement('div');
  Object.assign(element.style, style);
  document.body.appendChild(element);
  return element;
}

interface Elements {
  parent: HTMLDivElement;
  pages?: HTMLDivElement;
  allowedPageSizes?: HTMLDivElement;
  info?: HTMLDivElement;
}

function createContainer({
  parent, pages, allowedPageSizes, info,
}: Elements): ResizableContainer {
  const container = new ResizableContainer({
    paginationProps: {},
    contentTemplate: (): null => null,
  } as never);

  jest.spyOn(container, 'setState').mockImplementation((updater): void => {
    const update = typeof updater === 'function' ? updater(container.state, container.props) : updater;
    container.state = { ...container.state, ...update };
  });

  Object.assign(container, {
    parentRef: { current: parent },
    pagesRef: { current: pages ?? null },
    allowedPageSizesRef: { current: allowedPageSizes ?? null },
    infoTextRef: { current: info ?? null },
  });

  return container;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('isLayoutApplied', () => {
  it('is false while the pager containers are plain block-level elements', () => {
    const pages = createElement({ width: '1000px' });
    const allowedPageSizes = createElement({ width: '1000px' });

    expect(isLayoutApplied({ pages, allowedPageSizes, info: null })).toBe(false);

    pages.style.display = 'inline-block';

    expect(isLayoutApplied({ pages, allowedPageSizes, info: null })).toBe(false);

    allowedPageSizes.style.cssFloat = 'left';

    expect(isLayoutApplied({ pages, allowedPageSizes, info: null })).toBe(true);
  });

  it('is false while the info text is a plain block-level element', () => {
    const info = createElement({ width: '1000px' });

    expect(isLayoutApplied({ pages: null, allowedPageSizes: null, info })).toBe(false);

    info.style.display = 'inline-block';

    expect(isLayoutApplied({ pages: null, allowedPageSizes: null, info })).toBe(true);
  });

  it('ignores containers that are not rendered', () => {
    expect(isLayoutApplied({ pages: null, allowedPageSizes: undefined, info: null })).toBe(true);
  });
});

describe('ResizableContainer adaptivity', () => {
  it('does not switch to compact mode from a measurement taken before the theme css is applied', () => {
    const parent = createElement({ width: '1000px' });
    const pages = createElement({ width: '1000px' });
    const container = createContainer({ parent, pages });

    container.updateAdaptivityProps();

    expect(container.state.isLargeDisplayMode).toBe(true);

    pages.style.display = 'inline-block';
    pages.style.width = '300px';
    container.updateAdaptivityProps();

    expect(container.state.isLargeDisplayMode).toBe(true);
  });

  it('keeps switching between the modes once the theme css is applied', () => {
    const parent = createElement({ width: '1000px' });
    const pages = createElement({ width: '1000px' });
    const container = createContainer({ parent, pages });

    container.updateAdaptivityProps();
    pages.style.display = 'inline-block';
    pages.style.width = '300px';
    container.updateAdaptivityProps();

    parent.style.width = '200px';
    container.updateAdaptivityProps();

    expect(container.state.isLargeDisplayMode).toBe(false);

    parent.style.width = '1000px';
    container.updateAdaptivityProps();

    expect(container.state.isLargeDisplayMode).toBe(true);
  });

  it('keeps the current mode while the theme css is unavailable', () => {
    const parent = createElement({ width: '200px' });
    const pages = createElement({ width: '300px', display: 'inline-block' });
    const container = createContainer({ parent, pages });

    container.updateAdaptivityProps();

    expect(container.state.isLargeDisplayMode).toBe(false);

    pages.style.display = 'block';
    pages.style.width = '200px';
    parent.style.width = '1000px';
    container.updateAdaptivityProps();

    expect(container.state.isLargeDisplayMode).toBe(false);
  });

  it('does not hide the info text from a measurement taken before the theme css is applied', () => {
    const parent = createElement({ width: '1000px' });
    const info = createElement({ width: '1000px' });
    const container = createContainer({ parent, info });

    container.updateAdaptivityProps();

    expect(container.state.infoTextVisible).toBe(true);

    info.style.display = 'inline-block';
    info.style.width = '150px';
    container.updateAdaptivityProps();

    expect(container.state.infoTextVisible).toBe(true);

    parent.style.width = '100px';
    container.updateAdaptivityProps();

    expect(container.state.infoTextVisible).toBe(false);
  });
});
