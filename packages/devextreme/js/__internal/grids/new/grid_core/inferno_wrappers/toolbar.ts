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
    const { items: currentItems } = props;
    const { items: prevItems } = prevProps;

    if (
      Array.isArray(currentItems)
      && Array.isArray(prevItems)
      && currentItems.length === prevItems.length
    ) {
      currentItems.forEach((item, index) => {
        if (item !== prevItems[index]) {
          const prevItem = prevItems[index];

          Object.keys(item).forEach((key) => {
            if (item[key] !== prevItem[key]) {
              if (key !== 'options') {
                this.component?.option(`items[${index}].${key}`, item[key]);
              } else {
                const prevOptions = prevItem[key];
                const currentOptions = item[key];
                Object.keys(currentOptions).forEach((option) => {
                  const isOptionChanged = !prevOptions?.[option]
                    || currentOptions?.[option] !== prevOptions[option];
                  const isExcludedOption = excludedStateOptions.includes(option);
                  if (isOptionChanged && !isExcludedOption) {
                    this.component?.option(`items[${index}].${key}.${option}`, currentOptions[option]);
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
