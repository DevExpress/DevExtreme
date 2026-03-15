import { transformAsync } from '@babel/core';
import type { PluginOption } from 'vite';

function removeUninitializedClassFields(): unknown {
  return {
    visitor: {
      ClassProperty(path: { node: { value: unknown }; remove: () => void }) {
        if (path.node.value === null || path.node.value === undefined) {
          path.remove();
        }
      },
      ClassDeclaration(path: { node: { body: { body: Array<{ type: string; value: unknown }> } } }) {
        path.node.body.body = path.node.body.body.filter(
          (member) => !(member.type === 'ClassProperty' && (member.value === null || member.value === undefined)),
        );
      },
    },
  };
}

export default function devextremeInfernoPlugin(): PluginOption {
  return {
    name: 'devextreme-inferno',
    enforce: 'pre',

    async transform(code: string, id: string) {
      if (!/\.[jt]sx?$/.test(id) || id.includes('node_modules')) {
        return null;
      }

      const isTSX = id.endsWith('.tsx');
      const isTS = id.endsWith('.ts') || isTSX;

      const plugins: unknown[] = [];

      if (isTS) {
        plugins.push([
          '@babel/plugin-transform-typescript',
          {
            isTSX,
            allExtensions: true,
            allowDeclareFields: true,
            optimizeConstEnums: true,
          },
        ]);
      }

      plugins.push(
        removeUninitializedClassFields,
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        ['@babel/plugin-transform-class-properties', { loose: true }],
        'babel-plugin-inferno',
      );

      const result = await transformAsync(code, {
        filename: id,
        plugins,
        sourceMaps: true,
      });

      if (!result?.code) {
        return null;
      }

      return { code: result.code, map: result.map };
    },
  };
}
