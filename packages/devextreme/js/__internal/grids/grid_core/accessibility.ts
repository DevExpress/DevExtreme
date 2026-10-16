import type { NativeEventInfo } from '@js/common/core/events';
import type { KeyDownInfo } from '@js/common/grids';
import type { dxElementWrapper } from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import * as accessibility from '@js/ui/shared/accessibility';
import type { View } from '@ts/grids/grid_core/modules/modules';

type KeyDownArgs = KeyDownInfo & NativeEventInfo<unknown, KeyboardEvent>;

export const registerKeyboardAction = (
  viewName: string,
  instance: View,
  $element: dxElementWrapper,
  selector: string | undefined,
  action: (args: { event: DxEvent }) => void,
): void => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let executeKeyDown = (args: KeyDownArgs): void => {};

  const keyboardController = instance.getController('keyboardNavigation');
  if (
    instance.option('useLegacyKeyboardNavigation')
    || (keyboardController && !keyboardController.isKeyboardEnabled())
  ) {
    return;
  }

  if (viewName === 'filterPanel') {
    executeKeyDown = (args: KeyDownArgs): void => {
      instance.executeAction('onKeyDown', args);
    };

    instance.createAction('onKeyDown');
  }

  accessibility.registerKeyboardAction(
    viewName,
    instance,
    $element,
    selector,
    action,
    executeKeyDown,
  );
};
