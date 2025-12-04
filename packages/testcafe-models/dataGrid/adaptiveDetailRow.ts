// eslint-disable-next-line import/no-cycle
import AdaptiveCell from './data/adaptiveCell';

const SELECTORS = {
  ADAPTIVE_CELL_CLASS: 'dx-field-item'
};

export default class AdaptiveDetailRow {
  element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  getAdaptiveCell(index: number): AdaptiveCell {
    return new AdaptiveCell(this.element, index);
  }

  getAdaptiveCellByName(name: string): AdaptiveCell {
    const cellElement = this.element.find(`.${SELECTORS.ADAPTIVE_CELL_CLASS}`).withText(name);
    return new AdaptiveCell(cellElement, 0);
  }
}
