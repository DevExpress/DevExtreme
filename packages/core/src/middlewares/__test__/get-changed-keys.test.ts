import { getKeys } from '../../utils';
import { getChangedKeys } from '../get-changed-keys';

jest.mock('../../utils');
const getKeysMock = jest.mocked(getKeys);

describe('Core: Component: Middlewares: getChangedKeys', () => {
  it('Returns changed keys', () => {
    const prevObj = {
      a: 1,
      b: 2,
      c: 3,
    };
    const nextObj = {
      a: 2,
      b: 2,
      c: 2,
    };
    const expectedResult = ['a', 'c'];
    getKeysMock.mockReturnValue(['a', 'b', 'c']);

    const result = getChangedKeys(prevObj, nextObj);

    expect(result).toEqual(expectedResult);
  });
});
