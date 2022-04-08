/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-type-alias */
import {
  RecursivePropertyType,
} from '.';

import {
  assertType,
  toAssertion,
} from '../../testing/typescript/consts';

type ComplexType = {
  a: {
    b?: number | {
      c: boolean;
    };
    x: number;
  } | { e: string };
}
| string
| {
  d: boolean | string;
  f: string | {
    g: number | Record<number, boolean>;
  }[];
};

type AExpected = {
  b?: BExpected;
  x: number;
} | { e: string };
type BExpected = number | { c: boolean };
type FExpected = string | { g: GExpected }[];
type GExpected = number | Record<number, boolean>;

const a1: AExpected = {
  e: 'e',
};
const a2: AExpected = {
  x: 42,
};
const a3: AExpected = {
  x: 42,
  b: 1,
};
const a4: AExpected = {
  x: 42,
  b: {
    c: false,
  },
};

assertType<AExpected>(toAssertion(a1));
assertType<RecursivePropertyType<ComplexType, 'a'>>(toAssertion(a1));
assertType<AExpected>(toAssertion(a2));
assertType<RecursivePropertyType<ComplexType, 'a'>>(toAssertion(a2));
assertType<AExpected>(toAssertion(a3));
assertType<RecursivePropertyType<ComplexType, 'a'>>(toAssertion(a3));
assertType<AExpected>(toAssertion(a4));
assertType<RecursivePropertyType<ComplexType, 'a'>>(toAssertion(a4));

const b1: BExpected = 42;
const b2: BExpected = { c: false };
assertType<BExpected>(toAssertion(b1));
assertType<RecursivePropertyType<ComplexType, 'a.b'>>(toAssertion(b1));
assertType<RecursivePropertyType<RecursivePropertyType<ComplexType, 'a'>, 'b'>>(toAssertion(b1));
assertType<BExpected>(toAssertion(b2));
assertType<RecursivePropertyType<ComplexType, 'a.b'>>(toAssertion(b2));
assertType<RecursivePropertyType<RecursivePropertyType<ComplexType, 'a'>, 'b'>>(toAssertion(b2));

assertType<boolean>(toAssertion(false));
assertType<RecursivePropertyType<ComplexType, 'a.b.c'>>(toAssertion(false));
assertType < RecursivePropertyType<RecursivePropertyType<RecursivePropertyType<ComplexType, 'a'>, 'b'>, 'c'>>(toAssertion(false));
assertType<boolean>(toAssertion(true));
assertType<RecursivePropertyType<ComplexType, 'a.b.c'>>(toAssertion(true));
assertType < RecursivePropertyType<RecursivePropertyType<RecursivePropertyType<ComplexType, 'a'>, 'b'>, 'c'>>(toAssertion(true));

assertType<boolean | string>(toAssertion(true));
assertType<RecursivePropertyType<ComplexType, 'd'>>(toAssertion(true));
assertType<boolean | string>(toAssertion(false));
assertType<RecursivePropertyType<ComplexType, 'd'>>(toAssertion(false));
assertType<boolean | string>(toAssertion('some string'));
assertType<RecursivePropertyType<ComplexType, 'd'>>(toAssertion('some string'));

assertType<string>(toAssertion('some string'));
assertType<RecursivePropertyType<ComplexType, 'a.e'>>(toAssertion('some string'));
assertType<RecursivePropertyType<RecursivePropertyType<ComplexType, 'a'>, 'e'>>(toAssertion('some string'));

const f1: FExpected = 'some string';
const f2: FExpected = [{ g: 42 }];
const f3: FExpected = [{ g: { 1: false, 2: false, 3: true } }];

assertType<FExpected>(toAssertion(f1));
assertType<RecursivePropertyType<ComplexType, 'f'>>(toAssertion(f1));
assertType<FExpected>(toAssertion(f2));
assertType<RecursivePropertyType<ComplexType, 'f'>>(toAssertion(f2));
assertType<FExpected>(toAssertion(f3));
assertType<RecursivePropertyType<ComplexType, 'f'>>(toAssertion(f3));

const g1: GExpected = 42;
const g2: GExpected = { 1: false, 2: false, 3: true };
assertType<GExpected>(toAssertion(g1));
assertType<RecursivePropertyType<ComplexType, 'f.g'>>(toAssertion(g1));
assertType<RecursivePropertyType<RecursivePropertyType<ComplexType, 'f'>, 'g'>>(toAssertion(g1));
assertType<GExpected>(toAssertion(g2));
assertType<RecursivePropertyType<ComplexType, 'f.g'>>(toAssertion(g2));
assertType<RecursivePropertyType<RecursivePropertyType<ComplexType, 'f'>, 'g'>>(toAssertion(g2));
