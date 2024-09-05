/* eslint-disable spellcheck/spell-checker */
import { computed, state } from '@js/__internal/core/reactive';
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { ContentStatusView } from '@ts/grids/new/grid_core/content_view/content_status_view';
import { View } from '@ts/grids/new/grid_core/core/view';
import { createRef } from 'inferno';

import { Scrollable } from '../inferno_wrappers/scrollable';
import { ContentViewContent } from './content_view_content';

export const CLASSES = {
  content: 'dx-gridcore-content',
};

export class ContentView extends View {
  public readonly scrollableRef = createRef<dxScrollable>();

  private readonly _stub = state(undefined);

  public vdom = computed(() => {
    const ContentStatus = this.contentStatus.asInferno();
    const Content = this.content.asInferno();

    return <Scrollable componentRef={this.scrollableRef}>
        <div className={CLASSES.content} tabIndex={0}>
          <ContentStatus/>
          <Content/>
        </div>
      </Scrollable>;
  }, [this._stub]);

  public static dependencies = [
    ContentStatusView, ContentViewContent,
  ] as const;

  constructor(
    private readonly contentStatus: ContentStatusView,
    private readonly content: ContentViewContent,
  ) {
    super();
  }
}
