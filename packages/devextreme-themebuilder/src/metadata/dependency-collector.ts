/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

import * as path from 'path';
import { readFileSync, existsSync } from 'fs';
import cabinet from 'filing-cabinet';
import precinct from 'precinct';
import WidgetsHandler from '../modules/widgets-handler';

export const filePathMap = new Map();
const stylesRegex = /\sSTYLE (.*)/;
const busyCache = {
  widget: '',
  dependencies: {},
};

const REGEXP_IS_TSX_NOT_DTS = /^(?!.*\.d\.ts$).*\.tsx$/;
const REGEXP_IS_DTS = /\.d\.ts$/;

export default class DependencyCollector {
  flatStylesDependencyTree: FlatStylesDependencies = {};

/*  tsConfig = JSON.parse(
      readFileSync(path.resolve(__dirname, '../../../devextreme/js/__internal/tsconfig.json'), 'utf8')
          .replace(/\/\/[^\n]+/mg, '')
          .replace(/,\s*([}\]])/mg, '$1')
  );*/

  scriptsCache: ScriptsDependencyCache = {};

  themes = ['generic', 'material'];

  static getWidgetFromAst(ast: SyntaxTree): string {
    if (ast.comments?.length) {
      const styleComment = ast.comments
          .find((comment: AstComment): boolean => comment.value.includes('STYLE'));

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

  static isArraysEqual(array1: string[], array2: string[]): boolean {
    return array1.length === array2.length
        && array1.every((value, index) => value === array2[index]);
  }

  treeProcessor(node: ScriptsDependencyTree, cache: Map<string, any> = new Map() ): string[] {
    let result: string[] = [];
    const { widget, dependencies } = node;

    if (this.flatStylesDependencyTree[widget] !== undefined) {
      const cachedWidgets = this.flatStylesDependencyTree[widget];
      return DependencyCollector.getUniqueWidgets(cachedWidgets, widget);
    }

    Object.entries(dependencies).forEach(([path, nextNode]) => {
      const cached = cache.get(path);

      const procResult = cached || this.treeProcessor(nextNode, cache);

      result.push(...procResult);

      if(!cached) {
        cache.set(path, procResult)
      }
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

  getFullDependencyTree(filePath: string, cache: Map<string, any> = new Map()): ScriptsDependencyTree {
    let cacheScriptItem = this.scriptsCache[filePath];
    const isTsxFile = REGEXP_IS_TSX_NOT_DTS.test(filePath);
    const filePathInProcess = filePathMap.get(filePath);

    if (!filePathInProcess && cacheScriptItem === undefined) {
      filePathMap.set(filePath, busyCache);

      precinct.ast = [];
      const result = precinct.paperwork(filePath, {
        es6: { mixedImports: true },
        ts: { skipTypeImports : true }
      });

      const deps = result.map((relativeDependency: string): string => {
        const absDepPath = relativeDependency.startsWith('.')
            ? path.resolve(path.dirname(filePath), relativeDependency)
            : relativeDependency;

        const cachedRes = cache.get(absDepPath);
        if(cachedRes) {
          return cachedRes;
        }

        const cabinetResult = cabinet({
          partial: relativeDependency,
          directory: path.resolve(__dirname, '../../../devextreme/js'),
          filename: filePath,
          ast: precinct.ast,
          tsConfig: path.resolve(__dirname, '../../../devextreme/js/__internal/tsconfig.json'),
        });

        cache.set(absDepPath, cabinetResult);

        return cabinetResult;
      })
          // NOTE: Workaround for the filing-cabinet issue:
          // https://github.com/dependents/node-filing-cabinet/issues/112
          .map((path: string) => path.replace(REGEXP_IS_DTS, '.js'))
          .filter((path: string): boolean => path !== null
              && existsSync(path)
              && !path.includes('node_modules')
              && !path.includes('viz'));

      cacheScriptItem = {
        widget: isTsxFile
            ? ''
            : DependencyCollector.getWidgetFromAst(precinct.ast),
        dependencies: {},
      };

      deps.forEach((absolutePath: string) => {
        const node = this.getFullDependencyTree(absolutePath, cache);
        if (node) {
          cacheScriptItem.dependencies[absolutePath] = node;
        }
      });

      this.scriptsCache[filePath] = cacheScriptItem;
    }

    return cacheScriptItem;
  }

  validate(): void {
    this.themes.forEach((theme) => {
      const indexFileName = path.resolve(__dirname, `../../../devextreme-scss/scss/widgets/${theme}/_index.scss`);
      const indexContent = readFileSync(indexFileName, 'utf8');
      const indexPublicWidgetsList = new WidgetsHandler([], '', {})
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
    let START = Date.now();
    const fullDependencyTree = this.getFullDependencyTree(path.resolve(__dirname, '../../../devextreme/js/bundles/dx.all.js'));
    console.log('----TIME 1------>', (Date.now() - START) / 1000);
    START = Date.now();
    this.treeProcessor(fullDependencyTree);
    console.log('----TIME 2------>', (Date.now() - START) / 1000);
    this.validate();
  }
}
