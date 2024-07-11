"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createAppointmentLayout = exports.createAgendaAppointmentLayout = void 0;
var _dom_adapter = _interopRequireDefault(require("../../../core/dom_adapter"));
var _renderer = _interopRequireDefault(require("../../../core/renderer"));
var _message = _interopRequireDefault(require("../../../localization/message"));
var _m_classes = require("../m_classes");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const allDayText = ` ${_message.default.format('dxScheduler-allDay')}: `;
const createAppointmentLayout = (formatText, config) => {
  const result = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
  (0, _renderer.default)('<div>').text(formatText.text).addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE).appendTo(result);
  if (config.html) {
    result.html(config.html);
  }
  const $contentDetails = (0, _renderer.default)('<div>').addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(result);
  (0, _renderer.default)('<div>').addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo($contentDetails);
  config.isRecurrence && (0, _renderer.default)('<span>').addClass(`${_m_classes.APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON} dx-icon-repeat`).appendTo(result);
  config.isAllDay && (0, _renderer.default)('<div>').text(allDayText).addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT).prependTo($contentDetails);
  return result;
};
exports.createAppointmentLayout = createAppointmentLayout;
const createAgendaAppointmentLayout = (formatText, config) => {
  const result = (0, _renderer.default)(_dom_adapter.default.createDocumentFragment());
  const leftLayoutContainer = (0, _renderer.default)('<div>').addClass('dx-scheduler-agenda-appointment-left-layout').appendTo(result);
  const rightLayoutContainer = (0, _renderer.default)('<div>').addClass('dx-scheduler-agenda-appointment-right-layout').appendTo(result);
  // eslint-disable-next-line no-unused-vars
  const marker = (0, _renderer.default)('<div>').addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.AGENDA_MARKER).appendTo(leftLayoutContainer);
  config.isRecurrence && (0, _renderer.default)('<span>').addClass(`${_m_classes.APPOINTMENT_CONTENT_CLASSES.RECURRING_ICON} dx-icon-repeat`).appendTo(marker);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const text = (0, _renderer.default)('<div>').addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_TITLE).text(formatText.text).appendTo(rightLayoutContainer);
  const additionalContainer = (0, _renderer.default)('<div>').addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_CONTENT_DETAILS).appendTo(rightLayoutContainer);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const date = (0, _renderer.default)('<div>').addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.APPOINTMENT_DATE).text(formatText.formatDate).appendTo(additionalContainer);
  if (config.isAllDay) {
    (0, _renderer.default)('<div>').text(allDayText).addClass(_m_classes.APPOINTMENT_CONTENT_CLASSES.ALL_DAY_CONTENT).prependTo(additionalContainer);
  }
  return result;
};
exports.createAgendaAppointmentLayout = createAgendaAppointmentLayout;