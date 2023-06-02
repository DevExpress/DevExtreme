/**
 * @docid ui.themes
 * @namespace DevExpress.ui
 * @public
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class themes {
    /**
     * @docid ui.themes.current
     * @publicName current()
     * @static
     * @public
     */
    static current(): string;
    /**
     * @docid ui.themes.current
     * @publicName current(themeName)
     * @static
     * @public
     */
    static current(themeName: string): void;
    /**
     * @docid ui.themes.ready
     * @publicName ready(callback)
     * @static
     * @public
     */
    static ready(callback: Function): void;
    /**
     * @docid ui.themes.initialized
     * @publicName initialized(callback)
     * @static
     * @public
     */
    static initialized(callback: Function): void;
    static isMaterial(theme: string): boolean;
}

export function current(): string;
export function isMaterial(theme: string): boolean;
export function isCompact(theme: string): boolean;
