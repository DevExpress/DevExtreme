"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _m_align = _interopRequireDefault(require("./formats/m_align"));
var _m_font = _interopRequireDefault(require("./formats/m_font"));
var _m_image = _interopRequireDefault(require("./formats/m_image"));
var _m_link = _interopRequireDefault(require("./formats/m_link"));
var _m_size = _interopRequireDefault(require("./formats/m_size"));
var _m_quill_importer = require("./m_quill_importer");
var _m_dropImage = _interopRequireDefault(require("./modules/m_dropImage"));
var _m_imageCursor = _interopRequireDefault(require("./modules/m_imageCursor"));
var _m_imageUpload = _interopRequireDefault(require("./modules/m_imageUpload"));
var _m_mentions = _interopRequireDefault(require("./modules/m_mentions"));
var _m_resizing = _interopRequireDefault(require("./modules/m_resizing"));
var _m_tableContextMenu = _interopRequireDefault(require("./modules/m_tableContextMenu"));
var _m_tableResizing = _interopRequireDefault(require("./modules/m_tableResizing"));
var _m_toolbar = _interopRequireDefault(require("./modules/m_toolbar"));
var _m_variables = _interopRequireDefault(require("./modules/m_variables"));
var _m_base = _interopRequireDefault(require("./themes/m_base"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class QuillRegistrator {
  constructor() {
    this._customModules = [];
    // @ts-expect-error
    if (QuillRegistrator.initialized) {
      return;
    }
    const quill = this.getQuill();
    const DirectionStyle = quill.import('attributors/style/direction');
    quill.register({
      'formats/align': _m_align.default,
      'formats/direction': DirectionStyle,
      'formats/font': _m_font.default,
      'formats/size': _m_size.default,
      'formats/extendedImage': _m_image.default,
      'formats/link': _m_link.default,
      'modules/toolbar': _m_toolbar.default,
      'modules/dropImage': _m_dropImage.default,
      'modules/variables': _m_variables.default,
      'modules/resizing': _m_resizing.default,
      'modules/tableResizing': _m_tableResizing.default,
      'modules/tableContextMenu': _m_tableContextMenu.default,
      'modules/imageUpload': _m_imageUpload.default,
      'modules/imageCursor': _m_imageCursor.default,
      'modules/mentions': _m_mentions.default,
      'themes/basic': _m_base.default
    }, true);
    this._customModules = [];
    // @ts-expect-error
    QuillRegistrator._initialized = true;
  }
  createEditor(container, config) {
    const quill = this.getQuill();
    // eslint-disable-next-line new-cap
    return new quill(container, config);
  }
  registerModules(modulesConfig) {
    const isModule = RegExp('modules/*');
    const quill = this.getQuill();
    const isRegisteredModule = modulePath => !!quill.imports[modulePath];
    // eslint-disable-next-line no-restricted-syntax
    for (const modulePath in modulesConfig) {
      if (isModule.test(modulePath) && !isRegisteredModule(modulePath)) {
        this._customModules.push(modulePath.slice(8));
      }
    }
    quill.register(modulesConfig, true);
  }
  getRegisteredModuleNames() {
    return this._customModules;
  }
  getQuill() {
    return (0, _m_quill_importer.getQuill)();
  }
}
var _default = exports.default = QuillRegistrator;