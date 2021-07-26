import dxAccordion, { Properties as AccordionProperties } from '../ui/accordion';
import dxActionSheet, { Properties as ActionSheetProperties } from '../ui/action_sheet';
import dxAutocomplete, { Properties as AutocompleteProperties } from '../ui/autocomplete';
import dxBox, { Properties as BoxProperties } from '../ui/box';
import dxButton, { Properties as ButtonProperties } from '../ui/button';
import dxButtonGroup, { Properties as ButtonGroupProperties } from '../ui/button_group';
import dxCalendar, { Properties as CalendarProperties } from '../ui/calendar';
import dxCheckBox, { Properties as CheckBoxProperties } from '../ui/check_box';
import dxColorBox, { Properties as ColorBoxProperties } from '../ui/color_box';
import dxContextMenu, { Properties as ContextMenuProperties } from '../ui/context_menu';
import dxDataGrid, { Properties as DataGridProperties } from '../ui/data_grid';
import dxDateBox, { Properties as DateBoxProperties } from '../ui/date_box';
import dxDeferRendering, { Properties as DeferRenderingProperties } from '../ui/defer_rendering';
import dxDiagram, { Properties as DiagramProperties } from '../ui/diagram';
import dxDraggable, { Properties as DraggableProperties } from '../ui/draggable';
import dxDrawer, { Properties as DrawerProperties } from '../ui/drawer';
import dxDropDownBox, { Properties as DropDownBoxProperties } from '../ui/drop_down_box';
import dxDropDownButton, { Properties as DropDownButtonProperties } from '../ui/drop_down_button';
import dxFileManager, { Properties as FileManagerProperties } from '../ui/file_manager';
import dxFileUploader, { Properties as FileUploaderProperties } from '../ui/file_uploader';
import dxFilterBuilder, { Properties as FilterBuilderProperties } from '../ui/filter_builder';
import dxForm, { Properties as FormProperties } from '../ui/form';
import dxGallery, { Properties as GalleryProperties } from '../ui/gallery';
import dxGantt, { Properties as GanttProperties } from '../ui/gantt';
import dxHtmlEditor, { Properties as HtmlEditorProperties } from '../ui/html_editor';
import dxList, { Properties as ListProperties } from '../ui/list';
import dxLoadIndicator, { Properties as LoadIndicatorProperties } from '../ui/load_indicator';
import dxLoadPanel, { Properties as LoadPanelProperties } from '../ui/load_panel';
import dxLookup, { Properties as LookupProperties } from '../ui/lookup';
import dxMap, { Properties as MapProperties } from '../ui/map';
import dxMenu, { Properties as MenuProperties } from '../ui/menu';
import dxMultiView, { Properties as MultiViewProperties } from '../ui/multi_view';
import dxNavBar, { Properties as NavBarProperties } from '../ui/nav_bar';
import dxNumberBox, { Properties as NumberBoxProperties } from '../ui/number_box';
import dxPivotGrid, { Properties as PivotGridProperties } from '../ui/pivot_grid';
import dxPivotGridFieldChooser, { Properties as PivotGridFieldChooserProperties } from '../ui/pivot_grid_field_chooser';
import dxPopover, { Properties as PopoverProperties } from '../ui/popover';
import dxPopup, { Properties as PopupProperties } from '../ui/popup';
import dxProgressBar, { Properties as ProgressBarProperties } from '../ui/progress_bar';
import dxRadioGroup, { Properties as RadioGroupProperties } from '../ui/radio_group';
import dxRangeSlider, { Properties as RangeSliderProperties } from '../ui/range_slider';
import dxRecurrenceEditor, { Properties as RecurrenceEditorProperties } from '../ui/recurrence_editor';
import dxResizable, { Properties as ResizableProperties } from '../ui/resizable';
import dxResponsiveBox, { Properties as ResponsiveBoxProperties } from '../ui/responsive_box';
import dxScheduler, { Properties as SchedulerProperties } from '../ui/scheduler';
import dxScrollView, { Properties as ScrollViewProperties } from '../ui/scroll_view';
import dxSelectBox, { Properties as SelectBoxProperties } from '../ui/select_box';
import dxSlider, { Properties as SliderProperties } from '../ui/slider';
import dxSlideOut, { Properties as SlideOutProperties } from '../ui/slide_out';
import dxSlideOutView, { Properties as SlideOutViewProperties } from '../ui/slide_out_view';
import dxSortable, { Properties as SortableProperties } from '../ui/sortable';
import dxSpeedDialAction, { Properties as SpeedDialActionProperties } from '../ui/speed_dial_action';
import dxSwitch, { Properties as SwitchProperties } from '../ui/switch';
import dxTabs, { Properties as TabsProperties } from '../ui/tabs';
import dxTabPanel, { Properties as TabPanelProperties } from '../ui/tab_panel';
import dxTagBox, { Properties as TagBoxProperties } from '../ui/tag_box';
import dxTextArea, { Properties as TextAreaProperties } from '../ui/text_area';
import dxTextBox, { Properties as TextBoxProperties } from '../ui/text_box';
import dxTileView, { Properties as TileViewProperties } from '../ui/tile_view';
import dxToast, { Properties as ToastProperties } from '../ui/toast';
import dxToolbar, { Properties as ToolbarProperties } from '../ui/toolbar';
import dxTooltip, { Properties as TooltipProperties } from '../ui/tooltip';
import dxTreeList, { Properties as TreeListProperties } from '../ui/tree_list';
import dxTreeView, { Properties as TreeViewProperties } from '../ui/tree_view';
import dxValidationGroup, { Properties as ValidationGroupProperties } from '../ui/validation_group';
import dxValidationMessage, { Properties as ValidationMessageProperties } from '../ui/validation_message';
import dxValidationSummary, { Properties as ValidationSummaryProperties } from '../ui/validation_summary';
import dxValidator, { Properties as ValidatorProperties } from '../ui/validator';
import dxBarGauge, { Properties as BarGaugeProperties } from '../viz/bar_gauge';
import dxBullet, { Properties as BulletProperties } from '../viz/bullet';
import dxChart, { Properties as ChartProperties } from '../viz/chart';
import dxCircularGauge, { Properties as CircularGaugeProperties } from '../viz/circular_gauge';
import dxFunnel, { Properties as FunnelProperties } from '../viz/funnel';
import dxLinearGauge, { Properties as LinearGaugeProperties } from '../viz/linear_gauge';
import dxPieChart, { Properties as PieChartProperties } from '../viz/pie_chart';
import dxPolarChart, { Properties as PolarChartProperties } from '../viz/polar_chart';
import dxRangeSelector, { Properties as RangeSelectorProperties } from '../viz/range_selector';
import dxSankey, { Properties as SankeyProperties } from '../viz/sankey';
import dxSparkline, { Properties as SparklineProperties } from '../viz/sparkline';
import dxTreeMap, { Properties as TreeMapProperties } from '../viz/tree_map';
import dxVectorMap, { Properties as VectorMapProperties } from '../viz/vector_map';

declare module '../core/element' {
    interface Condition extends JQueryEventObject { }
    interface ElementWrapper<T extends Element> extends JQuery<T> { }
    interface ElementsArrayWrapper<T extends Element> extends JQuery<T> { }
    interface InternalElementWrapper<T extends Element> extends JQuery<T> { }
}

declare module '../core/utils/deferred' {
    interface PromiseType<T> extends JQueryPromise<T> { }
}

declare module '../events/index' {
    interface EventType extends JQueryEventObject {
        cancel?: boolean;
    }
    interface EventExtension {
        jQueryEvent?: JQueryEventObject;
    }
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
    interface JQueryPromise<T> { }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
    interface JQueryEventObject { }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
    interface JQuery<TElement = HTMLElement> { }
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface JQuery<TElement = HTMLElement> {

        dxAccordion(): JQuery;
        dxAccordion(options: 'instance'): dxAccordion;
        dxAccordion(options: AccordionProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxAccordion(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxAccordion(options: string, ...params: any[]): any;

        dxActionSheet(): JQuery;
        dxActionSheet(options: 'instance'): dxActionSheet;
        dxActionSheet(options: ActionSheetProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxActionSheet(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxActionSheet(options: string, ...params: any[]): any;

        dxAutocomplete(): JQuery;
        dxAutocomplete(options: 'instance'): dxAutocomplete;
        dxAutocomplete(options: AutocompleteProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxAutocomplete(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxAutocomplete(options: string, ...params: any[]): any;

        dxBarGauge(): JQuery;
        dxBarGauge(options: 'instance'): dxBarGauge;
        dxBarGauge(options: BarGaugeProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxBarGauge(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxBarGauge(options: string, ...params: any[]): any;

        dxBox(): JQuery;
        dxBox(options: 'instance'): dxBox;
        dxBox(options: BoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxBox(options: string, ...params: any[]): any;

        dxBullet(): JQuery;
        dxBullet(options: 'instance'): dxBullet;
        dxBullet(options: BulletProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxBullet(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxBullet(options: string, ...params: any[]): any;

        dxButton(): JQuery;
        dxButton(options: 'instance'): dxButton;
        dxButton(options: ButtonProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxButton(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxButton(options: string, ...params: any[]): any;

        dxButtonGroup(): JQuery;
        dxButtonGroup(options: 'instance'): dxButtonGroup;
        dxButtonGroup(options: ButtonGroupProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxButtonGroup(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxButtonGroup(options: string, ...params: any[]): any;

        dxCalendar(): JQuery;
        dxCalendar(options: 'instance'): dxCalendar;
        dxCalendar(options: CalendarProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxCalendar(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxCalendar(options: string, ...params: any[]): any;

        dxChart(): JQuery;
        dxChart(options: 'instance'): dxChart;
        dxChart(options: ChartProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxChart(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxChart(options: string, ...params: any[]): any;

        dxCheckBox(): JQuery;
        dxCheckBox(options: 'instance'): dxCheckBox;
        dxCheckBox(options: CheckBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxCheckBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxCheckBox(options: string, ...params: any[]): any;

        dxCircularGauge(): JQuery;
        dxCircularGauge(options: 'instance'): dxCircularGauge;
        dxCircularGauge(options: CircularGaugeProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxCircularGauge(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxCircularGauge(options: string, ...params: any[]): any;

        dxColorBox(): JQuery;
        dxColorBox(options: 'instance'): dxColorBox;
        dxColorBox(options: ColorBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxColorBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxColorBox(options: string, ...params: any[]): any;

        dxContextMenu(): JQuery;
        dxContextMenu(options: 'instance'): dxContextMenu;
        dxContextMenu(options: ContextMenuProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxContextMenu(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxContextMenu(options: string, ...params: any[]): any;

        dxDataGrid(): JQuery;
        dxDataGrid(options: 'instance'): dxDataGrid;
        dxDataGrid(options: DataGridProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDataGrid(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDataGrid(options: string, ...params: any[]): any;

        dxDateBox(): JQuery;
        dxDateBox(options: 'instance'): dxDateBox;
        dxDateBox(options: DateBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDateBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDateBox(options: string, ...params: any[]): any;

        dxDeferRendering(): JQuery;
        dxDeferRendering(options: 'instance'): dxDeferRendering;
        dxDeferRendering(options: DeferRenderingProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDeferRendering(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDeferRendering(options: string, ...params: any[]): any;

        dxDiagram(): JQuery;
        dxDiagram(options: 'instance'): dxDiagram;
        dxDiagram(options: DiagramProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDiagram(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDiagram(options: string, ...params: any[]): any;

        dxDraggable(): JQuery;
        dxDraggable(options: 'instance'): dxDraggable;
        dxDraggable(options: DraggableProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDraggable(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDraggable(options: string, ...params: any[]): any;

        dxDrawer(): JQuery;
        dxDrawer(options: 'instance'): dxDrawer;
        dxDrawer(options: DrawerProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDrawer(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDrawer(options: string, ...params: any[]): any;

        dxDropDownBox(): JQuery;
        dxDropDownBox(options: 'instance'): dxDropDownBox;
        dxDropDownBox(options: DropDownBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDropDownBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDropDownBox(options: string, ...params: any[]): any;

        dxDropDownButton(): JQuery;
        dxDropDownButton(options: 'instance'): dxDropDownButton;
        dxDropDownButton(options: DropDownButtonProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDropDownButton(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxDropDownButton(options: string, ...params: any[]): any;

        dxFileManager(): JQuery;
        dxFileManager(options: 'instance'): dxFileManager;
        dxFileManager(options: FileManagerProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFileManager(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFileManager(options: string, ...params: any[]): any;

        dxFileUploader(): JQuery;
        dxFileUploader(options: 'instance'): dxFileUploader;
        dxFileUploader(options: FileUploaderProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFileUploader(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFileUploader(options: string, ...params: any[]): any;

        dxFilterBuilder(): JQuery;
        dxFilterBuilder(options: 'instance'): dxFilterBuilder;
        dxFilterBuilder(options: FilterBuilderProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFilterBuilder(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFilterBuilder(options: string, ...params: any[]): any;

        dxForm(): JQuery;
        dxForm(options: 'instance'): dxForm;
        dxForm(options: FormProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxForm(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxForm(options: string, ...params: any[]): any;

        dxFunnel(): JQuery;
        dxFunnel(options: 'instance'): dxFunnel;
        dxFunnel(options: FunnelProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFunnel(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxFunnel(options: string, ...params: any[]): any;

        dxGallery(): JQuery;
        dxGallery(options: 'instance'): dxGallery;
        dxGallery(options: GalleryProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxGallery(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxGallery(options: string, ...params: any[]): any;

        dxGantt(): JQuery;
        dxGantt(options: 'instance'): dxGantt;
        dxGantt(options: GanttProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxGantt(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxGantt(options: string, ...params: any[]): any;

        dxHtmlEditor(): JQuery;
        dxHtmlEditor(options: 'instance'): dxHtmlEditor;
        dxHtmlEditor(options: HtmlEditorProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxHtmlEditor(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxHtmlEditor(options: string, ...params: any[]): any;

        dxLinearGauge(): JQuery;
        dxLinearGauge(options: 'instance'): dxLinearGauge;
        dxLinearGauge(options: LinearGaugeProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLinearGauge(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLinearGauge(options: string, ...params: any[]): any;

        dxList(): JQuery;
        dxList(options: 'instance'): dxList;
        dxList(options: ListProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxList(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxList(options: string, ...params: any[]): any;

        dxLoadIndicator(): JQuery;
        dxLoadIndicator(options: 'instance'): dxLoadIndicator;
        dxLoadIndicator(options: LoadIndicatorProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLoadIndicator(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLoadIndicator(options: string, ...params: any[]): any;

        dxLoadPanel(): JQuery;
        dxLoadPanel(options: 'instance'): dxLoadPanel;
        dxLoadPanel(options: LoadPanelProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLoadPanel(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLoadPanel(options: string, ...params: any[]): any;

        dxLookup(): JQuery;
        dxLookup(options: 'instance'): dxLookup;
        dxLookup(options: LookupProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLookup(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxLookup(options: string, ...params: any[]): any;

        dxMap(): JQuery;
        dxMap(options: 'instance'): dxMap;
        dxMap(options: MapProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxMap(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxMap(options: string, ...params: any[]): any;

        dxMenu(): JQuery;
        dxMenu(options: 'instance'): dxMenu;
        dxMenu(options: MenuProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxMenu(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxMenu(options: string, ...params: any[]): any;

        dxMultiView(): JQuery;
        dxMultiView(options: 'instance'): dxMultiView;
        dxMultiView(options: MultiViewProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxMultiView(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxMultiView(options: string, ...params: any[]): any;

        dxNavBar(): JQuery;
        dxNavBar(options: 'instance'): dxNavBar;
        dxNavBar(options: NavBarProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxNavBar(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxNavBar(options: string, ...params: any[]): any;

        dxNumberBox(): JQuery;
        dxNumberBox(options: 'instance'): dxNumberBox;
        dxNumberBox(options: NumberBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxNumberBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxNumberBox(options: string, ...params: any[]): any;

        dxPieChart(): JQuery;
        dxPieChart(options: 'instance'): dxPieChart;
        dxPieChart(options: PieChartProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPieChart(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPieChart(options: string, ...params: any[]): any;

        dxPivotGrid(): JQuery;
        dxPivotGrid(options: 'instance'): dxPivotGrid;
        dxPivotGrid(options: PivotGridProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPivotGrid(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPivotGrid(options: string, ...params: any[]): any;

        dxPivotGridFieldChooser(): JQuery;
        dxPivotGridFieldChooser(options: 'instance'): dxPivotGridFieldChooser;
        dxPivotGridFieldChooser(options: PivotGridFieldChooserProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPivotGridFieldChooser(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPivotGridFieldChooser(options: string, ...params: any[]): any;

        dxPolarChart(): JQuery;
        dxPolarChart(options: 'instance'): dxPolarChart;
        dxPolarChart(options: PolarChartProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPolarChart(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPolarChart(options: string, ...params: any[]): any;

        dxPopover(): JQuery;
        dxPopover(options: 'instance'): dxPopover;
        dxPopover(options: PopoverProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPopover(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPopover(options: string, ...params: any[]): any;

        dxPopup(): JQuery;
        dxPopup(options: 'instance'): dxPopup;
        dxPopup(options: PopupProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPopup(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxPopup(options: string, ...params: any[]): any;

        dxProgressBar(): JQuery;
        dxProgressBar(options: 'instance'): dxProgressBar;
        dxProgressBar(options: ProgressBarProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxProgressBar(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxProgressBar(options: string, ...params: any[]): any;

        dxRadioGroup(): JQuery;
        dxRadioGroup(options: 'instance'): dxRadioGroup;
        dxRadioGroup(options: RadioGroupProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRadioGroup(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRadioGroup(options: string, ...params: any[]): any;

        dxRangeSelector(): JQuery;
        dxRangeSelector(options: 'instance'): dxRangeSelector;
        dxRangeSelector(options: RangeSelectorProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRangeSelector(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRangeSelector(options: string, ...params: any[]): any;

        dxRangeSlider(): JQuery;
        dxRangeSlider(options: 'instance'): dxRangeSlider;
        dxRangeSlider(options: RangeSliderProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRangeSlider(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRangeSlider(options: string, ...params: any[]): any;

        dxRecurrenceEditor(): JQuery;
        dxRecurrenceEditor(options: 'instance'): dxRecurrenceEditor;
        dxRecurrenceEditor(options: RecurrenceEditorProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRecurrenceEditor(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxRecurrenceEditor(options: string, ...params: any[]): any;

        dxResizable(): JQuery;
        dxResizable(options: 'instance'): dxResizable;
        dxResizable(options: ResizableProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxResizable(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxResizable(options: string, ...params: any[]): any;

        dxResponsiveBox(): JQuery;
        dxResponsiveBox(options: 'instance'): dxResponsiveBox;
        dxResponsiveBox(options: ResponsiveBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxResponsiveBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxResponsiveBox(options: string, ...params: any[]): any;

        dxSankey(): JQuery;
        dxSankey(options: 'instance'): dxSankey;
        dxSankey(options: SankeyProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSankey(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSankey(options: string, ...params: any[]): any;

        dxScheduler(): JQuery;
        dxScheduler(options: 'instance'): dxScheduler;
        dxScheduler(options: SchedulerProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxScheduler(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxScheduler(options: string, ...params: any[]): any;

        dxScrollView(): JQuery;
        dxScrollView(options: 'instance'): dxScrollView;
        dxScrollView(options: ScrollViewProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxScrollView(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxScrollView(options: string, ...params: any[]): any;

        dxSelectBox(): JQuery;
        dxSelectBox(options: 'instance'): dxSelectBox;
        dxSelectBox(options: SelectBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSelectBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSelectBox(options: string, ...params: any[]): any;

        dxSlideOut(): JQuery;
        dxSlideOut(options: 'instance'): dxSlideOut;
        dxSlideOut(options: SlideOutProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSlideOut(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSlideOut(options: string, ...params: any[]): any;

        dxSlideOutView(): JQuery;
        dxSlideOutView(options: 'instance'): dxSlideOutView;
        dxSlideOutView(options: SlideOutViewProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSlideOutView(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSlideOutView(options: string, ...params: any[]): any;

        dxSlider(): JQuery;
        dxSlider(options: 'instance'): dxSlider;
        dxSlider(options: SliderProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSlider(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSlider(options: string, ...params: any[]): any;

        dxSortable(): JQuery;
        dxSortable(options: 'instance'): dxSortable;
        dxSortable(options: SortableProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSortable(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSortable(options: string, ...params: any[]): any;

        dxSparkline(): JQuery;
        dxSparkline(options: 'instance'): dxSparkline;
        dxSparkline(options: SparklineProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSparkline(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSparkline(options: string, ...params: any[]): any;

        dxSpeedDialAction(): JQuery;
        dxSpeedDialAction(options: 'instance'): dxSpeedDialAction;
        dxSpeedDialAction(options: SpeedDialActionProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSpeedDialAction(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSpeedDialAction(options: string, ...params: any[]): any;

        dxSwitch(): JQuery;
        dxSwitch(options: 'instance'): dxSwitch;
        dxSwitch(options: SwitchProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSwitch(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxSwitch(options: string, ...params: any[]): any;

        dxTabPanel(): JQuery;
        dxTabPanel(options: 'instance'): dxTabPanel;
        dxTabPanel(options: TabPanelProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTabPanel(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTabPanel(options: string, ...params: any[]): any;

        dxTabs(): JQuery;
        dxTabs(options: 'instance'): dxTabs;
        dxTabs(options: TabsProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTabs(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTabs(options: string, ...params: any[]): any;

        dxTagBox(): JQuery;
        dxTagBox(options: 'instance'): dxTagBox;
        dxTagBox(options: TagBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTagBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTagBox(options: string, ...params: any[]): any;

        dxTextArea(): JQuery;
        dxTextArea(options: 'instance'): dxTextArea;
        dxTextArea(options: TextAreaProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTextArea(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTextArea(options: string, ...params: any[]): any;

        dxTextBox(): JQuery;
        dxTextBox(options: 'instance'): dxTextBox;
        dxTextBox(options: TextBoxProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTextBox(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTextBox(options: string, ...params: any[]): any;

        dxTileView(): JQuery;
        dxTileView(options: 'instance'): dxTileView;
        dxTileView(options: TileViewProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTileView(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTileView(options: string, ...params: any[]): any;

        dxToast(): JQuery;
        dxToast(options: 'instance'): dxToast;
        dxToast(options: ToastProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxToast(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxToast(options: string, ...params: any[]): any;

        dxToolbar(): JQuery;
        dxToolbar(options: 'instance'): dxToolbar;
        dxToolbar(options: ToolbarProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxToolbar(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxToolbar(options: string, ...params: any[]): any;

        dxTooltip(): JQuery;
        dxTooltip(options: 'instance'): dxTooltip;
        dxTooltip(options: TooltipProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTooltip(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTooltip(options: string, ...params: any[]): any;

        dxTreeList(): JQuery;
        dxTreeList(options: 'instance'): dxTreeList;
        dxTreeList(options: TreeListProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTreeList(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTreeList(options: string, ...params: any[]): any;

        dxTreeMap(): JQuery;
        dxTreeMap(options: 'instance'): dxTreeMap;
        dxTreeMap(options: TreeMapProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTreeMap(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTreeMap(options: string, ...params: any[]): any;

        dxTreeView(): JQuery;
        dxTreeView(options: 'instance'): dxTreeView;
        dxTreeView(options: TreeViewProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTreeView(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxTreeView(options: string, ...params: any[]): any;

        dxValidationGroup(): JQuery;
        dxValidationGroup(options: 'instance'): dxValidationGroup;
        dxValidationGroup(options: ValidationGroupProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidationGroup(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidationGroup(options: string, ...params: any[]): any;

        dxValidationMessage(): JQuery;
        dxValidationMessage(options: 'instance'): dxValidationMessage;
        dxValidationMessage(options: ValidationMessageProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidationMessage(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidationMessage(options: string, ...params: any[]): any;

        dxValidationSummary(): JQuery;
        dxValidationSummary(options: 'instance'): dxValidationSummary;
        dxValidationSummary(options: ValidationSummaryProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidationSummary(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidationSummary(options: string, ...params: any[]): any;

        dxValidator(): JQuery;
        dxValidator(options: 'instance'): dxValidator;
        dxValidator(options: ValidatorProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidator(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxValidator(options: string, ...params: any[]): any;

        dxVectorMap(): JQuery;
        dxVectorMap(options: 'instance'): dxVectorMap;
        dxVectorMap(options: VectorMapProperties): JQuery;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxVectorMap(options: string): any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dxVectorMap(options: string, ...params: any[]): any;
    }
}

// eslint-disable-next-line no-empty-pattern
export const { };
