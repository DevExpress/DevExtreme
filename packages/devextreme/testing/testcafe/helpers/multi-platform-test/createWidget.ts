import { createWidget as jQueryCreateWidget } from '../createWidget';
import { updateComponentOptions } from './updateComponentOptions';
import type { PlatformType } from './platform-type';
import type { WidgetName } from '../widgetTypings';

export async function createWidget(
  platform: PlatformType,
  widgetName: WidgetName,
  options: unknown,
  selector = '#container',
): Promise<void> {
  if (platform !== 'jquery') {
    await updateComponentOptions(platform, options);
  } else {
    await jQueryCreateWidget(widgetName, options, selector);
  }
}
