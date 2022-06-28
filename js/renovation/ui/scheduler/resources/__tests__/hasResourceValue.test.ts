import { hasResourceValue } from '../hasResourceValue';

describe('Resources Utils', () => {
  describe('hasResourceValue', () => {
    [
      {
        resourceValues: [
          { value: '1-2-3' },
        ],
        itemValue: { value: '1-2-3' },
        expected: true,
      },
      {
        resourceValues: [
          { value: '1-2-3' },
        ],
        itemValue: { value: 'Failed' },
        expected: false,
      },
      {
        resourceValues: ['1-2-3'],
        itemValue: '1-2-3',
        expected: true,
      },
      {
        resourceValues: ['1-2-3'],
        itemValue: 'Failed',
        expected: false,
      },
      {
        resourceValues: [123],
        itemValue: 123,
        expected: true,
      },
      {
        resourceValues: [123],
        itemValue: 'Failed',
        expected: false,
      },
      {
        resourceValues: [0],
        itemValue: 0,
        expected: true,
      },
      {
        resourceValues: [0],
        itemValue: 'Failed',
        expected: false,
      },
    ].forEach(({ resourceValues, itemValue, expected }) => {
      it(`should return correct value if itemValue=${JSON.stringify(itemValue)}`, () => {
        expect(hasResourceValue(resourceValues, itemValue))
          .toEqual(expected);
      });
    });
  });
});
