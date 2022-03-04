/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-type-alias */
import {
  RecursivePropertyType,
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
    g: number | Record<number, boolean>;
  }[];
};

type A = RecursivePropertyType<ComplexType, ['a']>;
type AExpected = { b?: number | { c: boolean } } | { e: string };
const a: Equals<A, AExpected> = true;

type B1 = RecursivePropertyType<ComplexType, ['a', 'b']>;
type B2 = RecursivePropertyType<A, ['b']>;
type BExpected = number | { c: boolean };
const b1: Equals<B1, BExpected> = true;
const b2: Equals<B2, BExpected> = true;

type C = RecursivePropertyType<ComplexType, ['a', 'b', 'c']>;
type CExpected = boolean;
const c: Equals<C, CExpected> = true;

type D = RecursivePropertyType<ComplexType, ['d']>;
type DExpected = boolean | string;
const d: Equals<D, DExpected> = true;

type E1 = RecursivePropertyType<ComplexType, ['a', 'e']>;
type E2 = RecursivePropertyType<RecursivePropertyType<ComplexType, ['a']>, ['e']>;
type EExpected = string;
const e1: Equals<E1, EExpected> = true;
const e2: Equals<E2, EExpected> = true;

type G = RecursivePropertyType<ComplexType, ['f', 'g']>;
type GExpected = number | Record<number, boolean>;
const g: Equals<G, GExpected> = true;
