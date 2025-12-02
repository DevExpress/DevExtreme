/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getPublicElement } from '@js/core/element';
import $ from '@js/core/renderer';
import type Gantt from '@ts/ui/gantt/ui.gantt';

export class GanttTemplatesManager {
  _gantt: Gantt;

  constructor(gantt: Gantt) {
    this._gantt = gantt;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption
      && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template
      && ((container, item, callback): boolean => {
        template.render({
          model: this._gantt.getTaskDataByCoreData(item),
          container: getPublicElement($(container)),
          onRendered: () => {
            callback();
          },
        });
        return isTooltipShowing;
      });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return createTemplateFunction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskProgressTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption
      && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template
      && ((container, item, callback): boolean => {
        template.render({
          model: item,
          container: getPublicElement($(container)),
          onRendered: () => {
            callback();
          },
        });
        return isTooltipShowing;
      });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return createTemplateFunction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskTimeTooltipContentTemplateFunc(taskTooltipContentTemplateOption) {
    const isTooltipShowing = true;
    const template = taskTooltipContentTemplateOption
      && this._gantt._getTemplate(taskTooltipContentTemplateOption);
    const createTemplateFunction = template
      && ((container, item, callback): boolean => {
        template.render({
          model: item,
          container: getPublicElement($(container)),
          onRendered: () => {
            callback();
          },
        });
        return isTooltipShowing;
      });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return createTemplateFunction;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getTaskContentTemplateFunc(taskContentTemplateOption) {
    const isTaskShowing = true;
    const template = taskContentTemplateOption
      && this._gantt._getTemplate(taskContentTemplateOption);
    const createTemplateFunction = template
      && ((container, item, callback, index): boolean => {
        item.taskData = this._gantt.getTaskDataByCoreData(item.taskData);
        template.render({
          model: item,
          container: getPublicElement($(container)),
          onRendered: () => {
            callback(container, index);
          },
        });
        return isTaskShowing;
      });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return createTemplateFunction;
  }
}
