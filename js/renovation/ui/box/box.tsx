import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { BoxProps } from './box_props';

export const viewFunction = (): JSX.Element => (<Widget />);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Box extends JSXComponent<BoxProps>() {
}
