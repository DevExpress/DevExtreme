import jQueryCreateWidget, { WidgetName } from '../createWidget';
import { updateComponentOptions } from './updateComponentOptions';
import type { PlatformType } from './platform-type';

export async function createWidget(
  platform: PlatformType,
  widgetName: WidgetName,
  options: unknown,
  disableAnimation = false,
  selector = '#container',
): Promise<void> {
  if (platform !== 'jquery') {
    await updateComponentOptions(platform, options);
  } else {
    await jQueryCreateWidget(widgetName, options, disableAnimation, selector);
  }
}
