import Button from '../../button';
import dateUtils from '../../../core/utils/date';
import { FunctionTemplate } from '../../../core/templates/function_template';
import $ from '../../../core/renderer';
import List from '../../list/ui.list.edit';

const TOOLTIP_APPOINTMENT_ITEM = 'dx-tooltip-appointment-item',
    TOOLTIP_APPOINTMENT_ITEM_CONTENT = TOOLTIP_APPOINTMENT_ITEM + '-content',
    TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT = TOOLTIP_APPOINTMENT_ITEM + '-content-subject',
    TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE = TOOLTIP_APPOINTMENT_ITEM + '-content-date',
    TOOLTIP_APPOINTMENT_ITEM_MARKER = TOOLTIP_APPOINTMENT_ITEM + '-marker',
    TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY = TOOLTIP_APPOINTMENT_ITEM + '-marker-body',

    TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER = TOOLTIP_APPOINTMENT_ITEM + '-delete-button-container',
    TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON = TOOLTIP_APPOINTMENT_ITEM + '-delete-button';

export class TooltipStrategyBase {
    constructor(scheduler) {
        this.scheduler = scheduler;
        this.tooltip = null;
        this._clickEvent = null;
    }

    show(target, dataList, clickEvent, drag) {
        if(this._canShowTooltip(dataList)) {
            this.hide();
            this._clickEvent = clickEvent;
            this._drag = drag;
            this._showCore(target, dataList);
        }
    }

    _showCore(target, dataList) {
        if(!this.tooltip) {
            this.tooltip = this._createTooltip(target, dataList);
        } else {
            this._shouldUseTarget() && this.tooltip.option('target', target);
            this._list.option('dataSource', dataList);
        }

        this.tooltip.option('visible', true);
    }

    _getContentTemplate(dataList) {
        return container => {
            const listElement = $('<div>');
            $(container).append(listElement);
            this._list = this._createList(listElement, dataList);
        };
    }

    _onShown() {
        this._list.option('focusStateEnabled', this.scheduler.option('focusStateEnabled'));
    }

    dispose() {
    }

    hide() {
        if(this.tooltip) {
            this.tooltip.option('visible', false);
        }
    }

    _shouldUseTarget() {
        return true;
    }

    _createTooltip() {
    }

    _canShowTooltip(dataList) {
        if(!dataList.length) {
            return false;
        }
        return true;
    }

    _createListOption(dataList) {
        return {
            dataSource: dataList,
            onContentReady: this._drag,
            onItemClick: e => this._onListItemClick(e),
            itemTemplate: (item, index) =>
                this._renderTemplate(this.tooltip.option('target'), item.data, item.currentData || item.data, index, item.color),

        };
    }

    _createTooltipElement(wrapperClass) {
        return $("<div>").appendTo(this.scheduler.$element()).addClass(wrapperClass);
    }

    _createList(listElement, dataList) {
        return this.scheduler._createComponent(listElement, List, this._createListOption(dataList));
    }

    _getTargetData(data, $appointment) {
        return this.scheduler.fire('getTargetedAppointmentData', data, $appointment);
    }

    _renderTemplate(target, data, currentData, index, color) {
        this.scheduler.setDefaultTemplate(
            this._getItemListTemplateName(),
            new FunctionTemplate(options => {
                const $container = $(options.container);
                $container.append(this._createItemListContent(data, currentData, color));
                return $container;
            }));
        const template = this.scheduler._getAppointmentTemplate(this._getItemListTemplateName() + 'Template');
        return this._createFunctionTemplate(template, data, this._getTargetData(data, target), index);
    }

    _createFunctionTemplate(template, data, targetData, index) {
        return new FunctionTemplate(options => {
            return template.render({
                model: {
                    appointmentData: data,
                    targetedAppointmentData: targetData
                },
                container: options.container,
                index: index
            });
        });
    }

    _getItemListTemplateName() {
        return 'appointmentTooltip';
    }

    _onListItemClick(e) {
        this.hide();
        if(this._clickEvent) {
            this._clickEvent(e);
        }
        this.scheduler.showAppointmentPopup(e.itemData.data, false, e.itemData.currentData);
    }

    _createItemListContent(data, currentData, color) {
        const editing = this.scheduler.option('editing'),
            isAllDay = this.scheduler.fire('getField', 'allDay', data),
            text = this.scheduler.fire('getField', 'text', data),
            startDateTimeZone = this.scheduler.fire('getField', 'startDateTimeZone', data),
            endDateTimeZone = this.scheduler.fire('getField', 'endDateTimeZone', data),
            startDate = this.scheduler.fire('convertDateByTimezone', this.scheduler.fire('getField', 'startDate', currentData), startDateTimeZone),
            endDate = this.scheduler.fire('convertDateByTimezone', this.scheduler.fire('getField', 'endDate', currentData), endDateTimeZone);

        const $itemElement = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM);
        $itemElement.append(this._createItemListMarker(color));
        $itemElement.append(this._createItemListInfo(text, this._formatDate(startDate, endDate, isAllDay)));

        if(editing && editing.allowDeleting === true || editing === true) {
            $itemElement.append(this._createDeleteButton(data, currentData));
        }

        return $itemElement;
    }

    _createItemListMarker(color) {
        const $marker = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER);
        const $markerBody = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY);

        $marker.append($markerBody);
        color && color.done(value => $markerBody.css('background', value));

        return $marker;
    }

    _createItemListInfo(text, formattedDate) {
        const result = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT);
        const $title = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT).text(text);
        const $date = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE).text(formattedDate);

        return result.append($title).append($date);
    }

    _createDeleteButton(data, currentData) {
        const $container = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER),
            $deleteButton = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON);

        $container.append($deleteButton);
        this.scheduler._createComponent($deleteButton, Button, {
            icon: 'trash',
            stylingMode: 'text',
            onClick: e => {
                this.hide();
                e.event.stopPropagation();

                const startDate = this.scheduler.fire('getField', 'startDate', currentData);
                this.scheduler._checkRecurringAppointment(data, currentData, startDate, () => this.scheduler.deleteAppointment(data), true);
            }
        });

        return $container;
    }

    _formatDate(startDate, endDate, isAllDay) {
        let result = '';

        this.scheduler.fire('formatDates', {
            startDate: startDate,
            endDate: endDate,
            formatType: this._getTypeFormat(startDate, endDate, isAllDay),
            callback: value => result = value
        });

        return result;
    }

    _getTypeFormat(startDate, endDate, isAllDay) {
        if(isAllDay) {
            return 'DATE';
        }
        if(this.scheduler.option('currentView') !== 'month' && dateUtils.sameDate(startDate, endDate)) {
            return 'TIME';
        }
        return 'DATETIME';
    }
}
