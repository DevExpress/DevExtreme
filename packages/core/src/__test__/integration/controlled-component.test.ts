import { createSelector, createStore } from '../../index';
import {
  PARAM1_DEFAULT,
  PROP1_DEFAULT, PROP1_INVALID, PROP1_VALID, Props, selectProp1, validateProp1,
} from './shared';

function createControlledComponent({
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
      controlledMode: true,
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
    suggestStateUpdate(state: Props) {
      store.addUpdate(() => ({ ...state }));
      store.commitUpdates();
    },
    updateProp1(prop1: Props['prop1']) {
      store.addUpdate((state) => ({ ...state, prop1 }));
      store.commitPropsUpdates();
    },
    setParam1(value: string) {
      param1 = value;
    },
  };
}

describe('controlled component', () => {
  it('has intial state', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    expect(getState().prop1).toBe('abc');
    expect(getViewModel().selected1).toBe('selected1-param1-abc');
  });

  it('does not update state if prop is not changed', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
      suggestStateUpdate,
      setParam1,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    setParam1('newParam1');
    suggestStateUpdate({ prop1: 'def' });

    expect(getState().prop1).toBe('abc');
    expect(getViewModel().selected1).toBe('selected1-param1-abc');
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith('def');
  });

  it('updates state if prop is changed', () => {
    const onProp1Change = jest.fn().mockImplementation(
      (prop1) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        updateProp1(prop1.toUpperCase());
      },
    );
    const {
      getState,
      getViewModel,
      suggestStateUpdate,
      setParam1,
      updateProp1,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    setParam1('newParam1');
    suggestStateUpdate({ prop1: 'def' });

    expect(getState().prop1).toBe('DEF');
    expect(getViewModel().selected1).toBe('selected1-newParam1-DEF');
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith('def');
  });
});

describe('controlled component with validator', () => {
  it('has intial state', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    expect(getState().prop1).toBe('abc');
    expect(getViewModel().selected1).toBe('selected1-param1-abc');
  });

  it('does not update state if prop is not changed', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      getViewModel,
      suggestStateUpdate,
      setParam1,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    setParam1('newParam1');
    suggestStateUpdate({ prop1: PROP1_INVALID });

    expect(getState().prop1).toBe('abc');
    expect(getViewModel().selected1).toBe('selected1-param1-abc');
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith(PROP1_VALID);
  });

  it('updates state if prop is changed', () => {
    const onProp1Change = jest.fn().mockImplementation(
      (prop1) => {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        updateProp1(prop1.toUpperCase());
      },
    );
    const {
      getState,
      getViewModel,
      suggestStateUpdate,
      setParam1,
      updateProp1,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    setParam1('newParam1');
    suggestStateUpdate({ prop1: PROP1_INVALID });

    expect(getState().prop1).toBe(PROP1_VALID.toUpperCase());
    expect(getViewModel().selected1).toBe(`selected1-newParam1-${PROP1_VALID.toUpperCase()}`);
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith(PROP1_VALID);
  });
});
