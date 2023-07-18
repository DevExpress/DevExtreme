import { ClientFunction } from 'testcafe';
import type { PlatformType } from './platform-type';

export async function updateComponentOptions(
  platform: PlatformType,
  options: unknown,
  selector = '#container',
): Promise<void> {
  if (platform === 'jquery') {
    await ClientFunction(() => {
      const $widgetElement = $(selector);
      const elementData = $widgetElement.data();
      const widgetNames = elementData.dxComponents;
      if (widgetNames.length > 1) {
        throw new Error(`Cannot update options for multiple widgets: ${widgetNames}`);
      }
      if (widgetNames.length < 1) {
        throw new Error(`jQuery widget not found for selector $(${selector})`);
      }
      elementData[widgetNames[0]].option(options);
    }, {
      dependencies: {
        options,
        selector,
      },
    })();
  } else {
    await ClientFunction(() => {
      const { onOptionsUpdated } = window as any;
      onOptionsUpdated?.(options);
    }, {
      dependencies: {
        options,
      },
    })();
  }
}
