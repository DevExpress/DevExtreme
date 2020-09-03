import {
  ComponentBindings, OneWay,
} from 'devextreme-generator/component_declaration/common';
import { GroupedViewData } from '../types';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData?: GroupedViewData;
}
