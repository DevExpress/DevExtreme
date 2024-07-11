"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
require("./module_not_extended/column_headers");
require("./m_columns_controller");
require("./data_controller/m_data_controller");
require("./module_not_extended/sorting");
require("./rows/m_rows");
require("./module_not_extended/context_menu");
require("./module_not_extended/error_handling");
require("./m_grid_view");
require("./module_not_extended/header_panel");
var _component_registrator = _interopRequireDefault(require("../../../core/component_registrator"));
var _type = require("../../../core/utils/type");
var _themes = require("../../../ui/themes");
var _m_utils = _interopRequireDefault(require("../../grids/grid_core/m_utils"));
var _m_widget_base = _interopRequireDefault(require("../../grids/grid_core/m_widget_base"));
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TREELIST_CLASS = 'dx-treelist';
_m_core.default.registerModulesOrder(['stateStoring', 'columns', 'selection', 'editorFactory', 'columnChooser', 'editingRowBased', 'editingFormBased', 'editingCellBased', 'editing', 'grouping', 'masterDetail', 'validating', 'adaptivity', 'data', 'virtualScrolling', 'columnHeaders', 'filterRow', 'headerPanel', 'headerFilter', 'sorting', 'search', 'rows', 'pager', 'columnsResizingReordering', 'contextMenu', 'keyboardNavigation', 'errorHandling', 'summary', 'columnFixing', 'export', 'gridView']);
class TreeList extends _m_widget_base.default {
  _initMarkup() {
    // @ts-expect-error
    super._initMarkup.apply(this, arguments);
    this.$element().addClass(TREELIST_CLASS);
    this.getView('gridView').render(this.$element());
  }
  static registerModule() {
    _m_core.default.registerModule.apply(_m_core.default, arguments);
  }
  _defaultOptionsRules() {
    // @ts-expect-error
    return super._defaultOptionsRules().concat([{
      device() {
        // @ts-expect-error
        return (0, _themes.isMaterialBased)();
      },
      options: {
        showRowLines: true,
        showColumnLines: false,
        headerFilter: {
          height: 315
        },
        editing: {
          useIcons: true
        }
      }
    }]);
  }
  _init() {
    const that = this;
    // @ts-expect-error
    super._init();
    if (!this.option('_disableDeprecationWarnings')) {
      _m_utils.default.logHeaderFilterDeprecatedWarningIfNeed(this);
    }
    _m_core.default.processModules(that, _m_core.default);
    _m_core.default.callModuleItemsMethod(this, 'init');
  }
  getGridCoreHelper() {
    return _m_core.default;
  }
  focus(element) {
    super.focus();
    if ((0, _type.isDefined)(element)) {
      this.getController('keyboardNavigation').focus(element);
    }
  }
}
// @ts-expect-error
(0, _component_registrator.default)('dxTreeList', TreeList);
var _default = exports.default = TreeList;