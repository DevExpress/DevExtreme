/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Subscribable } from '@ts/core/reactive/index';
import { ColumnsChooserView } from '@ts/grids/new/grid_core/columns_chooser/view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/filter_panel';
import { HeaderPanelView } from '@ts/grids/new/grid_core/header_panel/view';
import { PagerView } from '@ts/grids/new/grid_core/pager';
import type { InfernoNode } from 'inferno';

import { ContentView } from './content_view/view';
import { HeadersView } from './headers/view';

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
      {/* @ts-expect-error */}
      <Content/>
      <FilterPanel/>
      <Pager/>
      {/* @ts-expect-error */}
      <ColumnsChooser/>
    </>;
  }
}
