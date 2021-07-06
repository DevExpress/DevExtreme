/* eslint-disable max-classes-per-file */

import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
/* eslint-disable import/named */
import LegacyToolbar from '../../../ui/toolbar';

import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { ToolbarProps } from './toolbar_props';

export const viewFunction = ({
  props,
  restAttributes,
}: Toolbar): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyToolbar}
    componentProps={props}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Toolbar extends JSXComponent<ToolbarProps>() {}
