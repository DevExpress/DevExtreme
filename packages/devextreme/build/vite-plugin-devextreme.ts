import { transformAsync } from '@babel/core';
import type { PluginOption } from 'vite';

export function removeUninitializedClassFields(): unknown {
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

export function moveFieldInitializersToConstructor(): unknown {
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

        type Stmt = {
          type: string;
          expression?: {
            type: string;
            operator?: string;
            callee?: { type: string };
            left?: { type: string; object?: { type: string }; property?: { name: string } };
            right?: { type: string; name?: string };
          };
        };

        type Param = { type: string; name?: string; left?: { name?: string } };
        const paramNames = new Set<string>();
        for (const param of ((ctor as unknown as { params: Param[] }).params ?? [])) {
          if (param.type === 'Identifier' && param.name) {
            paramNames.add(param.name);
          } else if (param.type === 'AssignmentPattern' && param.left?.name) {
            paramNames.add(param.left.name);
          }
        }

        const ctorBody = ctor.body!.body as Stmt[];

        let insertAt = 0;
        for (let i = 0; i < ctorBody.length; i += 1) {
          const stmt = ctorBody[i];
          const isSuperCall = stmt.type === 'ExpressionStatement'
            && stmt.expression?.type === 'CallExpression'
            && stmt.expression.callee?.type === 'Super';
          const isParamPropertyAssignment = stmt.type === 'ExpressionStatement'
            && stmt.expression?.type === 'AssignmentExpression'
            && stmt.expression.operator === '='
            && stmt.expression.left?.type === 'MemberExpression'
            && stmt.expression.left.object?.type === 'ThisExpression'
            && stmt.expression.right?.type === 'Identifier'
            && stmt.expression.left.property?.name === stmt.expression.right.name
            && paramNames.has(stmt.expression.right.name!);

          if (isSuperCall || isParamPropertyAssignment) insertAt = i + 1;
        }

        ctorBody.splice(insertAt, 0, ...(assignments as Stmt[]));

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
      const cleanId = id.split('?')[0].split('#')[0];
      if (!/\.[jt]sx?$/.test(cleanId) || cleanId.includes('node_modules')) {
        return null;
      }

      const isTSX = cleanId.endsWith('.tsx');
      const isTS = cleanId.endsWith('.ts') || isTSX;

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
        filename: cleanId,
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
