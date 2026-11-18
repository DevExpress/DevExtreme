import type { Page } from '@playwright/test';
import type { WidgetName, WidgetOptions } from '../models/types';
import { DEFAULT_SELECTOR } from './const';

export interface CreateWidgetOptions {
  disableFxAnimation: boolean;
}

const DEFAULT_OPTIONS: CreateWidgetOptions = {
  disableFxAnimation: true,
};

export const createWidget = async <TWidgetName extends WidgetName>(
  page: Page,
  widgetName: TWidgetName,
  widgetOptions: TWidgetName extends keyof WidgetOptions
    ? WidgetOptions[TWidgetName]
    | (() => WidgetOptions[TWidgetName] | Promise<WidgetOptions[TWidgetName]>)
    : unknown,
  selector: string = DEFAULT_SELECTOR,
  { disableFxAnimation } = DEFAULT_OPTIONS,
): Promise<void> => {
  // Handlers cannot pass through the "page.evaluate" arguments, so a configuration with them
  // arrives as a factory that Playwright runs in the page.
  const options = typeof widgetOptions === 'function'
    ? await page.evaluateHandle(widgetOptions as () => unknown)
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
