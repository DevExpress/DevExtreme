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

  getContainer(): Selector {
    return this.element.find(`.${CLASS.cardView}`);
  }

  getCard(nth = 0): Card {
    const cards = this.element.find(`.${this.addWidgetPrefix(CLASS.card)}`);
    return new Card(cards.nth(nth));
  }
}
