import { ClientFunction } from 'testcafe';
import { WidgetName } from './widgetName';

export default async function disposeWidget<TWidgetName extends WidgetName>(
  componentName: TWidgetName,
  selector = '#container',
): Promise<void> {
  await ClientFunction(
    () => {
      ($(`${selector}`) as any)[componentName]('dispose');
    },
    {
      dependencies: {
        componentName,
        selector,
      },
    },
  )();
}
