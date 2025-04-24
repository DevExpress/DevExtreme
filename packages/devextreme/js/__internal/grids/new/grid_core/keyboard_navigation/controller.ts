/* eslint-disable spellcheck/spell-checker */
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import type { EventWithHandled } from '@ts/grids/new/grid_core/core/events/index';
import { OptionsController } from '@ts/grids/new/grid_core/options_controller/options_controller';

export class KeyboardNavigationController {
  private returnFocusTo?: HTMLElement;

  private firstCardElement?: HTMLElement;

  public static dependencies = [
    OptionsController,
  ] as const;

  public enabled = this.options.oneWay('keyboardNavigation.enabled');

  constructor(private readonly options: OptionsController) {}

  public setReturnFocusTo(element: HTMLElement | undefined): void {
    this.returnFocusTo = element;
  }

  public setFirstCardElement(element: HTMLElement | undefined): void {
    this.firstCardElement = element;
  }

  public returnFocus(): void {
    if (!this.returnFocusTo) {
      return;
    }

    if (this.returnFocusTo.isConnected) {
      this.returnFocusTo.focus();
    } else {
      this.firstCardElement?.focus();
    }

    this.returnFocusTo = undefined;
  }

  public onKeyDown(event: EventWithHandled<KeyboardEvent>): void {
    const action = this.options.action('onKeyDown').peek();
    action({
      handled: event.dxHandled ?? false,
      event,
      element: getPublicElement($(event.target as Element)),
    });
  }

  public onFocusedCardChanged(card: DataRow, cardIdx: number, element: HTMLElement): void {
    const action = this.options.action('onFocusedCardChanged').peek();
    action({
      cardIndex: cardIdx,
      card,
      cardElement: getPublicElement($(element as Element)),
    });
  }
}
