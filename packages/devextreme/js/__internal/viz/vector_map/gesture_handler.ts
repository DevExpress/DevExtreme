/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-multi-assign */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const _ln = Math.log;
const _LN2 = Math.LN2;

export function GestureHandler(params) {
  const that = this;
  that._projection = params.projection;
  that._renderer = params.renderer;
  that._x = that._y = 0;
  that._subscribeToTracker(params.tracker);
}

GestureHandler.prototype = {
  constructor: GestureHandler,

  dispose() {
    this._offTracker();
    this._offTracker = null;
  },

  _subscribeToTracker(tracker) {
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
  },

  setInteraction(options) {
    this._processEnd();
    this._centeringEnabled = options.centeringEnabled;
    this._zoomingEnabled = options.zoomingEnabled;
  },

  _processStart(arg) {
    if (this._centeringEnabled) {
      this._x = arg.x;
      this._y = arg.y;
      this._projection.beginMoveCenter();
    }
  },

  _processMove(arg) {
    const that = this;
    if (that._centeringEnabled) {
      that._renderer.root.attr({ cursor: 'move' });
      that._projection.moveCenter([that._x - arg.x, that._y - arg.y]);
      that._x = arg.x;
      that._y = arg.y;
    }
  },

  _processEnd() {
    if (this._centeringEnabled) {
      this._renderer.root.attr({ cursor: 'default' });
      this._projection.endMoveCenter();
    }
  },

  _processZoom(arg) {
    const that = this;
    let delta;
    let screenPosition;
    let coords;
    if (that._zoomingEnabled) {
      if (arg.delta) {
        delta = arg.delta;
      } else if (arg.ratio) {
        delta = _ln(arg.ratio) / _LN2;
      }
      if (that._centeringEnabled) {
        screenPosition = that._renderer.getRootOffset();
        screenPosition = [arg.x - screenPosition.left, arg.y - screenPosition.top];
        coords = that._projection.fromScreenPoint(screenPosition);
      }
      that._projection.changeScaledZoom(delta);
      if (that._centeringEnabled) {
        that._projection.setCenterByPoint(coords, screenPosition);
      }
    }
  },
};
