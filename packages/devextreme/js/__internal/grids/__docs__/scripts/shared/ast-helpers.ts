// eslint-disable-next-line import/no-extraneous-dependencies
import ts from 'typescript';

import type { HeritageInfo } from './types';

export function getNodeText(node: ts.Node, sourceFile: ts.SourceFile): string {
  return node.getText(sourceFile).trim();
}

export function hasExportModifier(node: ts.Node): boolean {
  if (!ts.canHaveModifiers(node)) {
    return false;
  }

  const modifiers = ts.getModifiers(node);

  return modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword) ?? false;
}

export interface RawImportSpec {
  localName: string;
  originalName: string;
  fromPath: string;
  isDefault: boolean;
  isNamespace: boolean;
  isRenamed: boolean;
}

/**
 * Collect all import specifiers from a source file.
 * Returns a flat list of raw import specs that callers can map into their own structures.
 */
export function collectImportSpecs(sourceFile: ts.SourceFile): RawImportSpec[] {
  const specs: RawImportSpec[] = [];

  ts.forEachChild(sourceFile, (node) => {
    if (
      !ts.isImportDeclaration(node)
      || !node.moduleSpecifier
      || !ts.isStringLiteral(node.moduleSpecifier)
    ) {
      return;
    }

    const fromPath = node.moduleSpecifier.text;
    const { importClause } = node;

    if (!importClause) {
      return;
    }

    // Default import: import X from '...'
    if (importClause.name) {
      specs.push({
        localName: importClause.name.text,
        originalName: 'default',
        fromPath,
        isDefault: true,
        isNamespace: false,
        isRenamed: false,
      });
    }

    if (!importClause.namedBindings) {
      return;
    }

    // Named imports: import { X, Y as Z } from '...'
    if (ts.isNamedImports(importClause.namedBindings)) {
      importClause.namedBindings.elements.forEach((spec) => {
        const localName = spec.name.text;
        const originalName = spec.propertyName ? spec.propertyName.text : localName;
        specs.push({
          localName,
          originalName,
          fromPath,
          isDefault: false,
          isNamespace: false,
          isRenamed: !!spec.propertyName,
        });
      });
    } else if (ts.isNamespaceImport(importClause.namedBindings)) {
      // Namespace import: import * as X from '...'
      specs.push({
        localName: importClause.namedBindings.name.text,
        originalName: '*',
        fromPath,
        isDefault: false,
        isNamespace: true,
        isRenamed: false,
      });
    }
  });

  return specs;
}

// ─── Mixin-wrapper utilities ─────────────────────────────────────────────────

const MIXIN_CALL_RE = /^(\w+)\((.+)\)$/;

/** Decompose the outermost mixin call: "Mixin(Inner)" → { mixinName, inner } */
export function parseMixinCall(text: string): { mixinName: string; inner: string } | null {
  const match = MIXIN_CALL_RE.exec(text);
  return match ? { mixinName: match[1], inner: match[2] } : null;
}

/** Strip the outermost mixin wrapper: "Mixin(Base)" → "Base" */
export function stripOuterMixin(text: string): string {
  const parsed = parseMixinCall(text);
  return parsed ? parsed.inner : text;
}

/** Strip all mixin wrappers: "Mixin(Mixin2(Base))" → "Base" */
export function stripAllMixins(text: string): string {
  let current = text;
  let parsed = parseMixinCall(current);
  while (parsed) {
    current = parsed.inner;
    parsed = parseMixinCall(current);
  }
  return current;
}

/**
 * Parse a heritage string like "Mixin(Base)" or "Mixin(Mixin2(Base))".
 * Returns { baseClass, mixins }.
 */
export function parseHeritageString(text: string): HeritageInfo {
  const mixins: string[] = [];
  let current = text;

  let parsed = parseMixinCall(current);
  while (parsed) {
    mixins.push(parsed.mixinName);
    current = parsed.inner;
    parsed = parseMixinCall(current);
  }

  return {
    baseClass: mixins.length > 0 ? `${mixins[mixins.length - 1]}(${current})` : current,
    mixins,
  };
}

/**
 * Extract heritage (base class + mixins) from a class declaration/expression.
 * Resolves local variable aliases before parsing.
 */
export function getClassHeritage(
  node: ts.ClassDeclaration | ts.ClassExpression,
  sourceFile: ts.SourceFile,
  localVars: Map<string, string>,
): HeritageInfo {
  if (!node.heritageClauses) {
    return { baseClass: '', mixins: [] };
  }
  const extendsClause = node.heritageClauses.find(
    (clause) => clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types.length > 0,
  );
  if (extendsClause) {
    const text = getNodeText(extendsClause.types[0].expression, sourceFile);
    if (ts.isIdentifier(extendsClause.types[0].expression) && localVars.has(text)) {
      return parseHeritageString(localVars.get(text) ?? '');
    }
    return parseHeritageString(text);
  }
  return { baseClass: '', mixins: [] };
}
