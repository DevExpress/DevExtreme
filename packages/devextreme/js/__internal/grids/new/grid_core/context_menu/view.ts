import type {
  InitializedEvent, ItemClickEvent,
} from '@js/ui/context_menu';
import type { ReadonlySignal } from '@ts/core/state_manager/index';
import { computed } from '@ts/core/state_manager/index';

import { View } from '../core/view';
import type { ContextMenuProps } from './context_menu';
import { ContextMenu } from './context_menu';
import type { BaseContextMenuController } from './controller';

const CLASS = {
  contextMenu: 'dx-context-menu',
};

export abstract class BaseContextMenuView extends View<ContextMenuProps> {
  protected override component = ContextMenu;

  constructor(
    protected readonly controller: BaseContextMenuController<{}, {}>,
  ) {
    super();
  }

  protected override getProps(): ReadonlySignal<ContextMenuProps> {
    return computed(() => ({
      componentRef: this.controller.contextMenuRef,
      cssClass: this.getWidgetContainerClass(),
      onInitialized: (e: InitializedEvent) => {
        // @ts-expect-error
        e.component?.setAria('role', 'presentation');
        e.component?.$element().addClass(CLASS.contextMenu);
      },
      onItemClick: (e: ItemClickEvent) => {
        e.itemData?.onItemClick?.(e);
      },
      onPositioning: this.controller.onPositioning,
    }) as ContextMenuProps);
  }

  // TODO: move this to another place
  private getWidgetContainerClass(): string {
    return 'dx-cardview-container';
  }
}
