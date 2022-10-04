import { ClientFunction } from 'testcafe';
import type { PlatformType } from './platform-type';

export function getComponentInstance(
  platform: PlatformType,
  selector: Selector,
  name?: string,
): () => Promise<unknown> {
  if (platform !== 'jquery') {
    return ClientFunction(
      () => (window as any).componentInstance,
      { dependencies: {} },
    );
  }

  return ClientFunction(
    () => {
      const $widgetElement = $(selector());
      const elementData = $widgetElement.data();
      const widgetNames = elementData.dxComponents;

      if (name) {
        return elementData[name] ?? elementData[widgetNames[0]];
      }
      if (widgetNames.length > 1) {
        throw new Error(`Cannot update options for multiple widgets: ${widgetNames}`);
      }
      if (widgetNames.length < 1) {
        throw new Error(`jQuery widget not found for selector $(${selector})`);
      }
      return elementData[widgetNames[0]];
    },
    { dependencies: { selector, name } },
  );
}
