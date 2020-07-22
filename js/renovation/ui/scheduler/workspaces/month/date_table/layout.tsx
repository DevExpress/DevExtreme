import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { DateTableLayoutBase } from '../../base/date_table/layout';
import { MonthDateTableCell } from './cell';
import { LayoutProps } from '../../base/layout_props';

export const viewFunction = (viewModel: MonthDateTableLayout): object => (
  <DateTableLayoutBase
    viewData={viewModel.props.viewData}
    isVirtual={viewModel.props.isVirtual}
    cellTemplate={MonthDateTableCell}
  />
);

@ComponentBindings()
export class MonthDateTableLayoutProps extends LayoutProps {
  @OneWay() isVirtual?: boolean;

  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthDateTableLayout extends JSXComponent(MonthDateTableLayoutProps) {}
