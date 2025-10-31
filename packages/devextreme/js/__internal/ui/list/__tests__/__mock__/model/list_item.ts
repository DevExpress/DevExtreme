const CLASSES = {
  stateDisabled: 'dx-state-disabled',
};

export class ListItemModel {
  isDisabled: boolean;

  constructor(protected readonly root: HTMLElement) {
    this.isDisabled = root.classList.contains(CLASSES.stateDisabled);
  }

  public getElement(): HTMLElement {
    return this.root;
  }
}
