import {
  Component, ComponentBindings, JSXComponent, OneWay, Fragment,
} from 'devextreme-generator/component_declaration/common';
import { Table } from '../../table';
import { AllDayPanelTableBody as TableBody } from './table_body';
import { addHeightToStyle } from '../../../utils';
import { ViewCellData } from '../../../types.d';
import { AllDayPanelTitle as Title } from './title';
import { LayoutProps } from '../../layout_props';

export const viewFunction = (viewModel: AllDayPanelLayout) => (
  <Fragment>
    {viewModel.props.visible && (
    <div
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...viewModel.restAttributes}
      className={`dx-scheduler-all-day-panel ${viewModel.props.className}`}
      style={viewModel.style}
    >
      <Title />
      <div>
        <Table className="dx-scheduler-all-day-table">
          <TableBody viewData={viewModel.allDayPanelData} />
        </Table>
      </div>
    </div>
    )}
  </Fragment>
);

@ComponentBindings()
export class AllDayPanelLayoutProps extends LayoutProps {
  @OneWay() className?: string = '';

  @OneWay() height?: number = 25;

  @OneWay() visible?: boolean;
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
    return this.props.viewData!.groupedData[0].allDayPanel;
  }

  get style(): { [key: string]: string | number | undefined } {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }
}
