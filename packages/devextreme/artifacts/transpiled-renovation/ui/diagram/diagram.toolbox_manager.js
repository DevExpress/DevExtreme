"use strict";

exports.default = void 0;
var _message = _interopRequireDefault(require("../../localization/message"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DiagramToolboxManager = {
  getDefaultGroups() {
    return this._groups || (this._groups = {
      general: {
        category: 'general',
        title: _message.default.format('dxDiagram-categoryGeneral')
      },
      flowchart: {
        category: 'flowchart',
        title: _message.default.format('dxDiagram-categoryFlowchart')
      },
      orgChart: {
        category: 'orgChart',
        title: _message.default.format('dxDiagram-categoryOrgChart')
      },
      containers: {
        category: 'containers',
        title: _message.default.format('dxDiagram-categoryContainers')
      },
      custom: {
        category: 'custom',
        title: _message.default.format('dxDiagram-categoryCustom')
      }
    });
  },
  getGroups: function (groups) {
    const defaultGroups = this.getDefaultGroups();
    if (groups) {
      return groups.map(function (g) {
        if (typeof g === 'string') {
          return {
            category: g,
            title: defaultGroups[g] && defaultGroups[g].title || g
          };
        }
        return g;
      }).filter(function (g) {
        return g;
      });
    }
    return [defaultGroups['general'], defaultGroups['flowchart'], defaultGroups['orgChart'], defaultGroups['containers']];
  }
};
var _default = exports.default = DiagramToolboxManager;
module.exports = exports.default;
module.exports.default = exports.default;