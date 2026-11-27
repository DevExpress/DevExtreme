import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import Overlay from '../overlay';
import Pagination from '../pagination';
import TextBox from '../textBox';
import ColumnChooser from './columnChooser';
import FilterPanel from './filter/panel';

export const CLASS = {
  filterPanel: 'filter-panel',
  columnChooser: 'column-chooser',
  columnChooserButton: 'column-chooser-button',
  loadPanel: 'dx-loadpanel',
  pager: 'pager',
  pagination: 'dx-pagination',
  searchBox: 'dx-searchbox',
};

export default abstract class GridCore extends Widget {
  public readonly body: Locator;

  abstract compatibilityName: WidgetName | undefined;

  constructor(page: Page, selector: Locator | string) {
    super(page, selector);

    this.body = page.locator('body');
  }

  public addWidgetPrefix(className = '', isCompatibilityMode = false): string {
    const name = isCompatibilityMode ? this.getCompatibilityName() : this.getName();

    return Widget.addClassPrefix(name, className);
  }

  public apiOption(name: string, ...value: unknown[]): Promise<any> {
    return this.invoke('option', name, ...value);
  }

  public apiColumnOption(id: string, name: string): Promise<unknown> {
    return this.invoke('columnOption', id, name);
  }

  public getColumnChooser(): ColumnChooser {
    return new ColumnChooser(
      this.body.locator(`.${this.addWidgetPrefix(CLASS.columnChooser)}`),
      this.getName(),
    );
  }

  public getColumnChooserButton(): Locator {
    return this.element.locator(`.${this.addWidgetPrefix(CLASS.columnChooserButton)}`);
  }

  public getCompatibilityName(): WidgetName {
    return this.compatibilityName ?? this.name;
  }

  public getFilterPanel(): FilterPanel {
    return new FilterPanel(
      this.element.locator(`.${this.addWidgetPrefix(CLASS.filterPanel, true)}`),
      this.getCompatibilityName(),
    );
  }

  public getLoadPanel(): Overlay {
    return new Overlay(this.page, this.element.locator(`.${CLASS.loadPanel}`));
  }

  public getPager(): Pagination {
    return new Pagination(
      this.page,
      this.element.locator(`.${this.addWidgetPrefix(CLASS.pager)}, .${CLASS.pagination}`),
    );
  }

  public getSearchBox(): TextBox {
    return new TextBox(this.page, this.element.locator(`.${CLASS.searchBox}`));
  }

  public isReady(): Promise<boolean> {
    return this.invoke('isReady');
  }

  public async apiFilter(filter: unknown[]): Promise<void> {
    await this.invoke('filter', filter);
  }

  public async apiClearFilter(): Promise<void> {
    await this.invoke('clearFilter');
  }

  public async apiShowColumnChooser(): Promise<void> {
    await this.invoke('showColumnChooser');
  }
}
