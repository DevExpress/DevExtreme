import { ComponentBindings, OneWay } from 'devextreme-generator/component_declaration/common';
import { GridInstance } from './types';

@ComponentBindings()
export class DataGridViewProps {
  @OneWay() instance!: GridInstance;
}
