import type { Subscribable } from '@ts/core/reactive';
import type { InfernoNode } from 'inferno';

import { ContentView } from './content_view/content_view';
import { asInferno, View } from './core/view';
import { PagerView } from './pager';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  static dependencies = [ContentView, PagerView] as const;

  constructor(
    _contentView: ContentView,
    _pagerView: PagerView,
  ) {
    super();
    const ContentView = asInferno(_contentView);
    const PagerView = asInferno(_pagerView);

    this.vdom = <>
      <ContentView></ContentView>
      <PagerView></PagerView>
    </>;
  }
}
