"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.headerFilterMixin = exports.allowHeaderFiltering = exports.HeaderFilterView = void 0;
exports.updateHeaderFilterItemSelectionState = updateHeaderFilterItemSelectionState;
require("../../../ui/list/modules/m_search");
require("../../../ui/list/modules/m_selection");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _list_light = _interopRequireDefault(require("../../../../ui/list_light"));
var _ui = _interopRequireDefault(require("../../../../ui/popup/ui.popup"));
var _tree_view = _interopRequireDefault(require("../../../../ui/tree_view"));
var _m_modules = _interopRequireDefault(require("../../../grids/grid_core/m_modules"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable max-classes-per-file */

const HEADER_FILTER_CLASS = 'dx-header-filter';
const HEADER_FILTER_MENU_CLASS = 'dx-header-filter-menu';
const DEFAULT_SEARCH_EXPRESSION = 'text';
function resetChildrenItemSelection(items) {
  items = items || [];
  for (let i = 0; i < items.length; i++) {
    items[i].selected = false;
    resetChildrenItemSelection(items[i].items);
  }
}
function getSelectAllCheckBox(listComponent) {
  const selector = listComponent.NAME === 'dxTreeView' ? '.dx-treeview-select-all-item' : '.dx-list-select-all-checkbox';
  return listComponent.$element().find(selector).dxCheckBox('instance');
}
function updateListSelectAllState(e, filterValues) {
  if (e.component.option('searchValue')) {
    return;
  }
  const selectAllCheckBox = getSelectAllCheckBox(e.component);
  if (selectAllCheckBox && filterValues && filterValues.length) {
    selectAllCheckBox.option('value', undefined);
  }
}
function updateHeaderFilterItemSelectionState(item, filterValuesMatch, isExcludeFilter) {
  if (filterValuesMatch ^ isExcludeFilter) {
    item.selected = true;
    if (isExcludeFilter && item.items) {
      for (let j = 0; j < item.items.length; j++) {
        if (!item.items[j].selected) {
          item.selected = undefined;
          break;
        }
      }
    }
  } else if (isExcludeFilter || item.selected) {
    item.selected = false;
    resetChildrenItemSelection(item.items);
  }
}
class HeaderFilterView extends _m_modules.default.View {
  getPopupContainer() {
    return this._popupContainer;
  }
  getListComponent() {
    return this._listComponent;
  }
  applyHeaderFilter(options) {
    const that = this;
    const list = that.getListComponent();
    const searchValue = list.option('searchValue');
    const selectAllCheckBox = getSelectAllCheckBox(list);
    const isAllSelected = !searchValue && !options.isFilterBuilder && (selectAllCheckBox === null || selectAllCheckBox === void 0 ? void 0 : selectAllCheckBox.option('value'));
    const filterValues = [];
    const fillSelectedItemKeys = function (filterValues, items, isExclude) {
      (0, _iterator.each)(items, (_, item) => {
        if (item.selected !== undefined && !!item.selected ^ isExclude) {
          const node = list._getNode(item);
          const hasChildren = list._hasChildren(node);
          const hasChildrenWithSelection = hasChildren && item.items && item.items.some(item => item.selected);
          if (!searchValue || !hasChildrenWithSelection) {
            filterValues.push(item.value);
            return;
          }
        }
        if (item.items && item.items.length) {
          fillSelectedItemKeys(filterValues, item.items, isExclude);
        }
      });
    };
    if (!isAllSelected) {
      if (options.type === 'tree') {
        if (options.filterType) {
          options.filterType = 'include';
        }
        fillSelectedItemKeys(filterValues, list.option('items'), false);
        options.filterValues = filterValues;
      }
    } else {
      if (options.type === 'tree') {
        options.filterType = 'exclude';
      }
      if (Array.isArray(options.filterValues)) {
        options.filterValues = [];
      }
    }
    if (options.filterValues && !options.filterValues.length) {
      options.filterValues = null; // T500956
    }
    options.apply();
    that.hideHeaderFilterMenu();
  }
  showHeaderFilterMenu($columnElement, options) {
    const that = this;
    if (options) {
      that._initializePopupContainer(options);
      const popupContainer = that.getPopupContainer();
      that.hideHeaderFilterMenu();
      that.updatePopup($columnElement, options);
      popupContainer.show();
    }
  }
  hideHeaderFilterMenu() {
    const headerFilterMenu = this.getPopupContainer();
    headerFilterMenu && headerFilterMenu.hide();
  }
  updatePopup($element, options) {
    const that = this;
    const showColumnLines = this.option('showColumnLines');
    const alignment = options.alignment === 'right' ^ !showColumnLines ? 'left' : 'right';
    that._popupContainer.setAria({
      role: 'dialog',
      label: _message.default.format('dxDataGrid-headerFilterLabel')
    });
    if (that._popupContainer) {
      that._cleanPopupContent();
      that._popupContainer.option('position', {
        my: `${alignment} top`,
        at: `${alignment} bottom`,
        of: $element,
        collision: 'fit fit' // T1156848
      });
    }
  }
  _getSearchExpr(options, headerFilterOptions) {
    const {
      lookup
    } = options;
    const {
      useDefaultSearchExpr
    } = options;
    const headerFilterDataSource = headerFilterOptions.dataSource;
    const filterSearchExpr = headerFilterOptions.search.searchExpr;
    if (filterSearchExpr) {
      return filterSearchExpr;
    }
    if (useDefaultSearchExpr || (0, _type.isDefined)(headerFilterDataSource) && !(0, _type.isFunction)(headerFilterDataSource)) {
      return DEFAULT_SEARCH_EXPRESSION;
    }
    if (lookup) {
      return lookup.displayExpr || 'this';
    }
    if (options.dataSource) {
      const {
        group
      } = options.dataSource;
      if (Array.isArray(group) && group.length > 0) {
        return group[0].selector;
      }
      if ((0, _type.isFunction)(group) && !options.remoteFiltering) {
        return group;
      }
    }
    return options.dataField || options.selector;
  }
  _cleanPopupContent() {
    this._popupContainer && this._popupContainer.$content().empty();
  }
  _initializePopupContainer(options) {
    const that = this;
    const $element = that.element();
    const headerFilterOptions = this._normalizeHeaderFilterOptions(options);
    const {
      height,
      width
    } = headerFilterOptions;
    const dxPopupOptions = {
      width,
      height,
      visible: false,
      shading: false,
      showTitle: false,
      showCloseButton: false,
      hideOnParentScroll: false,
      dragEnabled: false,
      hideOnOutsideClick: true,
      wrapperAttr: {
        class: HEADER_FILTER_MENU_CLASS
      },
      focusStateEnabled: false,
      toolbarItems: [{
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: headerFilterOptions.texts.ok,
          onClick() {
            that.applyHeaderFilter(options);
          }
        }
      }, {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: headerFilterOptions.texts.cancel,
          onClick() {
            that.hideHeaderFilterMenu();
          }
        }
      }],
      resizeEnabled: true,
      onShowing(e) {
        e.component.$content().parent().addClass('dx-dropdowneditor-overlay');
        that._initializeListContainer(options, headerFilterOptions);
        options.onShowing && options.onShowing(e);
      },
      onShown() {
        that.getListComponent().focus();
      },
      onHidden: options.onHidden,
      onInitialized(e) {
        const {
          component
        } = e;
        // T321243
        component.option('animation', component._getDefaultOptions().animation);
      }
    };
    if (!(0, _type.isDefined)(that._popupContainer)) {
      that._popupContainer = that._createComponent($element, _ui.default, dxPopupOptions);
    } else {
      that._popupContainer.option(dxPopupOptions);
    }
  }
  _initializeListContainer(options, headerFilterOptions) {
    const that = this;
    const $content = that._popupContainer.$content();
    const needShowSelectAllCheckbox = !options.isFilterBuilder && headerFilterOptions.allowSelectAll;
    const widgetOptions = {
      searchEnabled: headerFilterOptions.search.enabled,
      searchTimeout: headerFilterOptions.search.timeout,
      searchEditorOptions: headerFilterOptions.search.editorOptions,
      searchMode: headerFilterOptions.search.mode || '',
      dataSource: options.dataSource,
      onContentReady() {
        that.renderCompleted.fire();
      },
      itemTemplate(data, _, element) {
        const $element = (0, _renderer.default)(element);
        if (options.encodeHtml) {
          return $element.text(data.text);
        }
        return $element.html(data.text);
      }
    };
    function onOptionChanged(e) {
      // T835492, T833015
      if (e.fullName === 'searchValue' && needShowSelectAllCheckbox && that.option('headerFilter.hideSelectAllOnSearch') !== false) {
        if (options.type === 'tree') {
          e.component.option('showCheckBoxesMode', e.value ? 'normal' : 'selectAll');
        } else {
          e.component.option('selectionMode', e.value ? 'multiple' : 'all');
        }
      }
    }
    if (options.type === 'tree') {
      that._listComponent = that._createComponent((0, _renderer.default)('<div>').appendTo($content), _tree_view.default, (0, _extend.extend)(widgetOptions, {
        showCheckBoxesMode: needShowSelectAllCheckbox ? 'selectAll' : 'normal',
        onOptionChanged,
        keyExpr: 'id'
      }));
    } else {
      that._listComponent = that._createComponent((0, _renderer.default)('<div>').appendTo($content), _list_light.default, (0, _extend.extend)(widgetOptions, {
        searchExpr: that._getSearchExpr(options, headerFilterOptions),
        pageLoadMode: 'scrollBottom',
        showSelectionControls: true,
        selectionMode: needShowSelectAllCheckbox ? 'all' : 'multiple',
        onOptionChanged,
        onSelectionChanged(e) {
          const items = e.component.option('items');
          const selectedItems = e.component.option('selectedItems');
          if (!e.component._selectedItemsUpdating && !e.component.option('searchValue') && !options.isFilterBuilder) {
            const filterValues = options.filterValues || [];
            const isExclude = options.filterType === 'exclude';
            if (selectedItems.length === 0 && items.length && (filterValues.length <= 1 || isExclude && filterValues.length === items.length - 1)) {
              options.filterType = 'include';
              options.filterValues = [];
            } else if (selectedItems.length === items.length) {
              options.filterType = 'exclude';
              options.filterValues = [];
            }
          }
          (0, _iterator.each)(items, (index, item) => {
            const selected = _m_utils.default.getIndexByKey(item, selectedItems, null) >= 0;
            const oldSelected = !!item.selected;
            if (oldSelected !== selected) {
              item.selected = selected;
              options.filterValues = options.filterValues || [];
              const filterValueIndex = _m_utils.default.getIndexByKey(item.value, options.filterValues, null);
              if (filterValueIndex >= 0) {
                options.filterValues.splice(filterValueIndex, 1);
              }
              const isExcludeFilterType = options.filterType === 'exclude';
              if (selected ^ isExcludeFilterType) {
                options.filterValues.push(item.value);
              }
            }
          });
          updateListSelectAllState(e, options.filterValues);
        },
        onContentReady(e) {
          const {
            component
          } = e;
          const items = component.option('items');
          const selectedItems = [];
          (0, _iterator.each)(items, function () {
            if (this.selected) {
              selectedItems.push(this);
            }
          });
          component._selectedItemsUpdating = true;
          component.option('selectedItems', selectedItems);
          component._selectedItemsUpdating = false;
          updateListSelectAllState(e, options.filterValues);
        }
      }));
    }
  }
  _normalizeHeaderFilterOptions(options) {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const generalHeaderFilter = this.option('headerFilter') || {};
    const specificHeaderFilter = options.headerFilter || {};
    const generalDeprecated = {
      search: {
        enabled: generalHeaderFilter.allowSearch,
        timeout: generalHeaderFilter.searchTimeout
      }
    };
    const specificDeprecated = {
      search: {
        enabled: specificHeaderFilter.allowSearch,
        mode: specificHeaderFilter.searchMode,
        timeout: specificHeaderFilter.searchTimeout
      }
    };
    return (0, _extend.extend)(true, {}, generalHeaderFilter, generalDeprecated, specificHeaderFilter, specificDeprecated);
  }
  _renderCore() {
    this.element().addClass(HEADER_FILTER_MENU_CLASS);
  }
}
exports.HeaderFilterView = HeaderFilterView;
const allowHeaderFiltering = function (column) {
  return (0, _type.isDefined)(column.allowHeaderFiltering) ? column.allowHeaderFiltering : column.allowFiltering;
};
// TODO Fix types of this mixin
exports.allowHeaderFiltering = allowHeaderFiltering;
const headerFilterMixin = Base => class HeaderFilterMixin extends Base {
  optionChanged(args) {
    if (args.name === 'headerFilter') {
      const requireReady = this.name === 'columnHeadersView';
      this._invalidate(requireReady, requireReady);
      args.handled = true;
    } else {
      super.optionChanged(args);
    }
  }
  _applyColumnState(options) {
    let $headerFilterIndicator;
    const {
      rootElement
    } = options;
    const {
      column
    } = options;
    if (options.name === 'headerFilter') {
      rootElement.find(`.${HEADER_FILTER_CLASS}`).remove();
      if (allowHeaderFiltering(column)) {
        $headerFilterIndicator = super._applyColumnState(options).toggleClass('dx-header-filter-empty', this._isHeaderFilterEmpty(column));
        if (!this.option('useLegacyKeyboardNavigation')) {
          $headerFilterIndicator.attr('tabindex', this.option('tabindex') || 0);
        }
        const indicatorLabel = _message.default.format('dxDataGrid-headerFilterIndicatorLabel', column.caption);
        $headerFilterIndicator.attr('aria-label', indicatorLabel);
        $headerFilterIndicator.attr('aria-haspopup', 'dialog');
        $headerFilterIndicator.attr('role', 'button');
      }
      return $headerFilterIndicator;
    }
    return super._applyColumnState(options);
  }
  _isHeaderFilterEmpty(column) {
    return !column.filterValues || !column.filterValues.length;
  }
  _getIndicatorClassName(name) {
    if (name === 'headerFilter') {
      return HEADER_FILTER_CLASS;
    }
    return super._getIndicatorClassName(name);
  }
  _renderIndicator(options) {
    const $container = options.container;
    const $indicator = options.indicator;
    if (options.name === 'headerFilter') {
      const rtlEnabled = this.option('rtlEnabled');
      if ($container.children().length && (!rtlEnabled && options.columnAlignment === 'right' || rtlEnabled && options.columnAlignment === 'left')) {
        $container.prepend($indicator);
        return;
      }
    }
    super._renderIndicator(options);
  }
};
exports.headerFilterMixin = headerFilterMixin;