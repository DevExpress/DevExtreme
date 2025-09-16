import type { Item } from '@js/ui/button_group';
import type { CollectionItemProps } from '@ts/ui/collection_inferno/collection.item.component';
import { ItemComponent } from '@ts/ui/collection_inferno/collection.item.component';

export type ButtonCollectionItemProps = CollectionItemProps<Item>;

export class ButtonCollectionItem extends ItemComponent<ButtonCollectionItemProps> {}
