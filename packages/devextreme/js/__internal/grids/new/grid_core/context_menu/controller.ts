import type { Item as ContextMenuItem, PositioningEvent } from '@js/ui/context_menu';
import type dxContextMenu from '@js/ui/context_menu';
import { createRef } from 'inferno';

export abstract class BaseContextMenuController<TTargetView = unknown, TContextInfo = unknown> {
  public readonly contextMenuRef = createRef<dxContextMenu>();

  private lastEvent?: MouseEvent;

  public onPositioning = (e: PositioningEvent): void => {
    // @ts-expect-error
    e.position.of = this.lastEvent;
  };

  public show(event: MouseEvent, view: TTargetView, contextInfo?: TContextInfo): void {
    const contextMenu = this.contextMenuRef.current;
    const targetElement = event.target as Element;

    if (event === this.lastEvent || !contextMenu || !targetElement) {
      return;
    }

    this.lastEvent = event;

    const items = this.getItems(view, targetElement, contextInfo);
    contextMenu.option('items', items);

    if (!items) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    contextMenu.show().catch(console.error);
  }

  protected abstract getItems(
    view: TTargetView,
    targetElement: Element,
    contextInfo?: TContextInfo
  ): ContextMenuItem[] | undefined;
}
