/* tslint:disable:max-line-length */


import {
    TransferState,
    Component,
    NgModule,
    ElementRef,
    NgZone,
    PLATFORM_ID,
    Inject,

    Input,
    Output,
    OnDestroy,
    EventEmitter,
    OnChanges,
    DoCheck,
    SimpleChanges,
    ContentChildren,
    QueryList
} from '@angular/core';


import DataSource from 'devextreme/data/data_source';
import { CustomCommand, ContentReadyEvent, CustomCommandEvent, DisposingEvent, InitializedEvent, ItemClickEvent, ItemDblClickEvent, OptionChangedEvent, RequestEditOperationEvent, RequestLayoutUpdateEvent, SelectionChangedEvent } from 'devextreme/ui/diagram';
import { DataSourceOptions } from 'devextreme/data/data_source';
import { Store } from 'devextreme/data/store';

import DxDiagram from 'devextreme/ui/diagram';


import {
    DxComponent,
    DxTemplateHost,
    DxIntegrationModule,
    DxTemplateModule,
    NestedOptionHost,
    IterableDifferHelper,
    WatcherHelper
} from 'devextreme-angular/core';

import { DxoContextMenuModule } from 'devextreme-angular/ui/nested';
import { DxiCommandModule } from 'devextreme-angular/ui/nested';
import { DxiItemModule } from 'devextreme-angular/ui/nested';
import { DxoContextToolboxModule } from 'devextreme-angular/ui/nested';
import { DxiCustomShapeModule } from 'devextreme-angular/ui/nested';
import { DxiConnectionPointModule } from 'devextreme-angular/ui/nested';
import { DxoDefaultItemPropertiesModule } from 'devextreme-angular/ui/nested';
import { DxoEdgesModule } from 'devextreme-angular/ui/nested';
import { DxoEditingModule } from 'devextreme-angular/ui/nested';
import { DxoExportModule } from 'devextreme-angular/ui/nested';
import { DxoGridSizeModule } from 'devextreme-angular/ui/nested';
import { DxoHistoryToolbarModule } from 'devextreme-angular/ui/nested';
import { DxoMainToolbarModule } from 'devextreme-angular/ui/nested';
import { DxoNodesModule } from 'devextreme-angular/ui/nested';
import { DxoAutoLayoutModule } from 'devextreme-angular/ui/nested';
import { DxoPageSizeModule } from 'devextreme-angular/ui/nested';
import { DxoPropertiesPanelModule } from 'devextreme-angular/ui/nested';
import { DxiTabModule } from 'devextreme-angular/ui/nested';
import { DxiGroupModule } from 'devextreme-angular/ui/nested';
import { DxoToolboxModule } from 'devextreme-angular/ui/nested';
import { DxoViewToolbarModule } from 'devextreme-angular/ui/nested';
import { DxoZoomLevelModule } from 'devextreme-angular/ui/nested';

import { DxoDiagramAutoLayoutModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramCommandModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramCommandItemModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramConnectionPointModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramContextMenuModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramContextToolboxModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramCustomShapeModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramDefaultItemPropertiesModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramEdgesModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramEditingModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramExportModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramGridSizeModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramGroupModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramHistoryToolbarModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramItemModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramMainToolbarModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramNodesModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramPageSizeModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramPageSizeItemModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramPropertiesPanelModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramTabModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramTabGroupModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramToolboxModule } from 'devextreme-angular/ui/diagram/nested';
import { DxiDiagramToolboxGroupModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramViewToolbarModule } from 'devextreme-angular/ui/diagram/nested';
import { DxoDiagramZoomLevelModule } from 'devextreme-angular/ui/diagram/nested';

import { DxiCustomShapeComponent } from 'devextreme-angular/ui/nested';

import { DxiDiagramCustomShapeComponent } from 'devextreme-angular/ui/diagram/nested';


/**
 * [descr:dxDiagram]

 */
@Component({
    selector: 'dx-diagram',
    template: '',
    providers: [
        DxTemplateHost,
        WatcherHelper,
        NestedOptionHost,
        IterableDifferHelper
    ]
})
export class DxDiagramComponent extends DxComponent implements OnDestroy, OnChanges, DoCheck {
    instance: DxDiagram = null;

    /**
     * [descr:dxDiagramOptions.autoZoomMode]
    
     */
    @Input()
    get autoZoomMode(): "fitContent" | "fitWidth" | "disabled" {
        return this._getOption('autoZoomMode');
    }
    set autoZoomMode(value: "fitContent" | "fitWidth" | "disabled") {
        this._setOption('autoZoomMode', value);
    }


    /**
     * [descr:dxDiagramOptions.contextMenu]
    
     */
    @Input()
    get contextMenu(): Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, enabled?: boolean } {
        return this._getOption('contextMenu');
    }
    set contextMenu(value: Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, enabled?: boolean }) {
        this._setOption('contextMenu', value);
    }


    /**
     * [descr:dxDiagramOptions.contextToolbox]
    
     */
    @Input()
    get contextToolbox(): Record<string, any> | { category?: "general" | "flowchart" | "orgChart" | "containers" | "custom", displayMode?: "icons" | "texts", enabled?: boolean, shapeIconsPerRow?: number, shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">, width?: number } {
        return this._getOption('contextToolbox');
    }
    set contextToolbox(value: Record<string, any> | { category?: "general" | "flowchart" | "orgChart" | "containers" | "custom", displayMode?: "icons" | "texts", enabled?: boolean, shapeIconsPerRow?: number, shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">, width?: number }) {
        this._setOption('contextToolbox', value);
    }


    /**
     * [descr:dxDiagramOptions.customShapes]
    
     */
    @Input()
    get customShapes(): Array<Record<string, any>> | { allowEditImage?: boolean, allowEditText?: boolean, allowResize?: boolean, backgroundImageHeight?: number, backgroundImageLeft?: number, backgroundImageToolboxUrl?: string, backgroundImageTop?: number, backgroundImageUrl?: string, backgroundImageWidth?: number, baseType?: "text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight", category?: string, connectionPoints?: Array<Record<string, any>> | { x?: number, y?: number }[], defaultHeight?: number, defaultImageUrl?: string, defaultText?: string, defaultWidth?: number, imageHeight?: number, imageLeft?: number, imageTop?: number, imageWidth?: number, keepRatioOnAutoSize?: boolean, maxHeight?: number, maxWidth?: number, minHeight?: number, minWidth?: number, template?: any, templateHeight?: any, templateLeft?: any, templateTop?: any, templateWidth?: any, textHeight?: number, textLeft?: number, textTop?: number, textWidth?: number, title?: string, toolboxTemplate?: any, toolboxWidthToHeightRatio?: number, type?: string }[] {
        return this._getOption('customShapes');
    }
    set customShapes(value: Array<Record<string, any>> | { allowEditImage?: boolean, allowEditText?: boolean, allowResize?: boolean, backgroundImageHeight?: number, backgroundImageLeft?: number, backgroundImageToolboxUrl?: string, backgroundImageTop?: number, backgroundImageUrl?: string, backgroundImageWidth?: number, baseType?: "text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight", category?: string, connectionPoints?: Array<Record<string, any>> | { x?: number, y?: number }[], defaultHeight?: number, defaultImageUrl?: string, defaultText?: string, defaultWidth?: number, imageHeight?: number, imageLeft?: number, imageTop?: number, imageWidth?: number, keepRatioOnAutoSize?: boolean, maxHeight?: number, maxWidth?: number, minHeight?: number, minWidth?: number, template?: any, templateHeight?: any, templateLeft?: any, templateTop?: any, templateWidth?: any, textHeight?: number, textLeft?: number, textTop?: number, textWidth?: number, title?: string, toolboxTemplate?: any, toolboxWidthToHeightRatio?: number, type?: string }[]) {
        this._setOption('customShapes', value);
    }


    /**
     * [descr:dxDiagramOptions.customShapeTemplate]
    
     */
    @Input()
    get customShapeTemplate(): any {
        return this._getOption('customShapeTemplate');
    }
    set customShapeTemplate(value: any) {
        this._setOption('customShapeTemplate', value);
    }


    /**
     * [descr:dxDiagramOptions.customShapeToolboxTemplate]
    
     */
    @Input()
    get customShapeToolboxTemplate(): any {
        return this._getOption('customShapeToolboxTemplate');
    }
    set customShapeToolboxTemplate(value: any) {
        this._setOption('customShapeToolboxTemplate', value);
    }


    /**
     * [descr:dxDiagramOptions.defaultItemProperties]
    
     */
    @Input()
    get defaultItemProperties(): Record<string, any> | { connectorLineEnd?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle", connectorLineStart?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle", connectorLineType?: "straight" | "orthogonal", shapeMaxHeight?: number, shapeMaxWidth?: number, shapeMinHeight?: number, shapeMinWidth?: number, style?: Record<string, any>, textStyle?: Record<string, any> } {
        return this._getOption('defaultItemProperties');
    }
    set defaultItemProperties(value: Record<string, any> | { connectorLineEnd?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle", connectorLineStart?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle", connectorLineType?: "straight" | "orthogonal", shapeMaxHeight?: number, shapeMaxWidth?: number, shapeMinHeight?: number, shapeMinWidth?: number, style?: Record<string, any>, textStyle?: Record<string, any> }) {
        this._setOption('defaultItemProperties', value);
    }


    /**
     * [descr:WidgetOptions.disabled]
    
     */
    @Input()
    get disabled(): boolean {
        return this._getOption('disabled');
    }
    set disabled(value: boolean) {
        this._setOption('disabled', value);
    }


    /**
     * [descr:dxDiagramOptions.edges]
    
     */
    @Input()
    get edges(): Record<string, any> | { customDataExpr?: ((data: any, value: any) => any) | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, fromExpr?: ((data: any, value: any) => any) | string, fromLineEndExpr?: ((data: any, value: any) => any) | string, fromPointIndexExpr?: ((data: any, value: any) => any) | string, keyExpr?: ((data: any, value: any) => any) | string, lineTypeExpr?: ((data: any, value: any) => any) | string, lockedExpr?: ((data: any, value: any) => any) | string, pointsExpr?: ((data: any, value: any) => any) | string, styleExpr?: ((data: any, value: any) => any) | string, textExpr?: ((data: any, value: any) => any) | string, textStyleExpr?: ((data: any, value: any) => any) | string, toExpr?: ((data: any, value: any) => any) | string, toLineEndExpr?: ((data: any, value: any) => any) | string, toPointIndexExpr?: ((data: any, value: any) => any) | string, zIndexExpr?: ((data: any, value: any) => any) | string } {
        return this._getOption('edges');
    }
    set edges(value: Record<string, any> | { customDataExpr?: ((data: any, value: any) => any) | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, fromExpr?: ((data: any, value: any) => any) | string, fromLineEndExpr?: ((data: any, value: any) => any) | string, fromPointIndexExpr?: ((data: any, value: any) => any) | string, keyExpr?: ((data: any, value: any) => any) | string, lineTypeExpr?: ((data: any, value: any) => any) | string, lockedExpr?: ((data: any, value: any) => any) | string, pointsExpr?: ((data: any, value: any) => any) | string, styleExpr?: ((data: any, value: any) => any) | string, textExpr?: ((data: any, value: any) => any) | string, textStyleExpr?: ((data: any, value: any) => any) | string, toExpr?: ((data: any, value: any) => any) | string, toLineEndExpr?: ((data: any, value: any) => any) | string, toPointIndexExpr?: ((data: any, value: any) => any) | string, zIndexExpr?: ((data: any, value: any) => any) | string }) {
        this._setOption('edges', value);
    }


    /**
     * [descr:dxDiagramOptions.editing]
    
     */
    @Input()
    get editing(): Record<string, any> | { allowAddShape?: boolean, allowChangeConnection?: boolean, allowChangeConnectorPoints?: boolean, allowChangeConnectorText?: boolean, allowChangeShapeText?: boolean, allowDeleteConnector?: boolean, allowDeleteShape?: boolean, allowMoveShape?: boolean, allowResizeShape?: boolean } {
        return this._getOption('editing');
    }
    set editing(value: Record<string, any> | { allowAddShape?: boolean, allowChangeConnection?: boolean, allowChangeConnectorPoints?: boolean, allowChangeConnectorText?: boolean, allowChangeShapeText?: boolean, allowDeleteConnector?: boolean, allowDeleteShape?: boolean, allowMoveShape?: boolean, allowResizeShape?: boolean }) {
        this._setOption('editing', value);
    }


    /**
     * [descr:DOMComponentOptions.elementAttr]
    
     */
    @Input()
    get elementAttr(): Record<string, any> {
        return this._getOption('elementAttr');
    }
    set elementAttr(value: Record<string, any>) {
        this._setOption('elementAttr', value);
    }


    /**
     * [descr:dxDiagramOptions.export]
    
     */
    @Input()
    get export(): Record<string, any> | { fileName?: string } {
        return this._getOption('export');
    }
    set export(value: Record<string, any> | { fileName?: string }) {
        this._setOption('export', value);
    }


    /**
     * [descr:dxDiagramOptions.fullScreen]
    
     */
    @Input()
    get fullScreen(): boolean {
        return this._getOption('fullScreen');
    }
    set fullScreen(value: boolean) {
        this._setOption('fullScreen', value);
    }


    /**
     * [descr:dxDiagramOptions.gridSize]
    
     */
    @Input()
    get gridSize(): number | Record<string, any> | { items?: Array<number>, value?: number } {
        return this._getOption('gridSize');
    }
    set gridSize(value: number | Record<string, any> | { items?: Array<number>, value?: number }) {
        this._setOption('gridSize', value);
    }


    /**
     * [descr:dxDiagramOptions.hasChanges]
    
     */
    @Input()
    get hasChanges(): boolean {
        return this._getOption('hasChanges');
    }
    set hasChanges(value: boolean) {
        this._setOption('hasChanges', value);
    }


    /**
     * [descr:DOMComponentOptions.height]
    
     */
    @Input()
    get height(): (() => number | string) | number | string {
        return this._getOption('height');
    }
    set height(value: (() => number | string) | number | string) {
        this._setOption('height', value);
    }


    /**
     * [descr:dxDiagramOptions.historyToolbar]
    
     */
    @Input()
    get historyToolbar(): Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean } {
        return this._getOption('historyToolbar');
    }
    set historyToolbar(value: Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean }) {
        this._setOption('historyToolbar', value);
    }


    /**
     * [descr:dxDiagramOptions.mainToolbar]
    
     */
    @Input()
    get mainToolbar(): Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean } {
        return this._getOption('mainToolbar');
    }
    set mainToolbar(value: Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean }) {
        this._setOption('mainToolbar', value);
    }


    /**
     * [descr:dxDiagramOptions.nodes]
    
     */
    @Input()
    get nodes(): Record<string, any> | { autoLayout?: Record<string, any> | "auto" | "off" | "tree" | "layered" | { orientation?: "horizontal" | "vertical", type?: "auto" | "off" | "tree" | "layered" }, autoSizeEnabled?: boolean, containerChildrenExpr?: ((data: any, value: any) => any) | string, containerKeyExpr?: ((data: any, value: any) => any) | string, customDataExpr?: ((data: any, value: any) => any) | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, heightExpr?: ((data: any, value: any) => any) | string, imageUrlExpr?: ((data: any, value: any) => any) | string, itemsExpr?: ((data: any, value: any) => any) | string, keyExpr?: ((data: any, value: any) => any) | string, leftExpr?: ((data: any, value: any) => any) | string, lockedExpr?: ((data: any, value: any) => any) | string, parentKeyExpr?: ((data: any, value: any) => any) | string, styleExpr?: ((data: any, value: any) => any) | string, textExpr?: ((data: any, value: any) => any) | string, textStyleExpr?: ((data: any, value: any) => any) | string, topExpr?: ((data: any, value: any) => any) | string, typeExpr?: ((data: any, value: any) => any) | string, widthExpr?: ((data: any, value: any) => any) | string, zIndexExpr?: ((data: any, value: any) => any) | string } {
        return this._getOption('nodes');
    }
    set nodes(value: Record<string, any> | { autoLayout?: Record<string, any> | "auto" | "off" | "tree" | "layered" | { orientation?: "horizontal" | "vertical", type?: "auto" | "off" | "tree" | "layered" }, autoSizeEnabled?: boolean, containerChildrenExpr?: ((data: any, value: any) => any) | string, containerKeyExpr?: ((data: any, value: any) => any) | string, customDataExpr?: ((data: any, value: any) => any) | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, heightExpr?: ((data: any, value: any) => any) | string, imageUrlExpr?: ((data: any, value: any) => any) | string, itemsExpr?: ((data: any, value: any) => any) | string, keyExpr?: ((data: any, value: any) => any) | string, leftExpr?: ((data: any, value: any) => any) | string, lockedExpr?: ((data: any, value: any) => any) | string, parentKeyExpr?: ((data: any, value: any) => any) | string, styleExpr?: ((data: any, value: any) => any) | string, textExpr?: ((data: any, value: any) => any) | string, textStyleExpr?: ((data: any, value: any) => any) | string, topExpr?: ((data: any, value: any) => any) | string, typeExpr?: ((data: any, value: any) => any) | string, widthExpr?: ((data: any, value: any) => any) | string, zIndexExpr?: ((data: any, value: any) => any) | string }) {
        this._setOption('nodes', value);
    }


    /**
     * [descr:dxDiagramOptions.pageColor]
    
     */
    @Input()
    get pageColor(): string {
        return this._getOption('pageColor');
    }
    set pageColor(value: string) {
        this._setOption('pageColor', value);
    }


    /**
     * [descr:dxDiagramOptions.pageOrientation]
    
     */
    @Input()
    get pageOrientation(): "portrait" | "landscape" {
        return this._getOption('pageOrientation');
    }
    set pageOrientation(value: "portrait" | "landscape") {
        this._setOption('pageOrientation', value);
    }


    /**
     * [descr:dxDiagramOptions.pageSize]
    
     */
    @Input()
    get pageSize(): Record<string, any> | { height?: number, items?: Array<Record<string, any>> | { height?: number, text?: string, width?: number }[], width?: number } {
        return this._getOption('pageSize');
    }
    set pageSize(value: Record<string, any> | { height?: number, items?: Array<Record<string, any>> | { height?: number, text?: string, width?: number }[], width?: number }) {
        this._setOption('pageSize', value);
    }


    /**
     * [descr:dxDiagramOptions.propertiesPanel]
    
     */
    @Input()
    get propertiesPanel(): Record<string, any> | { tabs?: Array<Record<string, any>> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, groups?: Array<Record<string, any>> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, title?: string }[], title?: string }[], visibility?: "auto" | "visible" | "collapsed" | "disabled" } {
        return this._getOption('propertiesPanel');
    }
    set propertiesPanel(value: Record<string, any> | { tabs?: Array<Record<string, any>> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, groups?: Array<Record<string, any>> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, title?: string }[], title?: string }[], visibility?: "auto" | "visible" | "collapsed" | "disabled" }) {
        this._setOption('propertiesPanel', value);
    }


    /**
     * [descr:dxDiagramOptions.readOnly]
    
     */
    @Input()
    get readOnly(): boolean {
        return this._getOption('readOnly');
    }
    set readOnly(value: boolean) {
        this._setOption('readOnly', value);
    }


    /**
     * [descr:DOMComponentOptions.rtlEnabled]
    
     */
    @Input()
    get rtlEnabled(): boolean {
        return this._getOption('rtlEnabled');
    }
    set rtlEnabled(value: boolean) {
        this._setOption('rtlEnabled', value);
    }


    /**
     * [descr:dxDiagramOptions.showGrid]
    
     */
    @Input()
    get showGrid(): boolean {
        return this._getOption('showGrid');
    }
    set showGrid(value: boolean) {
        this._setOption('showGrid', value);
    }


    /**
     * [descr:dxDiagramOptions.simpleView]
    
     */
    @Input()
    get simpleView(): boolean {
        return this._getOption('simpleView');
    }
    set simpleView(value: boolean) {
        this._setOption('simpleView', value);
    }


    /**
     * [descr:dxDiagramOptions.snapToGrid]
    
     */
    @Input()
    get snapToGrid(): boolean {
        return this._getOption('snapToGrid');
    }
    set snapToGrid(value: boolean) {
        this._setOption('snapToGrid', value);
    }


    /**
     * [descr:dxDiagramOptions.toolbox]
    
     */
    @Input()
    get toolbox(): Record<string, any> | { groups?: Array<Record<string, any>> | { category?: "general" | "flowchart" | "orgChart" | "containers" | "custom", displayMode?: "icons" | "texts", expanded?: boolean, shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">, title?: string }[], shapeIconsPerRow?: number, showSearch?: boolean, visibility?: "auto" | "visible" | "collapsed" | "disabled", width?: number } {
        return this._getOption('toolbox');
    }
    set toolbox(value: Record<string, any> | { groups?: Array<Record<string, any>> | { category?: "general" | "flowchart" | "orgChart" | "containers" | "custom", displayMode?: "icons" | "texts", expanded?: boolean, shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">, title?: string }[], shapeIconsPerRow?: number, showSearch?: boolean, visibility?: "auto" | "visible" | "collapsed" | "disabled", width?: number }) {
        this._setOption('toolbox', value);
    }


    /**
     * [descr:dxDiagramOptions.units]
    
     */
    @Input()
    get units(): "in" | "cm" | "px" {
        return this._getOption('units');
    }
    set units(value: "in" | "cm" | "px") {
        this._setOption('units', value);
    }


    /**
     * [descr:dxDiagramOptions.useNativeScrolling]
    
     */
    @Input()
    get useNativeScrolling(): boolean {
        return this._getOption('useNativeScrolling');
    }
    set useNativeScrolling(value: boolean) {
        this._setOption('useNativeScrolling', value);
    }


    /**
     * [descr:dxDiagramOptions.viewToolbar]
    
     */
    @Input()
    get viewToolbar(): Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean } {
        return this._getOption('viewToolbar');
    }
    set viewToolbar(value: Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean }) {
        this._setOption('viewToolbar', value);
    }


    /**
     * [descr:dxDiagramOptions.viewUnits]
    
     */
    @Input()
    get viewUnits(): "in" | "cm" | "px" {
        return this._getOption('viewUnits');
    }
    set viewUnits(value: "in" | "cm" | "px") {
        this._setOption('viewUnits', value);
    }


    /**
     * [descr:WidgetOptions.visible]
    
     */
    @Input()
    get visible(): boolean {
        return this._getOption('visible');
    }
    set visible(value: boolean) {
        this._setOption('visible', value);
    }


    /**
     * [descr:DOMComponentOptions.width]
    
     */
    @Input()
    get width(): (() => number | string) | number | string {
        return this._getOption('width');
    }
    set width(value: (() => number | string) | number | string) {
        this._setOption('width', value);
    }


    /**
     * [descr:dxDiagramOptions.zoomLevel]
    
     */
    @Input()
    get zoomLevel(): number | Record<string, any> | { items?: Array<number>, value?: number } {
        return this._getOption('zoomLevel');
    }
    set zoomLevel(value: number | Record<string, any> | { items?: Array<number>, value?: number }) {
        this._setOption('zoomLevel', value);
    }

    /**
    
     * [descr:dxDiagramOptions.onContentReady]
    
    
     */
    @Output() onContentReady: EventEmitter<ContentReadyEvent>;

    /**
    
     * [descr:dxDiagramOptions.onCustomCommand]
    
    
     */
    @Output() onCustomCommand: EventEmitter<CustomCommandEvent>;

    /**
    
     * [descr:dxDiagramOptions.onDisposing]
    
    
     */
    @Output() onDisposing: EventEmitter<DisposingEvent>;

    /**
    
     * [descr:dxDiagramOptions.onInitialized]
    
    
     */
    @Output() onInitialized: EventEmitter<InitializedEvent>;

    /**
    
     * [descr:dxDiagramOptions.onItemClick]
    
    
     */
    @Output() onItemClick: EventEmitter<ItemClickEvent>;

    /**
    
     * [descr:dxDiagramOptions.onItemDblClick]
    
    
     */
    @Output() onItemDblClick: EventEmitter<ItemDblClickEvent>;

    /**
    
     * [descr:dxDiagramOptions.onOptionChanged]
    
    
     */
    @Output() onOptionChanged: EventEmitter<OptionChangedEvent>;

    /**
    
     * [descr:dxDiagramOptions.onRequestEditOperation]
    
    
     */
    @Output() onRequestEditOperation: EventEmitter<RequestEditOperationEvent>;

    /**
    
     * [descr:dxDiagramOptions.onRequestLayoutUpdate]
    
    
     */
    @Output() onRequestLayoutUpdate: EventEmitter<RequestLayoutUpdateEvent>;

    /**
    
     * [descr:dxDiagramOptions.onSelectionChanged]
    
    
     */
    @Output() onSelectionChanged: EventEmitter<SelectionChangedEvent>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() autoZoomModeChange: EventEmitter<"fitContent" | "fitWidth" | "disabled">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() contextMenuChange: EventEmitter<Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, enabled?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() contextToolboxChange: EventEmitter<Record<string, any> | { category?: "general" | "flowchart" | "orgChart" | "containers" | "custom", displayMode?: "icons" | "texts", enabled?: boolean, shapeIconsPerRow?: number, shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">, width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customShapesChange: EventEmitter<Array<Record<string, any>> | { allowEditImage?: boolean, allowEditText?: boolean, allowResize?: boolean, backgroundImageHeight?: number, backgroundImageLeft?: number, backgroundImageToolboxUrl?: string, backgroundImageTop?: number, backgroundImageUrl?: string, backgroundImageWidth?: number, baseType?: "text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight", category?: string, connectionPoints?: Array<Record<string, any>> | { x?: number, y?: number }[], defaultHeight?: number, defaultImageUrl?: string, defaultText?: string, defaultWidth?: number, imageHeight?: number, imageLeft?: number, imageTop?: number, imageWidth?: number, keepRatioOnAutoSize?: boolean, maxHeight?: number, maxWidth?: number, minHeight?: number, minWidth?: number, template?: any, templateHeight?: any, templateLeft?: any, templateTop?: any, templateWidth?: any, textHeight?: number, textLeft?: number, textTop?: number, textWidth?: number, title?: string, toolboxTemplate?: any, toolboxWidthToHeightRatio?: number, type?: string }[]>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customShapeTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() customShapeToolboxTemplateChange: EventEmitter<any>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() defaultItemPropertiesChange: EventEmitter<Record<string, any> | { connectorLineEnd?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle", connectorLineStart?: "none" | "arrow" | "outlinedTriangle" | "filledTriangle", connectorLineType?: "straight" | "orthogonal", shapeMaxHeight?: number, shapeMaxWidth?: number, shapeMinHeight?: number, shapeMinWidth?: number, style?: Record<string, any>, textStyle?: Record<string, any> }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() disabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() edgesChange: EventEmitter<Record<string, any> | { customDataExpr?: ((data: any, value: any) => any) | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, fromExpr?: ((data: any, value: any) => any) | string, fromLineEndExpr?: ((data: any, value: any) => any) | string, fromPointIndexExpr?: ((data: any, value: any) => any) | string, keyExpr?: ((data: any, value: any) => any) | string, lineTypeExpr?: ((data: any, value: any) => any) | string, lockedExpr?: ((data: any, value: any) => any) | string, pointsExpr?: ((data: any, value: any) => any) | string, styleExpr?: ((data: any, value: any) => any) | string, textExpr?: ((data: any, value: any) => any) | string, textStyleExpr?: ((data: any, value: any) => any) | string, toExpr?: ((data: any, value: any) => any) | string, toLineEndExpr?: ((data: any, value: any) => any) | string, toPointIndexExpr?: ((data: any, value: any) => any) | string, zIndexExpr?: ((data: any, value: any) => any) | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() editingChange: EventEmitter<Record<string, any> | { allowAddShape?: boolean, allowChangeConnection?: boolean, allowChangeConnectorPoints?: boolean, allowChangeConnectorText?: boolean, allowChangeShapeText?: boolean, allowDeleteConnector?: boolean, allowDeleteShape?: boolean, allowMoveShape?: boolean, allowResizeShape?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() elementAttrChange: EventEmitter<Record<string, any>>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() exportChange: EventEmitter<Record<string, any> | { fileName?: string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() fullScreenChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() gridSizeChange: EventEmitter<number | Record<string, any> | { items?: Array<number>, value?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() hasChangesChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() heightChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() historyToolbarChange: EventEmitter<Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() mainToolbarChange: EventEmitter<Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() nodesChange: EventEmitter<Record<string, any> | { autoLayout?: Record<string, any> | "auto" | "off" | "tree" | "layered" | { orientation?: "horizontal" | "vertical", type?: "auto" | "off" | "tree" | "layered" }, autoSizeEnabled?: boolean, containerChildrenExpr?: ((data: any, value: any) => any) | string, containerKeyExpr?: ((data: any, value: any) => any) | string, customDataExpr?: ((data: any, value: any) => any) | string, dataSource?: Array<any> | DataSource | DataSourceOptions | null | Store | string, heightExpr?: ((data: any, value: any) => any) | string, imageUrlExpr?: ((data: any, value: any) => any) | string, itemsExpr?: ((data: any, value: any) => any) | string, keyExpr?: ((data: any, value: any) => any) | string, leftExpr?: ((data: any, value: any) => any) | string, lockedExpr?: ((data: any, value: any) => any) | string, parentKeyExpr?: ((data: any, value: any) => any) | string, styleExpr?: ((data: any, value: any) => any) | string, textExpr?: ((data: any, value: any) => any) | string, textStyleExpr?: ((data: any, value: any) => any) | string, topExpr?: ((data: any, value: any) => any) | string, typeExpr?: ((data: any, value: any) => any) | string, widthExpr?: ((data: any, value: any) => any) | string, zIndexExpr?: ((data: any, value: any) => any) | string }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageColorChange: EventEmitter<string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageOrientationChange: EventEmitter<"portrait" | "landscape">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() pageSizeChange: EventEmitter<Record<string, any> | { height?: number, items?: Array<Record<string, any>> | { height?: number, text?: string, width?: number }[], width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() propertiesPanelChange: EventEmitter<Record<string, any> | { tabs?: Array<Record<string, any>> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, groups?: Array<Record<string, any>> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, title?: string }[], title?: string }[], visibility?: "auto" | "visible" | "collapsed" | "disabled" }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() readOnlyChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() rtlEnabledChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() showGridChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() simpleViewChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() snapToGridChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() toolboxChange: EventEmitter<Record<string, any> | { groups?: Array<Record<string, any>> | { category?: "general" | "flowchart" | "orgChart" | "containers" | "custom", displayMode?: "icons" | "texts", expanded?: boolean, shapes?: Array<"text" | "rectangle" | "ellipse" | "cross" | "triangle" | "diamond" | "heart" | "pentagon" | "hexagon" | "octagon" | "star" | "arrowLeft" | "arrowTop" | "arrowRight" | "arrowBottom" | "arrowNorthSouth" | "arrowEastWest" | "process" | "decision" | "terminator" | "predefinedProcess" | "document" | "multipleDocuments" | "manualInput" | "preparation" | "data" | "database" | "hardDisk" | "internalStorage" | "paperTape" | "manualOperation" | "delay" | "storedData" | "display" | "merge" | "connector" | "or" | "summingJunction" | "verticalContainer" | "horizontalContainer" | "cardWithImageOnLeft" | "cardWithImageOnTop" | "cardWithImageOnRight">, title?: string }[], shapeIconsPerRow?: number, showSearch?: boolean, visibility?: "auto" | "visible" | "collapsed" | "disabled", width?: number }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() unitsChange: EventEmitter<"in" | "cm" | "px">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() useNativeScrollingChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() viewToolbarChange: EventEmitter<Record<string, any> | { commands?: Array<CustomCommand | "separator" | "exportSvg" | "exportPng" | "exportJpg" | "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll" | "delete" | "fontName" | "fontSize" | "bold" | "italic" | "underline" | "fontColor" | "lineStyle" | "lineWidth" | "lineColor" | "fillColor" | "textAlignLeft" | "textAlignCenter" | "textAlignRight" | "lock" | "unlock" | "sendToBack" | "bringToFront" | "insertShapeImage" | "editShapeImage" | "deleteShapeImage" | "connectorLineType" | "connectorLineStart" | "connectorLineEnd" | "layoutTreeTopToBottom" | "layoutTreeBottomToTop" | "layoutTreeLeftToRight" | "layoutTreeRightToLeft" | "layoutLayeredTopToBottom" | "layoutLayeredBottomToTop" | "layoutLayeredLeftToRight" | "layoutLayeredRightToLeft" | "fullScreen" | "zoomLevel" | "showGrid" | "snapToGrid" | "gridSize" | "units" | "pageSize" | "pageOrientation" | "pageColor" | "simpleView" | "toolbox">, visible?: boolean }>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() viewUnitsChange: EventEmitter<"in" | "cm" | "px">;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() visibleChange: EventEmitter<boolean>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() widthChange: EventEmitter<(() => number | string) | number | string>;

    /**
    
     * This member supports the internal infrastructure and is not intended to be used directly from your code.
    
     */
    @Output() zoomLevelChange: EventEmitter<number | Record<string, any> | { items?: Array<number>, value?: number }>;




    @ContentChildren(DxiDiagramCustomShapeComponent)
    get customShapesChildren(): QueryList<DxiDiagramCustomShapeComponent> {
        return this._getOption('customShapes');
    }
    set customShapesChildren(value) {
        this.setContentChildren('customShapes', value, 'DxiDiagramCustomShapeComponent');
        this.setChildren('customShapes', value);
    }


    @ContentChildren(DxiCustomShapeComponent)
    get customShapesLegacyChildren(): QueryList<DxiCustomShapeComponent> {
        return this._getOption('customShapes');
    }
    set customShapesLegacyChildren(value) {
        if (this.checkContentChildren('customShapes', value, 'DxiCustomShapeComponent')) {
           this.setChildren('customShapes', value);
        }
    }




    constructor(elementRef: ElementRef, ngZone: NgZone, templateHost: DxTemplateHost,
            private _watcherHelper: WatcherHelper,
            private _idh: IterableDifferHelper,
            optionHost: NestedOptionHost,
            transferState: TransferState,
            @Inject(PLATFORM_ID) platformId: any) {

        super(elementRef, ngZone, templateHost, _watcherHelper, transferState, platformId);

        this._createEventEmitters([
            { subscribe: 'contentReady', emit: 'onContentReady' },
            { subscribe: 'customCommand', emit: 'onCustomCommand' },
            { subscribe: 'disposing', emit: 'onDisposing' },
            { subscribe: 'initialized', emit: 'onInitialized' },
            { subscribe: 'itemClick', emit: 'onItemClick' },
            { subscribe: 'itemDblClick', emit: 'onItemDblClick' },
            { subscribe: 'optionChanged', emit: 'onOptionChanged' },
            { subscribe: 'requestEditOperation', emit: 'onRequestEditOperation' },
            { subscribe: 'requestLayoutUpdate', emit: 'onRequestLayoutUpdate' },
            { subscribe: 'selectionChanged', emit: 'onSelectionChanged' },
            { emit: 'autoZoomModeChange' },
            { emit: 'contextMenuChange' },
            { emit: 'contextToolboxChange' },
            { emit: 'customShapesChange' },
            { emit: 'customShapeTemplateChange' },
            { emit: 'customShapeToolboxTemplateChange' },
            { emit: 'defaultItemPropertiesChange' },
            { emit: 'disabledChange' },
            { emit: 'edgesChange' },
            { emit: 'editingChange' },
            { emit: 'elementAttrChange' },
            { emit: 'exportChange' },
            { emit: 'fullScreenChange' },
            { emit: 'gridSizeChange' },
            { emit: 'hasChangesChange' },
            { emit: 'heightChange' },
            { emit: 'historyToolbarChange' },
            { emit: 'mainToolbarChange' },
            { emit: 'nodesChange' },
            { emit: 'pageColorChange' },
            { emit: 'pageOrientationChange' },
            { emit: 'pageSizeChange' },
            { emit: 'propertiesPanelChange' },
            { emit: 'readOnlyChange' },
            { emit: 'rtlEnabledChange' },
            { emit: 'showGridChange' },
            { emit: 'simpleViewChange' },
            { emit: 'snapToGridChange' },
            { emit: 'toolboxChange' },
            { emit: 'unitsChange' },
            { emit: 'useNativeScrollingChange' },
            { emit: 'viewToolbarChange' },
            { emit: 'viewUnitsChange' },
            { emit: 'visibleChange' },
            { emit: 'widthChange' },
            { emit: 'zoomLevelChange' }
        ]);

        this._idh.setHost(this);
        optionHost.setHost(this);
    }

    protected _createInstance(element, options) {

        return new DxDiagram(element, options);
    }


    ngOnDestroy() {
        this._destroyWidget();
    }

    ngOnChanges(changes: SimpleChanges) {
        super.ngOnChanges(changes);
        this.setupChanges('customShapes', changes);
    }

    setupChanges(prop: string, changes: SimpleChanges) {
        if (!(prop in this._optionsToUpdate)) {
            this._idh.setup(prop, changes);
        }
    }

    ngDoCheck() {
        this._idh.doCheck('customShapes');
        this._watcherHelper.checkWatchers();
        super.ngDoCheck();
        super.clearChangedOptions();
    }

    _setOption(name: string, value: any) {
        let isSetup = this._idh.setupSingle(name, value);
        let isChanged = this._idh.getChanges(name, value) !== null;

        if (isSetup || isChanged) {
            super._setOption(name, value);
        }
    }
}

@NgModule({
  imports: [
    DxoContextMenuModule,
    DxiCommandModule,
    DxiItemModule,
    DxoContextToolboxModule,
    DxiCustomShapeModule,
    DxiConnectionPointModule,
    DxoDefaultItemPropertiesModule,
    DxoEdgesModule,
    DxoEditingModule,
    DxoExportModule,
    DxoGridSizeModule,
    DxoHistoryToolbarModule,
    DxoMainToolbarModule,
    DxoNodesModule,
    DxoAutoLayoutModule,
    DxoPageSizeModule,
    DxoPropertiesPanelModule,
    DxiTabModule,
    DxiGroupModule,
    DxoToolboxModule,
    DxoViewToolbarModule,
    DxoZoomLevelModule,
    DxoDiagramAutoLayoutModule,
    DxiDiagramCommandModule,
    DxiDiagramCommandItemModule,
    DxiDiagramConnectionPointModule,
    DxoDiagramContextMenuModule,
    DxoDiagramContextToolboxModule,
    DxiDiagramCustomShapeModule,
    DxoDiagramDefaultItemPropertiesModule,
    DxoDiagramEdgesModule,
    DxoDiagramEditingModule,
    DxoDiagramExportModule,
    DxoDiagramGridSizeModule,
    DxiDiagramGroupModule,
    DxoDiagramHistoryToolbarModule,
    DxiDiagramItemModule,
    DxoDiagramMainToolbarModule,
    DxoDiagramNodesModule,
    DxoDiagramPageSizeModule,
    DxiDiagramPageSizeItemModule,
    DxoDiagramPropertiesPanelModule,
    DxiDiagramTabModule,
    DxiDiagramTabGroupModule,
    DxoDiagramToolboxModule,
    DxiDiagramToolboxGroupModule,
    DxoDiagramViewToolbarModule,
    DxoDiagramZoomLevelModule,
    DxIntegrationModule,
    DxTemplateModule
  ],
  declarations: [
    DxDiagramComponent
  ],
  exports: [
    DxDiagramComponent,
    DxoContextMenuModule,
    DxiCommandModule,
    DxiItemModule,
    DxoContextToolboxModule,
    DxiCustomShapeModule,
    DxiConnectionPointModule,
    DxoDefaultItemPropertiesModule,
    DxoEdgesModule,
    DxoEditingModule,
    DxoExportModule,
    DxoGridSizeModule,
    DxoHistoryToolbarModule,
    DxoMainToolbarModule,
    DxoNodesModule,
    DxoAutoLayoutModule,
    DxoPageSizeModule,
    DxoPropertiesPanelModule,
    DxiTabModule,
    DxiGroupModule,
    DxoToolboxModule,
    DxoViewToolbarModule,
    DxoZoomLevelModule,
    DxoDiagramAutoLayoutModule,
    DxiDiagramCommandModule,
    DxiDiagramCommandItemModule,
    DxiDiagramConnectionPointModule,
    DxoDiagramContextMenuModule,
    DxoDiagramContextToolboxModule,
    DxiDiagramCustomShapeModule,
    DxoDiagramDefaultItemPropertiesModule,
    DxoDiagramEdgesModule,
    DxoDiagramEditingModule,
    DxoDiagramExportModule,
    DxoDiagramGridSizeModule,
    DxiDiagramGroupModule,
    DxoDiagramHistoryToolbarModule,
    DxiDiagramItemModule,
    DxoDiagramMainToolbarModule,
    DxoDiagramNodesModule,
    DxoDiagramPageSizeModule,
    DxiDiagramPageSizeItemModule,
    DxoDiagramPropertiesPanelModule,
    DxiDiagramTabModule,
    DxiDiagramTabGroupModule,
    DxoDiagramToolboxModule,
    DxiDiagramToolboxGroupModule,
    DxoDiagramViewToolbarModule,
    DxoDiagramZoomLevelModule,
    DxTemplateModule
  ]
})
export class DxDiagramModule { }

import type * as DxDiagramTypes from "devextreme/ui/diagram_types";
export { DxDiagramTypes };


