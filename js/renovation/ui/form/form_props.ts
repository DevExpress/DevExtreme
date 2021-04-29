import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';

@ComponentBindings()
export class FormProps {
  @OneWay() scrollingEnabled = false;

  @OneWay() useNativeScrolling?: boolean;
}
