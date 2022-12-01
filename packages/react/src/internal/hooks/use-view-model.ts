import { ViewModel } from '@devexpress/core';
import { useEffect, useState } from 'react';

const useViewModel = <TViewModel, TReactViewModel extends TViewModel = TViewModel>(
  viewModel: ViewModel<TViewModel>,
): TReactViewModel => {
  const [state, setState] = useState({ value: viewModel.getValue() });
  useEffect(() => {
    const unsubscribe = viewModel.subscribe((viewModelValue) => {
      setState({ value: viewModelValue });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return state.value as TReactViewModel;
};

export { useViewModel };
