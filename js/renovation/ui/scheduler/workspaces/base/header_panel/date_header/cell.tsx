import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  JSXTemplate,
  Fragment,
} from '@devextreme-generator/declarations';
import { CellBaseProps } from '../../cell';
import { DateTimeCellTemplateProps } from '../../../types.d';
import { combineClasses } from '../../../../../../utils/combine_classes';
import { getGroupCellClasses } from '../../../utils';

export const viewFunction = ({
  classes,
  useTemplate,
  props: {
    text,
    dateCellTemplate: DateCellTemplate,
    timeCellTemplate: TimeCellTemplate,
    isTimeCellTemplate,
    colSpan,
    startDate,
    groups,
    groupIndex,
    index,
  },
}: DateHeaderCell): JSX.Element => (
  <th
    className={classes}
    colSpan={colSpan}
    title={text}
  >
    {useTemplate ? (
      // TODO: this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
      <Fragment>
        {isTimeCellTemplate && TimeCellTemplate && (
          <TimeCellTemplate
            data={{
              date: startDate,
              text,
              groups,
              groupIndex,
            }}
            index={index}
          />
        )}
        {!isTimeCellTemplate && DateCellTemplate && (
          <DateCellTemplate
            data={{
              date: startDate,
              text,
              groups,
              groupIndex,
            }}
            index={index}
          />
        )}
      </Fragment>
    ) : (
      text
    )}
  </th>
);

@ComponentBindings()
export class DateHeaderCellProps extends CellBaseProps {
  @OneWay() today = false;

  @OneWay() colSpan = 1;

  @OneWay() isWeekDayCell = false;

  // TODO: this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
  @OneWay() isTimeCellTemplate = false;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateHeaderCell extends JSXComponent(DateHeaderCellProps) {
  get classes(): string {
    const {
      today,
      className,
      isFirstGroupCell,
      isLastGroupCell,
      isWeekDayCell,
    } = this.props;

    const cellClasses = combineClasses({
      'dx-scheduler-header-panel-cell': true,
      'dx-scheduler-cell-sizes-horizontal': true,
      'dx-scheduler-header-panel-current-time-cell': today,
      'dx-scheduler-header-panel-week-cell': isWeekDayCell,
      [className]: !!className,
    });

    return getGroupCellClasses(isFirstGroupCell, isLastGroupCell, cellClasses);
  }

  // TODO: this is a workaround for https://github.com/DevExpress/devextreme-renovation/issues/574
  get useTemplate(): boolean {
    const { isTimeCellTemplate, dateCellTemplate, timeCellTemplate } = this.props;

    return (!isTimeCellTemplate && !!dateCellTemplate)
      || (isTimeCellTemplate && !!timeCellTemplate);
  }
}
