/* eslint-disable @typescript-eslint/no-non-null-assertion */
import '@js/ui/button';
import '@js/ui/check_box';

import type { Properties as ToolbarProps } from '@js/ui/toolbar';
import dxToolbar from '@js/ui/toolbar';

import { InfernoWrapper } from './widget_wrapper';

const excludedStateOptions = ['onInput', 'inputAttr', 'elementAttr'];

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
              if (key !== 'options') {
                this.component?.option(`items[${index}].${key}`, props.items![index][key]);
              } else {
                const prevOptions = prevItem[key];
                const currentOptions = item[key];
                Object.keys(currentOptions).forEach((option) => {
                  const isOptionChanged = !prevOptions?.[option]
                    || currentOptions?.[option] !== prevOptions[option];
                  const isExcludedOption = excludedStateOptions.includes(option);
                  if (isOptionChanged && !isExcludedOption) {
                    this.component?.option(`items[${index}].${key}.${option}`, props.items![index][key][option]);
                  }
                });
              }
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
