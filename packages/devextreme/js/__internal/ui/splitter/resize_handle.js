import $ from '../../../core/renderer';
import Widget from '../../../ui/widget/ui.widget';
import domAdapter from '../../../core/dom_adapter';
import eventsEngine from '../../../events/core/events_engine';
import pointerEvents from '../../../events/pointer';
import { addNamespace } from '../../../events/utils/index';
import registerComponent from '../../../core/component_registrator';
import { extend } from '../../../core/utils/extend';

// const window = getWindow();

const RESIZE_HANDLE_CLASS = 'dx-splitter-handle';
const SPLITTER_ACTIVE_CLASS = 'dx-splitter-handle-active';

const HORIZONTAL_DIRECTION_CLASS = 'dx-splitter-handle-horizontal';
const VERTICAL_DIRECTION_CLASS = 'dx-splitter-handle-vertical';

// It should have direction, onResize, onResizeStart, onResizeEnd options. Choose correct events namespace: 'dxResize...'

const SPLITTER_MODULE_NAMESPACE = 'dxResize';

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
        this.SPLITTER_POINTER_DOWN_EVENT_NAME = addNamespace(pointerEvents.down, SPLITTER_MODULE_NAMESPACE);
        this.SPLITTER_POINTER_MOVE_EVENT_NAME = addNamespace(pointerEvents.move, SPLITTER_MODULE_NAMESPACE);
        this.SPLITTER_POINTER_UP_EVENT_NAME = addNamespace(pointerEvents.up, SPLITTER_MODULE_NAMESPACE);
    }

    _initMarkup() {
        super._initMarkup();

        this.$element().addClass(RESIZE_HANDLE_CLASS);
        this.$element().addClass(SPLITTER_ACTIVE_CLASS);
    }

    _render() {
        super._render();

        this._detachEventHandlers();
        this._attachEventHandlers();

        this._toggleActive(false);
    }

    _clean() {
        this._detachEventHandlers();
        super._clean();
    }

    _attachEventHandlers() {
        eventsEngine.on(this.$element(), this.SPLITTER_POINTER_DOWN_EVENT_NAME, this._onMouseDownHandler.bind(this));

        // eventsEngine.on(document, this.SPLITTER_POINTER_MOVE_EVENT_NAME, this._onMouseMoveHandler.bind(this));
        // eventsEngine.on(document, this.SPLITTER_POINTER_UP_EVENT_NAME, this._onMouseUpHandler.bind(this));
    }

    _detachEventHandlers(onlyDocumentEvents = false) {
        const document = domAdapter.getDocument();
        if(!onlyDocumentEvents) {
            eventsEngine.off(this.$element(), this.SPLITTER_POINTER_DOWN_EVENT_NAME);
        }
        eventsEngine.off(document, this.SPLITTER_POINTER_MOVE_EVENT_NAME);
        eventsEngine.off(document, this.SPLITTER_POINTER_UP_EVENT_NAME);
    }

    _onMouseDownHandler(e) {
        console.log('mouse down');
        e.preventDefault();

        const document = domAdapter.getDocument();

        eventsEngine.on(document, this.SPLITTER_POINTER_MOVE_EVENT_NAME, this._onMouseMoveHandler.bind(this));
        eventsEngine.on(document, this.SPLITTER_POINTER_UP_EVENT_NAME, this._onMouseUpHandler.bind(this));

        this._toggleActive(true);

        if(this.onResizeStart) {
            this.onResizeStart();
        }
    }

    _onMouseMoveHandler(e) {
        const leftButtonPressed = e.which === 1;
        if(leftButtonPressed) {
            console.log('move');
        }
    }

    _onMouseUpHandler() {
        // TODO: remove condition block
        if(!this._isSplitterActive) {
            console.log('sadasdasdasd');
            debugger;
            return;
        }

        this._detachEventHandlers(true);

        this._toggleActive(false);
    }


    _toggleActive(isActive) {
        this.$element().toggleClass(SPLITTER_ACTIVE_CLASS, isActive);

        this._isSplitterActive = isActive;
    }

    _toggleDirection() {
        this.$element().toggleClass(HORIZONTAL_DIRECTION_CLASS, this._isHorizontalDirection());
        this.$element().toggleClass(VERTICAL_DIRECTION_CLASS, !this._isHorizontalDirection());
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
                break;
            default:
                super._optionChanged(args);
        }
    }
}


// @ts-expect-error // temp fix
registerComponent('dxResizeHandle', ResizeHandle);

export default ResizeHandle;
