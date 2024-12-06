/* eslint-disable max-classes-per-file */
import { move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import DOMComponent from '@js/core/dom_component';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { Deferred } from '@js/core/utils/deferred';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import Resizable from '@js/ui/resizable';
import { hide, show } from '@ts/ui/tooltip/m_tooltip';

import {
  ALL_DAY_APPOINTMENT_CLASS,
  APPOINTMENT_CONTENT_CLASSES,
  APPOINTMENT_DRAG_SOURCE_CLASS,
  APPOINTMENT_HAS_RESOURCE_COLOR_CLASS,
  DIRECTION_APPOINTMENT_CLASSES,
  EMPTY_APPOINTMENT_CLASS,
  RECURRENCE_APPOINTMENT_CLASS,
  REDUCED_APPOINTMENT_CLASS,
  REDUCED_APPOINTMENT_ICON,
  REDUCED_APPOINTMENT_PARTS_CLASSES,
} from '../m_classes';
import { ExpressionUtils } from '../m_expression_utils';
import { getRecurrenceProcessor } from '../m_recurrence';

const DEFAULT_HORIZONTAL_HANDLES = 'left right';
const DEFAULT_VERTICAL_HANDLES = 'top bottom';

const REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME = addNamespace(pointerEvents.enter, 'dxSchedulerAppointment');
const REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME = addNamespace(pointerEvents.leave, 'dxSchedulerAppointment');

export class Appointment extends DOMComponent {
  get coloredElement(): any {
    return this.$element();
  }

  get rawAppointment() {
    return this.option('data');
  }

  _getDefaultOptions() {
    // @ts-expect-error
    return extend(super._getDefaultOptions(), {
      data: {},
      groupIndex: -1,
      groups: [],
      geometry: {
        top: 0, left: 0, width: 0, height: 0,
      },
      allowDrag: true,
      allowResize: true,
      reduced: null,
      isCompact: false,
      direction: 'vertical',
      resizableConfig: { keepAspectRatio: false },
      cellHeight: 0,
      cellWidth: 0,
      isDragSource: false,
    });
  }

  notifyObserver(subject, args) {
    const observer: any = this.option('observer');
    if (observer) {
      observer.fire(subject, args);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  invoke(funcName: string) {
    const observer: any = this.option('observer');

    if (observer) {
      return observer.fire.apply(observer, arguments);
    }
  }

  _optionChanged(args) {
    switch (args.name) {
      case 'data':
      case 'groupIndex':
      case 'groupTexts':
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
        // @ts-expect-error
        super._optionChanged(args);
    }
  }

  _getHorizontalResizingRule() {
    const reducedHandles = {
      head: this.option('rtlEnabled') ? 'right' : 'left',
      body: '',
      tail: this.option('rtlEnabled') ? 'left' : 'right',
    };
    const getResizableStep: any = this.option('getResizableStep');
    const step = getResizableStep ? getResizableStep() : 0;

    return {
      handles: this.option('reduced') ? reducedHandles[this.option('reduced') as any] : DEFAULT_HORIZONTAL_HANDLES,
      minHeight: 0,
      minWidth: this.invoke('getCellWidth'),
      step,
      roundStepValue: false,
    };
  }

  _getVerticalResizingRule() {
    const height = Math.round(this.invoke('getCellHeight'));

    return {
      handles: DEFAULT_VERTICAL_HANDLES,
      minWidth: 0,
      minHeight: height,
      step: height,
      roundStepValue: true,
    };
  }

  _render() {
    // @ts-expect-error
    super._render();

    this._renderAppointmentGeometry();
    this._renderAriaLabel();
    this._renderEmptyClass();
    this._renderReducedAppointment();
    this._renderAllDayClass();
    this._renderDragSourceClass();
    this._renderDirection();

    (this.$element() as any).data('dxAppointmentStartDate', this.option('startDate'));
    (this.$element() as any).attr('role', 'application');

    this._renderRecurrenceClass();
    this._renderResizable();

    this._setResourceColor();
  }

  _setResourceColor() {
    const appointmentConfig = {
      itemData: this.rawAppointment,
      groupIndex: this.option('groupIndex'),
      groups: this.option('groups'),
    };

    const deferredColor = (this.option('getAppointmentColor') as any)(appointmentConfig);

    deferredColor.done((color) => {
      if (color) {
        this.coloredElement.css('backgroundColor', color);
        this.coloredElement.addClass(APPOINTMENT_HAS_RESOURCE_COLOR_CLASS);
      }
    });
  }

  _getGroupText() {
    const groupTexts = this.option('groupTexts') as string[];
    if (!groupTexts?.length) {
      return '';
    }

    const groupText = groupTexts.join(', ');
    // @ts-expect-error
    return messageLocalization.format('dxScheduler-appointmentAriaLabel-group', groupText);
  }

  _getDateText() {
    const startDateText = this._localizeDate(this._getStartDate());
    const endDateText = this._localizeDate(this._getEndDate());

    const dateText = startDateText === endDateText
      ? `${startDateText}`
      : `${startDateText} - ${endDateText}`;

    // @ts-expect-error
    const { partIndex, partTotalCount } = this.option();
    const partText = isDefined(partIndex) ? ` (${partIndex + 1}/${partTotalCount})` : '';

    return `${dateText}${partText}`;
  }

  _renderAriaLabel() {
    // @ts-expect-error
    const $element: dxElementWrapper = this.$element();
    const ariaLabel = [
      this._getDateText(),
      this._getGroupText(),
    ]
      .filter((label) => !!label)
      .join(', ');
    $element.attr('aria-roledescription', `${ariaLabel}, `);

    const id = `dx-${new Guid()}`;

    $element.attr('aria-describedby', id);
    $element.find('.dx-item-content').attr('id', id);
  }

  _renderAppointmentGeometry() {
    const geometry: any = this.option('geometry');
    const $element: any = this.$element();
    move($element, {
      top: geometry.top,
      left: geometry.left,
    });

    $element.css({
      width: geometry.width < 0 ? 0 : geometry.width,
      height: geometry.height < 0 ? 0 : geometry.height,
    });
  }

  _renderEmptyClass() {
    const geometry: any = this.option('geometry');

    if (geometry.empty || this.option('isCompact')) {
      (this.$element() as any).addClass(EMPTY_APPOINTMENT_CLASS);
    }
  }

  _renderReducedAppointment() {
    const reducedPart: any = this.option('reduced');

    if (!reducedPart) {
      return;
    }

    (this.$element() as any)
      .toggleClass(REDUCED_APPOINTMENT_CLASS, true)
      .toggleClass(REDUCED_APPOINTMENT_PARTS_CLASSES[reducedPart], true);

    this._renderAppointmentReducedIcon();
  }

  _localizeDate(date) {
    return `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`;
  }

  _renderAppointmentReducedIcon() {
    const $icon = $('<div>')
      .addClass(REDUCED_APPOINTMENT_ICON)
      .appendTo(this.$element());

    const endDate = this._getEndDate();
    const tooltipLabel = messageLocalization.format('dxScheduler-editorLabelEndDate');
    const tooltipText = [tooltipLabel, ': ', this._localizeDate(endDate)].join('');

    eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME);
    eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME, () => {
      show({
        target: $icon,
        content: tooltipText,
      });
    });
    eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME);
    eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME, () => {
      hide();
    });
  }

  _getDate(propName: 'endDate' | 'startDate') {
    const result = ExpressionUtils.getField(this.option('dataAccessors'), propName, this.rawAppointment);
    if (!result) {
      return result;
    }

    const date = new Date(result);
    const timeZoneCalculator = this.option('timeZoneCalculator') as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return timeZoneCalculator
      ? timeZoneCalculator.createDate(date, { path: 'toGrid' })
      : date;
  }

  _getEndDate() {
    return this._getDate('endDate');
  }

  _getStartDate() {
    return this._getDate('startDate');
  }

  _renderAllDayClass() {
    (this.$element() as any).toggleClass(ALL_DAY_APPOINTMENT_CLASS, !!this.option('allDay'));
  }

  _renderDragSourceClass() {
    (this.$element() as any).toggleClass(APPOINTMENT_DRAG_SOURCE_CLASS, !!this.option('isDragSource'));
  }

  _renderRecurrenceClass() {
    const rule = ExpressionUtils.getField(this.option('dataAccessors'), 'recurrenceRule', this.rawAppointment);

    if (getRecurrenceProcessor().isValidRecurrenceRule(rule)) {
      (this.$element() as any).addClass(RECURRENCE_APPOINTMENT_CLASS);
    }
  }

  _renderDirection() {
    (this.$element() as any).addClass(DIRECTION_APPOINTMENT_CLASSES[this.option('direction') as any]);
  }

  _createResizingConfig() {
    const config: any = this.option('direction') === 'vertical' ? this._getVerticalResizingRule() : this._getHorizontalResizingRule();

    if (!this.invoke('isGroupedByDate')) {
      config.stepPrecision = 'strict';
    }

    return config;
  }

  _renderResizable() {
    if (this.option('allowResize')) {
      // @ts-expect-error
      this._createComponent(
        this.$element(),
        Resizable,
        extend(
          this._createResizingConfig(),
          this.option('resizableConfig'),
        ),
      );
    }
  }

  _useTemplates() {
    return false;
  }
}

registerComponent('dxSchedulerAppointment', Appointment);

export class AgendaAppointment extends Appointment {
  get coloredElement() {
    return (this.$element() as any).find(`.${APPOINTMENT_CONTENT_CLASSES.AGENDA_MARKER}`);
  }

  _getDefaultOptions() {
    return extend(super._getDefaultOptions(), {
      // @ts-expect-error
      createPlainResourceListAsync: new Deferred(),
    });
  }

  _renderResourceList(container, list) {
    list.forEach((item) => {
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

    const createPlainResourceListAsync: any = this.option('createPlainResourceListAsync');
    createPlainResourceListAsync(this.rawAppointment).done((list) => {
      const parent = (this.$element() as any).find(`.${APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS}`);
      const container = $('<div>')
        .addClass(APPOINTMENT_CONTENT_CLASSES.AGENDA_RESOURCE_LIST)
        .appendTo(parent);

      this._renderResourceList(container, list);
    });
  }
}
