import $ from '../core/renderer';
import { touch } from '../core/utils/support';
import { extend } from '../core/utils/extend';
import devices from '../core/devices';
import domAdapter from '../core/dom_adapter';
import registerComponent from '../core/component_registrator';
import MultiView from './multi_view';
import Tabs from './tabs';
import { default as TabPanelItem } from './tab_panel/item';
import { getImageContainer } from '../core/utils/icon';
import { getPublicElement } from '../core/element';
import { isPlainObject, isDefined } from '../core/utils/type';
import { BindableTemplate } from '../core/templates/bindable_template';

// STYLE tabPanel

const TABPANEL_CLASS = 'dx-tabpanel';
const TABPANEL_TABS_CLASS = 'dx-tabpanel-tabs';
const TABPANEL_TABS_ITEM_CLASS = 'dx-tabpanel-tab';
const TABPANEL_CONTAINER_CLASS = 'dx-tabpanel-container';
const TABS_ITEM_TEXT_CLASS = 'dx-tab-text';
const DISABLED_FOCUSED_TAB_CLASS = 'dx-disabled-focused-tab';

const TABPANEL_TABS_POSITION_CLASS = {
    top: 'dx-tabpanel-tabs-position-top',
    right: 'dx-tabpanel-tabs-position-right',
    bottom: 'dx-tabpanel-tabs-position-bottom',
    left: 'dx-tabpanel-tabs-position-left',
};

const TABS_POSITION = {
    top: 'top',
    right: 'right',
    bottom: 'bottom',
    left: 'left',
};

const TABS_ORIENTATION = {
    horizontal: 'horizontal',
    vertical: 'vertical',
};

const TabPanel = MultiView.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {


            itemTitleTemplate: 'title',

            hoverStateEnabled: true,

            showNavButtons: false,

            scrollByContent: true,

            scrollingEnabled: true,

            tabsPosition: TABS_POSITION.top,

            onTitleClick: null,

            onTitleHold: null,

            onTitleRendered: null,

            badgeExpr: function(data) { return data ? data.badge : undefined; }

            /**
            * @name dxTabPanelItem.visible
            * @hidden
            */
        });
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: function() {
                    return devices.real().deviceType === 'desktop' && !devices.isSimulator();
                },
                options: {
                    focusStateEnabled: true
                }
            },
            {
                device: function() {
                    return !touch;
                },
                options: {
                    swipeEnabled: false
                }
            },
            {
                device: { platform: 'generic' },
                options: {
                    animationEnabled: false
                }
            }
        ]);
    },

    _init: function() {
        this.callBase();

        this.$element().addClass(TABPANEL_CLASS);
        this._toggleTabPanelTabsPositionClass();

        this.setAria('role', 'tabpanel');
    },

    _initMarkup: function() {
        this.callBase();

        this._createTitleActions();
        this._renderLayout();
    },

    _initTemplates: function() {
        this.callBase();
        this._templateManager.addDefaultTemplates({
            title: new BindableTemplate(function($container, data) {
                if(isPlainObject(data)) {
                    const $iconElement = getImageContainer(data.icon);
                    if($iconElement) {
                        $container.append($iconElement);
                    }

                    if(isDefined(data.title) && !isPlainObject(data.title)) {
                        $container.append(domAdapter.createTextNode(data.title));
                    }
                } else {
                    if(isDefined(data)) {
                        $container.text(String(data));
                    }
                }

                $container.wrapInner($('<span>').addClass(TABS_ITEM_TEXT_CLASS));
            }, ['title', 'icon'], this.option('integrationOptions.watchMethod'))
        });
    },

    _createTitleActions: function() {
        this._createTitleClickAction();
        this._createTitleHoldAction();
        this._createTitleRenderedAction();
    },

    _createTitleClickAction: function() {
        this._titleClickAction = this._createActionByOption('onTitleClick');
    },

    _createTitleHoldAction: function() {
        this._titleHoldAction = this._createActionByOption('onTitleHold');
    },

    _createTitleRenderedAction: function() {
        this._titleRenderedAction = this._createActionByOption('onTitleRendered');
    },

    _renderLayout: function() {
        if(this._tabs) {
            return;
        }

        const $element = this.$element();

        this._$tabContainer = $('<div>')
            .addClass(TABPANEL_TABS_CLASS)
            .appendTo($element);

        const $tabs = $('<div>').appendTo(this._$tabContainer);

        this._tabs = this._createComponent($tabs, Tabs, this._tabConfig());

        this._$container = $('<div>')
            .addClass(TABPANEL_CONTAINER_CLASS)
            .appendTo($element);
        this._$container.append(this._$wrapper);
    },

    _refreshActiveDescendant: function() {
        if(!this._tabs) {
            return;
        }

        const tabs = this._tabs;
        const tabItems = tabs.itemElements();
        const $activeTab = $(tabItems[tabs.option('selectedIndex')]);
        const id = this.getFocusedItemId();

        this.setAria('controls', undefined, $(tabItems));
        this.setAria('controls', id, $activeTab);
    },

    _tabConfig: function() {
        return {
            selectOnFocus: true,
            focusStateEnabled: this.option('focusStateEnabled'),
            hoverStateEnabled: this.option('hoverStateEnabled'),
            repaintChangesOnly: this.option('repaintChangesOnly'),
            tabIndex: this.option('tabIndex'),
            selectedIndex: this.option('selectedIndex'),
            badgeExpr: this.option('badgeExpr'),
            onItemClick: this._titleClickAction.bind(this),
            onItemHold: this._titleHoldAction.bind(this),
            itemHoldTimeout: this.option('itemHoldTimeout'),
            onSelectionChanged: (function(e) {
                this.option('selectedIndex', e.component.option('selectedIndex'));
                this._refreshActiveDescendant();
            }).bind(this),
            onItemRendered: this._titleRenderedAction.bind(this),
            itemTemplate: this._getTemplateByOption('itemTitleTemplate'),
            items: this.option('items'),
            noDataText: null,
            scrollingEnabled: this.option('scrollingEnabled'),
            scrollByContent: this.option('scrollByContent'),
            showNavButtons: this.option('showNavButtons'),
            itemTemplateProperty: 'tabTemplate',
            loopItemFocus: this.option('loop'),
            selectionRequired: true,
            onOptionChanged: (function(args) {
                if(args.name === 'focusedElement') {
                    if(args.value) {
                        const $value = $(args.value);
                        const $newItem = this._itemElements().eq($value.index());
                        this.option('focusedElement', getPublicElement($newItem));
                    } else {
                        this.option('focusedElement', args.value);
                    }
                }
            }).bind(this),
            onFocusIn: (function(args) { this._focusInHandler(args.event); }).bind(this),
            onFocusOut: (function(args) {
                if(!this._isFocusOutHandlerExecuting) {
                    this._focusOutHandler(args.event);
                }
            }).bind(this),
            orientation: this._getTabsOrientation(),
            _itemAttributes: {
                class: TABPANEL_TABS_ITEM_CLASS,
            },
        };
    },

    _renderFocusTarget: function() {
        this._focusTarget().attr('tabIndex', -1);
    },

    _getTabsOrientation() {
        const { tabsPosition } = this.option();

        if([TABS_POSITION.right, TABS_POSITION.left].includes(tabsPosition)) {
            return TABS_ORIENTATION.vertical;
        }

        return TABS_ORIENTATION.horizontal;
    },

    _getTabPanelTabsPositionClass() {
        const position = this.option('tabsPosition');

        switch(position) {
            case TABS_POSITION.right:
                return TABPANEL_TABS_POSITION_CLASS.right;
            case TABS_POSITION.bottom:
                return TABPANEL_TABS_POSITION_CLASS.bottom;
            case TABS_POSITION.left:
                return TABPANEL_TABS_POSITION_CLASS.left;
            case TABS_POSITION.top:
            default:
                return TABPANEL_TABS_POSITION_CLASS.top;
        }
    },

    _toggleTabPanelTabsPositionClass() {
        for(const key in TABPANEL_TABS_POSITION_CLASS) {
            this.$element().removeClass(TABPANEL_TABS_POSITION_CLASS[key]);
        }

        const newClass = this._getTabPanelTabsPositionClass();

        this.$element().addClass(newClass);
    },

    _updateTabsOrientation() {
        const orientation = this._getTabsOrientation();

        this._tabs.option('orientation', orientation);
    },

    _toggleWrapperFocusedClass(isFocused) {
        this._toggleFocusClass(isFocused, this._$wrapper);
    },

    _toggleDisabledFocusedClass(isFocused) {
        this._focusTarget().toggleClass(DISABLED_FOCUSED_TAB_CLASS, isFocused);
    },

    _updateFocusState: function(e, isFocused) {
        this.callBase(e, isFocused);

        const isMultiViewTarget = e.target === this._focusTarget().get(0);
        const isDisabled = this._isDisabled(this.option('focusedElement'));

        this._toggleFocusClass(isFocused, this._focusTarget());
        this._toggleWrapperFocusedClass(isFocused && !isDisabled);
        this._toggleDisabledFocusedClass(isFocused && isDisabled);

        if(isMultiViewTarget) {
            this._toggleFocusClass(isFocused, this._tabs.option('focusedElement'));
        }
    },

    _focusOutHandler: function(e) {
        this._isFocusOutHandlerExecuting = true;

        this.callBase.apply(this, arguments);

        this._tabs._focusOutHandler(e);
        this._isFocusOutHandlerExecuting = false;
    },

    _setTabsOption: function(name, value) {
        if(this._tabs) {
            this._tabs.option(name, value);
        }
    },

    _visibilityChanged: function(visible) {
        if(visible) {
            this._tabs._dimensionChanged();
        }
    },

    registerKeyHandler: function(key, handler) {
        this.callBase(key, handler);

        if(this._tabs) {
            this._tabs.registerKeyHandler(key, handler);
        }
    },

    repaint: function() {
        this.callBase();
        this._tabs.repaint();
    },

    _optionChanged: function(args) {
        const { name, value, fullName } = args;

        switch(name) {
            case 'dataSource':
                this.callBase(args);
                break;
            case 'items':
                this._setTabsOption(name, this.option(name));
                if(!this.option('repaintChangesOnly')) {
                    this._tabs.repaint();
                }
                this.callBase(args);
                break;
            case 'width':
                this.callBase(args);
                this._tabs.repaint();
                break;
            case 'selectedIndex':
            case 'selectedItem': {
                this._setTabsOption(fullName, value);
                this.callBase(args);

                if(this.option('focusStateEnabled') === true) {
                    const selectedIndex = this.option('selectedIndex');
                    const selectedTabContent = this._itemElements().eq(selectedIndex);
                    this.option('focusedElement', getPublicElement(selectedTabContent));
                }
                break;
            }
            case 'itemHoldTimeout':
            case 'focusStateEnabled':
            case 'hoverStateEnabled':
                this._setTabsOption(fullName, value);
                this.callBase(args);
                break;
            case 'scrollingEnabled':
            case 'scrollByContent':
            case 'showNavButtons':
                this._setTabsOption(fullName, value);
                break;
            case 'focusedElement': {
                const id = value ? $(value).index() : value;
                const newItem = value ? this._tabs._itemElements().eq(id) : value;
                this._setTabsOption('focusedElement', getPublicElement(newItem));

                const isDisabled = this._isDisabled(value);

                this._toggleWrapperFocusedClass(!isDisabled);
                this._toggleDisabledFocusedClass(isDisabled);

                this.callBase(args);
                break;
            }
            case 'itemTitleTemplate':
                this._setTabsOption('itemTemplate', this._getTemplateByOption('itemTitleTemplate'));
                break;
            case 'onTitleClick':
                this._createTitleClickAction();
                this._setTabsOption('onItemClick', this._titleClickAction.bind(this));
                break;
            case 'onTitleHold':
                this._createTitleHoldAction();
                this._setTabsOption('onItemHold', this._titleHoldAction.bind(this));
                break;
            case 'onTitleRendered':
                this._createTitleRenderedAction();
                this._setTabsOption('onItemRendered', this._titleRenderedAction.bind(this));
                break;
            case 'loop':
                this._setTabsOption('loopItemFocus', value);
                break;
            case 'badgeExpr':
                this._invalidate();
                break;
            case 'tabsPosition':
                this._toggleTabPanelTabsPositionClass();
                this._updateTabsOrientation();
                break;
            default:
                this.callBase(args);
        }
    },
});

TabPanel.ItemClass = TabPanelItem;

registerComponent('dxTabPanel', TabPanel);

export default TabPanel;

/**
 * @name dxTabPanelItem
 * @inherits dxMultiViewItem
 * @type object
 */
