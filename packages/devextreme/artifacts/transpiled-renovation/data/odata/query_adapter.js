"use strict";

exports.odata = void 0;
var _type = require("../../core/utils/type");
var _iterator = require("../../core/utils/iterator");
var _config = _interopRequireDefault(require("../../core/config"));
var _extend = require("../../core/utils/extend");
var _query_adapters = _interopRequireDefault(require("../query_adapters"));
var _utils = require("./utils");
var _errors = require("../errors");
var _utils2 = require("../utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const DEFAULT_PROTOCOL_VERSION = 4;
const STRING_FUNCTIONS = ['contains', 'notcontains', 'startswith', 'endswith'];
const compileCriteria = (() => {
  let protocolVersion;
  let forceLowerCase;
  let fieldTypes;
  const createBinaryOperationFormatter = op => (prop, val) => `${prop} ${op} ${val}`;
  const createStringFuncFormatter = (op, reverse) => (prop, val) => {
    const bag = [op, '('];
    if (forceLowerCase) {
      prop = prop.indexOf('tolower(') === -1 ? `tolower(${prop})` : prop;
      val = val.toLowerCase();
    }
    if (reverse) {
      bag.push(val, ',', prop);
    } else {
      bag.push(prop, ',', val);
    }
    bag.push(')');
    return bag.join('');
  };
  const isStringFunction = function (name) {
    return STRING_FUNCTIONS.some(funcName => funcName === name);
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
  const formattersV2 = (0, _extend.extend)({}, formatters, {
    'contains': createStringFuncFormatter('substringof', true),
    'notcontains': createStringFuncFormatter('not substringof', true)
  });
  const formattersV4 = (0, _extend.extend)({}, formatters, {
    'contains': createStringFuncFormatter('contains'),
    'notcontains': createStringFuncFormatter('not contains')
  });
  const compileBinary = criteria => {
    var _fieldTypes;
    criteria = (0, _utils2.normalizeBinaryCriterion)(criteria);
    const op = criteria[1];
    const fieldName = criteria[0];
    const fieldType = fieldTypes && fieldTypes[fieldName];
    if (fieldType && isStringFunction(op) && fieldType !== 'String') {
      throw new _errors.errors.Error('E4024', op, fieldName, fieldType);
    }
    const formatters = protocolVersion === 4 ? formattersV4 : formattersV2;
    const formatter = formatters[op.toLowerCase()];
    if (!formatter) {
      throw _errors.errors.Error('E4003', op);
    }
    let value = criteria[2];
    if ((_fieldTypes = fieldTypes) !== null && _fieldTypes !== void 0 && _fieldTypes[fieldName]) {
      value = (0, _utils.convertPrimitiveValue)(fieldTypes[fieldName], value);
    }
    return formatter((0, _utils.serializePropName)(fieldName), (0, _utils.serializeValue)(value, protocolVersion));
  };
  const compileUnary = criteria => {
    const op = criteria[0];
    const crit = compileCore(criteria[1]);
    if (op === '!') {
      return `not (${crit})`;
    }
    throw _errors.errors.Error('E4003', op);
  };
  const compileGroup = criteria => {
    const bag = [];
    let groupOperator;
    let nextGroupOperator;
    (0, _iterator.each)(criteria, function (index, criterion) {
      if (Array.isArray(criterion)) {
        if (bag.length > 1 && groupOperator !== nextGroupOperator) {
          throw new _errors.errors.Error('E4019');
        }
        bag.push(`(${compileCore(criterion)})`);
        groupOperator = nextGroupOperator;
        nextGroupOperator = 'and';
      } else {
        nextGroupOperator = (0, _utils2.isConjunctiveOperator)(this) ? 'and' : 'or';
      }
    });
    return bag.join(` ${groupOperator} `);
  };
  const compileCore = criteria => {
    if (Array.isArray(criteria[0])) {
      return compileGroup(criteria);
    }
    if ((0, _utils2.isUnaryOperation)(criteria)) {
      return compileUnary(criteria);
    }
    return compileBinary(criteria);
  };
  return (criteria, version, types, filterToLower) => {
    fieldTypes = types;
    forceLowerCase = filterToLower ?? (0, _config.default)().oDataFilterToLower;
    protocolVersion = version;
    return compileCore(criteria);
  };
})();
const createODataQueryAdapter = queryOptions => {
  let _sorting = [];
  const _criteria = [];
  const _expand = queryOptions.expand;
  let _select;
  let _skip;
  let _take;
  let _countQuery;
  const _oDataVersion = queryOptions.version || DEFAULT_PROTOCOL_VERSION;
  const hasSlice = () => _skip || _take !== undefined;
  const hasFunction = criterion => {
    for (let i = 0; i < criterion.length; i++) {
      if ((0, _type.isFunction)(criterion[i])) {
        return true;
      }
      if (Array.isArray(criterion[i]) && hasFunction(criterion[i])) {
        return true;
      }
    }
    return false;
  };
  const requestData = () => {
    const result = {};
    if (!_countQuery) {
      if (_sorting.length) {
        result['$orderby'] = _sorting.join(',');
      }
      if (_skip) {
        result['$skip'] = _skip;
      }
      if (_take !== undefined) {
        result['$top'] = _take;
      }
      result['$select'] = (0, _utils.generateSelect)(_oDataVersion, _select) || undefined;
      result['$expand'] = (0, _utils.generateExpand)(_oDataVersion, _expand, _select) || undefined;
    }
    if (_criteria.length) {
      const criteria = _criteria.length < 2 ? _criteria[0] : _criteria;
      const fieldTypes = queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.fieldTypes;
      const filterToLower = queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.filterToLower;
      result['$filter'] = compileCriteria(criteria, _oDataVersion, fieldTypes, filterToLower);
    }
    if (_countQuery) {
      result['$top'] = 0;
    }
    if (queryOptions.requireTotalCount || _countQuery) {
      // todo: tests!!!
      if (_oDataVersion !== 4) {
        result['$inlinecount'] = 'allpages';
      } else {
        result['$count'] = 'true';
      }
    }
    return result;
  };
  const tryLiftSelect = tasks => {
    let selectIndex = -1;
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].name === 'select') {
        selectIndex = i;
        break;
      }
    }
    if (selectIndex < 0 || !(0, _type.isFunction)(tasks[selectIndex].args[0])) return;
    const nextTask = tasks[1 + selectIndex];
    if (!nextTask || nextTask.name !== 'slice') return;
    tasks[1 + selectIndex] = tasks[selectIndex];
    tasks[selectIndex] = nextTask;
  };
  return {
    optimize: tryLiftSelect,
    exec(url) {
      return (0, _utils.sendRequest)(_oDataVersion, {
        url,
        params: (0, _extend.extend)(requestData(), queryOptions === null || queryOptions === void 0 ? void 0 : queryOptions.params)
      }, {
        beforeSend: queryOptions.beforeSend,
        jsonp: queryOptions.jsonp,
        withCredentials: queryOptions.withCredentials,
        countOnly: _countQuery,
        deserializeDates: queryOptions.deserializeDates,
        fieldTypes: queryOptions.fieldTypes,
        isPaged: isFinite(_take)
      });
    },
    multiSort(args) {
      let rules;
      if (hasSlice()) {
        return false;
      }
      for (let i = 0; i < args.length; i++) {
        const getter = args[i][0];
        const desc = !!args[i][1];
        let rule;
        if (typeof getter !== 'string') {
          return false;
        }
        rule = (0, _utils.serializePropName)(getter);
        if (desc) {
          rule += ' desc';
        }
        rules = rules || [];
        rules.push(rule);
      }
      _sorting = rules;
    },
    slice(skipCount, takeCount) {
      if (hasSlice()) {
        return false;
      }
      _skip = skipCount;
      _take = takeCount;
    },
    filter(criterion) {
      if (hasSlice()) {
        return false;
      }
      if (!Array.isArray(criterion)) {
        criterion = [].slice.call(arguments);
      }
      if (hasFunction(criterion)) {
        return false;
      }
      if (_criteria.length) {
        _criteria.push('and');
      }
      _criteria.push(criterion);
    },
    select(expr) {
      if (_select || (0, _type.isFunction)(expr)) {
        return false;
      }
      if (!Array.isArray(expr)) {
        expr = [].slice.call(arguments);
      }
      _select = expr;
    },
    count: () => _countQuery = true
  };
};
_query_adapters.default.odata = createODataQueryAdapter;
const odata = exports.odata = createODataQueryAdapter;