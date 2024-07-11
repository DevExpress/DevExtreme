"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterBuilderModule = exports.FilterBuilderView = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _filter_builder = _interopRequireDefault(require("../../../../ui/filter_builder"));
var _ui = _interopRequireDefault(require("../../../../ui/popup/ui.popup"));
var _scroll_view = _interopRequireDefault(require("../../../../ui/scroll_view"));
var _accessibility = require("../../../../ui/shared/accessibility");
var _m_modules = _interopRequireDefault(require("../m_modules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FilterBuilderView extends _m_modules.default.View {
  init() {
    super.init();
    this._columnsController = this.getController('columns');
    this._filterSyncController = this.getController('filterSync');
  }
  optionChanged(args) {
    switch (args.name) {
      case 'filterBuilder':
      case 'filterBuilderPopup':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  _renderCore() {
    this._updatePopupOptions();
  }
  _updatePopupOptions() {
    if (this.option('filterBuilderPopup.visible')) {
      this._initPopup();
    } else if (this._filterBuilderPopup) {
      this._filterBuilderPopup.hide();
    }
  }
  _disposePopup() {
    if (this._filterBuilderPopup) {
      this._filterBuilderPopup.dispose();
      this._filterBuilderPopup = undefined;
    }
    if (this._filterBuilder) {
      this._filterBuilder.dispose();
      this._filterBuilder = undefined;
    }
  }
  _initPopup() {
    const that = this;
    that._disposePopup();
    that._filterBuilderPopup = that._createComponent(that.element(), _ui.default, (0, _extend.extend)({
      title: _message.default.format('dxDataGrid-filterBuilderPopupTitle'),
      contentTemplate($contentElement) {
        return that._getPopupContentTemplate($contentElement);
      },
      onOptionChanged(args) {
        if (args.name === 'visible') {
          that.option('filterBuilderPopup.visible', args.value);
        }
      },
      toolbarItems: that._getPopupToolbarItems()
    }, that.option('filterBuilderPopup'), {
      onHidden() {
        (0, _accessibility.restoreFocus)(that);
        that._disposePopup();
      }
    }));
  }
  _getPopupContentTemplate(contentElement) {
    const $contentElement = (0, _renderer.default)(contentElement);
    const $filterBuilderContainer = (0, _renderer.default)('<div>').appendTo((0, _renderer.default)(contentElement));
    this._filterBuilder = this._createComponent($filterBuilderContainer, _filter_builder.default, (0, _extend.extend)({
      value: this.option('filterValue'),
      fields: this._columnsController.getFilteringColumns()
    }, this.option('filterBuilder'), {
      customOperations: this._filterSyncController.getCustomFilterOperations()
    }));
    this._createComponent($contentElement, _scroll_view.default, {
      direction: 'both'
    });
  }
  _getPopupToolbarItems() {
    const that = this;
    return [{
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        text: _message.default.format('OK'),
        onClick() {
          const filter = that._filterBuilder.option('value');
          that.option('filterValue', filter);
          that._filterBuilderPopup.hide();
        }
      }
    }, {
      toolbar: 'bottom',
      location: 'after',
      widget: 'dxButton',
      options: {
        text: _message.default.format('Cancel'),
        onClick() {
          that._filterBuilderPopup.hide();
        }
      }
    }];
  }
}
exports.FilterBuilderView = FilterBuilderView;
const filterBuilderModule = exports.filterBuilderModule = {
  defaultOptions() {
    return {
      filterBuilder: {
        groupOperationDescriptions: {
          and: _message.default.format('dxFilterBuilder-and'),
          or: _message.default.format('dxFilterBuilder-or'),
          notAnd: _message.default.format('dxFilterBuilder-notAnd'),
          notOr: _message.default.format('dxFilterBuilder-notOr')
        },
        filterOperationDescriptions: {
          between: _message.default.format('dxFilterBuilder-filterOperationBetween'),
          equal: _message.default.format('dxFilterBuilder-filterOperationEquals'),
          notEqual: _message.default.format('dxFilterBuilder-filterOperationNotEquals'),
          lessThan: _message.default.format('dxFilterBuilder-filterOperationLess'),
          lessThanOrEqual: _message.default.format('dxFilterBuilder-filterOperationLessOrEquals'),
          greaterThan: _message.default.format('dxFilterBuilder-filterOperationGreater'),
          greaterThanOrEqual: _message.default.format('dxFilterBuilder-filterOperationGreaterOrEquals'),
          startsWith: _message.default.format('dxFilterBuilder-filterOperationStartsWith'),
          contains: _message.default.format('dxFilterBuilder-filterOperationContains'),
          notContains: _message.default.format('dxFilterBuilder-filterOperationNotContains'),
          endsWith: _message.default.format('dxFilterBuilder-filterOperationEndsWith'),
          isBlank: _message.default.format('dxFilterBuilder-filterOperationIsBlank'),
          isNotBlank: _message.default.format('dxFilterBuilder-filterOperationIsNotBlank')
        }
      },
      filterBuilderPopup: {}
    };
  },
  views: {
    filterBuilderView: FilterBuilderView
  }
};