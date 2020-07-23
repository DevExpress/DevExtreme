import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { DayDateTableCell } from './cell';
import { LayoutProps } from '../../base/layout_props';

export const viewFunction = (viewModel: DayDateTableLayout): object => (
  <DateTableLayoutBase
    viewData={viewModel.props.viewData}
    isVirtual={viewModel.props.isVirtual}
    cellTemplate={DayDateTableCell}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export class DayDateTableLayout extends JSXComponent(LayoutProps) {
  get isVirtual(): boolean {
    const { viewData } = this.props;
    return viewData ? !!viewData.isVirtual : false;
  }
}
