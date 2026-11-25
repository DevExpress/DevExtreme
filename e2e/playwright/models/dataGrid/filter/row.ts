import GridElement from '../../gridCore/element';
import FilterCell from './cell';

export default class FilterRow extends GridElement {
  public getFilterCell(index: number): FilterCell {
    return new FilterCell(this.element.locator(`td[aria-colindex='${index + 1}']`));
  }
}
