import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
    /**
     * @docid dxSwitchOptions.activeStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid dxSwitchOptions.focusStateEnabled
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid dxSwitchOptions.hoverStateEnabled
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid dxSwitchOptions.name
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid dxSwitchOptions.offText
     * @type string
     * @deprecated dxSwitchOptions.switchedOffText
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    offText?: string;
    /**
     * @docid dxSwitchOptions.onText
     * @type string
     * @deprecated dxSwitchOptions.switchedOnText
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    onText?: string;
    /**
     * @docid dxSwitchOptions.switchedOffText
     * @type string
     * @default "OFF"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    switchedOffText?: string;
    /**
     * @docid dxSwitchOptions.switchedOnText
     * @type string
     * @default "ON"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    switchedOnText?: string;
    /**
     * @docid dxSwitchOptions.value
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: boolean;
}
/**
 * @docid dxSwitch
 * @isEditor
 * @inherits Editor
 * @module ui/switch
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class dxSwitch extends Editor {
    constructor(element: Element, options?: dxSwitchOptions)
    constructor(element: JQuery, options?: dxSwitchOptions)
}

declare global {
interface JQuery {
    dxSwitch(): JQuery;
    dxSwitch(options: "instance"): dxSwitch;
    dxSwitch(options: string): any;
    dxSwitch(options: string, ...params: any[]): any;
    dxSwitch(options: dxSwitchOptions): JQuery;
}
}
export type Options = dxSwitchOptions;

/** @deprecated use Options instead */
export type IOptions = dxSwitchOptions;