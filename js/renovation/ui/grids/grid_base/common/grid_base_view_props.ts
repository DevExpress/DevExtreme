import { ComponentBindings, OneWay, Event } from '@devextreme-generator/declarations';
import { GridBaseView } from './types';

@ComponentBindings()
export class GridBaseViewProps {
  @OneWay() views!: { name: string; view: GridBaseView }[];

  @OneWay() className!: string;

  @OneWay() role!: string;

  @Event() onRendered?: () => void;
}
