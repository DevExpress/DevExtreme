import { ComponentBindings, OneWay } from '@devextreme-generator/declarations';

@ComponentBindings()
export class FormProps {
  @OneWay() scrollingEnabled = false;

  // TODO: seems is not used
  @OneWay() useNativeScrolling? = undefined;
}
