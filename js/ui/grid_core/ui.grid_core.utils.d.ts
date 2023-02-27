export interface Utils {
  renderNoDataText: (this: any, $element) => any;
  renderLoadPanel: (this: any, $element, $container, isLocalStore) => any;
  calculateLoadPanelPosition: ($element) => any;
  getIndexByKey: (key, items, keyName?) => any;
  combineFilters: (filters, operation?) => any;
  checkChanges: (changes, changeNames) => any;
  equalFilterParameters: any;
  proxyMethod: (instance, methodName, defaultResult?) => any;
  formatValue: any;
  getFormatOptionsByColumn: (column, target) => any;
  getDisplayValue: (column, value, data, rowType?) => any;
  getGroupRowSummaryText: (summaryItems, summaryTexts) => any;
  getSummaryText: any;
  normalizeSortingInfo: any;
  getFormatByDataType: (dataType) => any;
  getHeaderFilterGroupParameters: (column, remoteGrouping) => any;
  equalSortParameters: (sortParameters1, sortParameters2, ignoreIsExpanded?) => any;
  getPointsByColumns: (items, pointCreated, isVertical, startColumnIndex) => any;
  getExpandCellTemplate: () => any;
  setEmptyText: any;
  isDateType: any;
  getSelectionRange: (focusedElement) => any;
  setSelectionRange: (focusedElement, selectionRange) => any;
  focusAndSelectElement: (component, $element) => any;
  getWidgetInstance: any;
  getLastResizableColumnIndex: (columns, resultWidths) => any;
  isElementInCurrentGrid: (controller, $element) => any;
  isVirtualRowRendering: (that) => any;
  getPixelRatio: (window) => any;
  _setPixelRatioFn: (value) => any;
  getContentHeightLimit: (browser) => any;
}

declare const utils: Utils;

export default utils;
