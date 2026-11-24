import FocusableElement from '../../internal/focusable';
import FilterCell from './cell';

const CLASS = {
  editCell: 'dx-editor-cell',
};

export default class FilterRow extends FocusableElement {
  public getFilterCell(index: number): FilterCell {
    return new FilterCell(this.element.locator(`.${CLASS.editCell}:nth-child(${index + 1})`));
  }
}
