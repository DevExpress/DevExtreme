/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-type-alias */
import {
  PropertyType,
  DeepPropertyType,
  Equals,
} from './type_helpers';

type ComplexType = {
  a: {
    b?: number | {
      c: boolean;
    };
  } | { e: string };
}
| string
| {
  d: boolean | string;
  f: string | {
    g: number | boolean | string;
  }[];
};

type AActual1 = PropertyType<ComplexType, 'a'>;
type AActual2 = DeepPropertyType<ComplexType, ['a']>;
type AExpected = { b?: number | { c: boolean } } | { e: string };
const a1: Equals<AActual1, AExpected> = true;
const a2: Equals<AActual2, AExpected> = true;

type BActual1 = PropertyType<PropertyType<ComplexType, 'a'>, 'b'>;
type BActual2 = DeepPropertyType<ComplexType, ['a', 'b']>;
type BActual3 = DeepPropertyType<AActual2, ['b']>;
type BExpected = number | { c: boolean };
const b1: Equals<BActual1, BExpected> = true;
const b2: Equals<BActual2, BExpected> = true;
const b3: Equals<BActual3, BExpected> = true;

type CActual1 = PropertyType<PropertyType<PropertyType<ComplexType, 'a'>, 'b'>, 'c'>;
type CActual2 = DeepPropertyType<ComplexType, ['a', 'b', 'c']>;
type CExpected = boolean;
const c1: Equals<CActual1, CExpected> = true;
const c2: Equals<CActual2, CExpected> = true;

type DActual1 = PropertyType<ComplexType, 'd'>;
type DActual2 = DeepPropertyType<ComplexType, ['d']>;
type DExpected = boolean | string;
const d1: Equals<DActual1, DExpected> = true;
const d2: Equals<DActual2, DExpected> = true;

type EActual1 = PropertyType<PropertyType<ComplexType, 'a'>, 'e'>;
type EActual2 = DeepPropertyType<ComplexType, ['a', 'e']>;
type EActual3 = DeepPropertyType<DeepPropertyType<ComplexType, ['a']>, ['e']>;
type EExpected = string;
const e1: Equals<EActual1, EExpected> = true;
const e2: Equals<EActual2, EExpected> = true;
const e3: Equals<EActual3, EExpected> = true;

type G1 = PropertyType<PropertyType<ComplexType, 'f'>, 'g'>;
type G2 = DeepPropertyType<ComplexType, ['f', 'g']>;
