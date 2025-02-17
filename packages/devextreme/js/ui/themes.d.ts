/**
                                                                    * An object that serves as a namespace for the methods that work with DevExtreme CSS Themes.
                                                                    */
                                                                   export default class themes {
    /**
     * Gets the current theme&apos;s name.
     */
    static current(): string;
    /**
     * Sets a theme with a specific name.
     */
    static current(themeName: string): void;
    /**
     * Specifies a function to be executed each time a theme is switched.
     */
    static ready(callback: Function): void;
    /**
     * Specifies a function to be executed after a theme is loaded.
     */
    static initialized(callback: Function): void;
}

/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function current(): string;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function isMaterialBased(theme: string): boolean;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function isFluent(theme: string): boolean;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function isMaterial(theme: string): boolean;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function isGeneric(theme: string): boolean;
/**
 * @deprecated Attention! This type is for internal purposes only. If you used it previously, please submit a ticket to our {@link https://supportcenter.devexpress.com/ticket/create Support Center}. We will check if there is an alternative solution.
 */
export function isCompact(theme: string): boolean;
