import { errors, handleError as handleDataError } from '@js/common/data/errors';
import {
  aggregators,
  isConjunctiveOperator as isConjunctiveOperatorChecker,
  isGroupCriterion,
  isUnaryOperation,
  isUniformEqualsByOr,
  normalizeBinaryCriterion,
} from '@js/common/data/utils';
import Class from '@js/core/class';
import { compileGetter, toComparable } from '@js/core/utils/data';
import { Deferred } from '@js/core/utils/deferred';
import { each, map } from '@js/core/utils/iterator';
import { isDefined, isFunction, isString } from '@js/core/utils/type';

const Iterator = Class.inherit({

  toArray() {
    const result = [];

    this.reset();
    while (this.next()) {
      // @ts-expect-error
      result.push(this.current());
    }

    return result;
  },

  countable() {
    return false;
  },
});

const ArrayIterator = Iterator.inherit({

  ctor(array) {
    this.array = array;
    this.index = -1;
  },

  next() {
    if (this.index + 1 < this.array.length) {
      this.index++;
      return true;
    }
    return false;
  },

  current() {
    return this.array[this.index];
  },

  reset() {
    this.index = -1;
  },

  toArray() {
    return this.array.slice(0);
  },

  countable() {
    return true;
  },

  count() {
    return this.array.length;
  },

});

const WrappedIterator = Iterator.inherit({
  ctor(iter) {
    this.iter = iter;
  },

  next() { return this.iter.next(); },
  current() { return this.iter.current(); },
  reset() { return this.iter.reset(); },
});

const MapIterator = WrappedIterator.inherit({
  ctor(iter, mapper) {
    this.callBase(iter);
    this.index = -1;
    this.mapper = mapper;
  },

  current() {
    return this.mapper(this.callBase(), this.index);
  },

  next() {
    const hasNext = this.callBase();
    if (hasNext) {
      this.index++;
    }
    return hasNext;
  },
});

const defaultCompare = function (xValue, yValue, options) {
  if (isString(xValue) && isString(yValue) && (options?.locale || options?.collatorOptions)) {
    /* eslint-disable-next-line no-undef */
    return new Intl.Collator(options?.locale || undefined, options?.collatorOptions || undefined).compare(xValue, yValue);
  }

  xValue = toComparable(xValue, false, options);
  yValue = toComparable(yValue, false, options);

  if (xValue === null && yValue !== null) {
    return -1;
  }

  if (xValue !== null && yValue === null) {
    return 1;
  }

  if (xValue === undefined && yValue !== undefined) {
    return 1;
  }

  if (xValue !== undefined && yValue === undefined) {
    return -1;
  }

  if (xValue < yValue) {
    return -1;
  }

  if (xValue > yValue) {
    return 1;
  }

  return 0;
};

const SortIterator = Iterator.inherit({
  ctor(iter, getter, desc, compare) {
    this.langParams = iter.langParams;

    if (!(iter instanceof MapIterator)) {
      iter = new MapIterator(iter, this._wrap);
      iter.langParams = this.langParams;
    }
    this.iter = iter;

    this.rules = [{
      getter, desc, compare, langParams: this.langParams,
    }];
  },

  thenBy(getter, desc, compare) {
    const result = new SortIterator(this.sortedIter || this.iter, getter, desc, compare);
    if (!this.sortedIter) {
      result.rules = this.rules.concat(result.rules);
    }
    return result;
  },

  next() {
    this._ensureSorted();
    return this.sortedIter.next();
  },

  current() {
    this._ensureSorted();
    return this.sortedIter.current();
  },

  reset() {
    delete this.sortedIter;
  },

  countable() {
    return this.sortedIter || this.iter.countable();
  },

  count() {
    if (this.sortedIter) {
      return this.sortedIter.count();
    }
    return this.iter.count();
  },
  _ensureSorted() {
    const that = this;

    if (that.sortedIter) {
      return;
    }

    each(that.rules, function () {
      this.getter = compileGetter(this.getter);
    });

    that.sortedIter = new MapIterator(
      new ArrayIterator(this.iter.toArray().sort((x, y) => that._compare(x, y))),
      that._unwrap,
    );
  },
  _wrap(record, index) {
    return {
      index,
      value: record,
    };
  },
  _unwrap(wrappedItem) {
    return wrappedItem.value;
  },
  _getDefaultCompare(langParams) {
    return (xValue, yValue) => defaultCompare(xValue, yValue, langParams);
  },
  _compare(x, y) {
    const xIndex = x.index;
    const yIndex = y.index;

    x = x.value;
    y = y.value;

    if (x === y) {
      return xIndex - yIndex;
    }

    for (let i = 0, rulesCount = this.rules.length; i < rulesCount; i++) {
      const rule = this.rules[i];
      const xValue = rule.getter(x);
      const yValue = rule.getter(y);
      const compare = rule.compare || this._getDefaultCompare(rule.langParams);
      const compareResult = compare(xValue, yValue);

      if (compareResult) {
        return rule.desc ? -compareResult : compareResult;
      }
    }

    return xIndex - yIndex;
  },
});

const compileCriteria = (function () {
  let langParams: Record<string, any> = {};

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const _toComparable = (value) => toComparable(value, false, langParams);

  const compileUniformEqualsCriteria = (crit) => {
    const getter = compileGetter(crit[0][0]);
    const filterValues = crit.reduce((acc, item, i) => {
      if (i % 2 === 0) {
        acc.push(_toComparable(item[2]));
      }
      return acc;
    }, []);

    return (obj) => {
      // @ts-expect-error
      const value = _toComparable(getter(obj));
      return filterValues.some((filterValue) => (useStrictComparison(filterValue)
        ? value === filterValue
        // eslint-disable-next-line eqeqeq
        : value == filterValue));
    };
  };
  const compileGroup = function (crit) {
    if (isUniformEqualsByOr(crit)) {
      return compileUniformEqualsCriteria(crit);
    }

    const ops = [];

    let isConjunctiveOperator = false;
    let isConjunctiveNextOperator = false;

    each(crit, function () {
      if (Array.isArray(this) || isFunction(this)) {
        if (ops.length > 1 && isConjunctiveOperator !== isConjunctiveNextOperator) {
          throw errors.Error('E4019');
        }
        // @ts-expect-error
        ops.push(compileCriteria(this, langParams));

        isConjunctiveOperator = isConjunctiveNextOperator;
        isConjunctiveNextOperator = true;
      } else {
        isConjunctiveNextOperator = isConjunctiveOperatorChecker(this);
      }
    });

    return function (d) {
      let result = isConjunctiveOperator;

      for (let i = 0; i < ops.length; i++) {
        // @ts-expect-error
        if (ops[i](d) !== isConjunctiveOperator) {
          result = !isConjunctiveOperator;
          break;
        }
      }
      return result;
    };
  };

  const toString = function (value) {
    return isDefined(value)
      ? langParams?.locale ? value.toLocaleString(langParams.locale) : value.toString()
      : '';
  };

  const compileBinary = function (crit) {
    crit = normalizeBinaryCriterion(crit);
    const getter = compileGetter(crit[0]);
    const op = crit[1];
    let value = crit[2];

    value = _toComparable(value);

    const compare = (obj, operatorFn) => {
      // @ts-expect-error
      obj = _toComparable(getter(obj));
      return (value == null || obj == null) && value !== obj ? false : operatorFn(obj, value);
    };
    // eslint-disable-next-line default-case
    switch (op.toLowerCase()) {
      case '=':
        // @ts-expect-error
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
        // @ts-expect-error
        return (obj) => _toComparable(toString(getter(obj))).startsWith(value);
      case 'endswith':
        // @ts-expect-error
        return (obj) => _toComparable(toString(getter(obj))).endsWith(value);
      case 'contains':
        // @ts-expect-error
        return (obj) => _toComparable(toString(getter(obj))).includes(value);
      case 'notcontains':
        // @ts-expect-error
        return (obj) => !_toComparable(toString(getter(obj))).includes(value);
    }

    throw errors.Error('E4003', op);
  };

  function compileEquals(getter, value, negate) {
    return function (obj) {
      obj = _toComparable(getter(obj));
      // eslint-disable-next-line eqeqeq
      let result = useStrictComparison(value) ? obj === value : obj == value;

      if (negate) {
        result = !result;
      }
      return result;
    };
  }

  function useStrictComparison(value) {
    return value === '' || value === 0 || value === false;
  }

  function compileUnary(crit) {
    const op = crit[0];
    const criteria = compileCriteria(crit[1], langParams);

    if (op === '!') {
      return function (obj) { return !criteria(obj); };
    }

    throw errors.Error('E4003', op);
  }

  return function (crit, options) {
    langParams = options || {};

    if (isFunction(crit)) {
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

const FilterIterator = WrappedIterator.inherit({

  ctor(iter, criteria) {
    this.callBase(iter);
    this.langParams = iter.langParams;
    this.criteria = compileCriteria(criteria, this.langParams);
  },

  next() {
    while (this.iter.next()) {
      if (this.criteria(this.current())) {
        return true;
      }
    }
    return false;
  },
});

const GroupIterator = Iterator.inherit({
  ctor(iter, getter) {
    this.iter = iter;
    this.getter = getter;
  },

  next() {
    this._ensureGrouped();
    return this.groupedIter.next();
  },

  current() {
    this._ensureGrouped();
    return this.groupedIter.current();
  },

  reset() {
    delete this.groupedIter;
  },

  countable() {
    return !!this.groupedIter;
  },

  count() {
    return this.groupedIter.count();
  },

  _ensureGrouped() {
    if (this.groupedIter) {
      return;
    }

    const hash = {};
    const keys = [];
    const { iter } = this;
    const getter = compileGetter(this.getter);

    iter.reset();
    while (iter.next()) {
      const current = iter.current();
      // @ts-expect-error
      const key = getter(current);

      if (key in hash) {
        hash[key].push(current);
      } else {
        hash[key] = [current];
        // @ts-expect-error
        keys.push(key);
      }
    }

    this.groupedIter = new ArrayIterator(
      map(
        keys,
        (key) => ({ key, items: hash[key] }),
      ),
    );
  },

});

const SelectIterator = WrappedIterator.inherit({

  ctor(iter, getter) {
    this.callBase(iter);
    this.getter = compileGetter(getter);
  },

  current() {
    return this.getter(this.callBase());
  },

  countable() {
    return this.iter.countable();
  },

  count() {
    return this.iter.count();
  },

});

const SliceIterator = WrappedIterator.inherit({
  ctor(iter, skip, take) {
    this.callBase(iter);
    this.skip = Math.max(0, skip);
    this.take = Math.max(0, take);
    this.pos = 0;
  },

  next() {
    if (this.pos >= this.skip + this.take) {
      return false;
    }

    while (this.pos < this.skip && this.iter.next()) {
      this.pos++;
    }

    this.pos++;
    return this.iter.next();
  },

  reset() {
    this.callBase();
    this.pos = 0;
  },

  countable() {
    return this.iter.countable();
  },

  count() {
    return Math.min(this.iter.count() - this.skip, this.take);
  },

});

const arrayQueryImpl = function (iter, queryOptions) {
  queryOptions = queryOptions || {};

  if (!(iter instanceof Iterator)) {
    iter = new ArrayIterator(iter);
  }

  if (queryOptions.langParams) {
    iter.langParams = queryOptions.langParams;
  }

  const handleError = function (error) {
    const handler = queryOptions.errorHandler;
    if (handler) {
      handler(error);
    }

    handleDataError(error);
  };

  const aggregateCore = function (aggregator) {
    // @ts-expect-error
    const d = new Deferred().fail(handleError);
    let seed;
    const { step } = aggregator;
    const { finalize } = aggregator;

    try {
      iter.reset();
      if ('seed' in aggregator) {
        seed = aggregator.seed;
      } else {
        seed = iter.next() ? iter.current() : NaN;
      }

      let accumulator = seed;
      while (iter.next()) {
        accumulator = step(accumulator, iter.current());
      }
      d.resolve(finalize ? finalize(accumulator) : accumulator);
    } catch (x) {
      d.reject(x);
    }

    return d.promise();
  };

  const aggregate = function (seed, step, finalize) {
    if (arguments.length < 2) {
      return aggregateCore({ step: arguments[0] });
    }
    return aggregateCore({
      seed,
      step,
      finalize,
    });
  };

  const standardAggregate = function (name) {
    return aggregateCore(aggregators[name]);
  };

  const select = function (getter) {
    if (!isFunction(getter) && !Array.isArray(getter)) {
      getter = [].slice.call(arguments);
    }

    return chainQuery(new SelectIterator(iter, getter));
  };

  const selectProp = function (name) {
    return select(compileGetter(name));
  };

  function chainQuery(iter) {
    return arrayQueryImpl(iter, queryOptions);
  }

  return {
    toArray() {
      return iter.toArray();
    },

    enumerate() {
      // @ts-expect-error
      const d = new Deferred().fail(handleError);

      try {
        d.resolve(iter.toArray());
      } catch (x) {
        d.reject(x);
      }

      return d.promise();
    },

    setLangParams(options) {
      iter.langParams = options;
    },

    sortBy(getter, desc, compare) {
      return chainQuery(new SortIterator(iter, getter, desc, compare));
    },

    thenBy(getter, desc, compare) {
      if (iter instanceof SortIterator) {
        return chainQuery(iter.thenBy(getter, desc, compare));
      }

      throw errors.Error('E4004');
    },

    filter(criteria) {
      if (!Array.isArray(criteria)) {
        criteria = [].slice.call(arguments);
      }
      return chainQuery(new FilterIterator(iter, criteria));
    },

    slice(skip, take) {
      if (take === undefined) {
        take = Number.MAX_VALUE;
      }
      return chainQuery(new SliceIterator(iter, skip, take));
    },

    select,

    groupBy(getter) {
      return chainQuery(new GroupIterator(iter, getter));
    },

    aggregate,

    count() {
      if (iter.countable()) {
        // @ts-expect-error
        const d = new Deferred().fail(handleError);

        try {
          d.resolve(iter.count());
        } catch (x) {
          d.reject(x);
        }

        return d.promise();
      }

      return standardAggregate('count');
    },

    sum(getter) {
      if (getter) {
        // @ts-expect-error
        return selectProp(getter).sum();
      }
      return standardAggregate('sum');
    },

    min(getter) {
      if (getter) {
        // @ts-expect-error
        return selectProp(getter).min();
      }
      return standardAggregate('min');
    },

    max(getter) {
      if (getter) {
        // @ts-expect-error
        return selectProp(getter).max();
      }
      return standardAggregate('max');
    },

    avg(getter) {
      if (getter) {
        // @ts-expect-error
        return selectProp(getter).avg();
      }
      return standardAggregate('avg');
    },

  };
};

export default arrayQueryImpl;
