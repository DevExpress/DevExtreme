/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import DiagramBar from '@ts/ui/diagram/diagram.bar';
import { getDiagram } from '@ts/ui/diagram/diagram.importer';

class DiagramOptionsUpdateBar extends DiagramBar {
  private _updateLock!: number;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commandOptions?: Record<any, any>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(owner: any) {
    super(owner);

    const { DiagramCommand } = getDiagram();
    this.commandOptions = {};
    this.commandOptions[DiagramCommand.Fullscreen] = 'fullScreen';
    this.commandOptions[DiagramCommand.ZoomLevel] = (value): void => {
      if (typeof this._getOption('zoomLevel') === 'object') {
        this._setOption('zoomLevel.value', value);
      } else {
        this._setOption('zoomLevel', value);
      }
    };
    this.commandOptions[DiagramCommand.SwitchAutoZoom] = (value): void => {
      const { AutoZoomMode } = getDiagram();
      switch (value) {
        case AutoZoomMode.FitContent:
          this._setOption('autoZoomMode', 'fitContent');
          break;
        case AutoZoomMode.FitToWidth:
          this._setOption('autoZoomMode', 'fitWidth');
          break;
        case AutoZoomMode.Disabled:
          this._setOption('autoZoomMode', 'disabled');
          break;
        default:
          break;
      }
    };
    this.commandOptions[DiagramCommand.ToggleSimpleView] = 'simpleView';
    this.commandOptions[DiagramCommand.ShowGrid] = 'showGrid';
    this.commandOptions[DiagramCommand.SnapToGrid] = 'snapToGrid';
    this.commandOptions[DiagramCommand.GridSize] = (value): void => {
      if (typeof this._getOption('gridSize') === 'object') {
        this._setOption('gridSize.value', value);
      } else {
        this._setOption('gridSize', value);
      }
    };
    this.commandOptions[DiagramCommand.ViewUnits] = 'viewUnits';
    this.commandOptions[DiagramCommand.PageSize] = (value): void => {
      const pageSize = this._getOption('pageSize');
      if (
        pageSize === undefined
        || pageSize.width !== value.width
        || pageSize.height !== value.height
      ) {
        this._setOption('pageSize', value);
      }
    };
    this.commandOptions[DiagramCommand.PageLandscape] = (value): void => {
      this._setOption('pageOrientation', value ? 'landscape' : 'portrait');
    };
    this.commandOptions[DiagramCommand.ViewUnits] = (value): void => {
      const { DiagramUnit } = getDiagram();
      switch (value) {
        case DiagramUnit.In:
          this._setOption('viewUnits', 'in');
          break;
        case DiagramUnit.Cm:
          this._setOption('viewUnits', 'cm');
          break;
        case DiagramUnit.Px:
          this._setOption('viewUnits', 'px');
          break;
        default:
          break;
      }
    };
    this.commandOptions[DiagramCommand.PageColor] = 'pageColor';

    this._updateLock = 0;
  }

  getCommandKeys(): number[] {
    // @ts-expect-error ts-error
    return Object.keys(this.commandOptions).map((key): number => parseInt(key, 10));
  }

  setItemValue(key, value): void {
    if (this.isUpdateLocked()) return;

    this.beginUpdate();
    try {
      if (typeof this.commandOptions?.[key] === 'function') {
        this.commandOptions?.[key].call(this, value);
      } else {
        this._setOption(this.commandOptions?.[key], value);
      }
    } finally {
      this.endUpdate();
    }
  }

  beginUpdate(): void {
    this._updateLock += 1;
  }

  endUpdate(): void {
    this._updateLock -= 1;
  }

  isUpdateLocked(): boolean {
    return this._updateLock > 0;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _getOption(name): any {
    return this._owner.option(name);
  }

  _setOption(name, value): void {
    this._owner.option(name, value);
  }
}

export default DiagramOptionsUpdateBar;
