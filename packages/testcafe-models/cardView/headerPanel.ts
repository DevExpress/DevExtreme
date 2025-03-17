import HeaderItem from './headerItem';

const CLASS = {
    headerItem: 'dx-cardview-header-item',
}

export default class HeaderPanel {
    constructor(public element: Selector) {
    }

    getHeaderItem(idx = 0): HeaderItem {
        const itemElement = this.element.find(`.${CLASS.headerItem}`).nth(idx);
        return new HeaderItem(itemElement);
    }
}