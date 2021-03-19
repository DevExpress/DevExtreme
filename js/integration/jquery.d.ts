import dxAccordion, { dxAccordionOptions } from '../ui/accordion';
import dxActionSheet, { dxActionSheetOptions } from '../ui/action_sheet';
import dxAutocomplete, { dxAutocompleteOptions } from '../ui/autocomplete';
import dxBox, { dxBoxOptions } from '../ui/box';
import dxButton, { dxButtonOptions } from '../ui/button';
import dxButtonGroup, { dxButtonGroupOptions } from '../ui/button_group';
import dxCalendar, { dxCalendarOptions } from '../ui/calendar';
import dxCheckBox, { dxCheckBoxOptions } from '../ui/check_box';
import dxColorBox, { dxColorBoxOptions } from '../ui/color_box';
import dxContextMenu, { dxContextMenuOptions } from '../ui/context_menu';
import dxDataGrid, { dxDataGridOptions } from '../ui/data_grid';
import dxDateBox, { dxDateBoxOptions } from '../ui/date_box';
import dxDeferRendering, { dxDeferRenderingOptions } from '../ui/defer_rendering';
import dxDiagram, { dxDiagramOptions } from '../ui/diagram';
import dxDraggable, { dxDraggableOptions } from '../ui/draggable';
import dxDrawer, { dxDrawerOptions } from '../ui/drawer';
import dxDropDownBox, { dxDropDownBoxOptions } from '../ui/drop_down_box';
import dxDropDownButton, { dxDropDownButtonOptions } from '../ui/drop_down_button';
import dxFileManager, { dxFileManagerOptions } from '../ui/file_manager';
import dxFileUploader, { dxFileUploaderOptions } from '../ui/file_uploader';
import dxFilterBuilder, { dxFilterBuilderOptions } from '../ui/filter_builder';
import dxForm, { dxFormOptions } from '../ui/form';
import dxGallery, { dxGalleryOptions } from '../ui/gallery';
import dxGantt, { dxGanttOptions } from '../ui/gantt';
import dxHtmlEditor, { dxHtmlEditorOptions } from '../ui/html_editor';
import dxList, { dxListOptions } from '../ui/list';
import dxLoadIndicator, { dxLoadIndicatorOptions } from '../ui/load_indicator';
import dxLoadPanel, { dxLoadPanelOptions } from '../ui/load_panel';
import dxLookup, { dxLookupOptions } from '../ui/lookup';
import dxMap, { dxMapOptions } from '../ui/map';
import dxMenu, { dxMenuOptions } from '../ui/menu';
import dxMultiView, { dxMultiViewOptions } from '../ui/multi_view';
import dxNavBar, { dxNavBarOptions } from '../ui/nav_bar';
import dxNumberBox, { dxNumberBoxOptions } from '../ui/number_box';
import dxPivotGrid, { dxPivotGridOptions } from '../ui/pivot_grid';
import dxPivotGridFieldChooser, { dxPivotGridFieldChooserOptions } from '../ui/pivot_grid_field_chooser';
import dxPopover, { dxPopoverOptions } from '../ui/popover';
import dxPopup, { dxPopupOptions } from '../ui/popup';
import dxProgressBar, { dxProgressBarOptions } from '../ui/progress_bar';
import dxRadioGroup, { dxRadioGroupOptions } from '../ui/radio_group';
import dxRangeSlider, { dxRangeSliderOptions } from '../ui/range_slider';
import dxRecurrenceEditor, { dxRecurrenceEditorOptions } from '../ui/recurrence_editor';
import dxResizable, { dxResizableOptions } from '../ui/resizable';
import dxResponsiveBox, { dxResponsiveBoxOptions } from '../ui/responsive_box';
import dxScheduler, { dxSchedulerOptions } from '../ui/scheduler';
import dxScrollView, { dxScrollViewOptions } from '../ui/scroll_view';
import dxSelectBox, { dxSelectBoxOptions } from '../ui/select_box';
import dxSlider, { dxSliderOptions } from '../ui/slider';
import dxSlideOut, { dxSlideOutOptions } from '../ui/slide_out';
import dxSlideOutView, { dxSlideOutViewOptions } from '../ui/slide_out_view';
import dxSortable, { dxSortableOptions } from '../ui/sortable';
import dxSpeedDialAction, { dxSpeedDialActionOptions } from '../ui/speed_dial_action';
import dxSwitch, { dxSwitchOptions } from '../ui/switch';
import dxTabs, { dxTabsOptions } from '../ui/tabs';
import dxTabPanel, { dxTabPanelOptions } from '../ui/tab_panel';
import dxTagBox, { dxTagBoxOptions } from '../ui/tag_box';
import dxTextArea, { dxTextAreaOptions } from '../ui/text_area';
import dxTextBox, { dxTextBoxOptions } from '../ui/text_box';
import dxTileView, { dxTileViewOptions } from '../ui/tile_view';
import dxToast, { dxToastOptions } from '../ui/toast';
import dxToolbar, { dxToolbarOptions } from '../ui/toolbar';
import dxTooltip, { dxTooltipOptions } from '../ui/tooltip';
import dxTreeList, { dxTreeListOptions } from '../ui/tree_list';
import dxTreeView, { dxTreeViewOptions } from '../ui/tree_view';
import dxValidationGroup, { dxValidationGroupOptions } from '../ui/validation_group';
import dxValidationMessage, { dxValidationMessageOptions } from '../ui/validation_message';
import dxValidationSummary, { dxValidationSummaryOptions } from '../ui/validation_summary';
import dxValidator, { dxValidatorOptions } from '../ui/validator';
import dxBarGauge, { dxBarGaugeOptions } from '../viz/bar_gauge';
import dxBullet, { dxBulletOptions } from '../viz/bullet';
import dxChart, { dxChartOptions } from '../viz/chart';
import dxCircularGauge, { dxCircularGaugeOptions } from '../viz/circular_gauge';
import dxFunnel, { dxFunnelOptions } from '../viz/funnel';
import dxLinearGauge, { dxLinearGaugeOptions } from '../viz/linear_gauge';
import dxPieChart, { dxPieChartOptions } from '../viz/pie_chart';
import dxPolarChart, { dxPolarChartOptions } from '../viz/polar_chart';
import dxRangeSelector, { dxRangeSelectorOptions } from '../viz/range_selector';
import dxSankey, { dxSankeyOptions } from '../viz/sankey';
import dxSparkline, { dxSparklineOptions } from '../viz/sparkline';
import dxTreeMap, { dxTreeMapOptions } from '../viz/tree_map';
import dxVectorMap, { dxVectorMapOptions } from '../viz/vector_map';

declare module '../core/element' {
    interface ElementWrapper<T extends Element> extends JQuery<T> { }
    interface ElementsArrayWrapper<T extends Element> extends JQuery<T> { }
    interface InternalElementWrapper<T extends Element> extends JQuery<T> { }
}

declare module '../core/utils/deferred' {
    interface PromiseType<T> extends JQueryPromise<T> { }
}

declare module '../events' {
    interface EventType extends JQueryEventObject {
        cancel?: boolean;
    }
    interface EventExtension {
        jQueryEvent?: JQueryEventObject;
    }
}

declare global {
    interface JQueryPromise<T> { }
    interface JQueryEventObject { }
    interface JQuery<TElement = HTMLElement> {

        dxAccordion(): JQuery;
        dxAccordion(options: 'instance'): dxAccordion;
        dxAccordion(options: dxAccordionOptions): JQuery;
        dxAccordion(options: string): any;
        dxAccordion(options: string, ...params: any[]): any;

        dxActionSheet(): JQuery;
        dxActionSheet(options: 'instance'): dxActionSheet;
        dxActionSheet(options: dxActionSheetOptions): JQuery;
        dxActionSheet(options: string): any;
        dxActionSheet(options: string, ...params: any[]): any;

        dxAutocomplete(): JQuery;
        dxAutocomplete(options: 'instance'): dxAutocomplete;
        dxAutocomplete(options: dxAutocompleteOptions): JQuery;
        dxAutocomplete(options: string): any;
        dxAutocomplete(options: string, ...params: any[]): any;

        dxBarGauge(): JQuery;
        dxBarGauge(options: 'instance'): dxBarGauge;
        dxBarGauge(options: dxBarGaugeOptions): JQuery;
        dxBarGauge(options: string): any;
        dxBarGauge(options: string, ...params: any[]): any;

        dxBox(): JQuery;
        dxBox(options: 'instance'): dxBox;
        dxBox(options: dxBoxOptions): JQuery;
        dxBox(options: string): any;
        dxBox(options: string, ...params: any[]): any;

        dxBullet(): JQuery;
        dxBullet(options: 'instance'): dxBullet;
        dxBullet(options: dxBulletOptions): JQuery;
        dxBullet(options: string): any;
        dxBullet(options: string, ...params: any[]): any;

        dxButton(): JQuery;
        dxButton(options: 'instance'): dxButton;
        dxButton(options: dxButtonOptions): JQuery;
        dxButton(options: string): any;
        dxButton(options: string, ...params: any[]): any;

        dxButtonGroup(): JQuery;
        dxButtonGroup(options: 'instance'): dxButtonGroup;
        dxButtonGroup(options: dxButtonGroupOptions): JQuery;
        dxButtonGroup(options: string): any;
        dxButtonGroup(options: string, ...params: any[]): any;

        dxCalendar(): JQuery;
        dxCalendar(options: 'instance'): dxCalendar;
        dxCalendar(options: dxCalendarOptions): JQuery;
        dxCalendar(options: string): any;
        dxCalendar(options: string, ...params: any[]): any;

        dxChart(): JQuery;
        dxChart(options: 'instance'): dxChart;
        dxChart(options: dxChartOptions): JQuery;
        dxChart(options: string): any;
        dxChart(options: string, ...params: any[]): any;

        dxCheckBox(): JQuery;
        dxCheckBox(options: 'instance'): dxCheckBox;
        dxCheckBox(options: dxCheckBoxOptions): JQuery;
        dxCheckBox(options: string): any;
        dxCheckBox(options: string, ...params: any[]): any;

        dxCircularGauge(): JQuery;
        dxCircularGauge(options: 'instance'): dxCircularGauge;
        dxCircularGauge(options: dxCircularGaugeOptions): JQuery;
        dxCircularGauge(options: string): any;
        dxCircularGauge(options: string, ...params: any[]): any;

        dxColorBox(): JQuery;
        dxColorBox(options: 'instance'): dxColorBox;
        dxColorBox(options: dxColorBoxOptions): JQuery;
        dxColorBox(options: string): any;
        dxColorBox(options: string, ...params: any[]): any;

        dxContextMenu(): JQuery;
        dxContextMenu(options: 'instance'): dxContextMenu;
        dxContextMenu(options: dxContextMenuOptions): JQuery;
        dxContextMenu(options: string): any;
        dxContextMenu(options: string, ...params: any[]): any;

        dxDataGrid(): JQuery;
        dxDataGrid(options: 'instance'): dxDataGrid;
        dxDataGrid(options: dxDataGridOptions): JQuery;
        dxDataGrid(options: string): any;
        dxDataGrid(options: string, ...params: any[]): any;

        dxDateBox(): JQuery;
        dxDateBox(options: 'instance'): dxDateBox;
        dxDateBox(options: dxDateBoxOptions): JQuery;
        dxDateBox(options: string): any;
        dxDateBox(options: string, ...params: any[]): any;

        dxDeferRendering(): JQuery;
        dxDeferRendering(options: 'instance'): dxDeferRendering;
        dxDeferRendering(options: dxDeferRenderingOptions): JQuery;
        dxDeferRendering(options: string): any;
        dxDeferRendering(options: string, ...params: any[]): any;

        dxDiagram(): JQuery;
        dxDiagram(options: 'instance'): dxDiagram;
        dxDiagram(options: dxDiagramOptions): JQuery;
        dxDiagram(options: string): any;
        dxDiagram(options: string, ...params: any[]): any;

        dxDraggable(): JQuery;
        dxDraggable(options: 'instance'): dxDraggable;
        dxDraggable(options: dxDraggableOptions): JQuery;
        dxDraggable(options: string): any;
        dxDraggable(options: string, ...params: any[]): any;

        dxDrawer(): JQuery;
        dxDrawer(options: 'instance'): dxDrawer;
        dxDrawer(options: dxDrawerOptions): JQuery;
        dxDrawer(options: string): any;
        dxDrawer(options: string, ...params: any[]): any;

        dxDropDownBox(): JQuery;
        dxDropDownBox(options: 'instance'): dxDropDownBox;
        dxDropDownBox(options: dxDropDownBoxOptions): JQuery;
        dxDropDownBox(options: string): any;
        dxDropDownBox(options: string, ...params: any[]): any;

        dxDropDownButton(): JQuery;
        dxDropDownButton(options: 'instance'): dxDropDownButton;
        dxDropDownButton(options: dxDropDownButtonOptions): JQuery;
        dxDropDownButton(options: string): any;
        dxDropDownButton(options: string, ...params: any[]): any;

        dxFileManager(): JQuery;
        dxFileManager(options: 'instance'): dxFileManager;
        dxFileManager(options: dxFileManagerOptions): JQuery;
        dxFileManager(options: string): any;
        dxFileManager(options: string, ...params: any[]): any;

        dxFileUploader(): JQuery;
        dxFileUploader(options: 'instance'): dxFileUploader;
        dxFileUploader(options: dxFileUploaderOptions): JQuery;
        dxFileUploader(options: string): any;
        dxFileUploader(options: string, ...params: any[]): any;

        dxFilterBuilder(): JQuery;
        dxFilterBuilder(options: 'instance'): dxFilterBuilder;
        dxFilterBuilder(options: dxFilterBuilderOptions): JQuery;
        dxFilterBuilder(options: string): any;
        dxFilterBuilder(options: string, ...params: any[]): any;

        dxForm(): JQuery;
        dxForm(options: 'instance'): dxForm;
        dxForm(options: dxFormOptions): JQuery;
        dxForm(options: string): any;
        dxForm(options: string, ...params: any[]): any;

        dxFunnel(): JQuery;
        dxFunnel(options: 'instance'): dxFunnel;
        dxFunnel(options: dxFunnelOptions): JQuery;
        dxFunnel(options: string): any;
        dxFunnel(options: string, ...params: any[]): any;

        dxGallery(): JQuery;
        dxGallery(options: 'instance'): dxGallery;
        dxGallery(options: dxGalleryOptions): JQuery;
        dxGallery(options: string): any;
        dxGallery(options: string, ...params: any[]): any;

        dxGantt(): JQuery;
        dxGantt(options: 'instance'): dxGantt;
        dxGantt(options: dxGanttOptions): JQuery;
        dxGantt(options: string): any;
        dxGantt(options: string, ...params: any[]): any;

        dxHtmlEditor(): JQuery;
        dxHtmlEditor(options: 'instance'): dxHtmlEditor;
        dxHtmlEditor(options: dxHtmlEditorOptions): JQuery;
        dxHtmlEditor(options: string): any;
        dxHtmlEditor(options: string, ...params: any[]): any;

        dxLinearGauge(): JQuery;
        dxLinearGauge(options: 'instance'): dxLinearGauge;
        dxLinearGauge(options: dxLinearGaugeOptions): JQuery;
        dxLinearGauge(options: string): any;
        dxLinearGauge(options: string, ...params: any[]): any;

        dxList(): JQuery;
        dxList(options: 'instance'): dxList;
        dxList(options: dxListOptions): JQuery;
        dxList(options: string): any;
        dxList(options: string, ...params: any[]): any;

        dxLoadIndicator(): JQuery;
        dxLoadIndicator(options: 'instance'): dxLoadIndicator;
        dxLoadIndicator(options: dxLoadIndicatorOptions): JQuery;
        dxLoadIndicator(options: string): any;
        dxLoadIndicator(options: string, ...params: any[]): any;

        dxLoadPanel(): JQuery;
        dxLoadPanel(options: 'instance'): dxLoadPanel;
        dxLoadPanel(options: dxLoadPanelOptions): JQuery;
        dxLoadPanel(options: string): any;
        dxLoadPanel(options: string, ...params: any[]): any;

        dxLookup(): JQuery;
        dxLookup(options: 'instance'): dxLookup;
        dxLookup(options: dxLookupOptions): JQuery;
        dxLookup(options: string): any;
        dxLookup(options: string, ...params: any[]): any;

        dxMap(): JQuery;
        dxMap(options: 'instance'): dxMap;
        dxMap(options: dxMapOptions): JQuery;
        dxMap(options: string): any;
        dxMap(options: string, ...params: any[]): any;

        dxMenu(): JQuery;
        dxMenu(options: 'instance'): dxMenu;
        dxMenu(options: dxMenuOptions): JQuery;
        dxMenu(options: string): any;
        dxMenu(options: string, ...params: any[]): any;

        dxMultiView(): JQuery;
        dxMultiView(options: 'instance'): dxMultiView;
        dxMultiView(options: dxMultiViewOptions): JQuery;
        dxMultiView(options: string): any;
        dxMultiView(options: string, ...params: any[]): any;

        dxNavBar(): JQuery;
        dxNavBar(options: 'instance'): dxNavBar;
        dxNavBar(options: dxNavBarOptions): JQuery;
        dxNavBar(options: string): any;
        dxNavBar(options: string, ...params: any[]): any;

        dxNumberBox(): JQuery;
        dxNumberBox(options: 'instance'): dxNumberBox;
        dxNumberBox(options: dxNumberBoxOptions): JQuery;
        dxNumberBox(options: string): any;
        dxNumberBox(options: string, ...params: any[]): any;

        dxPieChart(): JQuery;
        dxPieChart(options: 'instance'): dxPieChart;
        dxPieChart(options: dxPieChartOptions): JQuery;
        dxPieChart(options: string): any;
        dxPieChart(options: string, ...params: any[]): any;

        dxPivotGrid(): JQuery;
        dxPivotGrid(options: 'instance'): dxPivotGrid;
        dxPivotGrid(options: dxPivotGridOptions): JQuery;
        dxPivotGrid(options: string): any;
        dxPivotGrid(options: string, ...params: any[]): any;

        dxPivotGridFieldChooser(): JQuery;
        dxPivotGridFieldChooser(options: 'instance'): dxPivotGridFieldChooser;
        dxPivotGridFieldChooser(options: dxPivotGridFieldChooserOptions): JQuery;
        dxPivotGridFieldChooser(options: string): any;
        dxPivotGridFieldChooser(options: string, ...params: any[]): any;

        dxPolarChart(): JQuery;
        dxPolarChart(options: 'instance'): dxPolarChart;
        dxPolarChart(options: dxPolarChartOptions): JQuery;
        dxPolarChart(options: string): any;
        dxPolarChart(options: string, ...params: any[]): any;

        dxPopover(): JQuery;
        dxPopover(options: 'instance'): dxPopover;
        dxPopover(options: dxPopoverOptions): JQuery;
        dxPopover(options: string): any;
        dxPopover(options: string, ...params: any[]): any;

        dxPopup(): JQuery;
        dxPopup(options: 'instance'): dxPopup;
        dxPopup(options: dxPopupOptions): JQuery;
        dxPopup(options: string): any;
        dxPopup(options: string, ...params: any[]): any;

        dxProgressBar(): JQuery;
        dxProgressBar(options: 'instance'): dxProgressBar;
        dxProgressBar(options: dxProgressBarOptions): JQuery;
        dxProgressBar(options: string): any;
        dxProgressBar(options: string, ...params: any[]): any;

        dxRadioGroup(): JQuery;
        dxRadioGroup(options: 'instance'): dxRadioGroup;
        dxRadioGroup(options: dxRadioGroupOptions): JQuery;
        dxRadioGroup(options: string): any;
        dxRadioGroup(options: string, ...params: any[]): any;

        dxRangeSelector(): JQuery;
        dxRangeSelector(options: 'instance'): dxRangeSelector;
        dxRangeSelector(options: dxRangeSelectorOptions): JQuery;
        dxRangeSelector(options: string): any;
        dxRangeSelector(options: string, ...params: any[]): any;

        dxRangeSlider(): JQuery;
        dxRangeSlider(options: 'instance'): dxRangeSlider;
        dxRangeSlider(options: dxRangeSliderOptions): JQuery;
        dxRangeSlider(options: string): any;
        dxRangeSlider(options: string, ...params: any[]): any;

        dxRecurrenceEditor(): JQuery;
        dxRecurrenceEditor(options: 'instance'): dxRecurrenceEditor;
        dxRecurrenceEditor(options: dxRecurrenceEditorOptions): JQuery;
        dxRecurrenceEditor(options: string): any;
        dxRecurrenceEditor(options: string, ...params: any[]): any;

        dxResizable(): JQuery;
        dxResizable(options: 'instance'): dxResizable;
        dxResizable(options: dxResizableOptions): JQuery;
        dxResizable(options: string): any;
        dxResizable(options: string, ...params: any[]): any;

        dxResponsiveBox(): JQuery;
        dxResponsiveBox(options: 'instance'): dxResponsiveBox;
        dxResponsiveBox(options: dxResponsiveBoxOptions): JQuery;
        dxResponsiveBox(options: string): any;
        dxResponsiveBox(options: string, ...params: any[]): any;

        dxSankey(): JQuery;
        dxSankey(options: 'instance'): dxSankey;
        dxSankey(options: dxSankeyOptions): JQuery;
        dxSankey(options: string): any;
        dxSankey(options: string, ...params: any[]): any;

        dxScheduler(): JQuery;
        dxScheduler(options: 'instance'): dxScheduler;
        dxScheduler(options: dxSchedulerOptions): JQuery;
        dxScheduler(options: string): any;
        dxScheduler(options: string, ...params: any[]): any;

        dxScrollView(): JQuery;
        dxScrollView(options: 'instance'): dxScrollView;
        dxScrollView(options: dxScrollViewOptions): JQuery;
        dxScrollView(options: string): any;
        dxScrollView(options: string, ...params: any[]): any;

        dxSelectBox(): JQuery;
        dxSelectBox(options: 'instance'): dxSelectBox;
        dxSelectBox(options: dxSelectBoxOptions): JQuery;
        dxSelectBox(options: string): any;
        dxSelectBox(options: string, ...params: any[]): any;

        dxSlideOut(): JQuery;
        dxSlideOut(options: 'instance'): dxSlideOut;
        dxSlideOut(options: dxSlideOutOptions): JQuery;
        dxSlideOut(options: string): any;
        dxSlideOut(options: string, ...params: any[]): any;

        dxSlideOutView(): JQuery;
        dxSlideOutView(options: 'instance'): dxSlideOutView;
        dxSlideOutView(options: dxSlideOutViewOptions): JQuery;
        dxSlideOutView(options: string): any;
        dxSlideOutView(options: string, ...params: any[]): any;

        dxSlider(): JQuery;
        dxSlider(options: 'instance'): dxSlider;
        dxSlider(options: dxSliderOptions): JQuery;
        dxSlider(options: string): any;
        dxSlider(options: string, ...params: any[]): any;

        dxSortable(): JQuery;
        dxSortable(options: 'instance'): dxSortable;
        dxSortable(options: dxSortableOptions): JQuery;
        dxSortable(options: string): any;
        dxSortable(options: string, ...params: any[]): any;

        dxSparkline(): JQuery;
        dxSparkline(options: 'instance'): dxSparkline;
        dxSparkline(options: dxSparklineOptions): JQuery;
        dxSparkline(options: string): any;
        dxSparkline(options: string, ...params: any[]): any;

        dxSpeedDialAction(): JQuery;
        dxSpeedDialAction(options: 'instance'): dxSpeedDialAction;
        dxSpeedDialAction(options: dxSpeedDialActionOptions): JQuery;
        dxSpeedDialAction(options: string): any;
        dxSpeedDialAction(options: string, ...params: any[]): any;

        dxSwitch(): JQuery;
        dxSwitch(options: 'instance'): dxSwitch;
        dxSwitch(options: dxSwitchOptions): JQuery;
        dxSwitch(options: string): any;
        dxSwitch(options: string, ...params: any[]): any;

        dxTabPanel(): JQuery;
        dxTabPanel(options: 'instance'): dxTabPanel;
        dxTabPanel(options: dxTabPanelOptions): JQuery;
        dxTabPanel(options: string): any;
        dxTabPanel(options: string, ...params: any[]): any;

        dxTabs(): JQuery;
        dxTabs(options: 'instance'): dxTabs;
        dxTabs(options: dxTabsOptions): JQuery;
        dxTabs(options: string): any;
        dxTabs(options: string, ...params: any[]): any;

        dxTagBox(): JQuery;
        dxTagBox(options: 'instance'): dxTagBox;
        dxTagBox(options: dxTagBoxOptions): JQuery;
        dxTagBox(options: string): any;
        dxTagBox(options: string, ...params: any[]): any;

        dxTextArea(): JQuery;
        dxTextArea(options: 'instance'): dxTextArea;
        dxTextArea(options: dxTextAreaOptions): JQuery;
        dxTextArea(options: string): any;
        dxTextArea(options: string, ...params: any[]): any;

        dxTextBox(): JQuery;
        dxTextBox(options: 'instance'): dxTextBox;
        dxTextBox(options: dxTextBoxOptions): JQuery;
        dxTextBox(options: string): any;
        dxTextBox(options: string, ...params: any[]): any;

        dxTileView(): JQuery;
        dxTileView(options: 'instance'): dxTileView;
        dxTileView(options: dxTileViewOptions): JQuery;
        dxTileView(options: string): any;
        dxTileView(options: string, ...params: any[]): any;

        dxToast(): JQuery;
        dxToast(options: 'instance'): dxToast;
        dxToast(options: dxToastOptions): JQuery;
        dxToast(options: string): any;
        dxToast(options: string, ...params: any[]): any;

        dxToolbar(): JQuery;
        dxToolbar(options: 'instance'): dxToolbar;
        dxToolbar(options: dxToolbarOptions): JQuery;
        dxToolbar(options: string): any;
        dxToolbar(options: string, ...params: any[]): any;

        dxTooltip(): JQuery;
        dxTooltip(options: 'instance'): dxTooltip;
        dxTooltip(options: dxTooltipOptions): JQuery;
        dxTooltip(options: string): any;
        dxTooltip(options: string, ...params: any[]): any;

        dxTreeList(): JQuery;
        dxTreeList(options: 'instance'): dxTreeList;
        dxTreeList(options: dxTreeListOptions): JQuery;
        dxTreeList(options: string): any;
        dxTreeList(options: string, ...params: any[]): any;

        dxTreeMap(): JQuery;
        dxTreeMap(options: 'instance'): dxTreeMap;
        dxTreeMap(options: dxTreeMapOptions): JQuery;
        dxTreeMap(options: string): any;
        dxTreeMap(options: string, ...params: any[]): any;

        dxTreeView(): JQuery;
        dxTreeView(options: 'instance'): dxTreeView;
        dxTreeView(options: dxTreeViewOptions): JQuery;
        dxTreeView(options: string): any;
        dxTreeView(options: string, ...params: any[]): any;

        dxValidationGroup(): JQuery;
        dxValidationGroup(options: 'instance'): dxValidationGroup;
        dxValidationGroup(options: dxValidationGroupOptions): JQuery;
        dxValidationGroup(options: string): any;
        dxValidationGroup(options: string, ...params: any[]): any;

        dxValidationMessage(): JQuery;
        dxValidationMessage(options: 'instance'): dxValidationMessage;
        dxValidationMessage(options: dxValidationMessageOptions): JQuery;
        dxValidationMessage(options: string): any;
        dxValidationMessage(options: string, ...params: any[]): any;

        dxValidationSummary(): JQuery;
        dxValidationSummary(options: 'instance'): dxValidationSummary;
        dxValidationSummary(options: dxValidationSummaryOptions): JQuery;
        dxValidationSummary(options: string): any;
        dxValidationSummary(options: string, ...params: any[]): any;

        dxValidator(): JQuery;
        dxValidator(options: 'instance'): dxValidator;
        dxValidator(options: dxValidatorOptions): JQuery;
        dxValidator(options: string): any;
        dxValidator(options: string, ...params: any[]): any;

        dxVectorMap(): JQuery;
        dxVectorMap(options: 'instance'): dxVectorMap;
        dxVectorMap(options: dxVectorMapOptions): JQuery;
        dxVectorMap(options: string): any;
        dxVectorMap(options: string, ...params: any[]): any;
    }
}

export const { };
