import {
  Component, Consumer, JSXComponent,
} from '@devextreme-generator/declarations';
/* eslint-disable import/named */
import LegacyToolbar from '../../../ui/toolbar';

import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { ToolbarProps } from './toolbar_props';
import { isDefined, isObject } from '../../../core/utils/type';
import { ConfigContext, ConfigContextValue } from '../../common/config_context';
import { resolveRtlEnabled } from '../../utils/resolve_rtl';

export const viewFunction = ({ props, rtl, restAttributes }: Toolbar): JSX.Element => {
  const { items } = props;
  if (isDefined(items)) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index];
      if (isObject(item)) {
        item.options = item.options ?? {};
        item.options.rtlEnabled = item.options.rtlEnabled ?? rtl;
      }
    }
  }

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

export class Toolbar extends JSXComponent<ToolbarProps>() {
  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  get rtl(): boolean {
    const { rtlEnabled } = this.props;
    return !!resolveRtlEnabled(rtlEnabled, this.config);
  }
}
