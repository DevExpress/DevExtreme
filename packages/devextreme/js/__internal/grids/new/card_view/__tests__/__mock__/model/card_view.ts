import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type CardView from '@js/ui/card_view';
import { GridCoreModel } from '@ts/grids/grid_core/__tests__/__mock__/model/grid_core';

import { HeaderPanelModel } from './header_panel';

const CLASSES = {
  card: 'dx-card',
};

export class CardViewModel extends GridCoreModel<CardView> {
  protected NAME = 'dxCardView';

  protected getFilterPanelPrefix(): string {
    return 'datagrid';
  }

  public getInstance(): CardView {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return ($(this.root) as any).dxCardView('instance') as CardView;
  }

  public getCards(): NodeListOf<HTMLElement> {
    return this.root.querySelectorAll(`.${CLASSES.card}`);
  }

  public getCard(cardIndex: number): dxElementWrapper {
    return $(this.getCards()[cardIndex]);
  }

  public getHeaderPanel(): HeaderPanelModel {
    return new HeaderPanelModel(this.root);
  }
}
