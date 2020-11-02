import Editor, {
    EditorOptions
} from './editor/editor';

export interface dxSwitchOptions extends EditorOptions<dxSwitch> {
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    activeStateEnabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true [for](desktop)
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    focusStateEnabled?: boolean;
    /**
     * @docid
     * @type boolean
     * @default true
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    hoverStateEnabled?: boolean;
    /**
     * @docid
     * @type string
     * @hidden false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    name?: string;
    /**
     * @docid
     * @type string
     * @default "OFF"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    switchedOffText?: string;
    /**
     * @docid
     * @type string
     * @default "ON"
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    switchedOnText?: string;
    /**
     * @docid
     * @type boolean
     * @default false
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    value?: boolean;
}
/**
 * @docid
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
