import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { BoxProps } from './box_props';
import { combineClasses } from '../../utils/combine_classes';

export const viewFunction = (viewModel: Box): JSX.Element => (
  <Widget classes={viewModel.cssClasses} />
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Box extends JSXComponent<BoxProps>() {
  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({ 'dx-box dx-box-flex': true });
  }
}
