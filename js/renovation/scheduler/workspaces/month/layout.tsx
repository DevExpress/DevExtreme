import {
  Component, ComponentBindings, JSXComponent, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { LayoutBase } from '../base/layout';
import { HeaderPanelLayout, HeaderPanelLayoutProps } from '../base/header_panel/layout';
import { MonthHeaderPanelCell } from './header_panel/cell';
import { MonthDateTableLayout } from './date_table/layout';
import { GroupedViewData } from '../types';

const HeaderTemplate = ({ viewCellsData }: HeaderPanelLayoutProps) => (
  <HeaderPanelLayout
    cellTemplate={MonthHeaderPanelCell}
    viewCellsData={viewCellsData}
  />
);

export const viewFunction = (viewModel: MonthLayout) => (
  <LayoutBase
    viewCellsData={viewModel.props.viewCellsData}
    headerPanelTemplate={HeaderTemplate}
    dateTableTemplate={MonthDateTableLayout}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@ComponentBindings()
export class MonthLayoutProps {
  @OneWay() viewCellsData?: GroupedViewData;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthLayout extends JSXComponent(MonthLayoutProps) {}
