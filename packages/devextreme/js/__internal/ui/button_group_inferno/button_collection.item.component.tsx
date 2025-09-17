import { isDefined } from '@js/core/utils/type';
import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Item } from '@js/ui/button_group';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';
import { Button } from '@ts/grids/new/grid_core/inferno_wrappers/button';
import { BUTTON_GROUP_CLASS } from '@ts/ui/button_group_inferno/button_collection.component';
import type { CollectionItemProps } from '@ts/ui/collection_inferno/collection.item.component';
import { ItemComponent } from '@ts/ui/collection_inferno/collection.item.component';

const BUTTON_GROUP_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-item`;
const BUTTON_GROUP_FIRST_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-first-item`;
const BUTTON_GROUP_LAST_ITEM_CLASS = `${BUTTON_GROUP_CLASS}-last-item`;
const BUTTON_GROUP_ITEM_HAS_WIDTH = `${BUTTON_GROUP_ITEM_CLASS}-has-width`;
const SHAPE_STANDARD_CLASS = 'dx-shape-standard';

export type ButtonCollectionItemProps = CollectionItemProps<Item> & ButtonProperties & {
  isFirst?: boolean;
  isLast?: boolean;
  hasWidth?: boolean;
};

export class ButtonCollectionItem extends BaseInfernoComponent<ButtonCollectionItemProps> {
  private defineClasses(collectionItemClassName: string): string {
    const {
      isFirst, isLast, hasWidth, elementAttr,
    } = this.props;

    const classes = [
      collectionItemClassName,
      BUTTON_GROUP_ITEM_CLASS,
      SHAPE_STANDARD_CLASS,
      elementAttr?.class ?? null,
      isFirst ? BUTTON_GROUP_FIRST_ITEM_CLASS : null,
      isLast ? BUTTON_GROUP_LAST_ITEM_CLASS : null,
      hasWidth ? BUTTON_GROUP_ITEM_HAS_WIDTH : null,
    ];

    return classes.filter(isDefined).join(' ');
  }

  render(): JSX.Element {
    return (
      <ItemComponent isSelected={this.props.isSelected}>
        {({ className }: { className: string }) => (
          <Button
            {...this.props}
            elementAttr={{
              ...this.props.elementAttr,
              class: this.defineClasses(className),
            }}
          />
        )}
      </ItemComponent>
    );
  }
}
