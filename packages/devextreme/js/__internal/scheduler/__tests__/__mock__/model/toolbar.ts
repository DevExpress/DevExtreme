export class ToolbarModel {
  element: HTMLDivElement | null;

  constructor(element: HTMLDivElement | null) {
    this.element = element;
  }

  getPrevButton(): HTMLDivElement | null | undefined {
    return this.element?.querySelector('.dx-scheduler-navigator-previous');
  }

  getNextButton(): HTMLDivElement | null | undefined {
    return this.element?.querySelector('.dx-scheduler-navigator-next');
  }
}
