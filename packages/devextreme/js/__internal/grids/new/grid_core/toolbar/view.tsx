import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed } from '@ts/core/state_manager/index';

import { BaseContextMenuController } from '../context_menu/controller';
import { View } from '../core/view';
import { OptionsController } from '../options_controller/options_controller';
import { ToolbarController } from './controller';
import { ToolbarView as Toolbar } from './toolbar';
import type { ToolbarProps } from './types';
import { isVisible } from './utils';

export class ToolbarView extends View<ToolbarProps> {
  protected override component = Toolbar;

  private readonly visibleConfig = this.options.oneWay('toolbar.visible');

  private readonly visible = computed(
    () => isVisible(
      this.visibleConfig.value,
      this.controller.items.value,
    ),
  );

  public static dependencies = [
    ToolbarController,
    BaseContextMenuController,
    OptionsController,
  ] as const;

  constructor(
    private readonly controller: ToolbarController,
    private readonly contextMenuController: BaseContextMenuController,
    private readonly options: OptionsController,
  ) {
    super();
  }

  protected override getProps(): ReadonlySignal<ToolbarProps> {
    return computed(() => ({
      visible: this.visible.value,
      items: this.controller.items.value,
      disabled: this.options.oneWay('toolbar.disabled').value,
      multiline: this.options.oneWay('toolbar.multiline').value,
      showContextMenu: this.showContextMenu.bind(this),
    }));
  }

  private showContextMenu(event: KeyboardEvent | MouseEvent): void {
    this.contextMenuController.show(event, 'toolbar');
  }
}
