import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { FormProps } from './form_props';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';

export const viewFunction = (viewModel: Form): JSX.Element => {
  const { aria, cssClasses, restAttributes } = viewModel;
  return (
    <Widget
      aria={aria}
      classes={cssClasses}
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    />
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Form extends JSXComponent<FormProps>() {
  // eslint-disable-next-line class-methods-use-this
  get aria(): Record<string, string> {
    return {
      role: 'form',
    };
  }

  // eslint-disable-next-line class-methods-use-this
  get cssClasses(): string {
    return combineClasses({
      'dx-form': true,
    });
  }
}
