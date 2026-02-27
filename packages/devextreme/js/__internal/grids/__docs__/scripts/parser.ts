/* eslint-disable spellcheck/spell-checker,no-restricted-syntax,max-depth */
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript';

import {
  EXCLUDED_DIRS,
  EXCLUDED_FILE_NAMES,
  getFeatureAreaFromPath,
  GRID_CORE_ROOT,
  MODULE_SUFFIX,
} from './constants';
import type {
  ClassRegistrationInfo, ExtenderInfo, ModuleInfo, ParsedFile, RuntimeDependency,
} from './types';

// ─── File Discovery ──────────────────────────────────────────────────────────

export function discoverSourceFiles(rootDir: string): string[] {
  const results: string[] = [];

  function walk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (EXCLUDED_DIRS.has(entry.name)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        walk(fullPath);
      } else if (
        entry.isFile()
        && !EXCLUDED_FILE_NAMES.has(entry.name)
        && entry.name.endsWith('.ts')
        && !entry.name.includes('.test.')
      ) {
        results.push(fullPath);
      }
    }
  }

  walk(rootDir);
  return results.sort();
}

// ─── AST Helpers ─────────────────────────────────────────────────────────────

export function getRelativePath(filePath: string): string {
  return path.relative(GRID_CORE_ROOT, filePath).replace(/\\/g, '/');
}

function getNodeText(node: ts.Node, sourceFile: ts.SourceFile): string {
  return node.getText(sourceFile).trim();
}

/**
 * Parse a heritage string like "Mixin(Base)" or "Mixin(Mixin2(Base))".
 *
 * Note: only handles single-argument mixin calls (which is the pattern used
 * throughout the grid_core codebase). Multi-argument patterns are not supported.
 */
export function parseHeritageString(text: string): { baseClass: string; mixins: string[] } {
  const mixins: string[] = [];

  let current = text;
  while (true) {
    const match = /^(\w+)\((.+)\)$/.exec(current);
    if (match) {
      const [, mixinName, innerExpr] = match;
      mixins.push(mixinName);
      current = innerExpr;
    } else {
      break;
    }
  }

  return { baseClass: mixins.length > 0 ? `${mixins[mixins.length - 1]}(${current})` : current, mixins };
}

/**
 * Parse a class heritage expression like:
 * - `modules.Controller`
 * - `ColumnsView`
 * - `ColumnStateMixin(modules.View)`
 * - `ColumnContextMenuMixin(ColumnsView)`
 * - `EditorFactoryMixin(modules.ViewController)`
 *
 * Returns { baseClass, mixins }
 */
function parseHeritageExpression(
  expr: ts.Expression,
  sourceFile: ts.SourceFile,
  localVars: Map<string, string>,
): { baseClass: string; mixins: string[] } {
  const text = getNodeText(expr, sourceFile);

  if (ts.isIdentifier(expr) && localVars.has(text)) {
    const resolved = localVars.get(text) ?? '';
    return parseHeritageString(resolved);
  }

  return parseHeritageString(text);
}

// ─── Runtime Dependency Collection ───────────────────────────────────────────

function collectRuntimeDeps(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  ownerName: string,
  deps: RuntimeDependency[],
): void {
  function visit(n: ts.Node): void {
    if (ts.isCallExpression(n)) {
      const callText = getNodeText(n.expression, sourceFile);

      if (
        (callText.endsWith('.getController') || callText.endsWith('.getView'))
        && n.arguments.length > 0
        && ts.isStringLiteral(n.arguments[0])
      ) {
        const isController = callText.includes('getController');
        const depName = n.arguments[0].text;

        // Determine method location
        let location = 'other';
        let { parent } = n;
        while (parent) {
          if (ts.isMethodDeclaration(parent) && parent.name && ts.isIdentifier(parent.name)) {
            location = parent.name.text;
            break;
          }
          if (ts.isConstructorDeclaration(parent)) {
            location = 'constructor';
            break;
          }
          parent = parent.parent;
        }

        deps.push({
          from: ownerName,
          fromModule: '', // will be resolved later
          to: depName,
          toType: isController ? 'controller' : 'view',
          via: isController ? 'getController' : 'getView',
          location,
        });
      }
    }

    ts.forEachChild(n, visit);
  }

  ts.forEachChild(node, visit);
}

// ─── Module Parsing ──────────────────────────────────────────────────────────

function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }
  const modifiers = ts.getModifiers(node);
  return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function getClassHeritage(
  node: ts.ClassDeclaration | ts.ClassExpression,
  sourceFile: ts.SourceFile,
  localVars: Map<string, string>,
): { baseClass: string; mixins: string[] } {
  if (!node.heritageClauses) {
    return { baseClass: '', mixins: [] };
  }

  for (const clause of node.heritageClauses) {
    if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length > 0) {
      return parseHeritageExpression(clause.types[0].expression, sourceFile, localVars);
    }
  }

  return { baseClass: '', mixins: [] };
}

function guessRegisteredName(moduleName: string): string | null {
  if (moduleName.endsWith(MODULE_SUFFIX)) {
    return moduleName.slice(0, -MODULE_SUFFIX.length);
  }
  return null;
}

function parseExtenders(
  obj: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
  parsedFile: ParsedFile,
  target: { controllers: Record<string, ExtenderInfo>; views: Record<string, ExtenderInfo> },
): void {
  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop) || !prop.name || !ts.isIdentifier(prop.name)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const section = prop.name.text; // 'controllers' or 'views'

    if ((section === 'controllers' || section === 'views') && ts.isObjectLiteralExpression(prop.initializer)) {
      const targetSection = target[section];
      for (const extProp of prop.initializer.properties) {
        let extName = '';
        let extenderName = '';
        let pattern: 'mixin-function' | 'object' = 'mixin-function';

        if (ts.isPropertyAssignment(extProp) && extProp.name) {
          extName = ts.isIdentifier(extProp.name)
            ? extProp.name.text
            : getNodeText(extProp.name, sourceFile);
          extenderName = getNodeText(extProp.initializer, sourceFile);

          // Determine pattern: check if the referenced variable is an arrow function
          const localValue = parsedFile.localVars.get(extenderName);
          if (localValue?.includes('=>')) {
            pattern = 'mixin-function';
          } else if (ts.isArrowFunction(extProp.initializer)) {
            pattern = 'mixin-function';
            extenderName = `(inline arrow in ${extName})`;
          } else if (ts.isObjectLiteralExpression(extProp.initializer)) {
            pattern = 'object';
            extenderName = `(inline object in ${extName})`;
          }
        } else if (ts.isShorthandPropertyAssignment(extProp)) {
          extName = extProp.name.text;
          extenderName = extProp.name.text;
        }

        if (extName) {
          targetSection[extName] = { extenderName, pattern };
        }
      }
    }
  }
}

export function parseControllersOrViews(
  obj: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
  relPath: string,
  parsedFile: ParsedFile,
  target: Record<string, ClassRegistrationInfo>,
): void {
  for (const prop of obj.properties) {
    let regName = '';
    let classRef = '';

    if (ts.isPropertyAssignment(prop) && prop.name) {
      regName = ts.isIdentifier(prop.name) ? prop.name.text : getNodeText(prop.name, sourceFile);
      classRef = getNodeText(prop.initializer, sourceFile);
    } else if (ts.isShorthandPropertyAssignment(prop)) {
      regName = prop.name.text;
      classRef = prop.name.text;
    }

    if (!regName) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const classInfo = parsedFile.classes.get(classRef);

    target[regName] = {
      className: classRef,
      baseClass: classInfo?.baseClass ?? 'unknown',
      mixins: classInfo?.mixins ?? [],
      sourceFile: relPath,
      isExported: classInfo?.isExported ?? false,
      featureArea: getFeatureAreaFromPath(relPath),
    };
  }
}

function parseModuleDefinition(
  moduleName: string,
  obj: ts.ObjectLiteralExpression,
  sourceFile: ts.SourceFile,
  relPath: string,
  parsedFile: ParsedFile,
): ModuleInfo {
  const moduleInfo: ModuleInfo = {
    moduleName,
    registeredAs: guessRegisteredName(moduleName),
    sourceFile: relPath,
    featureArea: getFeatureAreaFromPath(relPath),
    controllers: {},
    views: {},
    extenders: { controllers: {}, views: {} },
    hasDefaultOptions: false,
  };

  for (const prop of obj.properties) {
    if (!ts.isPropertyAssignment(prop)
      && !ts.isMethodDeclaration(prop)
      && !ts.isShorthandPropertyAssignment(prop)
    ) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const propName = prop.name && ts.isIdentifier(prop.name) ? prop.name.text : '';

    if (propName === 'defaultOptions') {
      moduleInfo.hasDefaultOptions = true;
    }

    if (propName === 'controllers' && ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer)) {
      parseControllersOrViews(
        prop.initializer,
        sourceFile,
        relPath,
        parsedFile,
        moduleInfo.controllers,
      );
    }

    if (propName === 'views' && ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer)) {
      parseControllersOrViews(prop.initializer, sourceFile, relPath, parsedFile, moduleInfo.views);
    }

    if (propName === 'extenders' && ts.isPropertyAssignment(prop) && ts.isObjectLiteralExpression(prop.initializer)) {
      parseExtenders(prop.initializer, sourceFile, parsedFile, moduleInfo.extenders);
    }
  }

  return moduleInfo;
}

export function parseFile(filePath: string): ParsedFile {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sourceFile = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const relPath = getRelativePath(filePath);
  const result: ParsedFile = {
    filePath,
    relPath,
    modules: [],
    classes: new Map(),
    runtimeDeps: [],
    localVars: new Map(),
    importAliases: new Map(),
    importedNames: new Map(),
  };

  // Collect import aliases (import { X as Y } from '...')
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isImportDeclaration(node)
      && node.importClause && node.moduleSpecifier
      && ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const fromPath = node.moduleSpecifier.text;
      const { namedBindings } = node.importClause;
      if (namedBindings && ts.isNamedImports(namedBindings)) {
        for (const spec of namedBindings.elements) {
          const localName = spec.name.text;
          const originalName = spec.propertyName ? spec.propertyName.text : spec.name.text;
          result.importedNames.set(localName, originalName);
          if (spec.propertyName) {
            result.importAliases.set(localName, {
              localName,
              originalName,
              fromPath,
            });
          }
        }
      }
      // Handle default imports: import X from '...'
      if (node.importClause.name) {
        const localName = node.importClause.name.text;
        result.importedNames.set(localName, localName);
      }
    }
  });

  // Collect local variable assignments (for intermediate base class vars)
  ts.forEachChild(sourceFile, (node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          const varName = decl.name.text;
          const initText = getNodeText(decl.initializer, sourceFile);
          result.localVars.set(varName, initText);
        }
      }
    }
  });

  // Collect classes, modules, runtime deps
  ts.forEachChild(sourceFile, (node) => {
    // Class declarations
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;
      const isExported = hasExportModifier(node);
      const heritage = getClassHeritage(node, sourceFile, result.localVars);

      result.classes.set(className, {
        baseClass: heritage.baseClass,
        mixins: heritage.mixins,
        isExported,
      });

      // Collect getController/getView calls within the class
      collectRuntimeDeps(node, sourceFile, className, result.runtimeDeps);
    }

    // Exported variable statements (module definitions & extender consts)
    if (ts.isVariableStatement(node)) {
      const isExported = hasExportModifier(node);
      for (const decl of node.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const varName = decl.name.text;

        // Module definition: export const fooModule = { ... }
        if (isExported
          && varName.endsWith(MODULE_SUFFIX)
          && decl.initializer
          && ts.isObjectLiteralExpression(decl.initializer)
        ) {
          const moduleInfo = parseModuleDefinition(
            varName,
            decl.initializer,
            sourceFile,
            relPath,
            result,
          );
          result.modules.push(moduleInfo);
        }

        // Extender mixin: const foo = (Base: ...) => class ... extends Base { ... }
        // Collect runtime deps from arrow function class bodies
        if (decl.initializer && ts.isArrowFunction(decl.initializer)) {
          const arrowBody = decl.initializer.body;
          if (ts.isClassExpression(arrowBody)) {
            collectRuntimeDeps(arrowBody, sourceFile, varName, result.runtimeDeps);
          }
        }
      }
    }
  });

  return result;
}
