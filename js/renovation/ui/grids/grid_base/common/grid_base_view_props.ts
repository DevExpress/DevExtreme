import { ComponentBindings, OneWay } from 'devextreme-generator/component_declaration/common';
import { GridBaseView } from './types';

@ComponentBindings()
export class GridBaseViewProps {
  @OneWay() views!: { name: string; view: GridBaseView }[];

  @OneWay() className!: string;
}
