import { transformAsync } from '@babel/core';
import type { PluginOption } from 'vite';

function removeCjsExportsAssignments(): unknown {
  return {
    visitor: {
      ExpressionStatement(path: {
        node: { expression: { type: string; operator?: string; left?: { type: string; object?: { type: string; name?: string } } } };
        remove: () => void;
      }) {
        const { expression } = path.node;
        if (
          expression.type === 'AssignmentExpression'
          && expression.operator === '='
          && expression.left?.type === 'MemberExpression'
          && expression.left.object?.type === 'Identifier'
          && expression.left.object.name === 'exports'
        ) {
          path.remove();
        }
      },
    },
  };
}
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
      Class(path: {
        node: {
          body: { body: unknown[] };
          superClass?: unknown;
        };
      }) {
        const body = path.node.body.body;

        type CtorParam = { type: string; name?: string; left?: { name?: string } };
        type CtorBodyStmt = {
          type: string;
          expression?: {
            type: string;
            callee?: { type: string };
            operator?: string;
            left?: { type: string; object?: { type: string }; property?: { name: string } };
            right?: { type: string; name?: string };
          };
        };
        type ClassMember = {
          type: string;
          kind?: string;
          key?: { name: string };
          value?: unknown;
          static?: boolean;
          params?: CtorParam[];
          body?: { body: CtorBodyStmt[] };
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

        const ctorBody = ctor.body!.body;

        const paramNames = new Set(
          (ctor.params ?? []).map((p) => p.name ?? p.left?.name).filter(Boolean),
        );

        const superCallIdx = ctorBody.findIndex(
          (stmt) => stmt.type === 'ExpressionStatement'
            && stmt.expression?.type === 'CallExpression'
            && stmt.expression?.callee?.type === 'Super',
        );

        let insertIdx = superCallIdx !== -1 ? superCallIdx + 1 : 0;

        while (insertIdx < ctorBody.length) {
          const stmt = ctorBody[insertIdx];
          if (
            stmt.type === 'ExpressionStatement'
            && stmt.expression?.type === 'AssignmentExpression'
            && stmt.expression.operator === '='
            && stmt.expression.left?.type === 'MemberExpression'
            && stmt.expression.left.object?.type === 'ThisExpression'
            && stmt.expression.right?.type === 'Identifier'
            && paramNames.has(stmt.expression.right.name)
          ) {
            insertIdx += 1;
          } else {
            break;
          }
        }

        ctorBody.splice(insertIdx, 0, ...assignments);

        path.node.body.body = remaining;
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
        removeCjsExportsAssignments,
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
