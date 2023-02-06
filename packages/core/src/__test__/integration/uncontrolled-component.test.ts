import { createSelector, createStore } from '../../index';

const PROP1_DEFAULT = 'prop1-default';
const PROP1_PARAM = 'param1';

type State = {
  prop1: string;
};

function createUncontrolledComponent({
  onProp1Change,
  prop1Default = PROP1_DEFAULT,
}: {
  onProp1Change?(v: string): void,
  prop1Default?: string,
} = {}) {
  const store = createStore<State>({
    prop1: prop1Default,
  }, {
    prop1: {
      controlledMode: false,
      changeCallback(value: string): void {
        onProp1Change?.(value);
      },
    },
  });

  const selector1 = createSelector(
    (state: State) => ({ ...state, param1: PROP1_PARAM }),
    ({ prop1, param1 }) => `selected1-${param1}-${prop1}`,
  );

  let selected1 = selector1(store.getState());

  store.subscribe((state) => { selected1 = selector1(state); });

  return {
    selected1,
  };
}

describe('uncontrolled component', () => {
  it('provides selected value', () => {
    const uncontrolledComponent = createUncontrolledComponent({
      prop1Default: 'abc',
    });

    expect(uncontrolledComponent.selected1).toBe('selected1-param1-abc');
  });
});
