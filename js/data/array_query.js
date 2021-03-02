var Class = require("../core/class"),
    typeUtils = require("../core/utils/type"),
    iteratorUtils = require("../core/utils/iterator"),
    compileGetter = require("../core/utils/data").compileGetter,
    toComparable = require("../core/utils/data").toComparable,
    Deferred = require("../core/utils/deferred").Deferred,
    errorsModule = require("./errors"),
    dataUtils = require("./utils");

var Iterator = Class.inherit({

    toArray: function() {
        var result = [];

        this.reset();
        while(this.next()) {
            result.push(this.current());
        }

        return result;
    },

    countable: function() {
        return false;
    }
});

var ArrayIterator = Iterator.inherit({

    ctor: function(array) {
        this.array = array;
        this.index = -1;
    },

    next: function() {
        if(this.index + 1 < this.array.length) {
            this.index++;
            return true;
        }
        return false;
    },

    current: function() {
        return this.array[this.index];
    },

    reset: function() {
        this.index = -1;
    },

    toArray: function() {
        return this.array.slice(0);
    },

    countable: function() {
        return true;
    },

    count: function() {
        return this.array.length;
    }

});

var WrappedIterator = Iterator.inherit({
    ctor: function(iter) {
        this.iter = iter;
    },

    next: function() { return this.iter.next(); },
    current: function() { return this.iter.current(); },
    reset: function() { return this.iter.reset(); }
});


var MapIterator = WrappedIterator.inherit({
    ctor: function(iter, mapper) {
        this.callBase(iter);
        this.index = -1;
        this.mapper = mapper;
    },

    current: function() {
        return this.mapper(this.callBase(), this.index);
    },

    next: function() {
        var hasNext = this.callBase();
        if(hasNext) {
            this.index++;
        }
        return hasNext;
    }
});

var defaultCompare = function(xValue, yValue) {
    xValue = toComparable(xValue);
    yValue = toComparable(yValue);

    if(xValue === null && yValue !== null) {
        return -1;
    }

    if(xValue !== null && yValue === null) {
        return 1;
    }

    if(xValue === undefined && yValue !== undefined) {
        return 1;
    }

    if(xValue !== undefined && yValue === undefined) {
        return -1;
    }

    if(xValue < yValue) {
        return -1;
    }

    if(xValue > yValue) {
        return 1;
    }

    return 0;
};

var SortIterator = Iterator.inherit({

    ctor: function(iter, getter, desc, compare) {
        if(!(iter instanceof MapIterator)) {
            iter = new MapIterator(iter, this._wrap);
        }
        this.iter = iter;
        this.rules = [{ getter: getter, desc: desc, compare: compare }];
    },

    thenBy: function(getter, desc, compare) {
        var result = new SortIterator(this.sortedIter || this.iter, getter, desc, compare);
        if(!this.sortedIter) {
            result.rules = this.rules.concat(result.rules);
        }
        return result;
    },

    next: function() {
        this._ensureSorted();
        return this.sortedIter.next();
    },

    current: function() {
        this._ensureSorted();
        return this.sortedIter.current();
    },

    reset: function() {
        delete this.sortedIter;
    },

    countable: function() {
        return this.sortedIter || this.iter.countable();
    },

    count: function() {
        if(this.sortedIter) {
            return this.sortedIter.count();
        }
        return this.iter.count();
    },
    _ensureSorted: function() {
        var that = this;

        if(that.sortedIter) {
            return;
        }

        iteratorUtils.each(that.rules, function() {
            this.getter = compileGetter(this.getter);
        });

        that.sortedIter = new MapIterator(
            new ArrayIterator(this.iter.toArray().sort(function(x, y) {
                return that._compare(x, y);
            })),
            that._unwrap
        );
    },
    _wrap: function(record, index) {
        return {
            index: index,
            value: record
        };
    },
    _unwrap: function(wrappedItem) {
        return wrappedItem.value;
    },
    _compare: function(x, y) {
        var xIndex = x.index,
            yIndex = y.index;

        x = x.value;
        y = y.value;

        if(x === y) {
            return xIndex - yIndex;
        }

        for(var i = 0, rulesCount = this.rules.length; i < rulesCount; i++) {
            var rule = this.rules[i],
                xValue = rule.getter(x),
                yValue = rule.getter(y),
                compare = rule.compare || defaultCompare,
                compareResult = compare(xValue, yValue);

            if(compareResult) {
                return rule.desc ? -compareResult : compareResult;
            }
        }

        return xIndex - yIndex;
    }
});


var compileCriteria = (function() {

    var compileGroup = function(crit) {
        var ops = [];

        var isConjunctiveOperator = false;
        var isConjunctiveNextOperator = false;

        iteratorUtils.each(crit, function() {
            if(Array.isArray(this) || typeUtils.isFunction(this)) {
                if(ops.length > 1 && isConjunctiveOperator !== isConjunctiveNextOperator) {
                    throw new errorsModule.errors.Error("E4019");
                }

                ops.push(compileCriteria(this));

                isConjunctiveOperator = isConjunctiveNextOperator;
                isConjunctiveNextOperator = true;
            } else {
                isConjunctiveNextOperator = dataUtils.isConjunctiveOperator(this);
            }
        });

        return function(d) {
            var result = isConjunctiveOperator;

            for(var i = 0; i < ops.length; i++) {
                if(ops[i](d) !== isConjunctiveOperator) {
                    result = !isConjunctiveOperator;
                    break;
                }
            }

            return result;
        };
    };

    var toString = function(value) {
        return typeUtils.isDefined(value) ? value.toString() : '';
    };

    var compileBinary = function(crit) {
        crit = dataUtils.normalizeBinaryCriterion(crit);
        var getter = compileGetter(crit[0]),
            op = crit[1],
            value = crit[2];

        value = toComparable(value);

        switch(op.toLowerCase()) {
            case "=":
                return compileEquals(getter, value);
            case "<>":
                return compileEquals(getter, value, true);
            case ">":
                return function(obj) { return toComparable(getter(obj)) > value; };
            case "<":
                return function(obj) { return toComparable(getter(obj)) < value; };
            case ">=":
                return function(obj) { return toComparable(getter(obj)) >= value; };
            case "<=":
                return function(obj) { return toComparable(getter(obj)) <= value; };
            case "startswith":
                return function(obj) { return toComparable(toString(getter(obj))).indexOf(value) === 0; };
            case "endswith":
                return function(obj) {
                    var getterValue = toComparable(toString(getter(obj))),
                        searchValue = toString(value);

                    if(getterValue.length < searchValue.length) {
                        return false;
                    }

                    var index = getterValue.lastIndexOf(value);
                    return index !== -1 && index === getterValue.length - value.length;
                };
            case "contains":
                return function(obj) { return toComparable(toString(getter(obj))).indexOf(value) > -1; };
            case "notcontains":
                return function(obj) { return toComparable(toString(getter(obj))).indexOf(value) === -1; };
        }

        throw errorsModule.errors.Error("E4003", op);
    };

    function compileEquals(getter, value, negate) {
        return function(obj) {
            obj = toComparable(getter(obj));
            // eslint-disable-next-line eqeqeq
            var result = useStrictComparison(value) ? obj === value : obj == value;
            if(negate) {
                result = !result;
            }
            return result;
        };
    }

    function useStrictComparison(value) {
        return value === "" || value === 0 || value === false;
    }

    function compileUnary(crit) {
        var op = crit[0],
            criteria = compileCriteria(crit[1]);

        if(op === "!") {
            return function(obj) { return !criteria(obj); };
        }

        throw errorsModule.errors.Error("E4003", op);
    }

    return function(crit) {
        if(typeUtils.isFunction(crit)) {
            return crit;
        }
        if(dataUtils.isGroupCriterion(crit)) {
            return compileGroup(crit);
        }
        if(dataUtils.isUnaryOperation(crit)) {
            return compileUnary(crit);
        }
        return compileBinary(crit);
    };

})();

var FilterIterator = WrappedIterator.inherit({

    ctor: function(iter, criteria) {
        this.callBase(iter);
        this.criteria = compileCriteria(criteria);
    },

    next: function() {
        while(this.iter.next()) {
            if(this.criteria(this.current())) {
                return true;
            }
        }
        return false;
    }
});

var GroupIterator = Iterator.inherit({
    ctor: function(iter, getter) {
        this.iter = iter;
        this.getter = getter;
    },

    next: function() {
        this._ensureGrouped();
        return this.groupedIter.next();
    },

    current: function() {
        this._ensureGrouped();
        return this.groupedIter.current();
    },

    reset: function() {
        delete this.groupedIter;
    },

    countable: function() {
        return !!this.groupedIter;
    },

    count: function() {
        return this.groupedIter.count();
    },

    _ensureGrouped: function() {
        if(this.groupedIter) {
            return;
        }

        var hash = {},
            keys = [],
            iter = this.iter,
            getter = compileGetter(this.getter);

        iter.reset();
        while(iter.next()) {
            var current = iter.current(),
                key = getter(current);

            if(key in hash) {
                hash[key].push(current);
            } else {
                hash[key] = [current];
                keys.push(key);
            }
        }

        this.groupedIter = new ArrayIterator(
            iteratorUtils.map(
                keys,
                function(key) {
                    return { key: key, items: hash[key] };
                }
            )
        );
    }

});

var SelectIterator = WrappedIterator.inherit({

    ctor: function(iter, getter) {
        this.callBase(iter);
        this.getter = compileGetter(getter);
    },

    current: function() {
        return this.getter(this.callBase());
    },

    countable: function() {
        return this.iter.countable();
    },

    count: function() {
        return this.iter.count();
    }

});

var SliceIterator = WrappedIterator.inherit({
    ctor: function(iter, skip, take) {
        this.callBase(iter);
        this.skip = Math.max(0, skip);
        this.take = Math.max(0, take);
        this.pos = 0;
    },

    next: function() {
        if(this.pos >= this.skip + this.take) {
            return false;
        }

        while(this.pos < this.skip && this.iter.next()) {
            this.pos++;
        }

        this.pos++;
        return this.iter.next();
    },

    reset: function() {
        this.callBase();
        this.pos = 0;
    },

    countable: function() {
        return this.iter.countable();
    },

    count: function() {
        return Math.min(this.iter.count() - this.skip, this.take);
    }

});

var arrayQueryImpl = function(iter, queryOptions) {
    queryOptions = queryOptions || {};

    if(!(iter instanceof Iterator)) {
        iter = new ArrayIterator(iter);
    }

    var handleError = function(error) {
        var handler = queryOptions.errorHandler;
        if(handler) {
            handler(error);
        }

        errorsModule._errorHandler(error);
    };

    var aggregateCore = function(aggregator) {
        var d = new Deferred().fail(handleError),
            seed,
            step = aggregator.step,
            finalize = aggregator.finalize;

        try {
            iter.reset();
            if("seed" in aggregator) {
                seed = aggregator.seed;
            } else {
                seed = iter.next() ? iter.current() : NaN;
            }

            var accumulator = seed;
            while(iter.next()) {
                accumulator = step(accumulator, iter.current());
            }
            d.resolve(finalize ? finalize(accumulator) : accumulator);
        } catch(x) {
            d.reject(x);
        }

        return d.promise();
    };

    var aggregate = function(seed, step, finalize) {
        if(arguments.length < 2) {
            return aggregateCore({ step: arguments[0] });
        }
        return aggregateCore({
            seed: seed,
            step: step,
            finalize: finalize
        });
    };

    var standardAggregate = function(name) {
        return aggregateCore(dataUtils.aggregators[name]);
    };

    var select = function(getter) {
        if(!typeUtils.isFunction(getter) && !Array.isArray(getter)) {
            getter = [].slice.call(arguments);
        }

        return chainQuery(new SelectIterator(iter, getter));
    };

    var selectProp = function(name) {
        return select(compileGetter(name));
    };

    var chainQuery = function(iter) {
        return arrayQueryImpl(iter, queryOptions);
    };

    return {
        toArray: function() {
            return iter.toArray();
        },

        enumerate: function() {
            var d = new Deferred().fail(handleError);

            try {
                d.resolve(iter.toArray());
            } catch(x) {
                d.reject(x);
            }

            return d.promise();
        },

        sortBy: function(getter, desc, compare) {
            return chainQuery(new SortIterator(iter, getter, desc, compare));
        },

        thenBy: function(getter, desc, compare) {
            if(iter instanceof SortIterator) {
                return chainQuery(iter.thenBy(getter, desc, compare));
            }

            throw errorsModule.errors.Error("E4004");
        },

        filter: function(criteria) {
            if(!Array.isArray(criteria)) {
                criteria = [].slice.call(arguments);
            }
            return chainQuery(new FilterIterator(iter, criteria));
        },

        slice: function(skip, take) {
            if(take === undefined) {
                take = Number.MAX_VALUE;
            }
            return chainQuery(new SliceIterator(iter, skip, take));
        },

        select: select,

        groupBy: function(getter) {
            return chainQuery(new GroupIterator(iter, getter));
        },

        aggregate: aggregate,

        count: function() {
            if(iter.countable()) {
                var d = new Deferred().fail(handleError);

                try {
                    d.resolve(iter.count());
                } catch(x) {
                    d.reject(x);
                }

                return d.promise();
            }

            return standardAggregate("count");
        },

        sum: function(getter) {
            if(getter) {
                return selectProp(getter).sum();
            }
            return standardAggregate("sum");
        },

        min: function(getter) {
            if(getter) {
                return selectProp(getter).min();
            }
            return standardAggregate("min");
        },

        max: function(getter) {
            if(getter) {
                return selectProp(getter).max();
            }
            return standardAggregate("max");
        },

        avg: function(getter) {
            if(getter) {
                return selectProp(getter).avg();
            }
            return standardAggregate("avg");
        }

    };
};

module.exports = arrayQueryImpl;
