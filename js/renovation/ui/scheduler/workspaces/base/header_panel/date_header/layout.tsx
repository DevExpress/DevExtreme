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
import { HORIZONTAL_GROUP_ORIENTATION } from '../../../../consts';

export const viewFunction = ({
  isHorizontalGrouping,
  props: {
    dateHeaderMap,
    dateCellTemplate,
  },
}: DateHeader): JSX.Element => (
  <Fragment>
    <Row className="dx-scheduler-header-row">
      {dateHeaderMap[0].map(({
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
  </Fragment>
);

@ComponentBindings()
export class DateHeaderProps {
  @OneWay() groupOrientation: GroupOrientation = HORIZONTAL_GROUP_ORIENTATION;

  @OneWay() dateHeaderMap: DateHeaderCellData[][] = [];

  @OneWay() groups: Group[] = [];

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class DateHeader extends JSXComponent(DateHeaderProps) {
  get isHorizontalGrouping(): boolean {
    const { groupOrientation, groups } = this.props;

    return isHorizontalGroupOrientation(groups, groupOrientation);
  }
}
