import { jest } from '@jest/globals';
import fx from '@js/common/core/animation/fx';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as CardViewProperties } from '@js/ui/card_view';
import CardView from '@js/ui/card_view';

import { CardViewModel } from '../model/card_view';

export const SELECTORS = {
  cardViewContainer: '#cardViewContainer',
};

export const CARD_VIEW_CONTAINER_ID = 'cardViewContainer';

export const createCardView = (
  options: CardViewProperties = {},
): Promise<{
  $container: dxElementWrapper;
  component: CardViewModel;
  instance: CardView;
}> => new Promise((resolve) => {
  const $container = $('<div>')
    .attr('id', CARD_VIEW_CONTAINER_ID)
    .appendTo(document.body);

  const cardViewOptions: CardViewProperties = {
    ...options,
  };

  const instance = new CardView($container.get(0) as HTMLDivElement, cardViewOptions);
  const component = new CardViewModel($container.get(0) as HTMLElement);

  jest.runAllTimers();

  resolve({
    $container,
    component,
    instance,
  });
});

export const beforeTest = (): void => {
  fx.off = true;
  jest.useFakeTimers();
};

export const afterTest = (): void => {
  const $container = $(SELECTORS.cardViewContainer);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cardView = ($container as any).dxCardView('instance') as CardView;

  cardView?.dispose();
  $container.remove();
  jest.clearAllMocks();
  jest.useRealTimers();
  fx.off = false;
};

export const flushAsync = async (): Promise<void> => {
  jest.runAllTimers();
  await Promise.resolve();
};
