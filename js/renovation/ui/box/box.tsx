import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { BoxProps } from './box_props';
import { combineClasses } from '../../utils/combine_classes';

export const viewFunction = (): JSX.Element => {
  const cssClasses = combineClasses({ 'dx-box dx-box-flex': true });
  return (
    <Widget classes={cssClasses} />
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Box extends JSXComponent<BoxProps>() {
}
