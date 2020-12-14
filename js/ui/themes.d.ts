/**
 * @docid ui.themes
 * @namespace DevExpress.ui
 * @module ui/themes
 * @export default
 * @prevFileNamespace DevExpress.ui
 * @public
 */
export default class themes {
    /**
     * @docid ui.themes.current
     * @publicName current()
     * @static
     * @return string
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static current(): string;
    /**
     * @docid ui.themes.current
     * @publicName current(themeName)
     * @param1 themeName:string
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static current(themeName: string): void;
    /**
     * @docid ui.themes.ready
     * @publicName ready(callback)
     * @param1 callback:function
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static ready(callback: Function): void;
    /**
     * @docid ui.themes.initialized
     * @publicName initialized(callback)
     * @param1 callback:function
     * @static
     * @prevFileNamespace DevExpress.ui
     * @public
     */
    static initialized(callback: Function): void;
    static isMaterial(theme: string): boolean;
}
