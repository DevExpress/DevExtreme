import $ from '../core/renderer';
import support from '../core/utils/support';
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
import windowUtils from '../core/utils/window';

const TABPANEL_CLASS = 'dx-tabpanel';
const TABPANEL_TABS_CLASS = 'dx-tabpanel-tabs';
const TABPANEL_CONTAINER_CLASS = 'dx-tabpanel-container';

const TABS_ITEM_TEXT_CLASS = 'dx-tab-text';

const TabPanel = MultiView.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {


            itemTitleTemplate: 'title',

            hoverStateEnabled: true,

            showNavButtons: false,

            scrollByContent: true,

            scrollingEnabled: true,

            onTitleClick: null,

            onTitleHold: null,

            onTitleRendered: null,

            badgeExpr: function(data) { return data ? data.badge : undefined; }

            /**
            * @name dxTabPanelItem
            * @inherits dxMultiViewItem
            * @type object
            */

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
                    return !support.touch;
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

    _renderContent: function() {
        const that = this;

        this.callBase();
        if(this.option('templatesRenderAsynchronously')) {
            this._resizeEventTimer = setTimeout(function() {
                that._updateLayout();
            }, 0);
        }
    },

    _renderLayout: function() {
        if(this._tabs) {
            this._updateLayout();
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

        this._updateLayout();
    },

    _updateLayout: function() {
        if(windowUtils.hasWindow()) {
            const tabsHeight = this._$tabContainer.outerHeight();
            this._$container.css({
                'marginTop': -tabsHeight,
                'paddingTop': tabsHeight
            });
        }
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
            }).bind(this)
        };
    },

    _renderFocusTarget: function() {
        this._focusTarget().attr('tabIndex', -1);
    },

    _updateFocusState: function(e, isFocused) {
        this.callBase(e, isFocused);

        if(e.target === this._tabs._focusTarget().get(0)) {
            this._toggleFocusClass(isFocused, this._focusTarget());
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
            this._updateLayout();
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
        const name = args.name;
        const value = args.value;
        const fullName = args.fullName;

        switch(name) {
            case 'dataSource':
                this.callBase(args);
                break;
            case 'items':
                this._setTabsOption(name, this.option(name));
                this._updateLayout();
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
            default:
                this.callBase(args);
        }
    },

    _clean: function() {
        clearTimeout(this._resizeEventTimer);
        this.callBase();
    }

});

TabPanel.ItemClass = TabPanelItem;

registerComponent('dxTabPanel', TabPanel);

module.exports = TabPanel;
