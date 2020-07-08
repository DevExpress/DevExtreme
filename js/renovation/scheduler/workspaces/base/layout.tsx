import {
  Component, ComponentBindings, JSXComponent, Template, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { ViewCellData } from '../types';

export const viewFunction = (viewModel: LayoutBase) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...viewModel.restAttributes}>
    <viewModel.props.headerPanelTemplate viewCellsData={viewModel.props.viewCellsData} />
    <viewModel.props.dateTableTemplate viewCellsData={viewModel.props.viewCellsData} />
  </div>
);

@ComponentBindings()
export class LayoutBaseProps {
  @OneWay() viewCellsData?: ViewCellData[][];

  @Template() headerPanelTemplate?: any;

  @Template() dateTableTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class LayoutBase extends JSXComponent(LayoutBaseProps) {}
