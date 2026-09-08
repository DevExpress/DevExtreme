import type { Page } from '@playwright/test';
import type { WidgetName, WidgetOptions } from '../models/types';
import { DEFAULT_SELECTOR } from './const';

export interface CreateWidgetOptions {
  disableFxAnimation: boolean;
}

const DEFAULT_OPTIONS: CreateWidgetOptions = {
  disableFxAnimation: true,
};

const FUNCTION_MARK = '__dxFunction__:';
const DATE_MARK = '__dxDate__:';

// Playwright passes the arguments of "page.evaluate" through JSON, which drops the handlers and
// flattens the dates a widget configuration is full of. The TestCafe runner kept both, so they are
// marked here and revived in the page — otherwise every "onInitialized" would arrive as undefined.
const serializeOptions = (options: unknown): string => JSON.stringify(
  options,
  // eslint-disable-next-line func-names
  function (this: Record<string, unknown>, key: string, value: unknown) {
    const raw = this[key];

    if (typeof raw === 'function') {
      return `${FUNCTION_MARK}${raw.toString()}`;
    }

    if (raw instanceof Date) {
      return `${DATE_MARK}${raw.toISOString()}`;
    }

    return value;
  },
);

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
    const functionMark = '__dxFunction__:';
    const dateMark = '__dxDate__:';

    const compile = (source: string): unknown => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        return new Function(`return (${source});`)();
      } catch {
        // A method shorthand — "onInitialized(e) { … }" — is not an expression on its own, so it
        // is compiled as the single member of an object literal.
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const holder = new Function(`return ({ ${source} });`)() as Record<string, unknown>;

        return holder[Object.keys(holder)[0]];
      }
    };

    const revived = JSON.parse(options, (_, value: unknown) => {
      if (typeof value !== 'string') {
        return value;
      }

      if (value.startsWith(functionMark)) {
        return compile(value.slice(functionMark.length));
      }

      if (value.startsWith(dateMark)) {
        return new Date(value.slice(dateMark.length));
      }

      return value;
    });

    (window as any).DevExpress.fx.off = disableAnimation;

    // A configuration that has to reach for something on the page — a store built by
    // "DevExpress.data" — arrives as a factory and is only called here, as it was in TestCafe.
    const resolved = typeof revived === 'function' ? revived() : revived;

    (window as any).widget = ($(elementSelector) as any)[name](resolved)[name]('instance');
  },
  {
    name: widgetName,
    options: serializeOptions(widgetOptions),
    elementSelector: selector,
    disableAnimation: disableFxAnimation,
  },
);
