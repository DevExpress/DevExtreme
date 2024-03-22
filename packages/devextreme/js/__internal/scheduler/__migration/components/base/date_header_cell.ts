import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@devextreme-generator/declarations';
import { getTemplate } from '@ts/core/component_wrappers/utils/index';
import type { VNode } from 'inferno';
import {
  createComponentVNode,
  createFragment,
  createVNode,
} from 'inferno';

import { renderUtils } from '../../utils/index';
import type { DateTimeCellTemplateProps } from '../types';
import type { CellBaseProps } from './cell';
import { CellBaseDefaultProps } from './cell';
import { DateHeaderText } from './date_header_text';

export interface DateHeaderCellProps extends CellBaseProps {
  today: boolean;
  colSpan: number;
  isWeekDayCell: boolean;
  splitText: boolean;
  // TODO: this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
  isTimeCellTemplate: boolean;
  timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
  dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

const DateHeaderCellDefaultProps: DateHeaderCellProps = {
  ...CellBaseDefaultProps,
  today: false,
  colSpan: 1,
  isWeekDayCell: false,
  splitText: false,
  isTimeCellTemplate: false,
};

export class DateHeaderCell extends BaseInfernoComponent<DateHeaderCellProps> {
  render(): VNode {
    const {
      colSpan,
      dateCellTemplate,
      groupIndex,
      groups,
      index,
      isTimeCellTemplate,
      splitText,
      startDate,
      text,
      timeCellTemplate,
      className,
      isFirstGroupCell,
      isLastGroupCell,
      isWeekDayCell,
      today,
    } = this.props;
    const timeCellTemplateComponent = getTemplate(timeCellTemplate);
    const dateCellTemplateComponent = getTemplate(dateCellTemplate);
    const cellClasses = renderUtils.combineClasses({
      'dx-scheduler-header-panel-cell': true,
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-header-panel-current-time-cell': today,
      'dx-scheduler-header-panel-week-cell': isWeekDayCell,
      [className]: !!className,
    });
    const classNames = renderUtils
      .getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
    const useTemplate = (!isTimeCellTemplate && !!dateCellTemplate)
      || (isTimeCellTemplate && !!timeCellTemplate);

    const children = useTemplate
      ? createFragment([isTimeCellTemplate
      && timeCellTemplateComponent
      && timeCellTemplateComponent({
        data: {
          date: startDate,
          text,
          groups,
          groupIndex,
        },
        index,
      }), !isTimeCellTemplate
      && dateCellTemplateComponent
      && dateCellTemplateComponent({
        data: {
          date: startDate,
          text,
          groups,
          groupIndex,
        },
        index,
      })], 0)
      : createComponentVNode(2, DateHeaderText, {
        splitText,
        text,
      });

    return createVNode(1, 'th', classNames, children, 0, {
      colSpan,
      title: text,
    });
  }
}
DateHeaderCell.defaultProps = DateHeaderCellDefaultProps;
