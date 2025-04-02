/* eslint-disable @typescript-eslint/no-non-null-assertion */
import '@js/ui/button';
import '@js/ui/check_box';

import type { Properties as ToolbarProps } from '@js/ui/toolbar';
import dxToolbar from '@js/ui/toolbar';

import { InfernoWrapper } from './widget_wrapper';

export class Toolbar extends InfernoWrapper<ToolbarProps, dxToolbar> {
  protected getComponentFabric(): typeof dxToolbar {
    return dxToolbar;
  }

  protected updateComponentOptions(prevProps: ToolbarProps, props: ToolbarProps): void {
    if (
      Array.isArray(props.items)
      && Array.isArray(prevProps.items)
      && props.items.length === prevProps.items.length
    ) {
      props.items?.forEach((item, index) => {
        if (props.items![index] !== prevProps.items![index]) {
          const prevItem = prevProps.items![index];

          Object.keys(item).forEach((key) => {
            if (item[key] !== prevItem[key]) {
              this.component?.option(`items[${index}].${key}`, props.items![index][key]);
            }
          });
        }
      });

      const { items, ...propsToUpdate } = props;

      super.updateComponentOptions(prevProps, propsToUpdate);
    } else {
      super.updateComponentOptions(prevProps, props);
    }
  }
}
