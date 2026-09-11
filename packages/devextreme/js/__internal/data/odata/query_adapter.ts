import queryAdapters from '@js/common/data/query_adapters';
import config from '@js/core/config';
import type { DeferredObj } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isFunction, isString } from '@js/core/utils/type';
import type { QueryAdapter, RemoteQueryOptions, RemoteTask } from '@ts/data/remote_query';

import { errors } from '../errors';
import {
  isConjunctiveOperator,
  isUnaryOperation,
  normalizeBinaryCriterion,
} from '../utils';
import {
  convertPrimitiveValue,
  EdmLiteral,
  generateExpand,
  generateSelect,
  sendRequest,
  serializePropName,
  serializeValue,
} from './utils';

const DEFAULT_PROTOCOL_VERSION = 4;
const STRING_FUNCTIONS = ['contains', 'notcontains', 'startswith', 'endswith'];

type Formatter = (prop: string, val: string) => string;

type FieldTypes = Record<string, string>;

interface ODataRequestParams {
  [param: string]: unknown;
  $orderby?: string;
  $skip?: number;
  $top?: number;
  $select?: string;
  $expand?: string;
  $filter?: string;
  // eslint-disable-next-line spellcheck/spell-checker
  $inlinecount?: string;
  $count?: string;
}

const compileCriteria = (() => {
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let protocolVersion: number;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let forceLowerCase: boolean | undefined;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let fieldTypes: FieldTypes | undefined;

  const createBinaryOperationFormatter = (op: string): Formatter => (prop, val) => `${prop} ${op} ${val}`;

  const createStringFuncFormatter = (op: string, reverse?: boolean): Formatter => (prop, val) => {
    const bag = [op, '('];
    const propName = forceLowerCase && !prop.includes('tolower(') ? `tolower(${prop})` : prop;
    const value = forceLowerCase ? val.toLowerCase() : val;

    if (reverse) {
      bag.push(value, ',', propName);
    } else {
      bag.push(propName, ',', value);
    }

    bag.push(')');
    return bag.join('');
  };

  const isStringFunction = function (name: string): boolean {
    return STRING_FUNCTIONS.some((funcName) => funcName === name);
  };

  const formatters: Record<string, Formatter> = {
    '=': createBinaryOperationFormatter('eq'),
    '<>': createBinaryOperationFormatter('ne'),
    '>': createBinaryOperationFormatter('gt'),
    '>=': createBinaryOperationFormatter('ge'),
    '<': createBinaryOperationFormatter('lt'),
    '<=': createBinaryOperationFormatter('le'),
    startswith: createStringFuncFormatter('startswith'),
    endswith: createStringFuncFormatter('endswith'),
  };

  /* eslint-disable spellcheck/spell-checker */
  const formattersV2: Record<string, Formatter> = {
    ...formatters,
    contains: createStringFuncFormatter('substringof', true),
    notcontains: createStringFuncFormatter('not substringof', true),
  };
  /* eslint-enable spellcheck/spell-checker */

  /* eslint-disable spellcheck/spell-checker */
  const formattersV4: Record<string, Formatter> = {
    ...formatters,
    contains: createStringFuncFormatter('contains'),
    notcontains: createStringFuncFormatter('not contains'),
  };
  /* eslint-enable spellcheck/spell-checker */

  const compileBinary = (criteria: unknown[]): string => {
    const crit = normalizeBinaryCriterion(criteria);

    const [rawFieldName, op] = crit;
    const fieldName = isString(rawFieldName) || rawFieldName instanceof EdmLiteral
      ? rawFieldName
      : String(rawFieldName);
    const fieldType = fieldTypes?.[String(fieldName)];

    if (fieldType && isStringFunction(op) && fieldType !== 'String') {
      throw errors.Error('E4024', op, fieldName, fieldType);
    }

    const criterionFormatters = protocolVersion === 4
      ? formattersV4
      : formattersV2;
    const formatter = criterionFormatters[op.toLowerCase()];

    if (!formatter) {
      throw errors.Error('E4003', op);
    }

    const value = fieldType ? convertPrimitiveValue(fieldType, crit[2]) : crit[2];

    return formatter(
      serializePropName(fieldName),
      serializeValue(value, protocolVersion, fieldType),
    );
  };

  const compileUnary = (criteria: unknown[]): string => {
    const op = criteria[0];
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    const crit = compileCore(criteria[1]);

    if (op === '!') {
      return `not (${crit})`;
    }

    throw errors.Error('E4003', op);
  };

  const compileGroup = (criteria: unknown[]): string => {
    const bag: string[] = [];
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let groupOperator: string | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let nextGroupOperator: string | undefined;

    criteria.forEach((criterion) => {
      if (Array.isArray(criterion)) {
        if (bag.length > 1 && groupOperator !== nextGroupOperator) {
          throw errors.Error('E4019');
        }
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        bag.push(`(${compileCore(criterion)})`);

        groupOperator = nextGroupOperator;
        nextGroupOperator = 'and';
      } else {
        nextGroupOperator = isConjunctiveOperator(criterion) ? 'and' : 'or';
      }
    });

    return bag.join(` ${groupOperator} `);
  };

  const compileCore = (criteria: unknown): string => {
    const criterion: unknown[] = Array.isArray(criteria) ? criteria : [criteria];

    if (Array.isArray(criterion[0])) {
      return compileGroup(criterion);
    }

    if (isUnaryOperation(criterion)) {
      return compileUnary(criterion);
    }

    return compileBinary(criterion);
  };

  return (
    criteria: unknown,
    version: number,
    types: FieldTypes | undefined,
    filterToLower: boolean | undefined,
  ): string => {
    fieldTypes = types;
    forceLowerCase = filterToLower ?? config().oDataFilterToLower;
    protocolVersion = version;

    return compileCore(criteria);
  };
})();

const createODataQueryAdapter = (queryOptions: RemoteQueryOptions): QueryAdapter => {
  let sorting: string[] = [];
  const criteria: unknown[] = [];
  const { expand } = queryOptions;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let select: string[] | undefined;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let skip: number | undefined;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let take: number | undefined;
  let countQuery = false;

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const oDataVersion = queryOptions.version || DEFAULT_PROTOCOL_VERSION;

  const hasSlice = (): boolean => !!skip || take !== undefined;

  const hasFunction = (criterion: unknown[]): boolean => criterion.some(
    (item) => isFunction(item) || (Array.isArray(item) && hasFunction(item)),
  );

  const requestData = (): ODataRequestParams => {
    const result: ODataRequestParams = {};

    if (!countQuery) {
      if (sorting.length) {
        result.$orderby = sorting.join(',');
      }
      if (skip) {
        result.$skip = skip;
      }
      if (take !== undefined) {
        result.$top = take;
      }
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      result.$select = generateSelect(oDataVersion, select) || undefined;
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      result.$expand = generateExpand(oDataVersion, expand, select) || undefined;
    }

    if (criteria.length) {
      const filterCriteria: unknown = criteria.length < 2 ? criteria[0] : criteria;
      const { fieldTypes, filterToLower } = queryOptions;
      result.$filter = compileCriteria(filterCriteria, oDataVersion, fieldTypes, filterToLower);
    }

    if (countQuery) {
      result.$top = 0;
    }

    if (queryOptions.requireTotalCount || countQuery) {
      // todo: tests!!!
      if (oDataVersion !== 4) {
        // eslint-disable-next-line spellcheck/spell-checker
        result.$inlinecount = 'allpages';
      } else {
        result.$count = 'true';
      }
    }

    return result;
  };

  const tryLiftSelect = (tasks: RemoteTask[]): void => {
    const selectIndex = tasks.findIndex((task) => task.name === 'select');

    if (selectIndex < 0 || !isFunction(tasks[selectIndex].args[0])) return;

    const nextTask = tasks[1 + selectIndex];
    if (nextTask?.name !== 'slice') return;

    tasks[1 + selectIndex] = tasks[selectIndex];
    tasks[selectIndex] = nextTask;
  };

  return {

    optimize: tryLiftSelect,

    exec(url: string): DeferredObj<unknown> {
      return sendRequest(
        oDataVersion,
        {
          url,
          params: extend(requestData(), queryOptions.params),
        },
        {
          beforeSend: queryOptions.beforeSend,
          jsonp: queryOptions.jsonp,
          withCredentials: queryOptions.withCredentials,
          countOnly: countQuery,
          processDatesAsUtc: queryOptions.processDatesAsUtc,
          fieldTypes: queryOptions.fieldTypes,
          isPaged: isFinite(Number(take)),
        },
      );
    },

    multiSort(args: unknown[]): boolean | undefined {
      const rules: string[] = [];

      if (hasSlice()) {
        return false;
      }

      for (const arg of args) {
        const [getter, desc] = Array.isArray(arg) ? arg : [];

        if (typeof getter !== 'string') {
          return false;
        }

        rules.push(desc ? `${serializePropName(getter)} desc` : serializePropName(getter));
      }

      sorting = rules;

      return undefined;
    },

    slice(skipCount: number, takeCount: number): boolean | undefined {
      if (hasSlice()) {
        return false;
      }

      skip = skipCount;
      take = takeCount;

      return undefined;
    },

    filter(...args: unknown[]): boolean | undefined {
      if (hasSlice()) {
        return false;
      }

      const [first] = args;
      const criterion: unknown[] = Array.isArray(first) ? first : args.slice();

      if (hasFunction(criterion)) {
        return false;
      }

      if (criteria.length) {
        criteria.push('and');
      }
      criteria.push(criterion);

      return undefined;
    },

    select(...args: unknown[]): boolean | undefined {
      const [expr] = args;

      if (select || isFunction(expr)) {
        return false;
      }

      select = (Array.isArray(expr) ? expr : args.slice()).map(String);

      return undefined;
    },

    count(): boolean {
      countQuery = true;
      return countQuery;
    },
  };
};

queryAdapters.odata = createODataQueryAdapter;

export const odata = createODataQueryAdapter;
