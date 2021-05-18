/* eslint-disable spellcheck/spell-checker */
const modulesExportsList = {
    animationExportsList: {
        requestAnimationFrame: require('animation/frame').requestAnimationFrame,
        cancelAnimationFrame: require('animation/frame').cancelAnimationFrame,
        fx: require('animation/fx'),
        animationPresets: require('animation/presets'),
        TransitionExecutor: require('animation/transition_executor')
    },

    coreExportsList: {
        config: require('core/config'),
        devices: require('core/devices'),
        Guid: require('core/guid'),
        setTemplateEngine: require('core/set_template_engine')
    },

    dataExportsList: {
        applyChanges: require('data/apply_changes'),
        ArrayStore: require('data/array_store'),
        CustomStore: require('data/custom_store'),
        DataSource: require('data/data_source'),
        EndpointSelecror: require('data/endpoint_selector'),
        errorHandler: require('data/errors').errorHandler,
        LocalStore: require('data/local_store'),
        ODataContext: require('data/odata/context'),
        ODataStore: require('data/odata/store'),
        EdmLiteral: require('data/odata/utils').EdmLiteral,
        keyConverters: require('data/odata/utils').keyConverters,
        Query: require('data/query'),
        base64_encode: require('data/utils').base64_encode
    },

    eventsExportsList: {
        off: require('events').off,
        on: require('events').on,
        one: require('events').one,
        trigger: require('events').trigger,
        click: require('events/click'),
        contextmenu: require('events/contextmenu'),
        dblclick: require('events/dblclick'),
        drag: require('events/drag'),
        hold: require('events/hold'),
        hover: require('events/hover'),
        pointer: require('events/pointer'),
        // remove: require('events/remove'),         documentation needs to be adjusted
        swipe: require('events/swipe'),
        transform: require('events/transform')
    },

    excelExporter: {
        exportDataGrid: require('excel_exporter').exportDataGrid,
        exportPivotGrid: require('excel_exporter').exportPivotGrid
    },

    fileManagementExportsList: {
        CustomFileSystemProvider: require('file_management/custom_provider'),
        FileSystemItem: require('file_management/file_system_item'),
        ObjectFileSystemProvider: require('file_management/object_provider'),
        RemoteFileSystemProvider: require('file_management/remote_provider'),
        // UploadInfo: require('file_management/upload_info'),         documentation needs to be adjusted
    },

    integrationExportsList: {
        angular: require('integration/angular'),
        jquery: require('integration/jquery'),
        knockout: require('integration/knockout')
    },

    localizationGlobalizeExportsList: {
        currency: require('localization/globalize/currency'),
        date: require('localization/globalize/date'),
        message: require('localization/globalize/message'),
        number: require('localization/globalize/number')
    },

    mobileExportsList: {
        hideTopOverlay: require('mobile/hide_top_overlay'),
        initMobileViewport: require('mobile/init_mobile_viewport')
    },

    pdfExporter: {
        exportDataGrid: require('pdf_exporter').exportDataGrid
    },

    timeZoneUtils: {
        getTimeZones: require('time_zone_utils').getTimeZones
    },

    widgetsList: {
        Accordion: require('ui/accordion'),
        ActionSheet: require('ui/action_sheet'),
        Autocomplete: require('ui/autocomplete'),
        BarGauge: require('viz/bar_gauge'),
        Box: require('ui/box'),
        Bullet: require('viz/bullet'),
        Button: require('ui/button'),
        Calendar: require('ui/calendar'),
        Chart: require('viz/chart'),
        CheckBox: require('ui/check_box'),
        CircularGauge: require('viz/circular_gauge'),
        ColorBox: require('ui/color_box'),
        ContextMenu: require('ui/context_menu'),
        DataGrid: require('ui/data_grid'),
        DateBox: require('ui/date_box'),
        DeferRendering: require('ui/defer_rendering'),
        Drawer: require('ui/drawer'),
        DropDownBox: require('ui/drop_down_box'),
        FileManager: require('ui/file_manager'),
        FileUploader: require('ui/file_uploader'),
        FilterBuilder: require('ui/filter_builder'),
        Form: require('ui/form'),
        Funnel: require('viz/funnel'),
        Gallery: require('ui/gallery'),
        Gantt: require('ui/gantt'),
        HtmlEditor: require('ui/html_editor'),
        LinearGauge: require('viz/linear_gauge'),
        List: require('ui/list'),
        LoadIndicator: require('ui/load_indicator'),
        LoadPanel: require('ui/load_panel'),
        Lookup: require('ui/lookup'),
        Map: require('ui/map'),
        Menu: require('ui/menu'),
        MultiView: require('ui/multi_view'),
        NavBar: require('ui/nav_bar'),
        NumberBox: require('ui/number_box'),
        PieChart: require('viz/pie_chart'),
        PivotGrid: require('ui/pivot_grid'),
        PivotGridFieldChooser: require('ui/pivot_grid_field_chooser'),
        PolarChart: require('viz/polar_chart'),
        Popover: require('ui/popover'),
        Popup: require('ui/popup'),
        ProgressBar: require('ui/progress_bar'),
        RangeSelector: require('viz/range_selector'),
        RangeSlider: require('ui/range_slider'),
        RadioGroup: require('ui/radio_group'),
        Resizable: require('ui/resizable'),
        ResponsiveBox: require('ui/responsive_box'),
        Sankey: require('viz/sankey'),
        Scheduler: require('ui/scheduler'),
        ScrollView: require('ui/scroll_view'),
        SelectBox: require('ui/select_box'),
        SlideOut: require('ui/slide_out'),
        SlideOutView: require('ui/slide_out_view'),
        Slider: require('ui/slider'),
        Sparkline: require('viz/sparkline'),
        Switch: require('ui/switch'),
        TabPanel: require('ui/tab_panel'),
        Tabs: require('ui/tabs'),
        TagBox: require('ui/tag_box'),
        TextArea: require('ui/text_area'),
        TextBox: require('ui/text_box'),
        TileView: require('ui/tile_view'),
        Toast: require('ui/toast'),
        Toolbar: require('ui/toolbar'),
        Tooltip: require('ui/tooltip'),
        TreeList: require('ui/tree_list'),
        TreeMap: require('viz/tree_map'),
        TreeView: require('ui/tree_view'),
        ValidationGroup: require('ui/validation_group'),
        ValidationSummary: require('ui/validation_summary'),
        VectorMap: require('viz/vector_map')
    },

    dropDownEditorsList: {
        dxAutocomplete: require('ui/autocomplete'),
        dxColorBox: require('ui/color_box'),
        dxDateBox: require('ui/date_box'),
        dxDropDownBox: require('ui/drop_down_box'),
        dxDropDownButton: require('ui/drop_down_button'),
        dxSelectBox: require('ui/select_box'),
        dxTagBox: require('ui/tag_box'),
        dxDropDownEditor: require('ui/drop_down_editor/ui.drop_down_editor'),
        dxDropDownList: require('ui/drop_down_editor/ui.drop_down_list'),
    },

    utilsExportsList: {
        compileGetter: require('utils').compileGetter,
        compileSetter: require('utils').compileSetter
    },

    vizExportsList: {
        BarGauge: require('viz/bar_gauge'),
        Bullet: require('viz/bullet'),
        Chart: require('viz/chart'),
        CircularGauge: require('viz/circular_gauge'),
        exportFromMarkup: require('viz/export').exportFromMarkup,
        getMarkup: require('viz/export').getMarkup,
        exportWidgets: require('viz/export').exportWidgets,
        Funnel: require('viz/funnel'),
        LinearGauge: require('viz/linear_gauge'),
        currentPalette: require('viz/palette').currentPalette,
        getPallete: require('viz/palette').getPalette,
        registerPallete: require('viz/palette').registerPalette,
        PieChart: require('viz/pie_chart'),
        PolarChart: require('viz/polar_chart'),
        RangeSelector: require('viz/range_selector'),
        Sankey: require('viz/sankey'),
        Sparkline: require('viz/sparkline'),
        currentTheme: require('viz/themes').currentTheme,
        refreshTheme: require('viz/themes').refreshTheme,
        registerTheme: require('viz/themes').registerTheme,
        TreeMap: require('viz/tree_map'),
        refreshPaths: require('viz/utils').refreshPaths,
        VectorMap: require('viz/vector_map'),
        add: require('viz/vector_map/projection').add
    }
};

exports.modulesExportsList = modulesExportsList;
