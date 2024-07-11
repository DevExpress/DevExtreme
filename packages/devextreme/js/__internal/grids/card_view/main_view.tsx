import type { Subscribable } from '@ts/core/reactive';
import type { InfernoNode } from 'inferno';

import { ContentView } from './content_view/content_view';
import { asInferno, View } from './core/view';
import { PagerView } from './pager';
import { HeaderPanelView } from './header_panel/view';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  static dependencies = [ContentView, PagerView, HeaderPanelView] as const;

  constructor(
    _contentView: ContentView,
    _pagerView: PagerView,
    _headerPanel: HeaderPanelView,
  ) {
    super();
    const HeaderPanelView = asInferno(_headerPanel);
    const ContentView = asInferno(_contentView);
    const PagerView = asInferno(_pagerView);

    this.vdom = <>
      <HeaderPanelView></HeaderPanelView>
      <ContentView></ContentView>
      <PagerView></PagerView>
    </>;
  }
}
