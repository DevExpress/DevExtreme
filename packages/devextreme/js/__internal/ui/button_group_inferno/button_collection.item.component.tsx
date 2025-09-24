import type { Properties as ButtonProperties } from '@js/ui/button';
import type { Item } from '@js/ui/button_group';
import { combineClasses } from '@ts/core/utils/combine_classes';
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

export class ButtonCollectionItem extends ItemComponent<ButtonCollectionItemProps> {
  protected _selectedItemClass = 'dx-item-selected dx-state-selected';

  protected _selectedAriaAttribute = 'aria-pressed';

  protected getCssClasses(): Record<string, boolean> {
    const userClass = this.props.elementAttr?.class;

    return {
      ...super.getCssClasses(),
      [BUTTON_GROUP_ITEM_CLASS]: true,
      [SHAPE_STANDARD_CLASS]: true,
      [userClass]: !!userClass,
      [BUTTON_GROUP_FIRST_ITEM_CLASS]: !!this.props.isFirst,
      [BUTTON_GROUP_LAST_ITEM_CLASS]: !!this.props.isLast,
      [BUTTON_GROUP_ITEM_HAS_WIDTH]: !!this.props.hasWidth,
    };
  }

  render(props: ButtonCollectionItemProps): JSX.Element {
    const className = combineClasses(this.getCssClasses());
    const ariaAttrs = this.getAriaAttributes();

    return (
      <Button
        {...props}
        elementAttr={{
          ...props.elementAttr,
          class: className,
          ...ariaAttrs,
        }}
      />
    );
  }
}
