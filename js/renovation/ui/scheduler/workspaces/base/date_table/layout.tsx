import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';
import { Table } from '../table';
import { DateTableBody } from './table_body';
import { DateTableLayoutProps } from './layout_props';

export const viewFunction = ({
  props: {
    viewData,
    groupOrientation,
    cellTemplate,
    dataCellTemplate,
  },
  topVirtualRowHeight,
  bottomVirtualRowHeight,
  leftVirtualCellWidth,
  rightVirtualCellWidth,
  virtualCellsCount,
  classes,
  restAttributes,
}: DateTableLayoutBase): JSX.Element => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    topVirtualRowHeight={topVirtualRowHeight}
    bottomVirtualRowHeight={bottomVirtualRowHeight}
    leftVirtualCellWidth={leftVirtualCellWidth}
    rightVirtualCellWidth={rightVirtualCellWidth}
    leftVirtualCellCount={viewData.leftVirtualCellCount}
    rightVirtualCellCount={viewData.rightVirtualCellCount}
    virtualCellsCount={virtualCellsCount}
    className={classes}
  >
    <DateTableBody
      cellTemplate={cellTemplate}
      viewData={viewData}
      dataCellTemplate={dataCellTemplate}
      leftVirtualCellWidth={leftVirtualCellWidth}
      rightVirtualCellWidth={rightVirtualCellWidth}
      groupOrientation={groupOrientation}
    />
  </Table>
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: { register: true },
})
export class DateTableLayoutBase extends JSXComponent(DateTableLayoutProps) {
  get classes(): string | undefined {
    const { addDateTableClass } = this.props;

    return addDateTableClass ? 'dx-scheduler-date-table' : undefined;
  }

  get topVirtualRowHeight(): number {
    return this.props.viewData.topVirtualRowHeight ?? 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.viewData.bottomVirtualRowHeight ?? 0;
  }

  get leftVirtualCellWidth(): number {
    return this.props.viewData.leftVirtualCellWidth ?? 0;
  }

  get rightVirtualCellWidth(): number {
    return this.props.viewData.rightVirtualCellWidth ?? 0;
  }

  get virtualCellsCount(): number {
    return this.props.viewData.groupedData[0].dateTable[0].length;
  }
}
