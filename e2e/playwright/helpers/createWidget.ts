import type { Page } from '@playwright/test';
import type { WidgetName, WidgetOptions } from '../models/types';
import { DEFAULT_SELECTOR } from './const';

export interface CreateWidgetOptions<TArg = undefined> {
  disableFxAnimation?: boolean;
  arg?: TArg;
}

type WidgetConfig<TWidgetName> = TWidgetName extends keyof WidgetOptions
  ? WidgetOptions[TWidgetName]
  : object;

export const createWidget = async <TWidgetName extends WidgetName, TArg = undefined>(
  page: Page,
  widgetName: TWidgetName,
  widgetOptions: WidgetConfig<TWidgetName>
    | ((arg: TArg) => WidgetConfig<TWidgetName> | Promise<WidgetConfig<TWidgetName>>),
  selector: string = DEFAULT_SELECTOR,
  { disableFxAnimation = true, arg }: CreateWidgetOptions<TArg> = {},
): Promise<void> => {
  // Handlers cannot pass through the "page.evaluate" arguments, so a configuration with them
  // arrives as a factory that Playwright runs in the page.
  const options = typeof widgetOptions === 'function'
    ? await page.evaluateHandle(widgetOptions as (value: any) => unknown, arg)
    : widgetOptions;

  await page.evaluate(({
    name, widgetConfig, elementSelector, disableAnimation,
  }) => {
    (window as any).DevExpress.fx.off = disableAnimation;
    (window as any).widget = ($(elementSelector) as any)[name](widgetConfig)[name]('instance');
  }, {
    name: widgetName,
    widgetConfig: options,
    elementSelector: selector,
    disableAnimation: disableFxAnimation,
  });
};
