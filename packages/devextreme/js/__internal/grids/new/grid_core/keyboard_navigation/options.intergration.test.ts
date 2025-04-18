/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import $ from '@js/core/renderer';
import CardView from '@ts/grids/new/card_view/widget';
import type { Options as GridCoreOptions } from '@ts/grids/new/grid_core/options';
import { rerender } from 'inferno';

const SELECTORS = {
  cardView: '.dx-cardview',
  headerPanelContent: '.dx-cardview-headerpanel-content',
  headerItem: '.dx-cardview-header-item',
  cardContainer: '.dx-cardview-content',
  card: '.dx-cardview-card',
  cardContent: '.dx-cardview-card-content',
};

const ATTRS = {
  focusDecoy: 'data-dx-focus-decoy',
  focusTrapContent: 'data-dx-focus-trap-content',
};

const rootQuerySelector = (selector: string) => document.body.querySelector(selector);

const setup = (options: GridCoreOptions = {}) => {
  const container = document.createElement('div');
  const { body } = document;
  body.append(container);

  const cardView = new CardView(container, options);

  rerender();

  return { container, cardView };
};

const baseConfig: GridCoreOptions = {
  dataSource: new Array(6).fill(null).map((_, idx) => ({ id: idx })),
  keyExpr: 'id',
  columns: ['id'],
};

describe('Options', () => {
  afterEach(() => {
    const cardView = rootQuerySelector(SELECTORS.cardView);
    // @ts-expect-error bad typed renderer
    $(cardView ?? undefined as any)?.dxCardView('dispose');
  });

  describe('KeyboardNavigation', () => {
    describe('enabled: true', () => {
      it('header items should contain tabindex=0', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
        });

        const headerItem = container.querySelector(SELECTORS.headerItem);
        expect(headerItem?.getAttribute('tabindex')).toBe('0');
      });

      it('header items container should render focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
        });

        const headerPanelContent = container.querySelector(SELECTORS.headerPanelContent);
        const parentContainer = headerPanelContent?.parentElement;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe('0');
        expect(firstDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('true');
        expect(lastDecoy?.getAttribute('tabindex')).toBe('0');
        expect(lastDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('true');
      });

      it('cards should contain tabindex=0', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
        });

        const card = container.querySelector(SELECTORS.card);
        expect(card?.getAttribute('tabindex')).toBe('0');
      });

      it('card content should render focus trap container', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
        });

        const cardContent = container.querySelector(SELECTORS.cardContent);
        const focusTrapNode = cardContent?.parentElement;

        expect(focusTrapNode?.getAttribute(ATTRS.focusTrapContent)).toBe('true');
      });

      it('card content should render focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
        });

        const cardContent = container.querySelector(SELECTORS.cardContent);
        const parentContainer = cardContent?.parentElement;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe('0');
        expect(firstDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('true');
        expect(lastDecoy?.getAttribute('tabindex')).toBe('0');
        expect(lastDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('true');
      });

      it('cards container should render focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
        });

        const cardsContainer = container.querySelector(SELECTORS.cardContainer);
        const parentContainer = cardsContainer?.parentNode;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe('0');
        expect(lastDecoy?.getAttribute('tabindex')).toBe('0');
      });
    });

    describe('enabled: false', () => {
      it('header items should not contain tabindex', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const headerItem = container.querySelector(SELECTORS.headerItem);
        expect(headerItem?.getAttribute('tabindex')).toBe(null);
      });

      it('header items container should not has active focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const headerPanelContent = container.querySelector(SELECTORS.headerPanelContent);
        const parentContainer = headerPanelContent?.parentElement;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe(null);
        expect(firstDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('false');
        expect(lastDecoy?.getAttribute('tabindex')).toBe(null);
        expect(lastDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('false');
      });

      it('cards should not contain tabindex', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const card = container.querySelector(SELECTORS.card);
        expect(card?.getAttribute('tabindex')).toBe(null);
      });

      it('card content should render focus trap container', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const cardContent = container.querySelector(SELECTORS.cardContent);
        const focusTrapNode = cardContent?.parentElement;

        expect(focusTrapNode?.getAttribute(ATTRS.focusTrapContent)).toBe('false');
      });

      it('card content should not has active focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const cardContent = container.querySelector(SELECTORS.cardContent);
        const parentContainer = cardContent?.parentElement;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe(null);
        expect(firstDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('false');
        expect(lastDecoy?.getAttribute('tabindex')).toBe(null);
        expect(lastDecoy?.getAttribute(ATTRS.focusDecoy)).toBe('false');
      });

      it('cards container should not render focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const cardsContainer = container.querySelector(SELECTORS.cardContainer);
        const parentContainer = cardsContainer?.parentNode;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe(null);
        expect(lastDecoy?.getAttribute('tabindex')).toBe(null);
      });
    });

    describe('onKeyDown', () => {
      it('common API contract test', () => {
        const callbackMock = jest.fn();
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
          onKeyDown: callbackMock,
        });

        const headerItem = container.querySelector(SELECTORS.headerItem);
        headerItem?.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

        expect(callbackMock).toHaveBeenCalledTimes(1);
        const [[{
          handled, event, element, component,
        }]] = callbackMock.mock.calls as any;
        expect(handled).toBe(false);
        expect(event).toStrictEqual(expect.any(KeyboardEvent));
        expect(element).toStrictEqual(expect.any(HTMLDivElement));
        expect(component).toStrictEqual(expect.any(CardView));
      });

      it.each([
        'Escape', ' ', 'ArrowDown', 'ArrowUp', 'B',
      ])('should be called with unhandled events on header item: "%s"', (key) => {
        const callbackMock = jest.fn();
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
          onKeyDown: callbackMock,
        });

        const headerItem = container.querySelector(SELECTORS.headerItem);
        headerItem?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

        expect(callbackMock).toHaveBeenCalledTimes(1);
        const [[{
          handled, event: { key: eventKey },
        }]] = callbackMock.mock.calls as any;
        expect(handled).toBe(false);
        expect(eventKey).toBe(key);
      });

      it.each([
        'ArrowRight', 'ArrowLeft', 'Enter',
      ])('should be called with handled events on header item: "%s"', (key) => {
        const callbackMock = jest.fn();
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
          onKeyDown: callbackMock,
        });

        const headerItem = container.querySelector(SELECTORS.headerItem);
        headerItem?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

        expect(callbackMock).toHaveBeenCalledTimes(1);
        expect(callbackMock).toHaveBeenCalledTimes(1);
        const [[{
          handled, event: { key: eventKey },
        }]] = callbackMock.mock.calls as any;
        expect(handled).toBe(true);
        expect(eventKey).toBe(key);
      });

      it.each([
        'a', ' ',
      ])('should be called with unhandled events on card: "%s"', (key) => {
        const callbackMock = jest.fn();
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
          onKeyDown: callbackMock,
        });

        const card = container.querySelector(SELECTORS.headerItem);
        card?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

        expect(callbackMock).toHaveBeenCalledTimes(1);
        const [[{
          handled, event: { key: eventKey },
        }]] = callbackMock.mock.calls as any;
        expect(handled).toBe(false);
        expect(eventKey).toBe(key);
      });

      it.each([
        'ArrowRight', 'ArrowLeft', 'Enter',
      ])('should be called with handled events on card: "%s"', (key) => {
        const callbackMock = jest.fn();
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
          onKeyDown: callbackMock,
        });

        const card = container.querySelector(SELECTORS.headerItem);
        card?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

        expect(callbackMock).toHaveBeenCalledTimes(1);
        const [[{
          handled, event: { key: eventKey },
        }]] = callbackMock.mock.calls as any;
        expect(handled).toBe(true);
        expect(eventKey).toBe(key);
      });
    });

    describe('onFocusedCardChanged', () => {
      it('common API contract test', () => {
        const callbackMock = jest.fn();
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: true },
          onFocusedCardChanged: callbackMock,
        });

        const cardElement = container.querySelector(SELECTORS.card);
        cardElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));

        expect(callbackMock).toHaveBeenCalledTimes(1);
        const [[{
          cardIndex, card, element, component,
        }]] = callbackMock.mock.calls as any;
        expect(cardIndex).toEqual(1);
        expect(card).toMatchSnapshot();
        expect(element).toStrictEqual(expect.any(HTMLDivElement));
        expect(component).toStrictEqual(expect.any(CardView));
      });

      it.each([
        { idx: 0, keys: ['ArrowRight', 'ArrowRight'], path: [1, 2] },
        { idx: 1, keys: ['ArrowRight', 'ArrowLeft'], path: [1, 0] },
        { idx: 2, keys: ['ArrowRight', 'ArrowLeft'], path: [1, 0] },
        { idx: 3, keys: ['ArrowDown', 'ArrowRight'], path: [3, 4] },
        { idx: 4, keys: ['ArrowDown', 'ArrowUp'], path: [3, 0] },
        { idx: 4, keys: ['ArrowDown', 'ArrowRight', 'ArrowDown', 'ArrowLeft'], path: [3, 4, 7, 6] },
        { idx: 4, keys: ['ArrowRight', 'ArrowRight', 'ArrowRight', 'ArrowRight'], path: [1, 2] },
        { idx: 4, keys: ['ArrowLeft', 'ArrowLeft', 'ArrowLeft', 'ArrowLeft'], path: [] },
        { idx: 4, keys: ['ArrowDown', 'ArrowDown', 'ArrowDown', 'ArrowDown'], path: [3, 6] },
        { idx: 4, keys: ['ArrowUp', 'ArrowUp', 'ArrowUp', 'ArrowUp'], path: [] },
      ])('should fire event after each card focus change -> case #$idx', ({ keys, path }) => {
        const callbackMock = jest.fn();
        const { container } = setup({
          dataSource: new Array(9).fill(null).map((_, idx) => ({ id: idx })),
          keyExpr: 'id',
          columns: ['id'],
          keyboardNavigation: { enabled: true },
          paging: {
            pageSize: 9,
          },
          onFocusedCardChanged: callbackMock,
        });

        const cardElement = container.querySelector(SELECTORS.card);
        keys.forEach((key) => {
          cardElement?.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
        });

        const result = callbackMock.mock.calls
          .flat<any>()
          .map(({ cardIndex }) => cardIndex);
        expect(result).toStrictEqual(path);
      });
    });
  });
});
