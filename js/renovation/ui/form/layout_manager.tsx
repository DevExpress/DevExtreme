import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { FormLayoutManagerProps } from './layout_manager_props';

export const viewFunction = (viewModel: LayoutManager): JSX.Element => {
  const { cssClasses, restAttributes } = viewModel;
  return (
    <Widget
      classes={cssClasses}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    />
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})

export class LayoutManager extends JSXComponent<FormLayoutManagerProps>() {
  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({
      'dx-layout-manager': true,
    });
  }
}
