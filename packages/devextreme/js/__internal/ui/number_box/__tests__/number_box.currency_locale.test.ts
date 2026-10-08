import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import errors from '@js/core/errors';
import NumberBox from '@js/ui/number_box';

const widgets: NumberBox[] = [];

describe('NumberBox currency format with locale', () => {
  afterEach(() => {
    widgets.forEach((widget) => widget.dispose());
    widgets.length = 0;
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  it('does not warn W0011 when the edited text is parsed', () => {
    const log = jest.spyOn(errors, 'log');
    const element = document.body.appendChild(document.createElement('div'));
    const instance = new NumberBox(element, {
      value: 1234.5,
      format: { style: 'currency', locale: 'fr', currency: 'US' },
    });

    widgets.push(instance);

    const editor = instance as NumberBox & {
      _parse: (text: string, format: string) => number | undefined;
      _getFormatPattern: () => string;
    };
    const parsed = editor._parse('1234,5', editor._getFormatPattern());

    expect(log.mock.calls.some((call) => call[0] === 'W0011')).toBe(false);
    expect(parsed).toBe(1234.5);
  });
});
