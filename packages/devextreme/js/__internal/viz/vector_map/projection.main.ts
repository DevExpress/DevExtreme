/* eslint-disable @stylistic/no-mixed-operators */
/* eslint-disable no-bitwise */
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable func-names */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
/* eslint-disable @stylistic/max-len */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable prefer-destructuring */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable max-classes-per-file */

import { extend } from '@js/core/utils/extend';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import { makeEventEmitter } from '@ts/viz/vector_map/event_emitter';

const _Number = Number;
const _min = Math.min;
const _max = Math.max;
const _abs = Math.abs;
const _round = Math.round;
const _ln = Math.log;

const TWO_TO_LN2 = 2 / Math.LN2;

// T224204
// The value is selected so that bounds range of 1 angular second can be defined
// 1 angular second is (1 / 3600) degrees or (1 / 3600 / 180) after projection
// The value 10 times less than projected 1 angular second is chosen
const MIN_BOUNDS_RANGE = 1 / 3600 / 180 / 10;

const DEFAULT_MIN_ZOOM = 1;
const DEFAULT_MAX_ZOOM = 1 << 8;

const DEFAULT_CENTER = [NaN, NaN];

const DEFAULT_ENGINE_NAME = 'mercator';

type ProjectMethod = (coordinates: number[]) => number[];

interface EngineParameters {
  to: ProjectMethod;
  from?: ProjectMethod;
  aspectRatio?: ThemeValue;
}

type EngineInstance = InstanceType<typeof Engine>;

interface ProjectionParams {
  centerChanged: (center: number[]) => void;
  zoomChanged: (zoom: number) => void;
}

interface ProjectionCanvas {
  left: number;
  top: number;
  width: number;
  height: number;
}

function floatsEqual(f1: number, f2: number): boolean {
  return _abs(f1 - f2) < 1E-8;
}

function arraysEqual(a1: number[], a2: number[]): boolean {
  return floatsEqual(a1[0], a2[0]) && floatsEqual(a1[1], a2[1]);
}

function parseAndClamp(value: ThemeValue, minValue: number, maxValue: number, defaultValue: number): number {
  const val = _Number(value);
  return isFinite(val) ? _min(_max(val, minValue), maxValue) : defaultValue;
}

function parseAndClampArray(value: ThemeValue[], minValue: number[], maxValue: number[], defaultValue: number[]): number[] {
  return [
    parseAndClamp(value[0], minValue[0], maxValue[0], defaultValue[0]),
    parseAndClamp(value[1], minValue[1], maxValue[1], defaultValue[1]),
  ];
}

function getEngine(engine?: ThemeValue): EngineInstance {
  return (engine instanceof Engine && engine) || projection.get(engine) || projection(engine) || projection.get(DEFAULT_ENGINE_NAME);
}

// eslint-disable-next-line import/no-mutable-exports -- description seam for tests
export let Projection = class Projection {
  declare _minZoom: number;

  declare _maxZoom: number;

  declare _zoom: number;

  declare _center: number[];

  declare _canvas: ProjectionCanvas;

  declare _scale: number[];

  declare _eventNames: string[];

  declare _params: ProjectionParams;

  declare _engine: EngineInstance;

  declare _x0: number;

  declare _y0: number;

  declare _xRadius: number;

  declare _yRadius: number;

  declare _xCenter: number;

  declare _yCenter: number;

  declare _moveCenter: number[] | null;

  declare _initEvents: () => void;

  declare _disposeEvents: () => void;

  declare _fire: (name: string, arg?: ThemeValue) => void;

  declare on: (handlers: Record<string, () => void>) => () => void;

  constructor(parameters: ProjectionParams) {
    this._initEvents();
    this._params = parameters;
    this._engine = getEngine();
    this._center = this._engine.center();
    this._adjustCenter();
  }

  dispose(): void {
    this._disposeEvents();
  }

  setEngine(value: ThemeValue): void {
    const engine = getEngine(value);
    if (this._engine !== engine) {
      this._engine = engine;
      this._fire('engine');
      if (this._changeCenter(engine.center())) {
        this._triggerCenterChanged();
      }
      if (this._changeZoom(this._minZoom)) {
        this._triggerZoomChanged();
      }
      this._adjustCenter();
      this._setupScreen();
    }
  }

  setBounds(bounds: number[] | null | undefined): void {
    if (bounds !== undefined) {
      this.setEngine(this._engine.original().bounds(bounds));
    }
  }

  _setupScreen(): void {
    const canvas = this._canvas;
    const width = canvas.width;
    const height = canvas.height;
    const engine = this._engine;
    const aspectRatio = engine.ar();
    this._x0 = canvas.left + width / 2;
    this._y0 = canvas.top + height / 2;

    const min = [this.project([engine.min()[0], 0])[0], this.project([0, engine.min()[1]])[1]];
    const max = [this.project([engine.max()[0], 0])[0], this.project([0, engine.max()[1]])[1]];

    const screenAR = width / height;
    const boundsAR = _abs(max[0] - min[0]) / _abs(max[1] - min[1]);
    let correction;
    if (isNaN(boundsAR) || boundsAR === 0
        || (_min(screenAR, aspectRatio) <= aspectRatio * boundsAR && aspectRatio * boundsAR <= _max(screenAR, aspectRatio))) {
      correction = 1;
    } else {
      correction = boundsAR > 1 ? boundsAR : 1 / boundsAR;
    }

    if (aspectRatio * boundsAR >= screenAR) {
      this._xRadius = width / 2 / correction;
      this._yRadius = (width / 2) / (aspectRatio * correction);
    } else {
      this._xRadius = (height / 2) * (aspectRatio / correction);
      this._yRadius = height / 2 / correction;
    }
    this._fire('screen');
  }

  setSize(canvas: ProjectionCanvas): void {
    this._canvas = canvas;
    this._setupScreen();
  }

  getCanvas(): ProjectionCanvas {
    return this._canvas;
  }

  _toScreen(coordinates: number[]): number[] {
    return [
      this._x0 + this._xRadius * coordinates[0],
      this._y0 + this._yRadius * coordinates[1],
    ];
  }

  _fromScreen(coordinates: number[]): number[] {
    return [
      (coordinates[0] - this._x0) / this._xRadius,
      (coordinates[1] - this._y0) / this._yRadius,
    ];
  }

  _toTransformed(coordinates: number[]): number[] {
    return [
      coordinates[0] * this._zoom + this._xCenter,
      coordinates[1] * this._zoom + this._yCenter,
    ];
  }

  _toTransformedFast(coordinates: number[]): number[] {
    return [
      coordinates[0] * this._zoom,
      coordinates[1] * this._zoom,
    ];
  }

  _fromTransformed(coordinates: number[]): number[] {
    return [
      (coordinates[0] - this._xCenter) / this._zoom,
      (coordinates[1] - this._yCenter) / this._zoom,
    ];
  }

  _adjustCenter(): void {
    const center = this._engine.project(this._center);
    this._xCenter = -center[0] * this._zoom || 0;
    this._yCenter = -center[1] * this._zoom || 0;
  }

  project(coordinates: number[]): number[] {
    return this._engine.project(coordinates);
  }

  transform(coordinates: number[]): number[] {
    return this._toScreen(this._toTransformedFast(coordinates));
  }

  isInvertible(): boolean {
    return this._engine.isInvertible();
  }

  getSquareSize(size: number[]): number[] {
    return [size[0] * this._zoom * this._xRadius, size[1] * this._zoom * this._yRadius];
  }

  getZoom(): number {
    return this._zoom;
  }

  _changeZoom(value: ThemeValue): boolean {
    const oldZoom = this._zoom;
    const newZoom = this._zoom = parseAndClamp(value, this._minZoom, this._maxZoom, this._minZoom);
    const isChanged = !floatsEqual(oldZoom, newZoom);
    if (isChanged) {
      this._adjustCenter();
      this._fire('zoom');
    }
    return isChanged;
  }

  setZoom(value: ThemeValue): void {
    if (this._engine.isInvertible() && this._changeZoom(value)) {
      this._triggerZoomChanged();
    }
  }

  getScaledZoom(): number {
    return _round((this._scale.length - 1) * _ln(this._zoom) / _ln(this._maxZoom));
  }

  setScaledZoom(scaledZoom: number): void {
    this.setZoom(this._scale[_round(scaledZoom)]);
  }

  changeScaledZoom(deltaZoom: number): void {
    this.setZoom(this._scale[_max(_min(_round(this.getScaledZoom() + deltaZoom), this._scale.length - 1), 0)]);
  }

  getZoomScalePartition(): number {
    return this._scale.length - 1;
  }

  _setupScaling(): void {
    const k = _max(_round(TWO_TO_LN2 * _ln(this._maxZoom)), 4);
    const step = this._maxZoom ** (1 / k);
    let zoom = this._minZoom;
    this._scale = [zoom];
    for (let i = 1; i <= k; ++i) {
      this._scale.push(zoom *= step);
    }
  }

  setMaxZoom(maxZoom: ThemeValue): void {
    this._minZoom = DEFAULT_MIN_ZOOM;
    this._maxZoom = parseAndClamp(maxZoom, this._minZoom, _Number.MAX_VALUE, DEFAULT_MAX_ZOOM);
    this._setupScaling();
    if (this._zoom > this._maxZoom) {
      this.setZoom(this._maxZoom);
    }
    this._fire('max-zoom');
  }

  getCenter(): number[] {
    return this._center.slice();
  }

  setCenter(value: ThemeValue): void {
    if (this._engine.isInvertible() && this._changeCenter(value || [])) {
      this._triggerCenterChanged();
    }
  }

  _changeCenter(value: ThemeValue[]): boolean {
    const engine = this._engine;
    const oldCenter = this._center;
    const newCenter = this._center = parseAndClampArray(value, engine.min(), engine.max(), engine.center());
    const isChanged = !arraysEqual(oldCenter, newCenter);
    if (isChanged) {
      this._adjustCenter();
      this._fire('center');
    }
    return isChanged;
  }

  _triggerCenterChanged(): void {
    this._params.centerChanged(this.getCenter());
  }

  _triggerZoomChanged(): void {
    this._params.zoomChanged(this.getZoom());
  }

  setCenterByPoint(coordinates: number[], screenPosition: number[]): void {
    const p = this._engine.project(coordinates);
    const q = this._fromScreen(screenPosition);
    this.setCenter(this._engine.unproject([
      -q[0] / this._zoom + p[0],
      -q[1] / this._zoom + p[1],
    ]));
  }

  beginMoveCenter(): void {
    if (this._engine.isInvertible()) {
      this._moveCenter = this._center;
    }
  }

  endMoveCenter(): void {
    if (this._moveCenter) {
      if (!arraysEqual(this._moveCenter, this._center)) {
        this._triggerCenterChanged();
      }
      this._moveCenter = null;
    }
  }

  moveCenter(shift: number[]): void {
    if (this._moveCenter) {
      const current = this.toScreenPoint(this._center);
      this._changeCenter(this.fromScreenPoint([current[0] + shift[0], current[1] + shift[1]]));
    }
  }

  getViewport(): number[] {
    const unproject = this._engine.unproject;
    const lt = unproject(this._fromTransformed([-1, -1]));
    const lb = unproject(this._fromTransformed([-1, +1]));
    const rt = unproject(this._fromTransformed([+1, -1]));
    const rb = unproject(this._fromTransformed([+1, +1]));
    const minMax = findMinMax([
      selectFarthestPoint(lt[0], lb[0], rt[0], rb[0]),
      selectFarthestPoint(lt[1], rt[1], lb[1], rb[1]),
    ], [
      selectFarthestPoint(rt[0], rb[0], lt[0], lb[0]),
      selectFarthestPoint(lb[1], rb[1], lt[1], rt[1]),
    ]);
    // @ts-expect-error concat of the untyped `[]` literal (never[]) does not accept numbers
    return [].concat(minMax.min[0], minMax.max[1], minMax.max[0], minMax.min[1]);
  }

  // T254127
  // There should be no expectation that if viewport is got with `getViewport` and set with `setViewport`
  // then center and zoom will be retained - in general case they will be not.
  // Such retaining requires invertibility of projection which is generally not available
  // Invertibility means that `project(unproject([x, y])) === [x, y]` and `unproject(project([x, y])) === [x, y]` for any reasonable `(x, y)`
  // For example:
  // the "mercator" is non invertible - longitude is invertible, latitude is not (because of tan and log)
  // the "equirectangular" is invertible (it uses simple linear transformations)
  setViewport(viewport: number[] | null | undefined): void {
    const engine = this._engine;
    const data = viewport ? getZoomAndCenterFromViewport(engine.project, engine.unproject, viewport) : [this._minZoom, engine.center()];
    this.setZoom(data[0]);
    this.setCenter(data[1]);
  }

  getTransform(): { translateX: number; translateY: number } {
    return { translateX: this._xCenter * this._xRadius, translateY: this._yCenter * this._yRadius };
  }

  fromScreenPoint(coordinates: number[]): number[] {
    return this._engine.unproject(this._fromTransformed(this._fromScreen(coordinates)));
  }

  toScreenPoint(coordinates: number[]): number[] {
    return this._toScreen(this._toTransformed(this._engine.project(coordinates)));
  }
};

Object.assign(Projection.prototype, {
  _minZoom: DEFAULT_MIN_ZOOM,
  _maxZoom: DEFAULT_MAX_ZOOM,
  _zoom: DEFAULT_MIN_ZOOM,
  _center: DEFAULT_CENTER,
  _canvas: {},
  _scale: [],
  _eventNames: ['engine', 'screen', 'center', 'zoom', 'max-zoom'],
});

makeEventEmitter(Projection);

function selectFarthestPoint(point1: number, point2: number, basePoint1: number, basePoint2: number): number {
  const basePoint = (basePoint1 + basePoint2) / 2;
  return _abs(point1 - basePoint) > _abs(point2 - basePoint) ? point1 : point2;
}

function selectClosestPoint(point1: number, point2: number, basePoint1: number, basePoint2: number): number {
  const basePoint = (basePoint1 + basePoint2) / 2;
  return _abs(point1 - basePoint) < _abs(point2 - basePoint) ? point1 : point2;
}

function getZoomAndCenterFromViewport(project: ProjectMethod, unproject: ProjectMethod, viewport: number[]): [number, number[]] {
  const lt = project([viewport[0], viewport[3]]);
  const lb = project([viewport[0], viewport[1]]);
  const rt = project([viewport[2], viewport[3]]);
  const rb = project([viewport[2], viewport[1]]);
  const l = selectClosestPoint(lt[0], lb[0], rt[0], rb[0]);
  const r = selectClosestPoint(rt[0], rb[0], lt[0], lb[0]);
  const t = selectClosestPoint(lt[1], rt[1], lb[1], rb[1]);
  const b = selectClosestPoint(lb[1], rb[1], lt[1], rt[1]);
  return [
    2 / _max(_abs(l - r), _abs(t - b)),
    unproject([(l + r) / 2, (t + b) / 2]),
  ];
}

function setMinMax(engine: EngineInstance, p1: number[], p2: number[]): void {
  const { min, max } = findMinMax(p1, p2);
  engine.min = returnArray(min);
  engine.max = returnArray(max);
}

const Engine = class {
  declare min: () => number[];

  declare max: () => number[];

  declare isInvertible: () => boolean;

  declare project: ProjectMethod;

  declare unproject: ProjectMethod;

  declare original: () => EngineInstance;

  declare source: () => EngineParameters;

  declare ar: () => number;

  declare center: () => number[];

  constructor(parameters: EngineParameters) {
    const that = this;
    const project = createProjectMethod(parameters.to);
    const unproject = parameters.from ? createUnprojectMethod(parameters.from) : returnValue(DEFAULT_CENTER);

    that.project = project;
    that.unproject = unproject;
    that.original = returnValue(that);
    that.source = function (): EngineParameters {
      return extend({}, parameters);
    };
    that.isInvertible = returnValue(!!parameters.from);
    that.ar = returnValue(parameters.aspectRatio > 0 ? _Number(parameters.aspectRatio) : 1);
    that.center = returnArray(unproject([0, 0]));
    setMinMax(that, [
      unproject([-1, 0])[0],
      unproject([0, +1])[1],
    ], [
      unproject([+1, 0])[0],
      unproject([0, -1])[1],
    ]);
  }

  aspectRatio(aspectRatio: ThemeValue): EngineInstance {
    const engine = new Engine(extend(this.source(), { aspectRatio }));
    engine.original = this.original;
    engine.min = this.min;
    engine.max = this.max;
    return engine;
  }

  bounds(bounds: number[] | null | undefined): EngineInstance {
    bounds = bounds || [];
    const parameters = this.source();
    const min = this.min();
    const max = this.max();
    const b1 = parseAndClampArray([bounds[0], bounds[1]], min, max, min);
    const b2 = parseAndClampArray([bounds[2], bounds[3]], min, max, max);
    const p1 = parameters.to(b1);
    const p2 = parameters.to(b2);
    const delta = _min(_abs(p2[0] - p1[0]) > MIN_BOUNDS_RANGE ? _abs(p2[0] - p1[0]) : 2, _abs(p2[1] - p1[1]) > MIN_BOUNDS_RANGE ? _abs(p2[1] - p1[1]) : 2);

    if (delta < 2) {
      extend(parameters, createProjectUnprojectMethods(parameters.to, parameters.from, p1, p2, delta));
    }
    const engine = new Engine(parameters);

    engine.original = this.original;
    setMinMax(engine, b1, b2);
    return engine;
  }
};

function invertVerticalAxis(pair: number[]): number[] {
  return [pair[0], -pair[1]];
}

function createProjectMethod(method: ProjectMethod): ProjectMethod {
  return (arg) => invertVerticalAxis(method(arg));
}

function createUnprojectMethod(method: ProjectMethod): ProjectMethod {
  return (arg) => method(invertVerticalAxis(arg));
}

function returnValue<T>(value: T): () => T {
  return () => value;
}

function returnArray(value: number[]): () => number[] {
  return () => value.slice();
}

function findMinMax(p1: number[], p2: number[]): { min: number[]; max: number[] } {
  return {
    min: [_min(p1[0], p2[0]), _min(p1[1], p2[1])],
    max: [_max(p1[0], p2[0]), _max(p1[1], p2[1])],
  };
}

export const projection = function (parameters) {
  return parameters && parameters.to ? new Engine(parameters) : null;
};

const projectionsCache = {};

projection.get = function (name) {
  return projectionsCache[name] || null;
};

projection.add = function (name, engine) {
  engine = (engine instanceof Engine && engine) || projection(engine);
  if (!projectionsCache[name] && engine) {
    projectionsCache[name] = engine;
  }
  return projection; // For chaining
};

function createProjectUnprojectMethods(project, unproject, p1, p2, delta) {
  const x0 = (p1[0] + p2[0]) / 2 - delta / 2;
  const y0 = (p1[1] + p2[1]) / 2 - delta / 2;
  const k = 2 / delta;
  return {
    to(coordinates) {
      const [p0, p1] = project(coordinates);
      return [-1 + (p0 - x0) * k, -1 + (p1 - y0) * k];
    },
    from(coordinates) {
      return unproject([x0 + (coordinates[0] + 1) / k, y0 + (coordinates[1] + 1) / k]);
    },
  };
}

/// #DEBUG
export { Engine as _TESTS_Engine };
/// #ENDDEBUG

/// #DEBUG
export function DEBUG_set_Projection(value: typeof Projection): void {
  Projection = value;
}
/// #ENDDEBUG
