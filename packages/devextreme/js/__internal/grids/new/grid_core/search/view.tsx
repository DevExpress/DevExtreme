import type { TextBoxInstance } from '@js/ui/text_box';
import { combined, computed, type SubsGets } from '@ts/core/reactive/index';
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
      computed(
        (props) => addSearchTextBox(
          props,
          (component) => { this.searchTextBox = component; },
        ),
        [this.getProps()],
      ),
      this.options.oneWay('searchPanel.visible'),
    );

    this.searchUIController.registerCallback('focusSearchTextBox', () => {
      this.searchTextBox?.focus();
    });
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
