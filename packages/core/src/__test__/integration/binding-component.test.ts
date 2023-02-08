import { createStore } from '../../index';

const PROP1_DEFAULT = 'prop1-default';

type Props = {
  prop1: string;
};

function createBindingComponent({
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
  });

  return {
    getState: store.getState,
    updateState(state: Props) {
      store.addUpdate(() => ({ ...state }));
      store.commitUpdates();
    },
    updateProp1(prop1: Props['prop1']) {
      store.addUpdate((state) => ({ ...state, prop1 }));
      store.commitUpdates();
    },
  };
}

describe('controlled component', () => {
  it('updates state', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      updateState,
    } = createBindingComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    updateState({ prop1: 'def' });

    expect(getState().prop1).toBe('def');
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith('def');
  });

  it('updates prop', () => {
    const onProp1Change = jest.fn();
    const {
      getState,
      updateProp1,
    } = createBindingComponent({
      prop1Default: 'abc',
      onProp1Change,
    });

    updateProp1('def');

    expect(getState().prop1).toBe('def');
    expect(onProp1Change).toBeCalledTimes(1);
    expect(onProp1Change).toBeCalledWith('def');
  });
});
