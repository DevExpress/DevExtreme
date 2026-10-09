import {
  afterEach, describe, expect, it, jest,
} from '@jest/globals';
import NumberBox from '@js/ui/number_box';
import type { CaretRange } from '@ts/ui/text_box/utils.caret';

const widgets: NumberBox[] = [];

describe('NumberBox precision limits with a locale-only Intl format', () => {
  afterEach(() => {
    widgets.forEach((widget) => widget.dispose());
    widgets.length = 0;
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  const createEditor = (format: Record<string, unknown>): {
    _tryParse: (text: string, selection: CaretRange, char?: string) => number | undefined;
    _getDecimalSeparator: () => string;
  } => {
    const element = document.body.appendChild(document.createElement('div'));
    const instance = new NumberBox(element, { value: 1234, format });

    widgets.push(instance);

    return instance as unknown as {
      _tryParse: (text: string, selection: CaretRange, char?: string) => number | undefined;
      _getDecimalSeparator: () => string;
    };
  };

  it('accepts the decimal separator when the format only specifies a locale', () => {
    const editor = createEditor({ locale: 'fr' });

    const result = editor._tryParse('1234', { start: 4, end: 4 }, editor._getDecimalSeparator());

    expect(result).toBeDefined();
  });

  it('accepts the decimal separator when the format is an empty object', () => {
    const editor = createEditor({});

    const result = editor._tryParse('1234', { start: 4, end: 4 }, editor._getDecimalSeparator());

    expect(result).toBeDefined();
  });
});
