const typeUtils = require('../../core/utils/type');
const iteratorUtils = require('../../core/utils/iterator');
const config = require('../../core/config');
const extend = require('../../core/utils/extend').extend;
const queryAdapters = require('../query_adapters');
const odataUtils = require('./utils');
const serializePropName = odataUtils.serializePropName;
const errors = require('../errors').errors;
const dataUtils = require('../utils');
const isFunction = typeUtils.isFunction;

const DEFAULT_PROTOCOL_VERSION = 2;

const compileCriteria = (function() {
    let protocolVersion;
    let forceLowerCase;
    let fieldTypes;

    const createBinaryOperationFormatter = function(op) {
        return function(prop, val) {
            return prop + ' ' + op + ' ' + val;
        };
    };

    const createStringFuncFormatter = function(op, reverse) {
        return function(prop, val) {
            const bag = [op, '('];

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

    const formatters = {
        '=': createBinaryOperationFormatter('eq'),
        '<>': createBinaryOperationFormatter('ne'),
        '>': createBinaryOperationFormatter('gt'),
        '>=': createBinaryOperationFormatter('ge'),
        '<': createBinaryOperationFormatter('lt'),
        '<=': createBinaryOperationFormatter('le'),
        'startswith': createStringFuncFormatter('startswith'),
        'endswith': createStringFuncFormatter('endswith')
    };

    const formattersV2 = extend({}, formatters, {
        'contains': createStringFuncFormatter('substringof', true),
        'notcontains': createStringFuncFormatter('not substringof', true)
    });

    const formattersV4 = extend({}, formatters, {
        'contains': createStringFuncFormatter('contains'),
        'notcontains': createStringFuncFormatter('not contains')
    });

    const compileBinary = function(criteria) {
        criteria = dataUtils.normalizeBinaryCriterion(criteria);

        const op = criteria[1];
        const formatters = protocolVersion === 4
            ? formattersV4
            : formattersV2;
        const formatter = formatters[op.toLowerCase()];

        if(!formatter) {
            throw errors.Error('E4003', op);
        }

        const fieldName = criteria[0];
        let value = criteria[2];

        if(fieldTypes && fieldTypes[fieldName]) {
            value = odataUtils.convertPrimitiveValue(fieldTypes[fieldName], value);
        }

        return formatter(
            serializePropName(fieldName),
            odataUtils.serializeValue(value, protocolVersion)
        );
    };


    const compileUnary = function(criteria) {
        const op = criteria[0];
        const crit = compileCore(criteria[1]);

        if(op === '!') {
            return 'not (' + crit + ')';
        }

        throw errors.Error('E4003', op);
    };

    const compileGroup = function(criteria) {
        const bag = [];
        let groupOperator;
        let nextGroupOperator;

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

    function compileCore(criteria) {
        if(Array.isArray(criteria[0])) {
            return compileGroup(criteria);
        }

        if(dataUtils.isUnaryOperation(criteria)) {
            return compileUnary(criteria);
        }

        return compileBinary(criteria);
    }

    return function(criteria, version, types, filterToLower) {
        fieldTypes = types;
        forceLowerCase = typeUtils.isDefined(filterToLower) ? filterToLower : config().oDataFilterToLower;
        protocolVersion = version;

        return compileCore(criteria);
    };
})();

const createODataQueryAdapter = function(queryOptions) {
    let _sorting = [];
    const _criteria = [];
    const _expand = queryOptions.expand;
    let _select;
    let _skip;
    let _take;
    let _countQuery;

    const _oDataVersion = queryOptions.version || DEFAULT_PROTOCOL_VERSION;

    const hasSlice = function() {
        return _skip || _take !== undefined;
    };

    const hasFunction = function(criterion) {
        for(let i = 0; i < criterion.length; i++) {
            if(isFunction(criterion[i])) {
                return true;
            }

            if(Array.isArray(criterion[i]) && hasFunction(criterion[i])) {
                return true;
            }
        }
        return false;
    };

    const requestData = function() {
        const result = {};

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
            const criteria = _criteria.length < 2 ? _criteria[0] : _criteria;
            const fieldTypes = queryOptions && queryOptions.fieldTypes;
            const filterToLower = queryOptions && queryOptions.filterToLower;

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
        let selectIndex = -1;
        for(let i = 0; i < tasks.length; i++) {
            if(tasks[i].name === 'select') {
                selectIndex = i;
                break;
            }
        }

        if(selectIndex < 0 || !isFunction(tasks[selectIndex].args[0])) return;

        const nextTask = tasks[1 + selectIndex];
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
            let rules;

            if(hasSlice()) {
                return false;
            }

            for(let i = 0; i < args.length; i++) {
                const getter = args[i][0];
                const desc = !!args[i][1];
                let rule;

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
