import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class RequiredRule {
  @OneWay() message?: string;

  @OneWay() trim?: boolean;

  @OneWay() type?: 'required';
}
