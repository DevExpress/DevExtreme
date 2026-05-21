export interface ModuleExportEntry {
  path: string;
  isWidget?: boolean;
  exportAs?: string;
}

export interface ModuleMetadata {
  name: string;
  isInternal?: boolean;
  exports?: Record<string, ModuleExportEntry>;
}

export function widgetNameByPath(widgetPath: string): string {
  if (widgetPath.startsWith('ui.dx') || widgetPath.startsWith('viz.dx')) {
    const parts = widgetPath.split('.');
    return parts.length === 2 ? parts[1] : '';
  }
  return '';
}

export function buildJqueryCheckContent(tsBundleFile: string, modules: ModuleMetadata[]): string {
  let content = `/// <reference path='${tsBundleFile}' />\n`;
  content += "import * as $ from 'jquery';";

  content += modules
    .map((moduleMeta) =>
      Object.keys(moduleMeta.exports || {})
        .map((name) => {
          if (moduleMeta.isInternal) {
            return '';
          }

          const exportEntry = moduleMeta.exports![name];
          if (!exportEntry.isWidget) {
            return '';
          }

          const globalPath = exportEntry.path;
          const widgetName = widgetNameByPath(globalPath);
          if (!widgetName) {
            return '';
          }

          return `$().${widgetName}();\n` + `<DevExpress.${globalPath}>$().${widgetName}('instance');\n`;
        })
        .join(''),
    )
    .join('\n');

  return content;
}

export function buildPublicModulesCheckContent(
  modules: ModuleMetadata[],
  packageDir: string,
): string {
  let content = "import $ from 'jquery';\n";

  content += modules
    .map((moduleMeta) => {
      const modulePath = `'./npm/${packageDir}/${moduleMeta.name}'`;
      if (!moduleMeta.exports) {
        return `import ${modulePath};`;
      }

      return Object.keys(moduleMeta.exports)
        .map((name) => {
          const exportEntry = moduleMeta.exports![name];
          const uniqueIdentifier = moduleMeta.name
            .replace(/\./g, '_')
            .split('/')
            .concat([name])
            .join('__');
          const importIdentifier =
            name === 'default' ? uniqueIdentifier : `{ ${name} as ${uniqueIdentifier} }`;
          const importStatement = `import ${importIdentifier} from ${modulePath};`;
          const widgetName = widgetNameByPath(exportEntry.path);

          if (exportEntry.isWidget && widgetName) {
            return `$('<div>').${widgetName}();\n${importStatement}`;
          }

          return importStatement;
        })
        .join('\n');
    })
    .join('\n');

  return content;
}
