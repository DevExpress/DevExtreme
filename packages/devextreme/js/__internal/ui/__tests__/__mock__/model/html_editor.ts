const CLASSES = {
  content: 'dx-htmleditor-content',
  toolbarWrapper: 'dx-htmleditor-toolbar-wrapper',
};

export class HtmlEditorModel {
  constructor(protected readonly root: HTMLElement) {}

  public getContent(): HTMLElement {
    return this.root.querySelector(`.${CLASSES.content}`) as HTMLElement;
  }

  public getToolbarWrapper(): HTMLElement {
    return this.root.querySelector(`.${CLASSES.toolbarWrapper}`) as HTMLElement;
  }

  public moveFocusFromContent(direction: 'up' | 'down'): KeyboardEvent {
    const key = direction === 'up' ? 'ArrowUp' : 'ArrowDown';

    return this.pressKeyInContent(key, { ctrlKey: true, shiftKey: true });
  }

  public pressKeyInContent(
    key: string,
    { ctrlKey = false, shiftKey = false }: { ctrlKey?: boolean; shiftKey?: boolean } = {},
  ): KeyboardEvent {
    const event = new KeyboardEvent('keydown', {
      key, ctrlKey, shiftKey, bubbles: true, cancelable: true,
    });

    this.getContent().dispatchEvent(event);

    return event;
  }
}
