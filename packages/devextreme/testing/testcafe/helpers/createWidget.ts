import { ClientFunction } from 'testcafe';
import type { WidgetName, WidgetOptions } from './widgetTypings';

export interface CreateWidgetOptions {
  disableFxAnimation: boolean;
}

const DEFAULT_SELECTOR = '#container';
const DEFAULT_OPTIONS: CreateWidgetOptions = {
  disableFxAnimation: true,
};

export const createWidget = async<TWidgetName extends WidgetName>(
  widgetName: TWidgetName,
  widgetOptions: TWidgetName extends keyof WidgetOptions
    ? (
      WidgetOptions[TWidgetName] |
      // NOTE: Promise is only for ClientFunction typing
      (() => (WidgetOptions[TWidgetName]) | Promise<WidgetOptions[TWidgetName]>)
    ) : unknown,
  selector = DEFAULT_SELECTOR,
  { disableFxAnimation } = DEFAULT_OPTIONS,
): Promise<void> => ClientFunction(
  () => {
    (window as any).DevExpress.fx.off = disableFxAnimation;
    const options = typeof widgetOptions === 'function' ? widgetOptions() : widgetOptions;
    (window as any).widget = ($(`${selector}`) as any)[widgetName](options)[widgetName]('instance');
  },
  {
    dependencies: {
      widgetName,
      widgetOptions,
      selector,
      disableFxAnimation,
    },
  },
)();

export const disposeWidget = async <TWidgetName extends WidgetName>(
  widgetName: TWidgetName,
  selector = DEFAULT_SELECTOR,
): Promise<void> => ClientFunction(() => {
  ($(`${selector}`) as any)[widgetName]('dispose');
  (window as any).widget = undefined;
}, {
  dependencies: {
    widgetName,
    selector,
  },
})();
