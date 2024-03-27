import { ClientFunction } from 'testcafe';
import type { WidgetName, WidgetOptions } from './widgetTypings';

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

export const disposeWidget = async <TWidgetName extends WidgetName>(
  widgetName: TWidgetName,
  selector = DEFAULT_SELECTOR,
): Promise<void> => ClientFunction(() => {
  if (shadowDom) {
    (window as any).DevExpress.ui[widgetName].getInstance(($(`${selector}`) as any).get(0)).dispose();
  } else {
    ($(`${selector}`) as any)[widgetName]('dispose');
  }
  (window as any).widget = undefined;
}, {
  dependencies: {
    widgetName,
    selector,
    shadowDom,
  },
})();
