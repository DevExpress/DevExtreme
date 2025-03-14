import type {
  CollectionWidgetItem as CollectionWidgetItemProperties,
} from '@js/ui/collection/ui.collection_widget.base';
import CollectionWidgetItem from '@ts/ui/collection/m_item';

export const STEP_COMPLETED_CLASS = 'dx-step-completed';

export const STEP_INVALID_CLASS = 'dx-step-invalid';

export interface StepperItemProperties extends CollectionWidgetItemProperties {
  icon?: string;
  title?: string;
  isValid?: boolean;
}

class StepperItem extends CollectionWidgetItem<StepperItemProperties> {
  _renderWatchers(): void {
    super._renderWatchers();

    this._startWatcher('isValid', this._renderValidState.bind(this));
  }

  _renderValidState(
    value: boolean | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    oldValue?: boolean | undefined,
  ): void {
    this._$element.toggleClass(STEP_INVALID_CLASS, value !== undefined && !value);
  }

  changeCompleted(isCompleted: boolean): void {
    this._$element.toggleClass(STEP_COMPLETED_CLASS, isCompleted);
  }}

export default StepperItem;
