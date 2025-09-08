export interface CounterProps {
  count: number;
  onClick?: (e: unknown) => void;
  increment?: () => void;
  decrement?: () => void;
  setValue?: () => void;
  reset?: () => void;
  step: number;
  incrementStep?: () => void;
  resetStep?: () => void;
}

export interface CounterState {
  count: number;
}

export interface CounterStepState {
  step: number;
}
