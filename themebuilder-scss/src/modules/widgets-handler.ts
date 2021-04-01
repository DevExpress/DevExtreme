import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { WidgetItem, WidgetHandlerResult, FlatStylesDependencies } from '../types/types';

const widgetListComment = '// public widgets';

export default class WidgetsHandler {
  widgets: string[];

  indexPath: string;

  baseIndexContent: string;

  dependencies: FlatStylesDependencies;

  constructor(widgets: string[], bundlePath: string, dependencies: FlatStylesDependencies) {
    const theme = bundlePath.includes('material') ? 'material' : 'generic';
    this.dependencies = dependencies || {};
    this.widgets = widgets ? widgets.map((w) => w.toLowerCase()) : [];
    this.indexPath = join(dirname(bundlePath), '..', 'widgets', theme, '_index.scss');
  }

  getIndexWidgetItems(indexContent: string): WidgetItem[] {
    const widgetListIndex = indexContent.indexOf(widgetListComment);
    const widgetRegex = /@use "\.\/(\w+)";/g;
    const widgetsListString = indexContent.substr(widgetListIndex + widgetListComment.length);
    const result: WidgetItem[] = [];

    this.baseIndexContent = indexContent.substr(0, widgetListIndex);

    let match = widgetRegex.exec(widgetsListString);
    while (match !== null) {
      result.push({ widgetName: match[1].toLowerCase(), widgetImportString: match[0] });
      match = widgetRegex.exec(widgetsListString);
    }

    return result;
  }

  getWidgetsWithDependencies(): string[] {
    return this.widgets.reduce((fullWidgetsList, widget) => {
      const notUnique = [
        ...fullWidgetsList,
        widget,
        ...this.dependencies[widget] || [],
      ];

      return [...new Set(notUnique)];
    }, []);
  }

  getWidgetLists(allWidgets: WidgetItem[]): WidgetHandlerResult {
    const userWidgets = this.getWidgetsWithDependencies();
    const needWidgets = allWidgets.filter((w) => userWidgets.length === 0
      || userWidgets.includes(w.widgetName));
    const widgets = needWidgets.map((w) => w.widgetName);
    const widgetImports = needWidgets.map((w) => w.widgetImportString);
    const unusedWidgets = userWidgets.filter((w) => !widgets.includes(w));
    const indexContent = this.baseIndexContent + widgetImports.join('\n');

    return {
      widgets,
      unusedWidgets,
      indexContent,
    };
  }

  async getIndexContent(): Promise<WidgetHandlerResult> {
    try {
      const initialContent = (await fs.readFile(this.indexPath)).toString();
      const fullWidgetList = this.getIndexWidgetItems(initialContent);
      return this.getWidgetLists(fullWidgetList);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
