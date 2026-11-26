import { name as clickEventName } from '@js/common/core/events/click';
import { addNamespace } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender, deferUpdate, noop } from '@js/core/utils/common';
import { Deferred, when } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { each } from '@js/core/utils/iterator';
import {
  getHeight, getOuterHeight,
  getWidth, setHeight,
} from '@js/core/utils/size';
import { format as formatString } from '@js/core/utils/string';
import { isDefined } from '@js/core/utils/type';
import { getWindow, hasWindow } from '@js/core/utils/window';
import type { ButtonStyle, Properties } from '@js/ui/button';
import Button from '@js/ui/button';
import ContextMenu from '@js/ui/context_menu';
import type { Properties as PivotGridProperties } from '@js/ui/pivot_grid';
import type { ToolbarItem } from '@js/ui/popup';
import Popup from '@js/ui/popup/ui.popup';
import { restoreFocus, saveFocusedElementInfo } from '@js/ui/shared/accessibility';
import { current, isGeneric } from '@js/ui/themes';
import { getData } from '@ts/core/element_data';
import Widget from '@ts/core/widget/widget';
import eventsEngine from '@ts/events/core/events_engine';
import gridCoreUtils from '@ts/grids/grid_core/utils';

import { ChartIntegrationMixin } from './chart_integration/chart_integration';
import DataAreaImport from './data_area/data_area';
import DataControllerImport from './data_controller/data_controller';
import { ExportMixin } from './export/export';
import { getFieldsHotkeysA11yLabel } from './field_chooser/a11y';
import { FIELD_DATA_KEY } from './field_chooser/const';
import { FieldChooserBase } from './field_chooser/field_chooser_base';
import { FieldChooser } from './field_chooser/m_field_chooser';
import { FieldsArea } from './fields_area/fields_area';
import HeadersArea from './headers_area/headers_area';
import { FAKE_TABLE_CLASS, HORIZONTAL_HEADERS_AREA_CLASS, VERTICAL_HEADERS_AREA_CLASS } from './keyboard_navigation/const';
import { RovingTabIndex } from './keyboard_navigation/roving_tab_index';
import type { CellNavigationDirection } from './keyboard_navigation/table_cell_navigation';
import { buildCellMatrix, getAdjacentCell } from './keyboard_navigation/table_cell_navigation';
import { findField, mergeArraysByMaxValue, setFieldProperty } from './widget_utils';

type FieldChooserOptions = NonNullable<PivotGridProperties['fieldChooser']>;
type FieldPanelOptions = NonNullable<PivotGridProperties['fieldPanel']>;

const window = getWindow();

const DATA_AREA_CELL_CLASS = 'dx-area-data-cell';
const ROW_AREA_CELL_CLASS = 'dx-area-row-cell';
const COLUMN_AREA_CELL_CLASS = 'dx-area-column-cell';
const DESCRIPTION_AREA_CELL_CLASS = 'dx-area-description-cell';
const BORDERS_CLASS = 'dx-pivotgrid-border';
const PIVOTGRID_CLASS = 'dx-pivotgrid';
const ROW_LINES_CLASS = 'dx-row-lines';
const BOTTOM_ROW_CLASS = 'dx-bottom-row';
const BOTTOM_BORDER_CLASS = 'dx-bottom-border';
const FIELDS_CONTAINER_CLASS = 'dx-pivotgrid-fields-container';
const FIELDS_CLASS = 'dx-area-fields';
const FIELD_CHOOSER_POPUP_CLASS = 'dx-fieldchooser-popup';
const INCOMPRESSIBLE_FIELDS_CLASS = 'dx-incompressible-fields';
const OVERFLOW_HIDDEN_CLASS = 'dx-overflow-hidden';

const TR = '<tr>';
const TD = '<td>';
const DIV = '<div>';
const TEST_HEIGHT = 66666;

const FIELD_CALCULATED_OPTIONS = ['allowSorting', 'allowSortingBySummary', 'allowFiltering', 'allowExpandAll'];

const ARROW_KEY_DIRECTIONS: Record<string, CellNavigationDirection> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

function getArraySum(array) {
  let sum = 0;

  each(array, (_, value) => {
    sum += value || 0;
  });

  return sum;
}

function adjustSizeArray(sizeArray, space) {
  const delta = space / sizeArray.length;

  for (let i = 0; i < sizeArray.length; i += 1) {
    sizeArray[i] -= delta;
  }
}

function unsubscribeScrollEvents(area) {
  area.off('scroll')
    .off('stop');
}

function subscribeToScrollEvent(area, handler) {
  unsubscribeScrollEvents(area);

  area.on('scroll', handler)
    .on('stop', handler);
}

function getCommonBorderWidth(elements, direction) {
  const borderStyleNames = direction === 'width' ? ['borderLeftWidth', 'borderRightWidth'] : ['borderTopWidth', 'borderBottomWidth'];
  let width = 0;

  each(elements, (_, elem) => {
    const computedStyle = window.getComputedStyle(elem.get(0));
    borderStyleNames.forEach((borderStyleName) => {
      width += parseFloat(computedStyle[borderStyleName]) || 0;
    });
  });

  return width;
}

function clickedOnFieldsArea($targetElement) {
  return $targetElement.closest(`.${FIELDS_CLASS}`).length || $targetElement.find(`.${FIELDS_CLASS}`).length;
}

type CellEventArgs = ReturnType<PivotGrid['_createCellArgs']> & { cancel?: boolean };

const isCellEventArgs = (
  args: ReturnType<PivotGrid['_createEventArgs']>,
): args is ReturnType<PivotGrid['_createEventArgs']> & CellEventArgs => 'cell' in args;

class PivotGrid extends Widget {
  _dataController: any;

  _columnsAreaNavigation: RovingTabIndex | undefined;

  _rowsAreaNavigation: RovingTabIndex | undefined;

  _contextMenuOwnerNavigation: RovingTabIndex | undefined;

  _scrollLeft: any;

  _scrollTop: any;

  _actions: any;

  _hideLoadingTimeoutID: any;

  _hasHeight: any;

  _scrollUpdating: any;

  _pivotGridContainer: any;

  _contextMenu: any;

  _loadPanel: any;

  _startLoadingTime: any;

  _dataArea: any;

  _fieldChooserPopup: any;

  _fieldChooserBase: any;

  _columnsArea: any;

  _rowsArea: any;

  _rowFields: any;

  _columnFields: any;

  _filterFields: any;

  _dataFields: any;

  _testResultWidths: any;

  _testResultHeights: any;

  __scrollBarUseNative: any;

  __scrollBarWidth: any;

  $fieldChooserButton?: dxElementWrapper;

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {

      scrolling: {
        timeout: 300,
        renderingThreshold: 150,
        minTimeout: 10,
        mode: 'standard',
        useNative: 'auto',
        removeInvisiblePages: true,
        virtualRowHeight: 50,
        virtualColumnWidth: 100,
        loadTwoPagesOnStart: true,
      },
      encodeHtml: true,
      dataSource: null,
      activeStateEnabled: false,
      fieldChooser: {
        minWidth: 250,
        minHeight: 250,
        enabled: true,
        allowSearch: false,
        searchTimeout: 500,
        layout: 0,
        title: localizationMessage.format('dxPivotGrid-fieldChooserTitle'),
        width: 600,
        height: 600,
        applyChangesMode: 'instantly',
      },
      onContextMenuPreparing: undefined,
      allowSorting: false,
      allowSortingBySummary: false,
      allowFiltering: false,
      allowExpandAll: false,
      wordWrapEnabled: true,
      fieldPanel: {
        showColumnFields: true,
        showFilterFields: true,
        showDataFields: true,

        showRowFields: true,
        allowFieldDragging: true,
        visible: false,

        texts: {
          columnFieldArea: localizationMessage.format('dxPivotGrid-columnFieldArea'),
          rowFieldArea: localizationMessage.format('dxPivotGrid-rowFieldArea'),
          filterFieldArea: localizationMessage.format('dxPivotGrid-filterFieldArea'),
          dataFieldArea: localizationMessage.format('dxPivotGrid-dataFieldArea'),
        },
      },
      dataFieldArea: 'column',

      export: {
        enabled: false,
        fileName: 'PivotGrid',
      },
      showRowTotals: true,
      showRowGrandTotals: true,
      showColumnTotals: true,
      showColumnGrandTotals: true,
      hideEmptySummaryCells: true,
      showTotalsPrior: 'none',
      rowHeaderLayout: 'standard',

      loadPanel: {
        enabled: true,
        text: localizationMessage.format('Loading'),
        width: 200,
        height: 70,
        showIndicator: true,
        showPane: true,
      },
      texts: {
        grandTotal: localizationMessage.format('dxPivotGrid-grandTotal'),
        total: localizationMessage.getFormatter('dxPivotGrid-total'),
        noData: localizationMessage.format('dxDataGrid-noDataText'),
        showFieldChooser: localizationMessage.format('dxPivotGrid-showFieldChooser'),
        expandAll: localizationMessage.format('dxPivotGrid-expandAll'),
        collapseAll: localizationMessage.format('dxPivotGrid-collapseAll'),
        sortColumnBySummary: localizationMessage.getFormatter('dxPivotGrid-sortColumnBySummary'),
        sortRowBySummary: localizationMessage.getFormatter('dxPivotGrid-sortRowBySummary'),
        removeAllSorting: localizationMessage.format('dxPivotGrid-removeAllSorting'),
        exportToExcel: localizationMessage.format('dxDataGrid-exportToExcel'),
        dataNotAvailable: localizationMessage.format('dxPivotGrid-dataNotAvailable'),
      },
      onCellClick: undefined,
      onCellPrepared: undefined,
      showBorders: false,

      stateStoring: {
        enabled: false,
        storageKey: undefined,
        type: 'localStorage',
        customLoad: null,
        customSave: null,
        savingTimeout: 2000,
      },

      onExpandValueChanging: null,
      renderCellCountLimit: 20000,
      onExporting: undefined,
      headerFilter: {
        width: 252,
        height: 325,
        allowSelectAll: true,
        showRelevantValues: false,
        search: {
          enabled: false,
          timeout: 500,
          editorOptions: {},
          mode: 'contains',
        },
        texts: {
          emptyValue: localizationMessage.format('dxDataGrid-headerFilterEmptyValue'),
          ok: localizationMessage.format('dxDataGrid-headerFilterOK'),
          cancel: localizationMessage.format('dxDataGrid-headerFilterCancel'),
        },
      },
    });
  }

  _updateCalculatedOptions(fields) {
    each(fields, (_, field) => {
      each(FIELD_CALCULATED_OPTIONS, (_, optionName) => {
        const isCalculated = field._initProperties
          && (optionName in field._initProperties)
          && (field._initProperties[optionName] === undefined);
        const needUpdate = field[optionName] === undefined || isCalculated;
        if (needUpdate) {
          setFieldProperty(field, optionName, this.option(optionName));
        }
      });
    });
  }

  _getDataControllerOptions() {
    return {
      component: this,
      dataSource: this.option('dataSource'),
      texts: this.option('texts'),
      showRowTotals: this.option('showRowTotals'),
      showRowGrandTotals: this.option('showRowGrandTotals'),
      showColumnTotals: this.option('showColumnTotals'),
      showTotalsPrior: this.option('showTotalsPrior'),
      showColumnGrandTotals: this.option('showColumnGrandTotals'),
      dataFieldArea: this.option('dataFieldArea'),
      rowHeaderLayout: this.option('rowHeaderLayout'),
      hideEmptySummaryCells: this.option('hideEmptySummaryCells'),

      onFieldsPrepared: (fields) => {
        this._updateCalculatedOptions(fields);
      },
    };
  }

  _initDataController() {
    this._dataController && this._dataController.dispose();

    this._dataController = new DataControllerImport
      // @ts-expect-error the widget's options aren't typed yet
      .DataController(this._getDataControllerOptions());

    if (hasWindow()) {
      this._dataController.changed.add(() => {
        this._render();
      });
    }

    this._dataController.scrollChanged.add((options) => {
      this._scrollLeft = options.left;
      this._scrollTop = options.top;
    });

    this._dataController.loadingChanged.add(() => {
      // @ts-expect-error ts-error
      this._updateLoading();
    });

    this._dataController.progressChanged.add(this._updateLoading.bind(this));

    this._dataController.dataSourceChanged.add(() => {
      this._trigger('onChanged', undefined);
    });

    const expandValueChanging = this.option('onExpandValueChanging');

    if (expandValueChanging) {
      this._dataController.expandValueChanging.add((e) => {
        // @ts-expect-error ts-error
        expandValueChanging(e);
      });
    }
  }

  _init() {
    super._init();
    this._initDataController();

    this._scrollLeft = this._scrollTop = null;
    this._initActions();
  }

  _initActions() {
    this._actions = {
      onChanged: this._createActionByOption('onChanged'),
      onContextMenuPreparing: this._createActionByOption('onContextMenuPreparing'),
      onCellClick: this._createActionByOption('onCellClick'),
      onExporting: this._createActionByOption('onExporting'),
      onCellPrepared: this._createActionByOption('onCellPrepared'),
    };
  }

  _trigger(eventName, eventArg) {
    this._actions[eventName](eventArg);
  }

  _optionChanged(args) {
    if (FIELD_CALCULATED_OPTIONS.includes(args.name)) {
      const fields = this.getDataSource().fields();
      this._updateCalculatedOptions(fields);
    }

    switch (args.name) {
      case 'dataSource':
      case 'allowSorting':
      case 'allowFiltering':
      case 'allowExpandAll':
      case 'allowSortingBySummary':
      case 'scrolling':
      case 'stateStoring':
        this._initDataController();
        this.getFieldChooserPopup().hide();
        this._renderFieldChooser();
        this._invalidate();
        break;
      case 'texts':
      case 'showTotalsPrior':
      case 'showRowTotals':
      case 'showRowGrandTotals':
      case 'showColumnTotals':
      case 'showColumnGrandTotals':
      case 'hideEmptySummaryCells':
      case 'dataFieldArea':
        this._dataController.updateViewOptions(this._getDataControllerOptions());
        break;
      case 'useNativeScrolling':
      case 'encodeHtml':
      case 'renderCellCountLimit':
        break;
      case 'rtlEnabled':
        super._optionChanged(args);
        this._renderFieldChooser();
        this._renderContextMenu();
        hasWindow() && this._renderLoadPanel(this._dataArea.groupElement(), this.$element());
        this._invalidate();
        break;
      case 'export':
        this._renderDescriptionArea();
        break;
      case 'onExpandValueChanging':
        break;
      case 'onCellClick':
      case 'onContextMenuPreparing':
      case 'onExporting':
      case 'onExported':
      case 'onFileSaving':
      case 'onCellPrepared':
        this._actions[args.name] = this._createActionByOption(args.name);
        break;
      case 'fieldChooser':
        this._renderFieldChooser();
        this._renderDescriptionArea();
        break;
      case 'loadPanel':
        if (hasWindow()) {
          if (args.fullName === 'loadPanel.enabled') {
            clearTimeout(this._hideLoadingTimeoutID);
            this._renderLoadPanel(this._dataArea.groupElement(), this.$element());
          } else {
            this._renderLoadPanel(this._dataArea.groupElement(), this.$element());
            this._invalidate();
          }
        }
        break;
      case 'fieldPanel':
        this._renderDescriptionArea();
        this._invalidate();
        break;
      case 'headerFilter':
        this._renderFieldChooser();
        this._invalidate();
        break;
      case 'showBorders':
        this._tableElement().toggleClass(BORDERS_CLASS, !!args.value);
        this.updateDimensions();
        break;
      case 'wordWrapEnabled':
        this._tableElement().toggleClass('dx-word-wrap', !!args.value);
        this.updateDimensions();
        break;
      case 'rowHeaderLayout':
        this._tableElement().find(`.${ROW_AREA_CELL_CLASS}`).toggleClass('dx-area-tree-view', args.value === 'tree');
        this._dataController.updateViewOptions(this._getDataControllerOptions());
        break;
      case 'height':
      case 'width':
        this._hasHeight = null;
        super._optionChanged(args);
        this.resize();
        break;
      default:
        super._optionChanged(args);
    }
  }

  _updateScrollPosition(columnsArea, rowsArea, dataArea, force = false) {
    let scrollTop;
    let scrollLeft;
    const scrolled = this._scrollTop || this._scrollLeft;

    if (this._scrollUpdating) return; // T645458

    this._scrollUpdating = true;

    if (rowsArea && !rowsArea.hasScroll() && this._hasHeight) {
      this._scrollTop = null;
    }

    if (columnsArea && !columnsArea.hasScroll()) {
      this._scrollLeft = null;
    }
    if (this._scrollTop !== null || this._scrollLeft !== null || scrolled || this.option('rtlEnabled')) {
      scrollTop = this._scrollTop || 0;
      scrollLeft = this._scrollLeft || 0;

      dataArea.scrollTo({ left: scrollLeft, top: scrollTop }, force);
      columnsArea.scrollTo({ left: scrollLeft }, force);
      rowsArea.scrollTo({ top: scrollTop }, force);
      this._dataController.updateWindowScrollPosition(this._scrollTop);
    }

    this._scrollUpdating = false;
  }

  _subscribeToEvents(columnsArea, rowsArea, dataArea) {
    const scrollHandler = (e, area) => {
      const { scrollOffset } = e;

      const scrollable = area._getScrollable();

      const leftOffset = scrollable.option('direction') !== 'vertical' ? scrollOffset.left : this._scrollLeft;
      const topOffset = scrollable.option('direction') !== 'horizontal' && this._hasHeight ? scrollOffset.top : this._scrollTop;

      if ((this._scrollLeft || 0) !== (leftOffset || 0)
        || (this._scrollTop || 0) !== (topOffset || 0)) {
        this._scrollLeft = leftOffset;
        this._scrollTop = topOffset;

        this._updateScrollPosition(columnsArea, rowsArea, dataArea);

        if (this.option('scrolling.mode') === 'virtual') {
          this._dataController.setViewportPosition(this._scrollLeft, this._scrollTop);
        }
      }
    };

    each([columnsArea, rowsArea, dataArea], (_, area) => {
      subscribeToScrollEvent(area, (e) => scrollHandler(e, area));
    });

    !this._hasHeight && this._dataController.subscribeToWindowScrollEvents(dataArea.groupElement());
  }

  _clean() {
    noop();
  }

  _needDelayResizing(cellsInfo) {
    const cellsCount = cellsInfo.length * (cellsInfo.length ? cellsInfo[0].length : 0);
    return cellsCount > Number(this.option('renderCellCountLimit'));
  }

  _renderFieldChooser() {
    const container = this._pivotGridContainer;
    const fieldChooserOptions = (this.option('fieldChooser') || {}) as FieldChooserOptions;
    const toolbarItems: ToolbarItem[] = fieldChooserOptions.applyChangesMode === 'onDemand' ? [
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: localizationMessage.format('OK'),
          onClick: () => {
            this.getFieldChooserPopup().$content().dxPivotGridFieldChooser('applyChanges');
            this.getFieldChooserPopup().hide();
          },
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: localizationMessage.format('Cancel'),
          onClick: () => {
            this.getFieldChooserPopup().hide();
          },
        },
      },
    ] : [];
    const fieldChooserComponentOptions = {
      layout: fieldChooserOptions.layout,
      texts: fieldChooserOptions.texts || {},
      dataSource: this.getDataSource(),
      allowSearch: fieldChooserOptions.allowSearch,
      searchTimeout: fieldChooserOptions.searchTimeout,
      width: undefined,
      height: undefined,
      headerFilter: this.option('headerFilter'),
      encodeHtml: this.option('fieldChooser.encodeHtml') ?? this.option('encodeHtml'),
      applyChangesMode: fieldChooserOptions.applyChangesMode,
      rtlEnabled: this.option('rtlEnabled'),
      onContextMenuPreparing: (e) => {
        this._trigger('onContextMenuPreparing', e);
      },
    };
    const popupOptions = {
      shading: false,
      title: fieldChooserOptions.title,
      width: fieldChooserOptions.width,
      height: fieldChooserOptions.height,
      showCloseButton: true,
      resizeEnabled: true,
      // @ts-expect-error ts-error
      minWidth: fieldChooserOptions.minWidth,
      // @ts-expect-error ts-error
      minHeight: fieldChooserOptions.minHeight,
      toolbarItems,
      onResize(e) {
        e.component.$content().dxPivotGridFieldChooser('updateDimensions');
      },
      onShown: (e) => {
        this._createComponent(
          e.component.content(),
          FieldChooser,
          // @ts-expect-error the widget's options aren't typed yet
          fieldChooserComponentOptions,
        );
      },
      onHidden: (e) => {
        const fieldChooser = e.component.$content().dxPivotGridFieldChooser('instance');
        fieldChooser.resetTreeView();
        fieldChooser.cancelChanges();

        if (this.$fieldChooserButton) {
          this.$fieldChooserButton.get<HTMLElement>(0).focus();
        }
      },
    };

    if (this.getFieldChooserPopup()) {
      this._fieldChooserPopup.option(popupOptions);
      this._fieldChooserPopup.$content().dxPivotGridFieldChooser(fieldChooserComponentOptions);
    } else {
      this._fieldChooserPopup = this._createComponent(
        $(DIV)
          .addClass(FIELD_CHOOSER_POPUP_CLASS)
          .appendTo(container),
        Popup,
        popupOptions,
      );
    }
  }

  _renderContextMenu() {
    const $container = this._pivotGridContainer;

    if (this._contextMenu) {
      this._contextMenu.$element().remove();
    }

    this._contextMenu = this._createComponent($(DIV).appendTo($container), ContextMenu, {
      onPositioning: (actionArgs) => {
        const { event } = actionArgs;

        actionArgs.cancel = true;

        if (!event) {
          return;
        }

        const targetElement = event.target.cellIndex >= 0 ? event.target : $(event.target).closest('td').get(0);
        if (!targetElement) {
          return;
        }

        const args = this._createEventArgs(targetElement, event);
        const items = this._getContextMenuItems(args);
        if (items) {
          actionArgs.component.option('items', items);
          if (event.type === 'keydown') {
            // A keyboard event carries no pointer coordinates, so the menu is
            // anchored to the focused cell instead.
            if (actionArgs.position) {
              actionArgs.position.of = $(targetElement);
            }
          } else {
            this._contextMenuOwnerNavigation = undefined;
          }
          actionArgs.cancel = false;
        }
      },
      onHidden: () => {
        this._contextMenuOwnerNavigation?.refocusFocusedItem();
        this._contextMenuOwnerNavigation = undefined;
      },
      onItemClick(params) {
        params.itemData.onItemClick && params.itemData.onItemClick(params);
      },
      cssClass: PIVOTGRID_CLASS,
      target: this.$element(),
    });
  }

  _getContextMenuItems(e) {
    let items: any = [];
    const texts = this.option('texts');

    if (e.area === 'row' || e.area === 'column') {
      const areaFields = e[`${e.area}Fields`];
      const oppositeAreaFields = e[e.area === 'column' ? 'rowFields' : 'columnFields'];
      const field = e.cell.path && areaFields[e.cell.path.length - 1];
      const dataSource = this.getDataSource();

      if (field && field.allowExpandAll && e.cell.path.length < e[`${e.area}Fields`].length && !dataSource.paginate()) {
        items.push({
          beginGroup: true,
          icon: 'none',
          // @ts-expect-error ts-error
          text: texts.expandAll,
          onItemClick() {
            dataSource.expandAll(field.index);
          },
        });
        items.push({
          // @ts-expect-error ts-error
          text: texts.collapseAll,
          icon: 'none',
          onItemClick() {
            dataSource.collapseAll(field.index);
          },
        });
      }

      if (e.cell.isLast && !dataSource.paginate()) {
        let sortingBySummaryItemCount = 0;
        each(oppositeAreaFields, (_, field) => {
          if (!field.allowSortingBySummary) {
            return;
          }

          each(e.dataFields, (dataIndex, dataField) => {
            if (isDefined(e.cell.dataIndex) && e.cell.dataIndex !== dataIndex) {
              return;
            }

            const showDataFieldCaption = !isDefined(e.cell.dataIndex) && e.dataFields.length > 1;
            // @ts-expect-error ts-error
            const textFormat = e.area === 'column' ? texts.sortColumnBySummary : texts.sortRowBySummary;
            const checked = findField(e.dataFields, field.sortBySummaryField) === dataIndex && (e.cell.path || []).join('/') === (field.sortBySummaryPath || []).join('/');
            const text = formatString(textFormat, showDataFieldCaption ? `${field.caption} - ${dataField.caption}` : field.caption);

            items.push({
              beginGroup: sortingBySummaryItemCount === 0,
              icon: checked ? field.sortOrder === 'desc' ? 'sortdowntext' : 'sortuptext' : 'none',
              text,
              onItemClick() {
                dataSource.field(field.index, {
                  sortBySummaryField: dataField.name || dataField.caption || dataField.dataField,
                  sortBySummaryPath: e.cell.path,
                  sortOrder: field.sortOrder === 'desc' ? 'asc' : 'desc',
                });
                dataSource.load();
              },
            });
            sortingBySummaryItemCount += 1;
          });
        });
        each(oppositeAreaFields, (_, field) => {
          if (!field.allowSortingBySummary || !isDefined(field.sortBySummaryField)) {
            return undefined;
          }
          items.push({
            beginGroup: sortingBySummaryItemCount === 0,
            icon: 'none',
            // @ts-expect-error ts-error
            text: texts.removeAllSorting,
            onItemClick() {
              each(oppositeAreaFields, (_, field) => {
                dataSource.field(field.index, {
                  sortBySummaryField: undefined,
                  sortBySummaryPath: undefined,
                  sortOrder: undefined,
                });
              });
              dataSource.load();
            },
          });
          return false;
        });
      }
    }

    if (this.option('fieldChooser.enabled')) {
      items.push({
        beginGroup: true,
        icon: 'columnchooser',
        // @ts-expect-error ts-error
        text: texts.showFieldChooser,
        onItemClick: () => {
          this.getFieldChooserPopup().show();
        },
      });
    }

    if (this.option('export.enabled')) {
      items.push({
        beginGroup: true,
        icon: 'xlsxfile',
        // @ts-expect-error ts-error
        text: texts.exportToExcel,
        onItemClick: () => {
          // @ts-expect-error ts-error
          this.exportTo();
        },
      });
    }

    e.items = items;
    this._trigger('onContextMenuPreparing', e);
    items = e.items;

    if (items && items.length) {
      return items;
    }

    return undefined;
  }

  _createEventArgs(targetElement, dxEvent) {
    const dataSource = this.getDataSource();
    const args = {
      rowFields: dataSource.getAreaFields('row'),
      columnFields: dataSource.getAreaFields('column'),
      dataFields: dataSource.getAreaFields('data'),
      event: dxEvent,
    };

    if (clickedOnFieldsArea($(targetElement))) {
      return extend(this._createFieldArgs(targetElement), args);
    }
    return extend(this._createCellArgs(targetElement), args);
  }

  _createFieldArgs(targetElement) {
    const field = getData($(targetElement).children(), FIELD_DATA_KEY);
    const args = {
      field,
    };
    return isDefined(field) ? args : {};
  }

  _createCellArgs(cellElement) {
    const $cellElement = $(cellElement);
    const columnIndex = cellElement.cellIndex;
    const { rowIndex } = cellElement.parentElement;
    const $table = $cellElement.closest('table');
    const data = $table.data('data');
    const cell = data && data[rowIndex] && data[rowIndex][columnIndex];
    const args = {
      area: $table.data('area'),
      rowIndex,
      columnIndex,
      cellElement: getPublicElement($cellElement),
      cell,
    };
    return args;
  }

  _handleCellClick(e) {
    const args = this._createEventArgs(e.currentTarget, e);
    if (!isCellEventArgs(args)) {
      return;
    }
    const { cell } = args;

    if (!cell || (!args.area && (args.rowIndex || args.columnIndex))) {
      return;
    }

    this._trigger('onCellClick', args);

    cell && !args.cancel && isDefined(cell.expanded) && setTimeout(() => {
      this._dataController[cell.expanded ? 'collapseHeaderItem' : 'expandHeaderItem'](args.area, cell.path);
    });
  }

  _getColumnsAreaNavigation() {
    this._columnsAreaNavigation = this._columnsAreaNavigation ?? new RovingTabIndex({
      component: this,
      getItems: () => this._getColumnHeaderCells(),
      scrollToItem: (item) => this._columnsArea.scrollToElement(item),
      getItemId: (item) => this._getHeaderCellId(item),
    });

    return this._columnsAreaNavigation;
  }

  // aria-colindex is absolute (it includes the virtual scrolling offset), so
  // it identifies the same logical cell across re-renders this re-slice the
  // rendered header pages.
  _getHeaderCellId(cell: HTMLElement): string | undefined {
    const columnIndex = cell.getAttribute('aria-colindex');
    const row = cell.parentElement as HTMLTableRowElement | null;

    if (!columnIndex || !row) {
      return undefined;
    }

    return `${row.sectionRowIndex}:${columnIndex}`;
  }

  _getRowsAreaNavigation() {
    this._rowsAreaNavigation = this._rowsAreaNavigation ?? new RovingTabIndex({
      component: this,
      getItems: () => this._getRowHeaderCells(),
      scrollToItem: (item) => this._rowsArea.scrollToElement(item),
      getItemId: (item) => this._getRowHeaderCellId(item),
    });

    return this._rowsAreaNavigation;
  }

  // aria-rowindex is absolute as well, so it identifies the same logical row
  // header cell across virtual scrolling re-renders.
  _getRowHeaderCellId(cell: HTMLElement): string | undefined {
    const rowIndex = cell.getAttribute('aria-rowindex');
    const { cellIndex } = cell as HTMLTableCellElement;

    if (!rowIndex || cellIndex < 0) {
      return undefined;
    }

    return `${cellIndex}:${rowIndex}`;
  }

  _getHeaderAreaCells(cellSelector: string): HTMLElement[] {
    const element = this.$element().get(0);

    if (!element) {
      return [];
    }

    const cells: HTMLElement[] = Array.from(element.querySelectorAll(cellSelector));

    return cells.filter((cell) => !cell.closest(`.${FAKE_TABLE_CLASS}`));
  }

  // Only cells marked as navigable on render take part in the roving
  // tabindex: whitespace filler cells are rendered without tabindex.
  _getColumnHeaderCells(): HTMLElement[] {
    return this._getHeaderAreaCells(`thead.${HORIZONTAL_HEADERS_AREA_CLASS} td[tabindex]`);
  }

  _getRowHeaderCells(): HTMLElement[] {
    return this._getHeaderAreaCells(`tbody.${VERTICAL_HEADERS_AREA_CLASS} td[tabindex]`);
  }

  _getCellAreaNavigation(cell): RovingTabIndex | undefined {
    if (cell.closest?.(`.${FAKE_TABLE_CLASS}`)) {
      return undefined;
    }
    if (cell.closest?.(`thead.${HORIZONTAL_HEADERS_AREA_CLASS}`)) {
      return this._getColumnsAreaNavigation();
    }
    if (cell.closest?.(`tbody.${VERTICAL_HEADERS_AREA_CLASS}`)) {
      return this._getRowsAreaNavigation();
    }

    return undefined;
  }

  _normalizeCellNavigationDirection(direction: CellNavigationDirection): CellNavigationDirection {
    if (!this.option('rtlEnabled')) {
      return direction;
    }
    if (direction === 'left') {
      return 'right';
    }
    if (direction === 'right') {
      return 'left';
    }

    return direction;
  }

  _handleCellArrowKeyDown(e, direction: CellNavigationDirection) {
    const cell = e.currentTarget;
    const navigation = this._getCellAreaNavigation(cell);

    if (!navigation) {
      return;
    }

    e.preventDefault();

    const section = cell.closest('thead, tbody');
    const normalizedDirection = this._normalizeCellNavigationDirection(direction);
    let target = getAdjacentCell(section, cell, normalizedDirection);

    // Non-navigable placeholders (e.g. whitespace filler cells) have no
    // tabindex and are skipped over.
    while (target && !target.hasAttribute('tabindex')) {
      target = getAdjacentCell(section, target, normalizedDirection);
    }

    if (target) {
      navigation.focusItem(target);
    }
  }

  _handleCellFocusIn(e) {
    this._getCellAreaNavigation(e.currentTarget)?.handleFocusIn(e.currentTarget);
  }

  _handleCellContextMenuKeyDown(e) {
    const cell = e.currentTarget;
    const navigation = this._getCellAreaNavigation(cell);

    if (!navigation) {
      return;
    }

    this._showContextMenuFromKeyboard(e, navigation);
  }

  _handleFieldContextMenuKeyDown(e, navigation: RovingTabIndex) {
    this._showContextMenuFromKeyboard(e, navigation);
  }

  _showContextMenuFromKeyboard(e, navigation: RovingTabIndex) {
    if (!this._contextMenu) {
      return;
    }

    // The internal _show is called instead of the public show() because only
    // _show accepts the initiating event this onPositioning builds items from.
    this._contextMenu._show(e);

    if (this._contextMenu.option('visible')) {
      e.preventDefault();
      this._contextMenuOwnerNavigation = navigation;
    }
  }

  _handleCellKeyDown(e) {
    const direction = ARROW_KEY_DIRECTIONS[e.key];
    if (direction) {
      this._handleCellArrowKeyDown(e, direction);
      return;
    }
    if (e.repeat) {
      return;
    }
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      this._handleCellContextMenuKeyDown(e);
      return;
    }
    if (e.key !== 'Enter' && e.key !== ' ') {
      return;
    }
    const args = this._createEventArgs(e.currentTarget, e);
    if (!isCellEventArgs(args)) {
      return;
    }
    const { cell } = args;
    if (!cell || !isDefined(cell.expanded)) {
      return;
    }
    e.preventDefault();
    this._trigger('onCellClick', args);
    if (args.cancel) {
      return;
    }
    const $control = $(e.currentTarget).find('.dx-expand-icon-container');
    saveFocusedElementInfo($control.get(0), this);
    const onReady = () => {
      this.off('contentReady', onReady);
      restoreFocus(this);
    };
    this.on('contentReady', onReady);
    setTimeout(() => {
      this._dataController[cell.expanded ? 'collapseHeaderItem' : 'expandHeaderItem'](args.area, cell.path);
    });
  }

  _getNoDataText() {
    return this.option('texts.noData');
  }

  _renderNoDataText(element) {
    return gridCoreUtils.renderNoDataText.call(this, element);
  }

  _renderLoadPanel(element, container) {
    return gridCoreUtils.renderLoadPanel.call(this, element, container, undefined);
  }

  _updateLoading(progress) {
    const isLoading = this._dataController.isLoading();

    if (!this._loadPanel) return;

    const loadPanelVisible = this._loadPanel.option('visible');

    if (!loadPanelVisible) {
      this._startLoadingTime = new Date();
    }
    if (isLoading) {
      if (progress) {
        if ((new Date() as any) - this._startLoadingTime >= 1000) {
          this._loadPanel.option('message', `${Math.floor(progress * 100)}%`);
        }
      } else {
        this._loadPanel.option('message', this.option('loadPanel.text'));
      }
    }
    clearTimeout(this._hideLoadingTimeoutID);
    if (loadPanelVisible && !isLoading) {
      this._hideLoadingTimeoutID = setTimeout(() => {
        this._loadPanel.option('visible', false);
        this.$element().removeClass(OVERFLOW_HIDDEN_CLASS);
      });
    } else {
      const visibilityOptions: any = {
        visible: isLoading,
      };
      if (isLoading) {
        visibilityOptions.position = gridCoreUtils.calculateLoadPanelPosition(
          this._dataArea.groupElement(),
        );
      }
      this._loadPanel.option(visibilityOptions);
      this.$element().toggleClass(OVERFLOW_HIDDEN_CLASS, !isLoading);
    }
  }

  _renderDescriptionArea() {
    const $element = this.$element();
    const $descriptionCell = $element.find(`.${DESCRIPTION_AREA_CELL_CLASS}`);
    const $toolbarContainer = $(DIV).addClass('dx-pivotgrid-toolbar');
    const fieldPanel = this.option('fieldPanel') as FieldPanelOptions;
    const $filterHeader = $element.find('.dx-filter-header');
    const $columnHeader = $element.find('.dx-column-header');

    let $targetContainer;

    let buttonStylingMode: ButtonStyle = isGeneric(current()) ? 'contained' : 'text';

    if (fieldPanel.visible && fieldPanel.showFilterFields) {
      $targetContainer = $filterHeader;
    } else if (fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)) {
      $targetContainer = $columnHeader;
    } else {
      $targetContainer = $descriptionCell;
      buttonStylingMode = 'text';
    }

    $columnHeader.toggleClass(
      BOTTOM_BORDER_CLASS,
      !!(fieldPanel.visible && (fieldPanel.showDataFields || fieldPanel.showColumnFields)),
    );
    $filterHeader.toggleClass(
      BOTTOM_BORDER_CLASS,
      !!(fieldPanel.visible && fieldPanel.showFilterFields),
    );

    $descriptionCell.toggleClass(
      'dx-pivotgrid-background',
      fieldPanel.visible
      && (fieldPanel.showDataFields || fieldPanel.showColumnFields || fieldPanel.showRowFields),
    );

    this.$element().find('.dx-pivotgrid-toolbar').remove();

    $toolbarContainer.prependTo($targetContainer);

    if (this.option('fieldChooser.enabled')) {
      this.$fieldChooserButton = $(DIV)
        .appendTo($toolbarContainer)
        .addClass('dx-pivotgrid-field-chooser-button');
      const buttonOptions: Properties = {
        icon: 'columnchooser',
        // @ts-expect-error ts-error
        hint: this.option('texts.showFieldChooser'),
        elementAttr: {
          'aria-label': this.option('texts.showFieldChooser'),
          'aria-haspopup': 'dialog',
        },
        stylingMode: buttonStylingMode,
        onClick: () => {
          this.getFieldChooserPopup().show();
        },
      };

      this._createComponent(this.$fieldChooserButton, Button, buttonOptions);
    }

    if (this.option('export.enabled')) {
      const $buttonElement = $(DIV)
        .appendTo($toolbarContainer)
        .addClass('dx-pivotgrid-export-button');
      const buttonOptions: Properties = {
        icon: 'xlsxfile',
        // @ts-expect-error ts-error
        hint: this.option('texts.exportToExcel'),
        stylingMode: buttonStylingMode,
        onClick: () => {
          // @ts-expect-error ts-error
          this.exportTo();
        },
      };

      this._createComponent($buttonElement, Button, buttonOptions);
    }
  }

  _detectHasContainerHeight() {
    const element = this.$element();

    if (isDefined(this._hasHeight)) {
      // @ts-expect-error ts-error
      const height = this.option('height') || this.$element().get(0).style.height;

      // @ts-expect-error ts-error
      if (height && (this._hasHeight ^ (height !== 'auto'))) {
        this._hasHeight = null;
      }
    }

    if (isDefined(this._hasHeight) || element.is(':hidden')) {
      return;
    }

    this._pivotGridContainer.addClass('dx-hidden');
    const testElement: any = $(DIV);
    setHeight(testElement, TEST_HEIGHT);
    element.append(testElement);
    this._hasHeight = getHeight(element.get(0)) !== TEST_HEIGHT;
    this._pivotGridContainer.removeClass('dx-hidden');
    testElement.remove();
  }

  _renderHeaders(
    rowHeaderContainer,
    columnHeaderContainer,
    filterHeaderContainer,
    dataHeaderContainer,
  ) {
    const dataSource = this.getDataSource();

    this._rowFields = this._rowFields || new FieldsArea(this, 'row');
    this._rowFields.render(rowHeaderContainer, dataSource.getAreaFields('row'));

    this._columnFields = this._columnFields || new FieldsArea(this, 'column');
    this._columnFields.render(columnHeaderContainer, dataSource.getAreaFields('column'));

    this._filterFields = this._filterFields || new FieldsArea(this, 'filter');
    this._filterFields.render(filterHeaderContainer, dataSource.getAreaFields('filter'));

    this._dataFields = this._dataFields || new FieldsArea(this, 'data');
    this._dataFields.render(dataHeaderContainer, dataSource.getAreaFields('data'));

    // @ts-expect-error ts-error
    const fieldChooser = this.$element().dxPivotGridFieldChooserBase('instance');
    fieldChooser.renderSortable();
    fieldChooser.restoreFieldFocus();
  }

  _createTableElement() {
    const $table = ($('<table>') as any)
      .attr('role', 'presentation')
      .css({ width: '100%' })
      .toggleClass(BORDERS_CLASS, !!this.option('showBorders'))
      .toggleClass('dx-word-wrap', !!this.option('wordWrapEnabled'));

    eventsEngine.on($table, addNamespace(clickEventName, 'dxPivotGrid'), 'td', this._handleCellClick.bind(this));
    eventsEngine.on($table, addNamespace('keydown', 'dxPivotGrid'), 'td', this._handleCellKeyDown.bind(this));
    eventsEngine.on($table, addNamespace('focusin', 'dxPivotGrid'), 'td', this._handleCellFocusIn.bind(this));

    return $table;
  }

  _renderDataArea(dataAreaElement) {
    const dataArea = this._dataArea || new DataAreaImport.DataArea(this);
    this._dataArea = dataArea;
    dataArea.render(dataAreaElement, this._dataController.getCellsInfo());

    return dataArea;
  }

  _renderRowsArea(rowsAreaElement) {
    const rowsArea = this._rowsArea || new HeadersArea.VerticalHeadersArea(this);
    this._rowsArea = rowsArea;

    const navigation = this._getRowsAreaNavigation();
    const needRestoreFocus = navigation.containsActiveElement();

    rowsArea.render(rowsAreaElement, this._dataController.getRowsInfo());
    navigation.updateTabIndexes();

    if (needRestoreFocus) {
      navigation.refocusFocusedItem();
      this._scheduleNavigationFocusRestore(navigation);
    }

    return rowsArea;
  }

  _scheduleNavigationFocusRestore(navigation: RovingTabIndex) {
    const onReady = () => {
      this.off('contentReady', onReady);
      if (!navigation.containsActiveElement()) {
        navigation.refocusFocusedItem();
      }
    };
    this.on('contentReady', onReady);
  }

  _renderColumnsArea(columnsAreaElement) {
    const columnsArea = this._columnsArea || new HeadersArea.HorizontalHeadersArea(this);
    this._columnsArea = columnsArea;

    const navigation = this._getColumnsAreaNavigation();
    const needRestoreFocus = navigation.containsActiveElement();

    columnsArea.render(columnsAreaElement, this._dataController.getColumnsInfo());
    navigation.updateTabIndexes();

    if (needRestoreFocus) {
      navigation.refocusFocusedItem();
      this._scheduleNavigationFocusRestore(navigation);
    }

    return columnsArea;
  }

  _initMarkup() {
    super._initMarkup();
    this.$element()
      .addClass(PIVOTGRID_CLASS)
      .attr('role', 'group')
      .attr('aria-label', getFieldsHotkeysA11yLabel(localizationMessage.format('dxPivotGrid-ariaLabel')));
  }

  _renderContentImpl() {
    let columnsAreaElement;
    let rowsAreaElement;
    let dataAreaElement;
    let tableElement;
    const isFirstDrawing = !this._pivotGridContainer;
    let rowHeaderContainer;
    let columnHeaderContainer;
    let filterHeaderContainer;
    let dataHeaderContainer;

    tableElement = !isFirstDrawing && this._tableElement();

    if (!tableElement) {
      this.$element().addClass(ROW_LINES_CLASS)
        .addClass(FIELDS_CONTAINER_CLASS);

      this._pivotGridContainer = $(DIV).addClass('dx-pivotgrid-container');
      this._renderFieldChooser();
      this._renderContextMenu();

      columnsAreaElement = $(TD).addClass(COLUMN_AREA_CELL_CLASS);
      rowsAreaElement = $(TD).addClass(ROW_AREA_CELL_CLASS);
      dataAreaElement = $(TD).addClass(DATA_AREA_CELL_CLASS);

      tableElement = this._createTableElement();

      dataHeaderContainer = $(TD).addClass('dx-data-header');

      filterHeaderContainer = $('<td>').attr('colspan', '2').addClass('dx-filter-header');
      columnHeaderContainer = $(TD).addClass('dx-column-header');
      rowHeaderContainer = $(TD).addClass(DESCRIPTION_AREA_CELL_CLASS);

      $(TR)
        .append(filterHeaderContainer)
        .appendTo(tableElement);

      $(TR)
        .append(dataHeaderContainer)
        .append(columnHeaderContainer)
        .appendTo(tableElement);

      $(TR)
        .append(rowHeaderContainer)
        .append(columnsAreaElement)
        .appendTo(tableElement);

      $(TR)
        .addClass(BOTTOM_ROW_CLASS)
        .append(rowsAreaElement)
        .append(dataAreaElement)
        .appendTo(tableElement);

      this._pivotGridContainer.append(tableElement);
      this.$element().append(this._pivotGridContainer);

      if (this.option('rowHeaderLayout') === 'tree') {
        rowsAreaElement.addClass('dx-area-tree-view');
      }
    }

    this.$element().addClass(OVERFLOW_HIDDEN_CLASS);

    const fieldChooserBaseConfig = {
      dataSource: this.getDataSource(),
      encodeHtml: this.option('encodeHtml'),
      allowFieldDragging: this.option('fieldPanel.allowFieldDragging'),
      headerFilter: this.option('headerFilter'),
      visible: this.option('visible'),
      remoteSort: this.option('scrolling.mode') === 'virtual',
      onFieldContextMenuKeyDown: this._handleFieldContextMenuKeyDown.bind(this),
    };

    if (this._fieldChooserBase) {
      this._fieldChooserBase.option(fieldChooserBaseConfig);
    } else {
      this._fieldChooserBase = this._createComponent(
        this.$element(),
        FieldChooserBase,
        // @ts-expect-error the widget's options aren't typed yet
        fieldChooserBaseConfig,
      );
    }

    const dataArea = this._renderDataArea(dataAreaElement);
    const rowsArea = this._renderRowsArea(rowsAreaElement);
    const columnsArea = this._renderColumnsArea(columnsAreaElement);

    dataArea.tableElement().prepend(columnsArea.headElement());

    if (isFirstDrawing) {
      this._renderLoadPanel(dataArea.groupElement().parent(), this.$element());
      this._renderDescriptionArea();

      rowsArea.renderScrollable();
      columnsArea.renderScrollable();
      dataArea.renderScrollable();
    }

    this._setAriaGridAttributes(dataArea, rowsArea, columnsArea);

    [dataArea, rowsArea, columnsArea].forEach((area) => {
      unsubscribeScrollEvents(area);
    });

    this._renderHeaders(
      rowHeaderContainer,
      columnHeaderContainer,
      filterHeaderContainer,
      dataHeaderContainer,
    );

    this._update(isFirstDrawing);
  }

  _setAriaGridAttributes(dataArea, rowsArea, columnsArea) {
    const $gridElement = dataArea.tableElement().parent();
    const tableIds = [
      columnsArea.tableElement().attr('id'),
      rowsArea.tableElement().attr('id'),
      dataArea.tableElement().attr('id'),
    ].filter(isDefined).join(' ');

    const rowHeaderColumnCount = this._reserveRowHeaderColumns(dataArea, rowsArea, columnsArea);

    $gridElement
      .attr('role', 'grid')
      .attr('aria-owns', tableIds)
      .attr('aria-rowcount', this._dataController.totalRowCount())
      .attr('aria-colcount', this._dataController.totalColumnCount() + rowHeaderColumnCount);
  }

  _reserveRowHeaderColumns(dataArea, rowsArea, columnsArea): number {
    // The reserved width is the full row-header column count, not the widest
    // rendered row: virtual scrolling can page in rows whose visible cells do
    // not reach the rightmost header column, which would otherwise shift the
    // colindex axis between pages.
    const rowHeaderColumnCount = rowsArea.getColumnsCount();

    if (!rowHeaderColumnCount) {
      return 0;
    }

    const rowsBody = rowsArea.tableElement().children('tbody').get(0);
    const matrix = rowsBody ? buildCellMatrix(rowsBody) : [];
    const indexed = new Set<HTMLTableCellElement>();
    matrix.forEach((row) => {
      row.forEach((cell, columnIndex) => {
        if (cell && cell.getAttribute('role') && !indexed.has(cell)) {
          indexed.add(cell);
          cell.setAttribute('aria-colindex', String(columnIndex + 1));
        }
      });
    });

    const shifted = new Set<HTMLTableCellElement>();
    [columnsArea, dataArea].forEach((area) => {
      area.tableElement().find('td[aria-colindex]').each((_, td) => {
        if (shifted.has(td)) {
          return;
        }
        shifted.add(td);
        let base = td.getAttribute('data-dx-base-colindex');
        if (base === null) {
          base = td.getAttribute('aria-colindex');
          td.setAttribute('data-dx-base-colindex', base);
        }
        td.setAttribute('aria-colindex', String(Number(base) + rowHeaderColumnCount));
      });
    });

    return rowHeaderColumnCount;
  }

  _update(isFirstDrawing) {
    const updateHandler = () => {
      this.updateDimensions();
    };
    if (this._needDelayResizing(this._dataArea.getData()) && isFirstDrawing) {
      setTimeout(updateHandler);
    } else {
      updateHandler();
    }
  }

  _fireContentReadyAction() {
    if (!this._dataController.isLoading()) {
      super._fireContentReadyAction();
    }
  }

  getScrollPath(area) {
    if (area === 'column') {
      return this._columnsArea.getScrollPath(this._scrollLeft);
    }
    return this._rowsArea.getScrollPath(this._scrollTop);
  }

  getDataSource() {
    return this._dataController.getDataSource();
  }

  getFieldChooserPopup() {
    return this._fieldChooserPopup;
  }

  hasScroll(area) {
    return area === 'column' ? this._columnsArea.hasScroll() : this._rowsArea.hasScroll();
  }

  _dimensionChanged() {
    this.updateDimensions();
  }

  _visibilityChanged(visible) {
    if (visible) {
      this.updateDimensions();
    }
  }

  _dispose() {
    clearTimeout(this._hideLoadingTimeoutID);

    if (this._dataController) {
      this._dataController.dispose();
    }

    super._dispose();
  }

  _tableElement() {
    return this.$element().find('table').first();
  }

  addWidgetPrefix(className) {
    return `dx-pivotgrid-${className}`;
  }

  resize() {
    this.updateDimensions();
  }

  isReady() {
    return super.isReady() && !this._dataController.isLoading();
  }

  updateDimensions() {
    let groupWidth;
    const tableElement = this._tableElement();
    let bordersWidth;
    let totalWidth = 0;
    let totalHeight = 0;
    let rowsAreaWidth = 0;
    let hasRowsScroll;
    let hasColumnsScroll;

    const dataAreaCell = tableElement.find(`.${DATA_AREA_CELL_CLASS}`);
    const rowAreaCell = tableElement.find(`.${ROW_AREA_CELL_CLASS}`);
    const columnAreaCell = tableElement.find(`.${COLUMN_AREA_CELL_CLASS}`);
    const descriptionCell = tableElement.find(`.${DESCRIPTION_AREA_CELL_CLASS}`);
    const filterHeaderCell = tableElement.find('.dx-filter-header');
    const columnHeaderCell = tableElement.find('.dx-column-header');
    const rowFieldsHeader = this._rowFields;
    // @ts-expect-error
    const d = new Deferred();

    if (!hasWindow()) {
      return undefined;
    }

    const needSynchronizeFieldPanel = rowFieldsHeader.isVisible() && this.option('rowHeaderLayout') !== 'tree';

    this._detectHasContainerHeight();

    if (!this._dataArea.headElement().length) {
      this._dataArea.tableElement().prepend(this._columnsArea.headElement());
    }

    if (needSynchronizeFieldPanel) {
      this._rowsArea.updateColspans(rowFieldsHeader.getColumnsCount());
      this._rowsArea.tableElement().prepend(rowFieldsHeader.headElement());
    }

    tableElement.addClass(INCOMPRESSIBLE_FIELDS_CLASS);
    this._dataArea.reset();
    this._rowsArea.reset();
    this._columnsArea.reset();
    rowFieldsHeader.reset();

    const calculateHasScroll = (areaSize, totalSize) => totalSize - areaSize >= 1;

    const calculateGroupHeight = (
      dataAreaHeight,
      totalHeight,
      hasRowsScroll,
      hasColumnsScroll,
      scrollBarWidth,
    ) => (hasRowsScroll
      ? dataAreaHeight
      : totalHeight + (hasColumnsScroll ? scrollBarWidth : 0)
    );

    deferUpdate(() => {
      const rowHeights = this._rowsArea.getRowsHeight();
      const descriptionCellHeight = getOuterHeight(descriptionCell[0], true)
        + (needSynchronizeFieldPanel ? rowHeights[0] : 0);

      const dataAreaHeadHeight = getHeight(this._dataArea.headElement());
      let filterAreaHeight: number | undefined = 0;
      let dataAreaHeight = 0;
      if (this._hasHeight) {
        filterAreaHeight = getHeight(filterHeaderCell);

        const $dataHeader = tableElement.find('.dx-data-header');
        const dataHeaderHeight = Number(getHeight($dataHeader));

        bordersWidth = getCommonBorderWidth([columnAreaCell, dataAreaCell, tableElement, columnHeaderCell, filterHeaderCell], 'height');
        dataAreaHeight = getHeight(
          this.$element().get(0),
        ) - Number(filterAreaHeight) - dataHeaderHeight
          - (Math.max(
            dataAreaHeadHeight,
            Number(getHeight(columnAreaCell)),
            descriptionCellHeight,
          )
            + bordersWidth
          );
      }

      const scrollBarWidth = this._dataArea.getScrollbarWidth();
      const rowsAreaTableHeight = getHeight(this._rowsArea.tableElement());
      const dataAreaTableHeight = getHeight(this._dataArea.tableElement());
      const correctDataTableHeight = Math.max(
        rowsAreaTableHeight,
        dataAreaTableHeight - dataAreaHeadHeight,
      );
      const hasVerticalScrollbar = calculateHasScroll(dataAreaHeight, correctDataTableHeight);

      this._dataArea.tableElement().css({
        width: this._hasHeight && hasVerticalScrollbar && scrollBarWidth
          ? `calc(100% - ${scrollBarWidth}px)`
          : '100%',
      });

      const resultWidths = this._dataArea.getColumnsWidth();

      const rowsAreaHeights = needSynchronizeFieldPanel ? rowHeights.slice(1) : rowHeights;
      const dataAreaHeights = this._dataArea.getRowsHeight();

      const columnsAreaRowCount = this._dataController.getColumnsInfo().length;

      const resultHeights = mergeArraysByMaxValue(
        rowsAreaHeights,
        dataAreaHeights.slice(columnsAreaRowCount),
      );

      const columnsAreaRowHeights = dataAreaHeights.slice(0, columnsAreaRowCount);
      const columnsAreaHeight = getArraySum(columnsAreaRowHeights);

      const rowsAreaColumnWidths = this._rowsArea.getColumnsWidth();

      totalWidth = getWidth(this._dataArea.tableElement());

      totalHeight = getArraySum(resultHeights);

      if (!totalWidth || !totalHeight) {
        d.resolve();
        return;
      }

      rowsAreaWidth = getArraySum(rowsAreaColumnWidths);

      const elementWidth = getWidth(this.$element().get(0));

      bordersWidth = getCommonBorderWidth([rowAreaCell, dataAreaCell, tableElement], 'width');
      groupWidth = elementWidth - rowsAreaWidth - bordersWidth;

      groupWidth = groupWidth > 0 ? groupWidth : totalWidth;
      const diff = totalWidth - groupWidth;
      const needAdjustWidthOnZoom = diff >= 0 && diff <= 2;
      if (needAdjustWidthOnZoom) { // T914454
        adjustSizeArray(resultWidths, diff);
        totalWidth = groupWidth;
      }

      hasRowsScroll = this._hasHeight && calculateHasScroll(dataAreaHeight, totalHeight);
      hasColumnsScroll = calculateHasScroll(groupWidth, totalWidth);

      /// #DEBUG
      this.__scrollBarUseNative = this._dataArea.getUseNativeValue();
      this.__scrollBarWidth = scrollBarWidth;
      /// #ENDDEBUG

      const groupHeight = calculateGroupHeight(
        dataAreaHeight,
        totalHeight,
        hasRowsScroll,
        hasColumnsScroll,
        scrollBarWidth,
      );

      deferRender(() => {
        this._columnsArea.tableElement().append(this._dataArea.headElement());

        rowFieldsHeader.tableElement().append(this._rowsArea.headElement());

        if (descriptionCellHeight > columnsAreaHeight) {
          adjustSizeArray(columnsAreaRowHeights, columnsAreaHeight - descriptionCellHeight);
          this._columnsArea.setRowsHeight(columnsAreaRowHeights);
        }

        tableElement.removeClass(INCOMPRESSIBLE_FIELDS_CLASS);
        columnHeaderCell.children().css('maxWidth', groupWidth);
        this._columnsArea.setGroupWidth(groupWidth);
        this._columnsArea.processScrollBarSpacing(hasRowsScroll ? scrollBarWidth : 0);
        this._columnsArea.setColumnsWidth(resultWidths);

        this._rowsArea.setGroupHeight(this._hasHeight ? groupHeight : 'auto');
        this._rowsArea.processScrollBarSpacing(hasColumnsScroll ? scrollBarWidth : 0);
        // B232690
        this._rowsArea.setColumnsWidth(rowsAreaColumnWidths);
        this._rowsArea.setRowsHeight(resultHeights);

        this._dataArea.setColumnsWidth(resultWidths);
        this._dataArea.setRowsHeight(resultHeights);
        this._dataArea.setGroupWidth(groupWidth);
        this._dataArea.setGroupHeight(this._hasHeight ? groupHeight : 'auto');

        needSynchronizeFieldPanel && rowFieldsHeader.setColumnsWidth(rowsAreaColumnWidths);

        dataAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !hasRowsScroll);
        rowAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !hasRowsScroll);

        // T317921
        if (!this._hasHeight && (elementWidth !== getWidth(this.$element().get(0)))) {
          const diff = elementWidth - getWidth(this.$element().get(0));
          if (!hasColumnsScroll) {
            adjustSizeArray(resultWidths, diff);
            this._columnsArea.setColumnsWidth(resultWidths);
            this._dataArea.setColumnsWidth(resultWidths);
          }

          this._dataArea.setGroupWidth(groupWidth - diff);
          this._columnsArea.setGroupWidth(groupWidth - diff);
        }

        if (this._hasHeight && this._filterFields.isVisible()
          && getHeight(filterHeaderCell) !== filterAreaHeight) {
          const diff = Number(getHeight(filterHeaderCell)) - Number(filterAreaHeight);
          if (diff > 0) {
            hasRowsScroll = calculateHasScroll(dataAreaHeight - diff, totalHeight);
            const groupHeight = calculateGroupHeight(
              dataAreaHeight - diff,
              totalHeight,
              hasRowsScroll,
              hasColumnsScroll,
              scrollBarWidth,
            );

            this._dataArea.setGroupHeight(groupHeight);
            this._rowsArea.setGroupHeight(groupHeight);
          }
        }

        const scrollingOptions = this.option('scrolling');

        // @ts-expect-error ts-error
        if (scrollingOptions.mode === 'virtual') {
          this._setVirtualContentParams(
            scrollingOptions,
            resultWidths,
            resultHeights,
            groupWidth,
            groupHeight,
            this._hasHeight,
            rowsAreaWidth,
          );
        }

        const updateScrollableResults: any = [];
        this._dataArea.updateScrollableOptions({
          direction: this._dataArea.getScrollableDirection(hasColumnsScroll, hasRowsScroll),
          rtlEnabled: this.option('rtlEnabled'),
        });

        each([this._columnsArea, this._rowsArea, this._dataArea], (_, area) => {
          updateScrollableResults.push(area && area.updateScrollable());
        });

        // @ts-expect-error ts-error
        this._updateLoading();
        this._renderNoDataText(dataAreaCell);

        /// #DEBUG
        this._testResultWidths = resultWidths;
        this._testResultHeights = resultHeights;
        /// #ENDDEBUG

        when.apply($, updateScrollableResults).done(() => {
          this._setAriaGridAttributes(this._dataArea, this._rowsArea, this._columnsArea);
          this._updateScrollPosition(this._columnsArea, this._rowsArea, this._dataArea, true);
          this._subscribeToEvents(this._columnsArea, this._rowsArea, this._dataArea);

          // @ts-expect-error
          const fieldChooser = this.$element().dxPivotGridFieldChooserBase('instance');
          fieldChooser.restoreFieldFocus();

          d.resolve();
        });
      });
    });
    return d;
  }

  _setVirtualContentParams(
    scrollingOptions,
    resultWidths,
    resultHeights,
    groupWidth,
    groupHeight,
    hasHeight,
    rowsAreaWidth,
  ) {
    const virtualContentParams = this._dataController.calculateVirtualContentParams({
      virtualRowHeight: scrollingOptions.virtualRowHeight,
      virtualColumnWidth: scrollingOptions.virtualColumnWidth,
      itemWidths: resultWidths,
      itemHeights: resultHeights,
      rowCount: resultHeights.length,
      columnCount: resultWidths.length,
      viewportWidth: groupWidth,
      viewportHeight: hasHeight ? groupHeight : getOuterHeight(window),
    });

    this._dataArea.setVirtualContentParams({
      top: virtualContentParams.contentTop,
      left: virtualContentParams.contentLeft,
      width: virtualContentParams.width,
      height: virtualContentParams.height,
    });

    this._rowsArea.setVirtualContentParams({
      top: virtualContentParams.contentTop,
      width: rowsAreaWidth,
      height: virtualContentParams.height,
    });

    this._columnsArea.setVirtualContentParams({
      left: virtualContentParams.contentLeft,
      width: virtualContentParams.width,
      height: getHeight(this._columnsArea.groupElement()),
    });
  }

  applyPartialDataSource(area, path, dataSource) {
    this._dataController.applyPartialDataSource(area, path, dataSource);
  }
}

Object.assign(PivotGrid.prototype, ExportMixin);
Object.assign(PivotGrid.prototype, ChartIntegrationMixin);

registerComponent('dxPivotGrid', PivotGrid);

export default { PivotGrid };
export { PivotGrid };
