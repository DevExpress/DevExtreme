const path = require('path');

export class MetadataGenerator {
    metadata: Array<MetaItem> = [];

    capitalize(key: string): string {
        return key.charAt(0).toUpperCase() + key.slice(1);
    }

    clean(): void {
        this.metadata = [];
    }

    getMetadata(): Array<MetaItem> {
        return this.metadata;
    }

    executor(str: string, regex: RegExp, handler: Function) {
        let matches: RegExpMatchArray;
        while((matches = regex.exec(str)) !== null) {
            handler(matches);
        }
    }

    parseComments(comments: string): MetaItem {
        const metaItem: MetaItem = {};

        this.executor(comments, /\$(type|name|typeValues)\s(.+)/g, (matches: RegExpMatchArray) => {
            const key = this.capitalize(matches[1]);
            metaItem[key] = matches[2].trim();
        });

        return metaItem;
    }

    getMetaItems(scss: string): Array<MetaItem> {
        const metaItems: Array<MetaItem> = [];

        this.executor(scss, /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-$a-z_0-9]+):/gim, (matches: RegExpMatchArray) => {
            const key = matches[2];

            if(metaItems.some(item => item.Key === key)) return;

            const metaItem = {
                'Key': key
            };

            metaItems.push(Object.assign(metaItem, this.parseComments(matches[1])));
        });

        return metaItems;
    }

    normalizePath(scssDir: string, filePath: string): string {
        return path.relative(scssDir, filePath)
            .replace(/\\/g, '/')
            .replace(/\.scss/, '')
            .replace('_', '')
            .replace(/^/, 'tb/');
    }

    getMapFromMeta(metaItems: Array<MetaItem>, path: string): string {
        let result = `"path": "${path}",\n`;
        metaItems.forEach(item => {
            result += `"${item.Key}": ${item.Key},\n`;
        });
        return `(\n${result})`;
    }

    collectMetadata(scssDir: string, filePath: string, content: string): string {
        const path = this.normalizePath(scssDir, filePath);
        const metaItems = this.getMetaItems(content);

        if(metaItems.length) {
            metaItems.forEach(item => item.Path = path);
            Array.prototype.push.apply(this.metadata, metaItems);

            const imports = `@forward "${path}";\n@use "${path}" as *;\n`;
            const collector = `$never-used: collector(${this.getMapFromMeta(metaItems, path)});\n`;

            content = imports + content + collector;
        }

        return content;
    }
}
