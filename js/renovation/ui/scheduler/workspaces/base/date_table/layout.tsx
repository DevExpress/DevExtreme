import {
  Component,
  ComponentBindings,
  ForwardRef,
  JSXComponent,
  JSXTemplate,
  RefObject,
  Template,
} from '@devextreme-generator/declarations';
import { Table } from '../table';
import { CellTemplateProps, DateTableBody } from './table_body';
import { LayoutProps } from '../layout_props';
import { DateTableCellBase } from './cell';
import { DateTable } from '../../../../../component_wrapper/scheduler/date_table';

export const viewFunction = ({
  props: {
    viewData,
    groupOrientation,
    cellTemplate,
    dataCellTemplate,
    tableRef,
    addVerticalSizesClassToRows,
    width,
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
    tableRef={tableRef}
    topVirtualRowHeight={topVirtualRowHeight}
    bottomVirtualRowHeight={bottomVirtualRowHeight}
    leftVirtualCellWidth={leftVirtualCellWidth}
    rightVirtualCellWidth={rightVirtualCellWidth}
    leftVirtualCellCount={viewData.leftVirtualCellCount}
    rightVirtualCellCount={viewData.rightVirtualCellCount}
    virtualCellsCount={virtualCellsCount}
    className={classes}
    width={width}
  >
    <DateTableBody
      cellTemplate={cellTemplate}
      viewData={viewData}
      dataCellTemplate={dataCellTemplate}
      leftVirtualCellWidth={leftVirtualCellWidth}
      rightVirtualCellWidth={rightVirtualCellWidth}
      groupOrientation={groupOrientation}
      addVerticalSizesClassToRows={addVerticalSizesClassToRows}
    />
  </Table>
);

@ComponentBindings()
export class DateTableLayoutProps extends LayoutProps {
  @Template() cellTemplate: JSXTemplate<CellTemplateProps> = DateTableCellBase;

  @ForwardRef() tableRef?: RefObject<HTMLTableElement>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
    component: DateTable,
  },
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
    return this.props.viewData.groupedData[0].dateTable[0].cells.length;
  }
}
