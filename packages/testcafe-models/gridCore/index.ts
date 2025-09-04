import { ClientFunction, Selector } from 'testcafe';
import Widget from '../internal/widget';
import Pager from '../pagination';
import FilterPanel from './filter/panel';
import ColumnChooser from '../dataGrid/columnChooser';
import type { WidgetName } from '../types';
import TextBox from '../textBox';
import ContextMenu from '../contextMenu';
import LoadPanel from '../loadPanel/index';

export const CLASS = {
    pager: 'pager',
    pagination: 'pagination',
    filterPanel: 'filter-panel',
    columnChooser: 'column-chooser',
    columnChooserButton: 'column-chooser-button',
    searchBox: 'dx-searchbox',
    contextMenu: 'dx-context-menu',
    loadPanel: 'dx-loadpanel',
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

  getPager(): Pager {
    return new Pager(this.element.find(`.${this.addWidgetPrefix(CLASS.pager)}, .dx-${CLASS.pagination}`));
  }

  getColumnChooser(): ColumnChooser {
    return new ColumnChooser(this.body.find(`.${this.addWidgetPrefix(CLASS.columnChooser)}`));
  }

  getColumnChooserButton(): Selector {
    return this.element.find(`.${this.addWidgetPrefix(CLASS.columnChooserButton)}`);
  }

  getCompatibilityName(): WidgetName {
    return this.getName();
  }

  getFilterPanel(): FilterPanel {
    return new FilterPanel(this.element.find(`.${this.addWidgetPrefix(CLASS.filterPanel, true)}`), this.getCompatibilityName());
  }

  getSearchBox(): TextBox {
    return new TextBox(this.element.find(`.${CLASS.searchBox}`));
  }

  getContextMenu(): ContextMenu {
    return new ContextMenu(this.body.find(`.${CLASS.contextMenu}.${this.addWidgetPrefix()}`));
  }

  getElementOffset(): Promise<{ left: number; top: number }> {
    return this.element.boundingClientRect.then((rect) => ({
      left: rect.left,
      top: rect.top,
    }));
  }

  getLoadPanel(): LoadPanel {
    return new LoadPanel(this.element.find(`.${CLASS.loadPanel}`));
  }

  apiFilter(filter: any[]): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).filter(filter),
      { dependencies: { getInstance, filter } },
    )();
  }

  apiClearFilter(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).clearFilter(),
      { dependencies: { getInstance } },
    )();
  }

  apiShowColumnChooser(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).showColumnChooser(),
      { dependencies: { getInstance } },
    )();
  }

  apiHideColumnChooser(): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).hideColumnChooser(),
      { dependencies: { getInstance } },
    )();
  }

  apiSearchByText(text: string): Promise<void> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).searchByText(text),
      {
        dependencies: {
          getInstance, text
        },
      },
    )();
  }

  apiGetCombinedFilter(): Promise<unknown> {
    const { getInstance } = this;

    return ClientFunction(
      () => (getInstance() as any).getCombinedFilter(),
      {
        dependencies: {
          getInstance,
        },
      },
    )();
  }
}
