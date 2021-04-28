import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { FormLayoutManagerProps } from './form_layout_manager_props';
import { isDefined } from '../../../core/utils/type';
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
    if (isDefined(this.props.optionalMark)) {
      return this.props.optionalMark;
    }

    return messageLocalization.format('dxForm-optionalMark');
  }

  get requiredMessage(): () => string {
    if (isDefined(this.props.requiredMessage)) {
      return this.props.requiredMessage;
    }

    return messageLocalization.getFormatter('dxForm-requiredMessage');
  }

  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({
      'dx-layout-manager': true,
    });
  }
}
