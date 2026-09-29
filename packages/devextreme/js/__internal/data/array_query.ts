/* eslint-disable max-classes-per-file */
import { errors, handleError as handleDataError } from '@js/common/data/errors';
import {
  aggregators,
  isConjunctiveOperator as isConjunctiveOperatorChecker,
  isGroupCriterion,
  isUnaryOperation,
  isUniformEqualsByOr,
  normalizeBinaryCriterion,
} from '@js/common/data/utils';
import { compileGetter, toComparable } from '@js/core/utils/data';
import type { DeferredObj } from '@js/core/utils/deferred';
import { Deferred } from '@js/core/utils/deferred';
import { each, map } from '@js/core/utils/iterator';
import { isDefined, isFunction, isString } from '@js/core/utils/type';

export interface LangParams {
  locale?: string;
  collatorOptions?: Intl.CollatorOptions;
}

export interface QueryOptions {
  errorHandler?: (error: unknown) => void;
  langParams?: LangParams;
}

/**
 * A getter expression (`'field.path'`, `['a', 'b']`, a function, …) compiled by
 * `compileGetter()` into a real getter function.
 */
type Getter<T = unknown> = (obj: unknown) => T;

/** A compiled filter criterion. */
type Predicate = (obj: unknown) => boolean;

/** The values `toComparable()` produces for the operands of `<`, `>`, `=`, … */
type ComparableValue = string | number | Date;

type RelationalOperator = (a: ComparableValue, b: ComparableValue) => boolean;

type CompareFn = (xValue: unknown, yValue: unknown) => number;

type AggregatorStep = (accumulator: unknown, item: unknown) => unknown;

type AggregatorFinalize = (accumulator: unknown) => unknown;

interface Aggregator {
  seed?: unknown;
  step: AggregatorStep;
  finalize?: AggregatorFinalize;
}

/**
 * `aggregate(step)` and `aggregate(seed, step, finalize)` are told apart by the
 * argument count (the original code checked `arguments.length < 2`), so the
 * first argument is typed as the step of the short form.
 */
type AggregateArgs = [
  seedOrStep: AggregatorStep,
  ...rest: [] | [step: AggregatorStep, finalize?: AggregatorFinalize],
];

/** A record of the source array paired with its original position. */
interface WrappedRecord {
  index: number;
  value: unknown;
}

/**
 * The holder-interface indirection below makes the parameters of these callback
 * types bivariant (method parameters are, plain function parameters are not).
 * That lets a callback declare the concrete shape it handles while staying
 * assignable to the `unknown`-based type the generic machinery works with.
 */
/* eslint-disable @typescript-eslint/method-signature-style */
interface CallbackHolder {
  map(value: unknown, index: number): unknown;
  compare(x: unknown, y: unknown): number;
  compileCriteria(crit: unknown): Predicate;
}
/* eslint-enable @typescript-eslint/method-signature-style */

type Mapper = CallbackHolder['map'];

type RecordComparer = CallbackHolder['compare'];

type CriteriaCompiler = CallbackHolder['compileCriteria'];

const toGetter = <T = unknown>(expr: unknown): Getter<T> => {
  // @ts-expect-error js/core/utils/data.d.ts types compileGetter as (expr: string) => unknown
  const getter: Getter<T> = compileGetter(expr);
  return getter;
};

const isPredicate = (criteria: unknown): criteria is Predicate => isFunction(criteria);

/**
 * `count()` is implemented only by the iterators whose `countable()` returns a
 * truthy value. Declaring it through declaration merging keeps it visible to
 * the type checker without adding a runtime member to the base class.
 */
/* eslint-disable @typescript-eslint/method-signature-style */
/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
interface Iterator { count(): number }
/* eslint-enable @typescript-eslint/method-signature-style */

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
abstract class Iterator {
  langParams?: LangParams;

  abstract next(): boolean;

  abstract current(): unknown;

  abstract reset(): void;

  toArray(): unknown[] {
    const result: unknown[] = [];

    this.reset();
    while (this.next()) {
      result.push(this.current());
    }

    return result;
  }

  countable(): boolean | Iterator {
    return false;
  }
}

class ArrayIterator extends Iterator {
  array: unknown[];

  index: number;

  constructor(array: unknown[]) {
    super();

    this.array = array;
    this.index = -1;
  }

  next(): boolean {
    if (this.index + 1 < this.array.length) {
      this.index += 1;
      return true;
    }
    return false;
  }

  current(): unknown {
    return this.array[this.index];
  }

  reset(): void {
    this.index = -1;
  }

  toArray(): unknown[] {
    return this.array.slice(0);
  }

  countable(): boolean {
    return true;
  }

  count(): number {
    return this.array.length;
  }
}

class WrappedIterator extends Iterator {
  iter: Iterator;

  constructor(iter: Iterator) {
    super();

    this.iter = iter;
  }

  next(): boolean {
    return this.iter.next();
  }

  current(): unknown {
    return this.iter.current();
  }

  reset(): void {
    this.iter.reset();
  }
}

class MapIterator extends WrappedIterator {
  index: number;

  mapper: Mapper;

  constructor(iter: Iterator, mapper: Mapper) {
    super(iter);

    this.index = -1;
    this.mapper = mapper;
  }

  current(): unknown {
    return this.mapper(super.current(), this.index);
  }

  next(): boolean {
    const hasNext = super.next();
    if (hasNext) {
      this.index += 1;
    }
    return hasNext;
  }
}

type SortValue = string | number | Date | null | undefined;

const defaultCompare = (xValue: unknown, yValue: unknown, options?: LangParams): number => {
  if (isString(xValue) && isString(yValue) && (options?.locale || options?.collatorOptions)) {
    /* eslint-disable-next-line no-undef */
    const collator = new Intl.Collator(
      options?.locale || undefined,
      options?.collatorOptions || undefined,
    );
    return collator.compare(xValue, yValue);
  }

  const x: SortValue = toComparable(xValue, false, options);
  const y: SortValue = toComparable(yValue, false, options);

  // The nesting below keeps the original `null`-before-`undefined` ordering
  // while letting the type checker narrow both operands for `<` and `>`:
  // a pair that is entirely `null` or entirely `undefined` compared to 0 by
  // both relational checks, which is what the flat sequence of `if`s returned.
  if (x === null) {
    return y === null ? 0 : -1;
  }

  if (y === null) {
    return 1;
  }

  if (x === undefined) {
    return y === undefined ? 0 : 1;
  }

  if (y === undefined) {
    return -1;
  }

  if (x < y) {
    return -1;
  }

  if (x > y) {
    return 1;
  }

  return 0;
};

interface SortRule {
  getter: unknown;
  desc?: unknown;
  compare?: CompareFn;
  langParams?: LangParams;
}

interface CompiledSortRule extends SortRule {
  getter: Getter;
}

class SortIterator extends Iterator {
  iter: Iterator;

  rules: SortRule[];

  sortedIter?: MapIterator;

  constructor(iter: Iterator, getter: unknown, desc?: unknown, compare?: CompareFn) {
    super();

    this.langParams = iter.langParams;

    let sourceIter = iter;
    if (!(sourceIter instanceof MapIterator)) {
      sourceIter = new MapIterator(sourceIter, this._wrap);
      sourceIter.langParams = this.langParams;
    }
    this.iter = sourceIter;

    this.rules = [{
      getter, desc, compare, langParams: this.langParams,
    }];
  }

  thenBy(getter: unknown, desc?: unknown, compare?: CompareFn): SortIterator {
    const result = new SortIterator(this.sortedIter || this.iter, getter, desc, compare);
    if (!this.sortedIter) {
      result.rules = this.rules.concat(result.rules);
    }
    return result;
  }

  next(): boolean {
    return this._ensureSorted().next();
  }

  current(): unknown {
    return this._ensureSorted().current();
  }

  reset(): void {
    delete this.sortedIter;
  }

  countable(): boolean | Iterator {
    return this.sortedIter || this.iter.countable();
  }

  count(): number {
    if (this.sortedIter) {
      return this.sortedIter.count();
    }
    return this.iter.count();
  }

  _ensureSorted(): MapIterator {
    const { sortedIter } = this;

    if (sortedIter) {
      return sortedIter;
    }

    const rules: CompiledSortRule[] = this.rules.map((rule) => {
      const getter = toGetter(rule.getter);
      // The compiled getter is cached on the rule itself, as before: rules are
      // shared with the iterators produced by `thenBy()`.
      rule.getter = getter;
      return { ...rule, getter };
    });

    const compareRecords: RecordComparer = (
      x: WrappedRecord,
      y: WrappedRecord,
    ): number => this._compare(x, y, rules);

    const result = new MapIterator(
      new ArrayIterator(this.iter.toArray().sort(compareRecords)),
      this._unwrap,
    );

    this.sortedIter = result;

    return result;
  }

  _wrap(record: unknown, index: number): WrappedRecord {
    return {
      index,
      value: record,
    };
  }

  _unwrap(wrappedItem: WrappedRecord): unknown {
    return wrappedItem.value;
  }

  _getDefaultCompare(langParams?: LangParams): CompareFn {
    return (xValue, yValue) => defaultCompare(xValue, yValue, langParams);
  }

  _compare(x: WrappedRecord, y: WrappedRecord, rules: CompiledSortRule[]): number {
    const xIndex = x.index;
    const yIndex = y.index;
    const xRecord = x.value;
    const yRecord = y.value;

    if (xRecord === yRecord) {
      return xIndex - yIndex;
    }

    for (const rule of rules) {
      const xValue = rule.getter(xRecord);
      const yValue = rule.getter(yRecord);
      const compare = rule.compare || this._getDefaultCompare(rule.langParams);
      const compareResult = compare(xValue, yValue);

      if (compareResult) {
        return rule.desc ? -compareResult : compareResult;
      }
    }

    return xIndex - yIndex;
  }
}

const compileCriteria: (crit: unknown, options?: LangParams) => Predicate = (function () {
  let langParams: LangParams = {};

  const toCriteriaComparable = (value: unknown): ComparableValue => {
    const result: ComparableValue = toComparable(value, false, langParams);
    return result;
  };

  const toCriteriaString = (value: unknown): string => {
    const result: string = toComparable(value, false, langParams);
    return result;
  };

  const useStrictComparison = (value: unknown): boolean => value === '' || value === 0 || value === false;

  const compileEquals = (
    getter: Getter,
    value: ComparableValue,
    negate?: boolean,
  ): Predicate => (obj) => {
    const objValue = toCriteriaComparable(getter(obj));
    // eslint-disable-next-line eqeqeq
    let result = useStrictComparison(value) ? objValue === value : objValue == value;

    if (negate) {
      result = !result;
    }
    return result;
  };

  const compileUniformEqualsCriteria: CriteriaCompiler = (crit: unknown[][]): Predicate => {
    const getter = toGetter(crit[0][0]);
    const filterValues = crit.reduce<ComparableValue[]>((acc, item, i) => {
      if (i % 2 === 0) {
        acc.push(toCriteriaComparable(item[2]));
      }
      return acc;
    }, []);

    return (obj) => {
      const value = toCriteriaComparable(getter(obj));
      return filterValues.some((filterValue) => (useStrictComparison(filterValue)
        ? value === filterValue
        // eslint-disable-next-line eqeqeq
        : value == filterValue));
    };
  };

  const compileGroup: CriteriaCompiler = (crit: unknown[]): Predicate => {
    if (isUniformEqualsByOr(crit)) {
      return compileUniformEqualsCriteria(crit);
    }

    const ops: Predicate[] = [];

    let isConjunctiveOperator = false;
    let isConjunctiveNextOperator = false;

    each(crit, (_: number, item: unknown) => {
      if (Array.isArray(item) || isFunction(item)) {
        if (ops.length > 1 && isConjunctiveOperator !== isConjunctiveNextOperator) {
          throw errors.Error('E4019');
        }
        ops.push(compileCriteria(item, langParams));

        isConjunctiveOperator = isConjunctiveNextOperator;
        isConjunctiveNextOperator = true;
      } else {
        isConjunctiveNextOperator = isConjunctiveOperatorChecker(item);
      }
    });

    // Kept as an allocation-free indexed loop: the predicate runs once per record per
    // criterion and is covered by a filtering performance test (T1217184).
    return (d): boolean => {
      let result = isConjunctiveOperator;

      // eslint-disable-next-line @typescript-eslint/prefer-for-of
      for (let i = 0; i < ops.length; i += 1) {
        if (ops[i](d) !== isConjunctiveOperator) {
          result = !isConjunctiveOperator;
          break;
        }
      }

      return result;
    };
  };

  // `isDefined()` narrows `unknown` down to `{}`, so the type checker only sees
  // the `Object.prototype` members here. The values that reach `stringify()`
  // come from a getter and are primitives or dates, which stringify meaningfully.
  /* eslint-disable @typescript-eslint/no-base-to-string */
  const stringify = (value: unknown): string => {
    if (!isDefined(value)) {
      return '';
    }

    if (langParams.locale) {
      // @ts-expect-error lib.es5.d.ts types Object.prototype.toLocaleString without parameters
      const localized: string = value.toLocaleString(langParams.locale);
      return localized;
    }

    return value.toString();
  };
  /* eslint-enable @typescript-eslint/no-base-to-string */

  const compileBinary: CriteriaCompiler = (criterion: unknown[]): Predicate => {
    // `js/common/data/utils` is untyped JS, so `normalizeBinaryCriterion()` returns
    // an `any[]`; its three slots are re-declared with real types right away.
    const crit = normalizeBinaryCriterion(criterion);
    const getter = toGetter(crit[0]);
    const op: string = crit[1];
    const value = toCriteriaComparable(crit[2]);
    // The same value the relational operators use, kept as a string for the
    // `startswith` / `endswith` / `contains` operators.
    const stringValue = toCriteriaString(crit[2]);

    const compare = (obj: unknown, operatorFn: RelationalOperator): boolean => {
      const objValue = toCriteriaComparable(getter(obj));
      return (value == null || objValue == null) && value !== objValue
        ? false
        : operatorFn(objValue, value);
    };

    // eslint-disable-next-line default-case
    switch (op.toLowerCase()) {
      case '=':
        return compileEquals(getter, value);
      case '<>':
        return compileEquals(getter, value, true);
      case '>':
        return (obj) => compare(obj, (a, b) => a > b);
      case '<':
        return (obj) => compare(obj, (a, b) => a < b);
      case '>=':
        return (obj) => compare(obj, (a, b) => a >= b);
      case '<=':
        return (obj) => compare(obj, (a, b) => a <= b);
      case 'startswith':
        return (obj) => toCriteriaString(stringify(getter(obj))).startsWith(stringValue);
      case 'endswith':
        return (obj) => toCriteriaString(stringify(getter(obj))).endsWith(stringValue);
      case 'contains':
        return (obj) => toCriteriaString(stringify(getter(obj))).includes(stringValue);
      case 'notcontains':
        return (obj) => !toCriteriaString(stringify(getter(obj))).includes(stringValue);
    }

    throw errors.Error('E4003', op);
  };

  const compileUnary: CriteriaCompiler = (crit: unknown[]): Predicate => {
    const op = crit[0];
    const criteria = compileCriteria(crit[1], langParams);

    if (op === '!') {
      return (obj) => !criteria(obj);
    }

    throw errors.Error('E4003', op);
  };

  return (crit: unknown, options?: LangParams): Predicate => {
    langParams = options || {};

    if (isPredicate(crit)) {
      return crit;
    }
    if (isGroupCriterion(crit)) {
      return compileGroup(crit);
    }
    if (isUnaryOperation(crit)) {
      return compileUnary(crit);
    }
    return compileBinary(crit);
  };
}());

class FilterIterator extends WrappedIterator {
  criteria: Predicate;

  constructor(iter: Iterator, criteria: unknown) {
    super(iter);

    this.langParams = iter.langParams;
    this.criteria = compileCriteria(criteria, this.langParams);
  }

  next(): boolean {
    while (this.iter.next()) {
      if (this.criteria(this.current())) {
        return true;
      }
    }
    return false;
  }
}

class GroupIterator extends Iterator {
  iter: Iterator;

  getter: unknown;

  groupedIter?: ArrayIterator;

  constructor(iter: Iterator, getter: unknown) {
    super();

    this.iter = iter;
    this.getter = getter;
  }

  next(): boolean {
    return this._ensureGrouped().next();
  }

  current(): unknown {
    return this._ensureGrouped().current();
  }

  reset(): void {
    delete this.groupedIter;
  }

  countable(): boolean {
    return !!this.groupedIter;
  }

  count(): number {
    return this._ensureGrouped().count();
  }

  _ensureGrouped(): ArrayIterator {
    const { groupedIter } = this;

    if (groupedIter) {
      return groupedIter;
    }

    const hash: Record<PropertyKey, unknown[]> = {};
    const keys: PropertyKey[] = [];
    const { iter } = this;
    const getter = toGetter<PropertyKey>(this.getter);

    iter.reset();
    while (iter.next()) {
      const current = iter.current();
      const key = getter(current);

      if (key in hash) {
        hash[key].push(current);
      } else {
        hash[key] = [current];
        keys.push(key);
      }
    }

    const groups: unknown[] = map(
      keys,
      (key: PropertyKey) => ({ key, items: hash[key] }),
    );
    const result = new ArrayIterator(groups);

    this.groupedIter = result;

    return result;
  }
}

class SelectIterator extends WrappedIterator {
  getter: Getter;

  constructor(iter: Iterator, getter: unknown) {
    super(iter);

    this.getter = toGetter(getter);
  }

  current(): unknown {
    return this.getter(super.current());
  }

  countable(): boolean | Iterator {
    return this.iter.countable();
  }

  count(): number {
    return this.iter.count();
  }
}

class SliceIterator extends WrappedIterator {
  skip: number;

  take: number;

  pos: number;

  constructor(iter: Iterator, skip: number, take: number) {
    super(iter);

    this.skip = Math.max(0, skip);
    this.take = Math.max(0, take);
    this.pos = 0;
  }

  next(): boolean {
    if (this.pos >= this.skip + this.take) {
      return false;
    }

    while (this.pos < this.skip && this.iter.next()) {
      this.pos += 1;
    }

    this.pos += 1;
    return this.iter.next();
  }

  reset(): void {
    super.reset();
    this.pos = 0;
  }

  countable(): boolean | Iterator {
    return this.iter.countable();
  }

  count(): number {
    return Math.min(this.iter.count() - this.skip, this.take);
  }
}

export interface ArrayQuery {
  toArray: () => unknown[];
  enumerate: () => DeferredObj<unknown>;
  setLangParams: (langParams: LangParams) => void;
  sortBy: (getter: unknown, desc?: unknown, compare?: CompareFn) => ArrayQuery;
  thenBy: (getter: unknown, desc?: unknown, compare?: CompareFn) => ArrayQuery;
  filter: (...criteria: unknown[]) => ArrayQuery;
  slice: (skip: number, take?: number) => ArrayQuery;
  select: (...getters: unknown[]) => ArrayQuery;
  groupBy: (getter: unknown) => ArrayQuery;
  aggregate: (...args: AggregateArgs) => DeferredObj<unknown>;
  count: () => DeferredObj<unknown>;
  sum: (getter?: unknown) => DeferredObj<unknown>;
  min: (getter?: unknown) => DeferredObj<unknown>;
  max: (getter?: unknown) => DeferredObj<unknown>;
  avg: (getter?: unknown) => DeferredObj<unknown>;
}

const arrayQueryImpl = function (
  source: Iterator | unknown[],
  options?: QueryOptions,
): ArrayQuery {
  const queryOptions: QueryOptions = options || {};

  const iter: Iterator = source instanceof Iterator ? source : new ArrayIterator(source);

  if (queryOptions.langParams) {
    iter.langParams = queryOptions.langParams;
  }

  const handleError = (error: unknown): void => {
    const handler = queryOptions.errorHandler;
    if (handler) {
      handler(error);
    }

    handleDataError(error);
  };

  const chainQuery = (chainedIter: Iterator): ArrayQuery => arrayQueryImpl(
    chainedIter,
    queryOptions,
  );

  const aggregateCore = (aggregator: Aggregator): DeferredObj<unknown> => {
    const d = Deferred<unknown>().fail(handleError);
    const { step, finalize } = aggregator;

    try {
      iter.reset();

      let accumulator: unknown = NaN;
      if ('seed' in aggregator) {
        accumulator = aggregator.seed;
      } else if (iter.next()) {
        accumulator = iter.current();
      }

      while (iter.next()) {
        accumulator = step(accumulator, iter.current());
      }
      d.resolve(finalize ? finalize(accumulator) : accumulator);
    } catch (x) {
      d.reject(x);
    }

    // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
    return d.promise();
  };

  const aggregate = (...args: AggregateArgs): DeferredObj<unknown> => {
    const [seedOrStep, ...rest] = args;

    // The original `arguments.length < 2` check.
    if (rest.length === 0) {
      return aggregateCore({ step: seedOrStep });
    }

    const [step, finalize] = rest;
    return aggregateCore({
      seed: seedOrStep,
      step,
      finalize,
    });
  };

  const standardAggregate = (name: string): DeferredObj<unknown> => {
    const aggregator: Aggregator = aggregators[name];
    return aggregateCore(aggregator);
  };

  const select = (...getters: unknown[]): ArrayQuery => {
    const [first] = getters;
    const getter = isFunction(first) || Array.isArray(first) ? first : getters;

    return chainQuery(new SelectIterator(iter, getter));
  };

  const selectProp = (name: unknown): ArrayQuery => select(toGetter(name));

  return {
    toArray(): unknown[] {
      return iter.toArray();
    },

    enumerate(): DeferredObj<unknown> {
      const d = Deferred<unknown>().fail(handleError);

      try {
        d.resolve(iter.toArray());
      } catch (x) {
        d.reject(x);
      }

      // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
      return d.promise();
    },

    setLangParams(langParams: LangParams): void {
      iter.langParams = langParams;
    },

    sortBy(getter: unknown, desc?: unknown, compare?: CompareFn): ArrayQuery {
      return chainQuery(new SortIterator(iter, getter, desc, compare));
    },

    thenBy(getter: unknown, desc?: unknown, compare?: CompareFn): ArrayQuery {
      if (iter instanceof SortIterator) {
        return chainQuery(iter.thenBy(getter, desc, compare));
      }

      throw errors.Error('E4004');
    },

    filter(...criteria: unknown[]): ArrayQuery {
      const [first] = criteria;

      return chainQuery(new FilterIterator(iter, Array.isArray(first) ? first : criteria));
    },

    slice(skip: number, take?: number): ArrayQuery {
      return chainQuery(
        new SliceIterator(iter, skip, take === undefined ? Number.MAX_VALUE : take),
      );
    },

    select,

    groupBy(getter: unknown): ArrayQuery {
      return chainQuery(new GroupIterator(iter, getter));
    },

    aggregate,

    count(): DeferredObj<unknown> {
      if (iter.countable()) {
        const d = Deferred<unknown>().fail(handleError);

        try {
          d.resolve(iter.count());
        } catch (x) {
          d.reject(x);
        }

        // @ts-expect-error DeferredObj typings: promise() is declared as a plain Promise
        return d.promise();
      }

      return standardAggregate('count');
    },

    sum(getter?: unknown): DeferredObj<unknown> {
      if (getter) {
        return selectProp(getter).sum();
      }
      return standardAggregate('sum');
    },

    min(getter?: unknown): DeferredObj<unknown> {
      if (getter) {
        return selectProp(getter).min();
      }
      return standardAggregate('min');
    },

    max(getter?: unknown): DeferredObj<unknown> {
      if (getter) {
        return selectProp(getter).max();
      }
      return standardAggregate('max');
    },

    avg(getter?: unknown): DeferredObj<unknown> {
      if (getter) {
        return selectProp(getter).avg();
      }
      return standardAggregate('avg');
    },

  };
};

export default arrayQueryImpl;
