/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Subscribable } from '@ts/core/reactive/index';
import { ColumnsChooserView } from '@ts/grids/new/grid_core/columns_chooser/view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/filter_panel';
import { PagerView } from '@ts/grids/new/grid_core/pager';
import { ToolbarView } from '@ts/grids/new/grid_core/toolbar/view';
import type { InfernoNode } from 'inferno';

import { ContentView } from './content_view/view';
import { HeaderPanelView } from './header_panel/view';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  public static dependencies = [
    ContentView, PagerView, ToolbarView, HeaderPanelView, FilterPanelView, ColumnsChooserView,
  ] as const;

  constructor(
    _content: ContentView,
    _pager: PagerView,
    _toolbar: ToolbarView,
    _headerPanel: HeaderPanelView,
    _filterPanel: FilterPanelView,
    _columnsChooser: ColumnsChooserView,
  ) {
    super();
    const Toolbar = _toolbar.asInferno();
    const Content = _content.asInferno();
    const Pager = _pager.asInferno();
    const HeaderPanel = _headerPanel.asInferno();
    const FilterPanel = _filterPanel.asInferno();
    const ColumnsChooser = _columnsChooser.asInferno();

    this.vdom = <>
      <Toolbar/>
      <HeaderPanel/>
      {/* @ts-expect-error */}
      <Content/>
      <FilterPanel/>
      <Pager/>
      {/* @ts-expect-error */}
      <ColumnsChooser/>
    </>;
  }
}
