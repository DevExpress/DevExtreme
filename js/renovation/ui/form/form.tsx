import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';

import { FormProps } from './form_props';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { Scrollable } from '../scroll_view/scrollable';
import { isDefined } from '../../../core/utils/type';
import messageLocalization from '../../../localization/message';

export const viewFunction = (viewModel: Form): JSX.Element => {
  const aria = { role: 'form' };
  const cssClasses = combineClasses({ 'dx-form': true });

  const {
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
}
