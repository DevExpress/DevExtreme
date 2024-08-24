/* eslint-disable spellcheck/spell-checker */
import { render } from 'inferno';

import { HeaderPanelController } from '../header_panel/controller';
import { OptionsController } from '../options_controller/options_controller';
import { SearchField } from './search_field';

export class Search {
  public static dependencies = [HeaderPanelController, OptionsController] as const;

  public readonly searchText = this.options.twoWay('searchText');

  constructor(
    private readonly headerPanel: HeaderPanelController,
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
          element.get(0),
        );
      },
    });
  }
}
