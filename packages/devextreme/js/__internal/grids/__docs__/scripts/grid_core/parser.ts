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
  ClassRegistrationInfo, ExtenderInfo, Instantiation, ModuleInfo, ParsedFile, RuntimeDependency,
} from './types';

function unwrapClassExpression(node: ts.Node): ts.ClassExpression | null {
  let current = node;
  while (ts.isParenthesizedExpression(current)) {
    current = current.expression;
  }
  return ts.isClassExpression(current) ? current : null;
}

// ─── Runtime Dependency Collection ───────────────────────────────────────────

/** Name of the method or constructor the node sits in. */
function enclosingMember(node: ts.Node): string {
  let { parent } = node;

  while (parent) {
    if (ts.isMethodDeclaration(parent) && parent.name && ts.isIdentifier(parent.name)) {
      return parent.name.text;
    }
    if (ts.isConstructorDeclaration(parent)) {
      return 'constructor';
    }
    parent = parent.parent;
  }

  return 'other';
}

/**
 * Collect how a class or extender body reaches other parts: `getController`/`getView`
 * lookups through the module registry, and classes it creates itself with `new`.
 */
function collectUsages(
  node: ts.Node,
  sourceFile: ts.SourceFile,
  ownerName: string,
  ownerRef: string,
  out: { runtimeDeps: RuntimeDependency[]; instances: Instantiation[] },
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

        out.runtimeDeps.push({
          from: ownerName,
          fromRef: ownerRef,
          fromModule: '', // will be resolved later
          to: n.arguments[0].text,
          toType: isController ? 'controller' : 'view',
          via: isController ? 'getController' : 'getView',
          location: enclosingMember(n),
        });
      }
    }

    if (ts.isNewExpression(n) && ts.isIdentifier(n.expression)) {
      out.instances.push({
        owner: ownerName,
        ownerRef,
        className: n.expression.text,
        location: enclosingMember(n),
      });
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
  registeredAs?: string,
): ModuleInfo {
  const moduleInfo: ModuleInfo = {
    moduleName,
    registeredAs: registeredAs ?? guessRegisteredName(moduleName),
    sourceFile: relPath,
    featureArea: getFeatureAreaFromPath(relPath),
    controllers: {},
    views: {},
    extenders: { controllers: {}, views: {} },
    owned: {},
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

/**
 * Collect `gridCore.registerModule('name', { ... })` calls. grid_core itself only
 * exports module objects; the matching registration lives in data_grid / tree_list,
 * and some modules are declared entirely inline there.
 */
function collectRegisteredModules(
  sourceFile: ts.SourceFile,
  relPath: string,
  parsedFile: ParsedFile,
): void {
  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isExpressionStatement(node) || !ts.isCallExpression(node.expression)) {
      return;
    }

    const call = node.expression;
    const [nameArg, moduleArg] = call.arguments;

    if (!getNodeText(call.expression, sourceFile).endsWith('.registerModule')
      || !nameArg || !ts.isStringLiteral(nameArg)
      || !moduleArg || !ts.isObjectLiteralExpression(moduleArg)
    ) {
      return;
    }

    parsedFile.modules.push(parseModuleDefinition(
      nameArg.text,
      moduleArg,
      sourceFile,
      relPath,
      parsedFile,
      nameArg.text,
    ));
  });
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
    instances: [],
    localVars: new Map(),
    importAliases: new Map(),
    importedNames: new Map(),
    extenderDefs: new Map(),
    importSources: new Map(),
  };

  // Collect import aliases (import { X as Y } from '...')
  collectImportSpecs(sourceFile).forEach((spec) => {
    if (!spec.isNamespace) {
      result.importedNames.set(
        spec.localName,
        spec.isDefault ? spec.localName : spec.originalName,
      );
      result.importSources.set(spec.localName, spec.fromPath);
    }
    if (spec.isRenamed) {
      result.importAliases.set(spec.localName, {
        localName: spec.localName,
        originalName: spec.originalName,
        fromPath: spec.fromPath,
      });
    }
  });

  // Re-exports resolve like imports, so barrel files forward to the defining file
  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isExportDeclaration(node)
      || !node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier)
      || !node.exportClause || !ts.isNamedExports(node.exportClause)
    ) {
      return;
    }

    for (const spec of node.exportClause.elements) {
      result.importedNames.set(spec.name.text, spec.propertyName?.text ?? spec.name.text);
      result.importSources.set(spec.name.text, node.moduleSpecifier.text);
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
      collectUsages(node, sourceFile, className, `class:${className}`, result);
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
        // Collect runtime deps from arrow function class bodies.
        if (decl.initializer && ts.isArrowFunction(decl.initializer)) {
          const arrowBody = unwrapClassExpression(decl.initializer.body);
          if (arrowBody) {
            result.extenderDefs.set(varName, {
              varName,
              className: arrowBody.name?.text ?? '',
            });
            collectUsages(arrowBody, sourceFile, varName, `ext:${relPath}#${varName}`, result);
          }
        }
      }
    }
  });

  collectRegisteredModules(sourceFile, relPath, result);

  return result;
}
