import { type DxElement } from '@js/core/element';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import { isRenderer } from '@js/core/utils/type';
import type { ClickEvent as ButtonClickEvent } from '@js/ui/button';
import Button from '@js/ui/button';
import type {
  ContentReadyEvent,
  InitializedEvent,
  ItemClickEvent,
  ItemContextMenuEvent,
  Properties as ListProperties,
} from '@js/ui/list';
import type dxOverlay from '@js/ui/overlay';
import type { Properties as OverlayProperties } from '@js/ui/overlay';
import type { Appointment, AppointmentClickEvent, Properties as SchedulerProperties } from '@js/ui/scheduler';
import { createPromise } from '@ts/core/utils/promise';
import List from '@ts/ui/list/list.edit';
import type Tooltip from '@ts/ui/m_tooltip';

import type { AppointmentTooltipItem, TargetedAppointment } from '../types';

const TOOLTIP_APPOINTMENT_ITEM = 'dx-tooltip-appointment-item';
const TOOLTIP_APPOINTMENT_ITEM_CONTENT = `${TOOLTIP_APPOINTMENT_ITEM}-content`;
const TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT = `${TOOLTIP_APPOINTMENT_ITEM}-content-subject`;
const TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE = `${TOOLTIP_APPOINTMENT_ITEM}-content-date`;
const TOOLTIP_APPOINTMENT_ITEM_MARKER = `${TOOLTIP_APPOINTMENT_ITEM}-marker`;
const TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY = `${TOOLTIP_APPOINTMENT_ITEM}-marker-body`;

const TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER = `${TOOLTIP_APPOINTMENT_ITEM}-delete-button-container`;
const TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON = `${TOOLTIP_APPOINTMENT_ITEM}-delete-button`;

const APPOINTMENT_TOOLTIP_TEMPLATE = 'appointmentTooltipTemplate';

interface AppointmentTooltipOptions {
  createComponent: (
    element: dxElementWrapper,
    component: unknown,
    options: unknown,
  ) => unknown;
  container: dxElementWrapper;
  getScrollableContainer: () => dxElementWrapper;
  addDefaultTemplates: (templates: Record<string, FunctionTemplate>) => void;
  getAppointmentTemplate: (optionName: string) => FunctionTemplate;
  showAppointmentPopup: (
    appointment: Appointment,
    createNewAppointment: boolean,
    targetedAppointment?: Appointment | TargetedAppointment,
  ) => void;
  checkAndDeleteAppointment: (
    appointment: Appointment,
    targetedAppointment?: Appointment | TargetedAppointment,
  ) => void;
  isAppointmentInAllDayPanel: (appointment: Appointment) => boolean;
  createFormattedDateText: (
    appointment: Appointment,
    targetedAppointment?: Appointment | TargetedAppointment,
    format?: string,
  ) => {
    text: string;
    formatDate: string;
  };
  getAppointmentDisabled: (appointment: Appointment) => boolean | undefined;
  onItemContextMenu: (eventArgs: unknown) => void;
  createEventArgs: (e: ItemContextMenuEvent<AppointmentTooltipItem>) => unknown;
  newAppointments?: boolean; // TODO<Appointments>
  onAppointmentClick: (e: AppointmentClickEvent) => void;
  onListInitialized: (e: InitializedEvent) => void;
  onListDisposing: () => void;
}

export interface AppointmentTooltipExtraOptions {
  clickEvent?: (e: ItemClickEvent<AppointmentTooltipItem>) => void;
  dragBehavior?: (e: ContentReadyEvent<AppointmentTooltipItem>) => void;
  editing?: SchedulerProperties['editing'];
  focusStateEnabled?: boolean;
  isButtonClick?: boolean;
  offset?: unknown;
  rtlEnabled?: boolean;
  tabFocusLoopEnabled?: boolean;
}

export abstract class TooltipStrategyBase {
  protected asyncTemplatePromises = new Set<Promise<void>>();

  protected tooltip: Tooltip | dxOverlay<OverlayProperties> | null = null;

  // TODO: make private once external usages in m_scheduler.ts are removed
  _options: AppointmentTooltipOptions;

  protected extraOptions: AppointmentTooltipExtraOptions | null = null;

  protected list!: List;

  protected $target: dxElementWrapper | null = null;

  constructor(options: AppointmentTooltipOptions) {
    this._options = options;
  }

  show(
    target: dxElementWrapper,
    dataList: AppointmentTooltipItem[],
    extraOptions: AppointmentTooltipExtraOptions,
  ): void {
    if (dataList.length) {
      this.hide();
      this.$target = target;
      this.extraOptions = extraOptions;
      this.showCore(dataList);
    }
  }

  public setTarget($target: dxElementWrapper): void {
    this.$target = $target;

    if (this.isDesktop() && this.tooltip) {
      const originalAnimationValue = this.tooltip.option('animation');

      this.tooltip.option('animation', null);
      this.tooltip.option('target', $target);
      this.tooltip.option('animation', originalAnimationValue);
    }
  }

  public getTarget(): dxElementWrapper | null {
    return this.$target;
  }

  public setListItems(dataList: AppointmentTooltipItem[]): void {
    if (dataList.length === 0) {
      this.hide();
    }

    this.list.option('dataSource', dataList);
  }

  private showCore(dataList: AppointmentTooltipItem[]): void {
    const { $target } = this;
    const describedByValue = $target && isRenderer($target)
      ? $target.attr('aria-describedby')
      : undefined;

    if (!this.tooltip) {
      this.tooltip = this.createTooltip(dataList);
    } else {
      if (this.isDesktop()) {
        this.tooltip.option('target', this.$target);
      }

      this.list.option('dataSource', dataList);
    }

    this.prepareBeforeVisibleChanged(dataList);
    this.tooltip.option('visible', true);

    if (describedByValue) {
      this.$target?.attr('aria-describedby', describedByValue);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected prepareBeforeVisibleChanged(dataList: AppointmentTooltipItem[]): void {

  }

  private isDeletingAllowed(appointment: Appointment): boolean {
    const { editing } = this.extraOptions ?? {};
    const disabled = this._options.getAppointmentDisabled(appointment);
    const isDeletingAllowed = editing === true
      || (typeof editing === 'object' && editing.allowDeleting === true);
    return !disabled && isDeletingAllowed;
  }

  protected getContentTemplate(dataList: AppointmentTooltipItem[]) {
    return (container: DxElement): void => {
      const listElement = $('<div>');
      $(container).append(listElement);
      this.list = this.createList(listElement, dataList);
      this.list.registerKeyHandler?.('escape', (): void => {
        this.hide();
        (this.getTarget()?.get(0) as HTMLElement | undefined)?.focus();
      });
      this.list.registerKeyHandler?.('del', (): void => {
        const { focusedElement } = this.list.option();
        if (!focusedElement) {
          return;
        }

        // @ts-expect-error
        const { appointment, targetedAppointment } = this.list._getItemData(focusedElement);
        if (!appointment) {
          return;
        }

        if (this.isDeletingAllowed(appointment)) {
          this._options.checkAndDeleteAppointment(appointment, targetedAppointment);
        }
      });
    };
  }

  isShownForTarget($target: dxElementWrapper): boolean {
    if (!this.tooltip?.option('visible')) {
      return false;
    }

    return $target.get(0) === this.$target?.get(0);
  }

  protected onShown(): void {
    this.list.option('focusStateEnabled', this.extraOptions?.focusStateEnabled);
  }

  dispose(): void {
  }

  hide(): void {
    if (this.tooltip) {
      this.tooltip.option('visible', false);
    }
  }

  protected isDesktop(): boolean {
    return true;
  }

  protected abstract createTooltip(
    dataList: AppointmentTooltipItem[],
  ): Tooltip | dxOverlay<OverlayProperties>;

  protected createListOption(
    dataList: AppointmentTooltipItem[],
  ): ListProperties<AppointmentTooltipItem> {
    return {
      dataSource: dataList,
      onContentReady: this.onListRender.bind(this),
      onInitialized: this.onListInitialized.bind(this),
      onDisposing: this._options.onListDisposing,
      onItemClick: (
        e: ItemClickEvent<AppointmentTooltipItem>,
      ): void => this.onListItemClick(e),
      onItemContextMenu: this.onListItemContextMenu.bind(this),
      itemTemplate: (
        item: AppointmentTooltipItem,
        index: number,
      ): FunctionTemplate => this.renderTemplate(
        item.appointment,
        item.targetedAppointment,
        index,
        item.color,
      ),
      pageLoadMode: 'scrollBottom',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onListInitialized(e: InitializedEvent): void { }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onListRender(e: ContentReadyEvent<AppointmentTooltipItem>): void { }

  protected createTooltipElement(wrapperClass: string): dxElementWrapper {
    return $('<div>').appendTo(this._options.container).addClass(wrapperClass);
  }

  private createList(
    listElement: dxElementWrapper,
    dataList: AppointmentTooltipItem[],
  ): List {
    return this._options.createComponent(
      listElement,
      List,
      this.createListOption(dataList),
    ) as List;
  }

  private renderTemplate(
    appointment: Appointment,
    targetedAppointment: Appointment | TargetedAppointment | undefined,
    index: number,
    color: Promise<string | undefined>,
  ): FunctionTemplate {
    const itemListContent = this.createItemListContent(appointment, targetedAppointment, color);
    this._options.addDefaultTemplates({
      appointmentTooltip: new FunctionTemplate(
        // @ts-expect-error
        (options: { container: DxElement }): dxElementWrapper => {
          const $container = $(options.container);
          $container.append(itemListContent);
          return $container;
        },
      ),
    });

    const template = this._options.getAppointmentTemplate(APPOINTMENT_TOOLTIP_TEMPLATE);
    return this.createFunctionTemplate(template, appointment, targetedAppointment, index);
  }

  private createFunctionTemplate(
    template: FunctionTemplate,
    appointmentData: Appointment,
    targetedAppointmentData: Appointment | TargetedAppointment | undefined,
    index: number,
  ): FunctionTemplate {
    const isButtonClicked = Boolean(this.extraOptions?.isButtonClick);

    // @ts-expect-error
    return new FunctionTemplate((options: { container: DxElement }): DxElement => {
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      const { promise, resolve } = createPromise<void>();
      this.asyncTemplatePromises.add(promise);
      return template.render({
        model: {
          appointmentData,
          targetedAppointmentData,
          isButtonClicked,
        },
        container: options.container,
        // @ts-expect-error
        index,
        onRendered: () => {
          this.asyncTemplatePromises.delete(promise);
          resolve();
        },
      });
    });
  }

  private onListItemClick(e: ItemClickEvent<AppointmentTooltipItem>): void {
    if (!e.itemData) {
      return;
    }

    this.hide();

    if (this._options.newAppointments) {
      if (this.extraOptions?.isButtonClick) {
        // @ts-expect-error 'component' and 'element' are set by action
        this._options.onAppointmentClick({
          appointmentElement: e.itemElement,
          appointmentData: e.itemData.appointment,
          targetedAppointmentData: e.itemData.targetedAppointment,
          event: e.event,
        });
      }
    } else {
      this.extraOptions?.clickEvent?.(e);
    }

    this._options.showAppointmentPopup(
      e.itemData.appointment,
      false,
      e.itemData.targetedAppointment,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onListItemContextMenu(e: ItemContextMenuEvent<AppointmentTooltipItem>): void { }

  private createItemListContent(
    appointment: Appointment,
    targetedAppointment: Appointment | TargetedAppointment | undefined,
    color: Promise<string | undefined>,
  ): dxElementWrapper {
    const $itemElement = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM);
    $itemElement.append(this.createItemListMarker(color));
    $itemElement.append(this.createItemListInfo(
      this._options.createFormattedDateText(appointment, targetedAppointment),
    ));

    if (this.isDeletingAllowed(appointment)) {
      $itemElement.append(this.createDeleteButton(appointment, targetedAppointment));
    }

    return $itemElement;
  }

  private createItemListMarker(color: Promise<string | undefined>): dxElementWrapper {
    const $marker = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER);
    const $markerBody = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY);

    $marker.append($markerBody);
    color.then((value: string | undefined): void => {
      if (value) {
        $markerBody.css('background', value);
      }
    }, () => {});

    return $marker;
  }

  private createItemListInfo(object: { text: string; formatDate: string }): dxElementWrapper {
    const result = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT);
    const $title = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT).text(object.text);
    const $date = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE).text(object.formatDate);

    return result.append($title).append($date);
  }

  private createDeleteButton(
    appointment: Appointment,
    targetedAppointment: Appointment | TargetedAppointment | undefined,
  ): dxElementWrapper {
    const $container = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER);
    const $deleteButton = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON);

    $container.append($deleteButton);
    this._options.createComponent($deleteButton, Button, {
      icon: 'trash',
      stylingMode: 'text',
      tabIndex: -1,
      onClick: (e: ButtonClickEvent): void => {
        e.event?.stopPropagation();
        this._options.checkAndDeleteAppointment(appointment, targetedAppointment);
      },
    });

    return $container;
  }
}
