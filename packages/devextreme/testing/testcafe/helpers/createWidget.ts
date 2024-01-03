import { ClientFunction } from 'testcafe';
import type { Properties as DataGridProperties } from '../../../js/ui/data_grid';
import type { Properties as FilterBuilderProperties } from '../../../js/ui/filter_builder';
import { WidgetName } from './widgetName';

interface WidgetOptions {
  dxDataGrid: DataGridProperties;
  dxFilterBuilder: FilterBuilderProperties;
  // todo write other widgets
}

export default async function createWidget<TWidgetName extends WidgetName>(
  componentName: TWidgetName,
  componentOptions: TWidgetName extends keyof WidgetOptions
    ? WidgetOptions[TWidgetName] | (() => WidgetOptions[TWidgetName])
    : unknown,
  selector = '#container',
  options: {
    disableFxAnimation: boolean;
  } = {
    disableFxAnimation: true,
  },
): Promise<void> {
  await ClientFunction(() => {
    (window as any).DevExpress.fx.off = options.disableFxAnimation;
  }, {
    dependencies: {
      options,
    },
  })();

  await ClientFunction(
    () => {
      const widgetOptions = typeof componentOptions === 'function' ? componentOptions() : componentOptions;
      (window as any).widget = ($(`${selector}`) as any)[componentName](widgetOptions)[componentName]('instance');
    },
    {
      dependencies: {
        componentName,
        componentOptions,
        selector,
      },
    },
  )();
}
