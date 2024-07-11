"use strict";

exports.default = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _diagram = require("./diagram.importer");
var _message = _interopRequireDefault(require("../../localization/message"));
var _file_uploader = _interopRequireDefault(require("../file_uploader"));
var _window = require("../../core/utils/window");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DiagramDialogManager = {
  getConfigurations: function () {
    const {
      DiagramCommand
    } = (0, _diagram.getDiagram)();
    return this.dialogList || (this.dialogList = [{
      command: DiagramCommand.InsertShapeImage,
      title: _message.default.format('dxDiagram-dialogInsertShapeImageTitle'),
      onGetContent: this.getChangeImageDialogContent
    }, {
      command: DiagramCommand.EditShapeImage,
      title: _message.default.format('dxDiagram-dialogEditShapeImageTitle'),
      onGetContent: this.getChangeImageDialogContent
    }]);
  },
  getChangeImageDialogContent: function (args) {
    const $uploader = (0, _renderer.default)('<div>');
    args.component._createComponent($uploader, _file_uploader.default, {
      selectButtonText: _message.default.format('dxDiagram-dialogEditShapeImageSelectButton'),
      accept: 'image/*',
      uploadMode: 'useForm',
      onValueChanged: function (e) {
        const window = (0, _window.getWindow)();
        const reader = new window.FileReader();
        reader.onload = function (e) {
          args.component._commandParameter = e.target.result;
        };
        reader.readAsDataURL(e.value[0]);
      }
    });
    return $uploader;
  },
  getDialogParameters(command) {
    const commandIndex = this.getConfigurations().map(c => c.command).indexOf(command);
    if (commandIndex >= 0) {
      return this.getConfigurations()[commandIndex];
    } else {
      return null;
    }
  }
};
var _default = exports.default = DiagramDialogManager;
module.exports = exports.default;
module.exports.default = exports.default;