var widgets = {
    Accordion: require("ui/accordion"),
    ActionSheet: require("ui/action_sheet"),
    Autocomplete: require("ui/autocomplete"),
    BarGauge: require("viz/bar_gauge"),
    Box: require("ui/box"),
    Bullet: require("viz/bullet"),
    Button: require("ui/button"),
    Calendar: require("ui/calendar"),
    Chart: require("viz/chart"),
    CheckBox: require("ui/check_box"),
    CircularGauge: require("viz/circular_gauge"),
    ColorBox: require("ui/color_box"),
    ContextMenu: require("ui/context_menu"),
    DataGrid: require("ui/data_grid"),
    DateBox: require("ui/date_box"),
    DeferRendering: require("ui/defer_rendering"),
    Drawer: require("ui/drawer"),
    DropDownBox: require("ui/drop_down_box"),
    FileManager: require("ui/file_manager"),
    FileUploader: require("ui/file_uploader"),
    FilterBuilder: require("ui/filter_builder"),
    Form: require("ui/form"),
    Funnel: require("viz/funnel"),
    Gallery: require("ui/gallery"),
    Gantt: require("ui/gantt"),
    HtmlEditor: require("ui/html_editor"),
    LinearGauge: require("viz/linear_gauge"),
    List: require("ui/list"),
    LoadIndicator: require("ui/load_indicator"),
    LoadPanel: require("ui/load_panel"),
    Lookup: require("ui/lookup"),
    Map: require("ui/map"),
    Menu: require("ui/menu"),
    MultiView: require("ui/multi_view"),
    NavBar: require("ui/nav_bar"),
    NumberBox: require("ui/number_box"),
    PieChart: require("viz/pie_chart"),
    PivotGrid: require("ui/pivot_grid"),
    PivotGridFieldChooser: require("ui/pivot_grid_field_chooser"),
    PolarChart: require("viz/polar_chart"),
    Popover: require("ui/popover"),
    Popup: require("ui/popup"),
    ProgressBar: require("ui/progress_bar"),
    RangeSelector: require("viz/range_selector"),
    RangeSlider: require("ui/range_slider"),
    RadioGroup: require("ui/radio_group"),
    Resizable: require("ui/resizable"),
    ResponsiveBox: require("ui/responsive_box"),
    Sankey: require("viz/sankey"),
    Scheduler: require("ui/scheduler"),
    ScrollView: require("ui/scroll_view"),
    SelectBox: require("ui/select_box"),
    SlideOut: require("ui/slide_out"),
    SlideOutView: require("ui/slide_out_view"),
    Slider: require("ui/slider"),
    Sparkline: require("viz/sparkline"),
    Switch: require("ui/switch"),
    TabPanel: require("ui/tab_panel"),
    Tabs: require("ui/tabs"),
    TagBox: require("ui/tag_box"),
    TextArea: require("ui/text_area"),
    TextBox: require("ui/text_box"),
    TileView: require("ui/tile_view"),
    Toast: require("ui/toast"),
    Toolbar: require("ui/toolbar"),
    Tooltip: require("ui/tooltip"),
    TreeList: require("ui/tree_list"),
    TreeMap: require("viz/tree_map"),
    TreeView: require("ui/tree_view"),
    ValidationGroup: require("ui/validation_group"),
    ValidationSummary: require("ui/validation_summary"),
    VectorMap: require("viz/vector_map")
};

var DataSource = require("data/data_source");

QUnit.module("Widget creation", {
    beforeEach: function() {
        var fixture = document.getElementById("qunit-fixture");
        this.element = document.createElement("div");
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

Object.keys(widgets).forEach(function(widget) {
    QUnit.test(widget + " creating and optionChanged", function(assert) {
        this.instance = new widgets[widget](this.element);

        assert.ok(true, "it's possible to create " + widget);

        var options = this.instance.option(),
            clock = widget === "DataGrid" || widget === "TreeList" ? sinon.useFakeTimers() : null;

        if(options || Object.keys(options).length === 0) {
            assert.ok(false, "options is not defined " + widget);
        }
        for(var optionName in options) {
            var prevValue = options[optionName],
                newValue = prevValue;

            // NOTE: some widgets doesn't support dataSource === null
            if(optionName === "dataSource") {
                // NOTE: dxResponsiveBox supports only plain object in items
                var item = widget === "ResponsiveBox" ? { text: 1 } : 1;
                item = widget === "dxScheduler" ? { text: 1, startDate: new Date(2015, 0, 1) } : item;

                newValue = new DataSource([item]);
                options[optionName] = newValue;
            }

            // The most critical scenarios for the server-side rendering
            if(optionName === "visible") {
                prevValue = false;
                newValue = true;
                options[optionName] = newValue;
            }

            if(optionName === "width" || optionName === "height") {
                newValue = 555;
                options[optionName] = newValue;
            }

            this.instance.beginUpdate();
            this.instance._notifyOptionChanged(optionName, newValue, prevValue);
            this.instance.endUpdate();

            assert.ok(true, "it's possible to change option " + optionName);
        }

        if(clock) {
            clock.restore();
        }
    });
});
