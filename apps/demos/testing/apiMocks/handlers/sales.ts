import type { MockHandler } from '../types';
import {
  pad, numberParam, skipOf, hasGroup, hasFilter, isGroupedBy,
} from '../utils';

// GET /api/Sales, excluding /api/Sales/Orders

const isSalesOrdersUrl = (url: string): boolean => /\/api\/Sales\/Orders\b/i.test(url);

const matches = (url: string): boolean => /\/api\/Sales\b/i.test(url) && !isSalesOrdersUrl(url);

// ---------------------------------------------------------------------------
// Grouped responses
// ---------------------------------------------------------------------------

const toGroup = ({ key, count }: { key: string; count: number }) => ({
  key,
  items: null,
  count,
  summary: [count],
});

const storeGroupsInitPage = {
  data: [
    { key: 'Contoso Albany Store', count: 2058 },
    { key: 'Contoso Alexandria Store', count: 2021 },
    { key: 'Contoso Amsterdam Store', count: 2064 },
    { key: 'Contoso Anchorage Store', count: 2072 },
    { key: 'Contoso Annapolis Store', count: 2131 },
    { key: 'Contoso Appleton Store', count: 2045 },
    { key: 'Contoso Arlington Store', count: 2049 },
    { key: 'Contoso Ashgabat  No.2 Store', count: 3275 },
    { key: 'Contoso Ashgabat No.1 Store', count: 3285 },
    { key: 'Contoso Asia Online Store', count: 56357 },
    { key: 'Contoso Asia Reseller', count: 38313 },
    { key: 'Contoso Athens Store', count: 2218 },
    { key: 'Contoso Atlantic City Store', count: 2104 },
    { key: 'Contoso Attleboro Store', count: 2043 },
    { key: 'Contoso Aurora Store', count: 2075 },
    { key: 'Contoso Austin Store', count: 2029 },
    { key: 'Contoso Back River Store', count: 2015 },
    { key: 'Contoso Bacliff Store', count: 2100 },
    { key: 'Contoso Baildon Store', count: 2144 },
    { key: 'Contoso Baltimore Store', count: 2103 },
  ].map(toGroup),
  totalCount: 1000000,
  groupCount: 306,
};

const storeGroupsScrolledPage = {
  data: [
    { key: 'Contoso Guangzhou Store', count: 476 },
    { key: 'Contoso Hackensack Store', count: 2090 },
    { key: 'Contoso Hartford Store', count: 2079 },
    { key: 'Contoso Haverhill Store', count: 2075 },
    { key: 'Contoso Hillsboro Store', count: 2113 },
    { key: 'Contoso Hingham Store', count: 1972 },
    { key: 'Contoso Hoboken Store', count: 2033 },
    { key: 'Contoso Hofheim Store', count: 2182 },
    { key: 'Contoso Holyoke Store', count: 1980 },
    { key: 'Contoso Hong Kong No.1 Store', count: 3271 },
    { key: 'Contoso Hong Kong No.2 Store', count: 2960 },
    { key: 'Contoso Houston No.1 Store', count: 2078 },
    { key: 'Contoso Houston No.2 Store', count: 2117 },
    { key: 'Contoso Houston No.3 Store', count: 2002 },
    { key: 'Contoso Houston No.4 Store', count: 2068 },
    { key: 'Contoso Howard Store', count: 2023 },
    { key: 'Contoso Humble Store', count: 2050 },
    { key: 'Contoso Islamabad  No.2 Store', count: 2177 },
    { key: 'Contoso Islamabad No.1 Store', count: 3207 },
    { key: 'Contoso Ithaca Store', count: 2036 },
  ].map(toGroup),
  totalCount: 1000000,
  groupCount: 306,
};

const categoryGroups = {
  data: [
    { key: 'Audio', count: 63 },
    { key: 'Cameras and camcorders', count: 349 },
    { key: 'Cell phones', count: 254 },
    { key: 'Computers', count: 548 },
    { key: 'Games and Toys', count: 48 },
    { key: 'Home Appliances', count: 592 },
    { key: 'Music, Movies and Audio Books', count: 82 },
    { key: 'TV and Video', count: 177 },
  ].map(toGroup),
  totalCount: 2113,
  groupCount: 8,
};

const emptyGroups = { data: [], totalCount: 0, groupCount: 0 };

// ---------------------------------------------------------------------------
// Flat page
// ---------------------------------------------------------------------------

const TOTAL_COUNT = 1000000;

const stores = [
  'Contoso Albany Store', 'Contoso Boston Store', 'Contoso Chicago Store',
  'Contoso Denver Store', 'Contoso Eugene Store', 'Contoso Fresno Store',
];

const categories = [
  'Audio', 'Cameras and camcorders', 'Cell phones',
  'Computers', 'Home Appliances', 'TV and Video',
];

const products = [
  'Contoso 512MB MP3 Player E51 Silver',
  'Adventure Works 26" 720p LCD HDTV M140',
  'The Phone Company Touch Screen Phones PE7 Black',
  'Proseware Projector 1080p LCD86 Silver',
  'Fabrikam Refrigerator 24.7CuFt X9800 White',
  'Litware Home Theater System 5.1 Channel M515 Silver',
];

const salesDate = (index: number): string => {
  const base = new Date(Date.UTC(2024, 0, 1));
  base.setUTCDate(base.getUTCDate() + index);
  return `${base.getUTCFullYear()}-${pad(base.getUTCMonth() + 1)}-${pad(base.getUTCDate())}T00:00:00`;
};

const buildRow = (index: number) => ({
  Id: index + 1,
  StoreName: stores[index % stores.length],
  ProductCategoryName: categories[index % categories.length],
  ProductName: products[index % products.length],
  DateKey: salesDate(index),
  SalesAmount: 100 + ((index * 37) % 900),
});

const flatPage = (url: string): object => {
  const skip = skipOf(url);
  const take = numberParam(url, 'take', 100);
  return {
    data: Array.from({ length: take }, (_, i) => buildRow(skip + i)),
    totalCount: TOTAL_COUNT,
  };
};

const groupedPage = (url: string): object => {
  if (isGroupedBy(url, 'StoreName') && !hasFilter(url)) {
    return skipOf(url) === 0 ? storeGroupsInitPage : storeGroupsScrolledPage;
  }
  if (isGroupedBy(url, 'ProductCategoryName') && hasFilter(url)) {
    return categoryGroups;
  }
  return emptyGroups;
};

export const salesHandler: MockHandler = {
  matches: (req) => matches(req.url),
  respond: (req) => (hasGroup(req.url) ? groupedPage(req.url) : flatPage(req.url)),
};
