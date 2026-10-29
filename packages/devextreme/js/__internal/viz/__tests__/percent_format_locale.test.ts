import {
  afterEach, describe, expect, it,
} from '@jest/globals';
import coreLocalization from '@js/common/core/localization/core';
import config from '@js/core/config';
import { Axis } from '@ts/viz/axes/base_axis';
import { smartFormatter } from '@ts/viz/axes/smart_formatter';
import { Tooltip } from '@ts/viz/core/tooltip';
import { Label } from '@ts/viz/series/points/label';

const formatLabel = (format: unknown): { valueText: string; percentText: string } => {
  const data = { value: 1234.5, percent: 0.125 };

  Label._DEBUG_formatText(data, { format });

  return data as unknown as { valueText: string; percentText: string };
};

const formatTooltip = (format: unknown): { valueText: string; percentText: string } => {
  const tooltip = { _options: { format } };

  return {
    valueText: Tooltip.prototype.formatValue.call(tooltip, 1234.5),
    percentText: Tooltip.prototype.formatValue.call(tooltip, 0.125, 'percent'),
  };
};

describe('percent text uses the locale of the value format', () => {
  afterEach(() => {
    coreLocalization.locale('en');
    delete config().numberFormat;
  });

  it.each([
    {
      name: 'an explicit format without a locale',
      globalLocale: 'en-US',
      format: { type: 'fixedPoint', precision: 1, percentPrecision: 1 },
      valueText: '1.234,5',
      percentText: '12,5 %',
    },
    {
      name: 'an explicit format locale',
      globalLocale: undefined,
      format: {
        type: 'fixedPoint', precision: 1, percentPrecision: 1, locale: 'en-US',
      },
      valueText: '1,234.5',
      percentText: '12.5%',
    },
  ])('should format the value and the percent in one locale for $name', ({
    globalLocale, format, valueText, percentText,
  }) => {
    coreLocalization.locale('de');
    if (globalLocale) {
      config({ ...config(), numberFormat: { default: { locale: globalLocale } } });
    }

    expect(formatLabel(format)).toMatchObject({ valueText, percentText });
    expect(formatTooltip(format)).toMatchObject({ valueText, percentText });
  });

  it('should format the value and the percent without a format in the global numberFormat locale', () => {
    coreLocalization.locale('de');
    config({ ...config(), numberFormat: { default: { locale: 'en-US' } } });

    expect(formatLabel(undefined)).toMatchObject({ valueText: '1,234.5', percentText: '13%' });
    expect(formatTooltip(undefined)).toMatchObject({ valueText: '1,234.5', percentText: '13%' });
  });

  it('should format the auto percent axis labels in the global numberFormat locale', () => {
    coreLocalization.locale('de');
    config({ ...config(), numberFormat: { default: { locale: 'en-US' } } });

    const axis = { _hasLabelFormat: false, _options: { label: {} as { format?: unknown } } };

    Axis.prototype.setPercentLabelFormat.call(axis);

    expect(smartFormatter(0.125, {
      labelOptions: { format: axis._options.label.format },
      ticks: [0, 0.125, 0.25],
      tickInterval: 0.125,
      dataType: 'numeric',
      type: 'continuous',
    })).toBe('13%');
  });
});
