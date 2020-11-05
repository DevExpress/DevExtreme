import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import Overlay from './overlay';
import { extend } from '../core/utils/extend';
import { encodeHtml } from '../core/utils/string';
import { getDefaultAlignment } from '../core/utils/position';

const INVALID_MESSAGE = 'dx-invalid-message';
const INVALID_MESSAGE_AUTO = 'dx-invalid-message-auto';
const INVALID_MESSAGE_ALWAYS = 'dx-invalid-message-always';
const INVALID_MESSAGE_CONTENT = 'dx-invalid-message-content';
const VALIDATION_MESSAGE_MIN_WIDTH = 100;

const ValidationMessage = Overlay.inherit({
    _getDefaultOptions() {
        return extend(this.callBase(), {
            integrationOptions: {},
            templatesRenderAsynchronously: false,
            shading: false,
            width: 'auto',
            height: 'auto',
            closeOnOutsideClick: false,
            closeOnTargetScroll: false,
            animation: null,
            visible: true,
            propagateOutsideClick: true,
            _checkParentVisibility: false,
            rtlEnabled: false,
            contentTemplate: this._renderInnerHtml,
            maxWidth: '100%',

            mode: 'auto',
            validationErrors: undefined,
            positionRequest: undefined,
            boundary: undefined,
            offset: { h: 0, v: 0 }
        });
    },

    _init() {
        this.callBase();
        this.updateMaxWidth();
        this._updatePosition();
    },

    _initMarkup() {
        this.callBase();

        this.$element().addClass(INVALID_MESSAGE);
        this._wrapper().addClass(INVALID_MESSAGE);
        this._toggleModeClass();
        this._updateContentId();
    },

    _updateContentId() {
        const contentId = $(this.option('container')).attr('aria-describedby');

        this.$content()
            .addClass(INVALID_MESSAGE_CONTENT)
            .attr('id', contentId);
    },

    _renderInnerHtml(element) {
        const $element = element && $(element);
        const validationErrors = this.option('validationErrors') || [];
        let validationErrorMessage = '';
        validationErrors.forEach((err) => {
            const separator = validationErrorMessage ? '<br />' : '';
            validationErrorMessage += separator + encodeHtml(err?.message || '');
        });

        $element?.html(validationErrorMessage);
    },

    _toggleModeClass() {
        const mode = this.option('mode');
        this._wrapper()
            .toggleClass(INVALID_MESSAGE_AUTO, mode === 'auto')
            .toggleClass(INVALID_MESSAGE_ALWAYS, mode === 'always');
    },

    updateMaxWidth() {
        const target = this.option('target');
        const targetWidth = target?.outerWidth?.() || $(target).outerWidth();
        let maxWidth = '100%';
        if(targetWidth) {
            maxWidth = Math.max(targetWidth, VALIDATION_MESSAGE_MIN_WIDTH);
        }

        this.option({ maxWidth });
    },

    _updatePosition: function() {
        const {
            positionRequest,
            rtlEnabled,
            offset,
            boundary
        } = this.option();
        const positionSide = getDefaultAlignment(rtlEnabled);
        const verticalPositions = positionRequest === 'below' ? [' top', ' bottom'] : [' bottom', ' top'];

        if(rtlEnabled) offset.h = -offset.h;
        if(positionRequest !== 'below') offset.v = -offset.v;

        this.option('position', {
            offset,
            boundary,
            my: positionSide + verticalPositions[0],
            at: positionSide + verticalPositions[1],
            collision: 'none flip'
        });
    },

    _optionChanged(args) {
        const { name, value } = args;
        switch(name) {
            case 'target':
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
            case 'positionRequest':
                this._updatePosition();
                break;
            case 'validationErrors':
                this._renderInnerHtml(this.$content());
                break;
            default:
                this.callBase(args);
        }
    },
});

registerComponent('dxValidationMessage', ValidationMessage);

export default ValidationMessage;
