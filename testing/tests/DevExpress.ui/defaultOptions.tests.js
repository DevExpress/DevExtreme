"use strict";

window.includeThemesLinks();

var $ = require("jquery"),
    browser = require("core/utils/browser"),
    devices = require("core/devices"),
    themes = require("ui/themes"),
    support = require("core/utils/support"),
    publicComponentUtils = require("core/utils/public_component"),

    ActionSheet = require("ui/action_sheet"),
    Autocomplete = require("ui/autocomplete"),
    Box = require("ui/box"),
    Button = require("ui/button"),
    CheckBox = require("ui/check_box"),
    ColorBox = require("ui/color_box"),
    DateBox = require("ui/date_box"),
    DateView = require("ui/date_box/ui.date_view"),
    DateViewRoller = require("ui/date_box/ui.date_view_roller"),
    FakeDialogComponent = require("ui/dialog").FakeDialogComponent,
    DropDownEditor = require("ui/drop_down_editor/ui.drop_down_editor"),
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
    RadioButton = require("ui/radio_group/radio_button"),
    RadioGroup = require("ui/radio_group"),
    Scrollable = require("ui/scroll_view/ui.scrollable"),
    ScrollView = require("ui/scroll_view"),
    SelectBox = require("ui/select_box"),
    Slider = require("ui/slider"),
    Swipeable = require("events/gesture/swipeable"), // jshint ignore:line
    Switch = require("ui/switch"),
    Tabs = require("ui/tabs"),
    TabPanel = require("ui/tab_panel"),
    TagBox = require("ui/tag_box"),
    Toast = require("ui/toast"),
    TreeView = require("ui/tree_view"),
    FileUploader = require("ui/file_uploader"),
    Toolbar = require("ui/toolbar");


QUnit.testStart(function() {
    $("#qunit-fixture").html('<div id="cmp"></div>');
});

QUnit.module("widgets defaults");

var testComponentDefaults = function(componentClass, forcedDevices, options, before, after) {
    var componentName = publicComponentUtils.name(componentClass);

    forcedDevices = $.isArray(forcedDevices) ? forcedDevices : [forcedDevices];
    before = before || $.noop;
    after = after || $.noop;

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
    { useTouchSpinButtons: false },
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
    { adaptivityEnabled: false }
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
    { pickerType: "calendar" }
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
    { phone: true },
    {
        position: {
            my: "top center",
            at: "top center",
            offset: "0 0"
        }
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("win8");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
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

testComponentDefaults(TextEditor,
    {},
    {
        validationMessageOffset: {
            h: 0,
            v: -8
        }
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
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

testComponentDefaults(DropDownEditor,
    [
        { platform: "win", version: [10, 0] }
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
    { platform: "generic" },
    {
        popupWidthExtension: 32
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(Autocomplete,
    {},
    {
        popupPosition: {
            offset: {
                h: -16,
                v: -8
            }
        }
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(SelectBox,
    {},
    {
        _isAdaptablePopupPosition: true,
        popupPosition: {
            at: "left top",
            offset: { h: 0, v: 0 }
        }
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("win8");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(SelectBox,
    {},
    {
        activeStateEnabled: true,
        _isAdaptablePopupPosition: true,
        popupPosition: {
            offset: {
                h: -16,
                v: -8
            }
        }
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
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
    { phone: true },
    {
        position: {
            my: "top center",
            at: "top center",
            offset: "0 0"
        }
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("win8");
    },
    function() {
        themes.current(this.originalCurrentTheme);
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
    { useSimulatedScrollbar: true },
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

testComponentDefaults(TagBox,
    { platform: "android" },
    { showDropButton: false }
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

testComponentDefaults(Toolbar,
    {},
    { submenuType: "listBottom" },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("win8");
    }, function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(Toolbar,
    {},
    { submenuType: "listTop" },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("win10");
    }, function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(Toolbar,
    {},
    { submenuType: "dropDownMenu" },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
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
        themes.current("android5");
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

testComponentDefaults(LoadIndicator,
    {},
    {
        _animatingSegmentCount: 5,
        _animatingSegmentInner: false
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("win8");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(LoadIndicator,
    {},
    {
        _animatingSegmentCount: 5,
        _animatingSegmentInner: false
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("win10");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(LoadPanel,
    {},
    {
        focusStateEnabled: false
    }
);

testComponentDefaults(Button,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(CheckBox,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
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
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(Lookup,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(MenuBase,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
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

testComponentDefaults(RadioButton,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(RadioGroup,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(SelectBox,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(SelectBox, {},
    {
        allowClearing: true
    }
);

testComponentDefaults(Slider,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(Switch,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(Tabs,
    { platform: devices.current().platform },
    {
        useInkRipple: true
    },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current("android5");
    },
    function() {
        themes.current(this.originalCurrentTheme);
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
    { uploadMode: "useForm", useNativeInputClick: true },
    function() {
        this._origMSIE = browser.msie;
        this._origMSIEVersion = browser.version;
        browser.msie = true;
        browser.version = 10;
    },
    function() {
        browser.msie = this._origMSIE;
        browser.version = this._origMSIEVersion;
    }
);
