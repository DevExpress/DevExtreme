/* eslint-disable spellcheck/spell-checker */
import {
  afterEach, describe, expect, it,
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
  focusDecoy: 'dx-focus-decoy',
  focusTrapContent: 'dx-focus-trap-content',
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

      it('header items container should not render focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const headerPanelContent = container.querySelector(SELECTORS.headerPanelContent);
        const parentContainer = headerPanelContent?.parentElement;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe(null);
        expect(firstDecoy?.getAttribute(ATTRS.focusDecoy)).toBe(null);
        expect(lastDecoy?.getAttribute('tabindex')).toBe(null);
        expect(lastDecoy?.getAttribute(ATTRS.focusDecoy)).toBe(null);
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

      it('card content should not render focus decoys', () => {
        const { container } = setup({
          ...baseConfig,
          keyboardNavigation: { enabled: false },
        });

        const cardContent = container.querySelector(SELECTORS.cardContent);
        const parentContainer = cardContent?.parentElement;
        const firstDecoy = parentContainer?.firstElementChild;
        const lastDecoy = parentContainer?.lastElementChild;

        expect(firstDecoy?.getAttribute('tabindex')).toBe(null);
        expect(firstDecoy?.getAttribute(ATTRS.focusDecoy)).toBe(null);
        expect(lastDecoy?.getAttribute('tabindex')).toBe(null);
        expect(lastDecoy?.getAttribute(ATTRS.focusDecoy)).toBe(null);
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
      // TODO: Cover public action by tests
    });

    describe('onFocusedCardChanged', () => {
      // TODO: Cover public action by tests
    });
  });
});
