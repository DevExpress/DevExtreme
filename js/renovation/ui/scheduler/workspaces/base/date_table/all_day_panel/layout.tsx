import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from '@devextreme-generator/declarations';
import { combineClasses } from '../../../../../../utils/combine_classes';
import { Table } from '../../table';
import { AllDayPanelTableBody } from './table_body';
import { ViewCellData } from '../../../types.d';
import { LayoutProps } from '../../layout_props';
import { DefaultSizes } from '../../../const';

export const viewFunction = (viewModel: AllDayPanelLayout): JSX.Element => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
  >
    {viewModel.props.visible && (
      <Table
        className="dx-scheduler-all-day-table"
        height={viewModel.emptyTableHeight}
      >
        <AllDayPanelTableBody
          viewData={viewModel.allDayPanelData}
          leftVirtualCellWidth={viewModel.props.viewData.leftVirtualCellWidth}
          rightVirtualCellWidth={viewModel.props.viewData.rightVirtualCellWidth}
          leftVirtualCellCount={viewModel.props.viewData.leftVirtualCellCount}
          rightVirtualCellCount={viewModel.props.viewData.rightVirtualCellCount}
          dataCellTemplate={viewModel.props.dataCellTemplate}
        />
      </Table>
    )}
  </div>
);

@ComponentBindings()
export class AllDayPanelLayoutProps extends LayoutProps {
  @OneWay() className = '';

  @OneWay() visible? = true;
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

  get classes(): string {
    return combineClasses({
      'dx-scheduler-all-day-panel': true,
      'dx-hidden': !this.props.visible,
      [this.props.className]: !!this.props.className,
    });
  }
}
