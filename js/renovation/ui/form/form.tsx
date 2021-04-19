import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { FormProps } from './form_props';

export const viewFunction = (): JSX.Element => <div />;

@Component({
  jQuery: { register: true },
  view: viewFunction,
})

export class Form extends JSXComponent<FormProps>() {

}
