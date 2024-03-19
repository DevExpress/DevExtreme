/* eslint-disable import/no-duplicates */
/* eslint-disable import/first */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable no-inner-declarations */

import {
  ANY,
  assertType,
  toAssertion,
} from './consts';

import { AllPermutations } from '../../js/core';

{
  const expected0: AllPermutations<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'> = ANY as string;

  type Expected1 = 'a';
  const expected11: AllPermutations<'a'> = ANY as Expected1;
  const expected12: Expected1 = ANY as AllPermutations<'a'>;

  type Expected2 = 'a' | 'b' | 'a b' | 'b a';
  const expected21: AllPermutations<'a' | 'b'> = ANY as Expected2;
  const expected22: Expected2 = ANY as AllPermutations<'a' | 'b'>;

  type Expected3 = 'a' | 'b' | 'c' | 'a b' | 'a c' | 'b a' | 'b c' | 'c a' | 'c b' | 'a b c' | 'a c b' | 'b a c' | 'b c a' | 'c a b' | 'c b a';
  const expected31: AllPermutations<'a' | 'b' | 'c'> = ANY as Expected3;
  const expected32: Expected3 = ANY as AllPermutations<'a' | 'b' | 'c'>;
}

import { Permutations } from '../../js/core';

{
  const expected0: Permutations<'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'> = ANY as string;

  type Expected1 = 'a';
  const expected11: Permutations<'a'> = ANY as Expected1;
  const expected12: Expected1 = ANY as Permutations<'a'>;

  type Expected2 = 'a b' | 'b a';
  const expected21: Permutations<'a' | 'b'> = ANY as Expected2;
  const expected22: Expected2 = ANY as Permutations<'a' | 'b'>;

  type Expected3 = 'a b c' | 'a c b' | 'b a c' | 'b c a' | 'c a b' | 'c b a';
  const expected31: Permutations<'a' | 'b' | 'c'> = ANY as Expected3;
  const expected32: Expected3 = ANY as Permutations<'a' | 'b' | 'c'>;
}

import { Scalar } from '../../js/core';

{
  interface TestInterface { i: any }
  class TestClass { c: any; }
  type TestType = { t: any };
  function testFunction() {}

  const scalar1: String extends Scalar ? true : false = true;
  const scalar2: string extends Scalar ? true : false = true;
  const scalar3: number extends Scalar ? true : false = true;
  const scalar4: Number extends Scalar ? true : false = true;
  const scalar5: bigint extends Scalar ? true : false = true;
  const scalar6: BigInteger extends Scalar ? true : false = true;
  const scalar7: Date extends Scalar ? true : false = true;
  const scalar8: boolean extends Scalar ? true : false = true;
  const scalar9: Boolean extends Scalar ? true : false = true;
  const scalar10: null extends Scalar ? true : false = true;
  const scalar11: undefined extends Scalar ? true : false = true;
  const scalar12: Symbol extends Scalar ? true : false = true;
  const scalar13: [] extends Scalar ? true : false = true;
  const scalar14: (() => {}) extends Scalar ? true : false = true;
  const scalar15: typeof testFunction extends Scalar ? true : false = true;
  const scalar16: Symbol extends Scalar ? true : false = true;

  const nonScalar1: TestInterface extends Scalar ? true : false = false;
  const nonScalar2: TestClass extends Scalar ? true : false = false;
  const nonScalar3: TestType extends Scalar ? true : false = false;
  const nonScalar4: object extends Scalar ? true : false = false;
}

import { PropertyType } from '../../js/core';

{
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
  assertType<PropertyType<ComplexType, 'a'>>(toAssertion(a1));
  assertType<AExpected>(toAssertion(a2));
  assertType<PropertyType<ComplexType, 'a'>>(toAssertion(a2));
  assertType<AExpected>(toAssertion(a3));
  assertType<PropertyType<ComplexType, 'a'>>(toAssertion(a3));
  assertType<AExpected>(toAssertion(a4));
  assertType<PropertyType<ComplexType, 'a'>>(toAssertion(a4));

  const b1: BExpected = 42;
  const b2: BExpected = { c: false };
  assertType<BExpected>(toAssertion(b1));
  assertType<PropertyType<ComplexType, 'a.b'>>(toAssertion(b1));
  assertType<PropertyType<PropertyType<ComplexType, 'a'>, 'b'>>(toAssertion(b1));
  assertType<BExpected>(toAssertion(b2));
  assertType<PropertyType<ComplexType, 'a.b'>>(toAssertion(b2));
  assertType<PropertyType<PropertyType<ComplexType, 'a'>, 'b'>>(toAssertion(b2));

  assertType<boolean>(toAssertion(false));
  assertType<PropertyType<ComplexType, 'a.b.c'>>(toAssertion(false));
  assertType < PropertyType<PropertyType<PropertyType<ComplexType, 'a'>, 'b'>, 'c'>>(toAssertion(false));
  assertType<boolean>(toAssertion(true));
  assertType<PropertyType<ComplexType, 'a.b.c'>>(toAssertion(true));
  assertType < PropertyType<PropertyType<PropertyType<ComplexType, 'a'>, 'b'>, 'c'>>(toAssertion(true));

  assertType<boolean | string>(toAssertion(true));
  assertType<PropertyType<ComplexType, 'd'>>(toAssertion(true));
  assertType<boolean | string>(toAssertion(false));
  assertType<PropertyType<ComplexType, 'd'>>(toAssertion(false));
  assertType<boolean | string>(toAssertion('some string'));
  assertType<PropertyType<ComplexType, 'd'>>(toAssertion('some string'));

  assertType<string>(toAssertion('some string'));
  assertType<PropertyType<ComplexType, 'a.e'>>(toAssertion('some string'));
  assertType<PropertyType<PropertyType<ComplexType, 'a'>, 'e'>>(toAssertion('some string'));

  const f1: FExpected = 'some string';
  const f2: FExpected = [{ g: 42 }];
  const f3: FExpected = [{ g: { 1: false, 2: false, 3: true } }];

  assertType<FExpected>(toAssertion(f1));
  assertType<PropertyType<ComplexType, 'f'>>(toAssertion(f1));
  assertType<FExpected>(toAssertion(f2));
  assertType<PropertyType<ComplexType, 'f'>>(toAssertion(f2));
  assertType<FExpected>(toAssertion(f3));
  assertType<PropertyType<ComplexType, 'f'>>(toAssertion(f3));

  const g1: GExpected = 42;
  const g2: GExpected = { 1: false, 2: false, 3: true };
  assertType<GExpected>(toAssertion(g1));
  assertType<PropertyType<ComplexType, 'f.g'>>(toAssertion(g1));
  assertType<PropertyType<PropertyType<ComplexType, 'f'>, 'g'>>(toAssertion(g1));
  assertType<GExpected>(toAssertion(g2));
  assertType<PropertyType<ComplexType, 'f.g'>>(toAssertion(g2));
  assertType<PropertyType<PropertyType<ComplexType, 'f'>, 'g'>>(toAssertion(g2));
}
