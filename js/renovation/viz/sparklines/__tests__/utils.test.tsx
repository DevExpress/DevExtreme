import { generateCustomizeTooltipCallback } from '../utils';

describe('generateCustomizeTooltipCallback', () => {
  const fontOptions = {
    size: 14,
    lineSpacing: 4,
  };

  describe('generateDefaultCustomizeTooltipCallback', () => {
    it('should return an empty table if tooltip data is not passed)', () => {
      const customizeFn = generateCustomizeTooltipCallback(undefined, fontOptions, false);
      const customOptions = customizeFn({});

      expect(customOptions.html).toBe('<table style=\'border-spacing:0px; line-height: 18px\'></table>');
    });

    it('should return table with value texts', () => {
      const customizeFn = generateCustomizeTooltipCallback(undefined, fontOptions, false);
      const customOptions = customizeFn({
        valueTexts: [
          'Actual value',
          '10',
          'Target value',
          '15',
        ],
      });

      expect(customOptions.html).toBe('<table style=\'border-spacing:0px; line-height: 18px\'><tr>'
        + '<td>Actual value</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>10</td></tr>'
        + '<tr><td>Target value</td><td style=\'width: 15px\'></td><td style=\'text-align: right\'>15</td></tr></table>');
    });
  });

  describe('customizeTooltip', () => {
    const commonCustomProps = {
      color: 'red',
      borderColor: 'green',
      fontColor: 'blue',
    };

    it('should return default table if no html and text props exist', () => {
      const customizeTooltip = () => commonCustomProps;
      const customizeFn = generateCustomizeTooltipCallback(customizeTooltip, fontOptions, false);
      const customOptions = customizeFn({});

      expect(customOptions).toEqual({
        ...commonCustomProps,
        html: '<table style=\'border-spacing:0px; line-height: 18px\'></table>',
      });
    });

    it('should return result of calling the callback function', () => {
      const customizeTooltip = () => ({
        ...commonCustomProps,
        text: 'Custom text',
      });
      const customizeFn = generateCustomizeTooltipCallback(customizeTooltip, fontOptions, false);
      const customOptions = customizeFn({});

      expect(customOptions).toEqual({
        ...customizeTooltip(),
      });
    });
  });
});
