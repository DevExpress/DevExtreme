import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { combineClasses } from '../../../../../../utils/combine_classes';
import { Table } from '../../table';
import { AllDayPanelTableBody as TableBody } from './table_body';
import { addHeightToStyle } from '../../../utils';
import { ViewCellData } from '../../../types.d';
import { LayoutProps } from '../../layout_props';

export const viewFunction = (viewModel: AllDayPanelLayout) => (
  <div
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
    className={viewModel.classes}
    style={viewModel.style}
  >
    { viewModel.props.visible && (
      <Table className="dx-scheduler-all-day-table">
        <TableBody viewData={viewModel.allDayPanelData} />
      </Table>
    )}
  </div>
);

@ComponentBindings()
export class AllDayPanelLayoutProps extends LayoutProps {
  @OneWay() className? = '';

  @OneWay() height? = 25;

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
    return this.props.viewData!.groupedData[0].allDayPanel;
  }

  get style(): { [key: string]: string | number | undefined } {
    const { height } = this.props;
    const { style } = this.restAttributes;

    return addHeightToStyle(height, style);
  }

  get classes(): string {
    return combineClasses({
      'dx-scheduler-all-day-panel': true,
      'dx-hidden': !this.props.visible,
      [this.props.className!]: !!this.props.className,
    });
  }
}
