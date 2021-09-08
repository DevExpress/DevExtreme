// We do not use this component yet so it is safe to remove several parts temporarily
// We have to do this because of a bug in Vue generator
import { Component, JSXComponent } from '@devextreme-generator/declarations';
import { LayoutBase } from '../base/layout';
import { LayoutProps } from '../base/layout_props';

// const HeaderTemplate = ({ viewCellsData }: HeaderPanelLayoutProps): JSX.Element => (
//   <HeaderPanelLayout
//     cellTemplate={MonthHeaderPanelCell}
//     viewCellsData={viewCellsData}
//   />
// );

export const viewFunction = (viewModel: MonthLayout): JSX.Element => (
  <LayoutBase
    viewData={viewModel.props.viewData}
    // headerPanelTemplate={HeaderTemplate}
    // dateTableTemplate={MonthDateTableLayout}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MonthLayout extends JSXComponent(LayoutProps) {}
