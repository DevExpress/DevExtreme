import type { CellClickEvent } from '@js/ui/pivot_grid';
import type { DataKey } from '@ts/core/element_data';

// The public Field type lives in ui/pivot_grid/data_source, which internal code does not import
type Field = NonNullable<CellClickEvent['columnFields']>[number];

export type FieldChooserField = Field & { index: number };

export const FIELD_DATA_KEY: DataKey<FieldChooserField> = 'field';

export const ATTRIBUTES = {
  treeViewItem: 'tree-view-item',
  allowScrolling: 'allow-scrolling',
  itemGroup: 'item-group',
} as const;

export const CLASSES = {
  area: {
    self: 'dx-area',
    box: 'dx-area-box',
    caption: 'dx-area-caption',
    icon: 'dx-area-icon',
    field: 'dx-area-field',
    fieldContainer: 'dx-area-field-container',
    fieldContent: 'dx-area-field-content',
    fieldList: 'dx-area-fields',
    fieldListHeader: 'dx-area-fields-header',
  },
  pivotGrid: {
    dragAction: 'dx-pivotgrid-drag-action',
    fieldsContainer: 'dx-pivotgrid-fields-container',
  },
  fieldChooser: {
    self: 'dx-pivotgridfieldchooser',
    container: 'dx-pivotgridfieldchooser-container',
    contextMenu: 'dx-pivotgridfieldchooser-context-menu',
  },
  layout: {
    zero: 'dx-layout-0',
    second: 'dx-layout-2',
  },
  treeView: {
    self: 'dx-treeview',
    borderVisible: 'dx-treeview-border-visible',
  },
  scrollable: {
    self: 'dx-scrollable',
  },
  allFields: 'dx-all-fields',
  col: 'dx-col',
  headerFilter: 'dx-header-filter',
  row: 'dx-row',
  widget: 'dx-widget',
} as const;

export const ICONS = {
  all: 'smalliconslayout',
  column: 'columnfield',
  row: 'rowfield',
  filter: 'filter',
  data: 'formula',

  measure: 'formula',
  hierarchy: 'hierarchy',
  dimension: 'detailslayout',
} as const;

export const SORTABLE_CONST = {
  targets: {
    drag: 'drag',
  },
} as const;

export const SORT_ORDER = {
  descending: 'desc',
  ascending: 'asc',
} as const;
export type SortOrderType = typeof SORT_ORDER[keyof typeof SORT_ORDER];
