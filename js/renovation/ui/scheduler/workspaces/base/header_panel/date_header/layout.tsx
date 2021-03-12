import {
  Component,
  ComponentBindings,
  Fragment,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../../row';
import {
  DateHeaderCellData,
  DateTimeCellTemplateProps,
  Group,
} from '../../../types.d';
import { GroupOrientation } from '../../../../types.d';
import { isHorizontalGroupOrientation } from '../../../utils';
import { DateHeaderCell } from './cell';

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderMap,
    dateCellTemplate,
  },
}: DateHeaderLayout): JSX.Element => (
  <Fragment>
    {dateHeaderMap.map((dateHeaderRow, rowIndex) => (
      <Row className="dx-scheduler-header-row" key={rowIndex.toString()}>
        {dateHeaderRow.map(({
          startDate,
          endDate,
          today,
          groups: cellGroups,
          groupIndex,
          isFirstGroupCell,
          isLastGroupCell,
          index,
          key,
          text,
          colSpan,
        }) => (
          <DateHeaderCell
            startDate={startDate}
            endDate={endDate}
            groups={isHorizontalGrouping ? cellGroups : undefined}
            groupIndex={isHorizontalGrouping ? groupIndex : undefined}
            today={today}
            index={index}
            text={text}
            isFirstGroupCell={isFirstGroupCell}
            isLastGroupCell={isLastGroupCell}
            dateCellTemplate={dateCellTemplate}
            key={key}
            colSpan={colSpan}
          />
        ))}
      </Row>
    ))}
  </Fragment>
);

@ComponentBindings()
export class DateHeaderLayoutProps {
  // TODO: bug in angular
  @OneWay() groupOrientation: GroupOrientation = 'horizontal';

  @OneWay() groupByDate = false;

  @OneWay() dateHeaderMap: DateHeaderCellData[][] = [];

  @OneWay() groups: Group[] = [];

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;

  @Template() timeCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateHeaderLayout extends JSXComponent(DateHeaderLayoutProps) {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups, groupByDate } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation) && !groupByDate;
  }
}
