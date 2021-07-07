export function getOptionValue(
  option:
  number |
  string |
  boolean |
  null |
  undefined |
  (() => number | string | boolean | null | undefined),
):
  number | string | boolean | null | undefined {
  return typeof option === 'function' ? option() : option;
}
