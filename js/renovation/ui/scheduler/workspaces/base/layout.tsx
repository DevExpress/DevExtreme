import {
  Component,
  ComponentBindings,
  JSXComponent,
  JSXTemplate,
  Template,
} from '@devextreme-generator/declarations';
import { GroupedViewData, ViewCellData } from '../types.d';
import { LayoutProps } from './layout_props';

export const viewFunction = (viewModel: LayoutBase): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...viewModel.restAttributes}>
    <viewModel.props.headerPanelTemplate
      viewCellsData={viewModel.props.viewData.groupedData[0].dateTable}
    />
    <viewModel.props.dateTableTemplate viewData={viewModel.props.viewData} />
  </div>
);

@ComponentBindings()
export class LayoutBaseProps extends LayoutProps {
  @Template() headerPanelTemplate!: JSXTemplate<{
    viewCellsData: ViewCellData[][];
  }>;

  @Template() dateTableTemplate!: JSXTemplate<{
    viewData: GroupedViewData;
  }>;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class LayoutBase extends JSXComponent<
LayoutBaseProps, 'headerPanelTemplate' | 'dateTableTemplate'
>() {}
