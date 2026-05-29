import dateLocalization from '@js/common/core/localization/date';
import messageLocalization from '@js/common/core/localization/message';
import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { EmptyTemplate } from '@js/core/templates/empty_template';
import type { DxEvent } from '@js/events';
import type { ClickEvent as ButtonClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import { FunctionTemplate } from '@ts/core/templates/m_function_template';
import type { TemplateBase } from '@ts/core/templates/m_template_base';
import type { TargetedAppointment } from '@ts/scheduler/types';

import type { AppointmentItemViewModel } from '../view_model/types';
import { APPOINTMENT_COLLECTOR_CLASSES } from './const';
import type { ViewItemProperties } from './view_item';
import { ViewItem } from './view_item';

export interface AppointmentCollectorProperties
  extends ViewItemProperties {
  items: AppointmentItemViewModel[],
  isCompact: boolean;
  geometry: {
    height: number;
    width: number;
    top: number;
    left: number;
  };
  targetedAppointmentData: TargetedAppointment;
  appointmentCollectorTemplate: TemplateBase;
  onClick: (viewItem: AppointmentCollector, e: DxEvent) => void;
}

export class AppointmentCollector
  extends ViewItem<AppointmentCollectorProperties> {
  private defaultAppointmentCollectorTemplate!: FunctionTemplate;

  private buttonInstance?: Button;

  private get appointmentsCount(): number {
    return this.option().items.length;
  }

  override _setOptionsByReference(): void {
    super._setOptionsByReference();

    // Note: items have appointmentData, which is used as a key in dataSource
    this._optionsByReference = {
      ...this._optionsByReference,
      // @ts-expect-error Component class has wrong type for _optionsByReference
      items: true,
      // @ts-expect-error Component class has wrong type for _optionsByReference
      targetedAppointmentData: true,
    };
  }

  override _init(): void {
    super._init();

    this.defaultAppointmentCollectorTemplate = new FunctionTemplate((options) => {
      this.defaultAppointmentCollectorContent($(options.container));
    });
  }

  override _initMarkup(): void {
    super._initMarkup();

    this.resize();
    this.applyElementClasses();
    this.applyElementAria();
    this.attachFocusEvents();
    this.attachKeydownEvents();
    this.renderContentTemplate();
  }

  public override resize(
    geometry?: { height: number; width: number; top: number; left: number },
  ): void {
    const newGeometry = geometry ?? this.option().geometry;
    const {
      top, left, width, height,
    } = newGeometry;

    this.$element().css({ top, left });

    this.buttonInstance?.option({ width, height });
  }

  public override setTabIndex(tabIndex: number | undefined): void {
    super.setTabIndex(tabIndex);

    this.buttonInstance?.option('tabIndex', tabIndex);
  }

  private applyElementClasses(): void {
    this.$element()
      .addClass(APPOINTMENT_COLLECTOR_CLASSES.CONTAINER)
      .toggleClass(APPOINTMENT_COLLECTOR_CLASSES.COMPACT, this.option().isCompact);
  }

  private applyElementAria(): void {
    const localizeDate = (date: Date): string =>
      // eslint-disable-next-line @stylistic/implicit-arrow-linebreak
      `${dateLocalization.format(date, 'monthAndDay')}, ${dateLocalization.format(date, 'year')}`;

    const { targetedAppointmentData } = this.option();

    const startDateText = localizeDate(targetedAppointmentData.displayStartDate);
    const endDateText = localizeDate(targetedAppointmentData.displayEndDate);

    const dateText = startDateText === endDateText
      ? startDateText
      : `${startDateText} - ${endDateText}`;

    this.$element()
      .attr('aria-roledescription', dateText);
  }

  private renderContentTemplate(): void {
    const template = this.option().appointmentCollectorTemplate instanceof EmptyTemplate
      ? this.defaultAppointmentCollectorTemplate
      : this.option().appointmentCollectorTemplate;

    this.buttonInstance = this._createComponent(this.$element(), Button, {
      type: 'default',
      tabIndex: this.option().tabIndex,
      width: this.option().geometry.width,
      height: this.option().geometry.height,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      template: new FunctionTemplate((e) => template.render({
        container: e.container,
        model: {
          appointmentCount: this.appointmentsCount,
          isCompact: this.option().isCompact,
          items: this.option().items.map((item) => item.itemData),
        },
      })),
      onClick: (e: ButtonClickEvent) => {
        this.option().onClick(this, e.event as DxEvent);
      },
    });
  }

  private defaultAppointmentCollectorContent(
    $container: dxElementWrapper,
  ): dxElementWrapper {
    const count = this.appointmentsCount;
    const text = this.option().isCompact
      ? count
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      : (messageLocalization.getFormatter('dxScheduler-moreAppointments') as any)(count);

    $('<span>')
      .text(text)
      .appendTo($container);

    $container.addClass(APPOINTMENT_COLLECTOR_CLASSES.CONTENT);

    return $container;
  }
}

// eslint-disable-next-line
registerComponent('dxSchedulerNewAppointmentCollector', AppointmentCollector as any);
