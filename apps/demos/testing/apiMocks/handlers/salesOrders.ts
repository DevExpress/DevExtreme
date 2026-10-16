import type { MockHandler } from '../types';
import {
  hasGroup, isGroupedBy, groupParam, numberParam, skipOf,
} from '../utils';
import flatPage from '../fixtures/salesOrdersFlat.json';
import yearColumns from '../fixtures/salesOrdersCols.json';
import categories from '../fixtures/salesOrdersCategories.json';
import categorySubcategories from '../fixtures/salesOrdersRows.json';
import categoryYears from '../fixtures/salesOrdersCategoryYears.json';
import categorySubcategoryYears from '../fixtures/salesOrdersBoth.json';

// GET /api/Sales/Orders — PivotGrid WebAPIService remoteOperations payloads.

const matches = (url: string): boolean => /\/api\/Sales\/Orders\b/i.test(url);

type GroupPayload = {
  data: unknown[];
  totalCount?: number;
  groupCount?: number;
  summary?: number[];
};

const emptyGroups: GroupPayload = { data: [], totalCount: 0, groupCount: 0 };

const hasYearInterval = (url: string): boolean => groupParam(url).includes('"groupInterval":"year"');

const categoryFilterOf = (url: string): string | null => {
  const match = url.match(/[?&]filter=([^&]*)/);
  if (!match) {
    return null;
  }
  const filter = decodeURIComponent(match[1]);
  const equals = filter.match(/\["ProductCategoryName","=","([^"]*)"\]/);
  return equals ? equals[1] : null;
};

const pageGroups = (payload: GroupPayload, url: string): GroupPayload => {
  const skip = skipOf(url);
  const hasTake = /[?&]take=\d+/.test(url);
  const take = numberParam(url, 'take', payload.data.length);
  const data = hasTake ? payload.data.slice(skip, skip + take) : payload.data;

  // Remote store pads with [...Array(skip)] when groupCount is present.
  // If skip is undefined (no paging), Array(undefined) inserts a hole and
  // creates an empty phantom column/row — only send groupCount with take/skip.
  const result: GroupPayload = {
    data,
    totalCount: payload.totalCount,
    summary: payload.summary,
  };
  if (hasTake) {
    result.groupCount = payload.groupCount ?? payload.data.length;
  }
  return result;
};

const subcategoryYearsFor = (category: string): GroupPayload => {
  const parent = categorySubcategoryYears.data.find((item) => item.key === category);
  if (!parent?.items) {
    return emptyGroups;
  }
  return {
    data: parent.items,
    totalCount: categorySubcategoryYears.totalCount,
    summary: parent.summary,
  };
};

const groupedPage = (url: string): GroupPayload => {
  const byCategory = isGroupedBy(url, 'ProductCategoryName');
  const bySubcategory = isGroupedBy(url, 'ProductSubcategoryName');
  const byDate = isGroupedBy(url, 'DateKey') && hasYearInterval(url);
  const categoryFilter = categoryFilterOf(url);

  if (byCategory && bySubcategory && byDate) {
    if (categoryFilter) {
      const parent = categorySubcategoryYears.data.find((item) => item.key === categoryFilter);
      return parent ? { data: [parent], totalCount: 1, summary: parent.summary } : emptyGroups;
    }
    return pageGroups(categorySubcategoryYears as GroupPayload, url);
  }

  if (bySubcategory && byDate && categoryFilter) {
    return pageGroups(subcategoryYearsFor(categoryFilter), url);
  }

  if (byCategory && byDate && !bySubcategory) {
    if (categoryFilter) {
      const parent = categoryYears.data.find((item) => item.key === categoryFilter);
      return parent ? { data: [parent], totalCount: 1, summary: parent.summary } : emptyGroups;
    }
    return pageGroups(categoryYears as GroupPayload, url);
  }

  if (byCategory && bySubcategory && !byDate) {
    return pageGroups(categorySubcategories as GroupPayload, url);
  }

  if (byCategory && !bySubcategory && !byDate) {
    return pageGroups(categories as GroupPayload, url);
  }

  if (byDate && !byCategory && !bySubcategory) {
    return pageGroups(yearColumns as GroupPayload, url);
  }

  return emptyGroups;
};

const flat = (url: string): object => {
  const skip = skipOf(url);
  const take = numberParam(url, 'take', flatPage.data.length);
  return {
    data: flatPage.data.slice(skip, skip + take),
  };
};

export const salesOrdersHandler: MockHandler = {
  matches: (req) => matches(req.url),
  respond: (req) => (hasGroup(req.url) ? groupedPage(req.url) : flat(req.url)),
};
