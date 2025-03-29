import $ from '@js/core/renderer';
import { combined, type SubsGets } from '@ts/core/reactive';
import { SearchController } from '@ts/grids/new/grid_core/search/controller';
import { SearchField } from '@ts/grids/new/grid_core/search/search_field';
import { ToolbarController } from '@ts/grids/new/grid_core/toolbar/controller';
import { render } from 'inferno';

import { OptionsController } from '../options_controller/options_controller';
import type { SearchFieldProps } from './search_field';

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
      {
        name: 'searchPanel',
        showText: 'inMenu',
        location: 'after',
        locateInMenu: 'auto',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template: (data, index, element: any) => {
          render(
            // eslint-disable-next-line spellcheck/spell-checker
            <SearchField {...this.getProps().unreactive_get()} />,
            $(element).get(0),
          );
        },
      },
      this.options.oneWay('searchPanel.visible'),
    );
  }

  protected getProps(): SubsGets<SearchFieldProps> {
    return combined({
      visible: this.options.oneWay('searchPanel.visible'),
      placeholder: this.options.oneWay('searchPanel.placeholder'),
      text: this.searchController.searchTextOption,
      width: this.options.oneWay('searchPanel.width'),
      onValueChanged: (text) => {
        this.searchController.updateSearchText(text);
      },
    });
  }
}
