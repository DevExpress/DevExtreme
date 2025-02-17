/**
 * Gets the current theme&apos;s name.
 */
export function currentTheme(): string;

/**
 * Changes the current theme for all data visualization UI components on the page. The color scheme is defined separately.
 */
export function currentTheme(platform: string, colorScheme: string): void;

/**
 * Changes the current theme for all data visualization UI components on the page.
 */
export function currentTheme(theme: string): void;

/**
 * Gets a predefined or registered theme&apos;s settings.
 */
export function getTheme(theme: string): any;

/**
 * Refreshes the current theme and palette in all data visualization UI components on the page.
 */
export function refreshTheme(): void;

/**
 * Registers a new theme based on the existing one.
 */
export function registerTheme(customTheme: any, baseTheme: string): void;
