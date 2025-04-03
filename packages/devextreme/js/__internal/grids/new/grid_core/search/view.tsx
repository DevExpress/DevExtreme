import $ from '@js/core/renderer';
import { SearchController } from '@ts/grids/new/grid_core/search/controller';
import { SearchField } from '@ts/grids/new/grid_core/search/search_field';
import { ToolbarController } from '@ts/grids/new/grid_core/toolbar/controller';
import { render } from 'inferno';

export class SearchView {
  public static dependencies = [
    ToolbarController,
    SearchController,
  ] as const;

  constructor(
    private readonly headerPanel: ToolbarController,
    private readonly searchController: SearchController,
  ) {
    this.headerPanel.addDefaultItem({
      name: 'searchPanel',
      showText: 'inMenu',
      location: 'after',
      locateInMenu: 'auto',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      template: (data, index, element: any) => {
        render(
          <SearchField
            onChange={(text) => {
              this.searchController.updateSearchText(text);
            }}
        />,
          $(element).get(0),
        );
      },
    });
  }
}
