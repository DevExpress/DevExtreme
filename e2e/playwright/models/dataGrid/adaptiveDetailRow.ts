import GridElement from '../gridCore/element';
import AdaptiveCell from './data/adaptiveCell';

export default class AdaptiveDetailRow extends GridElement {
  public getAdaptiveCell(index: number): AdaptiveCell {
    return new AdaptiveCell(this.element, index);
  }
}
