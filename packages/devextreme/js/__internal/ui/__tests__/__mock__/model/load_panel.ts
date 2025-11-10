const CLASSES = {
  stateInvisible: 'dx-state-invisible',
};

export class LoadPanelModel {
  constructor(protected readonly root: HTMLElement | null) {}

  public getElement(): HTMLElement | null {
    return this.root;
  }

  public isVisible(): boolean {
    return !this.root?.classList.contains(CLASSES.stateInvisible);
  }
}
