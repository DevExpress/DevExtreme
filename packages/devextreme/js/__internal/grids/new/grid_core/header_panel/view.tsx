import type { dxToolbarOptions } from '@js/ui/toolbar';
import dxToolbar from '@js/ui/toolbar';
import { computed, Subscribable } from '@ts/core/reactive';
import { InfernoNode } from 'inferno';

import { View } from '../core/view';
import { createWidgetWrapper } from '../core/widget_wrapper';
import { HeaderPanelController } from './controller';

const Toolbar = createWidgetWrapper<dxToolbarOptions, dxToolbar>(dxToolbar);

export class HeaderPanelView extends View {
  static dependencies = [HeaderPanelController] as const;

  public vdom = computed(
    (items) => <Toolbar items={items}></Toolbar>,
    [this.controller.items],
  );

  constructor(private readonly controller: HeaderPanelController) {
    super();
  }
}
