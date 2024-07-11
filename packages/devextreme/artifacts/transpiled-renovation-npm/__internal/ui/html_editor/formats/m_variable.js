"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _common = require("../../../../core/utils/common");
var _extend = require("../../../../core/utils/extend");
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-mutable-exports
let Variable = {};
if (_devextremeQuill.default) {
  const Embed = _devextremeQuill.default.import('blots/embed');
  const VARIABLE_CLASS = 'dx-variable';
  Variable = class Variable extends Embed {
    static create(data) {
      const node = super.create();
      let startEscapeChar;
      let endEscapeChar;
      const text = data.value;
      if (Array.isArray(data.escapeChar)) {
        startEscapeChar = (0, _common.ensureDefined)(data.escapeChar[0], '');
        endEscapeChar = (0, _common.ensureDefined)(data.escapeChar[1], '');
      } else {
        startEscapeChar = endEscapeChar = data.escapeChar;
      }
      node.innerText = startEscapeChar + text + endEscapeChar;
      node.dataset.varStartEscChar = startEscapeChar;
      node.dataset.varEndEscChar = endEscapeChar;
      node.dataset.varValue = data.value;
      return node;
    }
    static value(node) {
      return (0, _extend.extend)({}, {
        value: node.dataset.varValue,
        escapeChar: [node.dataset.varStartEscChar || '', node.dataset.varEndEscChar || '']
      });
    }
  };
  // @ts-expect-error
  Variable.blotName = 'variable';
  // @ts-expect-error
  Variable.tagName = 'span';
  // @ts-expect-error
  Variable.className = VARIABLE_CLASS;
}
var _default = exports.default = Variable;