/* eslint-disable import/no-import-module-exports */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable default-case */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-restricted-globals */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable max-classes-per-file */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { enumParser, parseScalar as _parseScalar } from '@ts/viz/core/utils';
import { createTracker, createVisibilityGroup, toggleDisplay } from '@ts/viz/vector_map/control_bar/utils';

const _math = Math;
const _min = _math.min;
const _max = _math.max;
const _round = _math.round;
const _floor = _math.floor;
const _sqrt = _math.sqrt;
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
  trackerGap: 4,
};
const OFFSET_X = 30.5;
const OFFSET_Y = 30.5;
const TOTAL_WIDTH = 61;
const TOTAL_HEIGHT = 274;

interface TrackerArg {
  x: number;
  y: number;
  data: { name: string; index: string };
}

interface ControlBarCallbacks {
  reset: (isCenter: boolean, isZoom: boolean) => void;
  beginMove: () => void;
  endMove: () => void;
  move: (shift: number[]) => void;
  zoom: (zoom: number) => void;
}

interface CommandOwner {
  _flags: number;
  _callbacks: ControlBarCallbacks;
  _zoomFactor: number;
  _zoomPartition: number;
  _sliderLineLength: number;
  _adjustZoom: (zoom: number) => void;
  _applyZoom: () => void;
}

interface Command {
  update: (command: string, arg: TrackerArg) => void;
  finish: () => void;
}

interface CommandType {
  flags: number;
  new (owner: CommandOwner, command: string, arg: TrackerArg): Command;
}

interface ControlBarProjection {
  on: (handlers: { engine: () => void; zoom: () => void; 'max-zoom': () => void }) => () => void;
  getZoomScalePartition: () => number;
  getScaledZoom: () => number;
  isInvertible: () => boolean;
  setCenter: (center: number[] | null) => void;
  setZoom: (zoom: number | null) => void;
  beginMoveCenter: () => void;
  endMoveCenter: () => void;
  moveCenter: (shift: number[]) => void;
  setScaledZoom: (scaledZoom: number) => void;
}

interface ControlBarTracker {
  on: (handlers: {
    start: (arg: TrackerArg) => void;
    move: (arg: TrackerArg) => void;
    end: () => void;
  }) => () => void;
}

interface ControlBarLayoutControl {
  addItem: (item: ThemeValue) => void;
  removeItem: (item: ThemeValue) => void;
}

interface ControlBarParams {
  renderer: ThemeValue;
  container: ThemeValue;
  layoutControl: ControlBarLayoutControl;
  projection: ControlBarProjection;
  tracker: ControlBarTracker;
  dataKey: string;
}

interface ControlBarOptions {
  enabled?: boolean;
  margin?: number;
  horizontalAlignment?: string;
  verticalAlignment?: string;
  panVisible?: boolean;
  zoomVisible?: boolean;
  borderWidth?: number;
  borderColor?: string;
  color?: string;
  opacity?: number;
}

interface ControlBarLayoutOptions {
  width: number;
  height: number;
  horizontalAlignment: string;
  verticalAlignment: string;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let ControlBar = class ControlBar {
  declare _params: ControlBarParams;

  declare _root: ThemeValue;

  declare _panControl: ThemeValue;

  declare _zoomBar: ThemeValue;

  declare _trackersPan: ThemeValue;

  declare _trackersZoom: ThemeValue;

  declare _zoomLine: ThemeValue;

  declare _zoomDrag: ThemeValue;

  declare _zoomDragTracker: ThemeValue;

  declare _offProjection: () => void;

  declare _offTracker: () => void;

  declare _callbacks: ControlBarCallbacks;

  declare _flags: number;

  declare _zoomPartition: number;

  declare _sliderLineLength: number;

  declare _sliderUnitLength: number;

  declare _zoomFactor: number;

  declare _isActive: boolean | number;

  declare _isEnabled: boolean;

  declare _margin: number;

  declare _layoutOptions: ControlBarLayoutOptions;

  declare _isPanVisible: boolean;

  declare _isZoomVisible: boolean;

  declare _command: Command | null;

  declare updateLayout: () => void;

  constructor(parameters: ControlBarParams) {
    this._params = parameters;
    this._createElements(parameters.renderer, parameters.container, parameters.dataKey);
    parameters.layoutControl.addItem(this);
    this._subscribeToProjection(parameters.projection);
    this._subscribeToTracker(parameters.tracker);
    this._createCallbacks(parameters.projection);
  }

  dispose(): void {
    this._params.layoutControl.removeItem(this);
    this._root.linkRemove().linkOff();
    this._offProjection();
    this._offTracker();
    // @ts-expect-error dispose releases the parameters, the root, the subscriptions and the callbacks
    this._params = this._root = this._offProjection = this._offTracker = this._callbacks = null;
  }

  _subscribeToProjection(projection: ControlBarProjection): void {
    const that = this;
    that._offProjection = projection.on({
      engine() {
        that._update();
      },
      zoom: updateZoom,
      'max-zoom': function () {
        that._zoomPartition = projection.getZoomScalePartition();
        that._sliderUnitLength = that._sliderLineLength / that._zoomPartition;
        updateZoom();
      },
    });
    function updateZoom(): void {
      that._adjustZoom(projection.getScaledZoom());
    }
  }

  _subscribeToTracker(tracker: ControlBarTracker): void {
    const that = this;
    let isActive = false;
    that._offTracker = tracker.on({
      start(arg) {
        isActive = arg.data.name === EVENT_TARGET_TYPE;
        if (isActive) {
          that._processStart(arg.data.index, arg);
        }
      },
      move(arg) {
        if (isActive) {
          that._processMove(arg.data.index, arg);
        }
      },
      end() {
        if (isActive) {
          that._processEnd();
          isActive = false;
        }
      },
    });
  }

  _createCallbacks(projection: ControlBarProjection): void {
    this._callbacks = {
      reset(isCenter, isZoom): void {
        if (isCenter) {
          projection.setCenter(null);
        }
        if (isZoom) {
          projection.setZoom(null);
        }
      },
      beginMove(): void {
        projection.beginMoveCenter();
      },
      endMove(): void {
        projection.endMoveCenter();
      },
      move(shift): void {
        projection.moveCenter(shift);
      },
      zoom(zoom): void {
        projection.setScaledZoom(zoom);
      },
    };
  }

  _createElements(renderer: ThemeValue, container: ThemeValue, dataKey: string): void {
    this._root = renderer.g().attr({ class: 'dxm-control-bar' }).linkOn(container, 'control-bar');
    const panControl = this._panControl = createVisibilityGroup(renderer, this._root, 'dxm-pan-control');
    const zoomBar = this._zoomBar = createVisibilityGroup(renderer, this._root, 'dxm-zoom-bar');
    const trackersPan = this._trackersPan = createTracker(renderer, this._root);
    const trackersZoom = this._trackersZoom = createTracker(renderer, this._root);

    this._createTrackersPan(renderer, dataKey, trackersPan);
    this._createTrackersZoom(renderer, dataKey, trackersZoom);
    this._createPanControl(renderer, dataKey, panControl);
    this._createZoomBar(renderer, dataKey, zoomBar);
  }

  _createPanControl(renderer: ThemeValue, dataKey: string, group: ThemeValue): void {
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
  }

  _createZoomBar(renderer: ThemeValue, dataKey: string, group: ThemeValue): void {
    const options = SIZE_OPTIONS;
    const incDecButtonSize = options.incDecButtonSize / 2;

    renderer.circle(0, options.incButtonOffset, options.smallCircleSize / 2).append(group);
    renderer.path([[-incDecButtonSize, options.incButtonOffset, incDecButtonSize, options.incButtonOffset], [0, options.incButtonOffset - incDecButtonSize, 0, options.incButtonOffset + incDecButtonSize]], 'area').append(group);
    renderer.circle(0, options.decButtonOffset, options.smallCircleSize / 2).append(group);
    renderer.path([-incDecButtonSize, options.decButtonOffset, incDecButtonSize, options.decButtonOffset], 'area').append(group);

    this._zoomLine = renderer.path([], 'line').append(group);
    this._zoomDrag = renderer.rect(
      _floor(-options.sliderLength / 2),
      _floor(options.sliderLineEndOffset - options.sliderWidth / 2),
      options.sliderLength,
      options.sliderWidth,
    ).append(group);
    this._sliderLineLength = options.sliderLineEndOffset - options.sliderLineStartOffset;
  }

  _createTrackersPan(renderer: ThemeValue, dataKey: string, group: ThemeValue): void {
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
  }

  _createTrackersZoom(renderer: ThemeValue, dataKey: string, group: ThemeValue): void {
    const options = SIZE_OPTIONS;

    renderer.circle(0, options.incButtonOffset, options.smallCircleSize / 2).data(dataKey, { index: COMMAND_ZOOM_IN, name: EVENT_TARGET_TYPE }).append(group);
    renderer.circle(0, options.decButtonOffset, options.smallCircleSize / 2).data(dataKey, { index: COMMAND_ZOOM_OUT, name: EVENT_TARGET_TYPE }).append(group);

    renderer.rect(-2, options.sliderLineStartOffset - 2, 4, options.sliderLineEndOffset - options.sliderLineStartOffset + 4).css({ cursor: 'default' }).data(dataKey, { index: COMMAND_ZOOM_DRAG_LINE, name: EVENT_TARGET_TYPE }).append(group);
    this._zoomDragTracker = renderer.rect(-options.sliderLength / 2, options.sliderLineEndOffset - options.sliderWidth / 2, options.sliderLength, options.sliderWidth).data(dataKey, { index: COMMAND_ZOOM_DRAG, name: EVENT_TARGET_TYPE }).append(group);
  }

  // BEGIN: Implementation of LayoutTarget interface
  resize(size: { width: number; height: number } | null): void {
    if (this._isActive) {
      this._root.attr({ visibility: size !== null ? null : 'hidden' });
    }
  }

  getLayoutOptions(): ControlBarLayoutOptions | null {
    return this._isActive ? this._layoutOptions : null;
  }

  locate(x: number, y: number): void {
    this._root.attr({ translateX: x + this._margin + OFFSET_X, translateY: y + this._margin + OFFSET_Y });
  }
  // END: Implementation of LayoutTarget interface

  _update(): void {
    this._isActive = this._isEnabled && this._flags && this._params.projection.isInvertible();

    const groupPan = [this._panControl, this._trackersPan];
    const groupZoom = [this._zoomBar, this._trackersZoom];

    if (this._isActive) {
      this._root.linkAppend();
      toggleDisplay(groupPan, this._isPanVisible);
      toggleDisplay(groupZoom, this._isZoomVisible);
    } else {
      this._root.linkRemove();
    }

    this._processEnd();
    this.updateLayout();
  }

  setInteraction(interaction: { centeringEnabled?: boolean; zoomingEnabled?: boolean }): void {
    if (_parseScalar(interaction.centeringEnabled, true)) {
      this._flags |= FLAG_CENTERING;
    } else {
      this._flags &= ~FLAG_CENTERING;
    }
    if (_parseScalar(interaction.zoomingEnabled, true)) {
      this._flags |= FLAG_ZOOMING;
    } else {
      this._flags &= ~FLAG_ZOOMING;
    }
    this._update();
  }

  setOptions(options: ControlBarOptions): void {
    const styleSvg = {
      'stroke-width': options.borderWidth, stroke: options.borderColor, fill: options.color, 'fill-opacity': options.opacity,
    };

    this._isEnabled = !!_parseScalar(options.enabled, true);
    this._margin = options.margin || 0;
    this._layoutOptions = {
      width: 2 * this._margin + TOTAL_WIDTH,
      height: 2 * this._margin + TOTAL_HEIGHT,
      horizontalAlignment: parseHorizontalAlignment(options.horizontalAlignment, 'left'),
      verticalAlignment: parseVerticalAlignment(options.verticalAlignment, 'top'),
    };
    this._isPanVisible = !!_parseScalar(options.panVisible, true);
    this._isZoomVisible = !!_parseScalar(options.zoomVisible, true);

    this._panControl.attr(styleSvg);
    this._zoomBar.attr(styleSvg);

    this._update();
  }

  _adjustZoom(zoom: number): void {
    const start = SIZE_OPTIONS.sliderLineStartOffset;
    const end = SIZE_OPTIONS.sliderLineEndOffset;
    const h = SIZE_OPTIONS.sliderWidth;

    this._zoomFactor = _max(_min(_round(zoom), this._zoomPartition), 0);
    const transform = { translateY: -_round(this._zoomFactor * this._sliderUnitLength) };
    const y = end - (h / 2) + transform.translateY;
    this._zoomLine.attr({ points: [[0, start, 0, _max(start, y)], [0, _min(end, y + h), 0, end]] });
    this._zoomDrag.attr(transform);
    this._zoomDragTracker.attr(transform);
  }

  _applyZoom(): void {
    this._callbacks.zoom(this._zoomFactor);
  }

  _processStart(command: string, arg: TrackerArg): void {
    let commandType: CommandType | undefined;
    if (this._isActive) {
      commandType = COMMAND_TO_TYPE_MAP[command];
      this._command = commandType && commandType.flags & this._flags ? new commandType(this, command, arg) : null;
    }
  }

  _processMove(command: string, arg: TrackerArg): void {
    this._command && this._command.update(command, arg);
  }

  _processEnd(): void {
    this._command && this._command.finish();
    this._command = null;
  }
};

Object.assign(ControlBar.prototype, {
  _flags: 0,
});

function disposeCommand(command: { _owner?: CommandOwner } & Command): void {
  delete command._owner;
  command.update = function (): void { };
  command.finish = function (): void { };
}

class ResetCommand {
  declare static flags: number;

  declare _owner: CommandOwner;

  declare _command: string;

  constructor(owner: CommandOwner, command: string) {
    this._owner = owner;
    this._command = command;
  }

  update(command: string): void {
    (command !== this._command) && disposeCommand(this);
  }

  finish(): void {
    const flags = this._owner._flags;
    this._owner._callbacks.reset(!!(flags & FLAG_CENTERING), !!(flags & FLAG_ZOOMING));
    disposeCommand(this);
  }
}

ResetCommand.flags = FLAG_CENTERING | FLAG_ZOOMING;

class MoveCommand {
  declare static flags: number;

  declare _command: string;

  declare _stop: () => MoveCommand;

  constructor(owner: CommandOwner, command: string, arg: TrackerArg | null) {
    this._command = command;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const interval = 100;
    let dx = 0;
    let dy = 0;
    switch (this._command) {
      case COMMAND_MOVE_UP: dy = -10; break;
      case COMMAND_MOVE_RIGHT: dx = 10; break;
      case COMMAND_MOVE_DOWN: dy = 10; break;
      case COMMAND_MOVE_LEFT: dx = -10; break;
    }
    function callback(): void {
      owner._callbacks.move([dx, dy]);
      timeout = setTimeout(callback, interval);
    }
    this._stop = function (this: MoveCommand): MoveCommand {
      // @ts-expect-error the timer handle starts as null, clearTimeout(null) is a no-op
      clearTimeout(timeout);
      owner._callbacks.endMove();
      // @ts-expect-error stopping releases the method and the owner
      this._stop = owner = null;
      return this;
    };
    arg = null;
    owner._callbacks.beginMove();
    callback();
  }

  update(command: string): void {
    (this._command !== command) && this.finish();
  }

  finish(): void {
    disposeCommand(this._stop());
  }
}

MoveCommand.flags = FLAG_CENTERING;

class ZoomCommand {
  declare static flags: number;

  declare _owner: CommandOwner;

  declare _command: string;

  declare _stop: () => ZoomCommand;

  constructor(owner: CommandOwner, command: string) {
    this._owner = owner;
    this._command = command;
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const interval = 150;
    const dZoom = this._command === COMMAND_ZOOM_IN ? 1 : -1;
    function callback(): void {
      owner._adjustZoom(owner._zoomFactor + dZoom);
      timeout = setTimeout(callback, interval);
    }
    this._stop = function (this: ZoomCommand): ZoomCommand {
      // @ts-expect-error the timer handle starts as null, clearTimeout(null) is a no-op
      clearTimeout(timeout);
      // @ts-expect-error stopping releases the method and the owner
      this._stop = owner = null;
      return this;
    };
    callback();
  }

  update(command: string): void {
    (this._command !== command) && this.finish();
  }

  finish(): void {
    this._owner._applyZoom();
    disposeCommand(this._stop());
  }
}

ZoomCommand.flags = FLAG_ZOOMING;

class ZoomDragCommand {
  declare static flags: number;

  declare _owner: CommandOwner;

  declare _zoomFactor: number;

  declare _pos: number;

  constructor(owner: CommandOwner, command: string, arg: TrackerArg) {
    this._owner = owner;
    this._zoomFactor = owner._zoomFactor;
    this._pos = arg.y;
  }

  update(command: string, arg: TrackerArg): void {
    const owner = this._owner;
    owner._adjustZoom(this._zoomFactor + owner._zoomPartition * (this._pos - arg.y) / owner._sliderLineLength);
  }

  finish(): void {
    this._owner._applyZoom();
    disposeCommand(this);
  }
}

ZoomDragCommand.flags = FLAG_ZOOMING;

let COMMAND_TO_TYPE_MAP: Record<string, CommandType> = {};

COMMAND_TO_TYPE_MAP[COMMAND_RESET] = ResetCommand;
COMMAND_TO_TYPE_MAP[COMMAND_MOVE_UP] = COMMAND_TO_TYPE_MAP[COMMAND_MOVE_RIGHT] = COMMAND_TO_TYPE_MAP[COMMAND_MOVE_DOWN] = COMMAND_TO_TYPE_MAP[COMMAND_MOVE_LEFT] = MoveCommand;
COMMAND_TO_TYPE_MAP[COMMAND_ZOOM_IN] = COMMAND_TO_TYPE_MAP[COMMAND_ZOOM_OUT] = ZoomCommand;
COMMAND_TO_TYPE_MAP[COMMAND_ZOOM_DRAG] = ZoomDragCommand;

/// #DEBUG
const COMMAND_TO_TYPE_MAP__ORIGINAL = COMMAND_TO_TYPE_MAP;

exports._TESTS_stubCommandToTypeMap = function (map: Record<string, CommandType>): void {
  COMMAND_TO_TYPE_MAP = map;
};

exports._TESTS_restoreCommandToTypeMap = function (): void {
  COMMAND_TO_TYPE_MAP = COMMAND_TO_TYPE_MAP__ORIGINAL;
};
/// #ENDDEBUG

/// #DEBUG
export function DEBUG_set_ControlBar(value: typeof ControlBar): void {
  ControlBar = value;
}
/// #ENDDEBUG
