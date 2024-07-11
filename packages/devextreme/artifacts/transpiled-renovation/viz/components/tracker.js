"use strict";

exports.Tracker = Tracker;
var _index = require("../../events/utils/index");
var _dom_adapter = _interopRequireDefault(require("../../core/dom_adapter"));
var _click = require("../../events/click");
var _pointer = _interopRequireDefault(require("../../events/pointer"));
var _events_engine = _interopRequireDefault(require("../../events/core/events_engine"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const downPointerEventName = _pointer.default.down;
const movePointerEventName = _pointer.default.move;
function Tracker(parameters) {
  this._initHandlers(parameters);
}
Tracker.prototype = {
  constructor: Tracker,
  _initHandlers: function (parameters) {
    const document = _dom_adapter.default.getDocument();
    parameters.getCoords = function (e) {
      // TODO: Looks like "eventData" just returns e.pageX, e.pageY. Investigate and use just e.pageX, e.pageY is possible. Don't forget about touch.
      const data = (0, _index.eventData)(e);
      const offset = parameters.widget._renderer.getRootOffset();
      return [data.x - offset.left, data.y - offset.top];
    };
    parameters.root.on(_click.name, clickHandler);
    parameters.root.on(downPointerEventName, downHandler);
    _events_engine.default.on(document, downPointerEventName, downHandler);
    _events_engine.default.on(document, movePointerEventName, moveHandler);
    this._disposeHandlers = function () {
      parameters.root.off(_click.name, clickHandler);
      parameters.root.off(downPointerEventName, downHandler);
      _events_engine.default.off(document, downPointerEventName, downHandler);
      _events_engine.default.off(document, movePointerEventName, moveHandler);
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
      if (isRootDown) {
        isRootDown = false;
      } else {
        if (parameters.getData(e) !== undefined) {
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
  dispose: function () {
    this._disposeHandlers();
  }
};
function processClick(e, params) {
  const id = params.getData(e);
  if (id >= 0) {
    params.click({
      node: params.getNode(id),
      coords: params.getCoords(e),
      event: e
    });
  }
}
function processHover(e, params) {
  const id = params.getData(e);
  if (id >= 0) {
    params.getNode(id).setHover();
  } else {
    params.widget.clearHover();
  }
}
function processTooltip(e, params) {
  const id = params.getData(e, true);
  let coords;
  if (id >= 0) {
    coords = (0, _index.eventData)(e);
    params.getNode(id).showTooltip([coords.x, coords.y]);
  } else {
    params.widget.hideTooltip();
  }
}