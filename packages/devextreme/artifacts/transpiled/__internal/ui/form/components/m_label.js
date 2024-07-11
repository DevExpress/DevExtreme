"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GET_LABEL_WIDTH_BY_TEXT_CLASS = exports.FIELD_ITEM_REQUIRED_MARK_CLASS = exports.FIELD_ITEM_OPTIONAL_MARK_CLASS = exports.FIELD_ITEM_LABEL_TEXT_CLASS = exports.FIELD_ITEM_LABEL_LOCATION_CLASS = void 0;
exports.renderLabel = renderLabel;
exports.setLabelWidthByMaxLabelWidth = setLabelWidthByMaxLabelWidth;
var _element = require("../../../../core/element");
var _renderer = _interopRequireDefault(require("../../../../core/renderer"));
var _type = require("../../../../core/utils/type");
var _constants = require("../constants");
var _m_formLayout_manager = require("../m_form.layout_manager.utils");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// TODO: exported for tests only
const GET_LABEL_WIDTH_BY_TEXT_CLASS = exports.GET_LABEL_WIDTH_BY_TEXT_CLASS = 'dx-layout-manager-hidden-label';
const FIELD_ITEM_REQUIRED_MARK_CLASS = exports.FIELD_ITEM_REQUIRED_MARK_CLASS = 'dx-field-item-required-mark';
const FIELD_ITEM_LABEL_LOCATION_CLASS = exports.FIELD_ITEM_LABEL_LOCATION_CLASS = 'dx-field-item-label-location-';
const FIELD_ITEM_OPTIONAL_MARK_CLASS = exports.FIELD_ITEM_OPTIONAL_MARK_CLASS = 'dx-field-item-optional-mark';
const FIELD_ITEM_LABEL_TEXT_CLASS = exports.FIELD_ITEM_LABEL_TEXT_CLASS = 'dx-field-item-label-text';
function renderLabel(_ref) {
  let {
    text,
    id,
    location,
    alignment,
    labelID = null,
    markOptions = {},
    labelTemplate,
    labelTemplateData,
    onLabelTemplateRendered
  } = _ref;
  if ((!(0, _type.isDefined)(text) || text.length <= 0) && !(0, _type.isDefined)(labelTemplate)) {
    return null;
  }
  const $label = (0, _renderer.default)('<label>').addClass(`${_constants.FIELD_ITEM_LABEL_CLASS} ${FIELD_ITEM_LABEL_LOCATION_CLASS}${location}`).attr('for', id).attr('id', labelID).css('textAlign', alignment);
  const $labelContainer = (0, _renderer.default)('<span>').addClass(_constants.FIELD_ITEM_LABEL_CONTENT_CLASS);
  let $labelContent = (0, _renderer.default)('<span>').addClass(FIELD_ITEM_LABEL_TEXT_CLASS).text(text);
  if (labelTemplate) {
    $labelContent = (0, _renderer.default)('<div>').addClass('dx-field-item-custom-label-content');
    labelTemplateData.text = text;
    labelTemplate.render({
      container: (0, _element.getPublicElement)($labelContent),
      model: labelTemplateData,
      onRendered() {
        onLabelTemplateRendered === null || onLabelTemplateRendered === void 0 || onLabelTemplateRendered();
      }
    });
  }
  return $label.append($labelContainer.append($labelContent,
  // @ts-expect-error
  _renderLabelMark(markOptions)));
}
// eslint-disable-next-line @typescript-eslint/naming-convention
function _renderLabelMark(markOptions) {
  const markText = (0, _m_formLayout_manager.getLabelMarkText)(markOptions);
  if (markText === '') {
    return null;
  }
  return (0, _renderer.default)('<span>').addClass(markOptions.showRequiredMark ? FIELD_ITEM_REQUIRED_MARK_CLASS : FIELD_ITEM_OPTIONAL_MARK_CLASS).text(markText);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setLabelWidthByMaxLabelWidth($targetContainer, labelsSelector, labelMarkOptions) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const FIELD_ITEM_LABEL_CONTENT_CLASS_Selector = `${labelsSelector} > .${_constants.FIELD_ITEM_LABEL_CLASS}:not(.${FIELD_ITEM_LABEL_LOCATION_CLASS}top) > .${_constants.FIELD_ITEM_LABEL_CONTENT_CLASS}`;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const $FIELD_ITEM_LABEL_CONTENT_CLASS_Items = $targetContainer.find(FIELD_ITEM_LABEL_CONTENT_CLASS_Selector);
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const FIELD_ITEM_LABEL_CONTENT_CLASS_Length = $FIELD_ITEM_LABEL_CONTENT_CLASS_Items.length;
  let labelWidth;
  let i;
  let maxWidth = 0;
  for (i = 0; i < FIELD_ITEM_LABEL_CONTENT_CLASS_Length; i++) {
    labelWidth = getLabelWidthByHTML($FIELD_ITEM_LABEL_CONTENT_CLASS_Items[i]);
    if (labelWidth > maxWidth) {
      maxWidth = labelWidth;
    }
  }
  for (i = 0; i < FIELD_ITEM_LABEL_CONTENT_CLASS_Length; i++) {
    $FIELD_ITEM_LABEL_CONTENT_CLASS_Items[i].style.width = `${maxWidth}px`;
  }
}
function getLabelWidthByHTML(labelContent) {
  let result = 0;
  const itemsCount = labelContent.children.length;
  for (let i = 0; i < itemsCount; i++) {
    const child = labelContent.children[i];
    result += child.offsetWidth;
  }
  return result;
}