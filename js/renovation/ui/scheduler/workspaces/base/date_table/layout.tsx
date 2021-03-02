import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from 'devextreme-generator/component_declaration/common';
import { Table } from '../table';
import { DateTableBody } from './table_body';
import { DateTableLayoutProps } from './layout_props';

export const viewFunction = ({
  props: {
    cellTemplate,
    viewData,
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
    virtualCellsCount={virtualCellsCount}
    className={classes}
  >
    <DateTableBody
      cellTemplate={cellTemplate}
      viewData={viewData}
      dataCellTemplate={dataCellTemplate}
      leftVirtualCellWidth={leftVirtualCellWidth}
      rightVirtualCellWidth={rightVirtualCellWidth}
    />
  </Table>
);
@ComponentBindings()
export class DateTableLayoutBaseProps extends DateTableLayoutProps {
  @OneWay() className?: string;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DateTableLayoutBase extends JSXComponent<DateTableLayoutBaseProps, 'cellTemplate'>() {
  get classes(): string | undefined {
    const { addDateTableClass } = this.props;

    return addDateTableClass ? 'dx-scheduler-date-table' : undefined;
  }

  get topVirtualRowHeight(): number {
    return this.props.viewData.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.viewData.bottomVirtualRowHeight || 0;
  }

  get leftVirtualCellWidth(): number {
    return this.props.viewData.leftVirtualCellWidth || 0;
  }

  get rightVirtualCellWidth(): number {
    return this.props.viewData.rightVirtualCellWidth || 0;
  }

  get virtualCellsCount(): number {
    return this.props.viewData.groupedData[0].dateTable[0].length;
  }
}
