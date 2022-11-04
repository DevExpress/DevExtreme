import {distinctUntilChanged, Observable, startWith, Subscriber} from 'rxjs';
import {DeepReadonly} from 'ts-essentials';
import {Selector} from '@devexpress/core/src/internal';


interface HookStoreInterface<TState> {
  getState: () => DeepReadonly<TState>;
  subscribe: (func: (state: DeepReadonly<TState>) => void) => () => void;
}

function useSelector<TState, TResult>(
  store: HookStoreInterface<TState>,
  selector: Selector<TState, TResult>,
): Observable<DeepReadonly<TResult>> {
  return new Observable<DeepReadonly<TResult>>((subscriber: Subscriber<DeepReadonly<TResult>>) => {
    store.subscribe((state) => {
      const result = selector(state);
      subscriber.next(result);
    });
  }).pipe(
    distinctUntilChanged(),
    startWith(selector(store.getState()))
  );
}

export {useSelector};
