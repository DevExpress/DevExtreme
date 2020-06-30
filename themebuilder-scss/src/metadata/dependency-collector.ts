/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

import dependencyTree, { DependencyObj } from 'dependency-tree';
import { readFileSync } from 'fs';
import WidgetsHandler from '../modules/widgets-handler';

const stylesRegex = /\/\/\sSTYLE (.*)/;
const themes = ['generic', 'material'];

export default class DependencyCollector {
  fullDependencyTree: DependencyObj = {};

  stylesDependencyTree: StylesDependencyTree = {};

  flatStylesDependencyTree: FlatStylesDependencyTree = {};

  stylesCache: { [key: string]: string | null } = {};

  readFile: (path: string) => string = (path: string) => readFileSync(path, 'utf8');

  fillFullDependencyTree(): void {
    this.fullDependencyTree = dependencyTree({
      filename: '../js/bundles/dx.all.js',
      directory: '../js/',
      filter: (path) => path.indexOf('node_modules') === -1,
    });
  }

  treeProcessor(node: DependencyObj, parentStyleNode: StylesDependencyTree): void {
    Object.keys(node).forEach((fileName) => {
      let widget: string | null = this.stylesCache[fileName];
      if (widget === undefined) {
        const content = this.readFile(fileName);
        const matches = stylesRegex.exec(content);
        widget = matches !== null ? matches[1].toLowerCase() : null;
        this.stylesCache[fileName] = widget;
      }

      let styleNode = parentStyleNode;

      if (widget !== null) {
        styleNode[widget] = {};
        styleNode = styleNode[widget];
      }

      this.treeProcessor(node[fileName], styleNode);
    });
  }

  fillStylesDependencyTree(): void {
    this.treeProcessor(this.fullDependencyTree, this.stylesDependencyTree);
  }

  static getFlatDependencyArray(dependencyObject: StylesDependencyTree): Array<string> {
    const dependencyArray = Object.keys(dependencyObject).reduce((accumulator, current) => [
      ...accumulator,
      current,
      ...DependencyCollector.getFlatDependencyArray(dependencyObject[current]),
    ], []);


    return [...new Set(dependencyArray)];
  }

  fillFlatStylesDependencyTree(): void {
    Object.keys(this.stylesDependencyTree).forEach((style) => {
      this.flatStylesDependencyTree[style] = DependencyCollector
        .getFlatDependencyArray(this.stylesDependencyTree[style]);
    });
  }

  static isArraysEqual(array1: Array<string>, array2: Array<string>): boolean {
    return array1.length === array2.length
    && array1.every((value, index) => value === array2[index]);
  }

  validate(): void {
    themes.forEach((theme) => {
      const indexFileName = `../scss/widgets/${theme}/_index.scss`;
      const indexContent = this.readFile(indexFileName);
      const indexPublicWidgetsList = (new WidgetsHandler([], ''))
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
    this.fillFullDependencyTree();
    this.fillStylesDependencyTree();
    this.fillFlatStylesDependencyTree();
    this.validate();
  }
}
