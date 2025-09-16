import type { WidgetName } from '../types';
import GridCore from '../gridCore';
import { CLASS as CLASS_BASE } from '../gridCore';
import Card from './card';
import HeadersElement from './headers/headers';
import HeaderPanel from './headerPanel';
import Toolbar from './toolbar';
import Popup from "../popup";
import List from "../list";
import { ClientFunction, Selector} from "testcafe";
import TreeView from '../treeView';

export const CLASS = {
    ...CLASS_BASE,
    cardView: 'dx-cardview',
    cardViewContent: 'dx-cardview-content',
    selectCheckBoxesHidden: 'dx-cardview-select-checkboxes-hidden',
    headers: 'headers',
    headerContainer: 'header-container',
    headerItem: 'header-item',
    headerFilterMenu: 'dx-header-filter-menu',
    card: 'card',
    toolbar: 'dx-toolbar',
    popup: 'dx-popup-normal'
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

  getHeaders(): HeadersElement {
    const selector = this.element.find(`.${this.addWidgetPrefix(CLASS.headers)}`)
    return new HeadersElement(selector, this.getName());
  }

  getHeaderPanel(): HeaderPanel {
      const panelElement = this.element.find(`.${this.addWidgetPrefix(CLASS.headers)}`);
      return new HeaderPanel(panelElement, this.getName());
  }

  getHeaderFilterPopup(): Popup {
      const popupElement = this.element.find(`.${CLASS.headerFilterMenu}`);
      return new Popup(popupElement);
  }

  getEditingPopup(): Selector {
    return Selector(`.${CLASS.popup}`);
  }

  getHeaderFilterList(): List {
      const popup = this.getHeaderFilterPopup();
      const listElement = popup.getWrapper().find(`.dx-list`);
      return new List(listElement);
  }

  getHeaderFilterTreeView(): TreeView {
    const popup = this.getHeaderFilterPopup();
    const treeViewElement = popup.getWrapper().find(`.dx-treeview`);
    return new TreeView(treeViewElement);
}

  getColumnOption(columnName: string): Promise<Record<string, any>> {
      const { getInstance } = this;

      return ClientFunction(
          () => (getInstance() as any).columnOption(columnName),
          { dependencies: { getInstance, columnName } },
      )();
  }

  getSelectedCardKeys(): Promise<Record<string, any>> {
    const { getInstance } = this;

    return ClientFunction(
        () => (getInstance() as any).getSelectedCardKeys(),
        { dependencies: { getInstance } },
    )();
  }

  getToolbar(): Toolbar {
    return new Toolbar(
      this
        .element
        .find(`.${this.addWidgetPrefix(CLASS.headerContainer)} .${CLASS.toolbar}`),
    );
  }

  isCheckBoxesHidden(): Promise<boolean> {
    return this.element.find(`.${CLASS.cardViewContent}`).hasClass(`${CLASS.selectCheckBoxesHidden}`);
  }

  isReady(): Promise<boolean> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).isReady(),
      { dependencies: { getInstance } },
    )();
  }

  apiPageIndex(pageIndex: number): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
        () => (getInstance() as any).pageIndex(pageIndex),
        { dependencies: { getInstance, pageIndex } },
    )();
  }
}
