import path from 'path';

export default class MetadataGenerator {
  metadata: Array<MetaItem> = [];

  static capitalize(key: string): string {
    return key.charAt(0).toUpperCase() + key.slice(1);
  }

  clean(): void {
    this.metadata = [];
  }

  getMetadata(): Array<MetaItem> {
    return this.metadata;
  }

  static executor(str: string, regex: RegExp, handler: Function): void {
    let matches = regex.exec(str);
    while (matches !== null) {
      handler(matches);
      matches = regex.exec(str);
    }
  }

  static parseComments(comments: string): MetaItem {
    const metaItem: MetaItem = {};

    MetadataGenerator.executor(comments, /\$(type|name|typeValues)\s(.+)/g, (matches: RegExpMatchArray) => {
      const key = MetadataGenerator.capitalize(matches[1]);
      metaItem[key] = matches[2].trim();
    });

    return metaItem;
  }

  static getMetaItems(scss: string): Array<MetaItem> {
    const metaItems: Array<MetaItem> = [];

    MetadataGenerator.executor(scss, /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-$a-z_0-9]+):/gim, (matches: RegExpMatchArray) => {
      const key = matches[2];

      if (metaItems.some((item) => item.Key === key)) return;

      const metaItem = {
        Key: key,
      };

      metaItems.push(Object.assign(metaItem, MetadataGenerator.parseComments(matches[1])));
    });

    return metaItems;
  }

  static normalizePath(scssDir: string, filePath: string): string {
    return path.relative(scssDir, filePath)
      .replace(/\\/g, '/')
      .replace(/\.scss/, '')
      .replace('_', '')
      .replace(/^/, 'tb/');
  }

  static getMapFromMeta(metaItems: Array<MetaItem>, filePath: string): string {
    let result = `\n"path": "${filePath}",\n`;
    result += metaItems.map((item) => `"${item.Key}": ${item.Key},\n`).join('');
    return `(${result})`;
  }

  static isBundleFile(fileName: string): boolean {
    return /bundles/.test(fileName);
  }

  static getBundleContent(content: string): string {
    return content.replace(/(..\/widgets\/(material|generic))/, '$1/tb_index');
  }

  collectMetadata(scssDir: string, filePath: string, content: string): string {
    const normalizedPath = MetadataGenerator.normalizePath(scssDir, filePath);
    const metaItems = MetadataGenerator.getMetaItems(content);
    let modifiedContent = content;

    if (MetadataGenerator.isBundleFile(filePath)) {
      modifiedContent = MetadataGenerator.getBundleContent(content);
    } else if (metaItems.length) {
      metaItems.forEach((item, index) => {
        metaItems[index].Path = normalizedPath;
        this.metadata.push(item);
      });

      const imports = `@forward "${normalizedPath}";\n@use "${normalizedPath}" as *;\n`;
      const collector = `$never-used: collector(${MetadataGenerator.getMapFromMeta(metaItems, normalizedPath)});\n`;

      modifiedContent = imports + content + collector;
    }

    return modifiedContent;
  }
}
