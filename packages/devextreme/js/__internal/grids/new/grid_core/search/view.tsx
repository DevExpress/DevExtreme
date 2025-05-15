import type { TextBoxInstance } from '@js/ui/text_box';
import { effect, signal } from '@preact/signals-core';
import { ToolbarController } from '@ts/grids/new/grid_core/toolbar/controller';

import { OptionsController } from '../options_controller/options_controller';
import { SearchController } from './controller';
import { SearchUIController } from './controller_ui';
import { addSearchTextBox } from './utils';

export class SearchView {
  public static dependencies = [
    OptionsController,
    ToolbarController,
    SearchUIController,
    SearchController,
  ] as const;

  private searchTextBox: TextBoxInstance | null = null;

  constructor(
    private readonly options: OptionsController,
    private readonly toolbarController: ToolbarController,
    private readonly searchUIController: SearchUIController,
    private readonly searchController: SearchController,
  ) {
    const toolbarItem = addSearchTextBox(
      {
        placeholder: this.searchController.searchPlaceholder.value,
        value: this.searchController.searchTextOption.value,
        width: this.searchController.searchWidth.value,
        onValueChanged: (text): void => {
          this.searchController.updateSearchText(text);
        },
      },
      (component) => {
        this.searchTextBox = component;
      },
    );
    this.toolbarController.addDefaultItem(
      signal(toolbarItem),
      this.options.oneWay('searchPanel.visible'),
    );

    effect(() => {
      // eslint-disable-next-line
      const value = this.searchController.searchTextOption.value;
      const placeholder = this.searchController.searchPlaceholder.value;
      const width = this.searchController.searchWidth.value;

      this.searchTextBox?.option('value', value);
      this.searchTextBox?.option('placeholder', placeholder);
      this.searchTextBox?.option('width', width);
    });

    this.searchUIController.registerCallback('focusSearchTextBox', () => {
      this.searchTextBox?.focus();
    });
  }
}
