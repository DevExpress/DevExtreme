import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class LabelProps {
  @OneWay() alignment?: 'center' | 'left' | 'right';

  @OneWay() location?: 'left' | 'right' | 'top';

  @OneWay() showColon?: boolean;

  @OneWay() text?: string;

  @OneWay() visible?: boolean;
}
