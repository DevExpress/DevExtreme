import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const SOURCE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const OUTPUT_EXTENSION = '.js';
const INDEX_FILE = 'index';
const SPECIFIED_EXTENSION = /\.(js|mjs|cjs|json)$/;

const ERROR_UNRESOLVED = (specifier: string, fileName: string) =>
  `Cannot make the import fully specified: '${specifier}' in ${fileName} does not resolve to a source file or folder index`;

function isRelative(specifier: string): boolean {
  return specifier.startsWith('./') || specifier.startsWith('../');
}

function fileExists(candidate: string): boolean {
  return fs.existsSync(candidate) && fs.statSync(candidate).isFile();
}

// './core/component' -> './core/component.js', './common' -> './common/index.js'
export function toFullySpecifiedSpecifier(specifier: string, importerFileName: string): string {
  if (!isRelative(specifier) || SPECIFIED_EXTENSION.test(specifier)) {
    return specifier;
  }

  const target = path.resolve(path.dirname(importerFileName), specifier);

  if (SOURCE_EXTENSIONS.some((extension) => fileExists(target + extension))) {
    return `${specifier}${OUTPUT_EXTENSION}`;
  }

  if (
    SOURCE_EXTENSIONS.some((extension) => fileExists(path.join(target, INDEX_FILE + extension)))
  ) {
    return `${specifier.replace(/\/$/, '')}/${INDEX_FILE}${OUTPUT_EXTENSION}`;
  }

  throw new Error(ERROR_UNRESOLVED(specifier, importerFileName));
}

// A tsconfig "paths" alias of a project source becomes a fully specified relative import:
// '@ts/helpers' -> './helpers.js', '@ts/utils' -> './utils/index.js'. The output mirrors the source
// tree, so the relative path between the sources is the path between the emitted files.
// The alias must be resolved first: the alias replacement (tsc-alias) runs on the emitted text and
// emits extensionless paths, and it does not recognize an alias with an extension added.
// Node10 resolution finds folder indexes whatever moduleResolution the project uses.
// A specifier that is not an alias of a project source, such as a package, stays as it is.
export function toFullySpecifiedAlias(
  specifier: string,
  importerFileName: string,
  compilerOptions: ts.CompilerOptions,
): string {
  if (isRelative(specifier) || SPECIFIED_EXTENSION.test(specifier)) {
    return specifier;
  }

  const { resolvedModule } = ts.resolveModuleName(
    specifier,
    importerFileName,
    { ...compilerOptions, moduleResolution: ts.ModuleResolutionKind.Node10 },
    ts.sys,
  );
  if (
    !resolvedModule
    || resolvedModule.isExternalLibraryImport
    || resolvedModule.extension === ts.Extension.Dts
  ) {
    return specifier;
  }

  const resolvedPath = resolvedModule.resolvedFileName.slice(0, -resolvedModule.extension.length);
  const relativePath = path
    .relative(path.dirname(importerFileName), resolvedPath)
    .split(path.sep)
    .join('/');
  const relativeSpecifier = relativePath.startsWith('.') ? relativePath : `./${relativePath}`;

  return `${relativeSpecifier}${OUTPUT_EXTENSION}`;
}

export interface FullySpecifiedImportsOptions {
  // Also rewrite tsconfig "paths" aliases of project sources, for builds with resolvePaths
  aliases?: boolean;
}

// Runs after TypeScript's own transforms, so type-only imports are already elided.
// Rewrites static imports, re-exports and dynamic import() calls with relative specifiers,
// which makes the ESM output loadable by Node and by bundlers in strict ESM mode.
export function createFullySpecifiedImportsTransformer(
  options: FullySpecifiedImportsOptions = {},
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => (sourceFile) => {
    const { factory } = context;
    const compilerOptions = context.getCompilerOptions();
    const rewrite = (literal: ts.StringLiteral): ts.StringLiteral => {
      const specifier =
        isRelative(literal.text) || !options.aliases
          ? toFullySpecifiedSpecifier(literal.text, sourceFile.fileName)
          : toFullySpecifiedAlias(literal.text, sourceFile.fileName, compilerOptions);
      if (specifier === literal.text) {
        return literal;
      }
      // Keep the quotes of the source; a synthesized literal (pos -1) has no source text
      const isSingleQuote = literal.pos >= 0 && literal.getText(sourceFile).startsWith("'");
      return factory.createStringLiteral(specifier, isSingleQuote);
    };

    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
        return factory.updateImportDeclaration(
          node,
          node.modifiers,
          node.importClause,
          rewrite(node.moduleSpecifier),
          node.attributes,
        );
      }

      if (
        ts.isExportDeclaration(node)
        && node.moduleSpecifier
        && ts.isStringLiteral(node.moduleSpecifier)
      ) {
        return factory.updateExportDeclaration(
          node,
          node.modifiers,
          node.isTypeOnly,
          node.exportClause,
          rewrite(node.moduleSpecifier),
          node.attributes,
        );
      }

      if (
        ts.isCallExpression(node)
        && node.expression.kind === ts.SyntaxKind.ImportKeyword
        && node.arguments.length > 0
        && ts.isStringLiteral(node.arguments[0])
      ) {
        const [specifier, ...rest] = node.arguments;
        return factory.updateCallExpression(node, node.expression, node.typeArguments, [
          rewrite(specifier as ts.StringLiteral),
          ...rest,
        ]);
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitEachChild(sourceFile, visitor, context);
  };
}
