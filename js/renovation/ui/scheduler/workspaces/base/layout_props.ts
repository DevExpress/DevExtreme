import {
  ComponentBindings,
  OneWay,
  Template,
  JSXTemplate,
} from 'devextreme-generator/component_declaration/common';
import { GroupedViewData, DataCellTemplateProps } from '../types.d';
import { GroupOrientation } from '../../types.d';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData: GroupedViewData = {
    groupedData: [],
    cellCountInGroupRow: 0,
  };

  @OneWay() groupOrientation?: GroupOrientation;

  @Template() dataCellTemplate?: JSXTemplate<DataCellTemplateProps>;
}
