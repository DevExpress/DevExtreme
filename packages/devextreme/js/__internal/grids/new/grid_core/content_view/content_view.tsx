/* eslint-disable spellcheck/spell-checker */
import type dxScrollable from '@js/ui/scroll_view/ui.scrollable';
import { computed, state } from '@ts/core/reactive/index';
import { View } from '@ts/grids/new/grid_core/core/view';
import { createRef } from 'inferno';

import { Scrollable } from '../inferno_wrappers/scrollable';
import { Content } from './content';
import { StatusView } from './status_view/status_view';

export const CLASSES = {
  content: 'dx-gridcore-content',
};

export class ContentView extends View {
  public readonly scrollableRef = createRef<dxScrollable>();

  private readonly _stub = state(undefined);

  public vdom = computed(() => {
    const ContentStatus = this.contentStatus.asInferno();
    const Contents = this.content.asInferno();

    return <Scrollable componentRef={this.scrollableRef}>
        <div className={CLASSES.content} tabIndex={0}>
          <ContentStatus/>
          <Contents/>
        </div>
      </Scrollable>;
  }, [this._stub]);

  public static dependencies = [
    StatusView, Content,
  ] as const;

  constructor(
    private readonly contentStatus: StatusView,
    private readonly content: Content,
  ) {
    super();
  }
}
