import { Selector } from 'testcafe';
import Widget from '../internal/widget';
import Pager from '../pagination';

export const CLASS = {
    pager: 'pager',
    pagination: 'pagination',
}

export default abstract class GridCore extends Widget {
  body: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.body = Selector('body');
  }

  addWidgetPrefix(className = ''): string {
    return Widget.addClassPrefix(this.getName(), className);
  }

  getPager(): Pager {
    return new Pager(this.element.find(`.${this.addWidgetPrefix(CLASS.pager)}, .dx-${CLASS.pagination}`));
  }
}
