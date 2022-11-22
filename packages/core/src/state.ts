import {
  createObservableEmitter,
  Emitter,
  ObjectType,
  ThinObservable,
} from './utils';

export interface StateValue<TModel, TDictionary> {
  model: TModel;
  dictionary: TDictionary;
}

export interface State<TModel, TDictionary> extends
  Emitter<StateValue<TModel, TDictionary>>,
  ThinObservable<StateValue<TModel, TDictionary>> {
  getCurrent: () => StateValue<TModel, TDictionary>;
  addUpdateChunk: (statePart: Partial<StateValue<Partial<TModel>, Partial<TDictionary>>>) => void;
  commitUpdates: () => void;
  rollbackUpdates: () => void;
}

export function createState<TModel extends ObjectType, TDictionary extends ObjectType>(
  initialState: StateValue<TModel, TDictionary>,
): State<TModel, TDictionary> {
  let current = initialState;
  let next = initialState;

  const { emit, subscribe } = createObservableEmitter<StateValue<TModel, TDictionary>>(
    initialState,
  );

  const getCurrent = () => current;

  const addUpdate = (
    statePart: Partial<StateValue<Partial<TModel>, Partial<TDictionary>>>,
  ): void => {
    next = {
      model: {
        ...next.model,
        ...statePart.model,
      },
      dictionary: {
        ...next.dictionary,
        ...statePart.dictionary,
      },
    };
  };

  const commitUpdates = () => {
    current = next;
  };

  const rollbackUpdates = () => {
    next = current;
  };

  return {
    emit,
    subscribe,
    getCurrent,
    addUpdateChunk: addUpdate,
    commitUpdates,
    rollbackUpdates,
  };
}
