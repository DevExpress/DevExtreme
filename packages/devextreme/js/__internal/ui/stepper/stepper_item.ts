import type {
  CollectionWidgetItem as CollectionWidgetItemProperties,
} from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

export interface StepperItemProperties extends CollectionWidgetItemProperties {}

class StepperItem extends CollectionWidgetItem {}

export default StepperItem;
