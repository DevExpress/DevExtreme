import HeaderItem from './headerItem';
import Widget from "../internal/widget";

const CLASS = {
    headerItem: 'header-item',
}

export default class HeaderPanel {
    constructor(
        public element: Selector,
        public widgetName: string,
    ) {
    }

    getHeaderItem(idx = 0): HeaderItem {
        const itemElement = this.element.find(
            `.${Widget.addClassPrefix(this.widgetName, CLASS.headerItem)}`,
        ).nth(idx);
        return new HeaderItem(itemElement);
    }
}
