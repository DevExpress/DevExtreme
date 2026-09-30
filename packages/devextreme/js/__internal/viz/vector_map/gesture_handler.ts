/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */

import type { ThemeValue } from '@ts/viz/core/base_theme_manager';

const _ln = Math.log;
const _LN2 = Math.LN2;

interface PointerArg {
  x: number;
  y: number;
  data: { name?: string };
}

interface ZoomArg {
  x: number;
  y: number;
  delta?: number;
  ratio?: number;
}

interface GestureTracker {
  on: (handlers: {
    start: (arg: PointerArg) => void;
    move: (arg: PointerArg) => void;
    end: () => void;
    zoom: (arg: ZoomArg) => void;
  }) => () => void;
}

interface GestureProjection {
  beginMoveCenter: () => void;
  moveCenter: (shift: number[]) => void;
  endMoveCenter: () => void;
  fromScreenPoint: (coordinates: number[]) => number[];
  changeScaledZoom: (deltaZoom: number) => void;
  setCenterByPoint: (coordinates: number[], screenPosition: number[]) => void;
}

interface GestureHandlerParams {
  projection: GestureProjection;
  renderer: ThemeValue;
  tracker: GestureTracker;
}

interface GestureInteraction {
  centeringEnabled: boolean;
  zoomingEnabled: boolean;
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let GestureHandler = class GestureHandler {
  declare _projection: GestureProjection;

  declare _renderer: ThemeValue;

  declare _x: number;

  declare _y: number;

  declare _offTracker: () => void;

  declare _centeringEnabled: boolean;

  declare _zoomingEnabled: boolean;

  constructor(params: GestureHandlerParams) {
    this._projection = params.projection;
    this._renderer = params.renderer;
    this._x = this._y = 0;
    this._subscribeToTracker(params.tracker);
  }

  dispose(): void {
    this._offTracker();
    // @ts-expect-error dispose releases the tracker subscription
    this._offTracker = null;
  }

  _subscribeToTracker(tracker: GestureTracker): void {
    const that = this;
    let isActive = false;
    that._offTracker = tracker.on({
      start(arg) {
        // TODO: This is an implicit dependency on the ControlBar which must be removed
        isActive = arg.data.name !== 'control-bar';
        if (isActive) {
          that._processStart(arg);
        }
      },
      move(arg) {
        if (isActive) {
          that._processMove(arg);
        }
      },
      end() {
        if (isActive) {
          that._processEnd();
        }
      },
      zoom(arg) {
        that._processZoom(arg);
      },

    });
  }

  setInteraction(options: GestureInteraction): void {
    this._processEnd();
    this._centeringEnabled = options.centeringEnabled;
    this._zoomingEnabled = options.zoomingEnabled;
  }

  _processStart(arg: PointerArg): void {
    if (this._centeringEnabled) {
      this._x = arg.x;
      this._y = arg.y;
      this._projection.beginMoveCenter();
    }
  }

  _processMove(arg: PointerArg): void {
    if (this._centeringEnabled) {
      this._renderer.root.attr({ cursor: 'move' });
      this._projection.moveCenter([this._x - arg.x, this._y - arg.y]);
      this._x = arg.x;
      this._y = arg.y;
    }
  }

  _processEnd(): void {
    if (this._centeringEnabled) {
      this._renderer.root.attr({ cursor: 'default' });
      this._projection.endMoveCenter();
    }
  }

  _processZoom(arg: ZoomArg): void {
    let delta;
    let screenPosition;
    let coords;
    if (this._zoomingEnabled) {
      if (arg.delta) {
        delta = arg.delta;
      } else if (arg.ratio) {
        delta = _ln(arg.ratio) / _LN2;
      }
      if (this._centeringEnabled) {
        screenPosition = this._renderer.getRootOffset();
        screenPosition = [arg.x - screenPosition.left, arg.y - screenPosition.top];
        coords = this._projection.fromScreenPoint(screenPosition);
      }
      this._projection.changeScaledZoom(delta);
      if (this._centeringEnabled) {
        this._projection.setCenterByPoint(coords, screenPosition);
      }
    }
  }
};

/// #DEBUG
export function DEBUG_set_GestureHandler(value: typeof GestureHandler): void {
  GestureHandler = value;
}
/// #ENDDEBUG
