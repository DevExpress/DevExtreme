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
}
