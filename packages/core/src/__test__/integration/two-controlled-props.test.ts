import { createSelector } from '../../selector';
import { createStore } from '../../store';
import { StateConfigMap } from 'packages/core/lib/index';

describe('two controlled props (pager like scenario)', () => {
  const initialState = {
    pageCount: 10,
    pageIndex: 10,
  };
  beforeEach(() => {
    jest.resetAllMocks();
  });
    type State = typeof initialState;
    function createComponent(stateConfig: StateConfigMap<State>) {
      const store = createStore(initialState, stateConfig);
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
        pageCount: {
          controlledMode: true,
          changeCallback: (newPageCount: number) => {
            store.addUpdate((state) => ({
              ...state,
              pageCount: newPageCount + 2,
            }));
            store.commitPropsUpdates();
          },
        },
        pageIndex: {
          controlledMode: true,
          changeCallback: (newIndex: number) => {
            store.addUpdate((state) => ({
              ...state,
              pageIndex: newIndex + 1,
            }));
            store.commitPropsUpdates();
          },
        },
      });
      expect(store.getState()).toMatchObject(initialState);

      store.addUpdate((state) => ({
        ...state,
        pageCount: 5,
        pageIndex: 5,
      }));
      store.commitUpdates();

      expect(store.getState()).toMatchObject({ pageCount: 7, pageIndex: 6 });
      expect(pageCountVM).toBeCalledTimes(1);
      expect(pageCountVM).toBeCalledWith({ pageCount: 7 });
      expect(pageIndexVM).toBeCalledTimes(2);
      expect(pageIndexVM).toBeCalledWith({ pageIndex: 6 });
    });
    it('pageCount controlled pageIndex uncontrolled', () => {
      const { store, pageCountVM, pageIndexVM } = createComponent({
        pageCount: {
          controlledMode: true,
          changeCallback: (newPageCount: number) => {
            store.addUpdate((state) => ({
              ...state,
              pageCount: newPageCount - 2,
            }));
            // simulate component logic: pageIndex should be less or equal ageCount
            store.addUpdate((state) => ({
              ...state,
              pageIndex: newPageCount - 2,
            }));
            store.commitPropsUpdates();
          },
        },
      });
      expect(store.getState()).toMatchObject(initialState);
      store.addUpdate((state) => ({
        ...state,
        pageCount: 5,
        pageIndex: 5,
      }));
      store.commitUpdates();

      expect(store.getState()).toMatchObject({ pageCount: 3, pageIndex: 3 });
      expect(pageCountVM).toBeCalledTimes(2);
      expect(pageIndexVM).toHaveBeenNthCalledWith(1, { pageIndex: 5 });
      expect(pageCountVM).toHaveBeenNthCalledWith(2, { pageCount: 3 });
      expect(pageIndexVM).toBeCalledTimes(2);
      expect(pageIndexVM).toHaveBeenNthCalledWith(1, { pageIndex: 5 });
      expect(pageIndexVM).toHaveBeenNthCalledWith(2, { pageIndex: 3 });
    });
    it.skip('pageCount controlled pageIndex uncontrolled, wrong PageIndex after change', () => {
      const { store } = createComponent({
        pageCount: {
          controlledMode: true,
          changeCallback: (newPageCount: number) => {
            store.addUpdate((state) => ({
              ...state,
              pageCount: newPageCount - 2,
            }));
            store.commitPropsUpdates();
          },
        },
      });
      expect(store.getState()).toMatchObject(initialState);
      store.addUpdate((state) => ({
        ...state,
        pageCount: 5,
        pageIndex: 5,
      }));
      store.commitUpdates();
      // pageIndex should be always less then pageCount
      expect(store.getState()).toMatchObject({ pageCount: 3, pageIndex: 5 });
    });
});
