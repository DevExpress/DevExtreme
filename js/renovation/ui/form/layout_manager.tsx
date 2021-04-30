import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { ResponsiveBox } from '../responsive_box/responsive_box';
import { LayoutManagerProps } from './layout_manager_props';

export const viewFunction = (viewModel: LayoutManager): JSX.Element => {
  const { cssClasses, restAttributes } = viewModel;
  return (
    <Widget
      classes={cssClasses}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    >
      <ResponsiveBox />
    </Widget>
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})

export class LayoutManager extends JSXComponent<LayoutManagerProps>() {
  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({
      'dx-layout-manager': true,
    });
  }
}
