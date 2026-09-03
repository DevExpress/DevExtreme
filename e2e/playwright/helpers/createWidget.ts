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
  widgetOptions: TWidgetName extends keyof WidgetOptions ? WidgetOptions[TWidgetName] : unknown,
  selector: string = DEFAULT_SELECTOR,
  { disableFxAnimation } = DEFAULT_OPTIONS,
): Promise<void> => page.evaluate(
  ({
    name, options, elementSelector, disableAnimation,
  }) => {
    (window as any).DevExpress.fx.off = disableAnimation;
    (window as any).widget = ($(elementSelector) as any)[name](options)[name]('instance');
  },
  {
    name: widgetName,
    options: widgetOptions,
    elementSelector: selector,
    disableAnimation: disableFxAnimation,
  },
);
