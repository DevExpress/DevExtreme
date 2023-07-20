export interface ThemeReadyCallback {
  add(fn?: Function): ThemeReadyCallback;
}

// eslint-disable-next-line @typescript-eslint/init-declarations
export const themeReadyCallback: ThemeReadyCallback;
