import type { Properties } from '@js/ui/button_group';
import type { CollectionProps } from '@ts/ui/collection_inferno/collection.component';
import { CollectionComponent } from '@ts/ui/collection_inferno/collection.component';

export type ButtonCollectionProps = CollectionProps<Properties>;

export class ButtonCollectionComponent extends CollectionComponent<ButtonCollectionProps> {}
