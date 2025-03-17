import type { WidgetName } from '../types';
import GridCore from '../gridCore';
import { CLASS as CLASS_BASE } from '../gridCore';
import Card from './card';
import HeaderPanel from './headerPanel';
import Popup from "../popup";
import List from "../list";
import {ClientFunction} from "testcafe";

export const CLASS = {
    ...CLASS_BASE,
    cardView: 'dx-cardview',
    headers: 'headers',
    headerItem: 'header-item',
    headerFilterMenu: 'dx-header-filter-menu',
    card: 'card',
}

export default class CardView extends GridCore {
  constructor(id: string | Selector) {
    super(id);
  }

  getName(): WidgetName { return 'dxCardView'; }

  // --- Markup ---
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

  getHeaderPanel(): HeaderPanel {
      const panelElement = this.element.find(`.${this.addWidgetPrefix(CLASS.headers)}`);
      return new HeaderPanel(panelElement);
  }

  getHeaderFilterPopup(): Popup {
      const popupElement = this.element.find(`.${CLASS.headerFilterMenu}`);
      return new Popup(popupElement);
  }

  getHeaderFilterList(): List {
      const popup = this.getHeaderFilterPopup();
      const listElement = popup.getWrapper().find(`.dx-list`);
      return new List(listElement);
  }

  getColumnOption(columnName: string): Promise<Record<string, any>> {
      const { getInstance } = this;

      return ClientFunction(
          () => (getInstance() as any).columnOption(columnName),
          { dependencies: { getInstance, columnName } },
      )();
  }
}
