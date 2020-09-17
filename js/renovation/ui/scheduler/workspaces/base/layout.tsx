import {
  Component, ComponentBindings, JSXComponent, Template,
} from 'devextreme-generator/component_declaration/common';
import { LayoutProps } from './layout_props';

export const viewFunction = (viewModel: LayoutBase): JSX.Element => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...viewModel.restAttributes}>
    <viewModel.props.headerPanelTemplate
      viewCellsData={viewModel.props.viewData!.groupedData[0].dateTable}
    />
    <viewModel.props.dateTableTemplate viewData={viewModel.props.viewData} />
  </div>
);

@ComponentBindings()
export class LayoutBaseProps extends LayoutProps {
  @Template() headerPanelTemplate?: any;

  @Template() dateTableTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class LayoutBase extends JSXComponent(LayoutBaseProps) {}
