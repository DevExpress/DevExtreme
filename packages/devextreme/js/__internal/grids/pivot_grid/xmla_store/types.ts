import type {
  DiscoveredField,
  PivotGridField,
  PivotGridHeaderItem,
  PivotGridLoadOptions,
} from '@ts/grids/pivot_grid/types';

/** getFields() gives the levels of a multi-level hierarchy its hierarchyName. */
export type XmlaField = PivotGridField & {
  hierarchyName?: string;
  /** The MDX expression of a calculated measure. */
  expression?: unknown;
};

export type XmlaLoadOptions = Omit<
  PivotGridLoadOptions,
  'rows' | 'columns' | 'values' | 'filters'
> & {
  rows: XmlaField[];
  columns: XmlaField[];
  values?: XmlaField[];
  filters?: XmlaField[];
  delay?: number;
};

/** load() requests the totals with the paging reset to null. */
export type XmlaMdxOptions = Omit<
  XmlaLoadOptions,
  'rowSkip' | 'rowTake' | 'columnSkip' | 'columnTake'
> & {
  rowSkip?: number | null;
  rowTake?: number | null;
  columnSkip?: number | null;
  columnTake?: number | null;
  totalsOnly?: boolean;
};

/** The dataFields of the visible levels, by hierarchyName. */
export type XmlaVisibleLevels = Record<string, (string | undefined)[]>;

/** generateMDX() sets measureCount and visibleLevels for parseResult(). */
export interface XmlaParseOptions {
  skipValues?: boolean;
  measureCount?: number;
  visibleLevels?: XmlaVisibleLevels;
}

/** Old IE gave XML nodes a text property instead of textContent. */
export type XmlaNode = Element & { text?: string };

/** A tuple member of the response. An axis the response lacks gets one member with only a level. */
export interface XmlaAxisMember {
  level: number;
  caption?: string;
  value?: string | number;
  index?: number;
  hasValue?: boolean;
  name?: string;
  hierarchyName?: string | null;
  parentName?: string;
  levelName?: string;
}

export interface XmlaHeaderItem extends PivotGridHeaderItem {
  text?: string;
  key?: string;
  level?: number;
  levelName?: string;
  hierarchyName?: string | null;
  parentName?: string;
  added?: boolean;
  children?: XmlaHeaderItems;
}

/** processMember() hashes the items of a level by name. */
export type XmlaHeaderItems = XmlaHeaderItem[] & {
  hash?: Record<string, XmlaHeaderItem>;
  grandTotalHash?: Record<string, XmlaHeaderItem>;
};

export type XmlaCellValue = number | string | null;

export interface XmlaLoadResult {
  columns: XmlaHeaderItem[];
  rows: XmlaHeaderItem[];
  values?: XmlaCellValue[][][];
  grandTotalColumnIndex?: number;
  grandTotalRowIndex?: number;
  rowCount?: number;
  columnCount?: number;
}

export interface XmlaDimensions {
  /** The captions of the dimensions, by unique name. */
  names: Record<string, string>;
  /** The unique names of the default hierarchies. */
  defaultHierarchies: Record<string, boolean>;
}

export interface XmlaDiscoveredField extends DiscoveredField {
  dimension: string;
  caption: string;
  hierarchyName?: string;
  isMeasure: boolean;
  isDefault: boolean;
}
