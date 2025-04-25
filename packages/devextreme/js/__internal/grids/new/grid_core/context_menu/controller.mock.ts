import type { Item } from '@js/ui/context_menu';

import { BaseContextMenuController } from './controller';

export type TargetViewMock = 'view1' | 'view2';

export interface ContextInfoMock { data: { test: string } }

export class ContextMenuControllerMock extends BaseContextMenuController {
  public static dependencies = [] as const;

  public override getItems(): Item[] | undefined {
    return undefined;
  }
}
