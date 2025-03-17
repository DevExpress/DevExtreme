const CLASS = {
    filterIcon: 'dx-header-filter-icon',
    selectedFilterIcon: 'dx-header-filter-icon--selected',
}

export default class HeaderItem {
    constructor(public element: Selector) {}

    getFilterIcon(): Selector {
        return this.element.find(`.${CLASS.filterIcon}`);
    }

    isFilterIconSelected(): Promise<boolean> {
        const icon = this.getFilterIcon();
        return icon.hasClass(CLASS.selectedFilterIcon);
    }
}