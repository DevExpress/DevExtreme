"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../core/utils/common");
var _extend = require("../../../core/utils/extend");
var _iterator = require("../../../core/utils/iterator");
var _type = require("../../../core/utils/type");
var _ui = _interopRequireDefault(require("../../../ui/widget/ui.widget"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const GRID_CORE_ROW_SELECTOR = '.dx-row';
class GridCoreWidget extends _ui.default {
  constructor() {
    super(...arguments);
    this._activeStateUnit = GRID_CORE_ROW_SELECTOR;
  }
  _getDefaultOptions() {
    // @ts-expect-error
    const result = super._getDefaultOptions();
    (0, _iterator.each)(this.getGridCoreHelper().modules, function () {
      if ((0, _type.isFunction)(this.defaultOptions)) {
        (0, _extend.extend)(true, result, this.defaultOptions());
      }
    });
    return result;
  }
  _setDeprecatedOptions() {
    // @ts-expect-error
    super._setDeprecatedOptions();
    // @ts-expect-error
    (0, _extend.extend)(this._deprecatedOptions, {
      'columnChooser.allowSearch': {
        since: '23.1',
        message: 'Use the "columnChooser.search.enabled" option instead'
      },
      'columnChooser.searchTimeout': {
        since: '23.1',
        message: 'Use the "columnChooser.search.timeout" option instead'
      }
    });
  }
  _clean() {}
  _optionChanged(args) {
    this.getGridCoreHelper().callModuleItemsMethod(this, 'optionChanged', [args]);
    if (!args.handled) {
      // @ts-expect-error
      super._optionChanged(args);
    }
  }
  _dimensionChanged() {
    // @ts-expect-error
    this.updateDimensions(true);
  }
  _visibilityChanged(visible) {
    if (visible) {
      // @ts-expect-error
      this.updateDimensions();
    }
  }
  _renderContentImpl() {
    this.getView('gridView').update();
  }
  _renderContent() {
    const that = this;
    (0, _common.deferRender)(() => {
      that._renderContentImpl();
    });
  }
  _dispose() {
    // @ts-expect-error
    super._dispose();
    this.getGridCoreHelper().callModuleItemsMethod(this, 'dispose');
  }
  isReady() {
    return this.getController('data').isReady();
  }
  getController(name) {
    return this._controllers[name];
  }
  getView(name) {
    return this._views[name];
  }
  getGridCoreHelper() {}
  beginUpdate() {
    super.beginUpdate();
    this.getGridCoreHelper().callModuleItemsMethod(this, 'beginUpdate');
  }
  endUpdate() {
    this.getGridCoreHelper().callModuleItemsMethod(this, 'endUpdate');
    super.endUpdate();
  }
}
exports.default = GridCoreWidget;