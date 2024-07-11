"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TooltipStrategyBase = void 0;
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _function_template = require("../../../core/templates/function_template");
var _button = _interopRequireDefault(require("../../../ui/button"));
var _promise = require("../../core/utils/promise");
var _m_list = _interopRequireDefault(require("../../ui/list/m_list.edit"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const TOOLTIP_APPOINTMENT_ITEM = 'dx-tooltip-appointment-item';
const TOOLTIP_APPOINTMENT_ITEM_CONTENT = `${TOOLTIP_APPOINTMENT_ITEM}-content`;
const TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT = `${TOOLTIP_APPOINTMENT_ITEM}-content-subject`;
const TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE = `${TOOLTIP_APPOINTMENT_ITEM}-content-date`;
const TOOLTIP_APPOINTMENT_ITEM_MARKER = `${TOOLTIP_APPOINTMENT_ITEM}-marker`;
const TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY = `${TOOLTIP_APPOINTMENT_ITEM}-marker-body`;
const TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER = `${TOOLTIP_APPOINTMENT_ITEM}-delete-button-container`;
const TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON = `${TOOLTIP_APPOINTMENT_ITEM}-delete-button`;
class TooltipStrategyBase {
  constructor(options) {
    this.asyncTemplatePromises = new Set();
    this._tooltip = null;
    this._options = options;
    this._extraOptions = null;
  }
  show(target, dataList, extraOptions) {
    if (this._canShowTooltip(dataList)) {
      this.hide();
      this._extraOptions = extraOptions;
      this._showCore(target, dataList);
    }
  }
  _showCore(target, dataList) {
    if (!this._tooltip) {
      this._tooltip = this._createTooltip(target, dataList);
    } else {
      this._shouldUseTarget() && this._tooltip.option('target', target);
      this._list.option('dataSource', dataList);
    }
    this._prepareBeforeVisibleChanged(dataList);
    this._tooltip.option('visible', true);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _prepareBeforeVisibleChanged(dataList) {}
  _getContentTemplate(dataList) {
    return container => {
      const listElement = (0, _renderer.default)('<div>');
      (0, _renderer.default)(container).append(listElement);
      this._list = this._createList(listElement, dataList);
    };
  }
  isAlreadyShown(target) {
    if (this._tooltip && this._tooltip.option('visible')) {
      return this._tooltip.option('target')[0] === target[0];
    }
    return undefined;
  }
  _onShown() {
    this._list.option('focusStateEnabled', this._extraOptions.focusStateEnabled);
  }
  dispose() {}
  hide() {
    if (this._tooltip) {
      this._tooltip.option('visible', false);
    }
  }
  _shouldUseTarget() {
    return true;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _createTooltip(target, dataList) {}
  _canShowTooltip(dataList) {
    if (!dataList.length) {
      return false;
    }
    return true;
  }
  _createListOption(dataList) {
    return {
      dataSource: dataList,
      onContentReady: this._onListRender.bind(this),
      onItemClick: e => this._onListItemClick(e),
      onItemContextMenu: this._onListItemContextMenu.bind(this),
      itemTemplate: (item, index) => this._renderTemplate(item.appointment, item.targetedAppointment, index, item.color),
      _swipeEnabled: false,
      pageLoadMode: 'scrollBottom'
    };
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onListRender(e) {}
  _createTooltipElement(wrapperClass) {
    return (0, _renderer.default)('<div>').appendTo(this._options.container).addClass(wrapperClass);
  }
  _createList(listElement, dataList) {
    return this._options.createComponent(listElement, _m_list.default, this._createListOption(dataList));
  }
  _renderTemplate(appointment, targetedAppointment, index, color) {
    const itemListContent = this._createItemListContent(appointment, targetedAppointment, color);
    this._options.addDefaultTemplates({
      // @ts-expect-error
      [this._getItemListTemplateName()]: new _function_template.FunctionTemplate(options => {
        const $container = (0, _renderer.default)(options.container);
        $container.append(itemListContent);
        return $container;
      })
    });
    const template = this._options.getAppointmentTemplate(`${this._getItemListTemplateName()}Template`);
    return this._createFunctionTemplate(template, appointment, targetedAppointment, index);
  }
  _createFunctionTemplate(template, appointmentData, targetedAppointmentData, index) {
    const isButtonClicked = !!this._extraOptions.isButtonClick;
    const isEmptyDropDownAppointmentTemplate = this._isEmptyDropDownAppointmentTemplate();
    // @ts-expect-error
    return new _function_template.FunctionTemplate(options => {
      // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
      const {
        promise,
        resolve
      } = (0, _promise.createPromise)();
      this.asyncTemplatePromises.add(promise);
      return template.render({
        model: isEmptyDropDownAppointmentTemplate ? {
          appointmentData,
          targetedAppointmentData,
          isButtonClicked
        } : appointmentData,
        container: options.container,
        index,
        onRendered: () => {
          this.asyncTemplatePromises.delete(promise);
          resolve();
        }
      });
    });
  }
  _getItemListTemplateName() {
    return this._isEmptyDropDownAppointmentTemplate() ? 'appointmentTooltip' : 'dropDownAppointment';
  }
  _isEmptyDropDownAppointmentTemplate() {
    return !this._extraOptions.dropDownAppointmentTemplate || this._extraOptions.dropDownAppointmentTemplate === 'dropDownAppointment';
  }
  _onListItemClick(e) {
    this.hide();
    this._extraOptions.clickEvent && this._extraOptions.clickEvent(e);
    this._options.showAppointmentPopup(e.itemData.appointment, false, e.itemData.targetedAppointment);
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _onListItemContextMenu(e) {}
  _createItemListContent(appointment, targetedAppointment, color) {
    const {
      editing
    } = this._extraOptions;
    const $itemElement = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM);
    $itemElement.append(this._createItemListMarker(color));
    $itemElement.append(this._createItemListInfo(this._options.createFormattedDateText(appointment, targetedAppointment)));
    const disabled = this._options.getAppointmentDisabled(appointment);
    if (!disabled && (editing && editing.allowDeleting === true || editing === true)) {
      $itemElement.append(this._createDeleteButton(appointment, targetedAppointment));
    }
    return $itemElement;
  }
  _createItemListMarker(color) {
    const $marker = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER);
    const $markerBody = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_MARKER_BODY);
    $marker.append($markerBody);
    color && color.done(value => $markerBody.css('background', value));
    return $marker;
  }
  _createItemListInfo(object) {
    const result = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT);
    const $title = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_SUBJECT).text(object.text);
    const $date = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_CONTENT_DATE).text(object.formatDate);
    return result.append($title).append($date);
  }
  _createDeleteButton(appointment, targetedAppointment) {
    const $container = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER);
    const $deleteButton = (0, _renderer.default)('<div>').addClass(TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON);
    $container.append($deleteButton);
    this._options.createComponent($deleteButton, _button.default, {
      icon: 'trash',
      stylingMode: 'text',
      onClick: e => {
        this.hide();
        e.event.stopPropagation();
        this._options.checkAndDeleteAppointment(appointment, targetedAppointment);
      }
    });
    return $container;
  }
}
exports.TooltipStrategyBase = TooltipStrategyBase;