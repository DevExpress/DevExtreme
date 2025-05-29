import type { Item as ContextMenuItem, PositioningEvent } from '@js/ui/context_menu';
import type dxContextMenu from '@js/ui/context_menu';
import { createRef } from 'inferno';

export abstract class BaseContextMenuController<TTargetView = unknown, TContextInfo = unknown> {
  public readonly contextMenuRef = createRef<dxContextMenu>();

  private lastEvent?: KeyboardEvent | MouseEvent;

  private lastTargetElement?: Element;

  public onPositioning = (e: PositioningEvent): void => {
    if (this.lastEvent instanceof KeyboardEvent && this.lastTargetElement) {
      // For keyboard events, position relative to the target element
      e.position.of = this.lastTargetElement;
      e.position.at = { x: 'left', y: 'bottom' };
      e.position.my = { x: 'left', y: 'top' };
    } else if (this.lastEvent instanceof MouseEvent) {
      // For mouse events, position relative to the event coordinates
      e.position.of = this.lastTargetElement;
      const rect = this.lastTargetElement?.getBoundingClientRect();
      e.position.offset = {
        x: this.lastEvent.pageX - (rect?.left ?? 0),
        y: this.lastEvent.pageY - (rect?.top ?? 0),
      };
    }
  };

  public show(
    event: KeyboardEvent | MouseEvent,
    view: TTargetView,
    contextInfo?: TContextInfo,
    onMenuCloseCallback?: () => void,
  ): void {
    const contextMenu = this.contextMenuRef.current;
    const targetElement = event.target as Element;

    if (event === this.lastEvent || !contextMenu || !targetElement) {
      return;
    }

    this.lastEvent = event;
    this.lastTargetElement = targetElement;

    const items = this.getItems(view, targetElement, contextInfo);

    if (!items) {
      return;
    }

    event.stopPropagation();
    event.preventDefault();

    contextMenu.option('items', items);
    contextMenu.option('onHiding', () => {
      onMenuCloseCallback?.();
      this.lastTargetElement = undefined;
    });
    contextMenu.show().catch(console.error);
  }

  protected abstract getItems(
    view: TTargetView,
    targetElement: Element,
    contextInfo?: TContextInfo
  ): ContextMenuItem[] | undefined;
}
