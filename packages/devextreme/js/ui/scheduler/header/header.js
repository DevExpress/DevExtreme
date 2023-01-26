import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';
import registerComponent from '../../../core/component_registrator';
import errors from '../../../core/errors';
import devices from '../../../core/devices';

import Widget from '../../widget/ui.widget';
import Toolbar from '../../toolbar';
import SchedulerCalendar from './calendar';
import dateUtils from '../../../core/utils/date';

import {
    getViewSwitcher,
    getDropDownViewSwitcher,
} from './viewSwitcher';
import {
    getDateNavigator
} from './dateNavigator';

import '../../../ui/button_group';
import '../../../ui/drop_down_button';

import {
    getCaption,
    getNextIntervalDate,
    validateViews,
    getStep,
    getViewType,
    getViewName,
    nextWeek,
} from './utils';
import { getCurrentView } from '../../../renovation/ui/scheduler/model/views';

const DEFAULT_ELEMENT = 'defaultElement';
const VIEW_SWITCHER = 'viewSwitcher';
const DATE_NAVIGATOR = 'dateNavigator';

const COMPONENT_CLASS = 'dx-scheduler-header';

export class SchedulerHeader extends Widget {
    get views() {
        return this.option('views');
    }

    get captionText() {
        return this._getCaption().text;
    }

    get intervalOptions() {
        const step = getStep(this.currentView);
        const intervalCount = this.option('intervalCount');
        const firstDayOfWeek = this.option('firstDayOfWeek');
        const agendaDuration = this.option('agendaDuration');

        return { step, intervalCount, firstDayOfWeek, agendaDuration };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            _useShortDateFormat: !devices.real().generic || devices.isSimulator(),
        });
    }

    _createEventMap() {
        this.eventMap = new Map(
            [
                ['currentView', [(view) => {
                    this.currentView = getCurrentView(
                        getViewName(view),
                        this.option('views'),
                    );
                }]],
                ['items', [this.repaint.bind(this)]],
                ['views', [validateViews]],
                ['currentDate', [this._getCalendarOptionUpdater('date')]],
                ['min', [this._getCalendarOptionUpdater('min')]],
                ['max', [this._getCalendarOptionUpdater('max')]],
                ['tabIndex', [this.repaint.bind(this)]],
                ['focusStateEnabled', [this.repaint.bind(this)]],
                ['useDropDownViewSwitcher', [this.repaint.bind(this)]],
            ]
        );
    }

    _addEvent(name, event) {
        if(!this.eventMap.has(name)) {
            this.eventMap.set(name, []);
        }

        const events = this.eventMap.get(name);
        this.eventMap.set(name, [...events, event]);
    }

    _optionChanged(args) {
        const { name, value } = args;

        if(this.eventMap.has(name)) {
            const events = this.eventMap.get(name);
            events.forEach((event) => {
                event(value);
            });
        }
    }

    _init() {
        super._init();
        this._createEventMap();
        this.$element().addClass(COMPONENT_CLASS);

        this.currentView = getCurrentView(
            getViewName(this.option('currentView')),
            this.option('views'),
        );
    }

    _render() {
        super._render();

        this._createEventMap();

        this._renderToolbar();
    }

    _renderToolbar() {
        const config = this._createToolbarConfig();

        const toolbarElement = $('<div>');
        toolbarElement.appendTo(this.$element());

        this._toolbar = this._createComponent(toolbarElement, Toolbar, config);
    }

    _createToolbarConfig() {
        const items = this.option('items');

        const parsedItems = items.map(element => {
            return this._parseItem(element);
        });

        return {
            items: parsedItems,
        };
    }

    _parseItem(item) {
        const isDefaultElement = this._isDefaultItem(item);

        if(isDefaultElement) {
            const defaultElementType = item[DEFAULT_ELEMENT];

            switch(defaultElementType) {
                case VIEW_SWITCHER:
                    if(this.option('useDropDownViewSwitcher')) {
                        return getDropDownViewSwitcher(this, item);
                    }

                    return getViewSwitcher(this, item);
                case DATE_NAVIGATOR:
                    this._renderCalendar();

                    return getDateNavigator(this, item);
                default:
                    errors.log(`Unknown default element type: ${defaultElementType}`);
                    break;
            }
        }

        return item;
    }

    _callEvent(event, arg) {
        if(this.eventMap.has(event)) {
            const events = this.eventMap.get(event);
            events.forEach(event => event(arg));
        }
    }

    _updateCurrentView(view) {
        const onCurrentViewChange = this.option('onCurrentViewChange');
        onCurrentViewChange(view.name);

        this._callEvent('currentView', view);
    }

    _updateCurrentDate(date) {
        const onCurrentDateChange = this.option('onCurrentDateChange');
        onCurrentDateChange(date);

        this._callEvent('currentDate', date);
    }

    _renderCalendar() {
        this._calendar = this._createComponent('<div>', SchedulerCalendar, {
            date: this.option('currentDate'),
            min: this.option('min'),
            max: this.option('max'),
            firstDayOfWeek: this.option('firstDayOfWeek'),
            focusStateEnabled: this.option('focusStateEnabled'),
            tabIndex: this.option('tabIndex'),
            onValueChanged: (e) => {
                const date = e.value;
                this._updateCurrentDate(date);

                this._calendar.hide();
            },
        });

        this._calendar.$element().appendTo(this.$element());
    }

    _getCalendarOptionUpdater(name) {
        return value => {
            if(this._calendar) {
                this._calendar.option(name, value);
            }
        };
    }

    _getNextDate(direction, initialDate = null) {
        const date = initialDate || this.option('currentDate');
        const options = { ...this.intervalOptions, date };

        return getNextIntervalDate(options, direction);
    }

    _isMonth() {
        const currentView = this.currentView;
        return getViewType(currentView) === 'month';
    }

    _getDisplayedDate() {
        const startViewDate = this.option('startViewDate');

        if(this._isMonth()) {
            return nextWeek(startViewDate);
        }

        return new Date(startViewDate);
    }

    _getCaption() {
        let date = this.option('currentDate');

        if(this.option('startViewDate')) {
            date = this._getDisplayedDate();
        }

        date = dateUtils.trimTime(date);
        const options = { ...this.intervalOptions, date };
        const customizationFunction = this.option('customizeDateNavigatorText');
        const useShortDateFormat = this.option('_useShortDateFormat');

        return getCaption(options, useShortDateFormat, customizationFunction);
    }

    _updateDateByDirection(direction) {
        const date = this._getNextDate(direction);

        this._updateCurrentDate(date);
    }

    _showCalendar(e) {
        this._calendar.show(e.element);
    }

    _hideCalendar() {
        this._calendar.hide();
    }

    _isDefaultItem(item) {
        return Object.prototype.hasOwnProperty
            .call(item, DEFAULT_ELEMENT);
    }
}

registerComponent('dxSchedulerHeader', SchedulerHeader);
