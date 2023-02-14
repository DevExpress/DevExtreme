import { createSelector } from '../../selector';
import { createStore } from '../../store';

describe('two controlled props (pager like scenario)', () => {
  const initialState = {
    pageCount: 10,
    pageIndex: 10,
  };
  type State = typeof initialState;
  function createComponent(callbacks: {
    pageCount: (val: number) => number,
    pageIndex?: (val: number) => number
  }) {
    const store = createStore(initialState,
      Object.entries(callbacks)
        .reduce((stateConfig, [name, callback]) => {
          stateConfig[name] = {
            controlledMode: true,
            changeCallback: (newVal: number) => {
              const userPatchedVal = callback(newVal);
              store.addUpdate((state) => ({
                ...state,
                [name]: userPatchedVal,
              }));
              // Simulate component logic: pageIndex should be always less then pageCount
              if (!callbacks.pageIndex) {
                store.addUpdate((state) => ({
                  ...state,
                  pageIndex: Math.min(state.pageIndex, userPatchedVal),
                }));
              }
              store.commitPropsUpdates();
            },
          };
          return stateConfig;
        }, {} as { [name:string]: unknown }));
    const pageCountVM = jest.fn(({ pageCount }) => `view-${pageCount}`);
    const pageCountSelector = createSelector(
      ({ pageCount }: State) => ({ pageCount }),
      pageCountVM,
    );
    const pageIndexVM = jest.fn(({ pageIndex }) => `view-${pageIndex}`);
    const pageIndexSelector = createSelector(
      ({ pageIndex }: State) => ({ pageIndex }),
      pageIndexVM,
    );
    store.subscribe((state) => pageCountSelector(state));
    store.subscribe((state) => pageIndexSelector(state));
    return {
      store,
      pageCountVM,
      pageIndexVM,
    };
  }

  it('pageCount and pageIndex controlled', () => {
    const { store, pageCountVM, pageIndexVM } = createComponent({
      pageCount: (newPageCount: number) => (newPageCount + 2),
      pageIndex: (newIndex: number) => (newIndex + 1),
    });

    store.addUpdate((state) => ({
      ...state,
      pageCount: 5,
      pageIndex: 5,
    }));
    store.commitUpdates();

    expect(store.getState()).toMatchObject({ pageCount: 7, pageIndex: 6 });
    expect(pageCountVM(store.getState())).toBe('view-7');
    expect(pageIndexVM(store.getState())).toBe('view-6');
  });

  it('pageCount controlled pageIndex uncontrolled', () => {
    const { store, pageCountVM, pageIndexVM } = createComponent({
      pageCount: (newPageCount: number) => (newPageCount - 2),
    });

    store.addUpdate((state) => ({
      ...state,
      pageCount: 5,
      pageIndex: 5,
    }));
    store.commitUpdates();

    expect(store.getState()).toMatchObject({ pageCount: 3, pageIndex: 3 });
    expect(pageCountVM(store.getState())).toBe('view-3');
    expect(pageIndexVM(store.getState())).toBe('view-3');
  });

  it.skip('pageCount controlled pageIndex uncontrolled, wrong PageIndex after change', () => {
    const { store } = createComponent({
      pageCount: (newPageCount: number) => (newPageCount - 2),
    });
    store.addUpdate((state) => ({
      ...state,
      pageCount: 5,
      pageIndex: 5,
    }));
    store.commitUpdates();
    // pageIndex should be always less then pageCount
    expect(store.getState()).toMatchObject({ pageCount: 3, pageIndex: 3 });
  });
});
