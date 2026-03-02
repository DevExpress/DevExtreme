import { CheckBoxModel } from '../../../../../ui/__tests__/__mock__/model/checkbox';

export class FilterPanelModel {
  private readonly filterPanelClass: string;

  private readonly filterPanelTextClass: string;

  private readonly filterPanelClearFilterClass: string;

  private readonly filterPanelCheckboxClass: string;

  private readonly root: HTMLElement;

  constructor(root: HTMLElement, prefix: string) {
    this.filterPanelClass = `dx-${prefix}-filter-panel`;
    this.filterPanelTextClass = `dx-${prefix}-filter-panel-text`;
    this.filterPanelClearFilterClass = `dx-${prefix}-filter-panel-clear-filter`;
    this.filterPanelCheckboxClass = `dx-${prefix}-filter-panel-checkbox`;
    this.root = root;
  }

  public getElement(): HTMLElement {
    return this.root.querySelector(`.${this.filterPanelClass}`) as HTMLElement;
  }

  public getCreateFilterButton(): HTMLElement {
    return this.getElement().querySelector(`.${this.filterPanelTextClass}`) as HTMLElement;
  }

  public getClearFilterButton(): HTMLElement {
    return this.getElement().querySelector(`.${this.filterPanelClearFilterClass}`) as HTMLElement;
  }

  public getEnableFilterCheckbox(): CheckBoxModel {
    const checkboxElement = this.getElement().querySelector(`.${this.filterPanelCheckboxClass}`) as HTMLElement;
    return new CheckBoxModel(checkboxElement);
  }

  public isVisible(): boolean {
    const element = this.getElement();
    return element !== null && element.style.display !== 'none';
  }
}
