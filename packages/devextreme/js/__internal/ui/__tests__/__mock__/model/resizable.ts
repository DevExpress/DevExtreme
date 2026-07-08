import eventsEngine from '@ts/events/core/m_events_engine';

const CLASSES = {
  handleBottom: 'dx-resizable-handle-bottom',
  resizing: 'dx-resizable-resizing',
};

export class ResizableModel {
  constructor(protected readonly root: HTMLElement) {}

  public isResizing(): boolean {
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

  private triggerOnHandle(type: string, extra: Record<string, unknown> = {}): void {
    const handle = this.root.querySelector(`.${CLASSES.handleBottom}`);
    eventsEngine.trigger(handle, { type, target: handle, ...extra });
  }
}
