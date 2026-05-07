import registerComponent from '@js/core/component_registrator';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getDefaultAlignment } from '@js/core/utils/position';
import { getOuterWidth } from '@js/core/utils/size';
import { encodeHtml } from '@js/core/utils/string';
import type { Properties } from '@js/ui/validation_message';
import type { OptionChanged } from '@ts/core/widget/types';
import Overlay from '@ts/ui/overlay/overlay';

const INVALID_MESSAGE = 'dx-invalid-message';
const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const INVALID_MESSAGE_ALWAYS = 'dx-invalid-message-always';
const INVALID_MESSAGE_CONTENT = 'dx-invalid-message-content';
const VALIDATION_MESSAGE_MIN_WIDTH = 100;

export interface ValidationMessageProperties extends Properties {
  target?: string | Element | null;

  container?: dxElementWrapper;

  contentId: string;
}

class ValidationMessage extends Overlay<ValidationMessageProperties> {
  _textMarkup?: string;

  _getDefaultOptions(): ValidationMessageProperties {
    return {
      ...super._getDefaultOptions(),
      integrationOptions: {},
      templatesRenderAsynchronously: false,
      shading: false,
      width: 'auto',
      height: 'auto',
      hideOnOutsideClick: false,
      // @ts-expect-error ts-error
      animation: null,
      visible: true,
      propagateOutsideClick: true,
      _checkParentVisibility: false,
      rtlEnabled: false,
      contentTemplate: this._renderInnerHtml,
      maxWidth: '100%',
      container: this.$element(),
      mode: 'auto',
      preventScrollEvents: false,
      positionSide: 'top',
      offset: { h: 0, v: 0 },
    };
  }

  _init(): void {
    super._init();
    this.updateMaxWidth();
    this._updatePosition();
  }

  _initMarkup(): void {
    super._initMarkup();

    this._ensureMessageNotEmpty();
    this._updatePositionByTarget();
    this._toggleModeClass();
    this._updateContentId();
  }

  _updatePositionByTarget(): void {
    const { target } = this.option();

    this.option('position.of', target);
  }

  _ensureMessageNotEmpty(): void {
    this._textMarkup = this._getTextMarkup();

    const shouldShowMessage = this.option('visible') && this._textMarkup;
    this._toggleVisibilityClasses(shouldShowMessage);
  }

  _toggleVisibilityClasses(visible): void {
    if (visible) {
      this.$element().addClass(INVALID_MESSAGE);
      this.$wrapper()?.addClass(INVALID_MESSAGE);
    } else {
      this.$element().removeClass(INVALID_MESSAGE);
      this.$wrapper()?.removeClass(INVALID_MESSAGE);
    }
  }

  _updateContentId(): void {
    const { container, contentId } = this.option();
    const id = contentId ?? $(container).attr('aria-describedby');

    this.$content()
      ?.addClass(INVALID_MESSAGE_CONTENT)
      .attr('id', id);
  }

  _renderInnerHtml(element): void {
    const $element = element && $(element);

    $element?.html(this._textMarkup);
  }

  _getTextMarkup(): string {
    const validationErrors = this.option('validationErrors') ?? [];
    let validationErrorMessage = '';
    // @ts-expect-error ts-error
    validationErrors.forEach((err) => {
      const separator = validationErrorMessage ? '<br />' : '';
      validationErrorMessage += separator + encodeHtml(err?.message ?? '');
    });

    return validationErrorMessage;
  }

  _toggleModeClass(): void {
    const { mode } = this.option();
    this.$wrapper()
      ?.toggleClass(INVALID_MESSAGE_AUTO, mode === 'auto')
      .toggleClass(INVALID_MESSAGE_ALWAYS, mode === 'always');
  }

  updateMaxWidth(): void {
    const target = this.option('target');
    const targetWidth = getOuterWidth(target);
    let maxWidth = '100%';
    if (targetWidth) {
      // @ts-expect-error ts-error
      maxWidth = Math.max(targetWidth, VALIDATION_MESSAGE_MIN_WIDTH);
    }

    this.option({ maxWidth });
  }

  _getPositionsArray(positionSide, rtlSide): string[] {
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
  }

  _updatePosition(): void {
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

    // @ts-expect-error ts-error
    if (rtlEnabled && positionSide !== 'left' && positionSide !== 'right') offset.h = -offset.h;
    // @ts-expect-error ts-error
    if (positionSide === 'top') offset.v = -offset.v;
    // @ts-expect-error ts-error
    if (positionSide === 'left') offset.h = -offset.h;

    this.option('position', {
      offset,
      boundary,
      my: positions[0],
      at: positions[1],
      collision: 'none flip',
    });
  }

  _optionChanged(args: OptionChanged<ValidationMessageProperties>): void {
    const { name, value, previousValue } = args;
    switch (name) {
      case 'target':
        this._updatePositionByTarget();
        this.updateMaxWidth();
        super._optionChanged(args);
        break;
      case 'boundary':
        this.option('position.boundary', value);
        break;
      case 'mode':
        this._toggleModeClass();
        break;
      case 'rtlEnabled':
      case 'offset':
      case 'positionSide':
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        this.$element().removeClass(`dx-invalid-message-${previousValue}`);
        this._updatePosition();
        break;
      case 'container':
        this._updateContentId();
        super._optionChanged(args);
        break;
      case 'contentId':
        this._updateContentId();
        break;
      case 'validationErrors':
        this._ensureMessageNotEmpty();
        this._renderInnerHtml(this.$content());
        break;
      default:
        super._optionChanged(args);
    }
  }
}

registerComponent('dxValidationMessage', ValidationMessage);

export default ValidationMessage;
