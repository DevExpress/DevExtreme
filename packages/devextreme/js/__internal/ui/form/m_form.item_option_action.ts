import Class from '@js/core/class';

export default class ItemOptionAction {
  _options?: any;

  _itemsRunTimeInfo?: any;

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

  findPreparedItem() {
    return this._itemsRunTimeInfo.findPreparedItemByItem(this._options.item);
  }

  tryExecute() {
    Class.abstract();
  }
}
