/* eslint-disable max-classes-per-file */

import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
/* eslint-disable import/named */
import LegacyToolbar from '../../../ui/toolbar';

import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { ToolbarProps } from './toolbar_props';
import { isDefined } from '../../../core/utils/type';

export const viewFunction = ({
  props,
  restAttributes,
}: Toolbar): JSX.Element => {
  const { rtlEnabled, items } = props;

  items?.forEach((item) => {
    if (typeof item !== 'string') {
      const toolbarItem = item;
      if (!isDefined(toolbarItem.options)) {
        toolbarItem.options = {};
      }
      toolbarItem.options.rtlEnabled = rtlEnabled ?? false;
    }
  });
  return (
    <DomComponentWrapper
      componentType={LegacyToolbar}
      componentProps={props}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...restAttributes}
    />
  );
};

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Toolbar extends JSXComponent<ToolbarProps>() {}
