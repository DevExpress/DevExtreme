import { getChangedKeys } from '../../utils';
import { controlledModeMiddleware } from '../controlled-mode-middleware';

jest.mock('../../utils');
const getChangedKeysMock = jest.mocked(getChangedKeys);

describe('core', () => {
  describe('middlewares', () => {
    describe('changesMiddleware', () => {
      it('Returns next model object if config not set (all values in uncontrolled mode)', () => {
        const prevObject = {
          a: 1,
          b: 2,
          c: 10,
        };
        const nextObject = {
          a: 3,
          b: 4,
          c: 10,
        };
        getChangedKeysMock.mockReturnValue(['a', 'b']);

        const newModel = controlledModeMiddleware(prevObject, nextObject);

        expect(newModel).toEqual(nextObject);
      });

      it('Returns next model object if all values in uncontrolled mode', () => {
        const prevObject = {
          a: 1,
          b: 2,
        };
        const nextObject = {
          a: 3,
          b: 4,
        };
        const config = {
          a: {
            controlledMode: false,
            changeCallback() {},
          },
          b: {
            controlledMode: false,
            changeCallback() {},
          },
        };
        getChangedKeysMock.mockReturnValue(['a', 'b']);

        const newModel = controlledModeMiddleware(prevObject, nextObject, config);

        expect(newModel).toEqual(nextObject);
      });

      it('Returns prev model object if all values in controlled mode', () => {
        const prevObject = {
          a: 1,
          b: 2,
        };
        const nextObject = {
          a: 3,
          b: 4,
        };
        const config = {
          a: {
            controlledMode: true,
            changeCallback() {},
          },
          b: {
            controlledMode: true,
            changeCallback() {},
          },
        };
        getChangedKeysMock.mockReturnValue(['a', 'b']);

        const newModel = controlledModeMiddleware(prevObject, nextObject, config);

        expect(newModel).toEqual(prevObject);
      });

      it('Returns new correct model object considering controlled/uncontrolled mode of the values', () => {
        const prevObject = {
          a: 1,
          b: 2,
        };
        const nextObject = {
          a: 3,
          b: 4,
        };
        const expectedModel = {
          a: 1,
          b: 4,
        };
        const config = {
          a: {
            controlledMode: true,
            changeCallback() {},
          },
          b: {
            controlledMode: false,
            changeCallback() {},
          },
        };
        getChangedKeysMock.mockReturnValue(['a', 'b']);

        const newModel = controlledModeMiddleware(prevObject, nextObject, config);

        expect(newModel).toEqual(expectedModel);
      });
    });
  });
});
