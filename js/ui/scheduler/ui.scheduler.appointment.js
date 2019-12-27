import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import translator from '../../animation/translator';
import recurrenceUtils from './utils.recurrence';
import { extend } from '../../core/utils/extend';
import registerComponent from '../../core/component_registrator';
import tooltip from '../tooltip/ui.tooltip';
import publisherMixin from './ui.scheduler.publisher_mixin';
import eventUtils from '../../events/utils';
import pointerEvents from '../../events/pointer';
import DOMComponent from '../../core/dom_component';
import Resizable from '../resizable';
import messageLocalization from '../../localization/message';
import dateLocalization from '../../localization/date';

const DEFAULT_HORIZONTAL_HANDLES = 'left right';
const DEFAULT_VERTICAL_HANDLES = 'top bottom';

const REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME = eventUtils.addNamespace(pointerEvents.enter, 'dxSchedulerAppointment');
const REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME = eventUtils.addNamespace(pointerEvents.leave, 'dxSchedulerAppointment');

const EMPTY_APPOINTMENT_CLASS = 'dx-scheduler-appointment-empty';

const APPOINTMENT_ALL_DAY_ITEM_CLASS = 'dx-scheduler-all-day-appointment';
const DIRECTION_APPOINTMENT_CLASSES = {
    horizontal: 'dx-scheduler-appointment-horizontal',
    vertical: 'dx-scheduler-appointment-vertical'
};

const RECURRENCE_APPOINTMENT_CLASS = 'dx-scheduler-appointment-recurrence';
const COMPACT_APPOINTMENT_CLASS = 'dx-scheduler-appointment-compact';

const REDUCED_APPOINTMENT_CLASS = 'dx-scheduler-appointment-reduced';
const REDUCED_APPOINTMENT_ICON = 'dx-scheduler-appointment-reduced-icon';
const REDUCED_APPOINTMENT_PARTS_CLASSES = {
    head: 'dx-scheduler-appointment-head',
    body: 'dx-scheduler-appointment-body',
    tail: 'dx-scheduler-appointment-tail'
};

const Appointment = DOMComponent.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            data: {},
            geometry: { top: 0, left: 0, width: 0, height: 0 },
            allowDrag: true,
            allowResize: true,
            reduced: null,
            isCompact: false,
            direction: 'vertical',
            resizableConfig: {},
            cellHeight: 0,
            cellWidth: 0
        });
    },


    _optionChanged: function(args) {
        switch(args.name) {
            case 'data':
            case 'geometry':
            case 'allowDrag':
            case 'allowResize':
            case 'reduced':
            case 'sortedIndex':
            case 'isCompact':
            case 'direction':
            case 'resizableConfig':
            case 'cellHeight':
            case 'cellWidth':
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    },

    _getHorizontalResizingRule: function() {
        const reducedHandles = {
            head: this.option('rtlEnabled') ? 'right' : 'left',
            body: '',
            tail: this.option('rtlEnabled') ? 'left' : 'right'
        };

        return {
            handles: this.option('reduced') ? reducedHandles[this.option('reduced')] : DEFAULT_HORIZONTAL_HANDLES,
            minHeight: 0,
            minWidth: this.invoke('getCellWidth'),
            step: this.invoke('getResizableStep')
        };
    },

    _getVerticalResizingRule: function() {
        const height = this.invoke('getCellHeight');
        return {
            handles: DEFAULT_VERTICAL_HANDLES,
            minWidth: 0,
            minHeight: height,
            step: height
        };
    },

    _render: function() {
        this.callBase();

        this._renderAppointmentGeometry();
        this._renderEmptyClass();
        this._renderCompactClass();
        this._renderReducedAppointment();
        this._renderAllDayClass();
        this._renderDirection();

        this.$element().data('dxAppointmentStartDate', this.option('startDate'));
        this.$element().attr('title', this.invoke('getField', 'text', this.option('data')));
        this.$element().attr('role', 'button');

        this._renderRecurrenceClass();
        this._renderResizable();
    },

    _renderAppointmentGeometry: function() {
        const geometry = this.option('geometry');
        const $element = this.$element();
        translator.move($element, {
            top: geometry.top,
            left: geometry.left
        });

        $element.css({
            width: geometry.width < 0 ? 0 : geometry.width,
            height: geometry.height < 0 ? 0 : geometry.height
        });
    },

    _renderEmptyClass: function() {
        const geometry = this.option('geometry');

        if(geometry.empty || this.option('isCompact')) {
            this.$element().addClass(EMPTY_APPOINTMENT_CLASS);
        }
    },

    _renderReducedAppointment: function() {
        const reducedPart = this.option('reduced');

        if(!reducedPart) {
            return;
        }

        this.$element()
            .toggleClass(REDUCED_APPOINTMENT_CLASS, true)
            .toggleClass(REDUCED_APPOINTMENT_PARTS_CLASSES[reducedPart], true);

        this._renderAppointmentReducedIcon();
    },

    _renderAppointmentReducedIcon: function() {
        const $icon = $('<div>')
            .addClass(REDUCED_APPOINTMENT_ICON)
            .appendTo(this.$element());

        const endDate = this._getEndDate();
        const tooltipLabel = messageLocalization.format('dxScheduler-editorLabelEndDate');
        const tooltipText = [tooltipLabel, ': ', dateLocalization.format(endDate, 'monthAndDay'), ', ', dateLocalization.format(endDate, 'year')].join('');

        eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME);
        eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME, function() {
            tooltip.show({
                target: $icon,
                content: tooltipText
            });
        });
        eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME);
        eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME, function() {
            tooltip.hide();
        });
    },

    _getEndDate: function() {
        const result = this.invoke('getField', 'endDate', this.option('data'));
        if(result) {
            return new Date(result);
        }
        return result;
    },

    _renderAllDayClass: function() {
        this.$element().toggleClass(APPOINTMENT_ALL_DAY_ITEM_CLASS, !!this.option('allDay'));
    },

    _renderRecurrenceClass: function() {
        const rule = this.invoke('getField', 'recurrenceRule', this.option('data'));

        if(recurrenceUtils.getRecurrenceRule(rule).isValid) {
            this.$element().addClass(RECURRENCE_APPOINTMENT_CLASS);
        }
    },

    _renderCompactClass: function() {
        this.$element().toggleClass(COMPACT_APPOINTMENT_CLASS, !!this.option('isCompact'));
    },

    _renderDirection: function() {
        this.$element().addClass(DIRECTION_APPOINTMENT_CLASSES[this.option('direction')]);
    },

    _createResizingConfig: function() {
        const config = this.option('direction') === 'vertical' ? this._getVerticalResizingRule() : this._getHorizontalResizingRule();
        config.roundStepValue = true;

        if(!this.invoke('isGroupedByDate')) {
            config.stepPrecision = 'strict';
        }

        return config;
    },

    _renderResizable: function() {
        if(this.option('allowResize') && !this.option('isCompact')) {
            this._createComponent(this.$element(), Resizable, extend(this._createResizingConfig(), this.option('resizableConfig')));
        }
    }

}).include(publisherMixin);

registerComponent('dxSchedulerAppointment', Appointment);

module.exports = Appointment;
