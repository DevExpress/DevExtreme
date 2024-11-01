import registerComponent from '@js/core/component_registrator';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getDefaultAlignment } from '@js/core/utils/position';
import { getOuterWidth } from '@js/core/utils/size';
import { encodeHtml } from '@js/core/utils/string';
import Overlay from '@js/ui/overlay/ui.overlay';

const INVALID_MESSAGE = 'dx-invalid-message';
const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const INVALID_MESSAGE_ALWAYS = 'dx-invalid-message-always';
const INVALID_MESSAGE_CONTENT = 'dx-invalid-message-content';
const VALIDATION_MESSAGE_MIN_WIDTH = 100;
// @ts-expect-error
const ValidationMessage = Overlay.inherit({
  _getDefaultOptions() {
    return extend(this.callBase(), {
      integrationOptions: {},
      templatesRenderAsynchronously: false,
      shading: false,
      width: 'auto',
      height: 'auto',
      hideOnOutsideClick: false,
      animation: null,
      visible: true,
      propagateOutsideClick: true,
      _checkParentVisibility: false,
      rtlEnabled: false,
      contentTemplate: this._renderInnerHtml,
      maxWidth: '100%',

      container: this.$element(),
      target: undefined,
      mode: 'auto',
      validationErrors: undefined,
      preventScrollEvents: false,
      positionSide: 'top',
      boundary: undefined,
      offset: { h: 0, v: 0 },
      contentId: undefined,
    });
  },

  _init() {
    this.callBase();
    this.updateMaxWidth();
    this._updatePosition();
  },

  _initMarkup() {
    this.callBase();

    this._ensureMessageNotEmpty();
    this._updatePositionByTarget();
    this._toggleModeClass();
    this._updateContentId();
  },

  _updatePositionByTarget() {
    const { target } = this.option();

    this.option('position.of', target);
  },

  _ensureMessageNotEmpty() {
    this._textMarkup = this._getTextMarkup();

    const shouldShowMessage = this.option('visible') && this._textMarkup;
    this._toggleVisibilityClasses(shouldShowMessage);
  },

  _toggleVisibilityClasses(visible) {
    if (visible) {
      this.$element().addClass(INVALID_MESSAGE);
      this.$wrapper().addClass(INVALID_MESSAGE);
    } else {
      this.$element().removeClass(INVALID_MESSAGE);
      this.$wrapper().removeClass(INVALID_MESSAGE);
    }
  },

  _updateContentId() {
    const { container, contentId } = this.option();
    const id = contentId ?? $(container).attr('aria-describedby');

    this.$content()
      .addClass(INVALID_MESSAGE_CONTENT)
      .attr('id', id);
  },

  _renderInnerHtml(element) {
    const $element = element && $(element);

    $element?.html(this._textMarkup);
  },

  _getTextMarkup() {
    const validationErrors = this.option('validationErrors') ?? [];
    let validationErrorMessage = '';
    validationErrors.forEach((err) => {
      const separator = validationErrorMessage ? '<br />' : '';
      validationErrorMessage += separator + encodeHtml(err?.message ?? '');
    });

    return validationErrorMessage;
  },

  _toggleModeClass() {
    const mode = this.option('mode');
    this.$wrapper()
      .toggleClass(INVALID_MESSAGE_AUTO, mode === 'auto')
      .toggleClass(INVALID_MESSAGE_ALWAYS, mode === 'always');
  },

  updateMaxWidth() {
    const target = this.option('target');
    const targetWidth = getOuterWidth(target);
    let maxWidth = '100%';
    if (targetWidth) {
      // @ts-expect-error
      maxWidth = Math.max(targetWidth, VALIDATION_MESSAGE_MIN_WIDTH);
    }

    this.option({ maxWidth });
  },

  _getPositionsArray(positionSide, rtlSide) {
    switch (positionSide) {
      case 'top':
        return [`${rtlSide} bottom`, `${rtlSide} top`];
      case 'left':
        return ['right', 'left'];
      case 'right':
        return ['left', 'right'];
      default:
        return [`${rtlSide} top`, `${rtlSide} bottom`];
    }
  },

  _updatePosition() {
    const {
      positionSide,
      rtlEnabled,
      offset: componentOffset,
      boundary,
    } = this.option();
    const rtlSide = getDefaultAlignment(rtlEnabled);
    const positions = this._getPositionsArray(positionSide, rtlSide);
    const offset = { ...componentOffset };

    this.$element().addClass(`dx-invalid-message-${positionSide}`);

    if (rtlEnabled && positionSide !== 'left' && positionSide !== 'right') offset.h = -offset.h;
    if (positionSide === 'top') offset.v = -offset.v;
    if (positionSide === 'left') offset.h = -offset.h;

    this.option('position', {
      offset,
      boundary,
      my: positions[0],
      at: positions[1],
      collision: 'none flip',
    });
  },

  _optionChanged(args) {
    const { name, value, previousValue } = args;
    switch (name) {
      case 'target':
        this._updatePositionByTarget();
        this.updateMaxWidth();
        this.callBase(args);
        break;
      case 'boundary':
        this.option('position.boundary', value);
        break;
      case 'mode':
        this._toggleModeClass(value);
        break;
      case 'rtlEnabled':
      case 'offset':
      case 'positionSide':
        this.$element().removeClass(`dx-invalid-message-${previousValue}`);
        this._updatePosition();
        break;
      case 'container':
        this._updateContentId();
        this.callBase(args);
        break;
      case 'contentId':
        this._updateContentId();
        break;
      case 'validationErrors':
        this._ensureMessageNotEmpty();
        this._renderInnerHtml(this.$content());
        break;
      default:
        this.callBase(args);
    }
  },
});

registerComponent('dxValidationMessage', ValidationMessage);

export default ValidationMessage;
