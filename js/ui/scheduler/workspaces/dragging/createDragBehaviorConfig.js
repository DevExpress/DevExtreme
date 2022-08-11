import $ from '../../../../core/renderer';
import { compileGetter } from '../../../../core/utils/data';
import { resetPosition, locate } from '../../../../animation/translator';
import {
    getHeight,
    getWidth,
} from '../../../../core/utils/size';
import { getBoundingRect } from '../../../../core/utils/position';
import domAdapter from '../../../../core/dom_adapter';

const DATE_TABLE_CELL_CLASS = 'dx-scheduler-date-table-cell';
const ALL_DAY_TABLE_CELL_CLASS = 'dx-scheduler-all-day-table-cell';
const DATE_TABLE_DROPPABLE_CELL_CLASS = 'dx-scheduler-date-table-droppable-cell';

export const createDragBehaviorConfig = (
    container,
    isDefaultDraggingMode,
    dragBehavior,
    enableDefaultDragging,
    disableDefaultDragging,
    getDroppableCell,
    getDateTables,
    removeDroppableCellClass,
    getCellWidth,
    options) => {

    const state = {
        dragElement: undefined,
        itemData: undefined,
    };

    const isItemDisabled = () => {
        const { itemData } = state;

        if(itemData) {
            const getter = compileGetter('disabled');
            return getter(itemData);
        }

        return true;
    };

    const createDragAppointment = (itemData, settings, appointments) => {
        const appointmentIndex = appointments.option('items').length;

        settings.isCompact = false;
        settings.virtual = false;

        const items = appointments._renderItem(appointmentIndex, {
            itemData,
            settings: [settings]
        });

        return items[0];
    };

    const onDragStart = e => {
        if(!isDefaultDraggingMode) {
            disableDefaultDragging();
        }

        const canceled = e.cancel;
        const event = e.event;
        const $itemElement = $(e.itemElement);
        const appointments = e.component._appointments;

        state.itemData = options.getItemData(e.itemElement, appointments);
        const settings = options.getItemSettings($itemElement, e);
        const initialPosition = options.initialPosition;

        if(!isItemDisabled()) {
            event.data = event.data || {};
            if(!canceled) {
                if(!settings.isCompact) {
                    dragBehavior.updateDragSource(state.itemData, settings);
                }

                state.dragElement = createDragAppointment(state.itemData, settings, appointments);

                event.data.itemElement = state.dragElement;
                event.data.initialPosition = initialPosition ?? locate($(state.dragElement));
                event.data.itemData = state.itemData;
                event.data.itemSettings = settings;

                dragBehavior.onDragStart(event.data);

                resetPosition($(state.dragElement));
            }
        }
    };

    const onDragMove = () => {
        if(isDefaultDraggingMode) {
            return;
        }

        const MOUSE_IDENT = 10;

        const appointmentWidth = getWidth(state.dragElement);
        const cellWidth = getCellWidth();
        const isWideAppointment = appointmentWidth > cellWidth;

        const dragElementContainer = $(state.dragElement).parent();
        const boundingRect = getBoundingRect(dragElementContainer.get(0));

        const newX = boundingRect.left + MOUSE_IDENT;
        const newY = boundingRect.top + MOUSE_IDENT;

        const elements = isWideAppointment ?
            domAdapter.elementsFromPoint(newX, newY) :
            domAdapter.elementsFromPoint(newX + appointmentWidth / 2, newY);

        const dateTables = getDateTables();
        const droppableCell = elements.find(el => {
            const classList = el.classList;

            const isCurrentSchedulerElement = dateTables.find(el).length === 1;

            return isCurrentSchedulerElement &&
                (
                    classList.contains(DATE_TABLE_CELL_CLASS) ||
                    classList.contains(ALL_DAY_TABLE_CELL_CLASS)
                );
        });

        if(droppableCell) {
            const oldDroppableCell = getDroppableCell();

            if(!oldDroppableCell.is(droppableCell)) {
                removeDroppableCellClass();
            }

            $(droppableCell).addClass(DATE_TABLE_DROPPABLE_CELL_CLASS);
        }
    };

    const onDragEnd = e => {
        if(!isDefaultDraggingMode) {
            enableDefaultDragging();
        }

        if(!isItemDisabled()) {
            dragBehavior.onDragEnd(e);
        }

        state.dragElement?.remove();
        removeDroppableCellClass();
    };

    const cursorOffset = options.isSetCursorOffset
        ? () => {
            const $dragElement = $(state.dragElement);
            return {
                x: getWidth($dragElement) / 2,
                y: getHeight($dragElement) / 2
            };
        }
        : undefined;

    return {
        container,
        dragTemplate: () => state.dragElement,
        onDragStart,
        onDragMove,
        onDragEnd,
        cursorOffset,
        filter: options.filter
    };
};
