import { BaseContextMenuView } from '../../grid_core/context_menu/view';
import { ContextMenuController } from './controller';

export class ContextMenuView extends BaseContextMenuView {
  public static dependencies = [ContextMenuController] as const;

  constructor(
    protected readonly controller: ContextMenuController,
  ) {
    super(controller);
  }
}
