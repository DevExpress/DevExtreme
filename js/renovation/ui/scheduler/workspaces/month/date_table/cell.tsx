import {
  Component,
  JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import { combineClasses } from '../../../../../utils/combine_classes';
import {
  DateTableCellBase,
  DateTableCellBaseProps,
} from '../../base/date_table/cell';

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
  },
  classes,
  restAttributes,
}: MonthDateTableCell): JSX.Element => (
  <DateTableCellBase
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
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
}
