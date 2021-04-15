import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';
import { GridInstance } from './types';

@ComponentBindings()
export class DataGridViewProps {
  @OneWay() instance!: GridInstance;

  @OneWay() showBorders!: boolean;
}
