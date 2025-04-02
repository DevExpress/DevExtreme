import type { Item } from '@js/ui/context_menu';

import { BaseContextMenuController } from './controller';

export type TargetViewMock = 'view1' | 'view2';

export interface ContextInfoMock { data: { test: string } }

export class ContextMenuControllerMock<TTargetView, TContextInfo>
  extends BaseContextMenuController<TTargetView, TContextInfo> {
  public override getItems(): Item[] | undefined {
    return undefined;
  }
}
