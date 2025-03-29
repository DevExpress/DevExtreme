import { combined, computed, type SubsGets } from '@ts/core/reactive';
import { SearchController } from '@ts/grids/new/grid_core/search/controller';
import { ToolbarController } from '@ts/grids/new/grid_core/toolbar/controller';

import { OptionsController } from '../options_controller/options_controller';
import type { SearchFieldProps } from './types';
import { addSearchTextBox } from './utils';

export class SearchView {
  public static dependencies = [
    OptionsController,
    ToolbarController,
    SearchController,
  ] as const;

  constructor(
    private readonly options: OptionsController,
    private readonly toolbarController: ToolbarController,
    private readonly searchController: SearchController,
  ) {
    this.toolbarController.addDefaultItem(
      computed(
        addSearchTextBox,
        [this.getProps()],
      ),
      this.options.oneWay('searchPanel.visible'),
    );
  }

  protected getProps(): SubsGets<SearchFieldProps> {
    return combined({
      placeholder: this.options.oneWay('searchPanel.placeholder'),
      // TODO: resolve update cycle: editor - option - editor
      // value: this.searchController.searchTextOption,
      width: this.options.oneWay('searchPanel.width'),
      onValueChanged: (text) => {
        this.searchController.updateSearchText(text);
      },
    });
  }
}
