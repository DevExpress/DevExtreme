import {
  Component, ComponentBindings, ForwardRef, JSXComponent, OneWay, RefObject, Slot,
} from '@devextreme-generator/declarations';
import { Table } from '../../table';
import { AllDayPanelTableBody } from './table_body';
import { ViewCellData } from '../../../types.d';
import { LayoutProps } from '../../layout_props';
import { DefaultSizes } from '../../../const';

export const viewFunction = ({
  emptyTableHeight,
  allDayPanelData,
  props: {
    tableRef,
    viewData,
    dataCellTemplate,
    allDayAppointments,
    width,
  },
}: AllDayPanelLayout): JSX.Element => (
  <div
    className="dx-scheduler-all-day-panel"
  >
    {allDayAppointments}
    <Table
      className="dx-scheduler-all-day-table"
      height={emptyTableHeight}
      width={width}
      tableRef={tableRef}
    >
      <AllDayPanelTableBody
        viewData={allDayPanelData}
        leftVirtualCellWidth={viewData.leftVirtualCellWidth}
        rightVirtualCellWidth={viewData.rightVirtualCellWidth}
        leftVirtualCellCount={viewData.leftVirtualCellCount}
        rightVirtualCellCount={viewData.rightVirtualCellCount}
        dataCellTemplate={dataCellTemplate}
      />
    </Table>
  </div>
);

@ComponentBindings()
export class AllDayPanelLayoutProps extends LayoutProps {
  @OneWay() className = '';

  @ForwardRef() tableRef?: RefObject<HTMLTableElement>;

  @Slot() allDayAppointments?: JSX.Element;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class AllDayPanelLayout extends JSXComponent(AllDayPanelLayoutProps) {
  get allDayPanelData(): ViewCellData[] | undefined {
    return this.props.viewData.groupedData[0].allDayPanel;
  }

  get emptyTableHeight(): number | undefined {
    return this.allDayPanelData
      ? undefined
      : DefaultSizes.allDayPanelHeight;
  }
}
