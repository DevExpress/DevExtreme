const $ = require('../../core/renderer');
const typeUtils = require('../../core/utils/type');
const noop = require('../../core/utils/common').noop;
const isDefined = require('../../core/utils/type').isDefined;
const extend = require('../../core/utils/extend').extend;
const each = require('../../core/utils/iterator').each;
const inArray = require('../../core/utils/array').inArray;
const camelize = require('../../core/utils/inflector').camelize;
const registerComponent = require('../../core/component_registrator');
const Widget = require('../widget/ui.widget');
const publisherMixin = require('./ui.scheduler.publisher_mixin');
const SchedulerNavigator = require('./ui.scheduler.navigator');
const DropDownMenu = require('../drop_down_menu');
const Tabs = require('../tabs');
const errors = require('../../core/errors');
const messageLocalization = require('../../localization/message');

const COMPONENT_CLASS = 'dx-scheduler-header';
const VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher';
const VIEW_SWITCHER_LABEL_CLASS = 'dx-scheduler-view-switcher-label';

const STEP_MAP = {
    day: 'day',
    week: 'week',
    workWeek: 'workWeek',
    month: 'month',
    timelineDay: 'day',
    timelineWeek: 'week',
    timelineWorkWeek: 'workWeek',
    timelineMonth: 'month',
    agenda: 'agenda'
};

const VIEWS = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'];

const SchedulerHeader = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            views: [],
            intervalCount: 1,
            currentView: 'day',
            firstDayOfWeek: undefined,
            currentDate: new Date(),
            min: undefined,
            max: undefined,
            useDropDownViewSwitcher: false,
            _dropDownButtonIcon: 'overlay'
        });
    },

    _setOptionsByReference: function() {
        this.callBase();

        extend(this._optionsByReference, {
            currentView: true
        });
    },

    _optionChanged: function(args) {
        const value = args.value;

        switch(args.name) {
            case 'views':
                this._validateViews();

                this._viewSwitcher.option({
                    items: value,
                    selectedItem: this.option('currentView')
                });
                break;
            case 'customizeDateNavigatorText':
                this._navigator.option(args.name, value);
                break;
            case 'currentView':
                this._viewSwitcher.option('selectedItem', value);
                this._navigator.option('step', STEP_MAP[this._getCurrentViewType()]);
                this._changeViewSwitcherLabelText();
                break;
            case 'currentDate':
                this._navigator.option('date', value);
                break;
            case 'displayedDate':
                this._navigator.option('displayedDate', value);
                break;
            case 'min':
            case 'max':
            case 'firstDayOfWeek':
            case 'intervalCount':
                this._navigator.option(args.name, value);
                break;
            case 'tabIndex':
            case 'focusStateEnabled':
                this._viewSwitcher.option(args.name, value);
                this._navigator.option(args.name, value);
                this.callBase(args);
                break;
            case 'useDropDownViewSwitcher':
                this._refreshViewSwitcher();
                break;
            default:
                this.callBase(args);
        }
    },

    _init: function() {
        this.callBase();
        this.$element().addClass(COMPONENT_CLASS);
    },

    _initMarkup: function() {
        this.callBase();

        this._renderNavigator();
        this._renderViewSwitcher();
    },

    _renderNavigator: function() {
        this._navigator = this._createComponent('<div>', SchedulerNavigator, {
            min: this.option('min'),
            max: this.option('max'),
            intervalCount: this.option('intervalCount'),
            date: this.option('currentDate'),
            step: STEP_MAP[this._getCurrentViewType()],
            firstDayOfWeek: this.option('firstDayOfWeek'),
            tabIndex: this.option('tabIndex'),
            focusStateEnabled: this.option('focusStateEnabled'),
            observer: this.option('observer'),
            customizeDateNavigatorText: this.option('customizeDateNavigatorText')
        });

        this._navigator.$element().appendTo(this.$element());
    },

    _renderViewSwitcher: function() {
        this._validateViews();

        const $viewSwitcher = $('<div>').addClass(VIEW_SWITCHER_CLASS).appendTo(this.$element());

        if(!this.option('useDropDownViewSwitcher')) {
            this._renderViewSwitcherTabs($viewSwitcher);
        } else {
            this._renderViewSwitcherDropDownMenu($viewSwitcher);
        }
    },

    _validateViews: function() {
        const views = this.option('views');

        each(views, function(_, view) {
            const isViewIsObject = typeUtils.isObject(view);
            const viewType = isViewIsObject && view.type ? view.type : view;

            if(inArray(viewType, VIEWS) === -1) {
                errors.log('W0008', viewType);
            }
        });
    },

    _getCurrentViewType: function() {
        const currentView = this.option('currentView');
        return currentView.type || currentView;
    },

    _renderViewSwitcherTabs: function($element) {
        const that = this;

        $element.addClass(Tabs.getTabsExpandedClass);

        this._viewSwitcher = this._createComponent($element, Tabs, {
            selectionRequired: true,
            scrollingEnabled: true,
            onSelectionChanged: this._updateCurrentView.bind(this),
            items: this.option('views'),
            itemTemplate: function(item) {
                return $('<span>')
                    .addClass('dx-tab-text')
                    .text(that._getItemText(item));
            },
            selectedItem: this.option('currentView'),
            tabIndex: this.option('tabIndex'),
            focusStateEnabled: this.option('focusStateEnabled')
        });
    },

    _getItemText: function(item) {
        return item.name || messageLocalization.format('dxScheduler-switcher' + camelize(item.type || item, true));
    },

    _refreshViewSwitcher: function() {
        this._viewSwitcher._dispose();
        this._viewSwitcher.$element().remove();

        delete this._viewSwitcher;

        this._removeViewSwitcherLabel();

        this._renderViewSwitcher();
    },

    _removeViewSwitcherLabel: function() {
        if(isDefined(this._$viewSwitcherLabel)) {
            this._$viewSwitcherLabel.detach();
            this._$viewSwitcherLabel.remove();

            delete this._$viewSwitcherLabel;
        }
    },

    _renderViewSwitcherDropDownMenu: function($element) {
        const that = this;

        this._$viewSwitcherLabel = $('<div>').addClass(VIEW_SWITCHER_LABEL_CLASS).appendTo(this.$element());

        this._changeViewSwitcherLabelText();

        this._viewSwitcher = this._createComponent($element, DropDownMenu, {
            onItemClick: this._updateCurrentView.bind(this),
            buttonIcon: this.option('_dropDownButtonIcon'),
            items: this.option('views'),
            itemTemplate: function(item) {
                return $('<span>')
                    .addClass('dx-dropdownmenu-item-text')
                    .text(that._getItemText(item));
            }
        });
    },

    _changeViewSwitcherLabelText: function() {
        if(!isDefined(this._$viewSwitcherLabel)) {
            return;
        }
        const currentView = this.option('currentView');
        const currentViewText = this._getItemText(currentView);

        this._$viewSwitcherLabel.text(currentViewText);
    },

    _getCurrentViewName: function(currentView) {
        return typeUtils.isObject(currentView) ? currentView.name || currentView.type : currentView;
    },

    _updateCurrentView: function(e) {
        const selectedItem = e.itemData || e.component.option('selectedItem');

        const viewName = this._getCurrentViewName(selectedItem);

        this.notifyObserver('currentViewUpdated', viewName);
    },

    _renderFocusTarget: noop

}).include(publisherMixin);

registerComponent('dxSchedulerHeader', SchedulerHeader);

module.exports = SchedulerHeader;
