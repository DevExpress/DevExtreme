/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { dxToolbarOptions } from '@js/ui/toolbar';
import dxToolbar from '@js/ui/toolbar';

import { InfernoWrapper } from './widget_wrapper';

export class Toolbar extends InfernoWrapper<dxToolbarOptions, dxToolbar> {
  protected getComponentFabric(): typeof dxToolbar {
    return dxToolbar;
  }

  protected updateComponentOptions(prevProps: dxToolbarOptions, props: dxToolbarOptions): void {
    if (
      Array.isArray(props.items)
      && Array.isArray(prevProps.items)
      && props.items.length === prevProps.items.length
    ) {
      props.items?.forEach((item, index) => {
        if (props.items![index] !== prevProps.items![index]) {
          this.component?.option(`items[${index}]`, props.items![index]);
        }
      });
      const propsToUpdate = { ...props };
      delete propsToUpdate.items;
      super.updateComponentOptions(prevProps, props);
    } else {
      super.updateComponentOptions(prevProps, props);
    }
  }
}
