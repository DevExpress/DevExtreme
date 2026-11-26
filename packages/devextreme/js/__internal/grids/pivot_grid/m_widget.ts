import { name as clickEventName } from '@js/common/core/events/click';
import { addNamespace } from '@js/common/core/events/utils/index';
import localizationMessage from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import { getPublicElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { deferRender, deferUpdate, noop } from '@js/core/utils/common';
import type { DeferredObj } from '@js/core/utils/deferred';
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
import type { DxEvent } from '@js/events';
import type { ButtonStyle, Properties } from '@js/ui/button';
import Button from '@js/ui/button';
import type { PositioningEvent } from '@js/ui/context_menu';
import type dxLoadPanel from '@js/ui/load_panel';
import type { Properties as LoadPanelProperties } from '@js/ui/load_panel';
import type { Properties as PopupProperties, ToolbarItem } from '@js/ui/popup';
import Popup from '@js/ui/popup/ui.popup';
import { restoreFocus, saveFocusedElementInfo } from '@js/ui/shared/accessibility';
import { current, isGeneric } from '@js/ui/themes';
import { getData } from '@ts/core/element_data';
import type { OptionChanged } from '@ts/core/widget/types';
import Widget from '@ts/core/widget/widget';
import eventsEngine from '@ts/events/core/events_engine';
import gridCoreUtils from '@ts/grids/grid_core/utils';
import ContextMenu from '@ts/ui/context_menu/context_menu';
import type Scrollable from '@ts/ui/scroll_view/scrollable';

import type { AreaItem } from './area_item/area_item';
import type {
  AreaItemCell,
  AreaItemScrollEvent,
  AreaName,
} from './area_item/types';
import { ChartIntegrationMixin } from './chart_integration/chart_integration';
import type { DataArea } from './data_area/data_area';
import DataAreaImport from './data_area/data_area';
import type { DataController } from './data_controller/data_controller';
import DataControllerImport from './data_controller/data_controller';
import type { DataControllerOptions } from './data_controller/types';
import type { PivotGridDataSource } from './data_source/data_source';
import type { DataSourceHeaderArea } from './data_source/types';
import { ExportMixin } from './export/export';
import type { ExportPivotGrid } from './export/types';
import { getFieldsHotkeysA11yLabel } from './field_chooser/a11y';
import { FIELD_DATA_KEY } from './field_chooser/const';
import { FieldChooserBase } from './field_chooser/field_chooser_base';
import { FieldChooser } from './field_chooser/m_field_chooser';
import { FieldsArea } from './fields_area/fields_area';
import type { HorizontalHeadersArea, VerticalHeadersArea } from './headers_area/headers_area';
import HeadersArea from './headers_area/headers_area';
import { FAKE_TABLE_CLASS, HORIZONTAL_HEADERS_AREA_CLASS, VERTICAL_HEADERS_AREA_CLASS } from './keyboard_navigation/const';
import { RovingTabIndex } from './keyboard_navigation/roving_tab_index';
import type { CellNavigationDirection } from './keyboard_navigation/table_cell_navigation';
import { buildCellMatrix, getAdjacentCell } from './keyboard_navigation/table_cell_navigation';
import type {
  PivotGridCellArgs,
  PivotGridCellEvent,
  PivotGridCellEventArgs,
  PivotGridContextMenuArgs,
  PivotGridContextMenuItem,
  PivotGridEventArgs,
  PivotGridField,
  PivotGridFieldArgs,
  PivotGridProperties,
  PivotGridRenderedAreas,
} from './types';
import { findField, mergeArraysByMaxValue, setFieldProperty } from './widget_utils';

type FieldChooserOptions = NonNullable<PivotGridProperties['fieldChooser']>;
type FieldPanelOptions = NonNullable<PivotGridProperties['fieldPanel']>;
type ScrollingOptions = NonNullable<PivotGridProperties['scrolling']>;

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

function getArraySum(array: number[]): number {
  let sum = 0;

  each(array, (_, value) => {
    sum += value || 0;
  });

  return sum;
}

function adjustSizeArray(sizeArray: number[], space: number): void {
  const delta = space / sizeArray.length;

  for (let i = 0; i < sizeArray.length; i += 1) {
    sizeArray[i] -= delta;
  }
}

function unsubscribeScrollEvents(area: AreaItem): void {
  area.off('scroll')
    .off('stop');
}

function subscribeToScrollEvent(
  area: AreaItem,
  handler: (e: AreaItemScrollEvent) => void,
): void {
  unsubscribeScrollEvents(area);

  area.on('scroll', handler)
    .on('stop', handler);
}

function getCommonBorderWidth(elements: dxElementWrapper[], direction: 'width' | 'height'): number {
  const borderStyleNames = direction === 'width'
    ? ['borderLeftWidth', 'borderRightWidth'] as const
    : ['borderTopWidth', 'borderBottomWidth'] as const;
  let width = 0;

  each(elements, (_, elem) => {
    const computedStyle = window.getComputedStyle(elem.get(0));
    borderStyleNames.forEach((borderStyleName) => {
      width += parseFloat(computedStyle[borderStyleName]) || 0;
    });
  });

  return width;
}

function clickedOnFieldsArea($targetElement: dxElementWrapper): number {
  return $targetElement.closest(`.${FIELDS_CLASS}`).length || $targetElement.find(`.${FIELDS_CLASS}`).length;
}

const isCellEventArgs = (args: PivotGridEventArgs): args is PivotGridCellEventArgs => 'cell' in args;

class PivotGrid extends Widget<PivotGridProperties> {
  public _dataController!: DataController;

  protected _columnsAreaNavigation: RovingTabIndex | undefined;

  protected _rowsAreaNavigation: RovingTabIndex | undefined;

  protected _contextMenuOwnerNavigation: RovingTabIndex | undefined;

  public _scrollLeft?: number | null;

  protected _scrollTop?: number | null;

  protected _actions!: Record<string, (event?: unknown) => void>;

  protected _hideLoadingTimeoutID?: ReturnType<typeof setTimeout>;

  protected _hasHeight?: boolean | null;

  protected _scrollUpdating?: boolean;

  protected _pivotGridContainer?: dxElementWrapper;

  protected _contextMenu?: ContextMenu;

  public _loadPanel?: dxLoadPanel | null;

  protected _startLoadingTime?: Date;

  public _dataArea?: DataArea;

  public _fieldChooserPopup?: Popup;

  protected _fieldChooserBase?: FieldChooserBase;

  public _columnsArea?: HorizontalHeadersArea;

  public _rowsArea?: VerticalHeadersArea;

  public _rowFields?: FieldsArea;

  protected _columnFields?: FieldsArea;

  protected _filterFields?: FieldsArea;

  protected _dataFields?: FieldsArea;

  public _testResultWidths?: number[];

  public _testResultHeights?: number[];

  protected __scrollBarUseNative?: boolean;

  public __scrollBarWidth?: number;

  public $fieldChooserButton?: dxElementWrapper;

  public _getDefaultOptions(): PivotGridProperties {
    // @ts-expect-error the defaults hold text formatters and nulls the public options don't allow
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

  protected _updateCalculatedOptions(fields: PivotGridField[]): void {
    each(fields, (_, field) => {
      each(FIELD_CALCULATED_OPTIONS, (__, optionName) => {
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

  protected _getDataControllerOptions(): DataControllerOptions {
    return {
      component: this,
      // @ts-expect-error the data controller also takes arrays and null, its options type doesn't
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

      onFieldsPrepared: (fields): void => {
        this._updateCalculatedOptions(fields);
      },
    };
  }

  protected _initDataController(): void {
    if (this._dataController) {
      this._dataController.dispose();
    }

    this._dataController = new DataControllerImport.DataController(
      this._getDataControllerOptions(),
    );

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
      this._updateLoading();
    });

    this._dataController.progressChanged.add(this._updateLoading.bind(this));

    this._dataController.dataSourceChanged.add(() => {
      this._trigger('onChanged', undefined);
    });

    const expandValueChanging = this.option('onExpandValueChanging');

    if (expandValueChanging) {
      this._dataController.expandValueChanging.add((e) => {
        expandValueChanging(e);
      });
    }
  }

  public _init(): void {
    super._init();
    this._initDataController();

    this._scrollLeft = null;
    this._scrollTop = null;
    this._initActions();
  }

  protected _initActions(): void {
    this._actions = {
      onChanged: this._createActionByOption('onChanged'),
      onContextMenuPreparing: this._createActionByOption('onContextMenuPreparing'),
      onCellClick: this._createActionByOption('onCellClick'),
      onExporting: this._createActionByOption('onExporting'),
      onCellPrepared: this._createActionByOption('onCellPrepared'),
    };
  }

  public _trigger(eventName: string, eventArg: unknown): void {
    this._actions[eventName](eventArg);
  }

  public _optionChanged(args: OptionChanged<PivotGridProperties>): void {
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
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        this.getFieldChooserPopup()?.hide();
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
        if (hasWindow()) {
          this._renderLoadPanel(this._dataArea?.groupElement(), this.$element());
        }
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
            this._renderLoadPanel(this._dataArea?.groupElement(), this.$element());
          } else {
            this._renderLoadPanel(this._dataArea?.groupElement(), this.$element());
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

  protected _updateScrollPosition(
    columnsArea: HorizontalHeadersArea,
    rowsArea: VerticalHeadersArea,
    dataArea: DataArea,
    force = false,
  ): void {
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
      const scrollTop = this._scrollTop || 0;
      const scrollLeft = this._scrollLeft || 0;

      dataArea.scrollTo({ left: scrollLeft, top: scrollTop }, force);
      columnsArea.scrollTo({ left: scrollLeft }, force);
      rowsArea.scrollTo({ top: scrollTop }, force);
      // @ts-expect-error the scroll top is null when the rows area has no scroll
      this._dataController.updateWindowScrollPosition(this._scrollTop);
    }

    this._scrollUpdating = false;
  }

  protected _subscribeToEvents(
    columnsArea: HorizontalHeadersArea,
    rowsArea: VerticalHeadersArea,
    dataArea: DataArea,
  ): void {
    const scrollHandler = (e: AreaItemScrollEvent, area: AreaItem): void => {
      const { scrollOffset } = e;

      // @ts-expect-error the area's scrollable is rendered here
      const scrollable: Scrollable = area._getScrollable();

      const leftOffset = scrollable.option('direction') !== 'vertical' ? scrollOffset.left : this._scrollLeft;
      const topOffset = scrollable.option('direction') !== 'horizontal' && this._hasHeight ? scrollOffset.top : this._scrollTop;

      if ((this._scrollLeft || 0) !== (leftOffset || 0)
        || (this._scrollTop || 0) !== (topOffset || 0)) {
        this._scrollLeft = leftOffset;
        this._scrollTop = topOffset;

        this._updateScrollPosition(columnsArea, rowsArea, dataArea);

        if (this.option('scrolling.mode') === 'virtual') {
          this._dataController.setViewportPosition(
            this._scrollLeft ?? undefined,
            this._scrollTop ?? undefined,
          );
        }
      }
    };

    each([columnsArea, rowsArea, dataArea], (_, area) => {
      subscribeToScrollEvent(area, (e) => scrollHandler(e, area));
    });

    const groupElement = dataArea.groupElement();
    if (!this._hasHeight && groupElement) {
      this._dataController.subscribeToWindowScrollEvents(groupElement);
    }
  }

  public _clean(): void {
    noop();
  }

  protected _needDelayResizing(cellsInfo: unknown[][]): boolean {
    const cellsCount = cellsInfo.length * (cellsInfo.length ? cellsInfo[0].length : 0);
    return cellsCount > Number(this.option('renderCellCountLimit'));
  }

  protected _renderFieldChooser(): void {
    const container = this._pivotGridContainer;
    const fieldChooserOptions: FieldChooserOptions = this.option('fieldChooser') ?? {};
    const toolbarItems: ToolbarItem[] = fieldChooserOptions.applyChangesMode === 'onDemand' ? [
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: localizationMessage.format('OK'),
          onClick: (): void => {
            // @ts-expect-error dxPivotGridFieldChooser is added to the renderer at runtime
            this.getFieldChooserPopup()?.$content().dxPivotGridFieldChooser('applyChanges');
            // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
            this.getFieldChooserPopup()?.hide();
          },
        },
      },
      {
        toolbar: 'bottom',
        location: 'after',
        widget: 'dxButton',
        options: {
          text: localizationMessage.format('Cancel'),
          onClick: (): void => {
            // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
            this.getFieldChooserPopup()?.hide();
          },
        },
      },
    ] : [];
    const fieldChooserComponentOptions = {
      layout: fieldChooserOptions.layout,
      texts: fieldChooserOptions.texts ?? {},
      dataSource: this.getDataSource(),
      allowSearch: fieldChooserOptions.allowSearch,
      searchTimeout: fieldChooserOptions.searchTimeout,
      width: undefined,
      height: undefined,
      headerFilter: this.option('headerFilter'),
      encodeHtml: this.option('fieldChooser.encodeHtml') ?? this.option('encodeHtml'),
      applyChangesMode: fieldChooserOptions.applyChangesMode,
      rtlEnabled: this.option('rtlEnabled'),
      onContextMenuPreparing: (e: unknown): void => {
        this._trigger('onContextMenuPreparing', e);
      },
    };
    const popupOptions: PopupProperties = {
      shading: false,
      title: fieldChooserOptions.title,
      width: fieldChooserOptions.width,
      height: fieldChooserOptions.height,
      showCloseButton: true,
      resizeEnabled: true,
      minWidth: fieldChooserOptions.minWidth,
      minHeight: fieldChooserOptions.minHeight,
      toolbarItems,
      onResize: (e): void => {
        // @ts-expect-error dxPivotGridFieldChooser is added to the renderer at runtime
        e.component.$content().dxPivotGridFieldChooser('updateDimensions');
      },
      onShown: (e): void => {
        this._createComponent(
          e.component.content(),
          FieldChooser,
          // @ts-expect-error the field chooser's options aren't typed yet
          fieldChooserComponentOptions,
        );
      },
      onHidden: (e): void => {
        // @ts-expect-error dxPivotGridFieldChooser is added to the renderer at runtime
        const fieldChooser: FieldChooser = e.component.$content().dxPivotGridFieldChooser('instance');
        fieldChooser.resetTreeView();
        fieldChooser.cancelChanges();

        if (this.$fieldChooserButton) {
          this.$fieldChooserButton.get<HTMLElement>(0).focus();
        }
      },
    };

    const fieldChooserPopup = this.getFieldChooserPopup();

    if (fieldChooserPopup) {
      fieldChooserPopup.option(popupOptions);
      // @ts-expect-error dxPivotGridFieldChooser is added to the renderer at runtime
      fieldChooserPopup.$content().dxPivotGridFieldChooser(fieldChooserComponentOptions);
    } else if (container) {
      this._fieldChooserPopup = this._createComponent(
        $(DIV)
          .addClass(FIELD_CHOOSER_POPUP_CLASS)
          .appendTo(container),
        Popup,
        popupOptions,
      );
    }
  }

  protected _renderContextMenu(): void {
    const $container = this._pivotGridContainer;

    if (!$container) {
      return;
    }

    if (this._contextMenu) {
      this._contextMenu.$element().remove();
    }

    this._contextMenu = this._createComponent($(DIV).appendTo($container), ContextMenu, {
      onPositioning: (actionArgs: PositioningEvent & { cancel?: boolean }) => {
        const { event } = actionArgs;

        actionArgs.cancel = true;

        if (!event) {
          return;
        }

        const eventTarget: Element & { cellIndex?: number } = event.target;
        const targetElement = (eventTarget.cellIndex ?? -1) >= 0
          ? eventTarget as HTMLTableCellElement
          : $(eventTarget).closest('td').get(0) as HTMLTableCellElement | undefined;
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
              // @ts-expect-error position.of is typed without the renderer wrapper
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
      onItemClick: (params) => {
        const { itemData }: { itemData?: PivotGridContextMenuItem } = params;
        if (itemData?.onItemClick) {
          itemData.onItemClick(params);
        }
      },
      cssClass: PIVOTGRID_CLASS,
      // @ts-expect-error target is typed without the renderer wrapper
      target: this.$element(),
    });
  }

  protected _getContextMenuItems(
    e: PivotGridContextMenuArgs,
  ): PivotGridContextMenuItem[] | undefined {
    const items: PivotGridContextMenuItem[] = [];
    const texts = this.option('texts');

    if ((e.area === 'row' || e.area === 'column') && e.cell) {
      const { cell } = e;
      const areaFields = e[`${e.area}Fields`];
      const oppositeAreaFields = e[e.area === 'column' ? 'rowFields' : 'columnFields'];
      const field = cell.path && areaFields[cell.path.length - 1];
      const dataSource = this.getDataSource();

      if (field?.allowExpandAll && cell.path && cell.path.length < e[`${e.area}Fields`].length && !dataSource.paginate()) {
        items.push({
          beginGroup: true,
          icon: 'none',
          text: texts?.expandAll,
          onItemClick: () => {
            if (isDefined(field.index)) {
              dataSource.expandAll(field.index);
            }
          },
        });
        items.push({
          text: texts?.collapseAll,
          icon: 'none',
          onItemClick: () => {
            if (isDefined(field.index)) {
              dataSource.collapseAll(field.index);
            }
          },
        });
      }

      if (cell.isLast && !dataSource.paginate()) {
        let sortingBySummaryItemCount = 0;
        each(oppositeAreaFields, (_, oppositeField) => {
          if (!oppositeField.allowSortingBySummary) {
            return;
          }

          each(e.dataFields, (dataIndex, dataField) => {
            if (isDefined(cell.dataIndex) && cell.dataIndex !== dataIndex) {
              return;
            }

            const showDataFieldCaption = !isDefined(cell.dataIndex) && e.dataFields.length > 1;
            const textFormat = e.area === 'column' ? texts?.sortColumnBySummary : texts?.sortRowBySummary;
            const checked = findField(e.dataFields, oppositeField.sortBySummaryField) === dataIndex
              && (cell.path ?? []).join('/') === (oppositeField.sortBySummaryPath ?? []).join('/');
            const text = formatString(textFormat, showDataFieldCaption ? `${oppositeField.caption} - ${dataField.caption}` : oppositeField.caption);
            const sortIcon = oppositeField.sortOrder === 'desc' ? 'sortdowntext' : 'sortuptext';

            items.push({
              beginGroup: sortingBySummaryItemCount === 0,
              icon: checked ? sortIcon : 'none',
              text,
              onItemClick: () => {
                if (isDefined(oppositeField.index)) {
                  dataSource.field(oppositeField.index, {
                    sortBySummaryField: dataField.name || dataField.caption || dataField.dataField,
                    // @ts-expect-error header paths are typed as unknown[]
                    sortBySummaryPath: cell.path,
                    sortOrder: oppositeField.sortOrder === 'desc' ? 'asc' : 'desc',
                  });
                }
                dataSource.load();
              },
            });
            sortingBySummaryItemCount += 1;
          });
        });
        each(oppositeAreaFields, (_, oppositeField) => {
          if (!oppositeField.allowSortingBySummary
            || !isDefined(oppositeField.sortBySummaryField)) {
            return undefined;
          }
          items.push({
            beginGroup: sortingBySummaryItemCount === 0,
            icon: 'none',
            text: texts?.removeAllSorting,
            onItemClick: () => {
              each(oppositeAreaFields, (__, sortedField) => {
                if (isDefined(sortedField.index)) {
                  dataSource.field(sortedField.index, {
                    sortBySummaryField: undefined,
                    sortBySummaryPath: undefined,
                    sortOrder: undefined,
                  });
                }
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
        text: texts?.showFieldChooser,
        onItemClick: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
          this.getFieldChooserPopup()?.show();
        },
      });
    }

    if (this.option('export.enabled')) {
      items.push({
        beginGroup: true,
        icon: 'xlsxfile',
        text: texts?.exportToExcel,
        onItemClick: () => {
          (this as PivotGrid as ExportPivotGrid).exportTo();
        },
      });
    }

    e.items = items;
    this._trigger('onContextMenuPreparing', e);

    if (e.items?.length) {
      return e.items;
    }

    return undefined;
  }

  protected _createEventArgs(
    targetElement: HTMLTableCellElement,
    dxEvent: DxEvent,
  ): PivotGridEventArgs {
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

  protected _createFieldArgs(targetElement: Element): PivotGridFieldArgs {
    const field = getData($(targetElement).children(), FIELD_DATA_KEY);
    const args = {
      field,
    };
    return isDefined(field) ? args : {};
  }

  protected _createCellArgs(cellElement: HTMLTableCellElement): PivotGridCellArgs {
    const $cellElement = $(cellElement);
    const columnIndex = cellElement.cellIndex;
    const { rowIndex } = cellElement.parentElement as HTMLTableRowElement;
    const $table = $cellElement.closest('table');
    const data: AreaItemCell[][] | undefined = $table.data('data');
    const cell = data?.[rowIndex]?.[columnIndex];
    const area: AreaName | undefined = $table.data('area');
    const args = {
      area,
      rowIndex,
      columnIndex,
      cellElement: getPublicElement($cellElement),
      cell,
    };
    return args;
  }

  protected _handleCellClick(e: PivotGridCellEvent<MouseEvent>): void {
    const args = this._createEventArgs(e.currentTarget, e);
    if (!isCellEventArgs(args)) {
      return;
    }
    const { cell } = args;

    if (!cell || (!args.area && (args.rowIndex || args.columnIndex))) {
      return;
    }

    this._trigger('onCellClick', args);

    if (cell && !args.cancel && isDefined(cell.expanded)) {
      setTimeout(() => {
        // @ts-expect-error only row and column header cells are expandable
        this._dataController[cell.expanded ? 'collapseHeaderItem' : 'expandHeaderItem'](args.area, cell.path);
      });
    }
  }

  protected _getColumnsAreaNavigation(): RovingTabIndex {
    this._columnsAreaNavigation = this._columnsAreaNavigation ?? new RovingTabIndex({
      component: this,
      getItems: (): HTMLElement[] => this._getColumnHeaderCells(),
      scrollToItem: (item): void => this._columnsArea?.scrollToElement(item),
      getItemId: (item): string | undefined => this._getHeaderCellId(item),
    });

    return this._columnsAreaNavigation;
  }

  // aria-colindex is absolute (it includes the virtual scrolling offset), so
  // it identifies the same logical cell across re-renders that re-slice the
  // rendered header pages.
  protected _getHeaderCellId(cell: HTMLElement): string | undefined {
    const columnIndex = cell.getAttribute('aria-colindex');
    const row = cell.parentElement as HTMLTableRowElement | null;

    if (!columnIndex || !row) {
      return undefined;
    }

    return `${row.sectionRowIndex}:${columnIndex}`;
  }

  protected _getRowsAreaNavigation(): RovingTabIndex {
    this._rowsAreaNavigation = this._rowsAreaNavigation ?? new RovingTabIndex({
      component: this,
      getItems: (): HTMLElement[] => this._getRowHeaderCells(),
      scrollToItem: (item): void => this._rowsArea?.scrollToElement(item),
      getItemId: (item): string | undefined => this._getRowHeaderCellId(item),
    });

    return this._rowsAreaNavigation;
  }

  // aria-rowindex is absolute as well, so it identifies the same logical row
  // header cell across virtual scrolling re-renders.
  protected _getRowHeaderCellId(cell: HTMLElement): string | undefined {
    const rowIndex = cell.getAttribute('aria-rowindex');
    const { cellIndex } = cell as HTMLTableCellElement;

    if (!rowIndex || cellIndex < 0) {
      return undefined;
    }

    return `${cellIndex}:${rowIndex}`;
  }

  protected _getHeaderAreaCells(cellSelector: string): HTMLElement[] {
    const element = this.$element().get(0);

    if (!element) {
      return [];
    }

    const cells: HTMLElement[] = Array.from(element.querySelectorAll(cellSelector));

    return cells.filter((cell) => !cell.closest(`.${FAKE_TABLE_CLASS}`));
  }

  // Only cells marked as navigable on render take part in the roving
  // tabindex: whitespace filler cells are rendered without tabindex.
  protected _getColumnHeaderCells(): HTMLElement[] {
    return this._getHeaderAreaCells(`thead.${HORIZONTAL_HEADERS_AREA_CLASS} td[tabindex]`);
  }

  protected _getRowHeaderCells(): HTMLElement[] {
    return this._getHeaderAreaCells(`tbody.${VERTICAL_HEADERS_AREA_CLASS} td[tabindex]`);
  }

  protected _getCellAreaNavigation(cell: HTMLElement): RovingTabIndex | undefined {
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

  protected _normalizeCellNavigationDirection(
    direction: CellNavigationDirection,
  ): CellNavigationDirection {
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

  protected _handleCellArrowKeyDown(
    e: PivotGridCellEvent<KeyboardEvent>,
    direction: CellNavigationDirection,
  ): void {
    const cell = e.currentTarget;
    const navigation = this._getCellAreaNavigation(cell);

    if (!navigation) {
      return;
    }

    e.preventDefault();

    const section = cell.closest<HTMLTableSectionElement>('thead, tbody');
    if (!section) {
      return;
    }

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

  protected _handleCellFocusIn(e: PivotGridCellEvent<FocusEvent>): void {
    this._getCellAreaNavigation(e.currentTarget)?.handleFocusIn(e.currentTarget);
  }

  protected _handleCellContextMenuKeyDown(e: PivotGridCellEvent<KeyboardEvent>): void {
    const cell = e.currentTarget;
    const navigation = this._getCellAreaNavigation(cell);

    if (!navigation) {
      return;
    }

    this._showContextMenuFromKeyboard(e, navigation);
  }

  protected _handleFieldContextMenuKeyDown(
    e: DxEvent<KeyboardEvent>,
    navigation: RovingTabIndex,
  ): void {
    this._showContextMenuFromKeyboard(e, navigation);
  }

  protected _showContextMenuFromKeyboard(
    e: DxEvent<KeyboardEvent>,
    navigation: RovingTabIndex,
  ): void {
    if (!this._contextMenu) {
      return;
    }

    // The internal _show is called instead of the public show() because only
    // _show accepts the initiating event that onPositioning builds items from.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    this._contextMenu._show(e);

    if (this._contextMenu.option('visible')) {
      e.preventDefault();
      this._contextMenuOwnerNavigation = navigation;
    }
  }

  protected _handleCellKeyDown(e: PivotGridCellEvent<KeyboardEvent>): void {
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
    const onReady = (): void => {
      this.off('contentReady', onReady);
      restoreFocus(this);
    };
    this.on('contentReady', onReady);
    setTimeout(() => {
      // @ts-expect-error only row and column header cells are expandable
      this._dataController[cell.expanded ? 'collapseHeaderItem' : 'expandHeaderItem'](args.area, cell.path);
    });
  }

  public _getNoDataText(): string | undefined {
    return this.option('texts')?.noData;
  }

  protected _renderNoDataText(element?: dxElementWrapper): void {
    return gridCoreUtils.renderNoDataText.call(this, element);
  }

  protected _renderLoadPanel(
    element: dxElementWrapper | undefined,
    container: dxElementWrapper,
  ): void {
    // @ts-expect-error renderLoadPanel() doesn't use the element
    return gridCoreUtils.renderLoadPanel.call(this, element, container, undefined);
  }

  protected _updateLoading(progress?: number): void {
    const isLoading = this._dataController.isLoading();

    if (!this._loadPanel) return;

    const loadPanelVisible = this._loadPanel.option('visible');

    if (!loadPanelVisible) {
      this._startLoadingTime = new Date();
    }
    if (isLoading) {
      if (progress) {
        if (Number(new Date()) - Number(this._startLoadingTime) >= 1000) {
          this._loadPanel.option('message', `${Math.floor(progress * 100)}%`);
        }
      } else {
        this._loadPanel.option('message', this.option('loadPanel')?.text);
      }
    }
    clearTimeout(this._hideLoadingTimeoutID);
    if (loadPanelVisible && !isLoading) {
      this._hideLoadingTimeoutID = setTimeout(() => {
        this._loadPanel?.option('visible', false);
        this.$element().removeClass(OVERFLOW_HIDDEN_CLASS);
      });
    } else {
      const visibilityOptions: LoadPanelProperties = {
        visible: isLoading,
      };
      if (isLoading) {
        // @ts-expect-error position.of is typed without the renderer wrapper
        visibilityOptions.position = gridCoreUtils.calculateLoadPanelPosition(
          this._dataArea?.groupElement(),
        );
      }
      this._loadPanel.option(visibilityOptions);
      this.$element().toggleClass(OVERFLOW_HIDDEN_CLASS, !isLoading);
    }
  }

  protected _renderDescriptionArea(): void {
    const $element = this.$element();
    const $descriptionCell = $element.find(`.${DESCRIPTION_AREA_CELL_CLASS}`);
    const $toolbarContainer = $(DIV).addClass('dx-pivotgrid-toolbar');
    const fieldPanel: FieldPanelOptions = this.option('fieldPanel') ?? {};
    const $filterHeader = $element.find('.dx-filter-header');
    const $columnHeader = $element.find('.dx-column-header');

    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned in the if/else
    let $targetContainer: dxElementWrapper;

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
        hint: this.option('texts')?.showFieldChooser,
        elementAttr: {
          'aria-label': this.option('texts')?.showFieldChooser,
          'aria-haspopup': 'dialog',
        },
        stylingMode: buttonStylingMode,
        onClick: () => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
          this.getFieldChooserPopup()?.show();
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
        hint: this.option('texts')?.exportToExcel,
        stylingMode: buttonStylingMode,
        onClick: () => {
          (this as PivotGrid as ExportPivotGrid).exportTo();
        },
      };

      this._createComponent($buttonElement, Button, buttonOptions);
    }
  }

  protected _detectHasContainerHeight(): void {
    const element = this.$element();

    if (isDefined(this._hasHeight)) {
      const height = this.option('height') || this.$element().get<HTMLElement>(0).style.height;

      if (height && (this._hasHeight !== (height !== 'auto'))) {
        this._hasHeight = null;
      }
    }

    if (isDefined(this._hasHeight) || element.is(':hidden')) {
      return;
    }

    this._pivotGridContainer?.addClass('dx-hidden');
    const testElement = $(DIV);
    setHeight(testElement, TEST_HEIGHT);
    element.append(testElement);
    this._hasHeight = getHeight(element.get(0)) !== TEST_HEIGHT;
    this._pivotGridContainer?.removeClass('dx-hidden');
    testElement.remove();
  }

  protected _renderHeaders(
    rowHeaderContainer: dxElementWrapper | undefined,
    columnHeaderContainer: dxElementWrapper | undefined,
    filterHeaderContainer: dxElementWrapper | undefined,
    dataHeaderContainer: dxElementWrapper | undefined,
  ): void {
    const dataSource = this.getDataSource();

    this._rowFields ??= new FieldsArea(this, 'row');
    // @ts-expect-error the fields area renders fields, not cells
    this._rowFields.render(rowHeaderContainer, dataSource.getAreaFields('row'));

    this._columnFields ??= new FieldsArea(this, 'column');
    // @ts-expect-error the fields area renders fields, not cells
    this._columnFields.render(columnHeaderContainer, dataSource.getAreaFields('column'));

    this._filterFields ??= new FieldsArea(this, 'filter');
    // @ts-expect-error the fields area renders fields, not cells
    this._filterFields.render(filterHeaderContainer, dataSource.getAreaFields('filter'));

    this._dataFields ??= new FieldsArea(this, 'data');
    // @ts-expect-error the fields area renders fields, not cells
    this._dataFields.render(dataHeaderContainer, dataSource.getAreaFields('data'));

    this._fieldChooserBase?.renderSortable();
    this._fieldChooserBase?.restoreFieldFocus();
  }

  protected _createTableElement(): dxElementWrapper {
    const $table = $('<table>')
      .attr('role', 'presentation')
      .css({ width: '100%' })
      .toggleClass(BORDERS_CLASS, !!this.option('showBorders'))
      .toggleClass('dx-word-wrap', !!this.option('wordWrapEnabled'));

    eventsEngine.on($table, addNamespace(clickEventName, 'dxPivotGrid'), 'td', this._handleCellClick.bind(this));
    eventsEngine.on($table, addNamespace('keydown', 'dxPivotGrid'), 'td', this._handleCellKeyDown.bind(this));
    eventsEngine.on($table, addNamespace('focusin', 'dxPivotGrid'), 'td', this._handleCellFocusIn.bind(this));

    return $table;
  }

  protected _renderDataArea(dataAreaElement: dxElementWrapper | undefined): DataArea {
    const dataArea = this._dataArea ?? new DataAreaImport.DataArea(this);
    this._dataArea = dataArea;
    dataArea.render(dataAreaElement, this._dataController.getCellsInfo());

    return dataArea;
  }

  protected _renderRowsArea(rowsAreaElement: dxElementWrapper | undefined): VerticalHeadersArea {
    const rowsArea = this._rowsArea ?? new HeadersArea.VerticalHeadersArea(this);
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

  protected _scheduleNavigationFocusRestore(navigation: RovingTabIndex): void {
    const onReady = (): void => {
      this.off('contentReady', onReady);
      if (!navigation.containsActiveElement()) {
        navigation.refocusFocusedItem();
      }
    };
    this.on('contentReady', onReady);
  }

  protected _renderColumnsArea(
    columnsAreaElement: dxElementWrapper | undefined,
  ): HorizontalHeadersArea {
    const columnsArea = this._columnsArea ?? new HeadersArea.HorizontalHeadersArea(this);
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

  public _initMarkup(): void {
    super._initMarkup();
    this.$element()
      .addClass(PIVOTGRID_CLASS)
      .attr('role', 'group')
      .attr('aria-label', getFieldsHotkeysA11yLabel(localizationMessage.format('dxPivotGrid-ariaLabel')));
  }

  public _renderContentImpl(): void {
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on the first render
    let columnsAreaElement: dxElementWrapper | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on the first render
    let rowsAreaElement: dxElementWrapper | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on the first render
    let dataAreaElement: dxElementWrapper | undefined;
    const isFirstDrawing = !this._pivotGridContainer;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on the first render
    let rowHeaderContainer: dxElementWrapper | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on the first render
    let columnHeaderContainer: dxElementWrapper | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on the first render
    let filterHeaderContainer: dxElementWrapper | undefined;
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned on the first render
    let dataHeaderContainer: dxElementWrapper | undefined;

    let tableElement = !isFirstDrawing && this._tableElement();

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
      allowFieldDragging: this.option('fieldPanel')?.allowFieldDragging,
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
        fieldChooserBaseConfig,
      );
    }

    const dataArea = this._renderDataArea(dataAreaElement);
    const rowsArea = this._renderRowsArea(rowsAreaElement);
    const columnsArea = this._renderColumnsArea(columnsAreaElement);

    const columnsHeadElement = columnsArea.headElement();
    if (columnsHeadElement) {
      dataArea.tableElement()?.prepend(columnsHeadElement);
    }

    if (isFirstDrawing) {
      this._renderLoadPanel(dataArea.groupElement()?.parent(), this.$element());
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

  protected _setAriaGridAttributes(
    dataArea: DataArea,
    rowsArea: VerticalHeadersArea,
    columnsArea: HorizontalHeadersArea,
  ): void {
    const $gridElement = dataArea.tableElement()?.parent();
    const tableIds = [
      columnsArea.tableElement()?.attr('id'),
      rowsArea.tableElement()?.attr('id'),
      dataArea.tableElement()?.attr('id'),
    ].filter(isDefined).join(' ');

    const rowHeaderColumnCount = this._reserveRowHeaderColumns(dataArea, rowsArea, columnsArea);

    $gridElement
      ?.attr('role', 'grid')
      .attr('aria-owns', tableIds)
      .attr('aria-rowcount', this._dataController.totalRowCount())
      .attr('aria-colcount', this._dataController.totalColumnCount() + rowHeaderColumnCount);
  }

  protected _reserveRowHeaderColumns(
    dataArea: DataArea,
    rowsArea: VerticalHeadersArea,
    columnsArea: HorizontalHeadersArea,
  ): number {
    // The reserved width is the full row-header column count, not the widest
    // rendered row: virtual scrolling can page in rows whose visible cells do
    // not reach the rightmost header column, which would otherwise shift the
    // colindex axis between pages.
    const rowHeaderColumnCount = rowsArea.getColumnsCount();

    if (!rowHeaderColumnCount) {
      return 0;
    }

    const rowsBody = rowsArea.tableElement()?.children('tbody').get<HTMLTableSectionElement>(0);
    const matrix = rowsBody ? buildCellMatrix(rowsBody) : [];
    const indexed = new Set<HTMLTableCellElement>();
    matrix.forEach((row) => {
      row.forEach((cell, columnIndex) => {
        if (cell?.getAttribute('role') && !indexed.has(cell)) {
          indexed.add(cell);
          cell.setAttribute('aria-colindex', String(columnIndex + 1));
        }
      });
    });

    const shifted = new Set<Element>();
    [columnsArea, dataArea].forEach((area) => {
      area.tableElement()?.find('td[aria-colindex]').each((_, td) => {
        if (shifted.has(td)) {
          return;
        }
        shifted.add(td);
        let base = td.getAttribute('data-dx-base-colindex');
        if (base === null) {
          base = td.getAttribute('aria-colindex');
          td.setAttribute('data-dx-base-colindex', String(base));
        }
        td.setAttribute('aria-colindex', String(Number(base) + rowHeaderColumnCount));
      });
    });

    return rowHeaderColumnCount;
  }

  protected _update(isFirstDrawing: boolean): void {
    const updateHandler = (): void => {
      this.updateDimensions();
    };
    if (this._dataArea && this._needDelayResizing(this._dataArea.getData()) && isFirstDrawing) {
      setTimeout(updateHandler);
    } else {
      updateHandler();
    }
  }

  public _fireContentReadyAction(): void {
    if (!this._dataController.isLoading()) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      super._fireContentReadyAction();
    }
  }

  public getScrollPath(area: DataSourceHeaderArea): AreaItemCell['path'] {
    if (area === 'column') {
      return this._columnsArea?.getScrollPath(Number(this._scrollLeft));
    }
    return this._rowsArea?.getScrollPath(Number(this._scrollTop));
  }

  public getDataSource(): PivotGridDataSource {
    return this._dataController.getDataSource();
  }

  public getFieldChooserPopup(): Popup | undefined {
    return this._fieldChooserPopup;
  }

  public hasScroll(area: DataSourceHeaderArea): boolean {
    return area === 'column' ? !!this._columnsArea?.hasScroll() : !!this._rowsArea?.hasScroll();
  }

  public _dimensionChanged(): void {
    this.updateDimensions();
  }

  public _visibilityChanged(visible: boolean): void {
    if (visible) {
      this.updateDimensions();
    }
  }

  public _dispose(): void {
    clearTimeout(this._hideLoadingTimeoutID);

    if (this._dataController) {
      this._dataController.dispose();
    }

    super._dispose();
  }

  public _tableElement(): dxElementWrapper {
    return this.$element().find('table').first();
  }

  public addWidgetPrefix(className: string): string {
    return `dx-pivotgrid-${className}`;
  }

  public resize(): void {
    this.updateDimensions();
  }

  public isReady(): boolean {
    return super.isReady() && !this._dataController.isLoading();
  }

  public updateDimensions(): DeferredObj<unknown> | undefined {
    const tableElement = this._tableElement();
    // eslint-disable-next-line @typescript-eslint/init-declarations -- assigned before each use
    let bordersWidth: number;
    let totalWidth = 0;
    let totalHeight = 0;
    let rowsAreaWidth = 0;

    const dataAreaCell = tableElement.find(`.${DATA_AREA_CELL_CLASS}`);
    const rowAreaCell = tableElement.find(`.${ROW_AREA_CELL_CLASS}`);
    const columnAreaCell = tableElement.find(`.${COLUMN_AREA_CELL_CLASS}`);
    const descriptionCell = tableElement.find(`.${DESCRIPTION_AREA_CELL_CLASS}`);
    const filterHeaderCell = tableElement.find('.dx-filter-header');
    const columnHeaderCell = tableElement.find('.dx-column-header');
    const rowFieldsHeader = this._rowFields;
    const d = Deferred<unknown>();

    if (!hasWindow()) {
      return undefined;
    }

    const dataArea = this._dataArea;
    const rowsArea = this._rowsArea;
    const columnsArea = this._columnsArea;
    const filterFields = this._filterFields;

    if (!rowFieldsHeader || !dataArea || !rowsArea || !columnsArea || !filterFields) {
      return undefined;
    }

    const needSynchronizeFieldPanel = rowFieldsHeader.isVisible() && this.option('rowHeaderLayout') !== 'tree';

    this._detectHasContainerHeight();

    if (!dataArea.headElement()?.length) {
      const columnsHeadElement = columnsArea.headElement();
      if (columnsHeadElement) {
        dataArea.tableElement()?.prepend(columnsHeadElement);
      }
    }

    if (needSynchronizeFieldPanel) {
      rowsArea.updateColspans(rowFieldsHeader.getColumnsCount());
      const rowFieldsHeadElement = rowFieldsHeader.headElement();
      if (rowFieldsHeadElement) {
        rowsArea.tableElement()?.prepend(rowFieldsHeadElement);
      }
    }

    tableElement.addClass(INCOMPRESSIBLE_FIELDS_CLASS);
    dataArea.reset();
    rowsArea.reset();
    columnsArea.reset();
    rowFieldsHeader.reset();

    const calculateHasScroll = (
      areaSize: number,
      totalSize: number,
    ): boolean => totalSize - areaSize >= 1;

    const calculateGroupHeight = (
      areaHeight: number,
      contentHeight: number,
      hasRowsScrollbar: boolean,
      hasColumnsScrollbar: boolean,
      scrollBarSize: number,
    ): number => (hasRowsScrollbar
      ? areaHeight
      : contentHeight + (hasColumnsScrollbar ? scrollBarSize : 0)
    );

    // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
    deferUpdate(() => {
      const rowHeights = rowsArea.getRowsHeight();
      const descriptionCellHeight = getOuterHeight(descriptionCell[0], true)
        + (needSynchronizeFieldPanel ? rowHeights[0] : 0);

      const dataAreaHeadHeight = Number(getHeight(dataArea.headElement()));
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

      const scrollBarWidth = dataArea.getScrollbarWidth();
      const rowsAreaTableHeight = Number(getHeight(rowsArea.tableElement()));
      const dataAreaTableHeight = Number(getHeight(dataArea.tableElement()));
      const correctDataTableHeight = Math.max(
        rowsAreaTableHeight,
        dataAreaTableHeight - dataAreaHeadHeight,
      );
      const hasVerticalScrollbar = calculateHasScroll(dataAreaHeight, correctDataTableHeight);

      dataArea.tableElement()?.css({
        width: this._hasHeight && hasVerticalScrollbar && scrollBarWidth
          ? `calc(100% - ${scrollBarWidth}px)`
          : '100%',
      });

      const resultWidths = dataArea.getColumnsWidth();

      const rowsAreaHeights = needSynchronizeFieldPanel ? rowHeights.slice(1) : rowHeights;
      const dataAreaHeights = dataArea.getRowsHeight();

      const columnsAreaRowCount = this._dataController.getColumnsInfo().length;

      const resultHeights = mergeArraysByMaxValue(
        rowsAreaHeights,
        dataAreaHeights.slice(columnsAreaRowCount),
      );

      const columnsAreaRowHeights = dataAreaHeights.slice(0, columnsAreaRowCount);
      const columnsAreaHeight = getArraySum(columnsAreaRowHeights);

      const rowsAreaColumnWidths = rowsArea.getColumnsWidth();

      totalWidth = Number(getWidth(dataArea.tableElement()));

      totalHeight = getArraySum(resultHeights);

      if (!totalWidth || !totalHeight) {
        d.resolve();
        return;
      }

      rowsAreaWidth = getArraySum(rowsAreaColumnWidths);

      const elementWidth = getWidth(this.$element().get(0));

      bordersWidth = getCommonBorderWidth([rowAreaCell, dataAreaCell, tableElement], 'width');
      let groupWidth = elementWidth - rowsAreaWidth - bordersWidth;

      groupWidth = groupWidth > 0 ? groupWidth : totalWidth;
      const diff = totalWidth - groupWidth;
      const needAdjustWidthOnZoom = diff >= 0 && diff <= 2;
      if (needAdjustWidthOnZoom) { // T914454
        adjustSizeArray(resultWidths, diff);
        totalWidth = groupWidth;
      }

      let hasRowsScroll = !!this._hasHeight && calculateHasScroll(dataAreaHeight, totalHeight);
      const hasColumnsScroll = calculateHasScroll(groupWidth, totalWidth);

      /// #DEBUG
      this.__scrollBarUseNative = dataArea.getUseNativeValue();
      this.__scrollBarWidth = scrollBarWidth;
      /// #ENDDEBUG

      const groupHeight = calculateGroupHeight(
        dataAreaHeight,
        totalHeight,
        hasRowsScroll,
        hasColumnsScroll,
        scrollBarWidth,
      );

      // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
      deferRender(() => {
        const dataHeadElement = dataArea.headElement();
        if (dataHeadElement) {
          columnsArea.tableElement()?.append(dataHeadElement);
        }

        const rowsHeadElement = rowsArea.headElement();
        if (rowsHeadElement) {
          rowFieldsHeader.tableElement()?.append(rowsHeadElement);
        }

        if (descriptionCellHeight > columnsAreaHeight) {
          adjustSizeArray(columnsAreaRowHeights, columnsAreaHeight - descriptionCellHeight);
          columnsArea.setRowsHeight(columnsAreaRowHeights);
        }

        tableElement.removeClass(INCOMPRESSIBLE_FIELDS_CLASS);
        columnHeaderCell.children().css('maxWidth', groupWidth);
        columnsArea.setGroupWidth(groupWidth);
        columnsArea.processScrollBarSpacing(hasRowsScroll ? scrollBarWidth : 0);
        columnsArea.setColumnsWidth(resultWidths);

        rowsArea.setGroupHeight(this._hasHeight ? groupHeight : 'auto');
        rowsArea.processScrollBarSpacing(hasColumnsScroll ? scrollBarWidth : 0);
        // B232690
        rowsArea.setColumnsWidth(rowsAreaColumnWidths);
        rowsArea.setRowsHeight(resultHeights);

        dataArea.setColumnsWidth(resultWidths);
        dataArea.setRowsHeight(resultHeights);
        dataArea.setGroupWidth(groupWidth);
        dataArea.setGroupHeight(this._hasHeight ? groupHeight : 'auto');

        if (needSynchronizeFieldPanel) {
          rowFieldsHeader.setColumnsWidth(rowsAreaColumnWidths);
        }

        dataAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !hasRowsScroll);
        rowAreaCell.toggleClass(BOTTOM_BORDER_CLASS, !hasRowsScroll);

        // T317921
        if (!this._hasHeight && (elementWidth !== getWidth(this.$element().get(0)))) {
          const widthDiff = elementWidth - getWidth(this.$element().get(0));
          if (!hasColumnsScroll) {
            adjustSizeArray(resultWidths, widthDiff);
            columnsArea.setColumnsWidth(resultWidths);
            dataArea.setColumnsWidth(resultWidths);
          }

          dataArea.setGroupWidth(groupWidth - widthDiff);
          columnsArea.setGroupWidth(groupWidth - widthDiff);
        }

        if (this._hasHeight && filterFields.isVisible()
          && getHeight(filterHeaderCell) !== filterAreaHeight) {
          const heightDiff = Number(getHeight(filterHeaderCell)) - Number(filterAreaHeight);
          if (heightDiff > 0) {
            hasRowsScroll = calculateHasScroll(dataAreaHeight - heightDiff, totalHeight);
            const filterGroupHeight = calculateGroupHeight(
              dataAreaHeight - heightDiff,
              totalHeight,
              hasRowsScroll,
              hasColumnsScroll,
              scrollBarWidth,
            );

            dataArea.setGroupHeight(filterGroupHeight);
            rowsArea.setGroupHeight(filterGroupHeight);
          }
        }

        const scrollingOptions = this.option('scrolling');

        if (scrollingOptions?.mode === 'virtual') {
          this._setVirtualContentParams(
            { dataArea, rowsArea, columnsArea },
            scrollingOptions,
            resultWidths,
            resultHeights,
            groupWidth,
            groupHeight,
            this._hasHeight,
            rowsAreaWidth,
          );
        }

        const updateScrollableResults: (DeferredObj<unknown> | undefined)[] = [];
        dataArea.updateScrollableOptions({
          direction: dataArea.getScrollableDirection(hasColumnsScroll, hasRowsScroll),
          rtlEnabled: this.option('rtlEnabled'),
        });

        each([columnsArea, rowsArea, dataArea], (_, area) => {
          updateScrollableResults.push(area.updateScrollable());
        });

        this._updateLoading();
        this._renderNoDataText(dataAreaCell);

        /// #DEBUG
        this._testResultWidths = resultWidths;
        this._testResultHeights = resultHeights;
        /// #ENDDEBUG

        when.apply($, updateScrollableResults).done(() => {
          this._setAriaGridAttributes(dataArea, rowsArea, columnsArea);
          this._updateScrollPosition(columnsArea, rowsArea, dataArea, true);
          this._subscribeToEvents(columnsArea, rowsArea, dataArea);

          this._fieldChooserBase?.restoreFieldFocus();

          d.resolve();
        });
      });
    });
    return d;
  }

  protected _setVirtualContentParams(
    { dataArea, rowsArea, columnsArea }: PivotGridRenderedAreas,
    scrollingOptions: ScrollingOptions,
    resultWidths: number[],
    resultHeights: number[],
    groupWidth: number,
    groupHeight: number,
    hasHeight: boolean | null | undefined,
    rowsAreaWidth: number,
  ): void {
    const virtualContentParams = this._dataController.calculateVirtualContentParams({
      // @ts-expect-error the default options set virtualRowHeight
      virtualRowHeight: scrollingOptions.virtualRowHeight,
      // @ts-expect-error the default options set virtualColumnWidth
      virtualColumnWidth: scrollingOptions.virtualColumnWidth,
      itemWidths: resultWidths,
      itemHeights: resultHeights,
      viewportWidth: groupWidth,
      viewportHeight: hasHeight ? groupHeight : getOuterHeight(window),
    });

    if (!virtualContentParams) {
      return;
    }

    dataArea.setVirtualContentParams({
      top: virtualContentParams.contentTop,
      left: virtualContentParams.contentLeft,
      width: virtualContentParams.width,
      height: virtualContentParams.height,
    });

    rowsArea.setVirtualContentParams({
      top: virtualContentParams.contentTop,
      width: rowsAreaWidth,
      height: virtualContentParams.height,
    });

    columnsArea.setVirtualContentParams({
      left: virtualContentParams.contentLeft,
      width: virtualContentParams.width,
      // @ts-expect-error the group element is rendered here
      height: getHeight(columnsArea.groupElement()),
    });
  }

  public applyPartialDataSource(
    ...args: Parameters<DataController['applyPartialDataSource']>
  ): void {
    this._dataController.applyPartialDataSource(...args);
  }
}

Object.assign(PivotGrid.prototype, ExportMixin);
Object.assign(PivotGrid.prototype, ChartIntegrationMixin);

registerComponent('dxPivotGrid', PivotGrid);

export default { PivotGrid };
export { PivotGrid };
