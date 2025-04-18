import type { Item } from '@js/ui/stepper';
import CollectionWidgetItem from '@ts/ui/collection/item';

export const STEP_COMPLETED_CLASS = 'dx-step-completed';
export const STEP_INVALID_CLASS = 'dx-step-invalid';
export const STEP_VALID_ICON = 'check';
export const STEP_INVALID_ICON = 'errorcircle';

class StepperItem extends CollectionWidgetItem<Item> {
  _renderWatchers(): void {
    super._renderWatchers();

    this._startWatcher<string>('hint', (value) => {
      this._renderHint(value);
    });
  }

  _renderHint(hint: string | undefined): void {
    this._$element.attr('title', hint ?? null);
  }

  updateInvalidClass(isValid: boolean | undefined): void {
    this._$element.toggleClass(STEP_INVALID_CLASS, isValid !== undefined && !isValid);
  }

  changeCompleted(isCompleted: boolean): void {
    this._$element.toggleClass(STEP_COMPLETED_CLASS, isCompleted);
  }
}

export default StepperItem;
