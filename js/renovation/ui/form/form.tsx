import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { FormProps } from './form_props';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { Scrollable } from '../scroll_view/scrollable';

export const viewFunction = (viewModel: Form): JSX.Element => {
  const {
    aria,
    cssClasses,
    props: {
      scrollingEnabled,
      useNativeScrolling,
    },
    restAttributes,
  } = viewModel;
  return (scrollingEnabled
    ? (
      <Scrollable
        aria={aria}
        classes={cssClasses}
        useNative={!!useNativeScrolling}
        useSimulatedScrollbar={!useNativeScrolling}
        useKeyboard={false}
        direction="both"
        bounceEnabled={false}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
      />
    )
    : (
      <Widget
        aria={aria}
        classes={cssClasses}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
      />
    )
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
