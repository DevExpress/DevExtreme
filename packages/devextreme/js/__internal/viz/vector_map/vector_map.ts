/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import '@ts/viz/vector_map/projection';

import componentRegistrator from '@js/core/component_registrator';
// PLUGINS_SECTION
import type { AnnotationsPluginMembers } from '@ts/viz/core/annotations';
import { plugins as annotationsPlugins } from '@ts/viz/core/annotations';
import type { ThemeValue } from '@ts/viz/core/base_theme_manager';
import BaseWidget from '@ts/viz/core/base_widget';
import { plugin as ExportPlugin } from '@ts/viz/core/export';
import { setupWidgetPrototype } from '@ts/viz/core/helpers';
import { plugin as LoadingIndicatorPlugin } from '@ts/viz/core/loading_indicator';
import { plugin as TitlePlugin } from '@ts/viz/core/title';
import type { TooltipPluginMembers } from '@ts/viz/core/tooltip';
import { plugin as TooltipPlugin } from '@ts/viz/core/tooltip';
import { parseScalar } from '@ts/viz/core/utils';
import { ControlBar } from '@ts/viz/vector_map/control_bar/control_bar';
import { DataExchanger } from '@ts/viz/vector_map/data_exchanger';
import { GestureHandler } from '@ts/viz/vector_map/gesture_handler';
import { LayoutControl } from '@ts/viz/vector_map/layout';
import { LegendsControl } from '@ts/viz/vector_map/legend';
import { getMaxBound, MapLayerCollection } from '@ts/viz/vector_map/map_layer';
import { Projection } from '@ts/viz/vector_map/projection.main';
import { TooltipViewer } from '@ts/viz/vector_map/tooltip_viewer';
import { Tracker } from '@ts/viz/vector_map/tracker';
import { generateDataKey } from '@ts/viz/vector_map/vector_map.utils';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 400;

interface MapLayout {
  left: number;
  top: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

function mergeBounds(sumBounds: number[], dataBounds: number[] | undefined): number[] {
  return dataBounds ? [
    Math.min(dataBounds[0], dataBounds[2], sumBounds[0]),
    Math.min(dataBounds[1], dataBounds[3], sumBounds[3]),
    Math.max(dataBounds[0], dataBounds[2], sumBounds[2]),
    Math.max(dataBounds[1], dataBounds[3], sumBounds[1]),
  ] : sumBounds;
}

interface VectorMap extends AnnotationsPluginMembers, TooltipPluginMembers {}

class VectorMap extends BaseWidget {
  _root;

  _projection;

  _tracker;

  _gestureHandler;

  _layoutControl;

  _dataExchanger;

  _layerCollection;

  _controlBar;

  _legendsControl;

  _tooltipViewer;

  _preventProjectionEvents!: () => void;

  _allowProjectionEvents!: () => void;

  _notifyDirty!: () => void;

  _notifyReady!: () => void;

  _getDefaultSize(): { width: number; height: number } {
    return { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT };
  }

  _initLayerCollection(dataKey: string): void {
    this._layerCollection = new MapLayerCollection({
      renderer: this._renderer,
      projection: this._projection,
      themeManager: this._themeManager,
      tracker: this._tracker,
      dataKey,
      eventTrigger: this._eventTrigger,
      dataExchanger: this._dataExchanger,
      tooltip: this._tooltip,
      notifyDirty: this._notifyDirty,
      notifyReady: this._notifyReady,
      dataReady: (): void => {
        const bounds = this.option('getBoundsFromData') && !this.option('bounds')
          ? this._applyBoundsFromData()
          : undefined;

        if (!this.option('projection')) {
          const dataBounds: number[] = bounds || this._getBoundsFromData();

          if (Math.ceil(dataBounds[0]) < -180 || Math.ceil(dataBounds[3]) < -90
            || Math.floor(dataBounds[2]) > 180 || Math.floor(dataBounds[1]) > 90) {
            const longitudeLength = dataBounds[2] - dataBounds[0];
            const latitudeLength = dataBounds[1] - dataBounds[3];
            this._projection.setEngine({
              to(coordinates: number[]): number[] {
                return [
                  ((coordinates[0] - dataBounds[0]) * 2) / longitudeLength - 1,
                  ((coordinates[1] - dataBounds[3]) * 2) / latitudeLength - 1,
                ];
              },
              from(coordinates: number[]): number[] {
                return [
                  ((coordinates[0] + 1) * longitudeLength) / 2 + dataBounds[0],
                  ((coordinates[1] + 1) * latitudeLength) / 2 + dataBounds[3],
                ];
              },
            });
          }
        }
      },
    });
  }

  _applyBoundsFromData(): number[] {
    this._preventProjectionEvents();
    const bounds = this._getBoundsFromData();
    this._projection.setBounds(bounds);
    this._allowProjectionEvents();
    return bounds;
  }

  _getBoundsFromData(): number[] {
    const boundsFromDataSource = this._getBoundingBoxFromDataSource();
    let bounds = boundsFromDataSource;

    if (!bounds) {
      const layersBounds = this.getLayers()
        .map((l: ThemeValue): ThemeValue => l.getBounds())
        .filter((x: ThemeValue) => x !== undefined);
      const boundsByData = getMaxBound(layersBounds);
      if (boundsByData) {
        bounds = boundsByData;
      }
    }
    bounds = bounds || [];
    return [bounds[0], bounds[3], bounds[2], bounds[1]];
  }

  _initLegendsControl(): void {
    this._legendsControl = new LegendsControl({
      renderer: this._renderer,
      container: this._root,
      widget: this,
      layoutControl: this._layoutControl,
      themeManager: this._themeManager,
      dataExchanger: this._dataExchanger,
      notifyDirty: this._notifyDirty,
      notifyReady: this._notifyReady,
    });
  }

  _initControlBar(dataKey: string): void {
    this._controlBar = new ControlBar({
      renderer: this._renderer,
      container: this._root,
      layoutControl: this._layoutControl,
      projection: this._projection,
      tracker: this._tracker,
      dataKey,
    });
  }

  _initElements(): void {
    const dataKey = generateDataKey();
    let notifyCounter = 0;
    let preventProjectionEvents = false;

    this._preventProjectionEvents = (): void => {
      preventProjectionEvents = true;
    };
    this._allowProjectionEvents = (): void => {
      preventProjectionEvents = false;
    };
    this._notifyDirty = (): void => {
      this._resetIsReady();
      notifyCounter += 1;
    };
    this._notifyReady = (): void => {
      this._allowProjectionEvents();
      notifyCounter -= 1;
      if (notifyCounter === 0) {
        this._drawn();
      }
    };
    this._preventProjectionEvents();
    this._dataExchanger = new DataExchanger();

    // The `{ eventTrigger: that._eventTrigger }` object cannot be passed to the Projection
    // because later backward option updating is going to be added.
    this._projection = new Projection({
      centerChanged: (value: ThemeValue): void => {
        if (!preventProjectionEvents) {
          this._eventTrigger('centerChanged', { center: value });
        }
      },
      zoomChanged: (value: ThemeValue): void => {
        if (!preventProjectionEvents) {
          this._eventTrigger('zoomFactorChanged', { zoomFactor: value });
        }
      },
    });
    this._tracker = new Tracker({ root: this._root, projection: this._projection, dataKey });
    this._gestureHandler = new GestureHandler({
      projection: this._projection,
      renderer: this._renderer,
      tracker: this._tracker,
    });
    this._layoutControl = new LayoutControl(this);
    this._layoutControl.suspend();

    this._initLayerCollection(dataKey);
    this._createHtmlStructure();
    this._initControlBar(dataKey);
    this._initLegendsControl();
    this._prepareExtraElements();
    this._tooltipViewer = new TooltipViewer({
      tracker: this._tracker,
      tooltip: this._tooltip,
      layerCollection: this._layerCollection,
    });
  }

  _change_RESUME_LAYOUT(): void {
    this._layoutControl.resume();
  }

  _initCore(): void {
    this._root = this._renderer.root.attr({ align: 'center', cursor: 'default' });
    this._initElements();
  }

  _disposeCore(): void {
    this._controlBar.dispose();
    this._gestureHandler.dispose();
    this._tracker.dispose();
    this._legendsControl.dispose();
    this._layerCollection.dispose();
    this._layoutControl.dispose();
    this._tooltipViewer.dispose();
    this._dataExchanger.dispose();
    this._projection.dispose();

    Object.assign(this, {
      _dataExchanger: null,
      _gestureHandler: null,
      _projection: null,
      _tracker: null,
      _layoutControl: null,
      _root: null,
      _layerCollection: null,
      _controlBar: null,
      _legendsControl: null,
    });
  }

  _setupInteraction(): void {
    const options = {
      centeringEnabled: !!parseScalar(this._getOption('panningEnabled', true), true),
      zoomingEnabled: !!parseScalar(this._getOption('zoomingEnabled', true), true),
    };
    this._gestureHandler.setInteraction(options);
    this._controlBar.setInteraction(options);
  }

  _applySize(rect: number[]): void {
    const layout: MapLayout = {
      left: rect[0],
      top: rect[1],
      width: rect[2] - rect[0],
      height: rect[3] - rect[1],
      right: 0,
      bottom: 0,
    };
    this._projection.setSize(layout);
    this._layoutControl.setSize(layout);
    this._layerCollection.setRect([layout.left, layout.top, layout.width, layout.height]);
    this._requestChange(['EXTRA_ELEMENTS']);
  }

  // The "layers_data", "mapData", "markers" options must never be merged (because of their meaning)
  // For "layers_data" there are special cases: "layers", "layers.data", "layers[i]",
  // "layers[i].data"
  // Because of the cases (1) and (3) "option by reference" mechanism cannot be used -
  // so separate (for dxVectorMap only by now) mechanism is introduced - it handles all cases
  // (including "option by reference")
  // T318992
  // Previously mechanism used the "_optionValuesEqual" method but after T318992 usage of
  // "_optionValuesEqual" was stopped and new (more meaningful) method was added - "_optionChanging"
  _optionChanging(name: string, currentValue: ThemeValue, nextValue: ThemeValue): void {
    if (currentValue && nextValue) {
      if (name.startsWith('layers')) {
        if (currentValue.dataSource && nextValue.dataSource && currentValue !== nextValue) {
          currentValue.dataSource = null;
        } else if (name.endsWith('.dataSource')) {
          this.option(name, null);
        }
      }
    }
  }

  _applyChanges(): void {
    this._notifyDirty();
    super._applyChanges();
    this._notifyReady();
  }

  _change_PROJECTION(): void {
    this._setProjection();
  }

  _change_BOUNDS(): void {
    this._setBounds();
  }

  _change_MAX_ZOOM_FACTOR(): void {
    this._setMaxZoom();
  }

  _change_ZOOM_FACTOR(): void {
    this._setZoom();
  }

  _change_CENTER(): void {
    this._setCenter();
  }

  _change_BACKGROUND(): void {
    this._setBackgroundOptions();
  }

  _change_LAYERS(): void {
    this._setLayerCollectionOptions();
  }

  _change_CONTROL_BAR(): void {
    this._setControlBarOptions();
  }

  _change_EXTRA_ELEMENTS(): void {
    this._renderExtraElements();
  }

  _change_LEGENDS(): void {
    this._setLegendsOptions();
  }

  _change_TRACKER(): void {
    this._setTrackerOptions();
  }

  _change_INTERACTION(): void {
    this._setupInteraction();
  }

  _setProjection(): void {
    this._projection.setEngine(this.option('projection'));
  }

  _setBounds(): void {
    this._projection.setBounds(this.option('bounds'));
  }

  _setMaxZoom(): void {
    this._projection.setMaxZoom(this.option('maxZoomFactor'));
  }

  _setZoom(): void {
    this._projection.setZoom(this.option('zoomFactor'));
  }

  _setCenter(): void {
    this._projection.setCenter(this.option('center'));
  }

  _setBackgroundOptions(): void {
    this._layerCollection.setBackgroundOptions(this._getOption('background'));
  }

  _setLayerCollectionOptions(): void {
    this._layerCollection.setOptions(this.option('layers'));
  }

  _getBoundingBoxFromDataSource(): number[] | undefined {
    const layers: ThemeValue[] = this._layerCollection.items();
    const infinityBounds = [Infinity, -Infinity, -Infinity, Infinity];
    const resultBBox = layers && layers.length
      ? layers.reduce((sumBBox: number[], l) => {
        let result = sumBBox;
        const layerData = l.getData();
        const itemCount = layerData.count();
        if (itemCount > 0) {
          const rootBBox = layerData.getBBox();
          if (rootBBox) {
            result = mergeBounds(result, rootBBox);
          } else {
            for (let i = 0; i < itemCount; i += 1) {
              result = mergeBounds(result, layerData.getBBox(i));
            }
          }
        }
        return result;
      }, infinityBounds)
      : undefined;

    return resultBBox === infinityBounds ? undefined : resultBBox;
  }

  _setControlBarOptions(): void {
    this._controlBar.setOptions(this._getOption('controlBar'));
  }

  _setLegendsOptions(): void {
    this._legendsControl.setOptions(this.option('legends'));
  }

  _setTrackerOptions(): void {
    this._tracker.setOptions({
      touchEnabled: this._getOption('touchEnabled', true),
      wheelEnabled: this._getOption('wheelEnabled', true),
    });
  }

  getLayers(): ThemeValue[] {
    const layers: ThemeValue[] = this._layerCollection.items();
    return layers.map((l): ThemeValue => l.proxy);
  }

  getLayerByIndex(index: number): ThemeValue {
    const layer = this._layerCollection.byIndex(index);
    return layer ? layer.proxy : null;
  }

  getLayerByName(name: string): ThemeValue {
    const layer = this._layerCollection.byName(name);
    return layer ? layer.proxy : null;
  }

  clearSelection(noEvent?: boolean): this {
    const layers: ThemeValue[] = this._layerCollection.items();
    layers.forEach((layer) => {
      layer.clearSelection(noEvent);
    });
    return this;
  }

  center(value?: ThemeValue): this | ThemeValue {
    if (value === undefined) {
      return this._projection.getCenter();
    }
    this._projection.setCenter(value);
    return this;
  }

  zoomFactor(value?: ThemeValue): this | ThemeValue {
    if (value === undefined) {
      return this._projection.getZoom();
    }
    this._projection.setZoom(value);
    return this;
  }

  viewport(value?: ThemeValue): this | ThemeValue {
    if (value === undefined) {
      return this._projection.getViewport();
    }
    this._projection.setViewport(value);
    return this;
  }

  convertToGeo(x: number, y: number): number[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._projection.fromScreenPoint([x, y]);
  }

  convertToXY(longitude: number, latitude: number): number[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this._projection.toScreenPoint([longitude, latitude]);
  }
}

setupWidgetPrototype(VectorMap, {
  _eventsMap: {
    onClick: { name: 'click' },
    onCenterChanged: { name: 'centerChanged' },
    onZoomFactorChanged: { name: 'zoomFactorChanged' },
    onHoverChanged: { name: 'hoverChanged' },
    onSelectionChanged: { name: 'selectionChanged' },
  },
  _rootClassPrefix: 'dxm',
  _rootClass: 'dxm-vector-map',
  _themeSection: 'map',
  _fontFields: [
    'layer:area.label.font',
    'layer:marker:dot.label.font',
    'layer:marker:bubble.label.font',
    'layer:marker:pie.label.font',
    'layer:marker:image.label.font',
    'legend.font',
    'legend.title.font',
    'legend.title.subtitle.font',
  ],
  _initialChanges: [
    'PROJECTION', 'RESUME_LAYOUT', 'LAYOUT_INIT', 'BOUNDS', 'MAX_ZOOM_FACTOR', 'ZOOM_FACTOR', 'CENTER',
  ],
  _layoutChangesOrder: ['RESUME_LAYOUT', 'LAYERS'],
  _customChangesOrder: ['EXTRA_ELEMENTS'],
  _optionChangesMap: {
    background: 'BACKGROUND',
    layers: 'LAYERS',
    extraElements: 'EXTRA_ELEMENTS',
    controlBar: 'CONTROL_BAR',
    legends: 'LEGENDS',
    touchEnabled: 'TRACKER',
    wheelEnabled: 'TRACKER',
    panningEnabled: 'INTERACTION',
    zoomingEnabled: 'INTERACTION',
    projection: 'PROJECTION',
    bounds: 'BOUNDS',
    maxZoomFactor: 'MAX_ZOOM_FACTOR',
    zoomFactor: 'ZOOM_FACTOR',
    center: 'CENTER',
  },
  _optionChangesOrder: [
    'PROJECTION', 'BOUNDS', 'MAX_ZOOM_FACTOR', 'ZOOM_FACTOR', 'CENTER', 'BACKGROUND', 'CONTROL_BAR',
    'LEGENDS', 'TRACKER', 'INTERACTION',
  ],
  _themeDependentChanges: [
    'BACKGROUND', 'LAYERS', 'CONTROL_BAR', 'LEGENDS', 'TRACKER', 'INTERACTION',
  ],
});

componentRegistrator('dxVectorMap', VectorMap);

VectorMap.addPlugin(ExportPlugin);
VectorMap.addPlugin(TitlePlugin);
VectorMap.addPlugin(TooltipPlugin);
VectorMap.addPlugin(LoadingIndicatorPlugin);
VectorMap.addPlugin(annotationsPlugins.core);
VectorMap.addPlugin(annotationsPlugins.vectorMap);

export default VectorMap;
