"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filterPanelModule = exports.FilterPanelView = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _inflector = require("../../../../core/utils/inflector");
var _type = require("../../../../core/utils/type");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _check_box = _interopRequireDefault(require("../../../../ui/check_box"));
var _m_utils = require("../../../filter_builder/m_utils");
var _m_accessibility = require("../m_accessibility");
var _m_modules = _interopRequireDefault(require("../m_modules"));
var _m_utils2 = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const FILTER_PANEL_CLASS = 'filter-panel';
const FILTER_PANEL_TEXT_CLASS = `${FILTER_PANEL_CLASS}-text`;
const FILTER_PANEL_CHECKBOX_CLASS = `${FILTER_PANEL_CLASS}-checkbox`;
const FILTER_PANEL_CLEAR_FILTER_CLASS = `${FILTER_PANEL_CLASS}-clear-filter`;
const FILTER_PANEL_LEFT_CONTAINER = `${FILTER_PANEL_CLASS}-left`;
const FILTER_PANEL_TARGET = 'filterPanel';
class FilterPanelView extends _m_modules.default.View {
  init() {
    this._dataController = this.getController('data');
    this._columnsController = this.getController('columns');
    this._filterSyncController = this.getController('filterSync');
    this._dataController.dataSourceChanged.add(() => this.render());
  }
  isVisible() {
    return this.option('filterPanel.visible') && this._dataController.dataSource();
  }
  _renderCore() {
    const $element = this.element();
    $element.empty();
    const isColumnsDefined = !!this._columnsController.getColumns().length;
    if (!isColumnsDefined) {
      return;
    }
    $element.addClass(this.addWidgetPrefix(FILTER_PANEL_CLASS));
    const $leftContainer = (0, _renderer.default)('<div>').addClass(this.addWidgetPrefix(FILTER_PANEL_LEFT_CONTAINER)).appendTo($element);
    this._renderFilterBuilderText($element, $leftContainer);
  }
  _renderFilterBuilderText($element, $leftContainer) {
    const $filterElement = this._getFilterElement();
    const $textElement = this._getTextElement();
    if (this.option('filterValue') || this._filterValueBuffer) {
      const $checkElement = this._getCheckElement();
      const $removeButtonElement = this._getRemoveButtonElement();
      $leftContainer.append($checkElement).append($filterElement).append($textElement);
      $element.append($removeButtonElement);
      return;
    }
    $leftContainer.append($filterElement).append($textElement);
  }
  _getCheckElement() {
    const that = this;
    const $element = (0, _renderer.default)('<div>').addClass(this.addWidgetPrefix(FILTER_PANEL_CHECKBOX_CLASS));
    that._createComponent($element, _check_box.default, {
      value: that.option('filterPanel.filterEnabled'),
      onValueChanged(e) {
        that.option('filterPanel.filterEnabled', e.value);
      }
    });
    $element.attr('title', this.option('filterPanel.texts.filterEnabledHint'));
    return $element;
  }
  _getFilterElement() {
    const that = this;
    const $element = (0, _renderer.default)('<div>').addClass('dx-icon-filter');
    _events_engine.default.on($element, 'click', () => that._showFilterBuilder());
    (0, _m_accessibility.registerKeyboardAction)('filterPanel', that, $element, undefined, () => that._showFilterBuilder());
    that._addTabIndexToElement($element);
    return $element;
  }
  _getTextElement() {
    const that = this;
    const $textElement = (0, _renderer.default)('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_TEXT_CLASS));
    let filterText;
    const filterValue = that.option('filterValue');
    if (filterValue) {
      (0, _deferred.when)(that.getFilterText(filterValue, this._filterSyncController.getCustomFilterOperations())).done(filterText => {
        const customizeText = that.option('filterPanel.customizeText');
        if (customizeText) {
          const customText = customizeText({
            component: that.component,
            filterValue,
            text: filterText
          });
          if (typeof customText === 'string') {
            filterText = customText;
          }
        }
        $textElement.text(filterText);
      });
    } else {
      filterText = that.option('filterPanel.texts.createFilter');
      $textElement.text(filterText);
    }
    _events_engine.default.on($textElement, 'click', () => that._showFilterBuilder());
    (0, _m_accessibility.registerKeyboardAction)('filterPanel', that, $textElement, undefined, () => that._showFilterBuilder());
    that._addTabIndexToElement($textElement);
    return $textElement;
  }
  _showFilterBuilder() {
    this.option('filterBuilderPopup.visible', true);
  }
  _getRemoveButtonElement() {
    const that = this;
    // @ts-expect-error
    const clearFilterValue = () => that.option('filterValue', null);
    const $element = (0, _renderer.default)('<div>').addClass(that.addWidgetPrefix(FILTER_PANEL_CLEAR_FILTER_CLASS)).text(that.option('filterPanel.texts.clearFilter'));
    _events_engine.default.on($element, 'click', clearFilterValue);
    (0, _m_accessibility.registerKeyboardAction)('filterPanel', this, $element, undefined, clearFilterValue);
    that._addTabIndexToElement($element);
    return $element;
  }
  _addTabIndexToElement($element) {
    if (!this.option('useLegacyKeyboardNavigation')) {
      const tabindex = this.option('tabindex') || 0;
      $element.attr('tabindex', tabindex);
    }
  }
  optionChanged(args) {
    switch (args.name) {
      case 'filterValue':
        this._invalidate();
        this.option('filterPanel.filterEnabled', true);
        args.handled = true;
        break;
      case 'filterPanel':
        this._invalidate();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
  _getConditionText(fieldText, operationText, valueText) {
    let result = `[${fieldText}] ${operationText}`;
    if ((0, _type.isDefined)(valueText)) {
      result += valueText;
    }
    return result;
  }
  _getValueMaskedText(value) {
    return Array.isArray(value) ? `('${value.join('\', \'')}')` : ` '${value}'`;
  }
  _getValueText(field, customOperation, value) {
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const hasCustomOperation = customOperation && customOperation.customizeText;
    if ((0, _type.isDefined)(value) || hasCustomOperation) {
      if (!hasCustomOperation && field.lookup) {
        (0, _m_utils.getCurrentLookupValueText)(field, value, data => {
          deferred.resolve(this._getValueMaskedText(data));
        });
      } else {
        const displayValue = Array.isArray(value) ? value : _m_utils2.default.getDisplayValue(field, value, null);
        (0, _deferred.when)((0, _m_utils.getCurrentValueText)(field, displayValue, customOperation, FILTER_PANEL_TARGET)).done(data => {
          deferred.resolve(this._getValueMaskedText(data));
        });
      }
    } else {
      deferred.resolve('');
    }
    return deferred.promise();
  }
  getConditionText(filterValue, options) {
    const that = this;
    const operation = filterValue[1];
    // @ts-expect-error
    const deferred = new _deferred.Deferred();
    const customOperation = (0, _m_utils.getCustomOperation)(options.customOperations, operation);
    let operationText;
    const field = (0, _m_utils.getField)(filterValue[0], options.columns);
    const fieldText = field.caption || '';
    const value = filterValue[2];
    if (customOperation) {
      operationText = customOperation.caption || (0, _inflector.captionize)(customOperation.name);
    } else if (value === null) {
      operationText = (0, _m_utils.getCaptionByOperation)(operation === '=' ? 'isblank' : 'isnotblank', options.filterOperationDescriptions);
    } else {
      operationText = (0, _m_utils.getCaptionByOperation)(operation, options.filterOperationDescriptions);
    }
    this._getValueText(field, customOperation, value).done(valueText => {
      deferred.resolve(that._getConditionText(fieldText, operationText, valueText));
    });
    return deferred;
  }
  getGroupText(filterValue, options, isInnerGroup) {
    const that = this;
    // @ts-expect-error
    const result = new _deferred.Deferred();
    const textParts = [];
    const groupValue = (0, _m_utils.getGroupValue)(filterValue);
    filterValue.forEach(item => {
      if ((0, _m_utils.isCondition)(item)) {
        textParts.push(that.getConditionText(item, options));
      } else if ((0, _m_utils.isGroup)(item)) {
        textParts.push(that.getGroupText(item, options, true));
      }
    });
    _deferred.when.apply(this, textParts).done(function () {
      let text;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      if (groupValue.startsWith('!')) {
        const groupText = options.groupOperationDescriptions[`not${groupValue.substring(1, 2).toUpperCase()}${groupValue.substring(2)}`].split(' ');
        text = `${groupText[0]} ${args[0]}`;
      } else {
        text = args.join(` ${options.groupOperationDescriptions[groupValue]} `);
      }
      if (isInnerGroup) {
        text = `(${text})`;
      }
      result.resolve(text);
    });
    return result;
  }
  getFilterText(filterValue, customOperations) {
    const options = {
      customOperations,
      columns: this._columnsController.getFilteringColumns(),
      filterOperationDescriptions: this.option('filterBuilder.filterOperationDescriptions'),
      groupOperationDescriptions: this.option('filterBuilder.groupOperationDescriptions')
    };
    return (0, _m_utils.isCondition)(filterValue) ? this.getConditionText(filterValue, options) : this.getGroupText(filterValue, options);
  }
}
exports.FilterPanelView = FilterPanelView;
const data = Base => class FilterPanelDataControllerExtender extends Base {
  optionChanged(args) {
    switch (args.name) {
      case 'filterPanel':
        this._applyFilter();
        args.handled = true;
        break;
      default:
        super.optionChanged(args);
    }
  }
};
const filterPanelModule = exports.filterPanelModule = {
  defaultOptions() {
    return {
      filterPanel: {
        visible: false,
        filterEnabled: true,
        texts: {
          createFilter: _message.default.format('dxDataGrid-filterPanelCreateFilter'),
          clearFilter: _message.default.format('dxDataGrid-filterPanelClearFilter'),
          filterEnabledHint: _message.default.format('dxDataGrid-filterPanelFilterEnabledHint')
        }
      }
    };
  },
  views: {
    filterPanelView: FilterPanelView
  },
  extenders: {
    controllers: {
      data
    }
  }
};