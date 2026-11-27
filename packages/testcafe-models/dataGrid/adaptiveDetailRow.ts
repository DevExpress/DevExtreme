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

  getAdaptiveCellByText(text: string): AdaptiveCell {
    const cellElement = this.element.find(`.${SELECTORS.ADAPTIVE_CELL_CLASS}`).withText(text);
    return new AdaptiveCell(cellElement, 0);
  }
}
