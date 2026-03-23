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
  DATA_GRID_ROOT,
  DATA_SOURCE_ADAPTER_PROVIDER,
  GRID_CORE_IMPORT_REGEXP,
  REGISTER_MODULE_RECEIVERS,
  WIDGET_BASE_FILE,
} from './constants';
import type {
  ControllerViewRef,
  ExtenderRef,
  ParsedFile,
  RegisterModuleCall,
} from './types';

function isGridCoreImport(fromPath: string): boolean {
  return GRID_CORE_IMPORT_REGEXP.test(fromPath);
}

// ─── registerModule Call Detection ───────────────────────────────────────────

function isRegisterModuleCall(node: ts.Node, sf: ts.SourceFile): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) {
    return false;
  }

  const expr = node.expression;
  if (!ts.isPropertyAccessExpression(expr)) {
    return false;
  }

  const methodName = expr.name.text;
  if (methodName !== 'registerModule') {
    return false;
  }

  const baseObj = getNodeText(expr.expression, sf).split('.')[0];

  return REGISTER_MODULE_RECEIVERS.has(baseObj);
}

function isDataSourceAdapterExtendCall(
  node: ts.Node,
  sf: ts.SourceFile,
  imports: Map<string, { localName: string; fromPath: string; isFromGridCore: boolean }>,
): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) {
    return false;
  }

  const expr = node.expression;
  if (!ts.isPropertyAccessExpression(expr) || expr.name.text !== 'extend') {
    return false;
  }

  const obj = getNodeText(expr.expression, sf);
  if (obj === DATA_SOURCE_ADAPTER_PROVIDER) {
    return true;
  }

  return imports.get(obj)?.localName === DATA_SOURCE_ADAPTER_PROVIDER;
}

// ─── Inline Controllers/Views/Extenders Parsing ─────────────────────────────

function parseInlineControllerViews(
  objLiteral: ts.ObjectLiteralExpression,
  sf: ts.SourceFile,
  parsedFile: ParsedFile,
): Record<string, ControllerViewRef> {
  const result: Record<string, ControllerViewRef> = {};

  for (const prop of objLiteral.properties) {
    if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const regName = prop.name && ts.isIdentifier(prop.name) ? prop.name.text : '';
    if (!regName) {
      // eslint-disable-next-line no-continue
      continue;
    }

    let className = '';
    let isImportedFromGridCore = false;
    let isDefinedLocally = false;
    let baseClass = '';
    let mixins: string[] = [];

    if (ts.isShorthandPropertyAssignment(prop)) {
      className = regName;
    } else {
      className = getNodeText(prop.initializer, sf);
    }

    const imp = parsedFile.imports.get(className);
    if (imp) {
      isImportedFromGridCore = imp.isFromGridCore;
    }

    const classInfo = parsedFile.classes.get(className);
    if (classInfo) {
      isDefinedLocally = true;
      baseClass = classInfo.baseClass;
      mixins = classInfo.mixins;
    }

    result[regName] = {
      regName,
      className,
      isImportedFromGridCore,
      isDefinedLocally,
      baseClass,
      mixins,
      sourceFile: parsedFile.relPath,
    };
  }

  return result;
}

function extractExtenderName(node: ts.Expression, sf: ts.SourceFile): string {
  // Simple identifier: `data`, `GroupingDataControllerExtender`
  if (ts.isIdentifier(node)) {
    return node.text;
  }

  // Property access: `editingModule.extenders.controllers.data`
  if (ts.isPropertyAccessExpression(node)) {
    return getNodeText(node, sf);
  }

  // Arrow function: `(Base) => class FooExtender extends Base { ... }`
  if (ts.isArrowFunction(node)) {
    let { body } = node;
    if (ts.isParenthesizedExpression(body)) {
      body = body.expression;
    }
    if (ts.isClassExpression(body) && body.name) {
      return body.name.text;
    }
    // Try to extract class name from body text
    const text = getNodeText(node, sf);
    const classMatch = /class\s+(\w+)/.exec(text);
    if (classMatch) {
      return classMatch[1];
    }
    return '(inline)';
  }

  // Fallback: use text but truncate if too long
  const text = getNodeText(node, sf);
  if (text.length > 60) {
    const classMatch = /class\s+(\w+)/.exec(text);
    if (classMatch) {
      return classMatch[1];
    }
    return '(inline)';
  }
  return text;
}

function parseInlineExtenders(
  objLiteral: ts.ObjectLiteralExpression,
  sf: ts.SourceFile,
  parsedFile: ParsedFile,
): { controllers: Record<string, ExtenderRef>; views: Record<string, ExtenderRef> } {
  const result = {
    controllers: {} as Record<string, ExtenderRef>,
    views: {} as Record<string, ExtenderRef>,
  };

  for (const prop of objLiteral.properties) {
    if (!ts.isPropertyAssignment(prop)) {
      // eslint-disable-next-line no-continue
      continue;
    }
    const sectionName = prop.name && ts.isIdentifier(prop.name) ? prop.name.text : '';
    if (sectionName !== 'controllers' && sectionName !== 'views') {
      // eslint-disable-next-line no-continue
      continue;
    }

    const initExpr = prop.initializer;
    // Handle spread: { ...editingModule.extenders.controllers, data }
    if (ts.isObjectLiteralExpression(initExpr)) {
      for (const innerProp of initExpr.properties) {
        if (ts.isSpreadAssignment(innerProp)) {
          // eslint-disable-next-line no-continue
          continue;
        }

        let targetName = '';
        let extenderName = '';
        let isImportedFromGridCore = false;
        let isDefinedLocally = false;

        if (ts.isPropertyAssignment(innerProp)) {
          targetName = innerProp.name && ts.isIdentifier(innerProp.name) ? innerProp.name.text : '';
          extenderName = extractExtenderName(innerProp.initializer, sf);
        } else if (ts.isShorthandPropertyAssignment(innerProp)) {
          targetName = innerProp.name.text;
          extenderName = targetName;
        } else {
          // eslint-disable-next-line no-continue
          continue;
        }

        const imp = parsedFile.imports.get(extenderName);
        if (imp) {
          isImportedFromGridCore = imp.isFromGridCore;
        }
        if (parsedFile.localVars.has(extenderName) || parsedFile.classes.has(extenderName)) {
          isDefinedLocally = true;
        }

        result[sectionName][targetName] = {
          targetName,
          extenderName,
          isImportedFromGridCore,
          isDefinedLocally,
        };
      }
    }
  }

  return result;
}

// ─── registerModule Argument Parser ──────────────────────────────────────────

function parseRegisterModuleCall(
  moduleName: string,
  arg: ts.Expression,
  sf: ts.SourceFile,
  parsedFile: ParsedFile,
): RegisterModuleCall {
  const { relPath } = parsedFile;
  const reg: RegisterModuleCall = {
    moduleName,
    sourceFile: relPath,
    relPath,
    argIsIdentifier: false,
    argIdentifierName: null,
    spreadSources: [],
    hasInlineControllers: false,
    hasInlineViews: false,
    hasInlineExtenders: false,
    hasDefaultOptions: false,
    referencesGridCoreModule: false,
    gridCoreRefs: [],
    controllers: {},
    views: {},
    extenders: { controllers: {}, views: {} },
    forwardedControllersRef: null,
    forwardedViewsRef: null,
  };

  if (ts.isIdentifier(arg)) {
    reg.argIsIdentifier = true;
    reg.argIdentifierName = arg.text;
    const imp = parsedFile.imports.get(arg.text);
    if (imp?.isFromGridCore) {
      reg.referencesGridCoreModule = true;
      reg.gridCoreRefs.push(arg.text);
    }
    return reg;
  }

  if (!ts.isObjectLiteralExpression(arg)) return reg;

  for (const prop of arg.properties) {
    if (ts.isSpreadAssignment(prop)) {
      const spreadText = getNodeText(prop.expression, sf);
      const baseIdent = spreadText.split('.')[0];
      reg.spreadSources.push(baseIdent);
      const imp = parsedFile.imports.get(baseIdent);
      if (imp?.isFromGridCore) {
        reg.referencesGridCoreModule = true;
        if (!reg.gridCoreRefs.includes(baseIdent)) {
          reg.gridCoreRefs.push(baseIdent);
        }
      }
      // eslint-disable-next-line no-continue
      continue;
    }

    if (
      !ts.isPropertyAssignment(prop)
      && !ts.isMethodDeclaration(prop)
      && !ts.isShorthandPropertyAssignment(prop)
    ) {
      // eslint-disable-next-line no-continue
      continue;
    }

    const propName = prop.name && ts.isIdentifier(prop.name)
      ? prop.name.text : '';

    if (propName === 'defaultOptions') {
      reg.hasDefaultOptions = true;
      if (ts.isPropertyAssignment(prop)) {
        const initText = getNodeText(prop.initializer, sf);
        for (const [name, imp] of parsedFile.imports) {
          if (imp.isFromGridCore && initText.includes(name)) {
            reg.referencesGridCoreModule = true;
            if (!reg.gridCoreRefs.includes(name)) {
              reg.gridCoreRefs.push(name);
            }
          }
        }
      }
    }

    if (propName === 'controllers'
      && ts.isPropertyAssignment(prop)) {
      if (ts.isObjectLiteralExpression(prop.initializer)) {
        reg.hasInlineControllers = true;
        reg.controllers = parseInlineControllerViews(prop.initializer, sf, parsedFile);
        for (const ref of Object.values(reg.controllers)) {
          if (ref.isImportedFromGridCore) {
            reg.referencesGridCoreModule = true;
            if (!reg.gridCoreRefs.includes(ref.className)) {
              reg.gridCoreRefs.push(ref.className);
            }
          }
        }
      } else {
        const refText = getNodeText(prop.initializer, sf);
        const baseIdent = refText.split('.')[0];
        const imp = parsedFile.imports.get(baseIdent);
        if (imp?.isFromGridCore) {
          reg.referencesGridCoreModule = true;
          reg.forwardedControllersRef = baseIdent;
          if (!reg.gridCoreRefs.includes(baseIdent)) {
            reg.gridCoreRefs.push(baseIdent);
          }
        }
      }
    }

    if (propName === 'views'
      && ts.isPropertyAssignment(prop)) {
      if (ts.isObjectLiteralExpression(prop.initializer)) {
        reg.hasInlineViews = true;
        reg.views = parseInlineControllerViews(prop.initializer, sf, parsedFile);
        for (const ref of Object.values(reg.views)) {
          if (ref.isImportedFromGridCore) {
            reg.referencesGridCoreModule = true;
            if (!reg.gridCoreRefs.includes(ref.className)) {
              reg.gridCoreRefs.push(ref.className);
            }
          }
        }
      } else {
        const refText = getNodeText(prop.initializer, sf);
        const baseIdent = refText.split('.')[0];
        const imp = parsedFile.imports.get(baseIdent);
        if (imp?.isFromGridCore) {
          reg.referencesGridCoreModule = true;
          reg.forwardedViewsRef = baseIdent;
          if (!reg.gridCoreRefs.includes(baseIdent)) {
            reg.gridCoreRefs.push(baseIdent);
          }
        }
      }
    }

    if (propName === 'extenders'
      && ts.isPropertyAssignment(prop)) {
      if (ts.isObjectLiteralExpression(prop.initializer)) {
        reg.hasInlineExtenders = true;
        reg.extenders = parseInlineExtenders(prop.initializer, sf, parsedFile);
        const allExts = [
          ...Object.values(reg.extenders.controllers),
          ...Object.values(reg.extenders.views),
        ];
        for (const ext of allExts) {
          if (ext.isImportedFromGridCore) {
            reg.referencesGridCoreModule = true;
            if (!reg.gridCoreRefs.includes(ext.extenderName)) {
              reg.gridCoreRefs.push(ext.extenderName);
            }
          }
        }
      } else {
        const refText = getNodeText(prop.initializer, sf);
        const baseIdent = refText.split('.')[0];
        const imp = parsedFile.imports.get(baseIdent);
        if (imp?.isFromGridCore) {
          reg.referencesGridCoreModule = true;
          if (!reg.gridCoreRefs.includes(baseIdent)) {
            reg.gridCoreRefs.push(baseIdent);
          }
        }
      }
    }
  }

  return reg;
}

// ─── Main File Parser ────────────────────────────────────────────────────────

export function parseDataGridFile(filePath: string): ParsedFile {
  const relPath = getRelativePath(filePath, DATA_GRID_ROOT);
  const content = fs.readFileSync(filePath, 'utf-8');
  const sf = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true);

  const parsedFile: ParsedFile = {
    filePath,
    relPath,
    registerModuleCalls: [],
    dataSourceAdapterExtensions: [],
    classes: new Map(),
    imports: new Map(),
    localVars: new Map(),
  };

  // ── Pass 1: Collect imports ──
  collectImportSpecs(sf).forEach((spec) => {
    parsedFile.imports.set(spec.localName, {
      localName: spec.localName,
      originalName: spec.originalName,
      fromPath: spec.fromPath,
      isFromGridCore: isGridCoreImport(spec.fromPath),
    });
  });

  // ── Pass 2: Collect classes and local variables ──
  function collectClassesAndVars(node: ts.Node): void {
    // Class declarations
    if (ts.isClassDeclaration(node) && node.name) {
      const heritage = getClassHeritage(node, sf, parsedFile.localVars);
      parsedFile.classes.set(node.name.text, {
        className: node.name.text,
        baseClass: heritage.baseClass,
        mixins: heritage.mixins,
        sourceFile: relPath,
        isExported: hasExportModifier(node),
      });
    }

    // Variable declarations with class expressions or arrow functions
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (!decl.initializer || !ts.isIdentifier(decl.name)) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const varName = decl.name.text;
        const init = decl.initializer;

        // Arrow function: const data = (Base) => class extends ...
        if (ts.isArrowFunction(init)) {
          let { body } = init;
          if (ts.isParenthesizedExpression(body)) {
            body = body.expression;
          }
          if (ts.isClassExpression(body)) {
            const heritage = getClassHeritage(body, sf, parsedFile.localVars);
            const className = body.name?.text ?? varName;
            parsedFile.classes.set(varName, {
              className,
              baseClass: heritage.baseClass,
              mixins: heritage.mixins,
              sourceFile: relPath,
              isExported: hasExportModifier(node),
            });
          }
          // Store raw text for resolution
          parsedFile.localVars.set(varName, getNodeText(init, sf));
        }

        // Class expression: const Foo = class extends Bar {}
        if (ts.isClassExpression(init)) {
          const heritage = getClassHeritage(init, sf, parsedFile.localVars);
          parsedFile.classes.set(varName, {
            className: init.name?.text ?? varName,
            baseClass: heritage.baseClass,
            mixins: heritage.mixins,
            sourceFile: relPath,
            isExported: hasExportModifier(node),
          });
        }

        // Call expression (mixin): const Foo = SomeMixin(Base)
        if (ts.isCallExpression(init)) {
          parsedFile.localVars.set(varName, getNodeText(init, sf));
        }

        // Simple identifier or property access
        if (ts.isIdentifier(init) || ts.isPropertyAccessExpression(init)) {
          parsedFile.localVars.set(varName, getNodeText(init, sf));
        }
      }
    }

    ts.forEachChild(node, collectClassesAndVars);
  }

  ts.forEachChild(sf, collectClassesAndVars);

  // ── Pass 3: Find registerModule calls and DataSourceAdapter extensions ──
  function findCalls(node: ts.Node): void {
    if (isRegisterModuleCall(node, sf)) {
      const call = node;
      if (call.arguments.length >= 2) {
        const moduleNameArg = call.arguments[0];
        if (ts.isStringLiteral(moduleNameArg)) {
          const reg = parseRegisterModuleCall(
            moduleNameArg.text,
            call.arguments[1],
            sf,
            parsedFile,
          );
          parsedFile.registerModuleCalls.push(reg);
        }
      }
    }

    if (isDataSourceAdapterExtendCall(node, sf, parsedFile.imports)) {
      if (node.arguments.length >= 1) {
        const extenderArg = node.arguments[0];
        const extenderName = getNodeText(extenderArg, sf);
        const imp = parsedFile.imports.get(extenderName);
        parsedFile.dataSourceAdapterExtensions.push({
          sourceFile: relPath,
          relPath,
          extenderName,
          isImportedFromGridCore: imp?.isFromGridCore ?? false,
          order: 0,
        });
      }
    }

    ts.forEachChild(node, findCalls);
  }

  ts.forEachChild(sf, findCalls);

  return parsedFile;
}

// ─── Module Order Parser ─────────────────────────────────────────────────────

export function parseModulesOrder(): string[] {
  const content = fs.readFileSync(WIDGET_BASE_FILE, 'utf-8');
  const sf = ts.createSourceFile(WIDGET_BASE_FILE, content, ts.ScriptTarget.Latest, true);

  const order: string[] = [];
  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && node.expression.name.text === 'registerModulesOrder'
      && node.arguments.length > 0
      && ts.isArrayLiteralExpression(node.arguments[0])
    ) {
      for (const elem of node.arguments[0].elements) {
        if (ts.isStringLiteral(elem)) {
          order.push(elem.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  ts.forEachChild(sf, visit);
  return order;
}
