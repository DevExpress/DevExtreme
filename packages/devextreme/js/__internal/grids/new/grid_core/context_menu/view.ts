import type {
  InitializedEvent, Item as ContextMenuItem, ItemClickEvent, PositioningEvent,
} from '@js/ui/context_menu';
import type { SubsGets } from '@ts/core/reactive/index';
import { combined } from '@ts/core/reactive/index';

import { View } from '../core/view';
import type { ContextMenuProps } from './context_menu';
import { ContextMenu } from './context_menu';

const CLASS = {
  contextMenu: 'dx-context-menu',
};

export abstract class BaseContextMenuView extends View<ContextMenuProps> {
  private rootElement?: HTMLElement;

  protected override component = ContextMenu;

  protected abstract getItems(e: PositioningEvent): ContextMenuItem[] | undefined;

  protected override getProps(): SubsGets<ContextMenuProps> {
    return combined({
      target: this.rootElement,
      cssClass: this.getWidgetContainerClass(),
      onPositioning: (e: PositioningEvent) => {
        const items = this.getItems(e);

        if (items) {
          e.component.option('items', items);
          e.event?.stopPropagation();
        } else {
          // @ts-expect-error
          e.cancel = true;
        }
      },
      onInitialized: (e: InitializedEvent) => {
        // @ts-expect-error
        e.component?.setAria('role', 'presentation');
        e.component?.$element().addClass(CLASS.contextMenu);
      },
      onItemClick: (e: ItemClickEvent) => {
        e.itemData?.onItemClick?.(e);
      },
    } as ContextMenuProps);
  }

  public setRootElement(element: HTMLElement): void {
    this.rootElement = element;
  }

  // TODO: move this to another place
  private getWidgetContainerClass(): string {
    return 'dx-cardview-container';
  }
}
