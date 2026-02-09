import { AIIntegration as aiIntegrationValue } from 'devextreme/common/ai-integration';
import type * as AiIntegrationTypes from 'devextreme/common/ai-integration';
import {
    registerGradient as chartsRegisterGradient,
    registerPattern as chartsRegisterPattern,
} from 'devextreme/common/charts';
import type * as ChartsTypes from 'devextreme/common/charts';
import {
    animationPresets as animationPresetsValue,
    cancelAnimationFrame as cancelAnimationFrameValue,
    fx as fxValue,
    requestAnimationFrame as requestAnimationFrameValue,
    TransitionExecutor as transitionExecutorValue,
} from 'devextreme/common/core/animation';
import type * as CoreAnimationTypes from 'devextreme/common/core/animation';
import {
    getTimeZones as getTimeZonesValue,
    hideTopOverlay as hideTopOverlayValue,
    initMobileViewport as initMobileViewportValue,
} from 'devextreme/common/core/environment';
import type * as CoreEnvironmentTypes from 'devextreme/common/core/environment';
import {
    off as offValue,
    on as onValue,
    one as oneValue,
    trigger as triggerValue,
} from 'devextreme/common/core/events';
import type * as CoreEventsTypes from 'devextreme/common/core/events';
import {
    formatDate as formatDateValue,
    formatMessage as formatMessageValue,
    formatNumber as formatNumberValue,
    loadMessages as loadMessagesValue,
    locale as localeValue,
    parseDate as parseDateValue,
    parseNumber as parseNumberValue,
} from 'devextreme/common/core/localization';
import type * as CoreLocalizationTypes from 'devextreme/common/core/localization';
import {
    applyChanges as dataApplyChanges,
    ArrayStore as dataArrayStore,
    base64_encode as dataBase64Encode,
    compileGetter as dataCompileGetter,
    compileSetter as dataCompileSetter,
    CustomStore as dataCustomStore,
    DataSource as dataDataSource,
    EdmLiteral as dataEdmLiteral,
    EndpointSelector as dataEndpointSelector,
    errorHandler as dataErrorHandler,
    isGroupItemsArray as dataIsGroupItemsArray,
    isItemsArray as dataIsItemsArray,
    isLoadResultObject as dataIsLoadResultObject,
    keyConverters as dataKeyConverters,
    LocalStore as dataLocalStore,
    ODataContext as dataODataContext,
    ODataStore as dataODataStore,
    query as dataQuery,
    setErrorHandler as dataSetErrorHandler,
} from 'devextreme/common/data';
import type * as DataTypes from 'devextreme/common/data';
import {
    exportDataGrid as exportDataGridToExcelValue,
    exportPivotGrid as exportPivotGridValue,
} from 'devextreme/common/export/excel';
import type * as ExcelTypes from 'devextreme/common/export/excel';
import {
    exportDataGrid as exportDataGridToPdfValue,
    exportGantt as exportGanttValue,
} from 'devextreme/common/export/pdf';
import type * as PdfTypes from 'devextreme/common/export/pdf';
import type * as GridsTypes from 'devextreme/common/grids';

type AiIntegrationModule = typeof import('devextreme/common/ai-integration');
type ChartsModule = typeof import('devextreme/common/charts');
type CoreAnimationModule = typeof import('devextreme/common/core/animation');
type CoreEnvironmentModule = typeof import('devextreme/common/core/environment');
type CoreEventsModule = typeof import('devextreme/common/core/events');
type CoreLocalizationModule = typeof import('devextreme/common/core/localization');
type DataModule = typeof import('devextreme/common/data');
type ExportExcelModule = typeof import('devextreme/common/export/excel');
type ExportPdfModule = typeof import('devextreme/common/export/pdf');

export { config, Guid, setTemplateEngine } from 'devextreme/common';
export type {
    ApplyValueMode,
    AsyncRule,
    ButtonStyle,
    ButtonType,
    CompareRule,
    ComparisonOperator,
    CustomRule,
    DataStructure,
    DataType,
    DateLike,
    DefaultOptionsRule,
    Direction,
    DisplayMode,
    DragDirection,
    Draggable,
    DragHighlight,
    EditorStyle,
    EmailRule,
    ExportFormat,
    FieldChooserLayout,
    FirstDayOfWeek,
    FloatingActionButtonDirection,
    Format,
    GlobalConfig,
    HorizontalAlignment,
    HorizontalEdge,
    LabelMode,
    MaskMode,
    Mode,
    NumericRule,
    Orientation,
    PageLoadMode,
    PageOrientation,
    PatternRule,
    Position,
    PositionAlignment,
    RangeRule,
    RequiredRule,
    Scrollable,
    ScrollbarMode,
    ScrollDirection,
    ScrollMode,
    SearchMode,
    SelectAllMode,
    SimplifiedSearchMode,
    SingleMultipleAllOrNone,
    SingleMultipleOrNone,
    SingleOrMultiple,
    SingleOrNone,
    SliderValueChangeMode,
    Sortable,
    SortOrder,
    StoreType,
    StringLengthRule,
    SubmenuShowMode,
    TabsIconPosition,
    TabsStyle,
    template,
    TextBoxPredefinedButton,
    TextEditorButton,
    TextEditorButtonLocation,
    ToolbarItemComponent,
    ToolbarItemLocation,
    TooltipShowMode,
    ValidationCallbackData,
    ValidationMessageMode,
    ValidationRule,
    ValidationRuleType,
    ValidationStatus,
    VerticalAlignment,
    VerticalEdge,
} from 'devextreme/common';

export namespace AiIntegration {
    export const AIIntegration: AiIntegrationModule['AIIntegration'] = aiIntegrationValue;

    export type AIProvider = AiIntegrationTypes.AIProvider;
    export type AIResponse = AiIntegrationTypes.AIResponse;
    export type GenerateGridColumnCommandResponse = AiIntegrationTypes.GenerateGridColumnCommandResponse;
    export type Prompt = AiIntegrationTypes.Prompt;
    export type RequestParams = AiIntegrationTypes.RequestParams;
    export type RequestParamsData = AiIntegrationTypes.RequestParamsData;
    export type Response = AiIntegrationTypes.Response;
}

export namespace Charts {
    export const registerGradient: ChartsModule['registerGradient'] = chartsRegisterGradient;
    export const registerPattern: ChartsModule['registerPattern'] = chartsRegisterPattern;

    export type AnimationEaseMode = ChartsTypes.AnimationEaseMode;
    export type AnnotationType = ChartsTypes.AnnotationType;
    export type ArgumentAxisHoverMode = ChartsTypes.ArgumentAxisHoverMode;
    export type AxisScaleType = ChartsTypes.AxisScaleType;
    export type ChartsAxisLabelOverlap = ChartsTypes.ChartsAxisLabelOverlap;
    export type ChartsColor = ChartsTypes.ChartsColor;
    export type ChartsDataType = ChartsTypes.ChartsDataType;
    export type ChartsLabelOverlap = ChartsTypes.ChartsLabelOverlap;
    export type DashStyle = ChartsTypes.DashStyle;
    export type DiscreteAxisDivisionMode = ChartsTypes.DiscreteAxisDivisionMode;
    export type Font = ChartsTypes.Font;
    export type GradientColor = ChartsTypes.GradientColor;
    export type HatchDirection = ChartsTypes.HatchDirection;
    export type LabelOverlap = ChartsTypes.LabelOverlap;
    export type LabelPosition = ChartsTypes.LabelPosition;
    export type LegendHoverMode = ChartsTypes.LegendHoverMode;
    export type LegendItem = ChartsTypes.LegendItem;
    export type LegendMarkerState = ChartsTypes.LegendMarkerState;
    export type Palette = ChartsTypes.Palette;
    export type PaletteColorSet = ChartsTypes.PaletteColorSet;
    export type PaletteExtensionMode = ChartsTypes.PaletteExtensionMode;
    export type PointInteractionMode = ChartsTypes.PointInteractionMode;
    export type PointSymbol = ChartsTypes.PointSymbol;
    export type RelativePosition = ChartsTypes.RelativePosition;
    export type ScaleBreak = ChartsTypes.ScaleBreak;
    export type ScaleBreakLineStyle = ChartsTypes.ScaleBreakLineStyle;
    export type SeriesHoverMode = ChartsTypes.SeriesHoverMode;
    export type SeriesLabel = ChartsTypes.SeriesLabel;
    export type SeriesPoint = ChartsTypes.SeriesPoint;
    export type SeriesSelectionMode = ChartsTypes.SeriesSelectionMode;
    export type SeriesType = ChartsTypes.SeriesType;
    export type ShiftLabelOverlap = ChartsTypes.ShiftLabelOverlap;
    export type TextOverflow = ChartsTypes.TextOverflow;
    export type Theme = ChartsTypes.Theme;
    export type TimeInterval = ChartsTypes.TimeInterval;
    export type TimeIntervalConfig = ChartsTypes.TimeIntervalConfig;
    export type ValueAxisVisualRangeUpdateMode = ChartsTypes.ValueAxisVisualRangeUpdateMode;
    export type ValueErrorBarDisplayMode = ChartsTypes.ValueErrorBarDisplayMode;
    export type ValueErrorBarType = ChartsTypes.ValueErrorBarType;
    export type VisualRange = ChartsTypes.VisualRange;
    export type VisualRangeUpdateMode = ChartsTypes.VisualRangeUpdateMode;
    export type WordWrap = ChartsTypes.WordWrap;
    export type ZoomPanAction = ChartsTypes.ZoomPanAction;
}

export namespace Core {
    export namespace Animation {
        export const animationPresets: CoreAnimationModule['animationPresets'] = animationPresetsValue;
        export const cancelAnimationFrame: CoreAnimationModule['cancelAnimationFrame'] = cancelAnimationFrameValue;
        export const fx: CoreAnimationModule['fx'] = fxValue;
        export const requestAnimationFrame: CoreAnimationModule['requestAnimationFrame'] =
            requestAnimationFrameValue;
        export const TransitionExecutor: CoreAnimationModule['TransitionExecutor'] = transitionExecutorValue;

        export type AnimationConfig = CoreAnimationTypes.AnimationConfig;
        export type AnimationState = CoreAnimationTypes.AnimationState;
        export type CollisionResolution = CoreAnimationTypes.CollisionResolution;
        export type CollisionResolutionCombination = CoreAnimationTypes.CollisionResolutionCombination;
        export type PositionConfig = CoreAnimationTypes.PositionConfig;
    }

    export namespace Environment {
        export const getTimeZones: CoreEnvironmentModule['getTimeZones'] = getTimeZonesValue;
        export const hideTopOverlay: CoreEnvironmentModule['hideTopOverlay'] = hideTopOverlayValue;
        export const initMobileViewport: CoreEnvironmentModule['initMobileViewport'] = initMobileViewportValue;

        export type Device = CoreEnvironmentTypes.Device;
        export type SchedulerTimeZone = CoreEnvironmentTypes.SchedulerTimeZone;
    }

    export namespace Events {
        export const off: CoreEventsModule['off'] = offValue;
        export const on: CoreEventsModule['on'] = onValue;
        export const one: CoreEventsModule['one'] = oneValue;
        export const trigger: CoreEventsModule['trigger'] = triggerValue;

        export type AsyncCancelable = CoreEventsTypes.AsyncCancelable;
        export type Cancelable = CoreEventsTypes.Cancelable;
        export type ChangedOptionInfo = CoreEventsTypes.ChangedOptionInfo;
        export type EventInfo<TComponent> = CoreEventsTypes.EventInfo<TComponent>;
        export type EventObject = CoreEventsTypes.EventObject;
        export type InitializedEventInfo<TComponent> = CoreEventsTypes.InitializedEventInfo<TComponent>;
        export type ItemInfo<TItemData = any> = CoreEventsTypes.ItemInfo<TItemData>;
        export type NativeEventInfo<TComponent, TNativeEvent = Event> =
            CoreEventsTypes.NativeEventInfo<TComponent, TNativeEvent>;
    }

    export namespace Localization {
        export const formatDate: CoreLocalizationModule['formatDate'] = formatDateValue;
        export const formatMessage: CoreLocalizationModule['formatMessage'] = formatMessageValue;
        export const formatNumber: CoreLocalizationModule['formatNumber'] = formatNumberValue;
        export const loadMessages: CoreLocalizationModule['loadMessages'] = loadMessagesValue;
        export const locale: CoreLocalizationModule['locale'] = localeValue;
        export const parseDate: CoreLocalizationModule['parseDate'] = parseDateValue;
        export const parseNumber: CoreLocalizationModule['parseNumber'] = parseNumberValue;

        export type Format = CoreLocalizationTypes.Format;
    }
}

export namespace Data {
    export const applyChanges: DataModule['applyChanges'] = dataApplyChanges;
    export const ArrayStore: DataModule['ArrayStore'] = dataArrayStore;
    export const base64_encode: DataModule['base64_encode'] = dataBase64Encode;
    export const compileGetter: DataModule['compileGetter'] = dataCompileGetter;
    export const compileSetter: DataModule['compileSetter'] = dataCompileSetter;
    export const CustomStore: DataModule['CustomStore'] = dataCustomStore;
    export const DataSource: DataModule['DataSource'] = dataDataSource;
    export const EdmLiteral: DataModule['EdmLiteral'] = dataEdmLiteral;
    export const EndpointSelector: DataModule['EndpointSelector'] = dataEndpointSelector;
    export const errorHandler: DataModule['errorHandler'] = dataErrorHandler;
    export const isGroupItemsArray: DataModule['isGroupItemsArray'] = dataIsGroupItemsArray;
    export const isItemsArray: DataModule['isItemsArray'] = dataIsItemsArray;
    export const isLoadResultObject: DataModule['isLoadResultObject'] = dataIsLoadResultObject;
    export const keyConverters: DataModule['keyConverters'] = dataKeyConverters;
    export const LocalStore: DataModule['LocalStore'] = dataLocalStore;
    export const ODataContext: DataModule['ODataContext'] = dataODataContext;
    export const ODataStore: DataModule['ODataStore'] = dataODataStore;
    export const query: DataModule['query'] = dataQuery;
    export const setErrorHandler: DataModule['setErrorHandler'] = dataSetErrorHandler;

    export type ArrayStoreOptions = DataTypes.ArrayStoreOptions;
    export type CustomStoreOptions = DataTypes.CustomStoreOptions;
    export type DataSourceOptions = DataTypes.DataSourceOptions;
    export type FilterDescriptor = DataTypes.FilterDescriptor;
    export type GroupDescriptor<T> = DataTypes.GroupDescriptor<T>;
    export type GroupingInterval = DataTypes.GroupingInterval;
    export type GroupItem = DataTypes.GroupItem;
    export type LangParams = DataTypes.LangParams;
    export type LoadOptions = DataTypes.LoadOptions;
    export type LoadResult = DataTypes.LoadResult;
    export type LoadResultObject = DataTypes.LoadResultObject;
    export type LocalStoreOptions = DataTypes.LocalStoreOptions;
    export type ODataContextOptions = DataTypes.ODataContextOptions;
    export type ODataStoreOptions = DataTypes.ODataStoreOptions;
    export type Query = DataTypes.Query;
    export type ResolvedData = DataTypes.ResolvedData;
    export type SearchOperation = DataTypes.SearchOperation;
    export type SelectDescriptor<T> = DataTypes.SelectDescriptor<T>;
    export type SortDescriptor<T> = DataTypes.SortDescriptor<T>;
    export type Store = DataTypes.Store;
    export type StoreOptions = DataTypes.StoreOptions;
    export type SummaryDescriptor<T> = DataTypes.SummaryDescriptor<T>;
}

export namespace Export {
    export namespace Excel {
        export const exportDataGrid: ExportExcelModule['exportDataGrid'] = exportDataGridToExcelValue;
        export const exportPivotGrid: ExportExcelModule['exportPivotGrid'] = exportPivotGridValue;

        export type DataGridCell = ExcelTypes.DataGridCell;
        export type DataGridExportOptions = ExcelTypes.DataGridExportOptions;
        export type PivotGridCell = ExcelTypes.PivotGridCell;
        export type PivotGridExportOptions = ExcelTypes.PivotGridExportOptions;
    }

    export namespace Pdf {
        export const exportDataGrid: ExportPdfModule['exportDataGrid'] = exportDataGridToPdfValue;
        export const exportGantt: ExportPdfModule['exportGantt'] = exportGanttValue;

        export type Cell = PdfTypes.Cell;
        export type DataGridCell = PdfTypes.DataGridCell;
        export type DataGridExportOptions = PdfTypes.DataGridExportOptions;
        export type GanttExportFont = PdfTypes.GanttExportFont;
        export type GanttExportOptions = PdfTypes.GanttExportOptions;
    }
}

export function Grids(): void {}

export namespace Grids {
    export type AdaptiveDetailRowPreparingInfo = GridsTypes.AdaptiveDetailRowPreparingInfo;
    export type AIColumnMode = GridsTypes.AIColumnMode;
    export type AIColumnRequestCreatingInfo = GridsTypes.AIColumnRequestCreatingInfo;
    export type ApplyChangesMode = GridsTypes.ApplyChangesMode;
    export type ApplyFilterMode = GridsTypes.ApplyFilterMode;
    export type ColumnAIOptions = GridsTypes.ColumnAIOptions;
    export type ColumnBase = GridsTypes.ColumnBase;
    export type ColumnButtonBase = GridsTypes.ColumnButtonBase;
    export type ColumnChooser = GridsTypes.ColumnChooser;
    export type ColumnChooserMode = GridsTypes.ColumnChooserMode;
    export type ColumnChooserSearchConfig = GridsTypes.ColumnChooserSearchConfig;
    export type ColumnChooserSelectionConfig = GridsTypes.ColumnChooserSelectionConfig;
    export type ColumnCustomizeTextArg = GridsTypes.ColumnCustomizeTextArg;
    export type ColumnFixing = GridsTypes.ColumnFixing;
    export type ColumnFixingIcons = GridsTypes.ColumnFixingIcons;
    export type ColumnFixingTexts = GridsTypes.ColumnFixingTexts;
    export type ColumnHeaderFilter = GridsTypes.ColumnHeaderFilter;
    export type ColumnHeaderFilterSearchConfig = GridsTypes.ColumnHeaderFilterSearchConfig;
    export type ColumnLookup = GridsTypes.ColumnLookup;
    export type ColumnResizeMode = GridsTypes.ColumnResizeMode;
    export type DataChange = GridsTypes.DataChange;
    export type DataChangeInfo = GridsTypes.DataChangeInfo;
    export type DataChangeType = GridsTypes.DataChangeType;
    export type DataErrorOccurredInfo = GridsTypes.DataErrorOccurredInfo;
    export type DataRenderMode = GridsTypes.DataRenderMode;
    export type EditingBase = GridsTypes.EditingBase;
    export type EditingTextsBase = GridsTypes.EditingTextsBase;
    export type EnterKeyAction = GridsTypes.EnterKeyAction;
    export type EnterKeyDirection = GridsTypes.EnterKeyDirection;
    export type FilterOperation = GridsTypes.FilterOperation;
    export type FilterPanel = GridsTypes.FilterPanel;
    export type FilterPanelTexts = GridsTypes.FilterPanelTexts;
    export type FilterRow = GridsTypes.FilterRow;
    export type FilterRowOperationDescriptions = GridsTypes.FilterRowOperationDescriptions;
    export type FilterType = GridsTypes.FilterType;
    export type FixedPosition = GridsTypes.FixedPosition;
    export type GridBase = GridsTypes.GridBase;
    export type GridBaseOptions<
        TComponent extends GridsTypes.GridBase<TRowData, TKey>,
        TRowData = any,
        TKey = any
    > = GridsTypes.GridBaseOptions<TComponent, TRowData, TKey>;
    export type GridsContextMenuTarget = GridsTypes.GridsContextMenuTarget;
    export type GridsEditMode = GridsTypes.GridsEditMode;
    export type GridsEditRefreshMode = GridsTypes.GridsEditRefreshMode;
    export type GroupExpandMode = GridsTypes.GroupExpandMode;
    export type HeaderFilter = GridsTypes.HeaderFilter;
    export type HeaderFilterGroupInterval = GridsTypes.HeaderFilterGroupInterval;
    export type HeaderFilterSearchConfig = GridsTypes.HeaderFilterSearchConfig;
    export type HeaderFilterTexts = GridsTypes.HeaderFilterTexts;
    export type KeyboardNavigation = GridsTypes.KeyboardNavigation;
    export type KeyDownInfo = GridsTypes.KeyDownInfo;
    export type LoadPanel = GridsTypes.LoadPanel;
    export type NewRowInfo = GridsTypes.NewRowInfo;
    export type NewRowPosition = GridsTypes.NewRowPosition;
    export type Pager = GridsTypes.Pager;
    export type PagerPageSize = GridsTypes.PagerPageSize;
    export type PagingBase = GridsTypes.PagingBase;
    export type RowDragging<
        TComponent extends GridsTypes.GridBase<TRowData, TKey>,
        TRowData = any,
        TKey = any
    > = GridsTypes.RowDragging<TComponent, TRowData, TKey>;
    export type RowDraggingTemplateData = GridsTypes.RowDraggingTemplateData;
    export type RowInsertedInfo = GridsTypes.RowInsertedInfo;
    export type RowInsertingInfo = GridsTypes.RowInsertingInfo;
    export type RowKeyInfo = GridsTypes.RowKeyInfo;
    export type RowRemovedInfo = GridsTypes.RowRemovedInfo;
    export type RowRemovingInfo = GridsTypes.RowRemovingInfo;
    export type RowUpdatedInfo = GridsTypes.RowUpdatedInfo;
    export type RowUpdatingInfo = GridsTypes.RowUpdatingInfo;
    export type RowValidatingInfo = GridsTypes.RowValidatingInfo;
    export type SavingInfo = GridsTypes.SavingInfo;
    export type ScrollingBase = GridsTypes.ScrollingBase;
    export type SearchPanel = GridsTypes.SearchPanel;
    export type SelectedFilterOperation = GridsTypes.SelectedFilterOperation;
    export type SelectionBase = GridsTypes.SelectionBase;
    export type SelectionChangedInfo = GridsTypes.SelectionChangedInfo;
    export type SelectionColumnDisplayMode = GridsTypes.SelectionColumnDisplayMode;
    export type Sorting = GridsTypes.Sorting;
    export type StartEditAction = GridsTypes.StartEditAction;
    export type StateStoreType = GridsTypes.StateStoreType;
    export type StateStoring = GridsTypes.StateStoring;
    export type SummaryType = GridsTypes.SummaryType;
    export type ToolbarPreparingInfo = GridsTypes.ToolbarPreparingInfo;
}
