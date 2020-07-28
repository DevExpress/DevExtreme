import {
  ComponentBindings, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { GroupedViewData } from '../types.d';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData?: GroupedViewData;
}
