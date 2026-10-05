import { errors } from '@js/common/data/errors';
import { aggregators } from '@js/common/data/utils';
import { compileGetter } from '@js/core/utils/data';
import { isFunction } from '@js/core/utils/type';

import type { Aggregate } from './summary/types';

// NOTE: only the deepest groups hold rows in items; the groups above hold groups.
// Rows can be primitives (e.g. a store of numbers with the 'this' selector)
interface AggregateNode {
  items: unknown[];
  aggregates?: unknown[];
}

interface Aggregator {
  seed?: number | unknown[] | ((groupIndex?: number) => unknown);
  step: (accumulator: unknown, value: unknown) => unknown;
  finalize?: (accumulator: unknown) => unknown;
}

interface NormalizedAggregate {
  selector: (data: unknown) => unknown;
  aggregator: Aggregator;
  skipEmptyValues: boolean | undefined;
}

const depthFirstSearch = (
  i: number,
  depth: number,
  root: AggregateNode,
  callback: (node: AggregateNode) => void,
): void => {
  let j = 0;
  if (i < depth) {
    for (; j < root.items.length; j += 1) {
      // NOTE: above the given depth, items are groups
      depthFirstSearch(i + 1, depth, root.items[j] as AggregateNode, callback);
    }
  }

  if (i === depth) {
    callback(root);
  }
};

const isEmpty = (x: unknown): boolean => Number.isNaN(x) || (x === '') || (x === null) || (x === undefined);

const isCount = (aggregator: Aggregator): boolean => aggregator === aggregators.count;

const normalizeAggregate = (aggregate: Aggregate): NormalizedAggregate => {
  // @ts-expect-error badly typed compileGetter
  const selector = compileGetter(aggregate.selector) as (data: unknown) => unknown;

  const skipEmptyValues = 'skipEmptyValues' in aggregate
    ? aggregate.skipEmptyValues
    : true;
  let { aggregator } = aggregate;

  if (typeof aggregator === 'string') {
    aggregator = aggregators[aggregator];
    if (!aggregator) {
      throw errors.Error('E4001', aggregate.aggregator);
    }
  }

  return {
    selector,
    // @ts-expect-error aggregators[name] is untyped; local aggregates always have one
    aggregator,
    skipEmptyValues,
  };
};

export default class AggregateCalculator {
  private readonly _data: unknown[];

  private readonly _groupLevel: number;

  private readonly _totalAggregates: NormalizedAggregate[];

  private readonly _groupAggregates: NormalizedAggregate[];

  private _totals: unknown[];

  constructor(options: {
    data: unknown[];
    groupLevel: number;
    totalAggregates: Aggregate[];
    groupAggregates: Aggregate[];
  }) {
    this._data = options.data;
    this._groupLevel = options.groupLevel;
    this._totalAggregates = options.totalAggregates.map(normalizeAggregate);
    this._groupAggregates = options.groupAggregates.map(normalizeAggregate);
    this._totals = [];
  }

  public calculate(): void {
    if (this._totalAggregates.length) {
      this._calculateTotals(0, { items: this._data });
    }

    if (this._groupAggregates.length && this._groupLevel > 0) {
      this._calculateGroups({ items: this._data });
    }
  }

  public totalAggregates(): unknown[] {
    return this._totals;
  }

  private _aggregate(
    aggregates: NormalizedAggregate[],
    data: AggregateNode,
    container: unknown[],
  ): void {
    const length = data.items ? data.items.length : 0;

    for (let i = 0; i < aggregates.length; i += 1) {
      if (isCount(aggregates[i].aggregator)) {
        container[i] = (container[i] as number | undefined ?? 0) + length;
        // eslint-disable-next-line no-continue
        continue;
      }

      for (let j = 0; j < length; j += 1) {
        this._accumulate(i, aggregates[i], container, data.items[j]);
      }
    }
  }

  private _calculateTotals(level: number, root: AggregateNode): void {
    if (level === 0) {
      this._totals = this._seed(this._totalAggregates);
    }

    if (level === this._groupLevel) {
      this._aggregate(this._totalAggregates, root, this._totals);
    } else {
      for (const item of root.items) {
        // NOTE: above the group level, items are groups
        this._calculateTotals(level + 1, item as AggregateNode);
      }
    }

    if (level === 0) {
      this._totals = this._finalize(this._totalAggregates, this._totals);
    }
  }

  private _calculateGroups(root: AggregateNode): void {
    const maxLevel = this._groupLevel;
    let currentLevel = maxLevel + 1;

    const seedFn = this._seed.bind(this, this._groupAggregates);
    const stepFn = this._aggregate.bind(this, this._groupAggregates);
    const finalizeFn = this._finalize.bind(this, this._groupAggregates);

    const aggregator = (node: AggregateNode): void => {
      const aggregates = seedFn(currentLevel - 1);
      node.aggregates = aggregates;

      if (currentLevel === maxLevel) {
        stepFn(node, aggregates);
      } else {
        depthFirstSearch(currentLevel, maxLevel, node, (innerNode) => {
          stepFn(innerNode, aggregates);
        });
      }

      node.aggregates = finalizeFn(aggregates);
    };

    currentLevel -= 1;
    while (currentLevel > 0) {
      depthFirstSearch(0, currentLevel, root, aggregator);
      currentLevel -= 1;
    }
  }

  private _seed(aggregates: NormalizedAggregate[], groupIndex?: number): unknown[] {
    return aggregates.map((aggregate) => {
      const { aggregator } = aggregate;

      if (!('seed' in aggregator)) {
        return NaN;
      }

      return isFunction(aggregator.seed) ? aggregator.seed(groupIndex) : aggregator.seed;
    });
  }

  private _accumulate(
    aggregateIndex: number,
    aggregate: NormalizedAggregate,
    results: unknown[],
    item: unknown,
  ): void {
    const value = aggregate.selector(item);
    const { aggregator } = aggregate;
    const { skipEmptyValues } = aggregate;

    if (skipEmptyValues && isEmpty(value)) {
      return;
    }

    if (Number.isNaN(results[aggregateIndex])) {
      results[aggregateIndex] = value;
    } else {
      results[aggregateIndex] = aggregator.step(results[aggregateIndex], value);
    }
  }

  private _finalize(aggregates: NormalizedAggregate[], results: unknown[]): unknown[] {
    return aggregates.map((aggregate, index) => {
      const fin = aggregate.aggregator.finalize;
      return fin
        ? fin(results[index])
        : results[index];
    });
  }
}
