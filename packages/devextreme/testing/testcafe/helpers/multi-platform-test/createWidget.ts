import jQueryCreateWidget from '../createWidget';
import { WidgetName } from '../widgetName';
import { updateComponentOptions } from './updateComponentOptions';
import type { PlatformType } from './platform-type';

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
