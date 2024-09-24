/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Subscribable } from '@ts/core/reactive/index';
import { ColumnsChooserView } from '@ts/grids/new/grid_core/columns_chooser/columns_chooser';
import { ContentView } from '@ts/grids/new/grid_core/content_view/content_view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { FilterPanelView } from '@ts/grids/new/grid_core/filtering/filter_panel/filter_panel';
import { HeaderPanelView } from '@ts/grids/new/grid_core/header_panel/view';
import { PagerView } from '@ts/grids/new/grid_core/pager';
import type { InfernoNode } from 'inferno';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  public static dependencies = [
    ContentView, PagerView, HeaderPanelView, FilterPanelView, ColumnsChooserView,
  ] as const;

  constructor(
    _content: ContentView,
    _pager: PagerView,
    _headerPanel: HeaderPanelView,
    _filterPanel: FilterPanelView,
    _columnsChooser: ColumnsChooserView,
  ) {
    super();
    const HeaderPanel = _headerPanel.asInferno();
    const Content = _content.asInferno();
    const Pager = _pager.asInferno();
    const FilterPanel = _filterPanel.asInferno();
    const ColumnsChooser = _columnsChooser.asInferno();

    this.vdom = <>
      <HeaderPanel/>
      <Content/>
      <FilterPanel/>
      <Pager/>
      <ColumnsChooser/>
    </>;
  }
}
