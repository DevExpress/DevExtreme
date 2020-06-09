/* eslint import/no-extraneous-dependencies: 0 */
/* eslint no-console: 0 */

import dependencyTree, { DependencyObj } from 'dependency-tree';
import { readFileSync } from 'fs';

const stylesRegex = /\/\/ #STYLE (.*)/;

export default class DependencyCollector {
  fullDependencyTree: DependencyObj;

  stylesDependencyTree: StylesDependencyTree = {};

  flatStylesDependencyTree: FlatStylesDependencyTree = {};

  stylesCache: { [key: string]: string } = {};

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
      let widget = this.stylesCache[fileName];
      if (widget === undefined) {
        const content = this.readFile(fileName);
        const matches = stylesRegex.exec(content);
        widget = matches !== null ? matches[1] : null;
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

  collect(): void {
    this.fillFullDependencyTree();
    this.fillStylesDependencyTree();
    this.fillFlatStylesDependencyTree();
  }
}
