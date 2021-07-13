import $ from '../../../core/renderer';
import { extend } from '../../../core/utils/extend';
import registerComponent from '../../../core/component_registrator';
import errors from '../../../core/errors';
import devices from '../../../core/devices';

import Widget from '../../widget/ui.widget';
import Toolbar from '../../toolbar';
import SchedulerCalendar from './calendar';

import {
    getViewSwitcher,
    getDropDownViewSwitcher,
} from './viewSwitcher';
import {
    getDateNavigator
} from './dateNavigator';

import {
    getCaption,
    getNextIntervalDate,
    isDefaultItem,
    validateViews,
    getStep,
} from './utils';

const DEFAULT_ELEMENT = 'defaultElement';
const VIEW_SWITCHER = 'viewSwitcher';
const DATE_NAVIGATOR = 'dateNavigator';

const COMPONENT_CLASS = 'dx-scheduler-header';

export class SchedulerToolbar extends Widget {
    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            _useShortDateFormat: !devices.real().generic || devices.isSimulator(),
        });
    }

    _createEventMap() {
        const config = [
            {
                key: 'items',
                value: [this.repaint],
            },
            {
                key: 'views',
                value: [validateViews],
            },
            {
                key: 'currentDate',
                value: [this._getCalendarDateUpdater()],
            },
            {
                key: 'displayedDate',
                value: [this._getCalendarDateUpdater()],
            },
            {
                key: 'min',
                value: [this._getCalendarOptionUpdater('min')],
            },
            {
                key: 'max',
                value: [this._getCalendarOptionUpdater('max')],
            },
            {
                key: 'tabIndex',
                value: [this.repaint],
            },
            {
                key: 'focusStateEnabled',
                value: [this.repaint],
            },
            {
                key: 'useDropDownViewSwitcher',
                value: [this.repaint],
            },
        ];

        this.eventMap = new Map();

        config.forEach(({ key, value }) =>
            this.eventMap.set(key, value));
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

        const events = this.eventMap.get(name);
        if(Array.isArray(events)) {
            events.forEach((event) => {
                event.call(this, value);
            }, this);
        }
    }

    _init() {
        super._init();
        this._createEventMap();
        this.$element().addClass(COMPONENT_CLASS);
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
        const isDefaultElement = isDefaultItem(item);

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

    _updateCurrentView(view) {
        this.notifyObserver('currentViewUpdated', view.name);

        const events = this.eventMap.get('currentView');
        if(Array.isArray(events)) {
            events.forEach(event => event(view));
        }
    }

    _updateCurrentDate(date) {
        this.notifyObserver('currentDateUpdated', date);

        const events = this.eventMap.get('currentDate');
        if(Array.isArray(events)) {
            events.forEach(event => event(date));
        }
    }

    _renderCalendar() {
        this._calendar = this._createComponent('<div>', SchedulerCalendar, {
            date: this.date,
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

    _getCalendarDateUpdater() {
        return () => {
            if(this._calendar) {
                const date = this.date;

                this._calendar.option('date', date);
            }
        };
    }

    _getNextDate(direction, initialDate = null) {
        const date = initialDate || this.option('currentDate');
        const options = { ...this.intervalOptions, date };

        return getNextIntervalDate(options, direction);
    }

    _getCaption(date) {
        const options = { ...this.intervalOptions, date };
        const customizationFunction = this.option('customizeDateNavigatorText');
        const useShortDateFormat = this.option('_useShortDateFormat');

        return getCaption(options, useShortDateFormat, customizationFunction);
    }

    _updateDateInDirection(direction) {
        const date = this._getNextDate(direction);

        this._updateCurrentDate(date);
    }

    _showCalendar(e) {
        this._calendar.show(e.element);
    }

    _hideCalendar() {
        this._calendar.hide();
    }

    get currentView() {
        return this.option('currentView');
    }

    get views() {
        return this.option('views');
    }

    get date() {
        return this.option('displayedDate') || this.option('currentDate');
    }

    get captionText() {
        return this._getCaption(this.date).text;
    }

    get intervalOptions() {
        const step = getStep(this.option('currentView'));
        const intervalCount = this.option('intervalCount');
        const firstDayOfWeek = this.option('firstDayOfWeek');
        const agendaDuration = this.option('agendaDuration');

        return { step, intervalCount, firstDayOfWeek, agendaDuration };
    }

    notifyObserver(subject, args) {
        const observer = this.option('observer');
        if(observer) {
            observer.fire(subject, args);
        }
    }
}

registerComponent('dxSchedulerHeader', SchedulerToolbar);
