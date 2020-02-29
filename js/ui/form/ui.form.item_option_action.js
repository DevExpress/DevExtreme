import { abstract } from '../../core/class';

export default class ItemOptionAction {
    constructor(options) {
        this._options = options;
        this._itemsRunTimeInfo = this._options.itemsRunTimeInfo;
    }

    findInstance() {
        return this._itemsRunTimeInfo.findWidgetInstanceByItem(this._options.item);
    }

    findItemContainer() {
        return this._itemsRunTimeInfo.findItemContainerByItem(this._options.item);
    }

    tryExecute() {
        abstract();
    }
}
