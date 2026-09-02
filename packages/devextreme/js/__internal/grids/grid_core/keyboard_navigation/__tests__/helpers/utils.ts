import eventsEngine from '@js/common/core/events/core/events_engine';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import { keyboard } from '@ts/events/short';
import type { DataGridInstance } from '@ts/grids/grid_core/__tests__/__mock__/helpers/utils';

import { CLICK_EVENT, NAV_KEYS } from './const';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getKeyboardNavigationController(instance: DataGridInstance): any {
  return instance.getController('keyboardNavigation');
}

export function triggerPointerDown(element: HTMLElement): void {
  // @ts-expect-error - eventsEngine.trigger is not fully typed
  eventsEngine.trigger($(element), CLICK_EVENT);
}

export function triggerKeyDown(instance: DataGridInstance, keyName: string): void {
  const controller = getKeyboardNavigationController(instance);
  const listenerId = controller.keyDownListener;

  const processor = keyboard._getProcessor(listenerId);

  if (!processor) {
    throw new Error(`There is no keyboard processor with the '${listenerId}' id`);
  }

  const event = {
    key: NAV_KEYS[keyName] ?? keyName,
    keyName,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    target: controller._getFocusedCell()?.get(0) ?? null,
    type: 'keydown',
    preventDefault() {},
    isDefaultPrevented() { return false; },
    stopPropagation() {},
  } as unknown as DxEvent<KeyboardEvent>;

  processor.process(event);
}
