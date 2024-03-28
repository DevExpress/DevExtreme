// eslint-disable-next-line max-classes-per-file
import FocusableElement from '../internal/focusable';
import { getRootContainer } from '../../helpers/domUtils';

const CLASS = {
  overlayContent: 'dx-overlay-content',
  overlayWrapper: 'dx-overlay-wrapper',
  columnChooser: 'dx-datagrid-column-chooser',
};

export default class ColumnChooser extends FocusableElement {
  root: Selector;

  content: Selector;

  isOpened: Promise<boolean>;

  constructor(element: Selector) {
    super(element);

    this.root = getRootContainer();
    this.content = this.element.find(`.${CLASS.overlayContent}`);
    this.isOpened = this.root.find(`.${CLASS.overlayWrapper}.${CLASS.columnChooser}`).exists;
  }
}
