export const PROP1_DEFAULT = 'prop1-default';
export const PROP1_VALID = 'prop1-valid';
export const PROP1_INVALID = 'prop1-invalid';
export const PROP1_PARAM = 'param1';

export type Props = {
  prop1: string;
};

export function validateProp1({ prop1, ...rest }: Props): Props {
  return prop1 === PROP1_INVALID
    ? { prop1: PROP1_VALID, ...rest }
    : { prop1, ...rest };
}
