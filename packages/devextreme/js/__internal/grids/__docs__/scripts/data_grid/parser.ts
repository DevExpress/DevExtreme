/* eslint-disable spellcheck/spell-checker,max-depth */
import * as fs from 'fs';
import * as path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript';

import {
  discoverSourceFiles as discoverGridCoreFiles,
  parseFile as parseGridCoreFile,
} from '../grid_core/parser';
import {
  DATA_GRID_ROOT,
  DATA_SOURCE_ADAPTER_PROVIDER,
  EXCLUDED_DIRS,
  EXCLUDED_FILE_NAMES,
  GRID_CORE_IMPORT_PATTERNS,
  REGISTER_MODULE_RECEIVERS,
  WIDGET_BASE_FILE,
} from './constants';
import type {
  ControllerViewRef,
  ExtenderRef,
  GridCoreModuleInfo,
  ParsedFile,
  RegisterModuleCall,
} from './types';

// ─── File Discovery ──────────────────────────────────────────────────────────

export function discoverDataGridFiles(rootDir: string): string[] {
  const results: string[] = [];

  function walk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!EXCLUDED_DIRS.has(entry.name)) {
          walk(fullPath);
        }
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

export function getRelativePath(filePath: string): string {
  return path.relative(DATA_GRID_ROOT, filePath).replace(/\\/g, '/');
}

// ─── AST Helpers ─────────────────────────────────────────────────────────────

function getNodeText(node: ts.Node, sf: ts.SourceFile): string {
  return node.getText(sf).trim();
}

function isGridCoreImport(fromPath: string): boolean {
  return GRID_CORE_IMPORT_PATTERNS.some((p) => fromPath.includes(p));
}

function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) return false;
  const modifiers = ts.getModifiers(node);
  return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

function parseHeritageString(text: string): { baseClass: string; mixins: string[] } {
  const mixins: string[] = [];
  let current = text;
  while (true) {
    const match = /^(\w+)\((.+)\)$/.exec(current);
    if (match) {
      const [, mixinName, inner] = match;
      mixins.push(mixinName);
      current = inner;
    } else {
      break;
    }
  }
  return {
    baseClass: mixins.length > 0 ? `${mixins[mixins.length - 1]}(${current})` : current,
    mixins,
  };
}

function getClassHeritage(
  node: ts.ClassDeclaration | ts.ClassExpression,
  sf: ts.SourceFile,
  localVars: Map<string, string>,
): { baseClass: string; mixins: string[] } {
  if (!node.heritageClauses) return { baseClass: '', mixins: [] };
  for (const clause of node.heritageClauses) {
    if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length > 0) {
      const text = getNodeText(clause.types[0].expression, sf);
      if (ts.isIdentifier(clause.types[0].expression) && localVars.has(text)) {
        return parseHeritageString(localVars.get(text) ?? '');
      }
      return parseHeritageString(text);
    }
  }
  return { baseClass: '', mixins: [] };
}

// ─── registerModule Call Detection ───────────────────────────────────────────

function isRegisterModuleCall(node: ts.Node, sf: ts.SourceFile): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) return false;
  const expr = node.expression;
  if (!ts.isPropertyAccessExpression(expr)) return false;
  const methodName = expr.name.text;
  if (methodName !== 'registerModule') return false;

  const obj = getNodeText(expr.expression, sf);
  const baseObj = obj.split('.')[0];
  return REGISTER_MODULE_RECEIVERS.has(baseObj);
}

function isDataSourceAdapterExtendCall(
  node: ts.Node,
  sf: ts.SourceFile,
  imports: Map<string, { localName: string; fromPath: string; isFromGridCore: boolean }>,
): boolean {
  if (!ts.isCallExpression(node)) return false;
  const expr = node.expression;
  if (!ts.isPropertyAccessExpression(expr)) return false;
  if (expr.name.text !== 'extend') return false;

  const obj = getNodeText(expr.expression, sf);
  if (obj === DATA_SOURCE_ADAPTER_PROVIDER) return true;

  const imp = imports.get(obj);
  return imp?.localName === DATA_SOURCE_ADAPTER_PROVIDER;
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
          const spreadText = getNodeText(innerProp.expression, sf);
          const baseIdent = spreadText.split('.')[0];
          const imp = parsedFile.imports.get(baseIdent);
          if (imp?.isFromGridCore) {
            // Mark spread entries as grid_core
          }
          // eslint-disable-next-line no-continue
          continue;
        }

        let targetName = '';
        let extenderName = '';
        let isImportedFromGridCore = false;
        let isDefinedLocally = false;

        if (ts.isPropertyAssignment(innerProp)) {
          targetName = innerProp.name && ts.isIdentifier(innerProp.name) ? innerProp.name.text : '';
          extenderName = getNodeText(innerProp.initializer, sf);
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
    } else if (ts.isIdentifier(initExpr) || ts.isPropertyAccessExpression(initExpr)) {
      // extenders: { controllers: someModule.extenders.controllers }
      const text = getNodeText(initExpr, sf);
      const baseIdent = text.split('.')[0];
      const imp = parsedFile.imports.get(baseIdent);
      if (imp?.isFromGridCore) {
        // forwarded from grid_core — mark as imported
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
    sourceFile: parsedFile.filePath,
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
  const relPath = getRelativePath(filePath);
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
  for (const stmt of sf.statements) {
    if (
      ts.isImportDeclaration(stmt)
      && stmt.moduleSpecifier
      && ts.isStringLiteral(stmt.moduleSpecifier)
    ) {
      const fromPath = stmt.moduleSpecifier.text;
      const isFromGc = isGridCoreImport(fromPath);
      const { importClause } = stmt;

      if (importClause) {
        if (importClause.name) {
          parsedFile.imports.set(importClause.name.text, {
            localName: importClause.name.text,
            originalName: 'default',
            fromPath,
            isFromGridCore: isFromGc,
          });
        }
        if (importClause.namedBindings) {
          if (ts.isNamedImports(importClause.namedBindings)) {
            for (const spec of importClause.namedBindings.elements) {
              const localName = spec.name.text;
              const originalName = spec.propertyName ? spec.propertyName.text : localName;
              parsedFile.imports.set(localName, {
                localName,
                originalName,
                fromPath,
                isFromGridCore: isFromGc,
              });
            }
          } else if (ts.isNamespaceImport(importClause.namedBindings)) {
            parsedFile.imports.set(importClause.namedBindings.name.text, {
              localName: importClause.namedBindings.name.text,
              originalName: '*',
              fromPath,
              isFromGridCore: isFromGc,
            });
          }
        }
      }
    }
  }

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

  // ── Pass 3: Find registerModule calls and DSA extensions ──
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
      const call = node as ts.CallExpression;
      if (call.arguments.length >= 1) {
        const extenderArg = call.arguments[0];
        const extenderName = getNodeText(extenderArg, sf);
        const imp = parsedFile.imports.get(extenderName);
        parsedFile.dataSourceAdapterExtensions.push({
          sourceFile: filePath,
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

// ─── Grid Core Module Parsing ────────────────────────────────────────────────

const MODULE_SUFFIX = 'Module';

function guessRegisteredName(moduleName: string): string | null {
  if (moduleName.endsWith(MODULE_SUFFIX)) {
    return moduleName.slice(0, -MODULE_SUFFIX.length);
  }
  return null;
}

const CORE_DIR_FEATURE_MAP: Record<string, string> = {
  data_controller: 'Data',
  views: 'Core',
  editor_factory: 'Core',
  error_handling: 'Core',
  editing: 'Editing',
  validating: 'Editing',
  selection: 'Selection',
  filter: 'Filtering',
  header_filter: 'Filtering',
  search: 'Filtering',
  keyboard_navigation: 'Navigation',
  focus: 'Navigation',
  columns_controller: 'Columns Core',
  column_headers: 'Columns Core',
  header_panel: 'Columns Core',
  column_chooser: 'Column Management',
  column_fixing: 'Column Management',
  sticky_columns: 'Column Management',
  virtual_columns: 'Column Management',
  columns_resizing_reordering: 'Column Management',
  adaptivity: 'Column Management',
  virtual_scrolling: 'Scrolling',
  ai_column: 'AI',
  ai_prompt_editor: 'AI',
  data_source_adapter: 'Data',
  context_menu: 'Core',
  master_detail: 'Master Detail',
  pager: 'Paging',
  row_dragging: 'Row Dragging',
  sorting: 'Sorting',
  state_storing: 'State',
  toast: 'Core',
};

export function parseGridCoreModules(gridCoreRoot: string): GridCoreModuleInfo[] {
  const sourceFiles = discoverGridCoreFiles(gridCoreRoot);
  const results: GridCoreModuleInfo[] = [];

  for (const file of sourceFiles) {
    try {
      const parsed = parseGridCoreFile(file);
      const relFromRoot = path.relative(gridCoreRoot, file).replace(/\\/g, '/');
      const firstSegment = relFromRoot.split('/')[0];
      const area = CORE_DIR_FEATURE_MAP[firstSegment] ?? 'Other';

      for (const mod of parsed.modules) {
        const controllers: GridCoreModuleInfo['controllers'] = {};
        for (const [regName, ctrl] of Object.entries(mod.controllers)) {
          controllers[regName] = {
            regName,
            className: ctrl.className,
            baseClass: ctrl.baseClass,
            mixins: ctrl.mixins,
            sourceFile: relFromRoot,
          };
        }

        const views: GridCoreModuleInfo['views'] = {};
        for (const [regName, view] of Object.entries(mod.views)) {
          views[regName] = {
            regName,
            className: view.className,
            baseClass: view.baseClass,
            mixins: view.mixins,
            sourceFile: relFromRoot,
          };
        }

        results.push({
          moduleName: mod.moduleName,
          registeredAs: guessRegisteredName(mod.moduleName),
          sourceFile: relFromRoot,
          featureArea: area,
          controllers,
          views,
          extenders: mod.extenders,
          hasDefaultOptions: mod.hasDefaultOptions,
        });
      }
    } catch {
      // Skip files that fail to parse
    }
  }

  return results.sort((a, b) => a.moduleName.localeCompare(b.moduleName));
}
