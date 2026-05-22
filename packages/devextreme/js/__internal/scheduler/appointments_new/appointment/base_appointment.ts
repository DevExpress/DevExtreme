import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { DxEvent } from '@js/events';
import eventsEngine from '@js/events/core/events_engine';
import { addNamespace } from '@js/events/utils';
import type { AppointmentRenderedEvent } from '@js/ui/scheduler';
import { getPublicElement } from '@ts/core/m_element';
import { EmptyTemplate } from '@ts/core/templates/m_empty_template';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import type { TemplateBase } from '@ts/core/templates/m_template_base';
import { dxClick } from '@ts/events/m_short';
import type { SafeAppointment, TargetedAppointment } from '@ts/scheduler/types';
import type { AppointmentDataAccessor } from '@ts/scheduler/utils/data_accessor/appointment_data_accessor';

import { APPOINTMENT_CLASSES, APPOINTMENT_TYPE_CLASSES, FOCUSED_STATE_CLASS } from '../const';
import { DateFormatType, getDateTextFromTargetAppointment } from '../utils/get_date_text';
import { EVENTS_NAMESPACE, ViewItem, type ViewItemProperties } from '../view_item';

const DOUBLE_CLICK_EVENT_NAME = addNamespace('dxdblclick', EVENTS_NAMESPACE.namespace);

export interface BaseAppointmentViewProperties
  extends ViewItemProperties {
  index: number;
  appointmentData: SafeAppointment;
  targetedAppointmentData: TargetedAppointment;
  appointmentTemplate: TemplateBase;

  onRendered: (e: AppointmentRenderedEvent) => void;
  onClick: (appointmentView: BaseAppointmentView, event: DxEvent) => void;
  onDblClick: (appointmentView: BaseAppointmentView, event: DxEvent) => void;

  getDataAccessor: () => AppointmentDataAccessor;
  getResourceColor: () => Promise<string | undefined>;
}

export class BaseAppointmentView<
  TProperties extends BaseAppointmentViewProperties = BaseAppointmentViewProperties,
> extends ViewItem<TProperties> {
  public get targetedAppointmentData(): TargetedAppointment {
    return this.option().targetedAppointmentData;
  }

  public get appointmentData(): SafeAppointment {
    return this.option().appointmentData;
  }

  private defaultAppointmentTemplate!: FunctionTemplate;

  override _setOptionsByReference(): void {
    super._setOptionsByReference();

    // Note: appointmentData object is used as a key in dataSource
    this._optionsByReference = {
      ...this._optionsByReference,
      appointmentData: true,
      targetedAppointmentData: true,
    };
  }

  override _init(): void {
    super._init();

    this.defaultAppointmentTemplate = new FunctionTemplate((options) => {
      this.defaultAppointmentContent($(options.container));
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.resize();
    this.applyElementClasses();
    this.applyAria();
    this.attachFocusEvents();
    this.attachClickEvent();
    this.attachDblClickEvent();
    this.attachKeydownEvents();
    this.renderContentTemplate();
  }

  override _dispose(): void {
    super._dispose();

    dxClick.off(this.$element(), EVENTS_NAMESPACE);
    eventsEngine.off(this.$element(), DOUBLE_CLICK_EVENT_NAME);
  }

  protected applyElementClasses(): void {
    this.$element()
      .addClass(APPOINTMENT_CLASSES.CONTAINER)
      .toggleClass(APPOINTMENT_TYPE_CLASSES.RECURRING, this.isRecurring())
      .toggleClass(APPOINTMENT_TYPE_CLASSES.ALL_DAY, this.isAllDay());
  }

  protected applyAria(): void {
    this.$element()
      .attr('role', 'button')
      .attr('tabindex', this.option().tabIndex);
  }

  private attachClickEvent(): void {
    dxClick.off(this.$element(), EVENTS_NAMESPACE);
    dxClick.on(
      this.$element(),
      (event: DxEvent<MouseEvent>) => this.option().onClick(this, event),
      EVENTS_NAMESPACE,
    );
  }

  private attachDblClickEvent(): void {
    eventsEngine.off(this.$element(), DOUBLE_CLICK_EVENT_NAME);
    eventsEngine.on(
      this.$element(),
      DOUBLE_CLICK_EVENT_NAME,
      (event: DxEvent<MouseEvent>) => this.option().onDblClick(this, event),
    );
  }

  protected override onFocusIn(): void {
    this.$element().addClass(FOCUSED_STATE_CLASS);

    super.onFocusIn();
  }

  protected override onFocusOut(e: DxEvent): void {
    this.$element().removeClass(FOCUSED_STATE_CLASS);

    super.onFocusOut(e);
  }

  public override setTabIndex(tabIndex: number | undefined): void {
    super.setTabIndex(tabIndex);

    this.$element().attr('tabindex', tabIndex ?? null);
  }

  protected getTitleText(): string {
    const dataAccessor = this.option().getDataAccessor();
    const titleText = dataAccessor.get('text', this.targetedAppointmentData);

    if (!titleText) {
      return messageLocalization.format('dxScheduler-noSubject');
    }

    return titleText;
  }

  protected getDateText(): string {
    const dateText = getDateTextFromTargetAppointment(
      this.targetedAppointmentData,
      this.isAllDay() ? DateFormatType.DATE : DateFormatType.TIME,
    );

    return dateText;
  }

  protected isRecurring(): boolean {
    const dataAccessor = this.option().getDataAccessor();
    const recurrenceRule = dataAccessor.get('recurrenceRule', this.targetedAppointmentData);

    return Boolean(recurrenceRule);
  }

  protected isAllDay(): boolean {
    const dataAccessor = this.option().getDataAccessor();
    const allDay = dataAccessor.get('allDay', this.targetedAppointmentData);

    return Boolean(allDay);
  }

  private renderContentTemplate(): void {
    const $content = $('<div>')
      .addClass(APPOINTMENT_CLASSES.CONTENT)
      .appendTo(this.$element());

    const template = this.option().appointmentTemplate instanceof EmptyTemplate
      ? this.defaultAppointmentTemplate
      : this.option().appointmentTemplate;

    template.render({
      container: getPublicElement($content),
      model: {
        appointmentData: this.appointmentData,
        targetedAppointmentData: this.targetedAppointmentData,
      },
      index: this.option().index,
      onRendered: () => {
        // @ts-expect-error 'component' and 'element' are set by action
        this.option().onRendered({
          appointmentElement: getPublicElement(this.$element()),
          appointmentData: this.appointmentData,
          targetedAppointmentData: this.targetedAppointmentData,
        });
      },
    });
  }

  protected defaultAppointmentContent($container: dxElementWrapper): dxElementWrapper {
    return $container;
  }
}

// TODO<Appointments>: rename to dxSchedulerAppointment when old impl is removed
// eslint-disable-next-line @typescript-eslint/no-explicit-any
registerComponent('dxSchedulerNewAppointment', BaseAppointmentView as any);
