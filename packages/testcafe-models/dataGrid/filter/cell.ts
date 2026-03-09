import { Selector } from 'testcafe';
import ContextMenu from '../../contextMenu';
import FocusableElement from '../../internal/focusable';

const CLASS = {
  filterMenu: 'dx-filter-menu',
  editorInput: 'dx-texteditor-input',
  filterEditor: 'dx-widget',
  focused: 'dx-focused',
  menuButton: 'dx-menu-item',
  contextMenu: 'dx-context-menu',
  gridMarker: 'dx-datagrid',
};

export default class FilterCell extends FocusableElement {
  isFocused: Promise<boolean>;
  
  menuButton: Selector;

  menu: ContextMenu;

  constructor(element: Selector) {
    super(element);
    this.isFocused = this.element.hasClass(CLASS.focused);
    this.menuButton = this.element.find(`.${CLASS.menuButton}`).nth(0);
    this.menu = new ContextMenu(Selector('body').find(`.${CLASS.gridMarker}.${CLASS.contextMenu}`));
  }

  getSearchIcon(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.filterMenu}`));
  }

  getEditorInput(): FocusableElement {
    return new FocusableElement(this.element.find(`.${CLASS.editorInput}`));
  }

  getEditor<T>(EditorType: new (mainElement: Selector) => T): T {
    return new EditorType(this.element.find(`.${CLASS.filterEditor}`));
  }
}
