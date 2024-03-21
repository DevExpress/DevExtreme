import FocusableElement from '../../internal/focusable';

const CLASS = {
  filterMenu: 'dx-filter-menu',
  editorInput: 'dx-texteditor-input',
  filterEditor: 'dx-editor-with-menu',
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

  getEditorInput(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.editorInput}`));
  }

  getEditor(): Selector {
    return this.element.find(`.${CLASS.filterEditor}`);
  }
}
