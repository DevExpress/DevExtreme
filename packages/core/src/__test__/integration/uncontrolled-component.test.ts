import { createSelector, createStore } from '../../index';
import {
  PARAM1_DEFAULT,
  PROP1_DEFAULT, PROP1_INVALID, PROP1_VALID, Props, selectProp1, validateProp1,
} from './shared';

function createUncontrolledComponent({
  onProp1Change,
  prop1Default = PROP1_DEFAULT,
}: {
  onProp1Change?(v: string): void,
  prop1Default?: string,
} = {}) {
  const store = createStore<Props>({
    prop1: prop1Default,
  }, {
    prop1: {
      controlledMode: false,
      changeCallback(value: string): void {
        onProp1Change?.(value);
      },
    },
  }, [
    validateProp1,
  ]);

  let param1 = PARAM1_DEFAULT;

  const selector1 = createSelector(
    (state: Props) => ({ ...state, param1 }),
    selectProp1,
  );

  let selected1 = selector1(store.getState());

  store.subscribe((state) => { selected1 = selector1(state); });

  return {
    getState: store.getState,
    getViewModel() {
      return {
        selected1,
      };
    },
    updateState(state: Props) {
      store.addUpdate(() => ({ ...state }));
      store.commitUpdates();
    },
    setParam1(value: string) {
      param1 = value;
    },
  };
}

describe('uncontrolled component', () => {
  it('has intial state', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
    } = createUncontrolledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    expect(getState().prop1).toBe('abc');
    expect(getViewModel().selected1).toBe('selected1-param1-abc');
  });

  it('updates state', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
      setParam1,
      updateState,
    } = createUncontrolledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    setParam1('newParam1');
    updateState({ prop1: 'def' });

    expect(getState().prop1).toBe('def');
    expect(getViewModel().selected1).toBe('selected1-newParam1-def');
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith('def');
  });
});

describe('uncontrolled component with validator', () => {
  it('has intial state', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
    } = createUncontrolledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    expect(getState().prop1).toBe('abc');
    expect(getViewModel().selected1).toBe('selected1-param1-abc');
  });

  it('updates state', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
      setParam1,
      updateState,
    } = createUncontrolledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    setParam1('newParam1');
    updateState({ prop1: PROP1_INVALID });

    expect(getState().prop1).toBe(PROP1_VALID);
    expect(getViewModel().selected1).toBe(`selected1-newParam1-${PROP1_VALID}`);
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith(PROP1_VALID);
  });
});
