import { prepareItemForFilter } from '../resources';

describe('Resource utils', () => {
  describe('prepareItemForFilter', () => {
    [
      {
        filterItem: { guid: '123-456-789-101112' },
        expected: '{"guid":"123-456-789-101112"}',
      },
      {
        filterItem: 'some_string',
        expected: 'some_string',
      },
      {
        filterItem: 100500,
        expected: 100500,
      },
    ].forEach(({ filterItem, expected }) => {
      it(`should return correct value if filterItem=${JSON.stringify(filterItem)}`, () => {
        expect(prepareItemForFilter(filterItem))
          .toEqual(expected);
      });
    });
  });
});
