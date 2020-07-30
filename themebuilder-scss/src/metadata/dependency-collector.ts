/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

import { readFileSync, existsSync } from 'fs';
import cabinet from 'filing-cabinet';
import precinct from 'precinct';
import WidgetsHandler from '../modules/widgets-handler';

const stylesRegex = /\sSTYLE (.*)/;

export default class DependencyCollector {
  flatStylesDependencyTree: FlatStylesDependencies = {};

  scriptsCache: ScriptsDependencyCache = {};

  themes = ['generic', 'material'];

  static getWidgetFromAst(ast: SyntaxTree): string {
    if (ast.comments?.length) {
      const styleComment = ast.comments
        .find((comment: AstComment): boolean => comment.value.indexOf('STYLE') >= 0);

      if (styleComment) {
        return stylesRegex.exec(styleComment.value)[1].toLowerCase();
      }
    }

    return '';
  }

  static getUniqueWidgets(widgetsArray: string[], currentWidget?: string): string[] {
    const fullArray = currentWidget ? [...widgetsArray, currentWidget] : widgetsArray;

    return [...new Set(fullArray)];
  }

  treeProcessor(node: ScriptsDependencyTree): string[] {
    let result: string[] = [];
    const { widget, dependencies } = node;

    if (this.flatStylesDependencyTree[widget] !== undefined) {
      const cachedWidgets = this.flatStylesDependencyTree[widget];
      return DependencyCollector.getUniqueWidgets(cachedWidgets, widget);
    }

    Object.values(dependencies).forEach((nextNode) => {
      result.push(...this.treeProcessor(nextNode));
    });

    result = DependencyCollector.getUniqueWidgets(result);

    if (widget) {
      this.flatStylesDependencyTree[widget] = [...result];
      if (!result.includes(widget)) {
        result.push(widget);
      }
    }

    return result;
  }

  getFullDependencyTree(filePath: string): ScriptsDependencyTree {
    let cacheItem = this.scriptsCache[filePath];

    if (cacheItem === undefined) {
      const deps = precinct.paperwork(filePath, {
        es6: { mixedImports: true },
      })
        .map((relativeDependency: string): string => cabinet({
          partial: relativeDependency,
          directory: '../js',
          filename: filePath,
          ast: precinct.ast,
        }))
        .filter((path: string): boolean => path !== null
          && existsSync(path)
          && !path.includes('node_modules')
          && !path.includes('viz'));

      cacheItem = {
        widget: DependencyCollector.getWidgetFromAst(precinct.ast),
        dependencies: {},
      };

      deps.forEach((absolutePath: string) => {
        cacheItem.dependencies[absolutePath] = this.getFullDependencyTree(absolutePath);
      });

      this.scriptsCache[filePath] = cacheItem;
    }

    return cacheItem;
  }

  static isArraysEqual(array1: string[], array2: string[]): boolean {
    return array1.length === array2.length
    && array1.every((value, index) => value === array2[index]);
  }

  validate(): void {
    this.themes.forEach((theme) => {
      const indexFileName = `../scss/widgets/${theme}/_index.scss`;
      const indexContent = readFileSync(indexFileName, 'utf8');
      const indexPublicWidgetsList = (new WidgetsHandler([], '', {}))
        .getIndexWidgetItems(indexContent)
        .map((item: WidgetItem): string => item.widgetName.toLowerCase())
        .sort();

      const dependenciesWidgets = Object.keys(this.flatStylesDependencyTree).sort();

      if (!DependencyCollector.isArraysEqual(indexPublicWidgetsList, dependenciesWidgets)) {
        console.log('SCSS index', indexPublicWidgetsList, 'STYLE comment', dependenciesWidgets);
        throw new Error(`Some public widgets (${theme}) has no // STYLE comment in source code or private widget has one`);
      }
    });
  }

  collect(): void {
    const fullDependencyTree = this.getFullDependencyTree('../js/bundles/dx.all.js');
    this.treeProcessor(fullDependencyTree);
    this.validate();
  }
}
