import { promises as fs } from 'fs';
import { resolve, relative, join, dirname } from 'path';
import { MetadataGenerator } from './generator';

export class FileInfo {
    constructor(path: string, content: string) {
        this.path = path;
        this.content = content;
    }
    path: string;
    content: string;
}

export class MetadataCollector {
    generator = new MetadataGenerator();

    async *getFileList(dirName: string): AsyncGenerator<string> {
        const directories = await fs.readdir(dirName, { withFileTypes: true });
        for(const directory of directories) {
            const res = resolve(dirName, directory.name);
            if(directory.isDirectory()) {
                yield* this.getFileList(res);
            } else {
                yield res;
            }
        }
    }

    async *readFiles(dirName: string, handler: (content: string) => string): AsyncGenerator<FileInfo> {
        const iterator = this.getFileList(dirName);

        for await(const filePath of iterator) {
            const realtivePath = relative(dirName, filePath);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            let modifiedContent = this.generator.collectMetadata(dirName, filePath, fileContent);
            modifiedContent = handler(modifiedContent);
            yield new FileInfo(realtivePath, modifiedContent);
        }
    }

    async saveScssFiles(files: AsyncGenerator<FileInfo>, destination: string): Promise<void> {
        for await(const file of files) {
            const absolutePath = resolve(join(destination, file.path));
            const directory = dirname(absolutePath);
            await fs.mkdir(directory, { recursive: true });
            await fs.writeFile(absolutePath, file.content);
        }
    }

    async saveMetadata(filePath: string, version: string) {
        const absolutePath = resolve(filePath);
        const metadata = this.generator.getMetadata();
        let metaContent = 'export const metadata: Array<MetaItem> = ' + JSON.stringify(metadata) + ';\n';
        metaContent += `export const version: string = '${version}';\n`;
        await fs.mkdir(dirname(absolutePath), { recursive: true });
        await fs.writeFile(absolutePath, metaContent);
    }
}
