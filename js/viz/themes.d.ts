

/**
 * @docid viz.currentTheme
 * @publicName currentTheme()
 * @return string
 * @static
 * @module viz/themes
 * @export currentTheme
 * @public
 */
export function currentTheme(): string;

/**
 * @docid viz.currentTheme
 * @publicName currentTheme(platform, colorScheme)
 * @param1 platform:string
 * @param2 colorScheme:string
 * @static
 * @module viz/themes
 * @export currentTheme
 * @public
 */
export function currentTheme(platform: string, colorScheme: string): void;

/**
 * @docid viz.currentTheme
 * @publicName currentTheme(theme)
 * @param1 theme:string
 * @static
 * @module viz/themes
 * @export currentTheme
 * @public
 */
export function currentTheme(theme: string): void;

/**
 * @docid viz.getTheme
 * @publicName getTheme(theme)
 * @param1 theme:string
 * @return object
 * @static
 * @module viz/themes
 * @export getTheme
 * @public
 */
export function getTheme(theme: string): any;

/**
 * @docid viz.refreshTheme
 * @publicName refreshTheme()
 * @static
 * @module viz/themes
 * @export refreshTheme
 * @public
 */
export function refreshTheme(): void;

/**
 * @docid viz.registerTheme
 * @publicName registerTheme(customTheme, baseTheme)
 * @param1 customTheme:object
 * @param2 baseTheme:string
 * @static
 * @module viz/themes
 * @export registerTheme
 * @public
 */
export function registerTheme(customTheme: any, baseTheme: string): void;