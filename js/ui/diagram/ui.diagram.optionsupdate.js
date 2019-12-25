import DiagramBar from './diagram_bar';
import { getDiagram } from './diagram_importer';

class DiagramOptionsUpdateBar extends DiagramBar {
    constructor(owner) {
        super(owner);

        const { DiagramCommand } = getDiagram();
        this.commandOptions = {};
        this.commandOptions[DiagramCommand.Fullscreen] = 'fullScreen';
        this.commandOptions[DiagramCommand.ZoomLevel] = function(value) {
            if(typeof this._getOption('zoomLevel') === 'object') {
                this._setOption('zoomLevel.value', value);
            } else {
                this._setOption('zoomLevel', value);
            }
        };
        this.commandOptions[DiagramCommand.SwitchAutoZoom] = function(value) {
            const { AutoZoomMode } = getDiagram();
            switch(value) {
                case AutoZoomMode.FitContent:
                    this._setOption('autoZoom', 'fitContent');
                    break;
                case AutoZoomMode.FitToWidth:
                    this._setOption('autoZoom', 'fitWidth');
                    break;
                case AutoZoomMode.Disabled:
                    this._setOption('autoZoom', 'disabled');
                    break;
            }
        };
        this.commandOptions[DiagramCommand.ToggleSimpleView] = 'simpleView';
        this.commandOptions[DiagramCommand.ShowGrid] = 'showGrid';
        this.commandOptions[DiagramCommand.SnapToGrid] = 'snapToGrid';
        this.commandOptions[DiagramCommand.GridSize] = function(value) {
            if(typeof this._getOption('gridSize') === 'object') {
                this._setOption('gridSize.value', value);
            } else {
                this._setOption('gridSize', value);
            }
        };
        this.commandOptions[DiagramCommand.ViewUnits] = 'viewUnits';
        this.commandOptions[DiagramCommand.PageSize] = 'pageSize';
        this.commandOptions[DiagramCommand.PageLandscape] = function(value) {
            this._setOption('pageOrientation', value ? 'landscape' : 'portrait');
        };
        this.commandOptions[DiagramCommand.ViewUnits] = function(value) {
            const { DiagramUnit } = getDiagram();
            switch(value) {
                case DiagramUnit.In:
                    this._setOption('viewUnits', 'in');
                    break;
                case DiagramUnit.Cm:
                    this._setOption('viewUnits', 'cm');
                    break;
                case DiagramUnit.Px:
                    this._setOption('viewUnits', 'px');
                    break;
            }
        };
        this.commandOptions[DiagramCommand.PageColor] = 'pageColor';

        this._updateLock = 0;
    }
    getCommandKeys() {
        return Object.keys(this.commandOptions).map(function(key) { return parseInt(key); });
    }
    setItemValue(key, value) {
        if(this.isUpdateLocked()) return;

        this.beginUpdate();
        try {
            if(typeof this.commandOptions[key] === 'function') {
                this.commandOptions[key].call(this, value);
            } else {
                this._setOption(this.commandOptions[key], value);
            }
        } finally {
            this.endUpdate();
        }
    }
    beginUpdate() {
        this._updateLock++;
    }
    endUpdate() {
        this._updateLock--;
    }
    isUpdateLocked() {
        return this._updateLock > 0;
    }

    _getOption(name) {
        return this._owner.option(name);
    }
    _setOption(name, value) {
        this._owner.option(name, value);
    }
}

module.exports = DiagramOptionsUpdateBar;
