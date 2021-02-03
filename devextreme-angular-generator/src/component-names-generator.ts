import fs = require('fs');
import path = require('path');

export default class ComponentNamesGenerator {
    private _encoding = 'utf8';

    private _config;

    constructor(config) {
        this._config = config;
    }

    prepareTagName(fileName: string) {
        return `    '${fileName.replace('.ts', '')}'`;
    }

    validateFileName(fileName: string) {
        return this._config.excludedFileNames.indexOf(fileName) < 0;
    }

    generate() {
        let directoryPath = this._config.componentFilesPath;
        let files = fs.readdirSync(directoryPath);
        let fileList = files
            .filter(fileName => !fs.lstatSync(path.join(directoryPath, fileName)).isFile() && this.validateFileName(fileName))
            .map(fileName => this.prepareTagName(fileName))
            .join(',\n');
        let resultContent = `export const componentNames = [\n${fileList}\n];\n`;
        fs.writeFileSync(this._config.outputFileName, resultContent, { encoding: this._encoding });
    }
};
