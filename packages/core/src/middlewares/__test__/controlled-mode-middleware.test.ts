import { controlledModeMiddleware } from '../controlled-mode-middleware';
import { getChangedKeys } from '../get-changed-keys';

jest.mock('../get-changed-keys');
const getChangedKeysMock = jest.mocked(getChangedKeys);

describe('Core: Component: Middlewares: changesMiddleware', () => {
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

    const [newModel] = controlledModeMiddleware(prevObject, nextObject);

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

    const [newModel] = controlledModeMiddleware(prevObject, nextObject, config);

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

    const [newModel] = controlledModeMiddleware(prevObject, nextObject, config);

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

    const [newModel] = controlledModeMiddleware(prevObject, nextObject, config);

    expect(newModel).toEqual(expectedModel);
  });

  it('Returns hasChanges = true if returned model object has changes', () => {
    const prev = { a: 1 };
    const next = { a: 2 };
    getChangedKeysMock.mockReturnValue(['a']);

    const [, hasChanges] = controlledModeMiddleware(prev, next);

    expect(hasChanges).toBeTruthy();
  });

  it('Returns hasChanges = false if returned model object hasn\'t changes', () => {
    const prev = { a: 1 };
    const next = { a: 2 };
    const config = {
      a: {
        controlledMode: true,
        changeCallback() {},
      },
    };
    getChangedKeysMock.mockReturnValue(['a']);

    const [, hasChanges] = controlledModeMiddleware(prev, next, config);

    expect(hasChanges).toBeFalsy();
  });
});
