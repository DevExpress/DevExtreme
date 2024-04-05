import { Selector } from 'testcafe';
// eslint-disable-next-line max-classes-per-file
import FocusableElement from '../internal/focusable';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'dx-datagrid-column-chooser',
  checkboxIcon: 'dx-checkbox-icon',
};

export default class ColumnChooser extends FocusableElement {
  body: Selector;

  content: Selector;

  isOpened: Promise<boolean>;

  constructor(element: Selector) {
    super(element);

    this.body = Selector('body');
    this.content = this.element.find(`.${CLASS.overlayContent}`);
    this.isOpened = this.body.find(`.${CLASS.overlayWrapper}.${CLASS.columnChooser}`).exists;
  }

  getCheckboxIcon(nth = 0): Selector {
    return this.content.find(`.${CLASS.checkboxIcon}`).nth(nth);
  }
}
