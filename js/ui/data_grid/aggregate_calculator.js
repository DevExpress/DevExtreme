import Class from '../../core/class';
import { compileGetter } from '../../core/utils/data';
import { isFunction } from '../../core/utils/type';
import { errors } from '../../data/errors';
import { aggregators } from '../../data/utils';

function depthFirstSearch(i, depth, root, callback) {
    let j = 0;
    if(i < depth) {
        for(; j < root.items.length; j++) {
            depthFirstSearch(i + 1, depth, root.items[j], callback);
        }
    }

    if(i === depth) {
        callback(root);
    }
}

// NOTE: https://github.com/jquery/jquery/blame/master/src/core.js#L392
function map(array, callback) {
    let i; let result;

    if('map' in array) {
        return array.map(callback);
    }

    result = new Array(array.length);
    for(i in array) {
        result[i] = callback(array[i], i);
    }

    return result;
}

function isEmpty(x) {
    return (x !== x) || (x === '') || (x === null) || (x === undefined);
}

function isCount(aggregator) {
    return aggregator === aggregators.count;
}

function normalizeAggregate(aggregate) {
    const selector = compileGetter(aggregate.selector);
    const skipEmptyValues = ('skipEmptyValues' in aggregate)
        ? aggregate.skipEmptyValues
        : true;
    let aggregator = aggregate.aggregator;


    if(typeof aggregator === 'string') {
        aggregator = aggregators[aggregator];
        if(!aggregator) {
            throw errors.Error('E4001', aggregate.aggregator);
        }
    }

    return {
        selector: selector,
        aggregator: aggregator,
        skipEmptyValues: skipEmptyValues
    };
}

module.exports = Class.inherit({
    ctor: function(options) {
        this._data = options.data;
        this._groupLevel = options.groupLevel || 0;
        this._totalAggregates = map(options.totalAggregates || [], normalizeAggregate);
        this._groupAggregates = map(options.groupAggregates || [], normalizeAggregate);
        this._totals = [];
    },

    calculate: function() {
        if(this._totalAggregates.length) {
            this._calculateTotals(0, { items: this._data });
        }

        if(this._groupAggregates.length && this._groupLevel > 0) {
            this._calculateGroups({ items: this._data });
        }
    },

    totalAggregates: function() {
        return this._totals;
    },

    _aggregate: function(aggregates, data, container) {
        let i; let j;
        const length = data.items ? data.items.length : 0;

        for(i = 0; i < aggregates.length; i++) {
            if(isCount(aggregates[i].aggregator)) {
                container[i] = (container[i] || 0) + length;
                continue;
            }

            for(j = 0; j < length; j++) {
                this._accumulate(i, aggregates[i], container, data.items[j]);
            }
        }
    },

    _calculateTotals: function(level, data) {
        let i;
        if(level === 0) {
            this._totals = this._seed(this._totalAggregates);
        }

        if(level === this._groupLevel) {
            this._aggregate(this._totalAggregates, data, this._totals);
        } else {
            for(i = 0; i < data.items.length; i++) {
                this._calculateTotals(level + 1, data.items[i]);
            }
        }

        if(level === 0) {
            this._totals = this._finalize(this._totalAggregates, this._totals);
        }
    },

    _calculateGroups: function(root) {
        const maxLevel = this._groupLevel;
        let currentLevel = maxLevel + 1;

        const seedFn = this._seed.bind(this, this._groupAggregates);
        const stepFn = this._aggregate.bind(this, this._groupAggregates);
        const finalizeFn = this._finalize.bind(this, this._groupAggregates);

        function aggregator(node) {
            node.aggregates = seedFn(currentLevel - 1);

            if(currentLevel === maxLevel) {
                stepFn(node, node.aggregates);
            } else {
                depthFirstSearch(currentLevel, maxLevel, node, function(innerNode) {
                    stepFn(innerNode, node.aggregates);
                });
            }

            node.aggregates = finalizeFn(node.aggregates);
        }

        while(--currentLevel > 0) {
            depthFirstSearch(0, currentLevel, root, aggregator);
        }
    },

    _seed: function(aggregates, groupIndex) {
        return map(aggregates, function(aggregate) {
            const aggregator = aggregate.aggregator;
            const seed = 'seed' in aggregator
                ? (isFunction(aggregator.seed) ? aggregator.seed(groupIndex) : aggregator.seed)
                : NaN;

            return seed;
        });
    },

    _accumulate: function(aggregateIndex, aggregate, results, item) {
        const value = aggregate.selector(item);
        const aggregator = aggregate.aggregator;
        const skipEmptyValues = aggregate.skipEmptyValues;

        if(skipEmptyValues && isEmpty(value)) {
            return;
        }

        if(results[aggregateIndex] !== results[aggregateIndex]) {
            results[aggregateIndex] = value;
        } else {
            results[aggregateIndex] = aggregator.step(results[aggregateIndex], value);
        }
    },

    _finalize: function(aggregates, results) {
        return map(aggregates, function(aggregate, index) {
            const fin = aggregate.aggregator.finalize;
            return fin
                ? fin(results[index])
                : results[index];
        });
    }
});
