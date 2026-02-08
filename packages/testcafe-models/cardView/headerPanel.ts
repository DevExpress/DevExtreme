import HeaderItem from './headerItem';
import Widget from "../internal/widget";

const CLASS = {
    headerItem: 'header-item',
    headerPanelTextEmpty: 'headerpanel-text-empty',
    link: 'link',
}

export default class HeaderPanel {
    private itemSelector = `.${Widget.addClassPrefix(this.widgetName, CLASS.headerItem)}`;
    
    constructor(
        public element: Selector,
        public widgetName: string,
    ) {}

    getHeaderItemsCount(): Promise<number> {
        return this.element.find(this.itemSelector).count;
    }

    getHeaderItem(idx = 0): HeaderItem {
        const itemElement = this.element.find(this.itemSelector).nth(idx);
        return new HeaderItem(itemElement);
    }

    isEmpty(): Promise<boolean> {
        const textEmpty = this.element.find(
            `.${Widget.addClassPrefix(this.widgetName, CLASS.headerPanelTextEmpty)}`
        );

        return textEmpty.exists;
    }

    getColumnChooserLink(): Selector {
        const link = this.element.find(`.dx-${CLASS.link}`);

        return link;
    }
}
