import { Selector } from 'testcafe';
import { ClassNames as CLASS } from './class-names';

export class EditingPopup {
  element: Selector;

  constructor(id?: string) {
    this.element = Selector(typeof id === 'string' ? id : `.${CLASS.overlayContent}`);
  }

  getDataRow(): Selector {
    return this.element.find(`.${CLASS.dataGrid} .${CLASS.dataRow}`);
  }
}
