import Callbacks from '@js/core/utils/callbacks';

export const themeReadyCallback = Callbacks();

/*
 * Fires when the colour mode an element resolves to may have changed: a theme switch, or an
 * application telling us it moved a `dx-theme-mode-*` class itself. Anything that was detached
 * from the scope it belongs to - today that is open overlays, which render in the viewport -
 * re-reads its mode here. Lives beside themeReadyCallback so that neither themes.ts nor the
 * overlay has to import the other.
 */
export const themeModeChangedCallback = Callbacks();
