import { eventData as _eventData } from '../../common/core/events/utils/index';
import domAdapter from '../../core/dom_adapter';
import { name as clickEventName } from '../../common/core/events/click';
import pointer from '../../common/core/events/pointer';
import eventsEngine from '../../common/core/events/core/events_engine';

const downPointerEventName = pointer.down;
const movePointerEventName = pointer.move;

export function Tracker(parameters) {
    this._initHandlers(parameters);
}

Tracker.prototype = {
    constructor: Tracker,

    _initHandlers: function(parameters) {
        const document = domAdapter.getDocument();

        parameters.getCoords = function(e) {
            // TODO: Looks like "eventData" just returns e.pageX, e.pageY. Investigate and use just e.pageX, e.pageY is possible. Don't forget about touch.
            const data = _eventData(e);
            const offset = parameters.widget._renderer.getRootOffset();
            return [data.x - offset.left, data.y - offset.top];
        };

        parameters.root.on(clickEventName, clickHandler);
        parameters.root.on(downPointerEventName, downHandler);
        eventsEngine.on(document, downPointerEventName, downHandler);
        eventsEngine.on(document, movePointerEventName, moveHandler);
        this._disposeHandlers = function() {
            parameters.root.off(clickEventName, clickHandler);
            parameters.root.off(downPointerEventName, downHandler);
            eventsEngine.off(document, downPointerEventName, downHandler);
            eventsEngine.off(document, movePointerEventName, moveHandler);
        };

        function clickHandler(e) {
            processClick(e, parameters);
        }

        // Previously "stopPropagation" was called from the "downHandler" - so event triggered on "root" is not then triggered on "document".
        // Unfortunately it occurred (during T396917) that on touch devices calling "stopPropagation" prevents the following "dxclick" event.
        // Generally I think it would be better to use only (dxpointerdown, dxpointermove, dxpointerup) events (of course click is then implemented manually).
        // But for now removing "stopPropagation" will suffice - it can be implemented faster and with less changes, there are no known drawbacks in it.
        // We use "stopPropagation" to prevent unexpected scrolling or zooming when widget has some own scrolling behavior and is located inside another widget
        // (like dxScrollable) with its own scrolling behavior - dxTreeMap does not have own scrolling behavior.
        let isRootDown = false;

        function downHandler(e) {
            if(isRootDown) {
                isRootDown = false;
            } else {
                if(parameters.getData(e) !== undefined) {
                    isRootDown = true;
                }
                moveHandler(e);
            }
        }

        function moveHandler(e) {
            processHover(e, parameters);
            parameters.widget._getOption('tooltip').enabled && processTooltip(e, parameters);
        }
    },

    dispose: function() {
        this._disposeHandlers();
    }
};

function processClick(e, params) {
    const id = params.getData(e);

    if(id >= 0) {
        params.click({
            node: params.getNode(id),
            coords: params.getCoords(e),
            event: e
        });
    }
}

function processHover(e, params) {
    const id = params.getData(e);

    if(id >= 0) {
        params.getNode(id).setHover();
    } else {
        params.widget.clearHover();
    }
}

function processTooltip(e, params) {
    const id = params.getData(e, true);
    let coords;

    if(id >= 0) {
        coords = _eventData(e);
        params.getNode(id).showTooltip([coords.x, coords.y]);
    } else {
        params.widget.hideTooltip();
    }
}
