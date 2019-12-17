var $ = require('../../core/renderer'),
    typeUtils = require('../../core/utils/type'),
    noop = require('../../core/utils/common').noop,
    isDefined = require('../../core/utils/type').isDefined,
    extend = require('../../core/utils/extend').extend,
    each = require('../../core/utils/iterator').each,
    inArray = require('../../core/utils/array').inArray,
    camelize = require('../../core/utils/inflector').camelize,
    registerComponent = require('../../core/component_registrator'),
    Widget = require('../widget/ui.widget'),
    publisherMixin = require('./ui.scheduler.publisher_mixin'),
    SchedulerNavigator = require('./ui.scheduler.navigator'),
    DropDownMenu = require('../drop_down_menu'),
    Tabs = require('../tabs'),
    errors = require('../../core/errors'),
    messageLocalization = require('../../localization/message');

var COMPONENT_CLASS = 'dx-scheduler-header',
    VIEW_SWITCHER_CLASS = 'dx-scheduler-view-switcher',
    VIEW_SWITCHER_LABEL_CLASS = 'dx-scheduler-view-switcher-label';

var STEP_MAP = {
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

var VIEWS = ['day', 'week', 'workWeek', 'month', 'timelineDay', 'timelineWeek', 'timelineWorkWeek', 'timelineMonth', 'agenda'];

var SchedulerHeader = Widget.inherit({

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
        var value = args.value;

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

        var $viewSwitcher = $('<div>').addClass(VIEW_SWITCHER_CLASS).appendTo(this.$element());

        if(!this.option('useDropDownViewSwitcher')) {
            this._renderViewSwitcherTabs($viewSwitcher);
        } else {
            this._renderViewSwitcherDropDownMenu($viewSwitcher);
        }
    },

    _validateViews: function() {
        var views = this.option('views');

        each(views, function(_, view) {
            var isViewIsObject = typeUtils.isObject(view),
                viewType = isViewIsObject && view.type ? view.type : view;

            if(inArray(viewType, VIEWS) === -1) {
                errors.log('W0008', viewType);
            }
        });
    },

    _getCurrentViewType: function() {
        var currentView = this.option('currentView');
        return currentView.type || currentView;
    },

    _renderViewSwitcherTabs: function($element) {
        var that = this;

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
        var that = this;

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
        var currentView = this.option('currentView'),
            currentViewText = this._getItemText(currentView);

        this._$viewSwitcherLabel.text(currentViewText);
    },

    _getCurrentViewName: function(currentView) {
        return typeUtils.isObject(currentView) ? currentView.name || currentView.type : currentView;
    },

    _updateCurrentView: function(e) {
        var selectedItem = e.itemData || e.component.option('selectedItem');

        var viewName = this._getCurrentViewName(selectedItem);

        this.notifyObserver('currentViewUpdated', viewName);
    },

    _renderFocusTarget: noop

}).include(publisherMixin);

registerComponent('dxSchedulerHeader', SchedulerHeader);

module.exports = SchedulerHeader;
