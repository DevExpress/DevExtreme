/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import type { Subscribable } from '@ts/core/reactive/index';
import type { HeadersView } from '@ts/grids/new/card_view/headers/view';
import type { InfernoNode } from 'inferno';

import type { ColumnsChooserView } from './columns_chooser/columns_chooser';
import type { ContentView } from './content_view/content_view';
import { View } from './core/view';
import type { FilterPanelView } from './filtering/filter_panel/filter_panel';
import type { HeaderPanelView } from './header_panel/view';
import type { PagerView } from './pager';

export class MainView extends View {
  public vdom: InfernoNode | Subscribable<InfernoNode>;

  public static dependencies = [] as const;

  constructor() {
    super();

    this.vdom = <>Please override 'Main View' in your component</>;
  }
}
