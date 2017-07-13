"use strict";

var $ = require("../../core/renderer"),
    typeUtils = require("../../core/utils/type"),
    extend = require("../../core/utils/extend").extend,
    queryAdapters = require("../query_adapters"),
    odataUtils = require("./utils"),
    serializePropName = odataUtils.serializePropName,
    errors = require("../errors").errors,
    dataUtils = require("../utils"),
    isFunction = typeUtils.isFunction,
    isPlainObject = typeUtils.isPlainObject,
    grep = require("../../core/utils/common").grep;

var DEFAULT_PROTOCOL_VERSION = 2;

var makeArray = function(value) {
    return typeUtils.type(value) === "string" ? value.split() : value;
};

var compileCriteria = (function() {
    var protocolVersion,
        fieldTypes;

    var createBinaryOperationFormatter = function(op) {
        return function(prop, val) {
            return prop + " " + op + " " + val;
        };
    };

    var createStringFuncFormatter = function(op, reverse) {
        return function(prop, val) {
            var bag = [op, "("];

            if(reverse) {
                bag.push(val, ",", prop);
            } else {
                bag.push(prop, ",", val);
            }

            bag.push(")");
            return bag.join("");
        };
    };

    var formatters = {
        "=": createBinaryOperationFormatter("eq"),
        "<>": createBinaryOperationFormatter("ne"),
        ">": createBinaryOperationFormatter("gt"),
        ">=": createBinaryOperationFormatter("ge"),
        "<": createBinaryOperationFormatter("lt"),
        "<=": createBinaryOperationFormatter("le"),
        "startswith": createStringFuncFormatter("startswith"),
        "endswith": createStringFuncFormatter("endswith")
    };

    var formattersV2 = extend({}, formatters, {
        "contains": createStringFuncFormatter("substringof", true),
        "notcontains": createStringFuncFormatter("not substringof", true)
    });

    var formattersV4 = extend({}, formatters, {
        "contains": createStringFuncFormatter("contains"),
        "notcontains": createStringFuncFormatter("not contains")
    });

    var compileBinary = function(criteria) {
        criteria = dataUtils.normalizeBinaryCriterion(criteria);

        var op = criteria[1],
            formatters = protocolVersion === 4
                ? formattersV4
                : formattersV2,
            formatter = formatters[op.toLowerCase()];

        if(!formatter) {
            throw errors.Error("E4003", op);
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

        if(op === "!") {
            return "not (" + crit + ")";
        }

        throw errors.Error("E4003", op);
    };

    var compileGroup = function(criteria) {
        var bag = [],
            groupOperator,
            nextGroupOperator;

        $.each(criteria, function(index, criterion) {
            if(Array.isArray(criterion)) {

                if(bag.length > 1 && groupOperator !== nextGroupOperator) {
                    throw new errors.Error("E4019");
                }

                bag.push("(" + compileCore(criterion) + ")");

                groupOperator = nextGroupOperator;
                nextGroupOperator = "and";
            } else {
                nextGroupOperator = dataUtils.isConjunctiveOperator(this) ? "and" : "or";
            }
        });

        return bag.join(" " + groupOperator + " ");
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

    return function(criteria, version, types) {
        fieldTypes = types;
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

    var generateSelectExpand = function() {
        var hasDot = function(x) {
            return /\./.test(x);
        };

        var generateSelect = function() {
            if(!_select) {
                return;
            }

            if(_oDataVersion < 4) {
                return serializePropName(_select.join());
            }

            return grep(_select, hasDot, true).join();
        };

        var generateExpand = function() {
            var generatorV2 = function() {
                var hash = {};

                if(_expand) {
                    $.each(makeArray(_expand), function() {
                        hash[serializePropName(this)] = 1;
                    });
                }

                if(_select) {
                    $.each(makeArray(_select), function() {
                        var path = this.split(".");
                        if(path.length < 2) {
                            return;
                        }

                        path.pop();
                        hash[serializePropName(path.join("."))] = 1;
                    });
                }

                return $.map(hash, function(k, v) { return v; }).join();
            };

            var generatorV4 = function() {
                var format = function(hash) {
                    var formatCore = function(hash) {
                        var result = "",
                            select = [],
                            expand = [];

                        $.each(hash, function(key, value) {
                            if(Array.isArray(value)) {
                                [].push.apply(select, value);
                            }

                            if(isPlainObject(value)) {
                                expand.push(key + formatCore(value));
                            }
                        });

                        if(select.length || expand.length) {
                            result += "(";

                            if(select.length) {
                                result += "$select=" + $.map(select, serializePropName).join();
                            }

                            if(expand.length) {
                                if(select.length) {
                                    result += ";";
                                }

                                result += "$expand=" + $.map(expand, serializePropName).join();
                            }
                            result += ")";
                        }

                        return result;
                    };

                    var result = [];

                    $.each(hash, function(key, value) {
                        result.push(key + formatCore(value));
                    });

                    return result.join();
                };

                var parseTree = function(exprs, root, stepper) {
                    var parseCore = function(exprParts, root, stepper) {
                        var result = stepper(root, exprParts.shift(), exprParts);
                        if(result === false) {
                            return;
                        }

                        parseCore(exprParts, result, stepper);
                    };

                    $.each(exprs, function(_, x) {
                        parseCore(x.split("."), root, stepper);
                    });
                };

                var hash = {};

                if(_expand || _select) {
                    if(_expand) {
                        parseTree(makeArray(_expand), hash, function(node, key, path) {
                            node[key] = node[key] || {};

                            if(!path.length) {
                                return false;
                            }

                            return node[key];
                        });
                    }

                    if(_select) {
                        parseTree(grep(makeArray(_select), hasDot), hash, function(node, key, path) {
                            if(!path.length) {
                                node[key] = node[key] || [];
                                node[key].push(key);
                                return false;
                            }

                            return (node[key] = node[key] || {});
                        });
                    }

                    return format(hash);
                }
            };

            if(_oDataVersion < 4) {
                return generatorV2();
            }

            return generatorV4();
        };

        var tuple = {
            "$select": generateSelect() || undefined,
            "$expand": generateExpand() || undefined
        };

        return tuple;
    };

    var requestData = function() {
        var result = {};

        if(!_countQuery) {
            if(_sorting.length) {
                result["$orderby"] = _sorting.join(",");
            }
            if(_skip) {
                result["$skip"] = _skip;
            }
            if(_take !== undefined) {
                result["$top"] = _take;
            }

            var tuple = generateSelectExpand();
            result["$select"] = tuple["$select"];
            result["$expand"] = tuple["$expand"];
        }

        if(_criteria.length) {
            var criteria = _criteria.length < 2 ? _criteria[0] : _criteria,
                fieldTypes = queryOptions && queryOptions.fieldTypes;

            result["$filter"] = compileCriteria(criteria, _oDataVersion, fieldTypes);
        }

        if(_countQuery) {
            result["$top"] = 0;
        }

        if(queryOptions.requireTotalCount || _countQuery) {
            //todo: tests!!!
            if(_oDataVersion !== 4) {
                result["$inlinecount"] = "allpages";
            } else {
                result["$count"] = "true";
            }
        }

        return result;
    };

    return {

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
                    fieldTypes: queryOptions.fieldTypes
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

                if(typeof getter !== "string") {
                    return false;
                }

                rule = serializePropName(getter);
                if(desc) {
                    rule += " desc";
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
                criterion = Array.prototype.slice.call(arguments);
            }

            if(hasFunction(criterion)) {
                return false;
            }

            if(_criteria.length) {
                _criteria.push("and");
            }

            _criteria.push(criterion);
        },

        select: function(expr) {
            if(_select || isFunction(expr)) {
                return false;
            }

            if(!Array.isArray(expr)) {
                expr = Array.prototype.slice.call(arguments);
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
