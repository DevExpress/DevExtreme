import { ClientFunction } from 'testcafe';
import { WidgetName } from './widgetName';

export default async function disposeWidget<TWidgetName extends WidgetName>(
  componentName: TWidgetName,
  selector = '#container',
  ignoreExceptions = false,
): Promise<void> {
  await ClientFunction(
    () => {
      try {
        ($(`${selector}`) as any)[componentName]('dispose');
      } catch (err) {
        if (!ignoreExceptions) {
          throw err;
        }
      }
    },
    {
      dependencies: {
        componentName,
        selector,
      },
    },
  )();
}
