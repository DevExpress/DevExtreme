import type { UnpluginInstance } from 'unplugin';

export const DevExtremeLicensePlugin: UnpluginInstance<undefined, false>;

export const vite: UnpluginInstance<undefined, false>['vite'];
export const rollup: UnpluginInstance<undefined, false>['rollup'];
export const webpack: UnpluginInstance<undefined, false>['webpack'];
export const esbuild: UnpluginInstance<undefined, false>['esbuild'];

declare const _default: {
  vite: UnpluginInstance<undefined, false>['vite'];
  rollup: UnpluginInstance<undefined, false>['rollup'];
  webpack: UnpluginInstance<undefined, false>['webpack'];
  esbuild: UnpluginInstance<undefined, false>['esbuild'];
};

export default _default;
