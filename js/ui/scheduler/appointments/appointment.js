import $ from '../../../core/renderer';
import eventsEngine from '../../../events/core/events_engine';
import { move } from '../../../animation/translator';
import { getRecurrenceProcessor } from '../recurrence';
import { extend } from '../../../core/utils/extend';
import registerComponent from '../../../core/component_registrator';
import { hide, show } from '../../tooltip/ui.tooltip';
import { addNamespace } from '../../../events/utils/index';
import pointerEvents from '../../../events/pointer';
import DOMComponent from '../../../core/dom_component';
import Resizable from '../../resizable';
import messageLocalization from '../../../localization/message';
import dateLocalization from '../../../localization/date';
import {
    EMPTY_APPOINTMENT_CLASS,
    RECURRENCE_APPOINTMENT_CLASS,
    REDUCED_APPOINTMENT_CLASS,
    ALL_DAY_APPOINTMENT_CLASS,
    REDUCED_APPOINTMENT_ICON,
    REDUCED_APPOINTMENT_PARTS_CLASSES,
    DIRECTION_APPOINTMENT_CLASSES,
    APPOINTMENT_DRAG_SOURCE_CLASS,
    APPOINTMENT_CONTENT_CLASSES
} from '../classes';
import { Deferred } from '../../../core/utils/deferred';

const DEFAULT_HORIZONTAL_HANDLES = 'left right';
const DEFAULT_VERTICAL_HANDLES = 'top bottom';

const REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME = addNamespace(pointerEvents.enter, 'dxSchedulerAppointment');
const REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME = addNamespace(pointerEvents.leave, 'dxSchedulerAppointment');

export class Appointment extends DOMComponent {
    get coloredElement() {
        return this.$element();
    }

    get rawAppointment() {
        return this.option('data');
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            data: {},
            groupIndex: -1,
            groups: [],
            geometry: { top: 0, left: 0, width: 0, height: 0 },
            allowDrag: true,
            allowResize: true,
            reduced: null,
            isCompact: false,
            direction: 'vertical',
            resizableConfig: {},
            cellHeight: 0,
            cellWidth: 0,
            isDragSource: false
        });
    }

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

    _optionChanged(args) {
        switch(args.name) {
            case 'data':
            case 'groupIndex':
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
            case 'isDragSource':
                this._renderDragSourceClass();
                break;
            default:
                super._optionChanged(args);
        }
    }

    _getHorizontalResizingRule() {
        const reducedHandles = {
            head: this.option('rtlEnabled') ? 'right' : 'left',
            body: '',
            tail: this.option('rtlEnabled') ? 'left' : 'right'
        };

        return {
            handles: this.option('reduced') ? reducedHandles[this.option('reduced')] : DEFAULT_HORIZONTAL_HANDLES,
            minHeight: 0,
            minWidth: this.invoke('getCellWidth'),
            step: this.invoke('getResizableStep'),
            roundStepValue: false,
        };
    }

    _getVerticalResizingRule() {
        const height = this.invoke('getCellHeight');
        return {
            handles: DEFAULT_VERTICAL_HANDLES,
            minWidth: 0,
            minHeight: height,
            step: height,
            roundStepValue: true,
        };
    }

    _render() {
        super._render();

        this._renderAppointmentGeometry();
        this._renderEmptyClass();
        this._renderReducedAppointment();
        this._renderAllDayClass();
        this._renderDragSourceClass();
        this._renderDirection();

        this.$element().data('dxAppointmentStartDate', this.option('startDate'));
        this.$element().attr('title', this.invoke('getField', 'text', this.rawAppointment));
        this.$element().attr('role', 'button');

        this._renderRecurrenceClass();
        this._renderResizable();

        this._setResourceColor();
    }

    _setResourceColor() {
        const resourceManager = this.invoke('getResourceManager');
        const deferredColor = resourceManager.getAppointmentColor({
            itemData: this.rawAppointment,
            groupIndex: this.option('groupIndex'),
            groups: this.option('groups'),
        });

        deferredColor.done(color => color && this.coloredElement.css('backgroundColor', color));
    }

    _renderAppointmentGeometry() {
        const geometry = this.option('geometry');
        const $element = this.$element();
        move($element, {
            top: geometry.top,
            left: geometry.left
        });

        $element.css({
            width: geometry.width < 0 ? 0 : geometry.width,
            height: geometry.height < 0 ? 0 : geometry.height
        });
    }

    _renderEmptyClass() {
        const geometry = this.option('geometry');

        if(geometry.empty || this.option('isCompact')) {
            this.$element().addClass(EMPTY_APPOINTMENT_CLASS);
        }
    }

    _renderReducedAppointment() {
        const reducedPart = this.option('reduced');

        if(!reducedPart) {
            return;
        }

        this.$element()
            .toggleClass(REDUCED_APPOINTMENT_CLASS, true)
            .toggleClass(REDUCED_APPOINTMENT_PARTS_CLASSES[reducedPart], true);

        this._renderAppointmentReducedIcon();
    }

    _renderAppointmentReducedIcon() {
        const $icon = $('<div>')
            .addClass(REDUCED_APPOINTMENT_ICON)
            .appendTo(this.$element());

        const endDate = this._getEndDate();
        const tooltipLabel = messageLocalization.format('dxScheduler-editorLabelEndDate');
        const tooltipText = [tooltipLabel, ': ', dateLocalization.format(endDate, 'monthAndDay'), ', ', dateLocalization.format(endDate, 'year')].join('');

        eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME);
        eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME, function() {
            show({
                target: $icon,
                content: tooltipText
            });
        });
        eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME);
        eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME, function() {
            hide();
        });
    }

    _getEndDate() {
        const result = this.invoke('getField', 'endDate', this.rawAppointment);
        if(result) {
            return new Date(result);
        }
        return result;
    }

    _renderAllDayClass() {
        this.$element().toggleClass(ALL_DAY_APPOINTMENT_CLASS, !!this.option('allDay'));
    }

    _renderDragSourceClass() {
        this.$element().toggleClass(APPOINTMENT_DRAG_SOURCE_CLASS, !!this.option('isDragSource'));
    }

    _renderRecurrenceClass() {
        const rule = this.invoke('getField', 'recurrenceRule', this.rawAppointment);

        if(getRecurrenceProcessor().isValidRecurrenceRule(rule)) {
            this.$element().addClass(RECURRENCE_APPOINTMENT_CLASS);
        }
    }

    _renderDirection() {
        this.$element().addClass(DIRECTION_APPOINTMENT_CLASSES[this.option('direction')]);
    }

    _createResizingConfig() {
        const config = this.option('direction') === 'vertical' ? this._getVerticalResizingRule() : this._getHorizontalResizingRule();

        if(!this.invoke('isGroupedByDate')) {
            config.stepPrecision = 'strict';
        }

        return config;
    }

    _renderResizable() {
        if(this.option('allowResize')) {
            this._createComponent(this.$element(), Resizable, extend(this._createResizingConfig(), this.option('resizableConfig')));
        }
    }

    _useTemplates() {
        return false;
    }
}

registerComponent('dxSchedulerAppointment', Appointment);

export class AgendaAppointment extends Appointment {
    get coloredElement() {
        return this.$element().find(`.${APPOINTMENT_CONTENT_CLASSES.AGENDA_MARKER}`);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            createPlainResourceListAsync: new Deferred()
        });
    }

    _renderResourceList(container, list) {
        list.forEach(item => {
            const itemContainer = $('<div>')
                .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_RESOURCE_LIST_ITEM)
                .appendTo(container);

            $('<div>')
                .text(`${item.label}:`)
                .appendTo(itemContainer);

            $('<div>')
                .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_RESOURCE_LIST_ITEM_VALUE)
                .text(item.values.join(', '))
                .appendTo(itemContainer);
        });
    }

    _render() {
        super._render();

        const createPlainResourceListAsync = this.option('createPlainResourceListAsync');
        createPlainResourceListAsync(this.rawAppointment).done(list => {
            const parent = this.$element().find(`.${APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS}`);
            const container = $('<div>')
                .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_RESOURCE_LIST)
                .appendTo(parent);

            this._renderResourceList(container, list);
        });
    }
}
