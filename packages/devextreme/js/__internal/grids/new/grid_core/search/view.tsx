import messageLocalization from '@js/localization/message';
import type { TextBoxInstance } from '@js/ui/text_box';
import type { Signal } from '@preact/signals-core';
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

  private readonly searchTextBox: Signal<null | TextBoxInstance> = signal(null);

  constructor(
    private readonly options: OptionsController,
    private readonly toolbarController: ToolbarController,
    private readonly searchUIController: SearchUIController,
    private readonly searchController: SearchController,
  ) {
    const toolbarItem = addSearchTextBox(
      {
        placeholder: this.getPlaceholder(),
        value: this.searchController.searchTextOption.value,
        width: this.searchController.searchWidth.value,
        onValueChanged: (text): void => {
          this.searchController.updateSearchText(text);
        },
      },
      (component) => {
        this.searchTextBox.value = component;
      },
    );
    this.toolbarController.addDefaultItem(
      signal(toolbarItem),
      this.options.oneWay('searchPanel.visible'),
    );

    effect(() => {
      this.searchTextBox.value?.option('value', this.searchController.searchTextOption.value);
      this.searchTextBox.value?.option('placeholder', this.getPlaceholder());
      this.searchTextBox.value?.option('width', this.searchController.searchWidth.value);
    });

    this.searchUIController.registerCallback('focusSearchTextBox', () => {
      this.searchTextBox.value?.focus();
    });
  }

  private getPlaceholder(): string {
    return this.searchController.searchPlaceholder.value
      ?? messageLocalization.format('dxDataGrid-searchPanelPlaceholder');
  }
}
