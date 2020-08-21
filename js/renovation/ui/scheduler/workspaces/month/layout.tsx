import { Component, JSXComponent } from 'devextreme-generator/component_declaration/common';
import { LayoutBase } from '../base/layout';
import { HeaderPanelLayout, HeaderPanelLayoutProps } from '../base/header_panel/layout';
import { MonthHeaderPanelCell } from './header_panel/cell';
import { MonthDateTableLayout } from './date_table/layout';
import { LayoutProps } from '../base/layout_props';

const HeaderTemplate = ({ viewCellsData }: HeaderPanelLayoutProps): JSX.Element => (
  <HeaderPanelLayout
    cellTemplate={MonthHeaderPanelCell}
    viewCellsData={viewCellsData}
  />
);

export const viewFunction = (viewModel: MonthLayout): JSX.Element => (
  <LayoutBase
    viewData={viewModel.props.viewData}
    headerPanelTemplate={HeaderTemplate}
    dateTableTemplate={MonthDateTableLayout}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthLayout extends JSXComponent(LayoutProps) {}
