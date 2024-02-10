import Widget from '../../../ui/widget/ui.widget';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import registerComponent from '../../../core/component_registrator';
import { extend } from '../../../core/utils/extend';
import { start as dragEventStart, move as dragEventMove, end as dragEventEnd } from '../../../events/drag';
import Guid from '../../../core/guid';

const RESIZE_HANDLE_CLASS = 'dx-resize-handle';
const RESIZE_HANDLE_ACTIVE_CLASS = 'dx-resize-handle-active';
const HORIZONTAL_DIRECTION_CLASS = 'dx-resize-handle-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-resize-handle-vertical';
const RESIZE_HANDLER_MODULE_NAMESPACE = 'dxResizeHandle';

class ResizeHandle extends Widget {
    _getDefaultOptions() {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return extend(super._getDefaultOptions(), {
            direction: 'horizontal',
            onResize: null,
            onResizeEnd: null,
            onResizeStart: null,
        });
    }

    _init() {
        super._init();
        const namespace = `${RESIZE_HANDLER_MODULE_NAMESPACE}${new Guid().toString()}`;
        this.DRAGSTART_START_EVENT_NAME = addNamespace(dragEventStart, namespace);
        this.DRAGSTART_EVENT_NAME = addNamespace(dragEventMove, namespace);
        this.DRAGSTART_END_EVENT_NAME = addNamespace(dragEventEnd, namespace);
    }

    _initMarkup() {
        super._initMarkup();

        this._toggleDirection();
        this.$element().addClass(RESIZE_HANDLE_CLASS);
        this.$element().addClass(RESIZE_HANDLE_ACTIVE_CLASS);
    }

    _toggleDirection() {
        this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
        this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
    }

    _render() {
        super._render();

        this._detachEventHandlers();
        this._attachEventHandlers();
        this._toggleActive(false);
        this._renderActions();
    }

    _dragStartHandler(e) {
        this._resizeStartAction({
            event: e,
        });

        this._toggleActive(true);
    }
    _dragHandler(e) {
        this._resizeAction({
            event: e,
        });
    }

    _dragEndHandler(e) {
        this._resizeEndAction({
            event: e,
        });
        this._toggleActive(false);
    }

    _renderActions() {
        this._resizeStartAction = this._createActionByOption('onResizeStart');
        this._resizeEndAction = this._createActionByOption('onResizeEnd');
        this._resizeAction = this._createActionByOption('onResize');
    }

    _clean() {
        this._detachEventHandlers();
        super._clean();
    }

    _attachEventHandlers() {
        const handlers = {};
        handlers[this.DRAGSTART_START_EVENT_NAME] = this._dragStartHandler.bind(this);
        handlers[this.DRAGSTART_EVENT_NAME] = this._dragHandler.bind(this);
        handlers[this.DRAGSTART_END_EVENT_NAME] = this._dragEndHandler.bind(this);

        eventsEngine.on(this.$element(), handlers, {
            // TODO: specify direction
            direction: 'both',
            immediate: true
        });
    }

    _detachEventHandlers() {
        eventsEngine.off(this.$element());
    }

    _toggleActive(isActive) {
        this.$element().toggleClass(RESIZE_HANDLE_ACTIVE_CLASS, isActive);
    }

    _isHorizontalDirection() {
        return this.option('direction') === 'horizontal';
    }

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    _optionChanged(args) {
        switch(args.name) {
            case 'direction':
                this._toggleDirection();
                break;
            case 'onResize':
            case 'onResizeStart':
            case 'onResizeEnd':
                this._renderActions();
                break;
            default:
                super._optionChanged(args);
        }
    }
}

// @ts-expect-error // temp fix
registerComponent('dxResizeHandle', ResizeHandle);

export default ResizeHandle;
