"use strict";

exports.GanttTemplatesManager = void 0;
var _renderer = _interopRequireDefault(require("../../core/renderer"));
var _element = require("../../core/element");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class GanttTemplatesManager {
  constructor(gantt) {
    this._gantt = gantt;
  }
  getTaskTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback) => {
      template.render({
        model: this._gantt.getTaskDataByCoreData(item),
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback();
        }
      });
      return isTooltipShowing;
    });
    return createTemplateFunction;
  }
  getTaskProgressTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback) => {
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback();
        }
      });
      return isTooltipShowing;
    });
    return createTemplateFunction;
  }
  getTaskTimeTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback) => {
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback();
        }
      });
      return isTooltipShowing;
    });
    return createTemplateFunction;
  }
  getTaskContentTemplateFunc(taskContentTemplateOption) {
    const isTaskShowing = true;
    const template = taskContentTemplateOption && this._gantt._getTemplate(taskContentTemplateOption);
    const createTemplateFunction = template && ((container, item, callback, index) => {
      item.taskData = this._gantt.getTaskDataByCoreData(item.taskData);
      template.render({
        model: item,
        container: (0, _element.getPublicElement)((0, _renderer.default)(container)),
        onRendered: () => {
          callback(container, index);
        }
      });
      return isTaskShowing;
    });
    return createTemplateFunction;
  }
}
exports.GanttTemplatesManager = GanttTemplatesManager;