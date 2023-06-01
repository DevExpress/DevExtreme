import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';

@ComponentBindings()
export class TextBoxProps {
  @OneWay() maxLength?: string | number;

  @OneWay() mode?: 'email' | 'password' | 'search' | 'tel' | 'text' | 'url';

  @OneWay() value?: string;
}
