// eslint-disable-next-line import/no-cycle
import AdaptiveCell from './data/adaptiveCell';

export default class AdaptiveDetailRow {
  element: Selector;

  constructor(element: Selector) {
    this.element = element;
  }

  getAdaptiveCell(index: number): AdaptiveCell {
    return new AdaptiveCell(this.element, index);
  }
}
