/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable spellcheck/spell-checker */
import $ from '@js/core/renderer';
import { render } from 'inferno';

import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from '../toolbar/controller';
import { SearchField } from './search_field';

export class Search {
  public static dependencies = [ToolbarController, OptionsController] as const;

  public readonly searchText = this.options.twoWay('searchText');

  constructor(
    private readonly headerPanel: ToolbarController,
    private readonly options: OptionsController,
  ) {
    this.headerPanel.addDefaultItem({
      name: 'searchPanel',
      showText: 'inMenu',
      location: 'after',
      locateInMenu: 'auto',
      template: (data, index, element: any) => {
        render(
          <SearchField
            onChange={this.searchText.update.bind(this.searchText)}
          />,
          $(element).get(0),
        );
      },
    });
  }
}
