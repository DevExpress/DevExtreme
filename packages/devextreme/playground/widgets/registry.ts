import type { WidgetId } from '../widget-ids';
import $ from 'jquery';

import '../../js/ui/accordion';
import '../../js/ui/action_sheet';
import '../../js/ui/autocomplete';
import '../../js/ui/box';
import '../../js/ui/button';
import '../../js/ui/button_group';
import '../../js/ui/calendar';
import '../../js/ui/card_view';
import '../../js/ui/chat';
import '../../js/ui/check_box';
import '../../js/ui/color_box';
import '../../js/ui/context_menu';
import '../../js/ui/data_grid';
import '../../js/ui/date_box';
import '../../js/ui/date_range_box';
import '../../js/ui/diagram';
import '../../js/ui/draggable';
import '../../js/ui/drawer';
import '../../js/ui/drop_down_box';
import '../../js/ui/drop_down_button';
import '../../js/ui/file_manager';
import '../../js/ui/file_uploader';
import '../../js/ui/filter_builder';
import '../../js/ui/form';
import '../../js/ui/gallery';
import '../../js/ui/gantt';
import '../../js/ui/html_editor';
import '../../js/ui/list';
import '../../js/ui/load_indicator';
import '../../js/ui/load_panel';
import '../../js/ui/lookup';
import '../../js/ui/map';
import '../../js/ui/menu';
import '../../js/ui/multi_view';
import '../../js/ui/number_box';
import '../../js/ui/pagination';
import '../../js/ui/pivot_grid';
import '../../js/ui/pivot_grid_field_chooser';
import '../../js/ui/popover';
import '../../js/ui/popup';
import '../../js/ui/progress_bar';
import '../../js/ui/radio_group';
import '../../js/ui/range_slider';
import '../../js/ui/recurrence_editor';
import '../../js/ui/resizable';
import '../../js/ui/responsive_box';
import '../../js/ui/scheduler';
import '../../js/ui/scroll_view';
import '../../js/ui/select_box';
import '../../js/ui/slider';
import '../../js/ui/sortable';
import '../../js/ui/speed_dial_action';
import '../../js/ui/splitter';
import '../../js/ui/stepper';
import '../../js/ui/switch';
import '../../js/ui/tab_panel';
import '../../js/ui/tabs';
import '../../js/ui/tag_box';
import '../../js/ui/text_area';
import '../../js/ui/text_box';
import '../../js/ui/tile_view';
import '../../js/ui/toast';
import '../../js/ui/toolbar';
import '../../js/ui/tooltip';
import '../../js/ui/tree_list';
import '../../js/ui/tree_view';
import '../../js/ui/validation_group';
import '../../js/ui/validation_summary';
import '../../js/ui/validator';
import '../../js/viz/bar_gauge';
import '../../js/viz/bullet';
import '../../js/viz/chart';
import '../../js/viz/circular_gauge';
import '../../js/viz/funnel';
import '../../js/viz/linear_gauge';
import '../../js/viz/pie_chart';
import '../../js/viz/polar_chart';
import '../../js/viz/range_selector';
import '../../js/viz/sankey';
import '../../js/viz/sparkline';
import '../../js/viz/tree_map';
import '../../js/viz/vector_map';

export type WidgetInit = ($el: JQuery) => void;

interface RegistryEntry {
    label: string;
    init: WidgetInit;
}

const apptData = [
    { text: 'Meeting', startDate: new Date(2024, 0, 10, 9, 0), endDate: new Date(2024, 0, 10, 10, 30) },
    { text: 'Conference Call', startDate: new Date(2024, 0, 10, 14, 0), endDate: new Date(2024, 0, 10, 15, 0) },
];

const gridData = [
    { id: 1, name: 'Alice', city: 'London', age: 32 },
    { id: 2, name: 'Bob', city: 'Paris', age: 25 },
    { id: 3, name: 'Carol', city: 'Berlin', age: 41 },
];

const chartData = [
    { arg: 'Jan', val: 30 }, { arg: 'Feb', val: 50 }, { arg: 'Mar', val: 40 },
    { arg: 'Apr', val: 70 }, { arg: 'May', val: 60 }, { arg: 'Jun', val: 80 },
];

const treeData = [
    { id: 1, parentId: 0, text: 'Documents' },
    { id: 2, parentId: 1, text: 'Reports' },
    { id: 3, parentId: 1, text: 'Notes' },
    { id: 4, parentId: 0, text: 'Images' },
];

const dx = ($el: JQuery) => $el as any;

export const registry: Record<WidgetId, RegistryEntry> = {
    accordion: {
        label: 'Accordion',
        init: ($el) => dx($el).dxAccordion({ dataSource: ['Item 1', 'Item 2', 'Item 3'], width: 400 }),
    },
    actionSheet: {
        label: 'ActionSheet',
        init: ($el) => {
            const $btn = $('<div>').appendTo($el);
            dx($btn).dxButton({
                text: 'Show ActionSheet',
                onClick: () => dx($('<div>').appendTo($el)).dxActionSheet({
                    title: 'Actions',
                    items: [{ text: 'Action 1' }, { text: 'Action 2' }],
                    visible: true,
                    target: $btn,
                }),
            });
        },
    },
    autocomplete: {
        label: 'Autocomplete',
        init: ($el) => dx($el).dxAutocomplete({ dataSource: ['Alice', 'Bob', 'Carol', 'Dave'], placeholder: 'Type a name...' }),
    },
    barGauge: {
        label: 'BarGauge',
        init: ($el) => dx($el).dxBarGauge({ values: [0.3, 0.6, 0.9], startValue: 0, endValue: 1, height: 300 }),
    },
    box: {
        label: 'Box',
        init: ($el) => dx($el).dxBox({
            direction: 'row',
            height: 100,
            items: [
                { html: '<div style="background:#e8e8e8;padding:10px">Box 1</div>', ratio: 1 },
                { html: '<div style="background:#d0d0d0;padding:10px">Box 2</div>', ratio: 1 },
            ],
        }),
    },
    bullet: {
        label: 'Bullet',
        init: ($el) => dx($el).dxBullet({ value: 65, startScaleValue: 0, endScaleValue: 100, target: 80, height: 60, width: 400 }),
    },
    button: {
        label: 'Button',
        init: ($el) => dx($el).dxButton({ text: 'Click me', type: 'default', stylingMode: 'contained' }),
    },
    buttonGroup: {
        label: 'ButtonGroup',
        init: ($el) => dx($el).dxButtonGroup({
            items: [{ text: 'Left' }, { text: 'Center' }, { text: 'Right' }],
            selectionMode: 'single',
            selectedItemKeys: ['Center'],
            keyExpr: 'text',
        }),
    },
    calendar: {
        label: 'Calendar',
        init: ($el) => dx($el).dxCalendar({ value: new Date(), width: 280 }),
    },
    cardView: {
        label: 'CardView',
        init: ($el) => dx($el).dxCardView({
            dataSource: [
                { id: 1, name: 'Alice', city: 'London', age: 32 },
                { id: 2, name: 'Bob', city: 'Paris', age: 25 },
                { id: 3, name: 'Carol', city: 'Berlin', age: 41 },
            ],
            keyExpr: 'id',
            columns: ['name', 'city', 'age'],
            height: 400,
        }),
    },
    chat: {
        label: 'Chat',
        init: ($el) => dx($el).dxChat({ height: 400, items: [] }),
    },
    checkBox: {
        label: 'CheckBox',
        init: ($el) => dx($el).dxCheckBox({ text: 'Enable feature', value: true }),
    },
    chart: {
        label: 'Chart',
        init: ($el) => dx($el).dxChart({
            dataSource: chartData,
            series: [{ argumentField: 'arg', valueField: 'val', type: 'bar' }],
            height: 300,
        }),
    },
    circularGauge: {
        label: 'CircularGauge',
        init: ($el) => dx($el).dxCircularGauge({ value: 65, height: 300, rangeContainer: { ranges: [] } }),
    },
    colorBox: {
        label: 'ColorBox',
        init: ($el) => dx($el).dxColorBox({ value: '#0d6efd', width: 200 }),
    },
    contextMenu: {
        label: 'ContextMenu',
        init: ($el) => {
            $('<div id="ctx-target" style="padding:20px;background:#eee;border:1px dashed #999">Right-click here</div>').appendTo($el);
            dx($('<div>').appendTo($el)).dxContextMenu({
                target: '#ctx-target',
                items: [{ text: 'Copy' }, { text: 'Paste' }, { text: 'Delete' }],
            });
        },
    },
    dataGrid: {
        label: 'DataGrid',
        init: ($el) => dx($el).dxDataGrid({
            dataSource: gridData,
            keyExpr: 'id',
            columns: ['name', 'city', 'age'],
            showBorders: true,
        }),
    },
    dateBox: {
        label: 'DateBox',
        init: ($el) => dx($el).dxDateBox({ value: new Date(), type: 'date', width: 220 }),
    },
    dateRangeBox: {
        label: 'DateRangeBox',
        init: ($el) => dx($el).dxDateRangeBox({
            startDate: new Date(2024, 0, 1),
            endDate: new Date(2024, 0, 31),
            width: 400,
        }),
    },
    diagram: {
        label: 'Diagram',
        init: ($el) => dx($el).dxDiagram({ height: 400 }),
    },
    draggable: {
        label: 'Draggable',
        init: ($el) => {
            const $box = $('<div style="width:100px;height:100px;background:#0d6efd;color:#fff;display:flex;align-items:center;justify-content:center;border-radius:4px">Drag me</div>').appendTo($el);
            dx($box).dxDraggable({ boundary: $el });
        },
    },
    drawer: {
        label: 'Drawer',
        init: ($el) => {
            $el.css({ height: '300px', position: 'relative' });
            const $content = $('<div style="padding:16px"><p>Main content area</p></div>');
            dx($el).dxDrawer({
                opened: true,
                template: () => $('<div style="width:200px;padding:16px;background:#f5f5f5">Drawer panel</div>'),
                contentTemplate: () => $content,
                height: 300,
            });
        },
    },
    dropDownBox: {
        label: 'DropDownBox',
        init: ($el) => dx($el).dxDropDownBox({
            dataSource: ['Alice', 'Bob', 'Carol'],
            value: 'Alice',
            width: 300,
        }),
    },
    dropDownButton: {
        label: 'DropDownButton',
        init: ($el) => dx($el).dxDropDownButton({
            text: 'Options',
            items: [{ text: 'Option 1' }, { text: 'Option 2' }, { text: 'Option 3' }],
        }),
    },
    fileManager: {
        label: 'FileManager',
        init: ($el) => dx($el).dxFileManager({ height: 400 }),
    },
    fileUploader: {
        label: 'FileUploader',
        init: ($el) => dx($el).dxFileUploader({ multiple: false, accept: '*', uploadMode: 'useButton' }),
    },
    filterBuilder: {
        label: 'FilterBuilder',
        init: ($el) => dx($el).dxFilterBuilder({
            fields: [
                { dataField: 'name', caption: 'Name' },
                { dataField: 'age', caption: 'Age', dataType: 'number' },
            ],
        }),
    },
    form: {
        label: 'Form',
        init: ($el) => dx($el).dxForm({
            formData: { name: 'Alice', email: 'alice@example.com', age: 32 },
            items: [
                { dataField: 'name', label: { text: 'Name' } },
                { dataField: 'email', label: { text: 'Email' } },
                { dataField: 'age', label: { text: 'Age' }, editorType: 'dxNumberBox' },
            ],
            width: 400,
        }),
    },
    funnel: {
        label: 'Funnel',
        init: ($el) => dx($el).dxFunnel({
            dataSource: [
                { argument: 'Leads', value: 100 },
                { argument: 'Prospects', value: 60 },
                { argument: 'Customers', value: 30 },
            ],
            argumentField: 'argument',
            valueField: 'value',
            height: 300,
        }),
    },
    gallery: {
        label: 'Gallery',
        init: ($el) => dx($el).dxGallery({
            dataSource: ['Item 1', 'Item 2', 'Item 3'],
            height: 200,
            width: 400,
            itemTemplate: (item: string) => $(`<div style="display:flex;align-items:center;justify-content:center;height:100%;background:#eee;font-size:18px">${item}</div>`),
        }),
    },
    gantt: {
        label: 'Gantt',
        init: ($el) => dx($el).dxGantt({
            tasks: {
                dataSource: [
                    { id: 1, parentId: 0, title: 'Project', start: new Date(2024, 0, 1), end: new Date(2024, 0, 31), progress: 50 },
                    { id: 2, parentId: 1, title: 'Task 1', start: new Date(2024, 0, 1), end: new Date(2024, 0, 15), progress: 70 },
                ],
            },
            height: 300,
        }),
    },
    htmlEditor: {
        label: 'HtmlEditor',
        init: ($el) => dx($el).dxHtmlEditor({
            value: '<p>Hello <b>world</b>!</p>',
            height: 200,
            toolbar: { items: ['bold', 'italic', 'underline'] },
        }),
    },
    linearGauge: {
        label: 'LinearGauge',
        init: ($el) => dx($el).dxLinearGauge({ value: 65, height: 100 }),
    },
    list: {
        label: 'List',
        init: ($el) => dx($el).dxList({
            dataSource: ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'],
            height: 250,
        }),
    },
    loadIndicator: {
        label: 'LoadIndicator',
        init: ($el) => {
            $el.css({ display: 'flex', alignItems: 'center', gap: '12px' });
            dx($('<div>').appendTo($el)).dxLoadIndicator({ visible: true });
            $('<span>Loading...</span>').appendTo($el);
        },
    },
    loadPanel: {
        label: 'LoadPanel',
        init: ($el) => {
            $('<div id="lp-target" style="height:200px;background:#f0f0f0;display:flex;align-items:center;justify-content:center">Content area</div>').appendTo($el);
            dx($('<div>').appendTo($el)).dxLoadPanel({
                visible: true,
                showIndicator: true,
                showPane: true,
                shading: false,
                position: { of: '#lp-target' },
                container: $el,
            });
        },
    },
    lookup: {
        label: 'Lookup',
        init: ($el) => dx($el).dxLookup({
            dataSource: ['Alice', 'Bob', 'Carol', 'Dave'],
            value: 'Alice',
            width: 250,
        }),
    },
    map: {
        label: 'Map',
        init: ($el) => dx($el).dxMap({
            center: { lat: 40.7128, lng: -74.006 },
            zoom: 10,
            height: 300,
            width: '100%',
            provider: 'google',
        }),
    },
    menu: {
        label: 'Menu',
        init: ($el) => dx($el).dxMenu({
            dataSource: [
                { text: 'File', items: [{ text: 'New' }, { text: 'Open' }, { text: 'Save' }] },
                { text: 'Edit', items: [{ text: 'Cut' }, { text: 'Copy' }, { text: 'Paste' }] },
                { text: 'View' },
            ],
        }),
    },
    multiView: {
        label: 'MultiView',
        init: ($el) => dx($el).dxMultiView({
            dataSource: [
                { html: '<div style="padding:20px;background:#e8f4fd">View 1 content</div>' },
                { html: '<div style="padding:20px;background:#fdecea">View 2 content</div>' },
                { html: '<div style="padding:20px;background:#e8fde8">View 3 content</div>' },
            ],
            height: 150,
        }),
    },
    numberBox: {
        label: 'NumberBox',
        init: ($el) => dx($el).dxNumberBox({ value: 42, min: 0, max: 100, showSpinButtons: true, width: 180 }),
    },
    pagination: {
        label: 'Pagination',
        init: ($el) => dx($el).dxPagination({ pageCount: 10, pageIndex: 0, pageSize: 10, itemCount: 100 }),
    },
    pieChart: {
        label: 'PieChart',
        init: ($el) => dx($el).dxPieChart({
            dataSource: [
                { arg: 'Apples', val: 35 },
                { arg: 'Oranges', val: 25 },
                { arg: 'Bananas', val: 20 },
                { arg: 'Grapes', val: 20 },
            ],
            series: [{ argumentField: 'arg', valueField: 'val' }],
            height: 300,
        }),
    },
    pivotGrid: {
        label: 'PivotGrid',
        init: ($el) => dx($el).dxPivotGrid({
            dataSource: {
                fields: [
                    { dataField: 'region', area: 'row' },
                    { dataField: 'product', area: 'column' },
                    { dataField: 'amount', area: 'data', summaryType: 'sum' },
                ],
                store: [
                    { region: 'North', product: 'A', amount: 100 },
                    { region: 'South', product: 'B', amount: 200 },
                    { region: 'North', product: 'B', amount: 150 },
                ],
            },
            height: 300,
        }),
    },
    pivotGridFieldChooser: {
        label: 'PivotGridFieldChooser',
        init: ($el) => {
            const dataSource = { fields: [{ dataField: 'name' }, { dataField: 'age' }], store: gridData } as any;
            dx($el).dxPivotGridFieldChooser({ dataSource, height: 300 });
        },
    },
    polarChart: {
        label: 'PolarChart',
        init: ($el) => dx($el).dxPolarChart({
            dataSource: chartData,
            series: [{ argumentField: 'arg', valueField: 'val', type: 'line' }],
            height: 300,
        }),
    },
    popover: {
        label: 'Popover',
        init: ($el) => {
            const $btn = $('<div style="display:inline-block">').appendTo($el);
            dx($btn).dxButton({ text: 'Show Popover', onClick: () => dx($pop).dxPopover('show') });
            const $pop = $('<div>').appendTo($el);
            dx($pop).dxPopover({ target: $btn, content: 'Hello from popover!' });
        },
    },
    popup: {
        label: 'Popup',
        init: ($el) => {
            const $btn = $('<div style="display:inline-block">').appendTo($el);
            const $pop = $('<div>').appendTo($el);
            dx($pop).dxPopup({ title: 'Info', contentTemplate: () => '<p>Popup content</p>', visible: false, width: 300, height: 200 });
            dx($btn).dxButton({ text: 'Show Popup', onClick: () => dx($pop).dxPopup('show') });
        },
    },
    progressBar: {
        label: 'ProgressBar',
        init: ($el) => dx($el).dxProgressBar({ value: 65, min: 0, max: 100, width: 300 }),
    },
    radioGroup: {
        label: 'RadioGroup',
        init: ($el) => dx($el).dxRadioGroup({
            dataSource: ['Option A', 'Option B', 'Option C'],
            value: 'Option A',
        }),
    },
    rangeSelector: {
        label: 'RangeSelector',
        init: ($el) => dx($el).dxRangeSelector({
            scale: { startValue: 0, endValue: 100, tickInterval: 10 },
            sliderMarker: { visible: true },
            value: [20, 70],
            height: 120,
        }),
    },
    rangeSlider: {
        label: 'RangeSlider',
        init: ($el) => dx($el).dxRangeSlider({ min: 0, max: 100, start: 20, end: 70, width: 300 }),
    },
    recurrenceEditor: {
        label: 'RecurrenceEditor',
        init: ($el) => dx($el).dxRecurrenceEditor({ value: 'FREQ=WEEKLY;BYDAY=MO,WE,FR' }),
    },
    resizable: {
        label: 'Resizable',
        init: ($el) => {
            const $box = $('<div style="background:#e8f4fd;padding:16px;border:1px solid #90caf9">Resize me</div>').appendTo($el);
            dx($box).dxResizable({ width: 200, height: 100, minWidth: 100, minHeight: 60 });
        },
    },
    responsiveBox: {
        label: 'ResponsiveBox',
        init: ($el) => dx($el).dxResponsiveBox({
            rows: [{ ratio: 1 }],
            cols: [{ ratio: 1 }, { ratio: 1 }],
            items: [
                { html: '<div style="background:#eee;padding:10px">Left</div>', location: { row: 0, col: 0 } },
                { html: '<div style="background:#ddd;padding:10px">Right</div>', location: { row: 0, col: 1 } },
            ],
            height: 80,
        }),
    },
    sankey: {
        label: 'Sankey',
        init: ($el) => dx($el).dxSankey({
            dataSource: [
                { source: 'A', target: 'X', weight: 10 },
                { source: 'A', target: 'Y', weight: 5 },
                { source: 'B', target: 'X', weight: 7 },
                { source: 'B', target: 'Y', weight: 8 },
            ],
            height: 300,
        }),
    },
    scheduler: {
        label: 'Scheduler',
        init: ($el) => dx($el).dxScheduler({
            dataSource: apptData,
            views: ['week'],
            currentView: 'week',
            currentDate: new Date(2024, 0, 10),
            startDayHour: 8,
            endDayHour: 18,
            height: 500,
        }),
    },
    scrollView: {
        label: 'ScrollView',
        init: ($el) => dx($el).dxScrollView({
            width: 300,
            height: 150,
            content: () => $('<div style="height:400px;padding:12px">Scrollable content<br/>'.repeat(10) + '</div>'),
        }),
    },
    selectBox: {
        label: 'SelectBox',
        init: ($el) => dx($el).dxSelectBox({
            dataSource: ['Apple', 'Banana', 'Cherry'],
            value: 'Apple',
            width: 220,
        }),
    },
    slider: {
        label: 'Slider',
        init: ($el) => dx($el).dxSlider({ min: 0, max: 100, value: 40, width: 300 }),
    },
    sortable: {
        label: 'Sortable',
        init: ($el) => {
            const $list = $('<div>').appendTo($el);
            ['Item 1', 'Item 2', 'Item 3', 'Item 4'].forEach((t) => {
                $(`<div style="padding:8px 12px;margin:4px 0;background:#f0f0f0;border:1px solid #ddd;cursor:grab;user-select:none">${t}</div>`).appendTo($list);
            });
            dx($list).dxSortable({ filter: 'div' });
        },
    },
    sparkline: {
        label: 'Sparkline',
        init: ($el) => dx($el).dxSparkline({
            dataSource: [{ val: 4 }, { val: 8 }, { val: 6 }, { val: 9 }, { val: 5 }, { val: 7 }],
            valueField: 'val',
            type: 'bar',
            width: 200,
            height: 40,
        }),
    },
    speedDialAction: {
        label: 'SpeedDialAction',
        init: ($el) => {
            $el.css({ position: 'relative', height: '200px', background: '#f5f5f5' });
            dx($('<div>').appendTo($el)).dxSpeedDialAction({ label: 'Add', icon: 'plus' });
        },
    },
    splitter: {
        label: 'Splitter',
        init: ($el) => dx($el).dxSplitter({
            items: [
                { html: '<div style="padding:12px">Left pane</div>' },
                { html: '<div style="padding:12px">Right pane</div>' },
            ],
            orientation: 'horizontal',
            height: 200,
        }),
    },
    stepper: {
        label: 'Stepper',
        init: ($el) => dx($el).dxStepper({
            items: [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }],
            selectedIndex: 0,
        }),
    },
    switch: {
        label: 'Switch',
        init: ($el) => dx($el).dxSwitch({ value: true, switchedOnText: 'ON', switchedOffText: 'OFF' }),
    },
    tabPanel: {
        label: 'TabPanel',
        init: ($el) => dx($el).dxTabPanel({
            dataSource: [
                { title: 'Tab 1', html: '<p style="padding:12px">Content of Tab 1</p>' },
                { title: 'Tab 2', html: '<p style="padding:12px">Content of Tab 2</p>' },
                { title: 'Tab 3', html: '<p style="padding:12px">Content of Tab 3</p>' },
            ],
            height: 150,
        }),
    },
    tabs: {
        label: 'Tabs',
        init: ($el) => dx($el).dxTabs({
            dataSource: [{ text: 'Home' }, { text: 'Products' }, { text: 'About' }],
            selectedIndex: 0,
        }),
    },
    tagBox: {
        label: 'TagBox',
        init: ($el) => dx($el).dxTagBox({
            dataSource: ['Angular', 'React', 'Vue', 'jQuery'],
            value: ['React', 'Vue'],
            width: 350,
        }),
    },
    textArea: {
        label: 'TextArea',
        init: ($el) => dx($el).dxTextArea({
            value: 'Some text here...',
            height: 100,
            width: 300,
        }),
    },
    textBox: {
        label: 'TextBox',
        init: ($el) => dx($el).dxTextBox({ value: 'Hello world', width: 250, showClearButton: true }),
    },
    tileView: {
        label: 'TileView',
        init: ($el) => dx($el).dxTileView({
            dataSource: [
                { text: 'Tile 1', color: '#e3f2fd' },
                { text: 'Tile 2', color: '#fce4ec' },
                { text: 'Tile 3', color: '#e8f5e9' },
                { text: 'Tile 4', color: '#fff3e0' },
            ],
            itemTemplate: (item: { text: string; color: string }) =>
                $(`<div style="background:${item.color};display:flex;align-items:center;justify-content:center;height:100%">${item.text}</div>`),
            baseItemHeight: 80,
            baseItemWidth: 120,
            height: 200,
        }),
    },
    toast: {
        label: 'Toast',
        init: ($el) => {
            const $btn = $('<div style="display:inline-block">').appendTo($el);
            const $toast = $('<div>').appendTo($el);
            dx($toast).dxToast({ message: 'Hello from Toast!', type: 'success', displayTime: 2000 });
            dx($btn).dxButton({ text: 'Show Toast', onClick: () => dx($toast).dxToast('show') });
        },
    },
    toolbar: {
        label: 'Toolbar',
        init: ($el) => dx($el).dxToolbar({
            items: [
                { widget: 'dxButton', options: { text: 'New', icon: 'plus' }, location: 'before' },
                { widget: 'dxButton', options: { text: 'Save', icon: 'save' }, location: 'before' },
                { widget: 'dxTextBox', options: { placeholder: 'Search...' }, location: 'after' },
            ],
        }),
    },
    tooltip: {
        label: 'Tooltip',
        init: ($el) => {
            const $target = $('<div id="tt-target" style="display:inline-block;padding:10px;background:#e3f2fd;border-radius:4px">Hover me</div>').appendTo($el);
            dx($('<div>').appendTo($el)).dxTooltip({
                target: $target,
                content: 'This is a tooltip!',
                showEvent: 'mouseenter',
                hideEvent: 'mouseleave',
            });
        },
    },
    treeList: {
        label: 'TreeList',
        init: ($el) => dx($el).dxTreeList({
            dataSource: treeData,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            columns: [{ dataField: 'text', caption: 'Name' }],
            showBorders: true,
            height: 250,
        }),
    },
    treeMap: {
        label: 'TreeMap',
        init: ($el) => dx($el).dxTreeMap({
            dataSource: [
                { name: 'A', value: 40 },
                { name: 'B', value: 25 },
                { name: 'C', value: 20 },
                { name: 'D', value: 15 },
            ],
            valueField: 'value',
            labelField: 'name',
            height: 300,
        }),
    },
    treeView: {
        label: 'TreeView',
        init: ($el) => dx($el).dxTreeView({
            dataSource: treeData,
            keyExpr: 'id',
            parentIdExpr: 'parentId',
            displayExpr: 'text',
            height: 250,
        }),
    },
    validationGroup: {
        label: 'ValidationGroup',
        init: ($el) => {
            const $group = $('<div>').appendTo($el);
            dx($group).dxValidationGroup({});
            const $tb = $('<div style="margin-bottom:8px">').appendTo($group);
            dx($tb).dxTextBox({ placeholder: 'Required field' });
            dx($('<div>').appendTo($group)).dxValidator({ validationRules: [{ type: 'required', message: 'This field is required' }], adapter: { getValue: () => dx($tb).dxTextBox('option', 'value') } });
            dx($('<div>').appendTo($group)).dxButton({ text: 'Validate', validationGroup: $group, useSubmitBehavior: false, onClick: () => { dx($group).dxValidationGroup('validate'); } });
        },
    },
    validationSummary: {
        label: 'ValidationSummary',
        init: ($el) => {
            dx($el).dxValidationSummary({});
        },
    },
    validator: {
        label: 'Validator',
        init: ($el) => {
            const $tb = $('<div>').appendTo($el);
            dx($tb).dxTextBox({ placeholder: 'Enter email' });
            dx($('<div>').appendTo($el)).dxValidator({
                validationRules: [{ type: 'email', message: 'Enter a valid email' }],
                adapter: { getValue: () => dx($tb).dxTextBox('option', 'value') },
            });
        },
    },
    vectorMap: {
        label: 'VectorMap',
        init: ($el) => dx($el).dxVectorMap({ height: 300 }),
    },
};
