import FocusableElement from '../internal/focusable';

const CLASS = {
    pagerPage: 'dx-page',
    selection: 'dx-selection'
};

export default class NavPage extends FocusableElement {
    isSelected = this.element.hasClass(CLASS.selection);

    constructor(pagerElement: Selector, index: number) {
        super(pagerElement.find(`.${CLASS.pagerPage}`).nth(index));
    }
}
