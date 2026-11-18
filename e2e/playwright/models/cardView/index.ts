import type { Locator } from '@playwright/test';
import type { WidgetName } from '../types';
import GridCore, { CLASS as CLASS_BASE } from '../gridCore';
import Card from './card';
import HeadersElement from './headers/headers';
import HeaderPanel from './headerPanel';
import Toolbar from './toolbar';

export const CLASS = {
  ...CLASS_BASE,
  headers: 'headers',
  headerContainer: 'header-container',
  card: 'card',
  toolbar: 'dx-toolbar',
};

export default class CardView extends GridCore {
  // eslint-disable-next-line class-methods-use-this
  public getName(): WidgetName { return 'dxCardView'; }

  // eslint-disable-next-line class-methods-use-this
  public getCompatibilityName(): WidgetName { return 'dxDataGrid'; }

  public getCards(): Locator {
    return this.element.locator(`.${this.addWidgetPrefix(CLASS.card)}`);
  }

  public getCard(nth = 0): Card {
    return new Card(this.getCards().nth(nth));
  }

  public getHeaders(): HeadersElement {
    return new HeadersElement(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.headers)}`),
      this.getName(),
    );
  }

  public getHeaderPanel(): HeaderPanel {
    return new HeaderPanel(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.headers)}`),
      this.getName(),
    );
  }

  public getToolbar(): Toolbar {
    return new Toolbar(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.headerContainer)} .${CLASS.toolbar}`),
    );
  }
}
