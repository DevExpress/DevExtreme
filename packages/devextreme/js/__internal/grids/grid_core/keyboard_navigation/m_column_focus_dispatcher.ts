import { Controller } from '../m_modules';
import type { ColumnKeyboardNavigationController } from './m_column_keyboard_navigation_core';

export class ColumnFocusDispatcher extends Controller {
  private readonly keyboardNavigationControllers: ColumnKeyboardNavigationController[] = [];

  public registerKeyboardNavigationController(
    keyboardNavigationController: ColumnKeyboardNavigationController,
  ): void {
    this.keyboardNavigationControllers.push(keyboardNavigationController);
  }

  public restoreFocus(keyboardNavigationController: ColumnKeyboardNavigationController): void {
    if (keyboardNavigationController.getFirstFocusableVisibleIndex() >= 0) {
      keyboardNavigationController.focusCell();
    } else {
      this.keyboardNavigationControllers.forEach((keyboardController) => {
        if (keyboardController !== keyboardNavigationController) {
          const firstFocusableVisibleIndex = keyboardController
            .getFirstFocusableVisibleIndex();

          if (firstFocusableVisibleIndex >= 0) {
            keyboardController.focusCell({ rowIndex: 0, columnIndex: firstFocusableVisibleIndex });
          }
        }
      });
    }
  }
}
