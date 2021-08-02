export interface ThemeReadyCallback {
  add: (fn?: Function) => ThemeReadyCallback;
}

export const themeReadyCallback: ThemeReadyCallback;
