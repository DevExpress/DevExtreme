import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../../utils/combine_classes';
import {
  DateTableCellBase,
  DateTableCellBaseProps,
} from '../../base/date_table/cell';
import { ContentTemplateProps } from '../../types.d';

export const viewFunction = ({
  props: {
    dataCellTemplate,
    startDate,
    endDate,
    groups,
    groupIndex,
    index,
    isLastGroupCell,
    isFirstGroupCell,
    text,
    colSpan,
  },
  contentTemplateProps,
  classes,
}: MonthDateTableCell): JSX.Element => (
  <DateTableCellBase
    className={classes}
    dataCellTemplate={dataCellTemplate}
    startDate={startDate}
    endDate={endDate}
    text={text}
    groups={groups}
    groupIndex={groupIndex}
    index={index}
    isFirstGroupCell={isFirstGroupCell}
    isLastGroupCell={isLastGroupCell}
    contentTemplateProps={contentTemplateProps}
    colSpan={colSpan}
  >
    <div className="dx-scheduler-date-table-cell-text">
      {text}
    </div>
  </DateTableCellBase>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthDateTableCell extends JSXComponent(DateTableCellBaseProps) {
  get classes(): string | undefined {
    const {
      otherMonth,
      today,
      className,
      firstDayOfMonth,
    } = this.props;

    return combineClasses({
      'dx-scheduler-date-table-other-month': !!otherMonth,
      'dx-scheduler-date-table-current-date': !!today,
      'dx-scheduler-date-table-first-of-month': !!firstDayOfMonth,
      [className]: !!className,
    });
  }

  get contentTemplateProps(): ContentTemplateProps {
    const { text, index } = this.props;
    return { data: { text }, index };
  }
}
