"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _type = require("../../../../core/utils/type");
var _devextremeQuill = _interopRequireDefault(require("devextreme-quill"));
var _empty = _interopRequireDefault(require("./empty"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// eslint-disable-next-line import/no-mutable-exports
let BaseModule = _empty.default;
if (_devextremeQuill.default) {
  const BaseQuillModule = _devextremeQuill.default.import('core/module');
  // @ts-expect-error
  BaseModule = class BaseHtmlEditorModule extends BaseQuillModule {
    constructor(quill, options) {
      super(quill, options);
      this.editorInstance = options.editorInstance;
    }
    saveValueChangeEvent(event) {
      this.editorInstance._saveValueChangeEvent(event);
    }
    addCleanCallback(callback) {
      this.editorInstance.addCleanCallback(callback);
    }
    handleOptionChangeValue(changes) {
      if ((0, _type.isObject)(changes)) {
        Object.entries(changes).forEach(_ref => {
          let [name, value] = _ref;
          return this.option(name, value);
        });
      } else if (!(0, _type.isDefined)(changes)) {
        this === null || this === void 0 || this.clean();
      }
    }
  };
}
var _default = exports.default = BaseModule;