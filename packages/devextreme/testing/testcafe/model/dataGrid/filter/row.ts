import FocusableElement from '../../internal/focusable';
import FilterCell from './cell';

const CLASS = {
  editCell: 'dx-editor-cell',
};

export default class FilterRow extends FocusableElement {
  getFilterCell(index: number): FilterCell {
    return new FilterCell(this.element.find(`.${CLASS.editCell}:nth-child(${index + 1})`));
  }
}
