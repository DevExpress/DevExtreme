import { ClientFunction, Selector } from 'testcafe';
import FocusableElement from '../../internal/focusable';
import Widget from '../../internal/widget';

type StickyPosition = 'left' | 'right' | 'sticky';

const CLASS = {
  hiddenColumn: 'hidden-column',
  filterMenu: 'dx-header-filter-menu',
  list: 'dx-list',
  stateHover: 'dx-state-hover',
  sticky: 'dx-datagrid-sticky-column',
  stickyLeft: 'dx-datagrid-sticky-column-left',
  stickyRight: 'dx-datagrid-sticky-column-right',
  aiHeaderButton: 'dx-command-ai-header-button',
};

const getStickyClassNames = (position: StickyPosition | undefined): string[] => {
  switch (position) {
    case 'left':
      return [CLASS.stickyLeft];
    case 'right':
      return [CLASS.stickyRight];
    case 'sticky':
      return [CLASS.sticky];
    default:
      return [CLASS.sticky, CLASS.stickyLeft, CLASS.stickyRight];
  }
}

export default class HeaderCell {
  element: Selector;

  body = Selector('body');

  isFocused: Promise<boolean>;

  isHidden: Promise<boolean>;

  isSticky(position?: StickyPosition | undefined): Promise<boolean> {
    return ClientFunction((element, stickyClassNames) => {
      const elementClassList = element().classList;

      return stickyClassNames.some((className) => elementClassList.contains(className));
    })(this.element, getStickyClassNames(position));
  };

  isHovered(): Promise<boolean> {
    return ClientFunction((element) => {
      return element() === document.querySelector("td:hover");
    })(this.element);
  }

  constructor(headerRow: Selector, index: number, widgetName: string) {
    this.element = headerRow.find(`td[aria-colindex='${index + 1}']`);
    this.isFocused = this.element.focused;
    this.isHidden = this.element.hasClass(Widget.addClassPrefix(widgetName, CLASS.hiddenColumn));
  }

  getFilterIcon(): Selector {
    return this.element.find('.dx-column-indicators > .dx-header-filter');
  }

  getEditor(): FocusableElement {
    return new FocusableElement(this.element.find('.dx-texteditor-input, .dx-checkbox'));
  }
}
