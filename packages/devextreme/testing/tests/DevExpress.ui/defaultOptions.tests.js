import '../../helpers/includeThemesLinks.js';

import $ from 'jquery';
import { noop } from 'core/utils/common';
import browser from 'core/utils/browser';
import devices from 'core/devices';
import themes from 'ui/themes';
import support from 'core/utils/support';
import publicComponentUtils from 'core/utils/public_component';
import { getNestedOptionValue } from 'core/options/utils';

import ActionSheet from 'ui/action_sheet';
import Accordion from 'ui/accordion';
import Avatar from '__internal/ui/chat/avatar';
import Button from 'ui/button';
import ColorBox from 'ui/color_box';
import Chat from 'ui/chat';
import ChatHeader from '__internal/ui/chat/header';
import ChatMessageBox from '__internal/ui/chat/messagebox';
import ChatMessageBubble from '__internal/ui/chat/messagebubble';
import ChatMessageGroup from '__internal/ui/chat/messagegroup';
import ChatMessageList from '__internal/ui/chat/messagelist';
import DataGrid from 'ui/data_grid';
import DateBox from 'ui/date_box';
import DateRangeBox from 'ui/date_range_box';
import DropDownEditor from 'ui/drop_down_editor/ui.drop_down_editor';
import DropDownBox from 'ui/drop_down_box';
import DropDownButton from 'ui/drop_down_button';
import DropDownList from 'ui/drop_down_editor/ui.drop_down_list';
import DropDownMenu from '__internal/ui/toolbar/internal/m_toolbar.menu';
import TextEditor from 'ui/text_box/ui.text_editor';
import Gallery from 'ui/gallery';
import Lookup from 'ui/lookup';
import LoadIndicator from 'ui/load_indicator';
import LoadPanel from 'ui/load_panel';
import List from 'ui/list';
import MenuBase from 'ui/context_menu/ui.menu_base';
import Menu from 'ui/menu';
import ContextMenu from 'ui/context_menu';
import NumberBox from 'ui/number_box';
import Widget from 'ui/widget/ui.widget';
import Overlay from 'ui/overlay/ui.overlay';
import Popup from 'ui/popup';
import Popover from 'ui/popover';
import Tooltip from 'ui/tooltip';
import RadioGroup from 'ui/radio_group';
import Resizable from 'ui/resizable';
import ResizeHandle from '__internal/ui/splitter/resize_handle';
import Scheduler from '__internal/scheduler/m_scheduler';
import Scrollable from 'ui/scroll_view/ui.scrollable';
import ScrollView from 'ui/scroll_view';
import SelectBox from 'ui/select_box';
import SliderHandle from '__internal/ui/slider/m_slider_handle';
import Splitter from 'ui/splitter';
import Tabs from 'ui/tabs';
import TabPanel from 'ui/tab_panel';
import TagBox from 'ui/tag_box';
import Toast from 'ui/toast';
import TreeList from 'ui/tree_list';
import TreeView from 'ui/tree_view';
import TileView from 'ui/tile_view';
import FileUploader from 'ui/file_uploader';
import Form from 'ui/form';
import ValidationMessage from 'ui/validation_message';


const DEFAULT_MARGIN = 20;

themes.setDefaultTimeout(0);

QUnit.testStart(function() {
    $('#qunit-fixture').html('<div id="cmp"></div>');
    return new Promise((resolve) => themes.initialized(resolve));
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
            if(componentClass.IS_RENOVATED_WIDGET) {
                componentClass.defaultOptions({});
            }
            const $container = $('#cmp');
            const component = new componentClass($container);
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
        let resultValue = getNestedOptionValue(resultOptions, optionName);

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

testComponentDefaults(Button, {},
    {
        useInkRipple: true
    },
    function() {
        this._originalIsMaterial = themes.isMaterial;
        themes.isMaterial = () => true;
    },
    function() {
        themes.isMaterial = this._originalIsMaterial;
    }
);

testComponentDefaults(Button, {},
    {
        focusStateEnabled: true
    },
    function() {
        this._originalRealDevice = devices.real();
        this._originalIsSimulator = devices.isSimulator;

        devices.real({ deviceType: 'desktop' });
        devices.isSimulator = () => false;
    },
    function() {
        devices.real(this._originalRealDevice);
        devices.isSimulator = this._originalIsSimulator;
    }
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
        adaptivityEnabled: false
    }
);

testComponentDefaults(DateRangeBox,
    {},
    {
        activeStateEnabled: true,
        applyValueMode: 'instantly',
        deferRendering: true,
        disabled: false,
        endDateInputAttr: {},
        endDateLabel: 'End Date',
        endDateName: '',
        endDatePlaceholder: '',
        endDateText: '',
        focusStateEnabled: true,
        hoverStateEnabled: true,
        labelMode: 'static',
        onChange: null,
        onClosed: null,
        onCopy: null,
        onCut: null,
        onEnterKey: null,
        onInput: null,
        onKeyDown: null,
        onKeyUp: null,
        onOpened: null,
        onPaste: null,
        onValueChanged: null,
        openOnFieldClick: true,
        readOnly: false,
        startDateInputAttr: {},
        startDateLabel: 'Start Date',
        startDateName: '',
        startDatePlaceholder: '',
        startDateText: '',
        stylingMode: 'outlined',
        tabIndex: 0,
    }
);

testComponentDefaults(DateRangeBox,
    {},
    {
        labelMode: 'outside',
    },
    function() {
        this.origIsFluent = themes.isFluent;
        themes.isFluent = function() { return true; };
    },
    function() {
        themes.isFluent = this.origIsFluent;
    }
);

testComponentDefaults(DateRangeBox,
    {},
    {
        labelMode: 'floating',
        stylingMode: 'filled',
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(DateRangeBox,
    { platform: 'android' },
    {
        multiView: false
    },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: 'android' });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateRangeBox,
    { platform: 'ios' },
    {
        multiView: false
    },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: 'ios' });
    },
    function() {
        devices.real(this._origDevice);
    }
);

testComponentDefaults(DateRangeBox,
    { platform: 'generic', deviceType: 'desktop' },
    {
        multiView: true,
    },
    function() {
        this._origDevice = devices.real();

        devices.real({ platform: 'generic', deviceType: 'desktop', phone: false });
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

testComponentDefaults(ValidationMessage,
    {}, {
        integrationOptions: {},
        templatesRenderAsynchronously: false,
        shading: false,
        width: 'auto',
        height: 'auto',
        hideOnOutsideClick: false,
        hideOnParentScroll: false,
        animation: null,
        visible: true,
        propagateOutsideClick: true,
        preventScrollEvents: false,
        _checkParentVisibility: false,
        rtlEnabled: false,
        contentTemplate: ValidationMessage._renderInnerHtml,
        maxWidth: '100%',

        mode: 'auto',
        validationErrors: undefined,
        positionSide: 'top',
        boundary: undefined,
        offset: { h: 0, v: 0 }
    }
);

testComponentDefaults(DropDownMenu,
    {},
    {
        useInkRipple: true
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(TextEditor,
    {},
    {
        labelMode: 'outside',
    },
    function() {
        this.origIsFluent = themes.isFluent;
        themes.isFluent = function() { return true; };
    },
    function() {
        themes.isFluent = this.origIsFluent;
    }
);

testComponentDefaults(TextEditor,
    {},
    {
        labelMode: 'floating',
        stylingMode: 'filled',
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
        stylingMode: 'outlined',
    },
    function() {
        this.origIsFluent = themes.isFluent;
        themes.isFluent = function() { return true; };
    },
    function() {
        themes.isFluent = this.origIsFluent;
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
    type: 'normal',
    keyExpr: 'this',
    displayExpr: undefined,
    useSelectMode: false,
    wrapItemText: false,
    useItemTextAsTitle: true,
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
        useItemTextAsTitle: false,
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

testComponentDefaults(TreeView,
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

testComponentDefaults(TileView,
    {},
    { showScrollbar: 'onScroll' },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        support.nativeScrolling = true;
    },
    function() {
        support.nativeScrolling = this._supportNativeScrolling;
    }
);

testComponentDefaults(TileView,
    {},
    { showScrollbar: 'never' },
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
    {},
    {
        selectByClick: true,
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
    {
        'dropDownOptions.fullScreen': true
    }
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
        'dropDownOptions.hideOnOutsideClick': true,
        searchEnabled: false,
        showCancelButton: false,
        'dropDownOptions.showTitle': false,
        dropDownCentered: true
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

testComponentDefaults(Popup,
    {},
    {
        preventScrollEvents: false,
        enableBodyScroll: true,
        showCloseButton: true,
    }
);

testComponentDefaults(Popup,
    {},
    {
        useDefaultToolbarButtons: true,
        showCloseButton: false,
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
    {
        useFlatToolbarButtons: true,
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(Overlay,
    {},
    {
        preventScrollEvents: true,
    }
);

testComponentDefaults(Widget,
    {},
    {
        useResizeObserver: false
    },
    function() {
        this.originalRealDevice = devices.real();
        devices.real({
            platform: 'ios',
            version: '13.3'
        });
    },
    function() {
        devices.real(this.originalRealDevice);
    }
);

testComponentDefaults(Popover,
    {},
    {
        preventScrollEvents: false,
        enableBodyScroll: true,
        position: {
            at: 'bottom center',
            collision: 'fit flip',
            my: 'top center'
        },
        target: undefined,
        animation: {
            show: {
                type: 'fade',
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                from: 1,
                to: 0
            }
        }
    }
);

testComponentDefaults(Tooltip,
    {},
    {
        preventScrollEvents: false,
        enableBodyScroll: true,
    }
);

testComponentDefaults(RadioGroup,
    { tablet: true },
    { layout: 'horizontal' }
);

testComponentDefaults(Resizable,
    { },
    { keepAspectRatio: true }
);

testComponentDefaults(ResizeHandle,
    {},
    {
        direction: 'horizontal',
        focusStateEnabled: true,
        hoverStateEnabled: true,
        activeStateEnabled: true,
        onResize: null,
        onResizeStart: null,
        onResizeEnd: null,
    }
);

testComponentDefaults(Gallery,
    {},
    {
        loopItemFocus: false,
        selectOnFocus: true,
        selectionMode: 'single',
        selectionRequired: true,
        selectByClick: false
    }
);

testComponentDefaults(Scrollable,
    {},
    {
        useNative: false,
        // NOTE: useSimulatedScrollbar setting value doesn't affect on simulated strategy
        useSimulatedScrollbar: Scrollable.IS_RENOVATED_WIDGET ? false : true
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

testComponentDefaults(Scrollable,
    {},
    {
        useNative: false,
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
    {},
    {
        useNative: true,
        useSimulatedScrollbar: false
    },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        this._originalRealDevice = devices.real();
        devices.real({ platform: 'generic' });
        support.nativeScrolling = true;
    },
    function() {
        devices.real(this._originalRealDevice);
        support.nativeScrolling = this._supportNativeScrolling;
    }
);


testComponentDefaults(Scrollable,
    {},
    {
        useNative: true,
        useSimulatedScrollbar: !browser.mozilla
    },
    function() {
        this._supportNativeScrolling = support.nativeScrolling;
        this._originalRealDevice = devices.real();
        devices.real({ platform: 'android' });
        support.nativeScrolling = true;
    },
    function() {
        devices.real(this._originalRealDevice);
        support.nativeScrolling = this._supportNativeScrolling;
    }
);

if(!Scrollable.IS_RENOVATED_WIDGET) {
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
}

testComponentDefaults(ScrollView,
    {},
    {
        pullingDownText: '',
        pulledDownText: '',
        refreshingText: '',
        reachBottomText: ''
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(TagBox,
    { platform: 'android' },
    { showDropDownButton: false }
);

testComponentDefaults(Toast,
    [{ platform: 'generic', deviceType: 'desktop' }],
    {
        animation: {
            show: {
                type: 'fade',
                duration: 400,
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                duration: 400,
                from: 1,
                to: 0
            },
        }
    }
);

testComponentDefaults(Toast,
    [{ platform: 'android', deviceType: 'phone' }],
    {
        position: {
            at: 'bottom center',
            my: 'bottom center',
            offset: '0 -20'
        },
        width: `calc(100vw - ${DEFAULT_MARGIN * 2}px)`,
        hideOnOutsideClick: true,
        animation: {
            show: {
                type: 'fade',
                duration: 200,
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                duration: 200,
                from: 1,
                to: 0
            }
        },
    },
);

testComponentDefaults(Toast,
    [{ platform: 'android', deviceType: 'tablet' }],
    {
        position: {
            at: 'bottom center',
            my: 'bottom center',
            offset: '0 -20'
        },
        width: 'auto',
        maxWidth: '80vw',
        hideOnOutsideClick: true,
        animation: {
            show: {
                type: 'fade',
                duration: 200,
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                duration: 200,
                from: 1,
                to: 0
            }
        },
    },
);

testComponentDefaults(Toast,
    [{ platform: 'ios', deviceType: 'phone' }],
    {
        position: {
            at: 'bottom center',
            my: 'bottom center',
            offset: '0 -20'
        },
        width: `calc(100vw - ${DEFAULT_MARGIN * 2}px)`,
        hideOnOutsideClick: true,
        animation: {
            show: {
                type: 'fade',
                duration: 200,
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                duration: 200,
                from: 1,
                to: 0
            }
        },
    },
);

testComponentDefaults(Toast,
    [{ platform: 'ios', deviceType: 'tablet' }],
    {
        position: {
            at: 'bottom center',
            my: 'bottom center',
            offset: '0 -20'
        },
        width: 'auto',
        maxWidth: '80vw',
        hideOnOutsideClick: true,
        animation: {
            show: {
                type: 'fade',
                duration: 200,
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                duration: 200,
                from: 1,
                to: 0
            }
        },
    },
);

testComponentDefaults(Toast,
    [{ deviceType: 'phone' }],
    {
        position: {
            at: 'bottom center',
            my: 'bottom center',
            offset: '0 -20'
        },
        width: `calc(100vw - ${DEFAULT_MARGIN * 2}px)`,
        displayTime: 4000,
        hideOnOutsideClick: true,
        animation: {
            show: {
                type: 'fade',
                duration: 200,
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                duration: 200,
                from: 1,
                to: 0
            }
        },
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() {
            return true;
        };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(Toast,
    [{ deviceType: 'tablet' }],
    {
        position: {
            at: 'bottom center',
            my: 'bottom center',
            offset: '0 -20'
        },
        width: 'auto',
        maxWidth: '80vw',
        hideOnOutsideClick: true,
        displayTime: 4000,
        animation: {
            show: {
                type: 'fade',
                duration: 200,
                from: 0,
                to: 1
            },
            hide: {
                type: 'fade',
                duration: 200,
                from: 1,
                to: 0
            }
        },
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = () => true;
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(Toast,
    [{ deviceType: 'desktop' }],
    {
        minWidth: 344,
        maxWidth: 568,
        displayTime: 4000,
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() {
            return true;
        };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(TabPanel,
    { platform: 'generic' },
    {
        animationEnabled: false
    }
);

testComponentDefaults(TabPanel,
    { },
    {
        iconPosition: 'top',
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(TabPanel,
    { },
    {
        stylingMode: 'secondary',
    },
    function() {
        this.origIsFluent = themes.isFluent;
        themes.isFluent = function() { return true; };
    },
    function() {
        themes.isFluent = this.origIsFluent;
    }
);

testComponentDefaults(LoadIndicator,
    {},
    {
        _animatingSegmentCount: 7,
        _animatingSegmentInner: false
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        this.origIsGeneric = themes.isGeneric;
        themes.isMaterialBased = function() { return false; };
        themes.isGeneric = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
        themes.isGeneric = this.origIsGeneric;
    }
);

testComponentDefaults(LoadIndicator,
    {},
    {
        _animatingSegmentCount: 2,
        _animatingSegmentInner: true
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        this.origIsGeneric = themes.isGeneric;
        themes.isMaterialBased = function() { return true; };
        themes.isGeneric = function() { return false; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
        themes.isGeneric = this.origIsGeneric;
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
        width: 'auto',
        height: 'auto'
    },
    function() {
        this.origIsFluent = themes.isFluent;
        themes.isFluent = function() { return true; };
    },
    function() {
        themes.isFluent = this.origIsFluent;
    }
);

testComponentDefaults(LoadPanel,
    {},
    {
        focusStateEnabled: false,
        propagateOutsideClick: true,
        preventScrollEvents: false,
    }
);

testComponentDefaults(ColorBox,
    { },
    {
        valueChangeEvent: 'change'
    }
);

testComponentDefaults(Chat,
    {},
    {
        activeStateEnabled: true,
        focusStateEnabled: true,
        hoverStateEnabled: true,
        title: '',
        onMessageSend: undefined,
        dataSource: undefined,
    }
);

testComponentDefaults(Avatar,
    {},
    {
        name: '',
        url: '',
    }
);

testComponentDefaults(ChatHeader,
    {},
    {
        title: '',
    }
);

testComponentDefaults(ChatMessageBox,
    {},
    {
        onMessageSend: undefined,
        activeStateEnabled: true,
        focusStateEnabled: true,
        hoverStateEnabled: true,
    }
);

testComponentDefaults(ChatMessageBubble,
    {},
    {
        text: '',
    }
);

testComponentDefaults(ChatMessageGroup,
    {},
    {
        alignment: 'start',
    }
);

testComponentDefaults(ChatMessageList,
    {},
    {
        currentUserId: '',
    }
);

testComponentDefaults(List,
    { platform: devices.current().platform },
    {
        useInkRipple: true,
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);

testComponentDefaults(List,
    { platform: devices.current().platform },
    {
        pullingDownText: '',
        pulledDownText: '',
        refreshingText: '',
        pageLoadingText: ''
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
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
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
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

testComponentDefaults(SliderHandle, {},
    {
        hoverStateEnabled: false,
        value: 0,
        tooltip: {
            enabled: false,
            position: 'top',
            showMode: 'onHover'
        }
    }
);

testComponentDefaults(Splitter,
    {},
    {
        orientation: 'horizontal',
        activeStateEnabled: false,
        focusStateEnabled: false,
        repaintChangesOnly: false,
        onResize: null,
        onResizeStart: null,
        onResizeEnd: null,
        allowKeyboardNavigation: true,
    }
);

testComponentDefaults(Tabs,
    { },
    {
        useInkRipple: true,
        selectOnFocus: false,
        iconPosition: 'top',
        stylingMode: 'primary',
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
    { },
    {
        iconPosition: 'top',
        stylingMode: 'secondary',
    },
    function() {
        this.origIsFluent = themes.isFluent;
        themes.isFluent = function() { return true; };
    },
    function() {
        themes.isFluent = this.origIsFluent;
    }
);

testComponentDefaults(Tabs,
    {},
    {
        showNavButtons: true,
        selectOnFocus: true,
        iconPosition: 'start'
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
    { name: 'safari', version: '11.9', mode: 'number' },
    { name: 'safari', version: '12.0', mode: 'text' }
].forEach(function(item) {
    testComponentDefaults(NumberBox,
        { browser: item.name, version: item.version, platform: 'ios', deviceType: 'phone' },
        { mode: item.mode },
        function() {
            this.originalRealDevice = devices.real();
            this._origBrowserSettings = {
                chrome: browser.chrome,
                safari: browser.safari,
                version: item.version,
                [item.name]: browser[item.name]
            };

            delete browser.chrome;
            delete browser.safari;
            browser.version = item.version;
            browser[item.name] = true;

            devices.real({ platform: 'ios', deviceType: 'phone' });
        },
        function() {
            browser.chrome = this._origBrowserSettings.chrome;
            browser.safari = this._origBrowserSettings.safari;
            browser.version = this._origBrowserSettings.version;
            browser[item.name] = this._origBrowserSettings[item.name];

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
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(Form,
    {},
    {
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
        editing: { useIcons: true },
        headerFilter: {
            height: 315
        },
        selection: {
            showCheckBoxesMode: 'always'
        }
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
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
            platform: 'ios',
            deviceType: 'tablet'
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
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(Scheduler,
    {},
    {
        useDropDownViewSwitcher: true,
        _appointmentTooltipButtonsPosition: 'top',
        _appointmentTooltipOpenButtonText: null,
        _appointmentCountPerCell: 1,
        _collectorOffset: 20,
        _appointmentOffset: 30
    },
    function() {
        this.origIsMaterialBased = themes.isMaterialBased;
        themes.isMaterialBased = function() { return true; };
    },
    function() {
        themes.isMaterialBased = this.origIsMaterialBased;
    }
);

testComponentDefaults(Scheduler,
    {},
    {
        _appointmentTooltipOffset: { x: 0, y: 11 }
    },
    function() {
        this.origIsMaterial = themes.isMaterial;
        themes.isMaterial = function() { return true; };
    },
    function() {
        themes.isMaterial = this.origIsMaterial;
    }
);
