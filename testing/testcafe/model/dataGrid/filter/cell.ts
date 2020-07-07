import FocusableElement from '../../internal/focusable';

const CLASS = {
  filterMenu: 'dx-filter-menu',
  editorInput: 'dx-texteditor-input',
};

export default class FilterCell extends FocusableElement {
  getSearchIcon(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.filterMenu}`));
  }

  getEditor(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.editorInput}`));
  }
}
