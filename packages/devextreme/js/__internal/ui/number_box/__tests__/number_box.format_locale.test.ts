import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';
import type { Properties } from '@js/ui/number_box';
import NumberBox from '@js/ui/number_box';

const widgets: { dispose: () => void }[] = [];

const createNumberBox = (options: Partial<Properties>): HTMLInputElement => {
  const element = document.body.appendChild(document.createElement('div'));
  const instance = new NumberBox(element, options);

  widgets.push(instance);

  return element.querySelector('.dx-texteditor-input') as HTMLInputElement;
};

describe('explicit number preset keeps the message locale', () => {
  afterEach(() => {
    widgets.forEach((instance) => instance.dispose());
    widgets.length = 0;
    document.body.innerHTML = '';
  });

  it('keeps the message locale for an explicit fixedPoint format', () => {
    const savedLocale = coreLocalization.locale();
    const savedNumberFormat = config().numberFormat;

    coreLocalization.locale('de');
    config({
      ...config(),
      numberFormat: {
        default: {
          locale: 'en-US',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      },
    });

    try {
      const stringFormatInput = createNumberBox({
        value: 1234.56,
        format: 'fixedPoint',
      });
      const objectFormatInput = createNumberBox({
        value: 1234.56,
        format: { type: 'fixedPoint', precision: 0 },
      });

      expect(stringFormatInput.value).toBe('1.235');
      expect(objectFormatInput.value).toBe('1.235');
    } finally {
      const currentConfig = config();

      if (savedNumberFormat === undefined) {
        delete currentConfig.numberFormat;
      } else {
        currentConfig.numberFormat = savedNumberFormat;
      }

      coreLocalization.locale(savedLocale);
    }
  });
});
