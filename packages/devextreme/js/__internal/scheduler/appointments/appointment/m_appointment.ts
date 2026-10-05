import { move } from '@js/common/core/animation/translator';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointerEvents from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import registerComponent from '@js/core/component_registrator';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import DOMComponent from '@ts/core/widget/dom_component';
import type { OptionChanged } from '@ts/core/widget/types';
import Resizable from '@ts/ui/resizable/resizable';
import { hide, show } from '@ts/ui/tooltip/tooltip';

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
} from '../../classes';
import type { SubscribeKey, SubscribeMethods } from '../../m_subscribes';
import { validateRRule } from '../../recurrence/validate_rule';
import type { SafeAppointment } from '../../types';
import type { AppointmentDataAccessor } from '../../utils/data_accessor/appointment_data_accessor';
import type { AppointmentProperties, AppointmentReducedPart } from './m_types';
import {
  getAriaDescription,
  getAriaLabel,
  getReducedIconTooltip,
} from './text_utils';

const DEFAULT_HORIZONTAL_HANDLES = 'left right';
const DEFAULT_VERTICAL_HANDLES = 'top bottom';

const REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME = addNamespace(pointerEvents.enter, 'dxSchedulerAppointment');
const REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME = addNamespace(pointerEvents.leave, 'dxSchedulerAppointment');

interface ResizingRule {
  handles: string;
  minWidth: number;
  minHeight: number;
  step: number;
  roundStepValue: boolean;
  stepPrecision?: string;
}

export class Appointment extends DOMComponent<Appointment, AppointmentProperties> {
  get coloredElement(): dxElementWrapper {
    return this.$element();
  }

  get rawAppointment(): SafeAppointment {
    return this.option('data');
  }

  get dataAccessors(): AppointmentDataAccessor {
    return this.option('dataAccessors');
  }

  _getDefaultOptions(): AppointmentProperties {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
      hideReducedIcon: false,
      isCompact: false,
      direction: 'vertical',
      resizableConfig: { keepAspectRatio: false },
      cellHeight: 0,
      cellWidth: 0,
      isDragSource: false,
    });
  }

  notifyObserver<Subject extends SubscribeKey>(
    funcName: Subject,
    args: Parameters<SubscribeMethods[Subject]>,
  ): void {
    this.invoke(funcName, ...args);
  }

  invoke<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]>;

  invoke<Subject extends SubscribeKey>(
    funcName: Subject,
    ...args: Parameters<SubscribeMethods[Subject]>
  ): ReturnType<SubscribeMethods[Subject]> | undefined {
    const notifyScheduler = this.option('notifyScheduler');

    if (!notifyScheduler) {
      return undefined;
    }

    return notifyScheduler.invoke(funcName, ...args);
  }

  _optionChanged(args: OptionChanged<AppointmentProperties>): void {
    switch (args.name) {
      case 'data':
      case 'groupIndex':
      case 'groupTexts':
      case 'geometry':
      case 'allowDrag':
      case 'allowResize':
      case 'reduced':
      case 'hideReducedIcon':
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

  _getHorizontalResizingRule(): ResizingRule {
    const reducedHandles = {
      head: this.option('rtlEnabled') ? 'right' : 'left',
      body: '',
      tail: this.option('rtlEnabled') ? 'left' : 'right',
    };
    const getResizableStep = this.option('getResizableStep');
    const step = getResizableStep ? getResizableStep() : 0;

    return {
      handles: this.option('reduced') ? reducedHandles[this.option('reduced') as AppointmentReducedPart] : DEFAULT_HORIZONTAL_HANDLES,
      minHeight: 0,
      minWidth: this.invoke('getCellWidth'),
      step,
      roundStepValue: false,
    };
  }

  _getVerticalResizingRule(): ResizingRule {
    const height = Math.round(this.invoke('getCellHeight'));

    return {
      handles: DEFAULT_VERTICAL_HANDLES,
      minWidth: 0,
      minHeight: height,
      step: height,
      roundStepValue: true,
    };
  }

  _render(): void {
    super._render();

    this._renderAppointmentGeometry();
    this._renderAriaLabel();
    this._renderEmptyClass();
    this._renderReducedAppointment();
    this._renderAllDayClass();
    this._renderDragSourceClass();
    this._renderDirection();

    this.$element().data('dxAppointmentStartDate', this.option('startDate'));
    this.$element().attr('role', 'button');

    this._renderRecurrenceClass();
    this._renderResizable();

    this._setResourceColor();
  }

  _setResourceColor(): void {
    const appointmentConfig = {
      itemData: this.rawAppointment,
      groupIndex: this.option('groupIndex') ?? 0,
    };
    const resourceManager = this.option('getResourceManager')();

    // eslint-disable-next-line no-void
    void resourceManager.getAppointmentColor(appointmentConfig)
      .then((color) => {
        if (color) {
          this.coloredElement.css('backgroundColor', color);
          this.coloredElement.addClass(APPOINTMENT_HAS_RESOURCE_COLOR_CLASS);
        }
      });
  }

  _renderAriaLabel(): void {
    const $element: dxElementWrapper = this.$element();
    $element.attr('aria-label', getAriaLabel(this.option()));

    // eslint-disable-next-line no-void
    void getAriaDescription(this.option())
      .then((text) => {
        const $description = $element.find(`.${APPOINTMENT_CONTENT_CLASSES.ARIA_DESCRIPTION}`);

        if (!text || !$description.length) {
          return;
        }

        const id = `dx-${new Guid()}`;
        $element.attr('aria-describedby', id);
        $description.text(text).attr('id', id);
      });
  }

  _renderAppointmentGeometry(): void {
    const geometry = this.option('geometry');
    const $element = this.$element();
    move($element, {
      top: geometry.top,
      left: geometry.left,
    });

    $element.css({
      width: geometry.width < 0 ? 0 : geometry.width,
      height: geometry.height < 0 ? 0 : geometry.height,
    });
  }

  _renderEmptyClass(): void {
    const geometry = this.option('geometry');

    if (geometry.empty || this.option('isCompact')) {
      this.$element().addClass(EMPTY_APPOINTMENT_CLASS);
    }
  }

  _renderReducedAppointment(): void {
    const reducedPart = this.option('reduced');

    if (!reducedPart || this.option('hideReducedIcon')) {
      return;
    }

    this.$element()
      .toggleClass(REDUCED_APPOINTMENT_CLASS, true)
      .toggleClass(REDUCED_APPOINTMENT_PARTS_CLASSES[reducedPart], true);

    this._renderAppointmentReducedIcon();
  }

  _renderAppointmentReducedIcon(): void {
    const $icon = $('<div>')
      .addClass(REDUCED_APPOINTMENT_ICON)
      .appendTo(this.$element());

    eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME);
    eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERENTER_EVENT_NAME, () => {
      // eslint-disable-next-line no-void
      void show({
        target: $icon.get(0),
        content: getReducedIconTooltip(this.option()),
      });
    });
    eventsEngine.off($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME);
    eventsEngine.on($icon, REDUCED_APPOINTMENT_POINTERLEAVE_EVENT_NAME, () => {
      // eslint-disable-next-line no-void
      void hide();
    });
  }

  _renderAllDayClass(): void {
    this.$element().toggleClass(ALL_DAY_APPOINTMENT_CLASS, Boolean(this.option('allDay')));
  }

  _renderDragSourceClass(): void {
    this.$element().toggleClass(APPOINTMENT_DRAG_SOURCE_CLASS, Boolean(this.option('isDragSource')));
  }

  _renderRecurrenceClass(): void {
    const rule = this.dataAccessors.get('recurrenceRule', this.rawAppointment);

    if (validateRRule(rule)) {
      this.$element().addClass(RECURRENCE_APPOINTMENT_CLASS);
    }
  }

  _renderDirection(): void {
    this.$element().addClass(DIRECTION_APPOINTMENT_CLASSES[this.option('direction')]);
  }

  _createResizingConfig(): ResizingRule {
    const config: ResizingRule = this.option('direction') === 'vertical' ? this._getVerticalResizingRule() : this._getHorizontalResizingRule();

    const cellHeight = Math.round(this.invoke('getCellHeight') ?? 0);
    const allDayHeight = Math.round(this.invoke('getAllDayHeight') ?? 0);
    const allDayBreaksCellGrid = Boolean(this.invoke('isVerticalGroupedWorkSpace'))
      && allDayHeight > 0
      && allDayHeight !== cellHeight;

    if (!this.invoke('isGroupedByDate') && !allDayBreaksCellGrid) {
      config.stepPrecision = 'strict';
    }

    return config;
  }

  _renderResizable(): void {
    if (this.option('allowResize')) {
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

  _useTemplates(): boolean {
    return false;
  }
}

registerComponent('dxSchedulerAppointment', Appointment);
