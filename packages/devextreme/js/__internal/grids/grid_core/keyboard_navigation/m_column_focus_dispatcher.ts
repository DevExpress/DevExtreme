import { isDefined } from '@js/core/utils/type';

import { Controller } from '../m_modules';
import type { ColumnKeyboardNavigationController } from './m_column_keyboard_navigation_core';

export class ColumnFocusDispatcher extends Controller {
  private readonly keyboardNavigationControllers: ColumnKeyboardNavigationController[] = [];

  public registerKeyboardNavigationController(
    keyboardNavigationController: ColumnKeyboardNavigationController,
  ): void {
    this.keyboardNavigationControllers.push(keyboardNavigationController);
  }

  public updateFocusPosition(
    keyboardNavigationController: ColumnKeyboardNavigationController,
    cellPosition?: { rowIndex: number; columnIndex: number },
  ): void {
    if (isDefined(cellPosition)) {
      keyboardNavigationController.updateFocusPosition(cellPosition);
    } else {
      this.keyboardNavigationControllers.forEach((keyboardController) => {
        if (keyboardController === keyboardNavigationController) {
          return;
        }

        keyboardController.updateFocusPosition();
      });
    }
  }

  public restoreFocus(keyboardNavigationController: ColumnKeyboardNavigationController): void {
    if (keyboardNavigationController.getFirstFocusableVisibleIndex() >= 0) {
      keyboardNavigationController.restoreFocus();
    } else {
      this.keyboardNavigationControllers.forEach((keyboardController) => {
        if (keyboardController === keyboardNavigationController) {
          return;
        }

        const firstFocusableVisibleIndex = keyboardController.getFirstFocusableVisibleIndex();

        if (firstFocusableVisibleIndex >= 0) {
          keyboardController.restoreFocus();
        }
      });
    }
  }
}
