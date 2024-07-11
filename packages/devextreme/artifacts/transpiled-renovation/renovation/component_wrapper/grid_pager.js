"use strict";

exports.GridPagerWrapper = void 0;
var _component = _interopRequireDefault(require("./common/component"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class GridPagerWrapper extends _component.default {
  _optionChanged(args) {
    switch (args.name) {
      case 'pageIndex':
        {
          const pageIndexChanged = this.option('pageIndexChanged');
          if (pageIndexChanged) {
            pageIndexChanged(args.value);
          }
          break;
        }
      case 'pageSize':
        {
          const pageSizeChanged = this.option('pageSizeChanged');
          if (pageSizeChanged) {
            pageSizeChanged(args.value);
          }
          break;
        }
      default:
        break;
    }
    super._optionChanged(args);
  }
}
exports.GridPagerWrapper = GridPagerWrapper;