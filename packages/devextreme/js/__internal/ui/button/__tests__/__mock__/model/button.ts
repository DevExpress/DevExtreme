const CLASSES = {
  stateDisabled: 'dx-state-disabled',
};

export class ButtonModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public isDisabled(): boolean {
    return this.root.classList.contains(CLASSES.stateDisabled);
  }
}
