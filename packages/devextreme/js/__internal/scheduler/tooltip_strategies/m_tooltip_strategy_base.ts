import $ from '@js/core/renderer';
import { FunctionTemplate } from '@js/core/templates/function_template';
import { isRenderer } from '@js/core/utils/type';
import Button from '@js/ui/button';
import { createPromise } from '@ts/core/utils/promise';
import List from '@ts/ui/list/list.edit';

const TOOLTIP_APPOINTMENT_ITEM = 'dx-tooltip-appointment-item';
const TOOLTIP_APPOINTMENT_ITEM_CONTENT = `${TOOLTIP_APPOINTMENT_ITEM}-content`;
const TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT = `${TOOLTIP_APPOINTMENT_ITEM}-content-subject`;
const TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE = `${TOOLTIP_APPOINTMENT_ITEM}-content-date`;
const TOOLTIP_APPOINTMENT_ITEM_MARKER = `${TOOLTIP_APPOINTMENT_ITEM}-marker`;
const TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY = `${TOOLTIP_APPOINTMENT_ITEM}-marker-body`;

const TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER = `${TOOLTIP_APPOINTMENT_ITEM}-delete-button-container`;
const TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON = `${TOOLTIP_APPOINTMENT_ITEM}-delete-button`;

const APPOINTMENT_TOOLTIP_TEMPLATE = 'appointmentTooltipTemplate';

export class TooltipStrategyBase {
  protected asyncTemplatePromises = new Set<Promise<void>>();

  protected tooltip: any;

  public options: any;

  protected extraOptions: any;

  protected list: any;

  constructor(options) {
    this.tooltip = null;
    this.options = options;
    this.extraOptions = null;
  }

  show(target, dataList, extraOptions) {
    if (this.canShowTooltip(dataList)) {
      this.hide();
      this.extraOptions = extraOptions;
      this.showCore(target, dataList);
    }
  }

  private showCore(target, dataList) {
    const describedByValue = isRenderer(target) && target.attr('aria-describedby') as string;

    if (!this.tooltip) {
      this.tooltip = this.createTooltip(target, dataList);
    } else {
      this.shouldUseTarget() && this.tooltip.option('target', target);
      this.list.option('dataSource', dataList);
    }

    this.prepareBeforeVisibleChanged(dataList);
    this.tooltip.option('visible', true);

    describedByValue && target.attr('aria-describedby', describedByValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected prepareBeforeVisibleChanged(dataList) {

  }

  private isDeletingAllowed(appointment) {
    const { editing } = this.extraOptions;
    const disabled = this.options.getAppointmentDisabled(appointment);
    const isDeletingAllowed = editing === true || editing?.allowDeleting === true;
    return !disabled && isDeletingAllowed;
  }

  protected getContentTemplate(dataList) {
    return (container) => {
      const listElement = $('<div>');
      $(container).append(listElement);
      this.list = this.createList(listElement, dataList);
      this.list.registerKeyHandler?.('escape', () => {
        this.hide();
        this.tooltip.option('target').focus();
      });
      this.list.registerKeyHandler?.('del', () => {
        const { focusedElement } = this.list.option();
        if (!focusedElement) {
          return;
        }

        const { appointment, targetedAppointment } = this.list._getItemData(focusedElement);
        if (!appointment) {
          return;
        }

        if (this.isDeletingAllowed(appointment)) {
          this.hide();
          this.options.checkAndDeleteAppointment(appointment, targetedAppointment);
        }
      });
    };
  }

  isAlreadyShown(target) {
    if (this.tooltip && this.tooltip.option('visible')) {
      return this.tooltip.option('target')[0] === target[0];
    }
    return undefined;
  }

  protected onShown() {
    this.list.option('focusStateEnabled', this.extraOptions.focusStateEnabled);
  }

  dispose() {
  }

  hide() {
    if (this.tooltip) {
      this.tooltip.option('visible', false);
    }
  }

  protected shouldUseTarget() {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected createTooltip(target, dataList) {
  }

  private canShowTooltip(dataList) {
    if (!dataList.length) {
      return false;
    }
    return true;
  }

  protected createListOption(dataList) {
    return {
      dataSource: dataList,
      onContentReady: this.onListRender.bind(this),
      onItemClick: (e) => this.onListItemClick(e),
      onItemContextMenu: this.onListItemContextMenu.bind(this),
      itemTemplate: (item, index) => this.renderTemplate(item.appointment, item.targetedAppointment, index, item.color),
      pageLoadMode: 'scrollBottom',
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onListRender(e) { }

  protected createTooltipElement(wrapperClass) {
    return $('<div>').appendTo(this.options.container).addClass(wrapperClass);
  }

  private createList(listElement, dataList) {
    return this.options.createComponent(listElement, List, this.createListOption(dataList));
  }

  private renderTemplate(appointment, targetedAppointment, index, color) {
    const itemListContent = this.createItemListContent(appointment, targetedAppointment, color);
    this.options.addDefaultTemplates({
      // @ts-expect-error
      appointmentTooltip: new FunctionTemplate((options) => {
        const $container = $(options.container);
        $container.append(itemListContent);
        return $container;
      }),
    });

    const template = this.options.getAppointmentTemplate(APPOINTMENT_TOOLTIP_TEMPLATE);
    return this.createFunctionTemplate(template, appointment, targetedAppointment, index);
  }

  private createFunctionTemplate(template, appointmentData, targetedAppointmentData, index) {
    const isButtonClicked = Boolean(this.extraOptions.isButtonClick);

    // @ts-expect-error
    return new FunctionTemplate((options) => {
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
        index,
        onRendered: () => {
          this.asyncTemplatePromises.delete(promise);
          resolve();
        },
      });
    });
  }

  private onListItemClick(e) {
    this.hide();
    this.extraOptions.clickEvent && this.extraOptions.clickEvent(e);
    this.options.showAppointmentPopup(e.itemData.appointment, false, e.itemData.targetedAppointment);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onListItemContextMenu(e) { }

  private createItemListContent(appointment, targetedAppointment, color) {
    const $itemElement = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM);
    $itemElement.append(this.createItemListMarker(color));
    $itemElement.append(this.createItemListInfo(this.options.createFormattedDateText(appointment, targetedAppointment)));

    if (this.isDeletingAllowed(appointment)) {
      $itemElement.append(this.createDeleteButton(appointment, targetedAppointment));
    }

    return $itemElement;
  }

  private createItemListMarker(color) {
    const $marker = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER);
    const $markerBody = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY);

    $marker.append($markerBody);
    color.then((value) => {
      if (value) {
        $markerBody.css('background', value);
      }
    });

    return $marker;
  }

  private createItemListInfo(object) {
    const result = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT);
    const $title = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT).text(object.text);
    const $date = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE).text(object.formatDate);

    return result.append($title).append($date);
  }

  private createDeleteButton(appointment, targetedAppointment) {
    const $container = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER);
    const $deleteButton = $('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON);

    $container.append($deleteButton);
    this.options.createComponent($deleteButton, Button, {
      icon: 'trash',
      stylingMode: 'text',
      tabIndex: -1,
      onClick: (e) => {
        this.hide();
        e.event.stopPropagation();
        this.options.checkAndDeleteAppointment(appointment, targetedAppointment);
      },
    });

    return $container;
  }
}
