import { Action } from '../store/index';

export interface ComponentCore<TActions extends string, TViewModels> {
    destroy: () => void;
    dispatch: (action: Action<TActions>) => void;
    viewModels: TViewModels;
}
