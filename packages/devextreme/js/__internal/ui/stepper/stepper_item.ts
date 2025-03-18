import type {
  CollectionWidgetItem as CollectionWidgetItemProperties,
} from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

export const STEP_COMPLETED_CLASS = 'dx-step-completed';
export const STEP_INVALID_CLASS = 'dx-step-invalid';

export const STEP_VALID_ICON = 'check';
export const STEP_INVALID_ICON = 'errorcircle';

export interface StepperItemProperties extends CollectionWidgetItemProperties {
  icon?: string;
  title?: string;
  isValid?: boolean;
}

class StepperItem extends CollectionWidgetItem<StepperItemProperties> {
  updateInvalidClass(isValid: boolean | undefined): void {
    this._$element.toggleClass(STEP_INVALID_CLASS, isValid !== undefined && !isValid);
  }

  changeCompleted(isCompleted: boolean): void {
    this._$element.toggleClass(STEP_COMPLETED_CLASS, isCompleted);
  }
}

export default StepperItem;
