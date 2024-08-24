import { computed } from '@ts/core/reactive';

import { View } from '../core/view';
import { Toolbar } from '../inferno_wrappers/toolbar';
import { HeaderPanelController } from './controller';

export class HeaderPanelView extends View {
  public static dependencies = [HeaderPanelController] as const;

  public vdom = computed(
    (items) => <Toolbar items={items}></Toolbar>,
    [this.controller.items],
  );

  constructor(private readonly controller: HeaderPanelController) {
    super();
  }
}
