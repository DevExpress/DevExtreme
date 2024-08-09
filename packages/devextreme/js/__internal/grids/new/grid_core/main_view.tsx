import type { Subscribable } from '@ts/core/reactive';
import type { InfernoNode } from 'inferno';

import { ContentView } from './content_view/content_view';
import { View } from './core/view';
import { FilterPanelView } from './filtering/filter_panel/filter_panel';
import { HeaderPanelView } from './header_panel/view';
import { HeadersView } from './headers/view';
import { PagerView } from './pager';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  static dependencies = [
    ContentView, PagerView, HeaderPanelView, HeadersView, FilterPanelView,
  ] as const;

  constructor(
    _content: ContentView,
    _pager: PagerView,
    _headerPanel: HeaderPanelView,
    _headers: HeadersView,
    _filterPanel: FilterPanelView,
  ) {
    super();
    const HeaderPanel = _headerPanel.asInferno();
    const Content = _content.asInferno();
    const Pager = _pager.asInferno();
    const Headers = _headers.asInferno();
    const FilterPanel = _filterPanel.asInferno();

    this.vdom = <>
      <HeaderPanel/>
      <Headers/>
      <Content/>
      <FilterPanel/>
      <Pager/>
    </>;
  }
}
