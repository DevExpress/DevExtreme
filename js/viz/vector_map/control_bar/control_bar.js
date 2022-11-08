const _math = Math;
const _min = _math.min;
const _max = _math.max;
const _round = _math.round;
const _floor = _math.floor;
const _sqrt = _math.sqrt;

import { parseScalar as _parseScalar, enumParser } from '../../core/utils';
import { createTracker, createVisibilityGroup, toggleDisplay } from './utils';
const parseHorizontalAlignment = enumParser(['left', 'center', 'right']);
const parseVerticalAlignment = enumParser(['top', 'bottom']);

const COMMAND_RESET = 'command-reset';
const COMMAND_MOVE_UP = 'command-move-up';
const COMMAND_MOVE_RIGHT = 'command-move-right';
const COMMAND_MOVE_DOWN = 'command-move-down';
const COMMAND_MOVE_LEFT = 'command-move-left';
const COMMAND_ZOOM_IN = 'command-zoom-in';
const COMMAND_ZOOM_OUT = 'command-zoom-out';
const COMMAND_ZOOM_DRAG_LINE = 'command-zoom-drag-line';
const COMMAND_ZOOM_DRAG = 'command-zoom-drag';

const EVENT_TARGET_TYPE = 'control-bar';

const FLAG_CENTERING = 1;
const FLAG_ZOOMING = 2;

// TODO: This should be specified in options - seems like everything can be calculated from "buttonSize" and "zoomSliderLength"
const SIZE_OPTIONS = {
    bigCircleSize: 58,
    smallCircleSize: 28,
    buttonSize: 10,
    arrowButtonOffset: 20,
    incDecButtonSize: 11,
    incButtonOffset: 66,
    decButtonOffset: 227,
    sliderLineStartOffset: 88.5,
    sliderLineEndOffset: 205.5,
    sliderLength: 20,
    sliderWidth: 8,
    trackerGap: 4
};
const OFFSET_X = 30.5;
const OFFSET_Y = 30.5;
const TOTAL_WIDTH = 61;
const TOTAL_HEIGHT = 274;

let COMMAND_TO_TYPE_MAP = {};

COMMAND_TO_TYPE_MAP[COMMAND_RESET] = ResetCommand;
COMMAND_TO_TYPE_MAP[COMMAND_MOVE_UP] = COMMAND_TO_TYPE_MAP[COMMAND_MOVE_RIGHT] = COMMAND_TO_TYPE_MAP[COMMAND_MOVE_DOWN] = COMMAND_TO_TYPE_MAP[COMMAND_MOVE_LEFT] = MoveCommand;
COMMAND_TO_TYPE_MAP[COMMAND_ZOOM_IN] = COMMAND_TO_TYPE_MAP[COMMAND_ZOOM_OUT] = ZoomCommand;
COMMAND_TO_TYPE_MAP[COMMAND_ZOOM_DRAG] = ZoomDragCommand;

export function ControlBar(parameters) {
    const that = this;
    that._params = parameters;
    that._createElements(parameters.renderer, parameters.container, parameters.dataKey);
    parameters.layoutControl.addItem(that);
    that._subscribeToProjection(parameters.projection);
    that._subscribeToTracker(parameters.tracker);
    that._createCallbacks(parameters.projection);
}

ControlBar.prototype = {
    constructor: ControlBar,

    _flags: 0,

    dispose: function() {
        const that = this;
        that._params.layoutControl.removeItem(that);
        that._root.linkRemove().linkOff();
        that._offProjection();
        that._offTracker();
        that._params = that._root = that._offProjection = that._offTracker = that._callbacks = null;
    },

    _subscribeToProjection: function(projection) {
        const that = this;
        that._offProjection = projection.on({
            'engine': function() {
                that._update();
            },
            'zoom': updateZoom,
            'max-zoom': function() {
                that._zoomPartition = projection.getZoomScalePartition();
                that._sliderUnitLength = that._sliderLineLength / that._zoomPartition;
                updateZoom();
            }
        });
        function updateZoom() {
            that._adjustZoom(projection.getScaledZoom());
        }
    },

    _subscribeToTracker: function(tracker) {
        const that = this;
        let isActive = false;
        that._offTracker = tracker.on({
            'start': function(arg) {
                isActive = arg.data.name === EVENT_TARGET_TYPE;
                if(isActive) {
                    that._processStart(arg.data.index, arg);
                }
            },
            'move': function(arg) {
                if(isActive) {
                    that._processMove(arg.data.index, arg);
                }
            },
            'end': function() {
                if(isActive) {
                    that._processEnd();
                    isActive = false;
                }
            }
        });
    },

    _createCallbacks: function(projection) {
        const that = this;
        that._callbacks = {
            reset: function(isCenter, isZoom) {
                if(isCenter) {
                    projection.setCenter(null);
                }
                if(isZoom) {
                    projection.setZoom(null);
                }
            },
            beginMove: function() {
                projection.beginMoveCenter();
            },
            endMove: function() {
                projection.endMoveCenter();
            },
            move: function(shift) {
                projection.moveCenter(shift);
            },
            zoom: function(zoom) {
                projection.setScaledZoom(zoom);
            }
        };
    },

    _createElements: function(renderer, container, dataKey) {
        const that = this;

        that._root = renderer.g().attr({ 'class': 'dxm-control-bar' }).linkOn(container, 'control-bar');
        const panControl = that._panControl = createVisibilityGroup(renderer, that._root, 'dxm-pan-control');
        const zoomBar = that._zoomBar = createVisibilityGroup(renderer, that._root, 'dxm-zoom-bar');
        const trackersPan = that._trackersPan = createTracker(renderer, that._root);
        const trackersZoom = that._trackersZoom = createTracker(renderer, that._root);

        that._createTrackersPan(renderer, dataKey, trackersPan);
        that._createTrackersZoom(renderer, dataKey, trackersZoom);
        that._createPanControl(renderer, dataKey, panControl);
        that._createZoomBar(renderer, dataKey, zoomBar);
    },

    _createPanControl: function(renderer, dataKey, group) {
        const options = SIZE_OPTIONS;
        const size = options.buttonSize / 2;
        const offset1 = options.arrowButtonOffset - size;
        const offset2 = options.arrowButtonOffset;
        const directionOptions = { 'stroke-linecap': 'square', fill: 'none' };
        const line = 'line';

        renderer.circle(0, 0, options.bigCircleSize / 2).append(group);
        renderer.circle(0, 0, size).attr({ fill: 'none' }).append(group);

        renderer.path([-size, -offset1, 0, -offset2, size, -offset1], line).attr(directionOptions).append(group);
        renderer.path([offset1, -size, offset2, 0, offset1, size], line).attr(directionOptions).append(group);
        renderer.path([size, offset1, 0, offset2, -size, offset1], line).attr(directionOptions).append(group);
        renderer.path([-offset1, size, -offset2, 0, -offset1, -size], line).attr(directionOptions).append(group);
    },

    _createZoomBar: function(renderer, dataKey, group) {
        const that = this;
        const options = SIZE_OPTIONS;
        const incDecButtonSize = options.incDecButtonSize / 2;

        renderer.circle(0, options.incButtonOffset, options.smallCircleSize / 2).append(group);
        renderer.path([[-incDecButtonSize, options.incButtonOffset, incDecButtonSize, options.incButtonOffset], [0, options.incButtonOffset - incDecButtonSize, 0, options.incButtonOffset + incDecButtonSize]], 'area').append(group);
        renderer.circle(0, options.decButtonOffset, options.smallCircleSize / 2).append(group);
        renderer.path([-incDecButtonSize, options.decButtonOffset, incDecButtonSize, options.decButtonOffset], 'area').append(group);

        that._zoomLine = renderer.path([], 'line').append(group);
        that._zoomDrag = renderer.rect(
            _floor(-options.sliderLength / 2),
            _floor(options.sliderLineEndOffset - options.sliderWidth / 2),
            options.sliderLength, options.sliderWidth).append(group);
        that._sliderLineLength = options.sliderLineEndOffset - options.sliderLineStartOffset;
    },

    _createTrackersPan: function(renderer, dataKey, group) {
        const options = SIZE_OPTIONS;
        const size = _round((options.arrowButtonOffset - options.trackerGap) / 2);
        const offset1 = options.arrowButtonOffset - size;
        const offset2 = _round(_sqrt(options.bigCircleSize * options.bigCircleSize / 4 - size * size));
        const size2 = offset2 - offset1;

        renderer.rect(-size, -size, size * 2, size * 2).data(dataKey, { index: COMMAND_RESET, name: EVENT_TARGET_TYPE }).append(group);
        renderer.rect(-size, -offset2, size * 2, size2).data(dataKey, { index: COMMAND_MOVE_UP, name: EVENT_TARGET_TYPE }).append(group);
        renderer.rect(offset1, -size, size2, size * 2).data(dataKey, { index: COMMAND_MOVE_RIGHT, name: EVENT_TARGET_TYPE }).append(group);
        renderer.rect(-size, offset1, size * 2, size2).data(dataKey, { index: COMMAND_MOVE_DOWN, name: EVENT_TARGET_TYPE }).append(group);
        renderer.rect(-offset2, -size, size2, size * 2).data(dataKey, { index: COMMAND_MOVE_LEFT, name: EVENT_TARGET_TYPE }).append(group);

    },

    _createTrackersZoom: function(renderer, dataKey, group) {
        const options = SIZE_OPTIONS;

        renderer.circle(0, options.incButtonOffset, options.smallCircleSize / 2).data(dataKey, { index: COMMAND_ZOOM_IN, name: EVENT_TARGET_TYPE }).append(group);
        renderer.circle(0, options.decButtonOffset, options.smallCircleSize / 2).data(dataKey, { index: COMMAND_ZOOM_OUT, name: EVENT_TARGET_TYPE }).append(group);

        renderer.rect(-2, options.sliderLineStartOffset - 2, 4, options.sliderLineEndOffset - options.sliderLineStartOffset + 4).css({ cursor: 'default' }).data(dataKey, { index: COMMAND_ZOOM_DRAG_LINE, name: EVENT_TARGET_TYPE }).append(group);
        this._zoomDragTracker = renderer.rect(-options.sliderLength / 2, options.sliderLineEndOffset - options.sliderWidth / 2, options.sliderLength, options.sliderWidth).data(dataKey, { index: COMMAND_ZOOM_DRAG, name: EVENT_TARGET_TYPE }).append(group);
    },

    // BEGIN: Implementation of LayoutTarget interface
    resize: function(size) {
        if(this._isActive) {
            this._root.attr({ visibility: size !== null ? null : 'hidden' });
        }
    },

    getLayoutOptions: function() {
        return this._isActive ? this._layoutOptions : null;
    },

    locate: function(x, y) {
        this._root.attr({ translateX: x + this._margin + OFFSET_X, translateY: y + this._margin + OFFSET_Y });
    },
    // END: Implementation of LayoutTarget interface

    _update: function() {
        const that = this;
        that._isActive = that._isEnabled && that._flags && that._params.projection.isInvertible();

        const groupPan = [that._panControl, that._trackersPan];
        const groupZoom = [that._zoomBar, that._trackersZoom];

        if(that._isActive) {
            that._root.linkAppend();
            toggleDisplay(groupPan, that._isPanVisible);
            toggleDisplay(groupZoom, that._isZoomVisible);
        } else {
            that._root.linkRemove();
        }

        that._processEnd();
        that.updateLayout();
    },

    setInteraction: function(interaction) {
        const that = this;
        if(_parseScalar(interaction.centeringEnabled, true)) {
            that._flags |= FLAG_CENTERING;
        } else {
            that._flags &= ~FLAG_CENTERING;
        }
        if(_parseScalar(interaction.zoomingEnabled, true)) {
            that._flags |= FLAG_ZOOMING;
        } else {
            that._flags &= ~FLAG_ZOOMING;
        }
        that._update();
    },

    setOptions: function(options) {
        const that = this;
        const styleSvg = { 'stroke-width': options.borderWidth, stroke: options.borderColor, fill: options.color, 'fill-opacity': options.opacity };

        that._isEnabled = !!_parseScalar(options.enabled, true);
        that._margin = options.margin || 0;
        that._layoutOptions = {
            width: 2 * that._margin + TOTAL_WIDTH,
            height: 2 * that._margin + TOTAL_HEIGHT,
            horizontalAlignment: parseHorizontalAlignment(options.horizontalAlignment, 'left'),
            verticalAlignment: parseVerticalAlignment(options.verticalAlignment, 'top')
        };
        that._isPanVisible = !!_parseScalar(options.panVisible, true);
        that._isZoomVisible = !!_parseScalar(options.zoomVisible, true);

        that._panControl.attr(styleSvg);
        that._zoomBar.attr(styleSvg);

        that._update();
    },

    _adjustZoom: function(zoom) {
        const that = this;
        const start = SIZE_OPTIONS.sliderLineStartOffset;
        const end = SIZE_OPTIONS.sliderLineEndOffset;
        const h = SIZE_OPTIONS.sliderWidth;

        that._zoomFactor = _max(_min(_round(zoom), that._zoomPartition), 0);
        const transform = { translateY: -_round(that._zoomFactor * that._sliderUnitLength) };
        const y = end - (h / 2) + transform.translateY;
        that._zoomLine.attr({ points: [[0, start, 0, _max(start, y)], [0, _min(end, y + h), 0, end]] });
        that._zoomDrag.attr(transform);
        that._zoomDragTracker.attr(transform);
    },

    _applyZoom: function() {
        this._callbacks.zoom(this._zoomFactor);
    },

    _processStart: function(command, arg) {
        let commandType;
        if(this._isActive) {
            commandType = COMMAND_TO_TYPE_MAP[command];
            this._command = commandType && commandType.flags & this._flags ? new commandType(this, command, arg) : null;
        }
    },

    _processMove: function(command, arg) {
        this._command && this._command.update(command, arg);
    },

    _processEnd: function() {
        this._command && this._command.finish();
        this._command = null;
    }
};

function disposeCommand(command) {
    delete command._owner;
    command.update = function() { };
    command.finish = function() { };
}

function ResetCommand(owner, command) {
    this._owner = owner;
    this._command = command;
}

ResetCommand.flags = FLAG_CENTERING | FLAG_ZOOMING;

ResetCommand.prototype.update = function(command) {
    (command !== this._command) && disposeCommand(this);
};

ResetCommand.prototype.finish = function() {
    const flags = this._owner._flags;
    this._owner._callbacks.reset(!!(flags & FLAG_CENTERING), !!(flags & FLAG_ZOOMING));
    disposeCommand(this);
};

function MoveCommand(owner, command, arg) {
    this._command = command;
    let timeout = null;
    const interval = 100;
    let dx = 0;
    let dy = 0;
    switch(this._command) {
        case COMMAND_MOVE_UP: dy = -10; break;
        case COMMAND_MOVE_RIGHT: dx = 10; break;
        case COMMAND_MOVE_DOWN: dy = 10; break;
        case COMMAND_MOVE_LEFT: dx = -10; break;
    }
    function callback() {
        owner._callbacks.move([dx, dy]);
        timeout = setTimeout(callback, interval);
    }
    this._stop = function() {
        clearTimeout(timeout);
        owner._callbacks.endMove();
        this._stop = owner = null;
        return this;
    };
    arg = null;
    owner._callbacks.beginMove();
    callback();
}

MoveCommand.flags = FLAG_CENTERING;

MoveCommand.prototype.update = function(command) {
    (this._command !== command) && this.finish();
};

MoveCommand.prototype.finish = function() {
    disposeCommand(this._stop());
};

function ZoomCommand(owner, command) {
    this._owner = owner;
    this._command = command;
    let timeout = null;
    const interval = 150;
    const dZoom = this._command === COMMAND_ZOOM_IN ? 1 : -1;
    function callback() {
        owner._adjustZoom(owner._zoomFactor + dZoom);
        timeout = setTimeout(callback, interval);
    }
    this._stop = function() {
        clearTimeout(timeout);
        this._stop = owner = null;
        return this;
    };
    callback();
}

ZoomCommand.flags = FLAG_ZOOMING;

ZoomCommand.prototype.update = function(command) {
    (this._command !== command) && this.finish();
};

ZoomCommand.prototype.finish = function() {
    this._owner._applyZoom();
    disposeCommand(this._stop());
};

function ZoomDragCommand(owner, command, arg) {
    this._owner = owner;
    this._zoomFactor = owner._zoomFactor;
    this._pos = arg.y;
}

ZoomDragCommand.flags = FLAG_ZOOMING;

ZoomDragCommand.prototype.update = function(command, arg) {
    const owner = this._owner;
    owner._adjustZoom(this._zoomFactor + owner._zoomPartition * (this._pos - arg.y) / owner._sliderLineLength);
};

ZoomDragCommand.prototype.finish = function() {
    this._owner._applyZoom();
    disposeCommand(this);
};

///#DEBUG
const COMMAND_TO_TYPE_MAP__ORIGINAL = COMMAND_TO_TYPE_MAP;

export function _TESTS_stubCommandToTypeMap(map) {
    COMMAND_TO_TYPE_MAP = map;
}

export function _TESTS_restoreCommandToTypeMap() {
    COMMAND_TO_TYPE_MAP = COMMAND_TO_TYPE_MAP__ORIGINAL;
}
///#ENDDEBUG
