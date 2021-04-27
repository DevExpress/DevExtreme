import {
  Component, JSXComponent, Ref, RefObject,
} from '@devextreme-generator/declarations';

import React from 'react';
import { FormProps } from './form_props';

import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { FormLayoutManager } from './form_layout_manager';
import { Scrollable } from '../scroll_view/scrollable';

export const viewFunction = (viewModel: Form): JSX.Element => {
  const aria = { role: 'form' };
  const cssClasses = combineClasses({ 'dx-form': true });
  const {
    rootLayoutManagerRef,
    props: {
      scrollingEnabled,
      useNativeScrolling,
      colCount,
      alignItemLabels,
      screenByWidth,
      colCountByScreen,
    },
    restAttributes,
  } = viewModel;

  const content = (
    <FormLayoutManager
      ref={rootLayoutManagerRef}
      isRoot
      colCount={colCount}
      alignItemLabels={alignItemLabels}
      screenByWidth={screenByWidth}
      colCountByScreen={colCountByScreen}
    />
  );

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
      >
        {content}
      </Scrollable>
    )
    : (
      <Widget
        aria={aria}
        classes={cssClasses}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...restAttributes}
      >
        {content}
      </Widget>
    )
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Form extends JSXComponent<FormProps>() {
  @Ref() rootLayoutManagerRef!: RefObject; // TODO: any -> FormLayoutManager (Generators)
}
