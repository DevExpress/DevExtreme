import type { Item as ContextMenuItem } from '@js/ui/context_menu';

import type { ContextInfo, ContextMenuTarget } from './index';
import { ContextMenuController } from './index';

export class ContextMenuControllerMock extends ContextMenuController {
  public override getItems(
    view: ContextMenuTarget,
    targetElement: Element,
    contextInfo: ContextInfo = {},
  ): ContextMenuItem[] | undefined {
    return super.getItems(view, targetElement, contextInfo);
  }
}
