import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
import { Widget } from '../common/widget';
import { ResponsiveBoxProps } from './responsive_box_props';
import { combineClasses } from '../../utils/combine_classes';
import { Box } from '../box/box';

export const viewFunction = (): JSX.Element => {
  const cssClasses = combineClasses({ 'dx-responsivebox': true });
  return (
    <Widget classes={cssClasses}>
      <Box />
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class ResponsiveBox extends JSXComponent<ResponsiveBoxProps>() {
}
