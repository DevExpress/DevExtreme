import { ClientFunction, Selector } from 'testcafe';
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

  apiColumnOption(id: string, name: string, value: any = 'empty'): Promise<any> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const grid = getInstance() as any;
        return value !== 'empty' ? grid.columnOption(id, name, value === 'undefined' ? undefined : value) : grid.columnOption(id, name);
      },
      {
        dependencies: {
          getInstance, id, name, value,
        },
      },
    )();
  }
}
