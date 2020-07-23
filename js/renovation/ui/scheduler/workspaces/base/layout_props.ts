import {
  ComponentBindings, OneWay,
} from 'devextreme-generator/component_declaration/common';
// eslint-disable-next-line import/extensions
import { GroupedViewData } from '../types';

@ComponentBindings()
export class LayoutProps {
  @OneWay() viewData?: GroupedViewData;
}
