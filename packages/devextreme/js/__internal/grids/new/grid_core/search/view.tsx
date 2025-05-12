import type { TextBoxInstance } from '@js/ui/text_box';
import type { Signal } from '@preact/signals-core';
import { effect, signal } from '@preact/signals-core';
import { ToolbarController } from '@ts/grids/new/grid_core/toolbar/controller';

import { OptionsController } from '../options_controller/options_controller';
import { SearchController } from './controller';
import { SearchUIController } from './controller_ui';
import type { SearchFieldProps } from './types';
import { addSearchTextBox } from './utils';

export class SearchView {
  public static dependencies = [
    OptionsController,
    ToolbarController,
    SearchUIController,
    SearchController,
  ] as const;

  private searchTextBox: TextBoxInstance | null = null;

  private readonly searchFieldProps: Signal<SearchFieldProps>;

  constructor(
    private readonly options: OptionsController,
    private readonly toolbarController: ToolbarController,
    private readonly searchUIController: SearchUIController,
    private readonly searchController: SearchController,
  ) {
    this.searchFieldProps = signal<SearchFieldProps>({
      placeholder: this.options.oneWay('searchPanel.placeholder').value,
      value: this.searchController.searchTextOption.value,
      width: this.options.oneWay('searchPanel.width').value,
      onValueChanged: (text): void => {
        this.searchController.updateSearchText(text);
      },
    });

    const toolbarItem = addSearchTextBox(
      this.searchFieldProps.value,
      (component) => {
        this.searchTextBox = component;
      },
    );
    this.toolbarController.addDefaultItem(
      signal(toolbarItem),
      this.options.oneWay('searchPanel.visible'),
    );

    effect(() => {
      this.searchFieldProps.value = {
        placeholder: this.options.oneWay('searchPanel.placeholder').value,
        value: this.searchController.searchTextOption.value,
        width: this.options.oneWay('searchPanel.width').value,
        onValueChanged: (text): void => {
          this.searchController.updateSearchText(text);
        },
      };

      if (this.searchTextBox) {
        this.searchTextBox.option('value', this.searchController.searchTextOption.value);
        this.searchTextBox.option('placeholder', this.options.oneWay('searchPanel.placeholder').value);
        this.searchTextBox.option('width', this.options.oneWay('searchPanel.width').value);
      }
    });

    this.searchUIController.registerCallback('focusSearchTextBox', () => {
      this.searchTextBox?.focus();
    });
  }
}
