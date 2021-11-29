import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';

import { FormProps } from './form_props';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { LayoutManager } from './layout_manager';
import { Scrollable } from '../scroll_view/scrollable';

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

  const rootLayoutManager = (
    <LayoutManager
      screenByWidth={viewModel.props.screenByWidth}
    />
  );
  return scrollingEnabled
    ? (
      <Scrollable
        aria={aria}
        classes={cssClasses}
        useNative={!!useNativeScrolling}
        useSimulatedScrollbar={!useNativeScrolling}
        useKeyboard={false}
        direction="both"
        bounceEnabled={false}
      >
        {rootLayoutManager}
      </Scrollable>
    )
    : (
      <Widget
        aria={aria}
        classes={cssClasses}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
      >
        {rootLayoutManager}
      </Widget>
    );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Form extends JSXComponent<FormProps>() {
}
