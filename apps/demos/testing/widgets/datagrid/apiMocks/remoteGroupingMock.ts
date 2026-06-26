import { RequestMock } from 'testcafe';

const CORS = { 'access-control-allow-origin': '*' };

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
    { key: 'Contoso Toulouse Store', count: 2207 },
    { key: 'Contoso Trenton No.1 Store', count: 2078 },
    { key: 'Contoso Trenton No.2 Store', count: 2106 },
    { key: 'Contoso Urumqi Store', count: 3237 },
    { key: 'Contoso Valletta Store', count: 2239 },
    { key: 'Contoso Vancouver  No.1 Store', count: 2145 },
    { key: 'Contoso Vancouver  No.2 Store', count: 2101 },
    { key: 'Contoso Venezia Store', count: 157 },
    { key: 'Contoso Veradale Store', count: 2041 },
    { key: 'Contoso Vineland Store', count: 2057 },
    { key: 'Contoso Virginia Beach Store', count: 2099 },
    { key: 'Contoso Wapato Store', count: 2140 },
    { key: 'Contoso Warsaw Store', count: 2205 },
    { key: 'Contoso Waterbury Store', count: 2045 },
    { key: 'Contoso Waukesha No.1 Store', count: 2064 },
    { key: 'Contoso Waukesha No.2 Store', count: 2070 },
    { key: 'Contoso West Yorkshire Store', count: 2238 },
    { key: 'Contoso Westminster Store', count: 2037 },
    { key: 'Contoso Wheat Ridge Store', count: 2149 },
    { key: 'Contoso Winchester Store', count: 2060 },
    { key: 'Contoso Worcester No.1 Store', count: 2142 },
    { key: 'Contoso Worcester No.2 Store', count: 2096 },
    { key: 'Contoso Yakima Store', count: 2058 },
    { key: 'Contoso Yerevan Store', count: 3221 },
    { key: 'Contoso Yokohama Store', count: 3220 },
    { key: 'Contoso York Store', count: 2139 },
  ].map(toGroup),
  totalCount: 1000000,
  groupCount: 306,
};

const categoryGroups = {
  data: [
    { key: 'Audio', count: 65 },
    { key: 'Cameras and camcorders', count: 356 },
    { key: 'Cell phones', count: 256 },
    { key: 'Computers', count: 529 },
    { key: 'Games and Toys', count: 56 },
    { key: 'Home Appliances', count: 617 },
    { key: 'Music, Movies and Audio Books', count: 87 },
    { key: 'TV and Video', count: 173 },
  ].map(toGroup),
  totalCount: 2139,
  groupCount: 8,
};

const emptyGroups = { data: [], totalCount: 0, groupCount: 0 };

const isSalesUrl = (url: string): boolean => /\/api\/Sales\b/i.test(url);

const hasFilter = (url: string): boolean => /[?&]filter=/.test(url);

const groupParam = (url: string): string => {
  const match = url.match(/[?&]group=([^&]*)/);
  return match ? decodeURIComponent(match[1]) : '';
};

const isGroupedBy = (url: string, selector: string): boolean => groupParam(url).includes(`"selector":"${selector}"`);

const skipOf = (url: string): number => {
  const match = url.match(/[?&]skip=(\d+)/);
  return match ? Number(match[1]) : 0;
};

const entries: { match: (url: string) => boolean; data: object }[] = [
  {
    match: (url) => isSalesUrl(url) && isGroupedBy(url, 'StoreName') && !hasFilter(url) && skipOf(url) === 0,
    data: storeGroupsInitPage,
  },
  {
    match: (url) => isSalesUrl(url) && isGroupedBy(url, 'StoreName') && !hasFilter(url) && skipOf(url) > 0,
    data: storeGroupsScrolledPage,
  },
  {
    match: (url) => isSalesUrl(url) && isGroupedBy(url, 'ProductCategoryName') && hasFilter(url),
    data: categoryGroups,
  },
  {
    match: (url) => isSalesUrl(url),
    data: emptyGroups,
  },
];

export const remoteGroupingMock = entries.reduce(
  (mock, { match, data }) => mock
    .onRequestTo((req) => match(req.url))
    .respond(data, 200, CORS),
  RequestMock(),
);
