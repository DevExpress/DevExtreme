/* eslint-disable spellcheck/spell-checker */
import $ from '@js/core/renderer';
import { combined, type SubsGets } from '@ts/core/reactive';
import { EditorFactory } from '@ts/grids/grid_core/editor_factory/m_editor_factory';
import { SearchController } from '@ts/grids/new/grid_core/search/controller';
import { SearchField } from '@ts/grids/new/grid_core/search/search_field';
import { ToolbarController } from '@ts/grids/new/grid_core/toolbar/controller';
import { render } from 'inferno';

import { View } from '../core/view';
import { OptionsController } from '../options_controller/options_controller';
import type { SearchFieldProps } from './search_field';

export class SearchView extends View<SearchFieldProps> {
  protected override component = SearchField;

  public static dependencies = [
    OptionsController,
    ToolbarController,
    SearchController,
  ] as const;

  private readonly editorFactory = new EditorFactory();

  constructor(
    private readonly options: OptionsController,
    private readonly toolbarController: ToolbarController,
    private readonly searchController: SearchController,
  ) {
    super();

    this.toolbarController.addDefaultItem(
      {
        name: 'searchPanel',
        showText: 'inMenu',
        location: 'after',
        locateInMenu: 'auto',

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template: (data, index, element: any) => {
          render(
            SearchField(this.getProps().unreactive_get()),
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
