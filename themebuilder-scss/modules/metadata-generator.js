
const path = require('path');

class MetadataGenerator {
    constructor() {
        this.metadata = [];
    }

    capitalize(key) {
        return key.charAt(0).toUpperCase() + key.slice(1);
    }

    clean() {
        this.metadata = [];
    }

    getMetadata() {
        return { 'metadata': this.metadata };
    }

    executor(str, regex, handler) {
        let matches;
        while((matches = regex.exec(str)) !== null) {
            handler(matches);
        }
    }

    parseComments(comments) {
        const metaItem = {};

        this.executor(comments, /\$(type|name|typeValues)\s(.+)/g, (matches) => {
            const key = this.capitalize(matches[1]);
            metaItem[key] = matches[2].trim();
        });

        return metaItem;
    }

    getMetaItems(scss) {
        const metaItems = [];

        this.executor(scss, /\/\*\*[\n\r]([\s\S]*?)\*\/\s*[\n\r]*([-$a-z_0-9]+):/gim, (matches) => {
            const key = matches[2];

            if(metaItems.some(item => item.Key === key)) return;

            const metaItem = {
                'Key': key
            };

            metaItems.push(Object.assign(metaItem, this.parseComments(matches[1])));
        });

        return metaItems;
    }

    normalizePath(cwd, filePath) {
        return path.relative(path.join(cwd, 'scss'), filePath)
            .replace(/\\/g, '/')
            .replace(/\.scss/, '')
            .replace('_', '')
            .replace(/^/, 'tb/');
    }

    getMapFromMeta(metaItems, path) {
        let result = `"path": "${path}",\n`;
        metaItems.forEach(item => {
            result += `"${item.Key}": ${item.Key},\n`;
        });
        return `(\n${result})`;
    }

    collectMetadata(cwd, filePath, content) {
        const path = this.normalizePath(cwd, filePath);
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

module.exports = MetadataGenerator;
