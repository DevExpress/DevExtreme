import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { FormLayoutManagerProps } from './form_layout_manager_props';
import messageLocalization from '../../../localization/message';

export const viewFunction = (viewModel: FormLayoutManager): JSX.Element => {
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

export class FormLayoutManager extends JSXComponent<FormLayoutManagerProps>() {
  get optionalMark(): string | undefined {
    return this.props.optionalMark
    || messageLocalization.format('dxForm-optionalMark');
  }

  get requiredMessage(): () => string {
    return this.props.requiredMessage
    || messageLocalization.getFormatter('dxForm-requiredMessage');
  }

  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({
      'dx-layout-manager': true,
    });
  }
}
