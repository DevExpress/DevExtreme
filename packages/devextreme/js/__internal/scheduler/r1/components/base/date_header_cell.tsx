import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import type { JSXTemplate } from '@ts/core/r1/types';
import { PublicTemplate } from '@ts/scheduler/r1/components/templates/index';

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
  // this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
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
      [className ?? '']: Boolean(className),
    });
    const classes = renderUtils
      .getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
    const useTemplate = (!isTimeCellTemplate && Boolean(dateCellTemplate))
      || (isTimeCellTemplate && Boolean(timeCellTemplate));

    const children = useTemplate ? (
        // this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
        <>
          {isTimeCellTemplate
            && <PublicTemplate
              template={timeCellTemplate}
              templateProps={{
                data: {
                  date: startDate,
                  text,
                  groups,
                  groupIndex,
                },
                index,
              } as DateTimeCellTemplateProps}
            />}
          {!isTimeCellTemplate
            && <PublicTemplate
              template={dateCellTemplate}
              templateProps={{
                data: {
                  date: startDate,
                  text,
                  groups,
                  groupIndex,
                },
                index,
              } as DateTimeCellTemplateProps}
            />}
        </>
    )
      : (
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
