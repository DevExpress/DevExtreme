// eslint-disable-next-line max-classes-per-file
import FocusableElement from '../internal/focusable';

const CLASS = {
  overlayContent: 'dx-overlay-content',
};

export default class ColumnChooser extends FocusableElement {
  content: Selector;

  constructor(element: Selector) {
    super(element);

    this.content = this.element.find(`.${CLASS.overlayContent}`);
  }
}
