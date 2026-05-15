import * as AiIntegrationModule from 'devextreme/common/ai-integration';
import * as ChartsModule from 'devextreme/common/charts';
import * as CoreAnimationModule from 'devextreme/common/core/animation';
import * as CoreEnvironmentModule from 'devextreme/common/core/environment';
import * as CoreEventsModule from 'devextreme/common/core/events';
import * as CoreLocalizationModule from 'devextreme/common/core/localization';
import * as DataModule from 'devextreme/common/data';
import * as ExportExcelModule from 'devextreme/common/export/excel';
import * as ExportPdfModule from 'devextreme/common/export/pdf';
import * as GridsModule from 'devextreme/common/grids';

export {
    config,
    Guid,
    setTemplateEngine,
} from 'devextreme/common';
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
    DayOfWeek,
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
    export const AIIntegration = AiIntegrationModule.AIIntegration;
    export type AIIntegration = AiIntegrationModule.AIIntegration;
    export type AIIntegrationOptions = AiIntegrationModule.AIIntegrationOptions;
    export type AIProvider = AiIntegrationModule.AIProvider;
    export type AIResponse = AiIntegrationModule.AIResponse;
    export type ExecuteGridAssistantCommandResponse = AiIntegrationModule.ExecuteGridAssistantCommandResponse;
    export type GenerateGridColumnCommandResponse = AiIntegrationModule.GenerateGridColumnCommandResponse;
    export type Prompt = AiIntegrationModule.Prompt;
    export type RequestParams = AiIntegrationModule.RequestParams;
    export type RequestParamsData = AiIntegrationModule.RequestParamsData;
    export type Response = AiIntegrationModule.Response;
}

export namespace Charts {
    export type AnimationEaseMode = ChartsModule.AnimationEaseMode;
    export type AnnotationType = ChartsModule.AnnotationType;
    export type ArgumentAxisHoverMode = ChartsModule.ArgumentAxisHoverMode;
    export type AxisScaleType = ChartsModule.AxisScaleType;
    export type ChartsAxisLabelOverlap = ChartsModule.ChartsAxisLabelOverlap;
    export type ChartsColor = ChartsModule.ChartsColor;
    export type ChartsDataType = ChartsModule.ChartsDataType;
    export type ChartsLabelOverlap = ChartsModule.ChartsLabelOverlap;
    export type DashStyle = ChartsModule.DashStyle;
    export type DiscreteAxisDivisionMode = ChartsModule.DiscreteAxisDivisionMode;
    export type Font = ChartsModule.Font;
    export type GradientColor = ChartsModule.GradientColor;
    export type HatchDirection = ChartsModule.HatchDirection;
    export type LabelOverlap = ChartsModule.LabelOverlap;
    export type LabelPosition = ChartsModule.LabelPosition;
    export type LegendHoverMode = ChartsModule.LegendHoverMode;
    export type LegendItem = ChartsModule.LegendItem;
    export type LegendMarkerState = ChartsModule.LegendMarkerState;
    export type Palette = ChartsModule.Palette;
    export type PaletteColorSet = ChartsModule.PaletteColorSet;
    export type PaletteExtensionMode = ChartsModule.PaletteExtensionMode;
    export type PointInteractionMode = ChartsModule.PointInteractionMode;
    export type PointSymbol = ChartsModule.PointSymbol;
    export const registerGradient = ChartsModule.registerGradient;
    export const registerPattern = ChartsModule.registerPattern;
    export type RelativePosition = ChartsModule.RelativePosition;
    export type ScaleBreak = ChartsModule.ScaleBreak;
    export type ScaleBreakLineStyle = ChartsModule.ScaleBreakLineStyle;
    export type SeriesHoverMode = ChartsModule.SeriesHoverMode;
    export type SeriesLabel = ChartsModule.SeriesLabel;
    export type SeriesPoint = ChartsModule.SeriesPoint;
    export type SeriesSelectionMode = ChartsModule.SeriesSelectionMode;
    export type SeriesType = ChartsModule.SeriesType;
    export type ShiftLabelOverlap = ChartsModule.ShiftLabelOverlap;
    export type TextOverflow = ChartsModule.TextOverflow;
    export type Theme = ChartsModule.Theme;
    export type TimeInterval = ChartsModule.TimeInterval;
    export type TimeIntervalConfig = ChartsModule.TimeIntervalConfig;
    export type ValueAxisVisualRangeUpdateMode = ChartsModule.ValueAxisVisualRangeUpdateMode;
    export type ValueErrorBarDisplayMode = ChartsModule.ValueErrorBarDisplayMode;
    export type ValueErrorBarType = ChartsModule.ValueErrorBarType;
    export type VisualRange = ChartsModule.VisualRange;
    export type VisualRangeUpdateMode = ChartsModule.VisualRangeUpdateMode;
    export type WordWrap = ChartsModule.WordWrap;
    export type ZoomPanAction = ChartsModule.ZoomPanAction;
}

export namespace Core {
    export namespace Animation {
        export type AnimationConfig = CoreAnimationModule.AnimationConfig;
        export const animationPresets = CoreAnimationModule.animationPresets;
        export type AnimationState = CoreAnimationModule.AnimationState;
        export const cancelAnimationFrame = CoreAnimationModule.cancelAnimationFrame;
        export type CollisionResolution = CoreAnimationModule.CollisionResolution;
        export type CollisionResolutionCombination = CoreAnimationModule.CollisionResolutionCombination;
        export const fx = CoreAnimationModule.fx;
        export type PositionConfig = CoreAnimationModule.PositionConfig;
        export const requestAnimationFrame = CoreAnimationModule.requestAnimationFrame;
        export const TransitionExecutor = CoreAnimationModule.TransitionExecutor;
        export type TransitionExecutor = CoreAnimationModule.TransitionExecutor;
    }
    export namespace Environment {
        export type Device = CoreEnvironmentModule.Device;
        export const getTimeZones = CoreEnvironmentModule.getTimeZones;
        export const hideTopOverlay = CoreEnvironmentModule.hideTopOverlay;
        export const initMobileViewport = CoreEnvironmentModule.initMobileViewport;
        export type SchedulerTimeZone = CoreEnvironmentModule.SchedulerTimeZone;
    }
    export namespace Events {
        export type AsyncCancelable = CoreEventsModule.AsyncCancelable;
        export type Cancelable = CoreEventsModule.Cancelable;
        export type ChangedOptionInfo = CoreEventsModule.ChangedOptionInfo;
        export type EventInfo<TComponent> = CoreEventsModule.EventInfo<TComponent>;
        export type EventObject = CoreEventsModule.EventObject;
        export type InitializedEventInfo<TComponent> = CoreEventsModule.InitializedEventInfo<TComponent>;
        export type ItemInfo<TItemData = any> = CoreEventsModule.ItemInfo<TItemData>;
        export type NativeEventInfo<TComponent, TNativeEvent = Event> = CoreEventsModule.NativeEventInfo<TComponent, TNativeEvent>;
        export const off = CoreEventsModule.off;
        export const on = CoreEventsModule.on;
        export const one = CoreEventsModule.one;
        export const trigger = CoreEventsModule.trigger;
    }
    export namespace Localization {
        export type Format = CoreLocalizationModule.Format;
        export const formatDate = CoreLocalizationModule.formatDate;
        export const formatMessage = CoreLocalizationModule.formatMessage;
        export const formatNumber = CoreLocalizationModule.formatNumber;
        export const loadMessages = CoreLocalizationModule.loadMessages;
        export const locale = CoreLocalizationModule.locale;
        export const parseDate = CoreLocalizationModule.parseDate;
        export const parseNumber = CoreLocalizationModule.parseNumber;
    }
}

export namespace Data {
    export const applyChanges = DataModule.applyChanges;
    export const ArrayStore = DataModule.ArrayStore;
    export type ArrayStore<TItem = any, TKey = any> = DataModule.ArrayStore<TItem, TKey>;
    export type ArrayStoreOptions<TItem = any, TKey = any> = DataModule.ArrayStoreOptions<TItem, TKey>;
    export const base64_encode = DataModule.base64_encode;
    export const compileGetter = DataModule.compileGetter;
    export const compileSetter = DataModule.compileSetter;
    export const CustomStore = DataModule.CustomStore;
    export type CustomStore<TItem = any, TKey = any> = DataModule.CustomStore<TItem, TKey>;
    export type CustomStoreOptions<TItem = any, TKey = any> = DataModule.CustomStoreOptions<TItem, TKey>;
    export const DataSource = DataModule.DataSource;
    export type DataSource<TItem = any, TKey = any> = DataModule.DataSource<TItem, TKey>;
    export type DataSourceOptions<TStoreItem = any, TMappedItem = TStoreItem, TItem = TMappedItem, TKey = any> = DataModule.DataSourceOptions<TStoreItem, TMappedItem, TItem, TKey>;
    export const EdmLiteral = DataModule.EdmLiteral;
    export type EdmLiteral = DataModule.EdmLiteral;
    export const EndpointSelector = DataModule.EndpointSelector;
    export type EndpointSelector = DataModule.EndpointSelector;
    export const errorHandler = DataModule.errorHandler;
    export type FilterDescriptor = DataModule.FilterDescriptor;
    export type GroupDescriptor<T> = DataModule.GroupDescriptor<T>;
    export type GroupingInterval = DataModule.GroupingInterval;
    export type GroupItem<TItem = any> = DataModule.GroupItem<TItem>;
    export const isGroupItemsArray = DataModule.isGroupItemsArray;
    export const isItemsArray = DataModule.isItemsArray;
    export const isLoadResultObject = DataModule.isLoadResultObject;
    export const keyConverters = DataModule.keyConverters;
    export type LangParams = DataModule.LangParams;
    export type LoadOptions<T = any> = DataModule.LoadOptions<T>;
    export type LoadResult<TItem = any> = DataModule.LoadResult<TItem>;
    export type LoadResultObject<TItem = any> = DataModule.LoadResultObject<TItem>;
    export const LocalStore = DataModule.LocalStore;
    export type LocalStore<TItem = any, TKey = any> = DataModule.LocalStore<TItem, TKey>;
    export type LocalStoreOptions<TItem = any, TKey = any> = DataModule.LocalStoreOptions<TItem, TKey>;
    export const ODataContext = DataModule.ODataContext;
    export type ODataContext = DataModule.ODataContext;
    export type ODataContextOptions = DataModule.ODataContextOptions;
    export const ODataStore = DataModule.ODataStore;
    export type ODataStore<TItem = any, TKey = any> = DataModule.ODataStore<TItem, TKey>;
    export type ODataStoreOptions<TItem = any, TKey = any> = DataModule.ODataStoreOptions<TItem, TKey>;
    export const query = DataModule.query;
    export type Query = DataModule.Query;
    export type ResolvedData<TItem = any> = DataModule.ResolvedData<TItem>;
    export type SearchOperation = DataModule.SearchOperation;
    export type SelectDescriptor<T> = DataModule.SelectDescriptor<T>;
    export const setErrorHandler = DataModule.setErrorHandler;
    export type SortDescriptor<T> = DataModule.SortDescriptor<T>;
    export type Store<TItem = any, TKey = any> = DataModule.Store<TItem, TKey>;
    export type StoreOptions<TItem = any, TKey = any> = DataModule.StoreOptions<TItem, TKey>;
    export type SummaryDescriptor<T> = DataModule.SummaryDescriptor<T>;
}

export namespace Export {
    export namespace Excel {
        export type CellAddress = ExportExcelModule.CellAddress;
        export type CellRange = ExportExcelModule.CellRange;
        export type DataGridCell = ExportExcelModule.DataGridCell;
        export type DataGridExportOptions = ExportExcelModule.DataGridExportOptions;
        export const exportDataGrid = ExportExcelModule.exportDataGrid;
        export const exportPivotGrid = ExportExcelModule.exportPivotGrid;
        export type PivotGridCell = ExportExcelModule.PivotGridCell;
        export type PivotGridExportOptions = ExportExcelModule.PivotGridExportOptions;
    }
    export namespace Pdf {
        export type Cell = ExportPdfModule.Cell;
        export type DataGridCell = ExportPdfModule.DataGridCell;
        export type DataGridExportOptions = ExportPdfModule.DataGridExportOptions;
        export const exportDataGrid = ExportPdfModule.exportDataGrid;
        export const exportGantt = ExportPdfModule.exportGantt;
        export type GanttExportFont = ExportPdfModule.GanttExportFont;
        export type GanttExportOptions = ExportPdfModule.GanttExportOptions;
    }
}

export function Grids(): void {}
export namespace Grids {
    export type AdaptiveDetailRowPreparingInfo = GridsModule.AdaptiveDetailRowPreparingInfo;
    export type AIAssistant<TCommands extends PredefinedCommands = PredefinedCommands> = GridsModule.AIAssistant<TCommands>;
    export type AIAssistantRequestCreatingInfo = GridsModule.AIAssistantRequestCreatingInfo;
    export type AIColumnMode = GridsModule.AIColumnMode;
    export type AIColumnRequestCreatingInfo<TRowData = any> = GridsModule.AIColumnRequestCreatingInfo<TRowData>;
    export type ApplyChangesMode = GridsModule.ApplyChangesMode;
    export type ApplyFilterMode = GridsModule.ApplyFilterMode;
    export type BasicFilterExprObj = GridsModule.BasicFilterExprObj;
    export type ColumnAIOptions = GridsModule.ColumnAIOptions;
    export type ColumnBase<TRowData = any> = GridsModule.ColumnBase<TRowData>;
    export type ColumnButtonBase = GridsModule.ColumnButtonBase;
    export type ColumnChooser = GridsModule.ColumnChooser;
    export type ColumnChooserMode = GridsModule.ColumnChooserMode;
    export type ColumnChooserSearchConfig = GridsModule.ColumnChooserSearchConfig;
    export type ColumnChooserSelectionConfig = GridsModule.ColumnChooserSelectionConfig;
    export type ColumnCustomizeTextArg = GridsModule.ColumnCustomizeTextArg;
    export type ColumnFixing = GridsModule.ColumnFixing;
    export type ColumnFixingIcons = GridsModule.ColumnFixingIcons;
    export type ColumnFixingTexts = GridsModule.ColumnFixingTexts;
    export type ColumnHeaderFilter = GridsModule.ColumnHeaderFilter;
    export type ColumnHeaderFilterSearchConfig = GridsModule.ColumnHeaderFilterSearchConfig;
    export type ColumnLookup = GridsModule.ColumnLookup;
    export type ColumnResizeMode = GridsModule.ColumnResizeMode;
    export type CombinedFilterExprObj = GridsModule.CombinedFilterExprObj;
    export type CommandInfo<TCommands extends PredefinedCommands = PredefinedCommands> = GridsModule.CommandInfo<TCommands>;
    export type CompositeKeyPair = GridsModule.CompositeKeyPair;
    export type DataChange<TRowData = any, TKey = any> = GridsModule.DataChange<TRowData, TKey>;
    export type DataChangeInfo<TRowData = any, TKey = any> = GridsModule.DataChangeInfo<TRowData, TKey>;
    export type DataChangeType = GridsModule.DataChangeType;
    export type DataErrorOccurredInfo = GridsModule.DataErrorOccurredInfo;
    export type DataRenderMode = GridsModule.DataRenderMode;
    export type EditingBase<TRowData = any, TKey = any> = GridsModule.EditingBase<TRowData, TKey>;
    export type EditingTextsBase = GridsModule.EditingTextsBase;
    export type EnterKeyAction = GridsModule.EnterKeyAction;
    export type EnterKeyDirection = GridsModule.EnterKeyDirection;
    export type FilterExprObj = GridsModule.FilterExprObj;
    export type FilterOperation = GridsModule.FilterOperation;
    export type FilterPanel<TComponent = any, TRowData = any, TKey = any> = GridsModule.FilterPanel<TComponent, TRowData, TKey>;
    export type FilterPanelTexts = GridsModule.FilterPanelTexts;
    export type FilterRow = GridsModule.FilterRow;
    export type FilterRowOperationDescriptions = GridsModule.FilterRowOperationDescriptions;
    export type FilterType = GridsModule.FilterType;
    export type FixedPosition = GridsModule.FixedPosition;
    export type GridBase<TRowData = any, TKey = any> = GridsModule.GridBase<TRowData, TKey>;
    export type GridBaseOptions<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> = GridsModule.GridBaseOptions<TComponent, TRowData, TKey>;
    export type GridsContextMenuTarget = GridsModule.GridsContextMenuTarget;
    export type GridsEditMode = GridsModule.GridsEditMode;
    export type GridsEditRefreshMode = GridsModule.GridsEditRefreshMode;
    export type GroupExpandMode = GridsModule.GroupExpandMode;
    export type HeaderFilter = GridsModule.HeaderFilter;
    export type HeaderFilterGroupInterval = GridsModule.HeaderFilterGroupInterval;
    export type HeaderFilterSearchConfig = GridsModule.HeaderFilterSearchConfig;
    export type HeaderFilterTexts = GridsModule.HeaderFilterTexts;
    export type KeyboardNavigation = GridsModule.KeyboardNavigation;
    export type KeyDownInfo = GridsModule.KeyDownInfo;
    export type LoadPanel = GridsModule.LoadPanel;
    export type NegatedFilterExprObj = GridsModule.NegatedFilterExprObj;
    export type NewRowInfo<TRowData = any> = GridsModule.NewRowInfo<TRowData>;
    export type NewRowPosition = GridsModule.NewRowPosition;
    export type Pager = GridsModule.Pager;
    export type PagerPageSize = GridsModule.PagerPageSize;
    export type PagingBase = GridsModule.PagingBase;
    export type PredefinedCommandNames = GridsModule.PredefinedCommandNames;
    export type PredefinedCommands = GridsModule.PredefinedCommands;
    export type ResponseStatus = GridsModule.ResponseStatus;
    export type ResponseStatusTexts = GridsModule.ResponseStatusTexts;
    export type RowDragging<TComponent extends GridBase<TRowData, TKey>, TRowData = any, TKey = any> = GridsModule.RowDragging<TComponent, TRowData, TKey>;
    export type RowDraggingTemplateData<TRowData = any> = GridsModule.RowDraggingTemplateData<TRowData>;
    export type RowInsertedInfo<TRowData = any, TKey = any> = GridsModule.RowInsertedInfo<TRowData, TKey>;
    export type RowInsertingInfo<TRowData = any> = GridsModule.RowInsertingInfo<TRowData>;
    export type RowKeyInfo<TKey = any> = GridsModule.RowKeyInfo<TKey>;
    export type RowRemovedInfo<TRowData = any, TKey = any> = GridsModule.RowRemovedInfo<TRowData, TKey>;
    export type RowRemovingInfo<TRowData = any, TKey = any> = GridsModule.RowRemovingInfo<TRowData, TKey>;
    export type RowUpdatedInfo<TRowData = any, TKey = any> = GridsModule.RowUpdatedInfo<TRowData, TKey>;
    export type RowUpdatingInfo<TRowData = any, TKey = any> = GridsModule.RowUpdatingInfo<TRowData, TKey>;
    export type RowValidatingInfo<TRowData = any, TKey = any> = GridsModule.RowValidatingInfo<TRowData, TKey>;
    export type SavingInfo<TRowData = any, TKey = any> = GridsModule.SavingInfo<TRowData, TKey>;
    export type ScrollingBase = GridsModule.ScrollingBase;
    export type SearchPanel = GridsModule.SearchPanel;
    export type SelectedFilterOperation = GridsModule.SelectedFilterOperation;
    export type SelectionBase = GridsModule.SelectionBase;
    export type SelectionChangedInfo<TRowData = any, TKey = any> = GridsModule.SelectionChangedInfo<TRowData, TKey>;
    export type SelectionColumnDisplayMode = GridsModule.SelectionColumnDisplayMode;
    export type Sorting = GridsModule.Sorting;
    export type StartEditAction = GridsModule.StartEditAction;
    export type StateStoreType = GridsModule.StateStoreType;
    export type StateStoring = GridsModule.StateStoring;
    export type SummaryType = GridsModule.SummaryType;
    export type ToolbarPreparingInfo = GridsModule.ToolbarPreparingInfo;
}

