export default class ItemOptionAction {
    constructor(options) {
        this._options = options;
        this._itemsRunTimeInfo = this._options.itemsRunTimeInfo;
    }

    getInstance() {
        return this._itemsRunTimeInfo.findWidgetInstanceByItem(this._options.item);
    }

    getItemContainer() {
        return this._itemsRunTimeInfo.findItemContainerByItem(this._options.item);
    }

    tryExecute() {
        return true;
    }
}
