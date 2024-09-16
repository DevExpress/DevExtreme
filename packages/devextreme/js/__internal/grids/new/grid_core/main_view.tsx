/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Subscribable } from '@ts/core/reactive/index';
import { HeadersView } from '@ts/grids/new/card_view/headers/view';
import type { InfernoNode } from 'inferno';

import { ColumnsChooserView } from './columns_chooser/columns_chooser';
import { ContentView } from './content_view/content_view';
import { View } from './core/view';
import { FilterPanelView } from './filtering/filter_panel/filter_panel';
import { HeaderPanelView } from './header_panel/view';
import { PagerView } from './pager';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  public static dependencies = [
    ContentView, PagerView, HeaderPanelView, HeadersView, FilterPanelView, ColumnsChooserView,
  ] as const;

  constructor(
    _content: ContentView,
    _pager: PagerView,
    _headerPanel: HeaderPanelView,
    _headers: HeadersView,
    _filterPanel: FilterPanelView,
    _columnsChooser: ColumnsChooserView,
  ) {
    super();
    const HeaderPanel = _headerPanel.asInferno();
    const Content = _content.asInferno();
    const Pager = _pager.asInferno();
    const Headers = _headers.asInferno();
    const FilterPanel = _filterPanel.asInferno();
    const ColumnsChooser = _columnsChooser.asInferno();

    this.vdom = <>
      <HeaderPanel/>
      <Headers/>
      <Content/>
      <FilterPanel/>
      <Pager/>
      <ColumnsChooser/>
    </>;
  }
}
