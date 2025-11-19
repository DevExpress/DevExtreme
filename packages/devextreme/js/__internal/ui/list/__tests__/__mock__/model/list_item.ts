const CLASSES = {
  stateDisabled: 'dx-state-disabled',
};

export class ListItemModel {
  isDisabled: boolean;

  constructor(protected readonly root: HTMLElement | null) {
    this.isDisabled = root?.classList.contains(CLASSES.stateDisabled) ?? false;
  }

  public getElement(): HTMLElement | null {
    return this.root;
  }
}
