import { Selector } from 'testcafe';
import FilterBuilder from '../../filterBuilder';

const CLASSES = {
  popup: 'dx-popup-wrapper',
  filterBuilder: 'dx-filterbuilder',
};

export class FilterBuilderPopup {
  element: Selector;

  constructor() {
    this.element = Selector(`.${CLASSES.popup}`);
  }

  // eslint-disable-next-line class-methods-use-this
  getFilterBuilder(): FilterBuilder {
    return new FilterBuilder(Selector(`.${CLASSES.filterBuilder}`));
  }
}
