"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SORT_ORDER = exports.SORTABLE_CONST = exports.ICONS = exports.CLASSES = exports.ATTRIBUTES = void 0;
const ATTRIBUTES = exports.ATTRIBUTES = {
  treeViewItem: 'tree-view-item',
  allowScrolling: 'allow-scrolling',
  itemGroup: 'item-group'
};
const CLASSES = exports.CLASSES = {
  area: {
    self: 'dx-area',
    box: 'dx-area-box',
    caption: 'dx-area-caption',
    icon: 'dx-area-icon',
    field: 'dx-area-field',
    fieldContainer: 'dx-area-field-container',
    fieldContent: 'dx-area-field-content',
    fieldList: 'dx-area-fields',
    fieldListHeader: 'dx-area-fields-header'
  },
  pivotGrid: {
    dragAction: 'dx-pivotgrid-drag-action',
    fieldsContainer: 'dx-pivotgrid-fields-container'
  },
  fieldChooser: {
    self: 'dx-pivotgridfieldchooser',
    container: 'dx-pivotgridfieldchooser-container',
    contextMenu: 'dx-pivotgridfieldchooser-context-menu'
  },
  layout: {
    zero: 'dx-layout-0',
    second: 'dx-layout-2'
  },
  treeView: {
    self: 'dx-treeview',
    borderVisible: 'dx-treeview-border-visible'
  },
  scrollable: {
    self: 'dx-scrollable'
  },
  allFields: 'dx-all-fields',
  col: 'dx-col',
  headerFilter: 'dx-header-filter',
  row: 'dx-row',
  widget: 'dx-widget'
};
const ICONS = exports.ICONS = {
  all: 'smalliconslayout',
  column: 'columnfield',
  row: 'rowfield',
  filter: 'filter',
  data: 'formula',
  measure: 'formula',
  hierarchy: 'hierarchy',
  dimension: 'detailslayout'
};
const SORTABLE_CONST = exports.SORTABLE_CONST = {
  targets: {
    drag: 'drag'
  }
};
const SORT_ORDER = exports.SORT_ORDER = {
  descending: 'desc',
  ascending: 'asc'
};