import type { Properties as ContextMenuProperties } from '@js/ui/context_menu';
import dxContextMenu from '@js/ui/context_menu';

import { InfernoWrapper } from './widget_wrapper';

export class ContextMenu extends InfernoWrapper<ContextMenuProperties, dxContextMenu> {
  private readonly contentRef: { current?: HTMLDivElement } = {};

  protected getComponentFabric(): typeof dxContextMenu {
    return dxContextMenu;
  }
}
