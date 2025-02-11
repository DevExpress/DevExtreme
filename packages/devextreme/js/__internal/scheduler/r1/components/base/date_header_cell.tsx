import { BaseInfernoComponent } from '@devextreme/runtime/inferno';
import type { JSXTemplate } from '@ts/core/r1/types';
import { getTemplate } from '@ts/core/r1/utils/index';

import { combineClasses } from '../../../../core/r1/utils/render_utils';
import { renderUtils } from '../../utils/index';
import type { DateTimeCellTemplateProps, DefaultProps } from '../types';
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

export const DateHeaderCellDefaultProps: DefaultProps<DateHeaderCellProps> = {
  ...CellBaseDefaultProps,
  today: false,
  colSpan: 1,
  isWeekDayCell: false,
  splitText: false,
  isTimeCellTemplate: false,
};

export class DateHeaderCell extends BaseInfernoComponent<DateHeaderCellProps> {
  render(): JSX.Element {
    const {
      viewContext: { view: { type: viewType }, crossScrollingEnabled },
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
    const cellSizeHorizontalClass = renderUtils
      .getCellSizeHorizontalClass(viewType, crossScrollingEnabled);
    const cellClasses = combineClasses({
      'dx-scheduler-header-panel-cell': true,
      [cellSizeHorizontalClass]: true,
      'dx-scheduler-header-panel-current-time-cell': today,
      'dx-scheduler-header-panel-week-cell': isWeekDayCell,
      [className ?? '']: !!className,
    });
    const classes = renderUtils
      .getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
    const useTemplate = (!isTimeCellTemplate && !!dateCellTemplate)
      || (isTimeCellTemplate && !!timeCellTemplate);
    const TimeCellTemplateComponent = getTemplate(timeCellTemplate);
    const DateCellTemplateComponent = getTemplate(dateCellTemplate);

    const children = useTemplate ? (
        // TODO: this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
        <>
          {isTimeCellTemplate && TimeCellTemplateComponent
            && TimeCellTemplateComponent({
              data: {
                date: startDate,
                text,
                groups,
                groupIndex,
              },
              index,
            })}
          {!isTimeCellTemplate && DateCellTemplateComponent
            && DateCellTemplateComponent({
              data: {
                date: startDate,
                text,
                groups,
                groupIndex,
              },
              index,
            })}
        </>
    )
      : (
        // @ts-ignore
        <DateHeaderText
          splitText={splitText}
          text={text}
        />
      );

    return (
      <th
        className={classes}
        colSpan={colSpan}
        title={text}
      >
        {children}
      </th>
    );
  }
}

DateHeaderCell.defaultProps = DateHeaderCellDefaultProps;
