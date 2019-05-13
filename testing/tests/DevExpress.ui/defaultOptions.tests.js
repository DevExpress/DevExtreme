window.includeThemesLinks();

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    browser = require("core/utils/browser"),
    devices = require("core/devices"),
    themes = require("ui/themes"),
    support = require("core/utils/support"),
    publicComponentUtils = require("core/utils/public_component"),

    ActionSheet = require("ui/action_sheet"),
    Accordion = require("ui/accordion"),
    Box = require("ui/box"),
    ColorBox = require("ui/color_box"),
    DataGrid = require("ui/data_grid"),
    DateBox = require("ui/date_box"),
    DateView = require("ui/date_box/ui.date_view"),
    DateViewRoller = require("ui/date_box/ui.date_view_roller"),
    FakeDialogComponent = require("ui/dialog").FakeDialogComponent,
    DropDownEditor = require("ui/drop_down_editor/ui.drop_down_editor"),
    DropDownBox = require("ui/drop_down_box"),
    DropDownButton = require("ui/drop_down_button"),
    DropDownList = require("ui/drop_down_editor/ui.drop_down_list"),
    DropDownMenu = require("ui/drop_down_menu"),
    TextEditor = require("ui/text_box/ui.text_editor"),
    Gallery = require("ui/gallery"),
    Lookup = require("ui/lookup"),
    LoadIndicator = require("ui/load_indicator"),
    LoadPanel = require("ui/load_panel"),
    List = require("ui/list"),
    MenuBase = require("ui/context_menu/ui.menu_base"),
    Menu = require("ui/menu/ui.menu"),
    ContextMenu = require("ui/context_menu/ui.context_menu"),
    NumberBox = require("ui/number_box"),
    NavBar = require("ui/nav_bar"),
    Popup = require("ui/popup"),
    Popover = require("ui/popover"),
    RadioGroup = require("ui/radio_group"),
    Scheduler = require("ui/scheduler/ui.scheduler"),
    Scrollable = require("ui/scroll_view/ui.scrollable"),
    ScrollView = require("ui/scroll_view"),
    SelectBox = require("ui/select_box"),
    Tabs = require("ui/tabs"),
    TabPanel = require("ui/tab_panel"),
    TagBox = require("ui/tag_box"),
    Toast = require("ui/toast"),
    TreeList = require("ui/tree_list"),
    TreeView = require("ui/tree_view"),
    FileUploader = require("ui/file_uploader"),
    Toolbar = require("ui/toolbar"),
    Form = require("ui/form");


QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="cmp"></div>');
});

QUnit.module("widgets defaults");

var testComponentDefaults = function(componentClass, forcedDevices, options, before, after) {
    var componentName = publicComponentUtils.name(componentClass);

    forcedDevices = $.isArray(forcedDevices) ? forcedDevices : [forcedDevices];
    before = before || noop;
    after = after || noop;

    QUnit.test(componentName + " default options", function(assert) {
        var originalDevice = devices._currentDevice;
        before.call(this);

        $.each(forcedDevices, function(_, device) {
            devices._currentDevice = device;
            var component = new componentClass("#cmp");
            options = $.isFunction(options) ? options.call(component) : options;

            var defaults = component.option();
            checkOptions.apply(component, [options, defaults, JSON.stringify(device), assert]);
        });

        after.call(this);
        devices._currentDevice = originalDevice;
    });
};

var checkOptions = function(expectedOptions, resultOptions, deviceString, assert) {
    var that = this;

    $.each(expectedOptions, function(optionName, expectedValue) {
        var resultValue = resultOptions[optionName];

        resultValue = $.isFunction(resultValue) ? resultValue.call(that) : resultValue;

        if($.isPlainObject(expectedValue)) {
            checkOptions(expectedValue, resultValue, null, assert);
        } else {
            assert.equal(resultValue, expectedValue, optionName + " is configured on device " + deviceString);
        }
    });
};

testComponentDefaults(ActionSheet,
    [
        { platform: "ios", tablet: true }
    ],
    { usePopover: true }
);

testComponentDefaults(NumberBox,
    {},
    { useLargeSpinButtons: false },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: "generic", generic: true });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateBox,
    {},
    {
        useMaskBehavior: false,
        advanceCaret: true,
        adaptivityEnabled: false
    }
);

testComponentDefaults(DateBox,
    { platform: "android" },
    { pickerType: "rollers" },
    function() {
        this._origDevice = devices.real();
        var deviceConfig = { platform: "android", android: true, version: [4, 3] };
        devices.real(deviceConfig);
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateBox,
    { platform: "win" },
    { pickerType: "rollers" },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: "win", win: true, phone: true });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateBox,
    [
        { platform: "generic", deviceType: "desktop" },
    ],
    { pickerType: "calendar" },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: "generic", deviceType: "desktop", phone: false });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateBox,
    { platform: "win" },
    { pickerType: "calendar" },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: "win", win: true, phone: false });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateView,
    { platform: "win", version: [8] },
    { showNames: true }
);

testComponentDefaults(DateViewRoller,
    { platform: "win", version: [8] },
    {
        showOnClick: true
    }
);

testComponentDefaults(Box,
    {},
    { _layoutStrategy: 'fallback' },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: "android", android: true, version: [4, 3] });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(Box,
    {},
    { _layoutStrategy: 'fallback' },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: "ios", android: true, version: [6, 0] });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(Box,
    {},
    { _layoutStrategy: 'fallback' },
    function() {
        this._origMSIE = browser.msie;
        browser.msie = true;
    },
    function() {
        browser.msie = this._origMSIE;
    }
);

testComponentDefaults(FakeDialogComponent,
    [
        { platform: "ios" }
    ],
    { width: 276 }
);

testComponentDefaults(FakeDialogComponent,
    { platform: "android" },
    {
        lWidth: "60%",
        pWidth: "80%"
    }
);

testComponentDefaults(DropDownMenu,
    [
        { platform: "ios", version: [6, 7, 8] }
    ],
    { usePopover: true }
);

testComponentDefaults(DropDownMenu,
    {},
    {
        useInkRipple: true
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(TextEditor,
    {},
    {
        stylingMode: "underlined"
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(TextEditor,
    {},
    {
        showMaskMode: "always"
    }
);

testComponentDefaults(DropDownEditor,
    [
        { platform: "generic" }
    ],
    {
        popupPosition: {
            offset: { h: 0, v: 0 },
            my: "left top",
            at: "left bottom",
            collision: "flip flip"
        }
    }
);

testComponentDefaults(DropDownBox,
    {},
    {
        openOnFieldClick: true,
        acceptCustomValue: false,
        contentTemplate: "content",
        valueChangeEvent: "change"
    }
);

testComponentDefaults(DropDownButton, {}, {
    dataSource: null,
    deferRendering: true,
    text: "",
    keyExpr: "this",
    displayExpr: "this",
    useSelectMode: false,
    opened: false,
    splitButton: false,
    showArrowIcon: true,
    selectedItemKey: null,
    focusStateEnabled: true,
    hoverStateEnabled: true,
    selectedItem: null,
    icon: undefined,
    grouped: false,
    itemTemplate: "item",
    groupTemplate: "group",
    buttonGroupOptions: {},
    dropDownOptions: {}
});

testComponentDefaults(DropDownList,
    [
        { platform: "win", version: [8] }
    ],
    {
        popupPosition: {
            my: "left top",
            at: "left bottom",
            offset: { h: 0, v: -6 },
            collision: "flip"
        }
    }
);

testComponentDefaults(DropDownList,
    {},
    {
        groupTemplate: "group",
        grouped: false
    }
);

testComponentDefaults(List,
    {},
    { useNativeScrolling: false },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = false;
    },
    function() {
        support.nativeScrolling = this._supportNativeScrolling;
    }
);

testComponentDefaults(List,
    { platform: "ios" },
    {
        itemDeleteMode: "slideItem"
    }
);

testComponentDefaults(List,
    { platform: "android" },
    {
        itemDeleteMode: "swipe"
    }
);

testComponentDefaults(List,
    { platform: "win" },
    {
        itemDeleteMode: "context",
        menuMode: "context"
    }
);

testComponentDefaults(List,
    { platform: "win" },
    {
        bounceEnabled: false
    },
    function() {
        this._isSimulator = devices.isSimulator;
        devices.isSimulator = function() {
            return true;
        };
    },
    function() {
        devices.isSimulator = this._isSimulator;
    }
);

testComponentDefaults(List,
    { platform: "win" },
    {
        bounceEnabled: true
    },
    function() {
        this._isSimulator = devices.isSimulator;
        devices.isSimulator = function() {
            return false;
        };
    },
    function() {
        devices.isSimulator = this._isSimulator;
    }
);

testComponentDefaults(List,
    { platform: "generic" },
    {
        itemDeleteMode: "static"
    }
);

testComponentDefaults(List,
    { platform: "generic" },
    {
        showScrollbar: "onHover",
        pullRefreshEnabled: false,
        pageLoadMode: "nextButton"
    },
    function() {
        this._realDevice = devices.real();
        this._supportNativeScrolling = support.nativeScrolling;
        devices.real({ platform: "generic" });
        support.nativeScrolling = false;
    },
    function() {
        devices.real(this._realDevice);
        support.nativeScrolling = this._supportNativeScrolling;
    }
);

if(!(/chrome/i.test(navigator.userAgent))) {
    testComponentDefaults(LoadIndicator,
        {},
        { viaImage: true },
        function() {
            this._originalRealDevice = devices.real();
            devices.real({ platform: "android", version: [4, 0] });
        },
        function() {
            devices.real(this._originalRealDevice);
        }
    );
}


testComponentDefaults(Lookup,
    {},
    {
        focusStateEnabled: true
    },
    function() {
        this._origDevice = devices.real();

        devices.real({ deviceType: "desktop" });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(Lookup,
    { platform: "win", version: [8], phone: true },
    { showCancelButton: false, fullScreen: true }
);


testComponentDefaults(Lookup,
    [
        { platform: "ios", phone: true }
    ],
    { fullScreen: true }
);

testComponentDefaults(Lookup,
    [
        { platform: "ios", tablet: true },
        { platform: "generic" }
    ],
    { usePopover: true },
    function() {
        this._realDevice = devices.real();
        devices.real({ platform: "generic" });
    },
    function() {
        devices.real(this._realDevice);
    }
);

testComponentDefaults(Lookup,
    { platform: "generic" },
    {
        pageLoadMode: "scrollBottom"
    },
    function() {
        this._realDevice = devices.real();
        this._supportNativeScrolling = support.nativeScrolling;
        devices.real({ platform: "generic" });
        support.nativeScrolling = false;
    },
    function() {
        devices.real(this._realDevice);
        support.nativeScrolling = this._supportNativeScrolling;
    }
);

testComponentDefaults(Lookup,
    {},
    {
        usePopover: false,
        closeOnOutsideClick: true,
        searchEnabled: false,
        showCancelButton: false,
        showPopupTitle: false,
        position: {
            my: "left top",
            at: "left top"
        }
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);


testComponentDefaults(Popup,
    {},
    { focusStateEnabled: true },
    function() {
        this._origDevice = devices.real();

        devices.real({ deviceType: "desktop" });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(Popup,
    [
        { platform: "ios" }
    ],
    {
        animation: {
            show: {
                type: "slide",
                duration: 400,
                from: {
                    position: {
                        my: "top",
                        at: "bottom"
                    }
                },
                to: {
                    position: {
                        my: "center",
                        at: "center"
                    }
                }
            },
            hide: {
                type: "slide",
                duration: 400,
                from: {
                    opacity: 1,
                    position: {
                        my: "center",
                        at: "center"
                    }
                },
                to: {
                    opacity: 1,
                    position: {
                        my: "top",
                        at: "bottom"
                    }
                }
            }
        }
    }
);

testComponentDefaults(Popup,
    [
        { platform: "android" }
    ],
    function() {
        this.option("fullScreen", true);

        return {
            animation: {
                show: { type: "slide", duration: 300, from: { top: "30%", opacity: 0 }, to: { top: 0, opacity: 1 } },
                hide: { type: "slide", duration: 300, from: { top: 0, opacity: 1 }, to: { top: "30%", opacity: 0 } }
            }
        };
    }
);

testComponentDefaults(Popup,
    [
        { platform: "android" }
    ],
    {
        animation: {
            show: { type: "fade", duration: 400, from: 0, to: 1 },
            hide: { type: "fade", duration: 400, from: 1, to: 0 }
        }
    }
);

testComponentDefaults(Popover,
    {},
    {
        position: "bottom",
        animation: {
            show: {
                type: "fade",
                from: 0,
                to: 1
            },
            hide: {
                type: "fade",
                to: 0
            }
        }
    }
);

testComponentDefaults(RadioGroup,
    { tablet: true },
    { layout: "horizontal" }
);

testComponentDefaults(Gallery,
    {},
    {
        loopItemFocus: false,
        selectOnFocus: true,
        selectionMode: "single",
        selectionRequired: true,
        selectionByClick: false
    }
);

testComponentDefaults(Scrollable,
    {},
    {
        useNative: false,
        useSimulatedScrollbar: true
    },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = false;
    },
    function() {
        support.nativeScrolling = this._supportNativeScrolling;
    }
);

testComponentDefaults(Scrollable,
    [
        { platform: "generic" }
    ],
    {
        scrollByThumb: true,
        scrollByContent: false,
        showScrollbar: "onHover",
        bounceEnabled: false
    },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = false;
        this._supportTouch = support.touch;
        support.touch = false;
        this._originalRealDevice = devices.real();
        devices.real({ platform: "generic" });
    },
    function() {
        support.nativeScrolling = this._supportNativeScrolling;
        support.touch = this._supportTouch;
        devices.real(this._originalRealDevice);
    }
);

testComponentDefaults(Scrollable,
    {},
    { useSimulatedScrollbar: !browser.mozilla },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = true;
        this._originalRealDevice = devices.real();
        devices.real({ platform: "android", version: [4] });
    },
    function() {
        support.nativeScrolling = this._supportNativeScrolling;
        devices.real(this._originalRealDevice);
    }
);

testComponentDefaults(ScrollView,
    {},
    { refreshStrategy: "swipeDown" },
    function() {
        this._originalRealDevice = devices.real();
        devices.real({ platform: "android" });
    },
    function() {
        devices.real(this._originalRealDevice);
    }
);

testComponentDefaults(ScrollView,
    {},
    { refreshStrategy: "slideDown" },
    function() {
        this._originalRealDevice = devices.real();
        devices.real({ platform: "win" });
    },
    function() {
        devices.real(this._originalRealDevice);
    }
);

testComponentDefaults(ScrollView,
    {},
    {
        pullingDownText: "",
        pulledDownText: "",
        refreshingText: "",
        reachBottomText: ""
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(TagBox,
    { platform: "android" },
    { showDropDownButton: false }
);

testComponentDefaults(Toast,
    [{ platform: "android" }],
    {
        position: {
            at: "bottom left",
            my: "bottom left",
            of: null,
            offset: "20 -20"
        },
        width: "auto"
    }
);

testComponentDefaults(Toast,
    { platform: "android", deviceType: "phone" },
    {
        position: {
            my: "bottom center",
            at: "bottom center",
            offset: "0 0"
        }
    }
);

testComponentDefaults(Toast,
    { platform: "win", version: [8] },
    {
        position: {
            my: "top center",
            at: "top center",
            offset: "0 0"
        }
    }
);

testComponentDefaults(Toast,
    { platform: "win", version: [10] },
    {
        position: {
            at: "bottom right",
            my: "bottom right",
            of: null,
            offset: "0 -20"
        },
        width: "auto"
    }
);

testComponentDefaults(Toast,
    { platform: "win", version: [10], deviceType: "phone" },
    {
        position: {
            my: "bottom center",
            at: "bottom center",
            offset: "0 0"
        }
    }
);

testComponentDefaults(Toast,
    {},
    {
        minWidth: 344,
        maxWidth: 568,
        displayTime: 4000
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() {
            return true;
        };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(Toolbar,
    {},
    { submenuType: "actionSheet" },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("ios7");
    }, function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(TabPanel,
    { platform: "generic" },
    {
        animationEnabled: false
    }
);

testComponentDefaults(NavBar,
    {},
    {
        scrollingEnabled: false
    }
);

testComponentDefaults(LoadIndicator,
    {},
    {
        _animatingSegmentCount: 2,
        _animatingSegmentInner: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("material");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(LoadIndicator,
    {},
    {
        _animatingSegmentCount: 7,
        _animatingSegmentInner: false
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("generic");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(LoadIndicator,
    {},
    {
        _animatingSegmentCount: 11,
        _animatingSegmentInner: false
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("ios7");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(LoadPanel,
    {},
    {
        width: 60,
        height: 60,
        maxWidth: 60,
        maxHeight: 60,
        message: ""
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(LoadPanel,
    {},
    {
        focusStateEnabled: false
    }
);

testComponentDefaults(ColorBox,
    { },
    {
        valueChangeEvent: "change"
    }
);

testComponentDefaults(List,
    { platform: devices.current().platform },
    {
        useInkRipple: true,
        pullingDownText: "",
        pulledDownText: "",
        refreshingText: "",
        pageLoadingText: ""
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(TreeList,
    { platform: devices.current().platform },
    {
        showRowLines: true,
        showColumnLines: false,
        headerFilter: {
            height: 315
        },
        editing: {
            useIcons: true
        }
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(MenuBase,
    {},
    {
        keyExpr: null
    }
);

testComponentDefaults(Menu,
    {},
    {
        keyExpr: null
    }
);

testComponentDefaults(Menu,
    { platform: devices.current().platform },
    { adaptivityEnabled: false }
);

testComponentDefaults(ContextMenu,
    {},
    {
        keyExpr: null
    }
);

testComponentDefaults(TreeView,
    {},
    {
        selectNodesRecursive: true,
        dataStructure: "tree",
        expandAllEnabled: false,
        hasItemsExpr: "hasItems",
        expandNodesRecursive: true,
        scrollDirection: "vertical",
        virtualModeEnabled: false,
        rootValue: 0,
        searchValue: "",
        selectionMode: "multiple",
        showCheckBoxesMode: "none",
        selectByClick: false
    }
);

testComponentDefaults(SelectBox, {},
    {
        allowClearing: true
    }
);

testComponentDefaults(Tabs,
    { },
    {
        useInkRipple: true,
        selectOnFocus: false
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(Tabs,
    {},
    {
        showNavButtons: true,
        selectOnFocus: true
    },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: "generic", generic: true });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(Tabs,
    { platform: devices.current().platform },
    {
        showNavButtons: false,
        selectOnFocus: true
    },
    function() {
        this.originalRealDevice = devices.real();
        devices.real({
            platform: "ios"
        });
    },
    function() {
        devices.real(this.originalRealDevice);
    }
);

testComponentDefaults(NumberBox,
    { platform: devices.current().platform },
    { mode: "number" },
    function() {
        this.originalRealDevice = devices.real();
        devices.real({
            platform: "ios"
        });
    },
    function() {
        devices.real(this.originalRealDevice);
    }
);

testComponentDefaults(FileUploader,
    { },
    { _uploadButtonType: "default" },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(Form,
    {},
    {
        labelLocation: "top",
        showColonAfterLabel: false
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(DataGrid,
    {},
    {
        showRowLines: true,
        showColumnLines: false,
        editing: { useIcons: true }
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(DataGrid,
    {},
    {
        grouping: { expandMode: "rowClick" },
        showRowLines: true
    },
    function() {
        this.originalRealDevice = devices.real();
        devices.real({
            platform: "ios"
        });
    },
    function() {
        devices.real(this.originalRealDevice);
    }
);

testComponentDefaults(Accordion,
    {},
    {
        animationDuration: 200,
        _animationEasing: "cubic-bezier(0.4, 0, 0.2, 1)"
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(Scheduler,
    {},
    {
        _appointmentTooltipOffset: { x: 0, y: 11 },
        _appointmentTooltipButtonsPosition: "top",
        _appointmentTooltipOpenButtonText: null,
        _dropDownButtonIcon: "chevrondown",
        _appointmentCountPerCell: 1,
        _collectorOffset: 20,
        _appointmentOffset: 30
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);
