import $ from '../../../core/renderer';
import { isObject, isDefined } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import { each } from '../../../core/utils/iterator';
import { inArray } from '../../../core/utils/array';
import { camelize } from '../../../core/utils/inflector';
import registerComponent from '../../../core/component_registrator';
import Widget from '../../widget/ui.widget';
import { Navigator } from './navigator';
import DropDownMenu from '../../drop_down_menu';
import Tabs from '../../tabs';
import { TABS_EXPANDED_CLASS } from '../../tabs/constants';
import errors from '../../../core/errors';
import messageLocalization from '../../../localization/message';

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

export class Header extends Widget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            views: [],
            isAdaptive: false,
            intervalCount: 1,
            currentView: 'day',
            firstDayOfWeek: undefined,
            currentDate: new Date(),
            min: undefined,
            max: undefined,
            useDropDownViewSwitcher: false,
            _dropDownButtonIcon: 'overlay'
        });
    }

    _setOptionsByReference() {
        super._setOptionsByReference();

        extend(this._optionsByReference, {
            currentView: true
        });
    }

    _optionChanged(args) {
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
                super._optionChanged(args);
                break;
            case 'useDropDownViewSwitcher':
                this._refreshViewSwitcher();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _init() {
        super._init();
        this.$element().addClass(COMPONENT_CLASS);
    }

    _initMarkup() {
        super._initMarkup();

        this._renderNavigator();
        this._renderViewSwitcher();
    }

    _renderNavigator() {
        this._navigator = this._createComponent('<div>', Navigator, {
            min: this.option('min'),
            max: this.option('max'),
            intervalCount: this.option('intervalCount'),
            date: this.option('currentDate'),
            step: STEP_MAP[this._getCurrentViewType()],
            firstDayOfWeek: this.option('firstDayOfWeek'),
            tabIndex: this.option('tabIndex'),
            focusStateEnabled: this.option('focusStateEnabled'),
            observer: this.option('observer'),
            customizeDateNavigatorText: this.option('customizeDateNavigatorText'),
            todayDate: this.option('todayDate')
        });

        this._navigator.$element().appendTo(this.$element());
    }

    _renderViewSwitcher() {
        this._validateViews();

        const $viewSwitcher = $('<div>').addClass(VIEW_SWITCHER_CLASS).appendTo(this.$element());
        this.option('useDropDownViewSwitcher') ? this._renderViewSwitcherDropDownMenu($viewSwitcher) : this._renderViewSwitcherTabs($viewSwitcher);
    }

    _validateViews() {
        const views = this.option('views');

        each(views, function(_, view) {
            const isViewIsObject = isObject(view);
            const viewType = isViewIsObject && view.type ? view.type : view;

            if(inArray(viewType, VIEWS) === -1) {
                errors.log('W0008', viewType);
            }
        });
    }

    _getCurrentViewType() {
        const currentView = this.option('currentView');
        return currentView.type || currentView;
    }

    _renderViewSwitcherTabs($element) {
        const that = this;

        $element.addClass(TABS_EXPANDED_CLASS);

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
    }

    _getItemText(item) {
        return item.name || messageLocalization.format('dxScheduler-switcher' + camelize(item.type || item, true));
    }

    _refreshViewSwitcher() {
        this._viewSwitcher._dispose();
        this._viewSwitcher.$element().remove();

        delete this._viewSwitcher;

        this._removeViewSwitcherLabel();

        this._renderViewSwitcher();
    }

    _removeViewSwitcherLabel() {
        if(isDefined(this._$viewSwitcherLabel)) {
            this._$viewSwitcherLabel.detach();
            this._$viewSwitcherLabel.remove();

            delete this._$viewSwitcherLabel;
        }
    }

    _renderViewSwitcherDropDownMenu($element) {
        const that = this;

        this._$viewSwitcherLabel = $('<div>').addClass(VIEW_SWITCHER_LABEL_CLASS).appendTo(this.$element());

        this._changeViewSwitcherLabelText();

        this._viewSwitcher = this._createComponent($element, DropDownMenu, {
            onItemClick: this._updateCurrentView.bind(this),
            buttonIcon: this.option('_dropDownButtonIcon'),
            items: this.option('views'),
            selectionMode: this.option('isAdaptive') ? 'single' : 'none',
            selectedItemKeys: [this.option('currentView')],
            itemTemplate: function(item) {
                return $('<span>')
                    .addClass('dx-dropdownmenu-item-text')
                    .text(that._getItemText(item));
            }
        });
    }

    _changeViewSwitcherLabelText() {
        if(!isDefined(this._$viewSwitcherLabel)) {
            return;
        }
        const currentView = this.option('currentView');
        const currentViewText = this._getItemText(currentView);

        this._$viewSwitcherLabel.text(currentViewText);
    }

    _getCurrentViewName(currentView) {
        return isObject(currentView) ? currentView.name || currentView.type : currentView;
    }

    _updateCurrentView(e) {
        const selectedItem = e.itemData || e.component.option('selectedItem');

        const viewName = this._getCurrentViewName(selectedItem);

        this.notifyObserver('currentViewUpdated', viewName);
    }

    _renderFocusTarget() {}

    notifyObserver(subject, args) {
        const observer = this.option('observer');
        if(observer) {
            observer.fire(subject, args);
        }
    }

    invoke() {
        const observer = this.option('observer');

        if(observer) {
            return observer.fire.apply(observer, arguments);
        }
    }
}

registerComponent('dxSchedulerHeader', Header);
