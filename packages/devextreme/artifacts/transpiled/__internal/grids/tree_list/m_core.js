"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extend = require("../../../core/utils/extend");
var _m_modules = _interopRequireDefault(require("../../grids/grid_core/m_modules"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = (0, _extend.extend)({}, _m_modules.default, {
  modules: [],
  foreachNodes(nodes, callBack, ignoreHasChildren) {
    for (let i = 0; i < nodes.length; i++) {
      if (callBack(nodes[i]) !== false && (ignoreHasChildren || nodes[i].hasChildren) && nodes[i].children.length) {
        this.foreachNodes(nodes[i].children, callBack, ignoreHasChildren);
      }
    }
  }
});