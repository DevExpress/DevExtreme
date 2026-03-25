/* eslint-disable spellcheck/spell-checker,max-depth */
import * as fs from 'fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript';

import {
  collectImportSpecs,
  getClassHeritage,
  getNodeText,
  hasExportModifier,
} from '../shared/ast-helpers';
import { getRelativePath } from '../shared/file-discovery';
import {
  getFeatureAreaFromPath,
  GRID_CORE_ROOT,
  MODULE_SUFFIX,
} from './constants';
import type {
  ClassRegistrationInfo, ExtenderInfo, ModuleInfo, ParsedFile, RuntimeDependency,
} from './types';

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

  const relPath = getRelativePath(filePath, GRID_CORE_ROOT);
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
  collectImportSpecs(sourceFile).forEach((spec) => {
    if (!spec.isNamespace) {
      result.importedNames.set(
        spec.localName,
        spec.isDefault ? spec.localName : spec.originalName,
      );
    }
    if (spec.isRenamed) {
      result.importAliases.set(spec.localName, {
        localName: spec.localName,
        originalName: spec.originalName,
        fromPath: spec.fromPath,
      });
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
