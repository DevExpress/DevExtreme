import type { WidgetName } from '../types';
import GridCore from '../gridCore';
import { CLASS as CLASS_BASE } from '../gridCore';
import Card from './card';

export const CLASS = {
    ...CLASS_BASE,
    cardView: 'dx-cardview',
    headers: 'headers',
    headerItem: 'header-item',
    card: 'card',
}

export default class CardView extends GridCore {
  constructor(id: string | Selector) {
    super(id);
  }

  getName(): WidgetName { return 'dxCardView'; }

  getCompatibilityName(): WidgetName { return 'dxDataGrid'; }

  getContainer(): Selector {
    return this.element.find(`.${CLASS.cardView}`);
  }

  getCards(): Selector {
    return this.element.find(`.${this.addWidgetPrefix(CLASS.card)}`);
  }

  getCard(nth = 0): Card {
    return new Card(this.getCards().nth(nth));
  }
}
