"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.FieldChooserBase = void 0;
var _component_registrator = _interopRequireDefault(require("../../../../core/component_registrator"));
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _deferred = require("../../../../core/utils/deferred");
var _extend = require("../../../../core/utils/extend");
var _iterator = require("../../../../core/utils/iterator");
var _type = require("../../../../core/utils/type");
var _array_store = _interopRequireDefault(require("../../../../data/array_store"));
var _click = require("../../../../events/click");
var _events_engine = _interopRequireDefault(require("../../../../events/core/events_engine"));
var _message = _interopRequireDefault(require("../../../../localization/message"));
var _ui = _interopRequireDefault(require("../../../../ui/widget/ui.widget"));
var _m_column_state_mixin = _interopRequireDefault(require("../../../grids/grid_core/column_state_mixin/m_column_state_mixin"));
var _m_header_filter_core = require("../../../grids/grid_core/header_filter/m_header_filter_core");
var _m_utils = _interopRequireDefault(require("../../../grids/grid_core/m_utils"));
var _m_sorting_mixin = _interopRequireDefault(require("../../../grids/grid_core/sorting/m_sorting_mixin"));
var _m_widget_utils = require("../m_widget_utils");
var _m_sortable = _interopRequireDefault(require("../sortable/m_sortable"));
var _const = require("./const");
var _dom = require("./dom");
var _utils = require("./utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } /* eslint-disable max-classes-per-file */
const {
  Sortable
} = _m_sortable.default;
const DIV = '<div>';
class HeaderFilterView extends _m_header_filter_core.HeaderFilterView {
  _getSearchExpr(options, headerFilterOptions) {
    options.useDefaultSearchExpr = true;
    return super._getSearchExpr(options, headerFilterOptions);
  }
}
const processItems = function (groupItems, field) {
  const filterValues = [];
  const isTree = !!field.groupName;
  const isExcludeFilterType = field.filterType === 'exclude';
  if (field.filterValues) {
    (0, _iterator.each)(field.filterValues, (_, filterValue) => {
      filterValues.push(Array.isArray(filterValue) ? filterValue.join('/') : filterValue && filterValue.valueOf());
    });
  }
  (0, _m_widget_utils.foreachTree)(groupItems, items => {
    const item = items[0];
    const path = (0, _m_widget_utils.createPath)(items);
    const preparedFilterValueByText = isTree ? (0, _iterator.map)(items, item => item.text).reverse().join('/') : item.text;
    item.value = isTree ? path.slice(0) : item.key || item.value;
    const preparedFilterValue = isTree ? path.join('/') : item.value && item.value.valueOf();
    if (item.children) {
      item.items = item.children;
      item.children = null;
    }
    (0, _m_header_filter_core.updateHeaderFilterItemSelectionState)(item, item.key && filterValues.includes(preparedFilterValueByText) || filterValues.includes(preparedFilterValue), isExcludeFilterType);
  });
};
function getMainGroupField(dataSource, sourceField) {
  let field = sourceField;
  if ((0, _type.isDefined)(sourceField.groupIndex)) {
    field = dataSource.getAreaFields(sourceField.area, true)[sourceField.areaIndex];
  }
  return field;
}
function getStringState(state) {
  state = state || {};
  return JSON.stringify([state.fields, state.columnExpandedPaths, state.rowExpandedPaths]);
}
const mixinWidget = (0, _m_header_filter_core.headerFilterMixin)((0, _m_sorting_mixin.default)((0, _m_column_state_mixin.default)(_ui.default)));
class FieldChooserBase extends mixinWidget {
  _getDefaultOptions() {
    return _extends({}, super._getDefaultOptions(), {
      allowFieldDragging: true,
      applyChangesMode: 'instantly',
      state: null,
      headerFilter: {
        width: 252,
        height: 325,
        allowSelectAll: true,
        showRelevantValues: false,
        search: {
          enabled: false,
          timeout: 500,
          editorOptions: {},
          mode: 'contains'
        },
        texts: {
          emptyValue: _message.default.format('dxDataGrid-headerFilterEmptyValue'),
          ok: _message.default.format('dxDataGrid-headerFilterOK'),
          cancel: _message.default.format('dxDataGrid-headerFilterCancel')
        }
      },
      // NOTE: private option added in fix of the T1150523 ticket.
      remoteSort: false
    });
  }
  _init() {
    super._init();
    this._headerFilterView = new HeaderFilterView(this);
    this._refreshDataSource();
    this.subscribeToEvents();
    _m_utils.default.logHeaderFilterDeprecatedWarningIfNeed(this);
  }
  _refreshDataSource() {
    const dataSource = this.option('dataSource');
    if (dataSource && dataSource.fields && dataSource.load /* instanceof DX.ui.dxPivotGrid.DataSource */) {
      this._dataSource = dataSource;
    }
  }
  _optionChanged(args) {
    switch (args.name) {
      case 'dataSource':
        this._refreshDataSource();
        break;
      case 'applyChangesMode':
      case 'remoteSort':
        break;
      case 'state':
        if (this._skipStateChange || !this._dataSource) {
          break;
        }
        if (this.option('applyChangesMode') === 'instantly' && getStringState(this._dataSource.state()) !== getStringState(args.value)) {
          this._dataSource.state(args.value);
        } else {
          this._clean(true);
          this._renderComponent();
        }
        break;
      case 'headerFilter':
      case 'allowFieldDragging':
        this._invalidate();
        break;
      default:
        super._optionChanged(args);
    }
  }
  renderField(field, showColumnLines) {
    const that = this;
    const $fieldContent = (0, _renderer.default)(DIV).addClass(_const.CLASSES.area.fieldContent).text(field.caption || field.dataField);
    const $fieldElement = (0, _renderer.default)(DIV).addClass(_const.CLASSES.area.field).addClass(_const.CLASSES.area.box).data('field', field).append($fieldContent);
    const mainGroupField = getMainGroupField(that._dataSource, field);
    if (field.area !== 'data') {
      if (field.allowSorting) {
        that._applyColumnState({
          name: 'sort',
          rootElement: $fieldElement,
          column: {
            alignment: that.option('rtlEnabled') ? 'right' : 'left',
            sortOrder: field.sortOrder === 'desc' ? 'desc' : 'asc',
            allowSorting: field.allowSorting
          },
          showColumnLines
        });
      }
      that._applyColumnState({
        name: 'headerFilter',
        rootElement: $fieldElement,
        column: {
          alignment: that.option('rtlEnabled') ? 'right' : 'left',
          filterValues: mainGroupField.filterValues,
          allowFiltering: mainGroupField.allowFiltering && !field.groupIndex,
          allowSorting: field.allowSorting
        },
        showColumnLines
      });
    }
    if (field.groupName) {
      $fieldElement.attr(_const.ATTRIBUTES.itemGroup, field.groupName);
    }
    return $fieldElement;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _clean(value) {}
  _render() {
    super._render();
    this._headerFilterView.render(this.$element());
  }
  renderSortable() {
    const that = this;
    that._createComponent(that.$element(), Sortable, (0, _extend.extend)({
      allowDragging: that.option('allowFieldDragging'),
      itemSelector: `.${_const.CLASSES.area.field}`,
      itemContainerSelector: `.${_const.CLASSES.area.fieldContainer}`,
      groupSelector: `.${_const.CLASSES.area.fieldList}`,
      groupFilter() {
        const dataSource = that._dataSource;
        const $sortable = (0, _renderer.default)(this).closest('.dx-sortable-old');
        const pivotGrid = $sortable.data('dxPivotGrid');
        const pivotGridFieldChooser = $sortable.data('dxPivotGridFieldChooser');
        if (pivotGrid) {
          return pivotGrid.getDataSource() === dataSource;
        }
        if (pivotGridFieldChooser) {
          return pivotGridFieldChooser.option('dataSource') === dataSource;
        }
        return false;
      },
      itemRender: _dom.dragAndDropItemRender,
      onDragging(e) {
        const field = e.sourceElement.data('field');
        const {
          targetGroup
        } = e;
        e.cancel = false;
        if (field.isMeasure === true) {
          if (targetGroup === 'column' || targetGroup === 'row' || targetGroup === 'filter') {
            e.cancel = true;
          }
        } else if (field.isMeasure === false && targetGroup === 'data') {
          e.cancel = true;
        }
      },
      useIndicator: true,
      onChanged(e) {
        const field = e.sourceElement.data('field');
        e.removeSourceElement = !!e.sourceGroup;
        that._adjustSortableOnChangedArgs(e);
        if (field) {
          const {
            targetIndex
          } = e;
          let mainGroupField;
          let invisibleFieldsIndexOffset = 0;
          that._processDemandState(dataSource => {
            const fields = dataSource.getAreaFields(field.area, true);
            mainGroupField = getMainGroupField(dataSource, field);
            const visibleFields = fields.filter(f => f.visible !== false);
            const fieldBeforeTarget = visibleFields[targetIndex - 1];
            if (fieldBeforeTarget) {
              invisibleFieldsIndexOffset = fields.filter(f => f.visible === false && f.areaIndex <= fieldBeforeTarget.areaIndex).length;
            }
          });
          that._applyChanges([mainGroupField], {
            area: e.targetGroup,
            areaIndex: targetIndex + invisibleFieldsIndexOffset
          });
        }
      }
    }, that._getSortableOptions()));
  }
  _processDemandState(func) {
    const that = this;
    const isInstantlyMode = that.option('applyChangesMode') === 'instantly';
    const dataSource = that._dataSource;
    if (isInstantlyMode) {
      func(dataSource, isInstantlyMode);
    } else {
      const currentState = dataSource.state();
      const pivotGridState = that.option('state');
      if (pivotGridState) {
        dataSource.state(pivotGridState, true);
      }
      func(dataSource, isInstantlyMode);
      dataSource.state(currentState, true);
    }
  }
  _applyChanges(fields, props) {
    const that = this;
    that._processDemandState((dataSource, isInstantlyMode) => {
      fields.forEach(_ref => {
        let {
          index
        } = _ref;
        dataSource.field(index, props);
      });
      if (isInstantlyMode) {
        dataSource.load();
      } else {
        that._changedHandler();
      }
    });
  }
  _applyLocalSortChanges(fieldIdx, sortOrder) {
    this._processDemandState(dataSource => {
      dataSource.field(fieldIdx, {
        sortOrder
      });
      dataSource.sortLocal();
    });
  }
  _adjustSortableOnChangedArgs(e) {
    e.removeSourceElement = false;
    e.removeTargetElement = true;
    e.removeSourceClass = false;
  }
  _getSortableOptions() {
    return {
      direction: 'auto'
    };
  }
  subscribeToEvents(element) {
    const that = this;
    const func = function (e) {
      const field = (0, _renderer.default)(e.currentTarget).data('field');
      const mainGroupField = (0, _extend.extend)(true, {}, getMainGroupField(that._dataSource, field));
      const isHeaderFilter = (0, _renderer.default)(e.target).hasClass(_const.CLASSES.headerFilter);
      const dataSource = that._dataSource;
      const type = mainGroupField.groupName ? 'tree' : 'list';
      const paginate = dataSource.paginate() && type === 'list';
      if (isHeaderFilter) {
        that._headerFilterView.showHeaderFilterMenu((0, _renderer.default)(e.currentTarget), (0, _extend.extend)(mainGroupField, {
          type,
          encodeHtml: that.option('encodeHtml'),
          dataSource: {
            useDefaultSearch: !paginate,
            // paginate: false,
            load(options) {
              const {
                userData
              } = options;
              if (userData.store) {
                return userData.store.load(options);
              }
              // @ts-expect-error
              const d = new _deferred.Deferred();
              dataSource.getFieldValues(mainGroupField.index, that.option('headerFilter.showRelevantValues'), paginate ? options : undefined).done(data => {
                const emptyValue = that.option('headerFilter.texts.emptyValue');
                data.forEach(element => {
                  if (!element.text) {
                    element.text = emptyValue;
                  }
                });
                if (paginate) {
                  d.resolve(data);
                } else {
                  userData.store = new _array_store.default(data);
                  userData.store.load(options).done(d.resolve).fail(d.reject);
                }
              }).fail(d.reject);
              return d;
            },
            postProcess(data) {
              processItems(data, mainGroupField);
              return data;
            }
          },
          apply() {
            that._applyChanges([mainGroupField], {
              filterValues: this.filterValues,
              filterType: this.filterType
            });
          }
        }));
      } else if (field.allowSorting && field.area !== 'data') {
        const isRemoteSort = that.option('remoteSort');
        const sortOrder = (0, _utils.reverseSortOrder)(field.sortOrder);
        if (isRemoteSort) {
          that._applyChanges([field], {
            sortOrder
          });
        } else {
          that._applyLocalSortChanges(field.index, sortOrder);
        }
      }
    };
    if (element) {
      _events_engine.default.on(element, _click.name, `.${_const.CLASSES.area.field}.${_const.CLASSES.area.box}`, func);
      return;
    }
    _events_engine.default.on(that.$element(), _click.name, `.${_const.CLASSES.area.field}.${_const.CLASSES.area.box}`, func);
  }
  _initTemplates() {}
  addWidgetPrefix(className) {
    return `dx-pivotgrid-${className}`;
  }
}
exports.FieldChooserBase = FieldChooserBase;
(0, _component_registrator.default)('dxPivotGridFieldChooserBase', FieldChooserBase);
var _default = exports.default = {
  FieldChooserBase
};