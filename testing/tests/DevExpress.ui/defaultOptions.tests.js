window.includeThemesLinks();

const $ = require('jquery');
const noop = require('core/utils/common').noop;
let browser = require('core/utils/browser');
const devices = require('core/devices');
const themes = require('ui/themes');
const support = require('core/utils/support');
const publicComponentUtils = require('core/utils/public_component');

const ActionSheet = require('ui/action_sheet');
const Accordion = require('ui/accordion');
const Box = require('ui/box');
const ColorBox = require('ui/color_box');
const DataGrid = require('ui/data_grid');
const DateBox = require('ui/date_box');
const FakeDialogComponent = require('ui/dialog').FakeDialogComponent;
const DropDownEditor = require('ui/drop_down_editor/ui.drop_down_editor');
const DropDownBox = require('ui/drop_down_box');
const DropDownButton = require('ui/drop_down_button');
const DropDownList = require('ui/drop_down_editor/ui.drop_down_list');
const DropDownMenu = require('ui/drop_down_menu');
const TextEditor = require('ui/text_box/ui.text_editor');
const Gallery = require('ui/gallery');
const Lookup = require('ui/lookup');
const LoadIndicator = require('ui/load_indicator');
const LoadPanel = require('ui/load_panel');
const List = require('ui/list');
const MenuBase = require('ui/context_menu/ui.menu_base');
const Menu = require('ui/menu/ui.menu');
const ContextMenu = require('ui/context_menu/ui.context_menu');
const NumberBox = require('ui/number_box');
const NavBar = require('ui/nav_bar');
const Popup = require('ui/popup');
const Popover = require('ui/popover');
const RadioGroup = require('ui/radio_group');
const Scheduler = require('ui/scheduler/ui.scheduler');
const Scrollable = require('ui/scroll_view/ui.scrollable');
const ScrollView = require('ui/scroll_view');
const SelectBox = require('ui/select_box');
const Tabs = require('ui/tabs');
const TabPanel = require('ui/tab_panel');
const TagBox = require('ui/tag_box');
const Toast = require('ui/toast');
const TreeList = require('ui/tree_list');
const TreeView = require('ui/tree_view');
const FileUploader = require('ui/file_uploader');
const Toolbar = require('ui/toolbar');
const Form = require('ui/form');


QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="cmp"></div>');
});

QUnit.module('widgets defaults');

const testComponentDefaults = function(componentClass, forcedDevices, options, before, after) {
    const componentName = publicComponentUtils.name(componentClass);

    forcedDevices = $.isArray(forcedDevices) ? forcedDevices : [forcedDevices];
    before = before || noop;
    after = after || noop;

    QUnit.test(componentName + ' default options', function(assert) {
        const originalDevice = devices._currentDevice;
        before.call(this);

        $.each(forcedDevices, function(_, device) {
            devices._currentDevice = device;
            const component = new componentClass('#cmp');
            options = $.isFunction(options) ? options.call(component) : options;

            const defaults = component.option();
            checkOptions.apply(component, [options, defaults, JSON.stringify(device), assert]);
        });

        after.call(this);
        devices._currentDevice = originalDevice;
    });
};

const checkOptions = function(expectedOptions, resultOptions, deviceString, assert) {
    const that = this;

    $.each(expectedOptions, function(optionName, expectedValue) {
        let resultValue = resultOptions[optionName];

        resultValue = $.isFunction(resultValue) ? resultValue.call(that) : resultValue;

        if($.isPlainObject(expectedValue)) {
            checkOptions(expectedValue, resultValue, null, assert);
        } else {
            assert.equal(resultValue, expectedValue, optionName + ' is configured on device ' + deviceString);
        }
    });
};

testComponentDefaults(ActionSheet,
    [
        { platform: 'ios', tablet: true }
    ],
    { usePopover: true }
);

testComponentDefaults(NumberBox,
    {},
    { useLargeSpinButtons: false },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: 'generic', generic: true });
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
    { platform: 'android' },
    { pickerType: 'rollers' },
    function() {
        this._origDevice = devices.real();
        const deviceConfig = { platform: 'android', android: true, version: [4, 3] };
        devices.real(deviceConfig);
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateBox,
    [
        { platform: 'generic', deviceType: 'desktop' },
    ],
    { pickerType: 'calendar' },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: 'generic', deviceType: 'desktop', phone: false });
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
        { platform: 'ios' }
    ],
    { width: 276 }
);

testComponentDefaults(FakeDialogComponent,
    { platform: 'android' },
    {
        lWidth: '60%',
        pWidth: '80%'
    }
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
        stylingMode: 'underlined'
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
        showMaskMode: 'always'
    }
);

testComponentDefaults(DropDownEditor,
    [
        { platform: 'generic' }
    ],
    {
        popupPosition: {
            offset: { h: 0, v: 0 },
            my: 'left top',
            at: 'left bottom',
            collision: 'flip flip'
        }
    }
);

testComponentDefaults(DropDownBox,
    {},
    {
        openOnFieldClick: true,
        acceptCustomValue: false,
        contentTemplate: 'content',
        valueChangeEvent: 'change'
    }
);

testComponentDefaults(DropDownButton, {}, {
    dataSource: null,
    deferRendering: true,
    text: '',
    keyExpr: 'this',
    displayExpr: 'this',
    useSelectMode: false,
    wrapItemText: false,
    opened: false,
    splitButton: false,
    showArrowIcon: true,
    selectedItemKey: null,
    focusStateEnabled: true,
    hoverStateEnabled: true,
    selectedItem: null,
    icon: undefined,
    grouped: false,
    itemTemplate: 'item',
    groupTemplate: 'group',
    buttonGroupOptions: {},
    dropDownOptions: {}
});

testComponentDefaults(DropDownList,
    {},
    {
        groupTemplate: 'group',
        wrapItemText: false,
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
    { platform: 'ios' },
    {
        itemDeleteMode: 'slideItem'
    }
);

testComponentDefaults(List,
    { platform: 'android' },
    {
        itemDeleteMode: 'swipe'
    }
);

testComponentDefaults(List,
    { platform: 'generic' },
    {
        itemDeleteMode: 'static',
        wrapItemText: false
    }
);

testComponentDefaults(List,
    { platform: 'generic', deviceType: 'desktop' },
    {
        showScrollbar: 'onHover',
        pullRefreshEnabled: false,
        pageLoadMode: 'nextButton'
    },
    function() {
        this._realDevice = devices.real();
        this._supportNativeScrolling = support.nativeScrolling;
        devices.real({ platform: 'generic', deviceType: 'desktop' });
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
            devices.real({ platform: 'android', version: [4, 0] });
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

        devices.real({ deviceType: 'desktop' });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(Lookup,
    [
        { platform: 'ios', phone: true }
    ],
    { fullScreen: true }
);

testComponentDefaults(Lookup,
    [
        { platform: 'ios', tablet: true },
        { platform: 'generic', deviceType: 'desktop' }
    ],
    { usePopover: true },
    function() {
        this._realDevice = devices.real();
        devices.real({ platform: 'generic', deviceType: 'desktop' });
    },
    function() {
        devices.real(this._realDevice);
    }
);

testComponentDefaults(Lookup,
    { platform: 'generic', deviceType: 'desktop' },
    {
        pageLoadMode: 'scrollBottom'
    },
    function() {
        this._realDevice = devices.real();
        this._supportNativeScrolling = support.nativeScrolling;
        devices.real({ platform: 'generic', deviceType: 'desktop' });
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
            my: 'left top',
            at: 'left top'
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

        devices.real({ deviceType: 'desktop' });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(Popup,
    [
        { platform: 'ios' }
    ],
    {
        animation: {
            show: {
                type: 'slide',
                duration: 400,
                from: {
                    position: {
                        my: 'top',
                        at: 'bottom'
                    }
                },
                to: {
                    position: {
                        my: 'center',
                        at: 'center'
                    }
                }
            },
            hide: {
                type: 'slide',
                duration: 400,
                from: {
                    opacity: 1,
                    position: {
                        my: 'center',
                        at: 'center'
                    }
                },
                to: {
                    opacity: 1,
                    position: {
                        my: 'top',
                        at: 'bottom'
                    }
                }
            }
        }
    }
);

testComponentDefaults(Popup,
    [
        { platform: 'android' }
    ],
    function() {
        this.option('fullScreen', true);

        return {
            animation: {
                show: { type: 'slide', duration: 300, from: { top: '30%', opacity: 0 }, to: { top: 0, opacity: 1 } },
                hide: { type: 'slide', duration: 300, from: { top: 0, opacity: 1 }, to: { top: '30%', opacity: 0 } }
            }
        };
    }
);

testComponentDefaults(Popup,
    [
        { platform: 'android' }
    ],
    {
        animation: {
            show: { type: 'fade', duration: 400, from: 0, to: 1 },
            hide: { type: 'fade', duration: 400, from: 1, to: 0 }
        }
    }
);

testComponentDefaults(Popover,
    {},
    {
        position: 'bottom',
        animation: {
            show: {
                type: 'fade',
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                to: 0
            }
        }
    }
);

testComponentDefaults(RadioGroup,
    { tablet: true },
    { layout: 'horizontal' }
);

testComponentDefaults(Gallery,
    {},
    {
        loopItemFocus: false,
        selectOnFocus: true,
        selectionMode: 'single',
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
        { platform: 'generic', deviceType: 'desktop' }
    ],
    {
        scrollByThumb: true,
        scrollByContent: false,
        showScrollbar: 'onHover',
        bounceEnabled: false
    },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = false;
        this._supportTouch = support.touch;
        support.touch = false;
        this._originalRealDevice = devices.real();
        devices.real({ platform: 'generic', deviceType: 'desktop' });
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
        devices.real({ platform: 'android', version: [4] });
    },
    function() {
        support.nativeScrolling = this._supportNativeScrolling;
        devices.real(this._originalRealDevice);
    }
);

testComponentDefaults(ScrollView,
    {},
    { refreshStrategy: 'swipeDown' },
    function() {
        this._originalRealDevice = devices.real();
        devices.real({ platform: 'android' });
    },
    function() {
        devices.real(this._originalRealDevice);
    }
);

testComponentDefaults(ScrollView,
    {},
    {
        pullingDownText: '',
        pulledDownText: '',
        refreshingText: '',
        reachBottomText: ''
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
    { platform: 'android' },
    { showDropDownButton: false }
);

testComponentDefaults(Toast,
    [{ platform: 'android' }],
    {
        position: {
            at: 'bottom left',
            my: 'bottom left',
            of: null,
            offset: '20 -20'
        },
        width: 'auto'
    }
);

testComponentDefaults(Toast,
    { platform: 'android', deviceType: 'phone' },
    {
        position: {
            my: 'bottom center',
            at: 'bottom center',
            offset: '0 0'
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
    { submenuType: 'actionSheet' },
    function() {
        this.originalCurrentTheme = themes.current();
        themes.current('ios7');
    }, function() {
        themes.current(this.originalCurrentTheme);
    }
);

testComponentDefaults(TabPanel,
    { platform: 'generic' },
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
        themes.current('material');
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
        themes.current('generic');
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
        themes.current('ios7');
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
        message: ''
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
        valueChangeEvent: 'change'
    }
);

testComponentDefaults(List,
    { platform: devices.current().platform },
    {
        useInkRipple: true,
        pullingDownText: '',
        pulledDownText: '',
        refreshingText: '',
        pageLoadingText: ''
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
        dataStructure: 'tree',
        expandAllEnabled: false,
        hasItemsExpr: 'hasItems',
        expandNodesRecursive: true,
        scrollDirection: 'vertical',
        virtualModeEnabled: false,
        rootValue: 0,
        searchValue: '',
        selectionMode: 'multiple',
        showCheckBoxesMode: 'none',
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

        devices.real({ platform: 'generic', generic: true, deviceType: 'desktop' });
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
            platform: 'ios',
            deviceType: 'tablet'
        });
    },
    function() {
        devices.real(this.originalRealDevice);
    }
);

[
    { name: 'chrome', version: '65.9', mode: 'number' },
    { name: 'chrome', version: '66.0', mode: 'text' },
    { name: 'msie', version: '74.9', mode: 'number' },
    { name: 'msie', version: '75.0', mode: 'text' },
    { name: 'safari', version: '11.9', mode: 'number' },
    { name: 'safari', version: '12.0', mode: 'text' }
].forEach(function(item) {
    testComponentDefaults(NumberBox,
        { browser: item.name, version: item.version, platform: 'ios', deviceType: 'phone' },
        { mode: item.mode },
        function() {
            this.originalRealDevice = devices.real();
            this._origBrowser = browser;

            delete browser.chrome;
            delete browser.safari;
            delete browser.msie;
            browser.version = item.version;
            browser[item.name] = true;

            devices.real({ platform: 'ios', deviceType: 'phone' });
        },
        function() {
            browser = this._origBrowser;
            devices.real(this.originalRealDevice);
        }
    );

});

testComponentDefaults(FileUploader,
    { },
    { _uploadButtonType: 'default' },
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
        labelLocation: 'top',
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
        grouping: { expandMode: 'rowClick' },
        showRowLines: true
    },
    function() {
        this.originalRealDevice = devices.real();
        devices.real({
            platform: 'ios'
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
        _animationEasing: 'cubic-bezier(0.4, 0, 0.2, 1)'
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
        _appointmentTooltipButtonsPosition: 'top',
        _appointmentTooltipOpenButtonText: null,
        _dropDownButtonIcon: 'chevrondown',
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
