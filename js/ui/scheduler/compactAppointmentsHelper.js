import $ from '../../core/renderer';
import Button from '../button';
import { move } from '../../animation/translator';
import messageLocalization from '../../localization/message';
import { FunctionTemplate } from '../../core/templates/function_template';
import { when } from '../../core/utils/deferred';
import { extendFromObject } from '../../core/utils/extend';
import { getBoundingRect } from '../../core/utils/position';
import { AppointmentTooltipInfo } from './dataStructures';
import { LIST_ITEM_DATA_KEY, LIST_ITEM_CLASS } from './constants';


const APPOINTMENT_COLLECTOR_CLASS = 'dx-scheduler-appointment-collector';
const COMPACT_APPOINTMENT_COLLECTOR_CLASS = APPOINTMENT_COLLECTOR_CLASS + '-compact';
const APPOINTMENT_COLLECTOR_CONTENT_CLASS = APPOINTMENT_COLLECTOR_CLASS + '-content';

const WEEK_VIEW_COLLECTOR_OFFSET = 5;
const COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;

export class CompactAppointmentsHelper {
    constructor(instance) {
        this.instance = instance;
        this.elements = [];
    }

    render(options) {
        const { isCompact, items, buttonColor } = options;

        const template = this._createTemplate(items.data.length, isCompact);
        const button = this._createCompactButton(template, options);
        const $button = button.$element();

        this._makeBackgroundColor($button, items.colors, buttonColor);
        this._makeBackgroundDarker($button);

        this.elements.push($button);
        $button.data('items', this._createTooltipInfos(items));

        return $button;
    }

    clear() {
        this.elements.forEach(button => {
            button.detach();
            button.remove();
        });
        this.elements = [];
    }

    _createTooltipInfos(items) {
        return items.data.map((appointment, index) => {
            const targetedAdapter = this.instance.createAppointmentAdapter(appointment).clone();

            if(items.settings?.length > 0) {
                const { info } = items.settings[index];
                targetedAdapter.startDate = info.sourceAppointment.startDate;
                targetedAdapter.endDate = info.sourceAppointment.endDate;
            }

            return new AppointmentTooltipInfo(appointment, targetedAdapter.source(), items.colors[index], items.settings[index]);
        });
    }

    _onButtonClick(e, options) {
        const $button = $(e.element);
        this.instance.showAppointmentTooltipCore(
            $button,
            $button.data('items'),
            this._getExtraOptionsForTooltip(options)
        );
    }

    _getExtraOptionsForTooltip(options) {
        return {
            clickEvent: this._clickEvent(options.onAppointmentClick).bind(this),
            dragBehavior: options.allowDrag && this._createTooltipDragBehavior().bind(this),
            dropDownAppointmentTemplate: this.instance.option().dropDownAppointmentTemplate, // deprecated option
            isButtonClick: true
        };
    }

    _clickEvent(onAppointmentClick) {
        return (e) => {
            const config = {
                itemData: e.itemData.appointment,
                itemElement: e.itemElement
            };

            const createClickEvent = extendFromObject(this.instance.fire('mapAppointmentFields', config), e, false);
            delete createClickEvent.itemData;
            delete createClickEvent.itemIndex;
            delete createClickEvent.itemElement;
            onAppointmentClick(createClickEvent);
        };
    }

    _createTooltipDragBehavior() {
        return (e) => {
            const $element = $(e.element);
            const workSpace = this.instance.getWorkSpace();

            const getItemData = (itemElement) => $(itemElement).data(LIST_ITEM_DATA_KEY)?.appointment;
            const getItemSettings = (_, event) => event.itemSettings;
            const options = {
                filter: `.${LIST_ITEM_CLASS}`,
                isSetCursorOffset: true,
            };

            workSpace._createDragBehaviorBase($element, getItemData, getItemSettings, options);
        };
    }

    _getCollectorOffset(width, cellWidth) {
        return cellWidth - width - this._getCollectorRightOffset();
    }

    _getCollectorRightOffset() {
        return this.instance.getRenderingStrategyInstance()._isCompactTheme() ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET : WEEK_VIEW_COLLECTOR_OFFSET;
    }

    _makeBackgroundDarker(button) {
        button.css('boxShadow', `inset ${getBoundingRect(button.get(0)).width}px 0 0 0 rgba(0, 0, 0, 0.3)`);
    }

    _makeBackgroundColor($button, colors, color) {
        when.apply(null, colors).done(function() {
            this._makeBackgroundColorCore($button, color, arguments);
        }.bind(this));
    }

    _makeBackgroundColorCore($button, color, itemsColors) {
        let paintButton = true;
        let currentItemColor;

        color && color.done(function(color) {
            if(itemsColors.length) {
                currentItemColor = itemsColors[0];

                for(let i = 1; i < itemsColors.length; i++) {
                    if(currentItemColor !== itemsColors[i]) {
                        paintButton = false;
                        break;
                    }
                    currentItemColor = color;
                }
            }
            color && paintButton && $button.css('backgroundColor', color);
        }.bind(this));
    }

    _setPosition(element, position) {
        move(element, {
            top: position.top,
            left: position.left
        });
    }

    _createCompactButton(template, options) {
        const $button = this._createCompactButtonElement(options);

        return this.instance._createComponent($button, Button, {
            type: 'default',
            width: options.width,
            height: options.height,
            onClick: (e) => this._onButtonClick(e, options),
            template: this._renderTemplate(template, options.items, options.isCompact)
        });
    }

    _createCompactButtonElement({ isCompact, $container, width, coordinates, applyOffset, cellWidth }) {
        const result = $('<div>')
            .addClass(APPOINTMENT_COLLECTOR_CLASS)
            .toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact)
            .appendTo($container);

        const offset = applyOffset ? this._getCollectorOffset(width, cellWidth) : 0;
        this._setPosition(result, { top: coordinates.top, left: coordinates.left + offset });

        return result;
    }

    _renderTemplate(template, items, isCompact) {
        return new FunctionTemplate(options => {
            return template.render({
                model: {
                    appointmentCount: items.data.length,
                    isCompact: isCompact
                },
                container: options.container
            });
        });
    }

    _createTemplate(count, isCompact) {
        this._initButtonTemplate(count, isCompact);
        return this.instance._getAppointmentTemplate('appointmentCollectorTemplate');
    }

    _initButtonTemplate(count, isCompact) {
        this.instance._templateManager.addDefaultTemplates({
            appointmentCollector: new FunctionTemplate(options =>
                this._createButtonTemplate(count, $(options.container), isCompact)
            )
        });
    }

    _createButtonTemplate(appointmentCount, element, isCompact) {
        const text = isCompact ? appointmentCount : messageLocalization.getFormatter('dxScheduler-moreAppointments')(appointmentCount);

        return element
            .append($('<span>').text(text))
            .addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS);
    }
}
