import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  OneWay,
  Template,
  Fragment,
} from 'devextreme-generator/component_declaration/common';
import { Row } from '../row';
import {
  DateTimeCellTemplateProps,
  ViewCellData,
} from '../../types.d';
import { isVerticalGroupOrientation } from '../../utils';
import { GroupOrientation } from '../../../types.d';
import { HeaderPanelCell } from './cell';

export const viewFunction = ({
  isVerticalGrouping,
  props: {
    dateHeaderMap,
    dateCellTemplate,
  },
}: DateHeader): JSX.Element => (
  <Fragment>
    <Row>
      {dateHeaderMap[0].map(({
        startDate, endDate, today, groups, groupIndex, index, key, text,
      }) => (
        <HeaderPanelCell
          startDate={startDate}
          endDate={endDate}
          groups={!isVerticalGrouping ? groups : undefined}
          groupIndex={!isVerticalGrouping ? groupIndex : undefined}
          today={today}
          index={index}
          text={text}
          dateCellTemplate={dateCellTemplate}
          key={key}
        />
      ))}
    </Row>
  </Fragment>
);

@ComponentBindings()
export class DateHeaderProps {
  @OneWay() className?: string = '';

  @OneWay() dateHeaderMap: ViewCellData[][] = [];

  @OneWay() groupOrientation?: GroupOrientation;

  @Template() dateCellTemplate?: JSXTemplate<DateTimeCellTemplateProps>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class DateHeader extends JSXComponent(DateHeaderProps) {
  get isVerticalGrouping(): boolean {
    const { groupOrientation } = this.props;

    return isVerticalGroupOrientation(groupOrientation);
  }
}
