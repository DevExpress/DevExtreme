import {
  Component,
  ComponentBindings,
  JSXComponent,
  Template,
  OneWay,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { CellBaseProps } from '../../cell';
import { DateTimeCellTemplateProps } from '../../../types.d';
import { combineClasses } from '../../../../../../utils/combine_classes';
import { getGroupCellClasses } from '../../../utils';

export const viewFunction = ({
  restAttributes,
  classes,
  props: {
    text,
    cellTemplate: CellTemplate,
    colSpan,
    startDate,
    groups,
    groupIndex,
    index,
  },
}: DateHeaderCell): JSX.Element => (
  <th
    className={classes}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    colSpan={colSpan}
    title={text}
  >
    {CellTemplate ? (
      <CellTemplate
        data={{
          date: startDate,
          text,
          groups,
          groupIndex,
        }}
        index={index}
      />
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

  @Template() cellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
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
}
