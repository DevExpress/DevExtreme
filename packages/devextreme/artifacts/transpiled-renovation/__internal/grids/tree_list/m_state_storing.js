"use strict";

var _m_state_storing = require("../../grids/grid_core/state_storing/m_state_storing");
var _m_core = _interopRequireDefault(require("./m_core"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); } // eslint-disable-next-line max-classes-per-file
const stateStoring = Base => class TreeListStateStoringExtender extends _m_state_storing.stateStoringModule.extenders.controllers.stateStoring(Base) {
  applyState(state) {
    super.applyState(state);
    this.option('expandedRowKeys', state.expandedRowKeys ? state.expandedRowKeys.slice() : []);
  }
};
const data = Base => class TreeListStateStoringDataExtender extends _m_state_storing.stateStoringModule.extenders.controllers.data(Base) {
  getUserState() {
    const state = super.getUserState();
    if (!this.option('autoExpandAll')) {
      state.expandedRowKeys = this.option('expandedRowKeys');
    }
    return state;
  }
};
_m_core.default.registerModule('stateStoring', _extends({}, _m_state_storing.stateStoringModule, {
  extenders: _extends({}, _m_state_storing.stateStoringModule.extenders, {
    controllers: _extends({}, _m_state_storing.stateStoringModule.extenders.controllers, {
      stateStoring,
      data
    })
  })
}));