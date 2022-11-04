// reactive form types.
type OnChangeCallback<TControlValue> = (value: TControlValue) => void;
type OnTouchCallback = () => void;

export type {
  OnChangeCallback,
  OnTouchCallback,
}
