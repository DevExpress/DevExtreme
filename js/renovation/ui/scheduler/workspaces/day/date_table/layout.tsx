import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
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

@ComponentBindings()
export class DayDateTableLayoutProps extends LayoutProps{
  @OneWay() isVirtual?: boolean;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DayDateTableLayout extends JSXComponent(DayDateTableLayoutProps) {
}
