import type { Locator, Page } from '@playwright/test';
import type { WidgetName } from '../types';
import Widget from '../internal/widget';
import TextBox from '../textBox';
import ColumnChooser from '../dataGrid/columnChooser';
import FilterPanel from './filter/panel';

export const CLASS = {
  filterPanel: 'filter-panel',
  columnChooser: 'column-chooser',
  columnChooserButton: 'column-chooser-button',
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

  public getColumnChooser(): ColumnChooser {
    return new ColumnChooser(this.body.locator(`.${this.addWidgetPrefix(CLASS.columnChooser)}`));
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

  public getSearchBox(): TextBox {
    return new TextBox(this.page, this.element.locator(`.${CLASS.searchBox}`));
  }

  public isReady(): Promise<boolean> {
    return this.invoke('isReady');
  }

  public async apiShowColumnChooser(): Promise<void> {
    await this.invoke('showColumnChooser');
  }
}
