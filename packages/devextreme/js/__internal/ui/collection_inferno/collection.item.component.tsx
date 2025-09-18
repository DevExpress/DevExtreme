import type { CollectionWidgetItem } from '@js/ui/collection/ui.collection_widget.base';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import { combineClasses } from '@ts/core/utils/combine_classes';
import type { Component } from 'inferno';

export const ITEM_CLASS = 'dx-item';

export type CollectionItemProps<
  TProperties extends CollectionWidgetItem = CollectionWidgetItem,
> = Component<TProperties>['props'] & {
  isSelected?: boolean;
};

export class ItemComponent<
  TProps extends CollectionItemProps,
> extends BaseInfernoComponent<TProps> {
  protected _selectedItemClass = 'dx-item-selected';

  protected _selectedAriaAttribute = 'aria-selected';

  protected getCssClasses(): Record<string, boolean> {
    return {
      [ITEM_CLASS]: true,
      [this._selectedItemClass]: !!this.props.isSelected,
    };
  }

  protected getAriaAttributes(): Record<string, string> {
    return {
      [this._selectedAriaAttribute]: String(!!this.props.isSelected),
    };
  }

  render(props: TProps): JSX.Element {
    const className = combineClasses(this.getCssClasses());
    const ariaAttrs = this.getAriaAttributes();

    if (props.children) {
      // @ts-expect-error ts
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return props.children?.({
        ...props,
        className,
        ...ariaAttrs,
      });
    }

    return (
        <span
          className={className}
          {...ariaAttrs}
        >
          { this.props.text }
        </span>
    );
  }
}
