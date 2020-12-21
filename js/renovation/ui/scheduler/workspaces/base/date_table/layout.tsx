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
  isVirtual,
  topVirtualRowHeight,
  bottomVirtualRowHeight,
  virtualCellsCount,
  classes,
  restAttributes,
}: DateTableLayoutBase): JSX.Element => (
  <Table
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
    isVirtual={isVirtual}
    topVirtualRowHeight={topVirtualRowHeight}
    bottomVirtualRowHeight={bottomVirtualRowHeight}
    virtualCellsCount={virtualCellsCount}
    className={classes}
  >
    <DateTableBody
      cellTemplate={cellTemplate}
      viewData={viewData}
      dataCellTemplate={dataCellTemplate}
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
  get classes(): string {
    return `dx-scheduler-date-table ${this.props.className}`;
  }

  get isVirtual(): boolean {
    const { viewData } = this.props;
    return !!viewData.isVirtual;
  }

  get topVirtualRowHeight(): number {
    return this.props.viewData.topVirtualRowHeight || 0;
  }

  get bottomVirtualRowHeight(): number {
    return this.props.viewData.bottomVirtualRowHeight || 0;
  }

  get virtualCellsCount(): number {
    return this.props.viewData.groupedData[0].dateTable[0].length;
  }
}
