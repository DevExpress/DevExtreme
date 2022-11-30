export type RadioGroupState<T> = {
  options: Record<symbol, T>;
  selectedOption: {
    id?: symbol;
    value?: T;
  },
};
