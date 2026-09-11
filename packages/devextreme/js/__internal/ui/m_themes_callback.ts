import Callbacks from '@js/core/utils/callbacks';

export const themeReadyCallback = Callbacks();

/*
 * Fired by `themes.refreshMode()`. Anything rendered outside the scope it belongs to - today that
 * is open overlays, which live in the viewport - re-reads its mode here. It sits in this module so
 * that neither themes.ts nor the overlay has to import the other.
 */
export const themeModeChangedCallback = Callbacks();
