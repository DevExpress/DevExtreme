import type { ContextMenuTarget } from '@js/ui/card_view';
import type { Item as ContextMenuItem } from '@js/ui/context_menu';

import type { ContextInfo } from '.';
import { ContextMenuController } from '.';

export class ContextMenuControllerMock extends ContextMenuController {
  public override getItems(
    view: ContextMenuTarget,
    targetElement: Element,
    contextInfo: ContextInfo = {},
  ): ContextMenuItem[] | undefined {
    return super.getItems(view, targetElement, contextInfo);
  }
}
