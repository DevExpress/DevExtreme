export default class MetadataGenerator {
  metadata: ThemesMetadata = {
    generic: [],
    material: [],
  };

  static capitalize(key: string): string {
    return key
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join('');
  }

  static executor(str: string, regex: RegExp, handler: (matches: RegExpExecArray) => void): void {
    let matches = regex.exec(str);
    while (matches !== null) {
      handler(matches);
      matches = regex.exec(str);
    }
  }

  static parseComments(comments: string): MetaItem {
    const metaItem: MetaItem = {};

    MetadataGenerator.executor(comments, /\$(type|name|type-values)\s(.+)/g, (matches: RegExpMatchArray) => {
      const key = MetadataGenerator.capitalize(matches[1]);
      metaItem[key] = matches[2].trim();
    });

    return metaItem;
  }

  static getMetaItems(scss: string): MetaItem[] {
    const metaItems: MetaItem[] = [];

    MetadataGenerator.executor(scss, /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-$a-z_0-9]+):(.*?);/gim, (matches: RegExpMatchArray) => {
      const key = matches[2];
      const value = matches[3];

      if (metaItems.some((item) => item.Key === key)) {
        throw new Error(`${key} has duplicated comment`);
      }

      if (!value.endsWith('!default')) {
        throw new Error(`${key} value has no '!default' flag`);
      }

      const metaItem = {
        Key: key,
      };

      metaItems.push(Object.assign(metaItem, MetadataGenerator.parseComments(matches[1])));
    });

    return metaItems;
  }

  static getOverrideVariables(metaItems: MetaItem[]): string {
    const result = metaItems.map((item) => `${item.Key}: getCustomVar(("${item.Key}")) !default;`).join('\n');
    return `${result}\n\n`;
  }

  static getMapFromMeta(metaItems: MetaItem[]): string {
    const result = metaItems.map((item) => `"${item.Key}": ${item.Key},\n`).join('');
    return `(\n${result})`;
  }

  static isBundleFile(fileName: string): boolean {
    return fileName.includes('bundles');
  }

  static getBundleContent(content: string): string {
    return content.replace(/(..\/widgets\/(material|generic))"/, '$1/tb_index"');
  }

  clean(): void {
    this.metadata = {
      generic: [],
      material: [],
    };
  }

  getMetadata(): ThemesMetadata {
    return this.metadata;
  }

  fillMetaData(item: MetaItem, filePath: string): void {
    const target = filePath.includes('generic')
      ? this.metadata.generic
      : this.metadata.material;

    target.push(item);
  }

  collectMetadata(filePath: string, content: string): string {
    if (MetadataGenerator.isBundleFile(filePath)) {
      return MetadataGenerator.getBundleContent(content);
    }

    let modifiedContent = content;

    const metaItems = MetadataGenerator.getMetaItems(content);
    if (!metaItems.length) {
      return modifiedContent;
    }

    metaItems.forEach((item) => {
      this.fillMetaData(item, filePath);
    });

    const overeideVariables = MetadataGenerator.getOverrideVariables(metaItems);
    modifiedContent = overeideVariables + modifiedContent;

    return modifiedContent;
  }
}
