import {
  Component, ComponentBindings, JSXComponent, Template, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { GroupedViewData } from '../types';

export const viewFunction = (viewModel: LayoutBase) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <div {...viewModel.restAttributes}>
    <viewModel.props.headerPanelTemplate
      viewCellsData={viewModel.props.viewCellsData!.groupedData[0].dateTable}
    />
    <viewModel.props.dateTableTemplate viewCellsData={viewModel.props.viewCellsData} />
  </div>
);

@ComponentBindings()
export class LayoutBaseProps {
  @OneWay() viewCellsData?: GroupedViewData;

  @Template() headerPanelTemplate?: any;

  @Template() dateTableTemplate?: any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class LayoutBase extends JSXComponent(LayoutBaseProps) {}
