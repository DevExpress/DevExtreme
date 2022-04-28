import FocusableElement from '../../internal/focusable';

const CLASS = {
  filterMenu: 'dx-filter-menu',
  editorInput: 'dx-texteditor-input',
  focused: 'dx-focused',
};

export default class FilterCell extends FocusableElement {
  isFocused: Promise<boolean>;

  constructor(element: Selector) {
    super(element);
    this.isFocused = this.element.hasClass(CLASS.focused);
  }

  getSearchIcon(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.filterMenu}`));
  }

  getEditor(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.editorInput}`));
  }
}
