import { createStore } from '../../index';
import {
  PROP1_DEFAULT, PROP1_INVALID, PROP1_VALID, Props, validateProp1,
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

  return {
    getState: store.getState,
    suggestStateUpdate(state: Props) {
      store.addUpdate(() => ({ ...state }));
      store.commitUpdates();
    },
    updateProp1(prop1: Props['prop1']) {
      store.addUpdate((state) => ({ ...state, prop1 }));
      store.commitPropsUpdates();
    },
  };
}

describe('controlled component', () => {
  it('does not update state if prop is not changed', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      suggestStateUpdate,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    suggestStateUpdate({ prop1: 'def' });

    expect(getState().prop1).toBe('abc');
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
      suggestStateUpdate,
      updateProp1,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    suggestStateUpdate({ prop1: 'def' });

    expect(getState().prop1).toBe('DEF');
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith('def');
  });
});

describe('controlled component with validator', () => {
  it('does not update state if prop is not changed', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      suggestStateUpdate,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    suggestStateUpdate({ prop1: PROP1_INVALID });

    expect(getState().prop1).toBe('abc');
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
      suggestStateUpdate,
      updateProp1,
    } = createControlledComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    suggestStateUpdate({ prop1: PROP1_INVALID });

    expect(getState().prop1).toBe(PROP1_VALID.toUpperCase());
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith(PROP1_VALID);
  });
});
