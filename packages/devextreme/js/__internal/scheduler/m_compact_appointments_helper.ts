import { locate, move } from '@js/animation/translator';
import $ from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import { when } from '@js/core/utils/deferred';
import { getBoundingRect } from '@js/core/utils/position';
import messageLocalization from '@js/localization/message';
import Button from '@js/ui/button';

import { getOverflowIndicatorColor } from './__migration/utils/index';
import { createAppointmentAdapter } from './m_appointment_adapter';
import { LIST_ITEM_CLASS, LIST_ITEM_DATA_KEY } from './m_constants';
import { AppointmentTooltipInfo } from './m_data_structures';

const APPOINTMENT_COLLECTOR_CLASS = 'dx-scheduler-appointment-collector';
const COMPACT_APPOINTMENT_COLLECTOR_CLASS = `${APPOINTMENT_COLLECTOR_CLASS}-compact`;
const APPOINTMENT_COLLECTOR_CONTENT_CLASS = `${APPOINTMENT_COLLECTOR_CLASS}-content`;

const WEEK_VIEW_COLLECTOR_OFFSET = 5;
const COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET = 1;

export class CompactAppointmentsHelper {
  elements: any[] = [];

  constructor(public instance) {
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
    this.elements.forEach((button) => {
      button.detach();
      button.remove();
    });
    this.elements = [];
  }

  _createTooltipInfos(items) {
    return items.data.map((appointment, index) => {
      const targetedAdapter = createAppointmentAdapter(
        appointment,
        this.instance._dataAccessors,
        this.instance.timeZoneCalculator,
      ).clone();

      if (items.settings?.length > 0) {
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
      this._getExtraOptionsForTooltip(options, $button),
    );
  }

  _getExtraOptionsForTooltip(options, $appointmentCollector) {
    return {
      clickEvent: this._clickEvent(options.onAppointmentClick).bind(this),
      dragBehavior: options.allowDrag && this._createTooltipDragBehavior($appointmentCollector).bind(this),
      dropDownAppointmentTemplate: this.instance.option().dropDownAppointmentTemplate, // TODO deprecated option
      isButtonClick: true,
    };
  }

  _clickEvent(onAppointmentClick) {
    return (e) => {
      const clickEventArgs = this.instance._createEventArgs(e);
      onAppointmentClick(clickEventArgs);
    };
  }

  _createTooltipDragBehavior($appointmentCollector) {
    return (e) => {
      const $element = $(e.element);
      const $schedulerElement = $(this.instance.element());
      const workSpace = this.instance.getWorkSpace();

      const getItemData = (itemElement) => ($(itemElement) as any).data(LIST_ITEM_DATA_KEY)?.appointment;
      const getItemSettings = (_, event) => event.itemSettings;
      const initialPosition = locate($appointmentCollector);

      const options = {
        filter: `.${LIST_ITEM_CLASS}`,
        isSetCursorOffset: true,
        initialPosition,
        getItemData,
        getItemSettings,
      };

      workSpace._createDragBehaviorBase($element, $schedulerElement, options);
    };
  }

  _getCollectorOffset(width, cellWidth) {
    return cellWidth - width - this._getCollectorRightOffset();
  }

  _getCollectorRightOffset() {
    return this.instance.getRenderingStrategyInstance()._isCompactTheme()
      ? COMPACT_THEME_WEEK_VIEW_COLLECTOR_OFFSET
      : WEEK_VIEW_COLLECTOR_OFFSET;
  }

  _makeBackgroundDarker(button) {
    button.css('boxShadow', `inset ${getBoundingRect(button.get(0)).width}px 0 0 0 rgba(0, 0, 0, 0.3)`);
  }

  _makeBackgroundColor($button, colors, color) {
    when.apply(null, colors).done(function () {
      this._makeBackgroundColorCore($button, color, [...arguments]);
    }.bind(this));
  }

  _makeBackgroundColorCore($button, color, itemColors) {
    color && color.done((color) => {
      const backgroundColor = getOverflowIndicatorColor(color, itemColors);
      if (backgroundColor) {
        $button.css('backgroundColor', backgroundColor);
      }
    });
  }

  _setPosition(element, position) {
    move(element, {
      top: position.top,
      left: position.left,
    });
  }

  _createCompactButton(template, options) {
    const $button = this._createCompactButtonElement(options);

    return this.instance._createComponent($button, Button, {
      type: 'default',
      width: options.width,
      height: options.height,
      onClick: (e) => this._onButtonClick(e, options),
      template: this._renderTemplate(template, options.items, options.isCompact),
    });
  }

  _createCompactButtonElement({ isCompact, $container, coordinates }) {
    const result = $('<div>')
      .addClass(APPOINTMENT_COLLECTOR_CLASS)
      .toggleClass(COMPACT_APPOINTMENT_COLLECTOR_CLASS, isCompact)
      .appendTo($container);

    this._setPosition(result, coordinates);

    return result;
  }

  _renderTemplate(template, items, isCompact) {
    return new (FunctionTemplate as any)((options) => template.render({
      model: {
        appointmentCount: items.data.length,
        isCompact,
      },
      container: options.container,
    }));
  }

  _createTemplate(count, isCompact) {
    this._initButtonTemplate(count, isCompact);
    return this.instance._getAppointmentTemplate('appointmentCollectorTemplate');
  }

  _initButtonTemplate(count, isCompact) {
    this.instance._templateManager.addDefaultTemplates({
      appointmentCollector: new (FunctionTemplate as any)((options) => this._createButtonTemplate(count, $(options.container), isCompact)),
    });
  }

  _createButtonTemplate(appointmentCount, element, isCompact) {
    const text = isCompact
      ? appointmentCount
      : (messageLocalization.getFormatter('dxScheduler-moreAppointments') as any)(appointmentCount);

    return element
      .append($('<span>').text(text))
      .addClass(APPOINTMENT_COLLECTOR_CONTENT_CLASS);
  }
}
