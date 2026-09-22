import query from 'devextreme/common/data/query';
import type { MockHandler, MockRequest } from '../types';
import { jsonParam, parseLoadOptions } from '../utils';
import type { Row, Summary, SortDescriptor } from './types';

const summaryValue = (rows: Row[], { selector, summaryType }: Summary): unknown => {
  if (summaryType === 'count') {
    return rows.length;
  }

  if (summaryType !== 'sum') {
    return null;
  }

  const numbers = rows
    .map((row) => row[selector])
    .filter((value): value is number => typeof value === 'number');

  return Math.round(numbers.reduce((sum, value) => sum + value, 0) * 100) / 100;
};

const sortItems = (rows: Row[], sort: SortDescriptor[]): Row[] => {
  const [first, ...rest] = sort;

  return rest
    .reduce(
      (sorted, { selector, desc }) => sorted.thenBy(selector, desc),
      query(rows).sortBy(first.selector, first.desc),
    )
    .toArray();
};

const loadResult = (rows: Row[], url: string): unknown => {
  const options = parseLoadOptions(url);
  let items = rows;

  if (options.filter?.length) {
    items = query(rows).filter(options.filter).toArray() as Row[];
  }

  const sort = (options.sort ?? []) as SortDescriptor[];

  if (sort.length) {
    items = sortItems(items, sort);
  }

  const summaries = options.totalSummary as Summary[];

  return {
    data: query(items).slice(options.skip ?? 0, options.take).toArray() as Row[],
    totalCount: options.requireTotalCount ? items.length : -1,
    groupCount: -1,
    summary: summaries?.length
      ? summaries.map((summary) => summaryValue(items, summary))
      : null,
  };
};

const pathPattern = (path: string): RegExp => new RegExp(`${path}/?(?:\\?|$)`, 'i');

const isValidMethods = (req: MockRequest, methods: string[]): boolean => methods
  .includes(req.method.toLowerCase());

export const aspNetLoadHandler = (path: string, rows: Row[]): MockHandler => {
  const pattern = pathPattern(path);

  return {
    matches: (req) => pattern.test(req.url) && isValidMethods(req, ['get', 'options']),
    respond: (req) => (isValidMethods(req, ['options']) ? {} : loadResult(rows, req.url)),
  };
};

export const aspNetMutationHandler = (path: string): MockHandler => {
  const pattern = pathPattern(path);

  return {
    matches: (req) => pattern.test(req.url)
      && isValidMethods(req, ['post', 'put', 'delete', 'options']),
    respond: (req) => (isValidMethods(req, ['post', 'put'])
      ? jsonParam(req.body ? req.body.toString() : '', 'values') ?? {}
      : {}),
  };
};
