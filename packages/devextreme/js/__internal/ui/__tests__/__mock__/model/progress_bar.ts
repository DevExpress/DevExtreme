const CLASSES = {
  stateInvisible: 'dx-state-invisible',
};

export class ProgressBarModel {
  constructor(protected readonly root: HTMLElement) {}

  public getElement(): HTMLElement {
    return this.root;
  }

  public isVisible(): boolean {
    return !this.root.classList.contains(CLASSES.stateInvisible);
  }
}
