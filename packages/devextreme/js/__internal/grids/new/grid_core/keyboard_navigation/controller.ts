/* eslint-disable spellcheck/spell-checker */
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { OptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller';

import type { EventWithHandled } from './types';

export class KeyboardNavigationController {
  public static dependencies = [
    OptionsController,
  ] as const;

  public enabled = this.options.oneWay('keyboardNavigation.enabled');

  constructor(private readonly options: OptionsController) {}

  public onKeyDown(event: EventWithHandled<KeyboardEvent>): void {
    const action = this.options.action('onKeyDown').unreactive_get();
    action({
      handled: event.handled ?? false,
      event,
      element: getPublicElement($(event.target as Element)),
    });
  }

  public onFocusedCardChanged(card: DataRow, cardIdx: number, element: HTMLElement): void {
    const action = this.options.action('onFocusedCardChanged').unreactive_get();
    action({
      cardIndex: cardIdx,
      card,
      cardElement: getPublicElement($(element as Element)),
    });
  }
}
