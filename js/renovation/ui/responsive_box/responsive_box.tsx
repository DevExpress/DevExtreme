import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { ResponsiveBoxProps } from './responsive_box_props';

export const viewFunction = (): JSX.Element => (<Widget />);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class ResponsiveBox extends JSXComponent<ResponsiveBoxProps>() {
}
