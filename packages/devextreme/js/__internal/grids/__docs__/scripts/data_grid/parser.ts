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
  DataGridClassRef,
  DataGridParsedFile,
  ExtenderRef,
  GridCoreModuleInfo,
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
  const receiverText = getNodeText(expr.expression, sf);
  return REGISTER_MODULE_RECEIVERS.has(receiverText);
}

function collectSpreadSources(
  obj: ts.ObjectLiteralExpression,
  sf: ts.SourceFile,
): string[] {
  const sources: string[] = [];
  for (const prop of obj.properties) {
    if (ts.isSpreadAssignment(prop)) {
      sources.push(getNodeText(prop.expression, sf));
    }
  }
  return sources;
}

function parseInlineControllerViews(
  obj: ts.ObjectLiteralExpression,
  sf: ts.SourceFile,
  parsedFile: DataGridParsedFile,
): Record<string, DataGridClassRef> {
  const result: Record<string, DataGridClassRef> = {};
  for (const prop of obj.properties) {
    let regName = '';
    let classRef = '';

    if (ts.isPropertyAssignment(prop) && prop.name) {
      regName = ts.isIdentifier(prop.name) ? prop.name.text : getNodeText(prop.name, sf);
      classRef = getNodeText(prop.initializer, sf);
    } else if (ts.isShorthandPropertyAssignment(prop)) {
      regName = prop.name.text;
      classRef = prop.name.text;
    }

    if (regName) {
      const localClass = parsedFile.classes.get(classRef);
      const importInfo = parsedFile.imports.get(classRef);

      result[regName] = {
        regName,
        className: classRef,
        isImportedFromGridCore: importInfo?.isFromGridCore ?? false,
        isDefinedLocally: !!localClass,
        baseClass: localClass?.baseClass ?? '',
        mixins: localClass?.mixins ?? [],
        sourceFile: localClass?.sourceFile ?? parsedFile.relPath,
      };
    }
  }
  return result;
}

function parseInlineExtenders(
  obj: ts.ObjectLiteralExpression,
  sf: ts.SourceFile,
  parsedFile: DataGridParsedFile,
): { controllers: Record<string, ExtenderRef>; views: Record<string, ExtenderRef> } {
  const result = {
    controllers: {} as Record<string, ExtenderRef>,
    views: {} as Record<string, ExtenderRef>,
  };

  const processSection = (
    sectionName: 'controllers' | 'views',
    initializer: ts.ObjectLiteralExpression,
  ): void => {
    for (const extProp of initializer.properties) {
      if (!ts.isSpreadAssignment(extProp)) {
        let targetName = '';
        let extenderName = '';

        if (ts.isPropertyAssignment(extProp) && extProp.name) {
          targetName = ts.isIdentifier(extProp.name)
            ? extProp.name.text
            : getNodeText(extProp.name, sf);
          extenderName = getNodeText(extProp.initializer, sf);
        } else if (ts.isShorthandPropertyAssignment(extProp)) {
          targetName = extProp.name.text;
          extenderName = extProp.name.text;
        }

        if (targetName) {
          const importInfo = parsedFile.imports.get(extenderName);
          const isLocal = parsedFile.classes.has(extenderName)
            || parsedFile.localVars.has(extenderName);

          result[sectionName][targetName] = {
            targetName,
            extenderName,
            isImportedFromGridCore: importInfo?.isFromGridCore ?? false,
            isDefinedLocally: isLocal,
          };
        }
      }
    }
  };

  for (const prop of obj.properties) {
    if (
      !ts.isSpreadAssignment(prop)
      && ts.isPropertyAssignment(prop)
      && prop.name
      && ts.isIdentifier(prop.name)
    ) {
      const sectionName = prop.name.text;
      if (
        (sectionName === 'controllers' || sectionName === 'views')
        && ts.isObjectLiteralExpression(prop.initializer)
      ) {
        processSection(sectionName, prop.initializer);
      }
    }
  }

  return result;
}

function parseRegisterModuleCall(
  call: ts.CallExpression,
  sf: ts.SourceFile,
  parsedFile: DataGridParsedFile,
): RegisterModuleCall | null {
  if (call.arguments.length < 2) return null;

  const nameArg = call.arguments[0];
  if (!ts.isStringLiteral(nameArg)) return null;
  const moduleName = nameArg.text;

  const moduleArg = call.arguments[1];
  const reg: RegisterModuleCall = {
    moduleName,
    sourceFile: parsedFile.filePath,
    relPath: parsedFile.relPath,
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

  if (ts.isIdentifier(moduleArg)) {
    reg.argIsIdentifier = true;
    reg.argIdentifierName = moduleArg.text;
    const imp = parsedFile.imports.get(moduleArg.text);
    if (imp?.isFromGridCore) {
      reg.referencesGridCoreModule = true;
      reg.gridCoreRefs.push(moduleArg.text);
    }
    return reg;
  }

  if (ts.isObjectLiteralExpression(moduleArg)) {
    reg.spreadSources = collectSpreadSources(moduleArg, sf);

    // Check spreads for grid_core references
    for (const src of reg.spreadSources) {
      const imp = parsedFile.imports.get(src);
      if (imp?.isFromGridCore) {
        reg.referencesGridCoreModule = true;
        reg.gridCoreRefs.push(src);
      }
    }

    const processModuleProp = (
      prop: ts.ObjectLiteralElementLike,
    ): void => {
      if (ts.isSpreadAssignment(prop)) return;
      if (
        !ts.isPropertyAssignment(prop)
        && !ts.isMethodDeclaration(prop)
        && !ts.isShorthandPropertyAssignment(prop)
      ) {
        return;
      }

      const propName = prop.name && ts.isIdentifier(prop.name) ? prop.name.text : '';

      if (propName === 'defaultOptions') {
        reg.hasDefaultOptions = true;
        // Check if defaultOptions references a grid_core module
        if (ts.isPropertyAssignment(prop)) {
          const initText = getNodeText(prop.initializer, sf);
          for (const [name, imp] of parsedFile.imports) {
            if (imp.isFromGridCore && initText.includes(name)) {
              reg.referencesGridCoreModule = true;
              if (!reg.gridCoreRefs.includes(name)) reg.gridCoreRefs.push(name);
            }
          }
        }
      }

      if (propName === 'controllers' && ts.isPropertyAssignment(prop)) {
        if (ts.isObjectLiteralExpression(prop.initializer)) {
          reg.hasInlineControllers = true;
          reg.controllers = parseInlineControllerViews(prop.initializer, sf, parsedFile);
          // Check if inline controllers reference grid_core
          for (const ref of Object.values(reg.controllers)) {
            if (ref.isImportedFromGridCore) {
              reg.referencesGridCoreModule = true;
              if (!reg.gridCoreRefs.includes(ref.className)) reg.gridCoreRefs.push(ref.className);
            }
          }
        } else {
          // controllers: someModule.controllers — forwarded reference
          const refText = getNodeText(prop.initializer, sf);
          const baseIdent = refText.split('.')[0];
          const imp = parsedFile.imports.get(baseIdent);
          if (imp?.isFromGridCore) {
            reg.referencesGridCoreModule = true;
            if (!reg.gridCoreRefs.includes(baseIdent)) reg.gridCoreRefs.push(baseIdent);
          }
        }
      }

      if (propName === 'views' && ts.isPropertyAssignment(prop)) {
        if (ts.isObjectLiteralExpression(prop.initializer)) {
          reg.hasInlineViews = true;
          reg.views = parseInlineControllerViews(prop.initializer, sf, parsedFile);
          for (const ref of Object.values(reg.views)) {
            if (ref.isImportedFromGridCore) {
              reg.referencesGridCoreModule = true;
              if (!reg.gridCoreRefs.includes(ref.className)) reg.gridCoreRefs.push(ref.className);
            }
          }
        } else {
          const refText = getNodeText(prop.initializer, sf);
          const baseIdent = refText.split('.')[0];
          const imp = parsedFile.imports.get(baseIdent);
          if (imp?.isFromGridCore) {
            reg.referencesGridCoreModule = true;
            if (!reg.gridCoreRefs.includes(baseIdent)) reg.gridCoreRefs.push(baseIdent);
          }
        }
      }

      if (
        propName === 'extenders'
        && ts.isPropertyAssignment(prop)
        && ts.isObjectLiteralExpression(prop.initializer)
      ) {
        reg.hasInlineExtenders = true;
        reg.extenders = parseInlineExtenders(prop.initializer, sf, parsedFile);
        // Check if extenders reference grid_core
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
      }
    };

    for (const prop of moduleArg.properties) {
      processModuleProp(prop);
    }
  }

  return reg;
}

// ─── DataSourceAdapter Extension Detection ───────────────────────────────────

function isDataSourceAdapterExtendCall(
  node: ts.Node,
  sf: ts.SourceFile,
): node is ts.CallExpression {
  if (!ts.isCallExpression(node)) return false;
  const expr = node.expression;
  if (!ts.isPropertyAccessExpression(expr)) return false;
  if (expr.name.text !== 'extend') return false;
  const receiverText = getNodeText(expr.expression, sf);
  return receiverText === DATA_SOURCE_ADAPTER_PROVIDER;
}

// ─── Main Parse Function ─────────────────────────────────────────────────────

export function parseDataGridFile(filePath: string): DataGridParsedFile {
  const content = fs.readFileSync(filePath, 'utf-8');
  const sf = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const relPath = getRelativePath(filePath);
  const result: DataGridParsedFile = {
    filePath,
    relPath,
    registerModuleCalls: [],
    dataSourceAdapterExtensions: [],
    classes: new Map(),
    imports: new Map(),
    localVars: new Map(),
  };

  // 1. Collect imports
  ts.forEachChild(sf, (node) => {
    if (!ts.isImportDeclaration(node)) return;
    if (
      !node.importClause
      || !node.moduleSpecifier
      || !ts.isStringLiteral(node.moduleSpecifier)
    ) {
      return;
    }

    const fromPath = node.moduleSpecifier.text;
    const fromGridCore = isGridCoreImport(fromPath);
    const { namedBindings } = node.importClause;

    if (namedBindings && ts.isNamedImports(namedBindings)) {
      for (const spec of namedBindings.elements) {
        const localName = spec.name.text;
        const originalName = spec.propertyName ? spec.propertyName.text : localName;
        result.imports.set(localName, {
          localName,
          originalName,
          fromPath,
          isFromGridCore: fromGridCore,
        });
      }
    }

    if (node.importClause.name) {
      const localName = node.importClause.name.text;
      result.imports.set(localName, {
        localName,
        originalName: localName,
        fromPath,
        isFromGridCore: fromGridCore,
      });
    }
  });

  // 2. Collect local variables
  ts.forEachChild(sf, (node) => {
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          result.localVars.set(decl.name.text, getNodeText(decl.initializer, sf));
        }
      }
    }
  });

  // 3. Collect class declarations
  ts.forEachChild(sf, (node) => {
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text;
      const heritage = getClassHeritage(node, sf, result.localVars);
      result.classes.set(className, {
        className,
        baseClass: heritage.baseClass,
        mixins: heritage.mixins,
        sourceFile: relPath,
        isExported: hasExportModifier(node),
        isDefinedInDataGrid: true,
      });
    }

    // Also check for class expressions in variable declarations:
    // export const X = () => class extends Y {}
    if (ts.isVariableStatement(node)) {
      for (const decl of node.declarationList.declarations) {
        if (ts.isIdentifier(decl.name) && decl.initializer) {
          // Arrow function returning a class expression (mixin/extender pattern)
          if (ts.isArrowFunction(decl.initializer) && ts.isClassExpression(decl.initializer.body)) {
            const classExpr = decl.initializer.body;
            const heritage = getClassHeritage(classExpr, sf, result.localVars);
            const className = classExpr.name?.text ?? decl.name.text;
            result.classes.set(decl.name.text, {
              className,
              baseClass: heritage.baseClass,
              mixins: heritage.mixins,
              sourceFile: relPath,
              isExported: hasExportModifier(node),
              isDefinedInDataGrid: true,
            });
          }
        }
      }
    }
  });

  // 4. Collect registerModule calls and DataSourceAdapter extensions
  let dsaOrder = 0;
  function visitStatements(node: ts.Node): void {
    if (isRegisterModuleCall(node, sf)) {
      const reg = parseRegisterModuleCall(node, sf, result);
      if (reg) {
        result.registerModuleCalls.push(reg);
      }
    }

    if (isDataSourceAdapterExtendCall(node, sf)) {
      const arg = node.arguments[0];
      if (arg) {
        const extenderName = getNodeText(arg, sf);
        const importInfo = result.imports.get(extenderName);
        const order = dsaOrder;
        dsaOrder += 1;
        result.dataSourceAdapterExtensions.push({
          sourceFile: filePath,
          relPath,
          extenderName,
          isImportedFromGridCore: importInfo?.isFromGridCore ?? false,
          order,
        });
      }
    }

    ts.forEachChild(node, visitStatements);
  }

  ts.forEachChild(sf, visitStatements);

  return result;
}

// ─── Module Order Parsing ────────────────────────────────────────────────────

export function parseModulesOrder(): string[] {
  const content = fs.readFileSync(WIDGET_BASE_FILE, 'utf-8');
  const sf = ts.createSourceFile(
    WIDGET_BASE_FILE,
    content,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  const order: string[] = [];

  function visit(node: ts.Node): void {
    if (
      ts.isCallExpression(node)
      && ts.isPropertyAccessExpression(node.expression)
      && node.expression.name.text === 'registerModulesOrder'
      && node.arguments.length === 1
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

/**
 * Parse all grid_core source files and extract module definitions.
 * Returns a list of GridCoreModuleInfo — one per exported `*Module` constant.
 */
export function parseGridCoreModules(gridCoreRoot: string): GridCoreModuleInfo[] {
  const sourceFiles = discoverGridCoreFiles(gridCoreRoot);
  const results: GridCoreModuleInfo[] = [];

  // Derive featureArea from a path relative to gridCoreRoot
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
  };

  function featureAreaFromFile(filePath: string): string {
    const rel = path.relative(gridCoreRoot, filePath).replace(/\\/g, '/');
    const firstSegment = rel.split('/')[0];
    return CORE_DIR_FEATURE_MAP[firstSegment] ?? 'Other';
  }

  function relPathFromFile(filePath: string): string {
    return path.relative(gridCoreRoot, filePath).replace(/\\/g, '/');
  }

  for (const file of sourceFiles) {
    try {
      const parsed = parseGridCoreFile(file);
      const relPath = relPathFromFile(file);
      const area = featureAreaFromFile(file);

      for (const mod of parsed.modules) {
        const controllers: Record<string, {
          regName: string;
          className: string;
          baseClass: string;
          mixins: string[];
          sourceFile: string;
        }> = {};
        for (const [regName, ctrl] of Object.entries(mod.controllers)) {
          controllers[regName] = {
            regName,
            className: ctrl.className,
            baseClass: ctrl.baseClass,
            mixins: ctrl.mixins,
            sourceFile: ctrl.sourceFile,
          };
        }

        const views: Record<string, {
          regName: string;
          className: string;
          baseClass: string;
          mixins: string[];
          sourceFile: string;
        }> = {};
        for (const [regName, view] of Object.entries(mod.views)) {
          views[regName] = {
            regName,
            className: view.className,
            baseClass: view.baseClass,
            mixins: view.mixins,
            sourceFile: view.sourceFile,
          };
        }

        results.push({
          moduleName: mod.moduleName,
          registeredAs: guessRegisteredName(mod.moduleName),
          sourceFile: relPath,
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
