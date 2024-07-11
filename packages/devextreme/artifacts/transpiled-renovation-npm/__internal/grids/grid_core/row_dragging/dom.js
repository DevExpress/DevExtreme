"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GridCoreRowDraggingDom = void 0;
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _m_utils = _interopRequireDefault(require("../m_utils"));
var _const = require("./const");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

// eslint-disable-next-line @typescript-eslint/no-restricted-imports,

const createHandleTemplateFunc = addWidgetPrefix => (container, options) => {
  const $container = (0, _renderer.default)(container);
  if (options.rowType === 'data') {
    $container.addClass(_const.CLASSES.cellFocusDisabled);
    return (0, _renderer.default)('<span>').addClass(addWidgetPrefix(_const.CLASSES.handleIcon));
  }
  _m_utils.default.setEmptyText($container);
  return undefined;
};
const GridCoreRowDraggingDom = exports.GridCoreRowDraggingDom = {
  createHandleTemplateFunc
};