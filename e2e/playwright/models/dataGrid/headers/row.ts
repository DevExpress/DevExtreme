import GridElement from '../../gridCore/element';
import HeaderCell from './cell';

export default class HeaderRow extends GridElement {
  public getHeaderCell(index: number): HeaderCell {
    return new HeaderCell(this.element, index);
  }
}
