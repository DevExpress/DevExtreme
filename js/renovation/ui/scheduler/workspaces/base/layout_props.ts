import {
  ComponentBindings, OneWay, Template,
} from 'devextreme-generator/component_declaration/common';
import { GroupedViewData } from '../types.d';
import { GroupOrientation } from '../../types.d';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData?: GroupedViewData;

  @OneWay() groupOrientation?: GroupOrientation;

  @Template() dataCellTemplate?: any;
}
