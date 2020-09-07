import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import Overlay from './overlay';
import { extend } from '../core/utils/extend';
import { encodeHtml } from '../core/utils/string';
import Guid from '../core/guid';
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

            mode: 'auto',
            validationErrors: [],
            contentTemplate: this._renderInnerHtml,
            positionRequest: null,
            parentBoundary: null,
            parentOffset: null,
            rtlEnabled: false
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

        this.$content()
            .addClass(INVALID_MESSAGE_CONTENT)
            .attr('id', 'dx-' + new Guid());
    },

    _renderInnerHtml(element) {
        const validationErrors = this.option('validationErrors') || [];
        let validationErrorMessage = '';
        validationErrors.forEach((err) => {
            const separator = validationErrorMessage ? '<br />' : '';
            validationErrorMessage += separator + encodeHtml(err?.message || '');
        });

        return $(element).html(validationErrorMessage);
    },

    _toggleModeClass() {
        const mode = this.option('mode');
        this.$element()
            .toggleClass(INVALID_MESSAGE_AUTO, mode === 'auto')
            .toggleClass(INVALID_MESSAGE_ALWAYS, mode === 'always');
    },

    updateMaxWidth() {
        const targetWidth = this.option('target').outerWidth();
        let maxWidth = '100%';
        if(targetWidth !== 0) {
            maxWidth = Math.max(targetWidth, VALIDATION_MESSAGE_MIN_WIDTH);
        }

        this.option('maxWidth', maxWidth);
    },

    _updatePosition: function() {
        const positionRequest = this.option('positionRequest');
        const rtlEnabled = this.option('rtlEnabled');
        const positionSide = getDefaultAlignment(rtlEnabled);
        const offset = this.option('parentOffset');
        const verticalPositions = positionRequest === 'below' ? [' top', ' bottom'] : [' bottom', ' top'];

        if(rtlEnabled) offset.h = -offset.h;
        if(positionRequest !== 'below') offset.v = -offset.v;

        this.option('position', {
            offset,
            boundary: this.option('parentBoundary'),
            my: positionSide + verticalPositions[0],
            at: positionSide + verticalPositions[1],
            collision: 'none flip'
        });
    },

    _optionChanged(args) {
        switch(args.name) {
            case 'rtlEnabled':
                this._updatePosition();
                break;
            case 'parentBoundary':
                this.option('position.boundary', args.value);
                break;
            case 'parentOffset':
                this.option('position.offset', args.value);
                break;
            case 'mode':
                this._toggleModeClass(args.value);
                break;
            case 'positionRequest':
                this._updatePosition();
                break;
            default:
                this.callBase(args);
        }
    },
});

registerComponent('dxValidationMessage', ValidationMessage);

export default ValidationMessage;
