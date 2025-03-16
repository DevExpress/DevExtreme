import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import Pager from '../pagination';
import FilterPanel from './filter/panel';
import type { WidgetName } from '../types';

export const CLASS = {
    pager: 'pager',
    pagination: 'pagination',
    filterPanel: 'filter-panel',
}

export default abstract class GridCore extends Widget {
  body: Selector;

  constructor(id: string | Selector) {
    super(id);

    this.body = Selector('body');
  }

  addWidgetPrefix(className = '', isCompatibilityMode = false): string {
    const name = isCompatibilityMode ? this.getCompatibilityName() : this.getName();
    return Widget.addClassPrefix(name, className);
  }

  apiOption(name: string, value: any = 'empty'): Promise<any> {
    const { getInstance } = this;

    return ClientFunction(
      () => {
        const dataGrid = getInstance() as any;
        return value !== 'empty' ? dataGrid.option(name, value === 'undefined' ? undefined : value) : dataGrid.option(name);
      },
      {
        dependencies: {
          getInstance, name, value,
        },
      },
    )();
  }

  getPager(): Pager {
    return new Pager(this.element.find(`.${this.addWidgetPrefix(CLASS.pager)}, .dx-${CLASS.pagination}`));
  }

  getCompatibilityName(): WidgetName {
    return this.getName();
  }

  getFilterPanel(): FilterPanel {
    return new FilterPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.filterPanel, true)}`), this.getCompatibilityName());
  }

  apiClearFilter(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).clearFilter(),
      { dependencies: { getInstance } },
    )();
  }
}
