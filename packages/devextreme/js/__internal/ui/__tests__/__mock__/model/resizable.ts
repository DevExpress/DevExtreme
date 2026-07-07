import type { dxElementWrapper } from '@js/core/renderer';
import eventsEngine from '@ts/events/core/m_events_engine';
import Resizable from '@ts/ui/resizable/resizable';

const CLASSES = {
  handleBottom: 'dx-resizable-handle-bottom',
  resizing: 'dx-resizable-resizing',
};

export class ResizableModel {
  constructor(protected readonly root: HTMLElement) {}

  public getInstance(): Resizable {
    return Resizable.getInstance(this.root);
  }

  public isResizing(): boolean {
    return this.getInstance()._isResizing;
  }

  public hasResizingClass(): boolean {
    return this.root.classList.contains(CLASSES.resizing);
  }

  public startResize(): void {
    this.triggerOnHandle('dxdragstart');
  }

  public moveResize(): void {
    this.triggerOnHandle('dxdrag', { offset: { x: 0, y: 10 } });
  }

  public endResize(): void {
    this.triggerOnHandle('dxdragend');
  }

  public pressEscape(): void {
    eventsEngine.trigger(this.root, { type: 'keydown', key: 'Escape' });
  }

  private getHandle(): dxElementWrapper {
    return this.getInstance().$element().find(`.${CLASSES.handleBottom}`);
  }

  private triggerOnHandle(type: string, extra: Record<string, unknown> = {}): void {
    const handle = this.getHandle();
    eventsEngine.trigger(handle, { type, target: handle.get(0), ...extra });
  }
}
