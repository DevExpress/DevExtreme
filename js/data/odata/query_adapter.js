var typeUtils = require('../../core/utils/type'),
    iteratorUtils = require('../../core/utils/iterator'),
    config = require('../../core/config'),
    extend = require('../../core/utils/extend').extend,
    queryAdapters = require('../query_adapters'),
    odataUtils = require('./utils'),
    serializePropName = odataUtils.serializePropName,
    errors = require('../errors').errors,
    dataUtils = require('../utils'),
    isFunction = typeUtils.isFunction;

var DEFAULT_PROTOCOL_VERSION = 2;

var compileCriteria = (function() {
    var protocolVersion,
        forceLowerCase,
        fieldTypes;

    var createBinaryOperationFormatter = function(op) {
        return function(prop, val) {
            return prop + ' ' + op + ' ' + val;
        };
    };

    var createStringFuncFormatter = function(op, reverse) {
        return function(prop, val) {
            var bag = [op, '('];

            if(forceLowerCase) {
                prop = prop.indexOf('tolower(') === -1 ? 'tolower(' + prop + ')' : prop;
                val = val.toLowerCase();
            }

            if(reverse) {
                bag.push(val, ',', prop);
            } else {
                bag.push(prop, ',', val);
            }

            bag.push(')');
            return bag.join('');
        };
    };

    var formatters = {
        '=': createBinaryOperationFormatter('eq'),
        '<>': createBinaryOperationFormatter('ne'),
        '>': createBinaryOperationFormatter('gt'),
        '>=': createBinaryOperationFormatter('ge'),
        '<': createBinaryOperationFormatter('lt'),
        '<=': createBinaryOperationFormatter('le'),
        'startswith': createStringFuncFormatter('startswith'),
        'endswith': createStringFuncFormatter('endswith')
    };

    var formattersV2 = extend({}, formatters, {
        'contains': createStringFuncFormatter('substringof', true),
        'notcontains': createStringFuncFormatter('not substringof', true)
    });

    var formattersV4 = extend({}, formatters, {
        'contains': createStringFuncFormatter('contains'),
        'notcontains': createStringFuncFormatter('not contains')
    });

    var compileBinary = function(criteria) {
        criteria = dataUtils.normalizeBinaryCriterion(criteria);

        var op = criteria[1],
            formatters = protocolVersion === 4
                ? formattersV4
                : formattersV2,
            formatter = formatters[op.toLowerCase()];

        if(!formatter) {
            throw errors.Error('E4003', op);
        }

        var fieldName = criteria[0],
            value = criteria[2];

        if(fieldTypes && fieldTypes[fieldName]) {
            value = odataUtils.convertPrimitiveValue(fieldTypes[fieldName], value);
        }

        return formatter(
            serializePropName(fieldName),
            odataUtils.serializeValue(value, protocolVersion)
        );
    };


    var compileUnary = function(criteria) {
        var op = criteria[0],
            crit = compileCore(criteria[1]);

        if(op === '!') {
            return 'not (' + crit + ')';
        }

        throw errors.Error('E4003', op);
    };

    var compileGroup = function(criteria) {
        var bag = [],
            groupOperator,
            nextGroupOperator;

        iteratorUtils.each(criteria, function(index, criterion) {
            if(Array.isArray(criterion)) {

                if(bag.length > 1 && groupOperator !== nextGroupOperator) {
                    throw new errors.Error('E4019');
                }

                bag.push('(' + compileCore(criterion) + ')');

                groupOperator = nextGroupOperator;
                nextGroupOperator = 'and';
            } else {
                nextGroupOperator = dataUtils.isConjunctiveOperator(this) ? 'and' : 'or';
            }
        });

        return bag.join(' ' + groupOperator + ' ');
    };

    var compileCore = function(criteria) {
        if(Array.isArray(criteria[0])) {
            return compileGroup(criteria);
        }

        if(dataUtils.isUnaryOperation(criteria)) {
            return compileUnary(criteria);
        }

        return compileBinary(criteria);
    };

    return function(criteria, version, types, filterToLower) {
        fieldTypes = types;
        forceLowerCase = typeUtils.isDefined(filterToLower) ? filterToLower : config().oDataFilterToLower;
        protocolVersion = version;

        return compileCore(criteria);
    };
})();

var createODataQueryAdapter = function(queryOptions) {
    var _sorting = [],
        _criteria = [],
        _expand = queryOptions.expand,
        _select,
        _skip,
        _take,
        _countQuery,

        _oDataVersion = queryOptions.version || DEFAULT_PROTOCOL_VERSION;

    var hasSlice = function() {
        return _skip || _take !== undefined;
    };

    var hasFunction = function(criterion) {
        for(var i = 0; i < criterion.length; i++) {
            if(isFunction(criterion[i])) {
                return true;
            }

            if(Array.isArray(criterion[i]) && hasFunction(criterion[i])) {
                return true;
            }
        }
        return false;
    };

    var requestData = function() {
        var result = {};

        if(!_countQuery) {
            if(_sorting.length) {
                result['$orderby'] = _sorting.join(',');
            }
            if(_skip) {
                result['$skip'] = _skip;
            }
            if(_take !== undefined) {
                result['$top'] = _take;
            }

            result['$select'] = odataUtils.generateSelect(_oDataVersion, _select) || undefined;
            result['$expand'] = odataUtils.generateExpand(_oDataVersion, _expand, _select) || undefined;
        }

        if(_criteria.length) {
            var criteria = _criteria.length < 2 ? _criteria[0] : _criteria,
                fieldTypes = queryOptions && queryOptions.fieldTypes,
                filterToLower = queryOptions && queryOptions.filterToLower;

            result['$filter'] = compileCriteria(criteria, _oDataVersion, fieldTypes, filterToLower);
        }

        if(_countQuery) {
            result['$top'] = 0;
        }

        if(queryOptions.requireTotalCount || _countQuery) {
            // todo: tests!!!
            if(_oDataVersion !== 4) {
                result['$inlinecount'] = 'allpages';
            } else {
                result['$count'] = 'true';
            }
        }

        return result;
    };

    function tryLiftSelect(tasks) {
        var selectIndex = -1;
        for(var i = 0; i < tasks.length; i++) {
            if(tasks[i].name === 'select') {
                selectIndex = i;
                break;
            }
        }

        if(selectIndex < 0 || !isFunction(tasks[selectIndex].args[0])) return;

        var nextTask = tasks[1 + selectIndex];
        if(!nextTask || nextTask.name !== 'slice') return;

        tasks[1 + selectIndex] = tasks[selectIndex];
        tasks[selectIndex] = nextTask;
    }

    return {

        optimize: function(tasks) {
            tryLiftSelect(tasks);
        },

        exec: function(url) {
            return odataUtils.sendRequest(_oDataVersion,
                {
                    url: url,
                    params: extend(requestData(), queryOptions && queryOptions.params)
                },
                {
                    beforeSend: queryOptions.beforeSend,
                    jsonp: queryOptions.jsonp,
                    withCredentials: queryOptions.withCredentials,
                    countOnly: _countQuery,
                    deserializeDates: queryOptions.deserializeDates,
                    fieldTypes: queryOptions.fieldTypes,
                    isPaged: isFinite(_take)
                }
            );
        },

        multiSort: function(args) {
            var rules;

            if(hasSlice()) {
                return false;
            }

            for(var i = 0; i < args.length; i++) {
                var getter = args[i][0],
                    desc = !!args[i][1],
                    rule;

                if(typeof getter !== 'string') {
                    return false;
                }

                rule = serializePropName(getter);
                if(desc) {
                    rule += ' desc';
                }

                rules = rules || [];
                rules.push(rule);
            }

            _sorting = rules;
        },

        slice: function(skipCount, takeCount) {
            if(hasSlice()) {
                return false;
            }

            _skip = skipCount;
            _take = takeCount;
        },

        filter: function(criterion) {
            if(hasSlice()) {
                return false;
            }

            if(!Array.isArray(criterion)) {
                criterion = [].slice.call(arguments);
            }

            if(hasFunction(criterion)) {
                return false;
            }

            if(_criteria.length) {
                _criteria.push('and');
            }

            _criteria.push(criterion);
        },

        select: function(expr) {
            if(_select || isFunction(expr)) {
                return false;
            }

            if(!Array.isArray(expr)) {
                expr = [].slice.call(arguments);
            }

            _select = expr;
        },

        count: function() {
            _countQuery = true;
        }
    };
};

queryAdapters.odata = createODataQueryAdapter;

exports.odata = createODataQueryAdapter;
