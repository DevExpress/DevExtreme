import {
  Component, Consumer, JSXComponent,
} from '@devextreme-generator/declarations';
/* eslint-disable import/named */
import LegacyToolbar from '../../../ui/toolbar';

import { DomComponentWrapper } from '../common/dom_component_wrapper';
import { BaseToolbarItemProps, ToolbarProps } from './toolbar_props';
import { isObject } from '../../../core/utils/type';
import { ConfigContext, ConfigContextValue } from '../../common/config_context';
import { resolveRtlEnabled } from '../../utils/resolve_rtl';

export const viewFunction = ({ componentProps, restAttributes }: Toolbar): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyToolbar}
    componentProps={componentProps}
    templateNames={[]}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})

export class Toolbar extends JSXComponent<ToolbarProps>() {
  @Consumer(ConfigContext)
  config?: ConfigContextValue;

  get componentProps(): ToolbarProps {
    const { items } = this.props;
    const toolbarItems = items?.map((item) => {
      if (!isObject(item)) {
        return item;
      }

      const options = (item.options ?? {}) as BaseToolbarItemProps;
      options.rtlEnabled = options.rtlEnabled ?? this.resolvedRtlEnabled;
      return { ...item, options };
    });

    return { ...this.props, items: toolbarItems };
  }

  get resolvedRtlEnabled(): boolean {
    const { rtlEnabled } = this.props;
    return !!resolveRtlEnabled(rtlEnabled, this.config);
  }
}
