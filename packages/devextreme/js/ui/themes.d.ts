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
}

export function current(): string;
export function isMaterialBased(theme: string): boolean;
export function isFluent(theme: string): boolean;
export function isMaterial(theme: string): boolean;
export function isGeneric(theme: string): boolean;
export function isCompact(theme: string): boolean;

/**
 * The colour mode an element is rendered in: 'light' or 'dark'.
 *
 * Unlike `current()` and `isDark()`, which answer for the loaded stylesheet, this answers for a
 * place on the page - a theme may ship both modes in one bundle and let a class pick between them.
 */
export function mode(element: Element): 'light' | 'dark';

/**
 * Re-reads the colour mode for widgets that render outside the element they belong to, such as an
 * open popup. Call it after changing what an element resolves to: moving a `dx-theme-mode-*` class,
 * or switching the whole theme.
 */
export function refreshMode(): void;
