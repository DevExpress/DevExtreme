import { ClientFunction } from 'testcafe';
import type { WidgetName, WidgetOptions } from 'devextreme-testcafe-models/types';

export interface CreateWidgetOptions {
  disableFxAnimation: boolean;
}

const DEFAULT_SELECTOR = '#container';
const DEFAULT_OPTIONS: CreateWidgetOptions = {
  disableFxAnimation: true,
};

const shadowDom = process.env.shadowDom === 'true';

const createWidgetCore = <TWidgetName extends WidgetName>(
  widgetName: TWidgetName,
  widgetOptions: TWidgetName extends keyof WidgetOptions
    ? WidgetOptions[TWidgetName] : unknown,
  selector: string,
  isShadowDom: boolean,
) => {
  if (isShadowDom) {
    return new (window as any).DevExpress.ui[widgetName](
      ($(selector) as any).get(0),
      widgetOptions,
    );
  }
  return ($(`${selector}`) as any)[widgetName](widgetOptions)[widgetName]('instance');
};

export const createWidget = async<TWidgetName extends WidgetName>(
  widgetName: TWidgetName,
  widgetOptions: TWidgetName extends keyof WidgetOptions
    ? WidgetOptions[TWidgetName] | (() => WidgetOptions[TWidgetName])
    : unknown,
  selector = DEFAULT_SELECTOR,
  { disableFxAnimation } = DEFAULT_OPTIONS,
): Promise<void> => ClientFunction(
  () => {
    (window as any).DevExpress.fx.off = disableFxAnimation;
    const options = typeof widgetOptions === 'function' ? widgetOptions() : widgetOptions;
    (window as any).widget = createWidgetCore(widgetName, options, selector, shadowDom);
  },
  {
    dependencies: {
      widgetName,
      widgetOptions,
      selector,
      disableFxAnimation,
      shadowDom,
      createWidgetCore,
    },
  },
)();

export async function disposeWidgets(): Promise<void> {
  await ClientFunction(() => {
    const widgetSelector = '.dx-widget';
    const $elements = $(widgetSelector)
      .filter((_, element) => $(element).parents(widgetSelector).length === 0);
    $elements.each((_, element) => {
      const $widgetElement = $(element);
      const widgetNames = $widgetElement.data().dxComponents;
      widgetNames?.forEach((name) => {
        if ($widgetElement.hasClass('dx-widget')) {
          ($widgetElement as any)[name]('dispose');
        }
      });
      $widgetElement.empty();
    });
  })();
}
