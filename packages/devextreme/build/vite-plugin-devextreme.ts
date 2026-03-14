import { transformAsync } from '@babel/core';
import type { Plugin } from 'vite';

export default function devextremeInfernoPlugin(): Plugin {
  return {
    name: 'devextreme-inferno',
    enforce: 'pre',

    async transform(code: string, id: string) {
      if (!/\.[jt]sx?$/.test(id) || id.includes('node_modules')) {
        return null;
      }

      const isTSX = id.endsWith('.tsx');
      const isTS = id.endsWith('.ts') || isTSX;

      const plugins: unknown[] = [
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
        'babel-plugin-inferno',
      ];

      const presets: unknown[] = [];
      if (isTS) {
        presets.push([
          '@babel/preset-typescript',
          { isTSX, allExtensions: true },
        ]);
      }

      const result = await transformAsync(code, {
        filename: id,
        plugins,
        presets,
        sourceMaps: true,
      });

      if (!result?.code) {
        return null;
      }

      return { code: result.code, map: result.map };
    },
  };
}
