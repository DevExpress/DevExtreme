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
    },
  };
}

function moveFieldInitializersToConstructor(): unknown {
  return {
    visitor: {
      Class(path: { node: { body: { body: unknown[] } } }) {
        const body = path.node.body.body;

        type ClassMember = {
          type: string;
          kind?: string;
          key?: { name: string };
          value?: unknown;
          static?: boolean;
          body?: { body: unknown[] };
        };

        const fieldsToMove: ClassMember[] = [];
        const remaining: unknown[] = [];

        for (const member of body as ClassMember[]) {
          if (
            member.type === 'ClassProperty'
            && member.value != null
            && !member.static
          ) {
            fieldsToMove.push(member);
          } else {
            remaining.push(member);
          }
        }

        if (fieldsToMove.length === 0) return;

        const ctor = (remaining as ClassMember[]).find(
          (m) => m.type === 'ClassMethod' && m.kind === 'constructor',
        );

        if (!ctor) return;

        const assignments = fieldsToMove.map((field) => ({
          type: 'ExpressionStatement',
          expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'MemberExpression',
              object: { type: 'ThisExpression' },
              property: { type: 'Identifier', name: field.key!.name },
              computed: false,
            },
            right: field.value,
          },
        }));

        ctor.body!.body.push(...assignments);

        path.node.body.body = remaining;
      },
    },
  };
}

export default function devextremeVitePlugin(): PluginOption {
  return {
    name: 'vite-plugin-devextreme',
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
        moveFieldInitializersToConstructor,
        ['@babel/plugin-proposal-decorators', { legacy: true }],
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
