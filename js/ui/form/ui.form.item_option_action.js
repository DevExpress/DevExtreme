export default class ItemOptionAction {
    constructor(options) {
        const { item, itemsRunTimeInfo, value } = options;
        this.item = item;
        this.itemsRunTimeInfo = itemsRunTimeInfo;
        this.value = value;
    }

    getInstance() {
        return this.itemsRunTimeInfo.findWidgetInstanceByItem(this.item);
    }

    getItemContainer() {
        return this.itemsRunTimeInfo.findItemContainerByItem(this.item);
    }

    tryExecute() {
        return true;
    }
}
