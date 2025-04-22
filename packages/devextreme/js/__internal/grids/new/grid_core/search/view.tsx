import type { TextBoxInstance } from '@js/ui/text_box';
import type { ReadonlySignal } from '@preact/signals-core';
import { computed } from '@preact/signals-core';
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

  constructor(
    private readonly options: OptionsController,
    private readonly toolbarController: ToolbarController,
    private readonly searchUIController: SearchUIController,
    private readonly searchController: SearchController,
  ) {
    this.toolbarController.addDefaultItem(
      computed(() => addSearchTextBox(
        this.getProps().value,
        (component) => { this.searchTextBox = component; },
      )),
      this.options.oneWay('searchPanel.visible'),
    );

    this.searchUIController.registerCallback('focusSearchTextBox', () => {
      this.searchTextBox?.focus();
    });
  }

  protected getProps(): ReadonlySignal<SearchFieldProps> {
    return computed(() => ({
      placeholder: this.options.oneWay('searchPanel.placeholder').value,
      // TODO: resolve update cycle: editor - option - editor
      // value: this.searchController.searchTextOption.value,
      width: this.options.oneWay('searchPanel.width').value,
      onValueChanged: (text): void => {
        this.searchController.updateSearchText(text);
      },
    }));
  }
}
