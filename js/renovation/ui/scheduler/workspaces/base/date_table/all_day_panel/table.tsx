import {
  Component, ComponentBindings, ForwardRef, JSXComponent, RefObject,
} from '@devextreme-generator/declarations';
import { Table } from '../../table';
import { AllDayPanelTableBody } from './table_body';
import { ViewCellData } from '../../../types';
import { LayoutProps } from '../../layout_props';
import { DefaultSizes } from '../../../const';
import { DateTable } from '../../../../../../component_wrapper/scheduler/date_table';

export const viewFunction = ({
  emptyTableHeight,
  allDayPanelData,
  props: {
    tableRef,
    viewData,
    dataCellTemplate,
    width,
  },
}: AllDayTable): JSX.Element => (
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
);

@ComponentBindings()
export class AllDayTableProps extends LayoutProps {
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
export class AllDayTable extends JSXComponent(AllDayTableProps) {
  get allDayPanelData(): ViewCellData[] | undefined {
    return this.props.viewData.groupedData[0].allDayPanel;
  }

  get emptyTableHeight(): number | undefined {
    return this.allDayPanelData
      ? undefined
      : DefaultSizes.allDayPanelHeight;
  }
}
